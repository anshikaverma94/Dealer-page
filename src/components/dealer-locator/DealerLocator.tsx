"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { dealers, type Dealer } from "@/lib/dealers";
import { PhoneIcon, WhatsappIcon } from "@/components/icons";
import CallLeadForm from "@/components/dealer-locator/CallLeadForm";
import { lookupPincode, type PincodeResult } from "@/lib/pincode";

const DealerMap = dynamic(() => import("@/components/dealer-locator/DealerMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-black/5 text-sm text-black/40">
      Loading map...
    </div>
  ),
});

type LocationState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "granted"; lat: number; lng: number }
  | { status: "denied" };

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export default function DealerLocator() {
  const [location, setLocation] = useState<LocationState>({ status: "idle" });
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [locationLabel, setLocationLabel] = useState("");
  const [callFormDealer, setCallFormDealer] = useState<Dealer | null>(null);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<"idle" | "loading" | "found" | "not-found">("idle");
  const [pincodeResult, setPincodeResult] = useState<PincodeResult | null>(null);
  // whether the current pincode came from "Use My Location" (auto) or the
  // user typing it in (manual) — a lookup miss is only worth an error
  // banner when the user typed it themselves; an auto-detected pincode
  // that the free postal API just doesn't have on file shouldn't show a
  // scary "not found" message when the city-based match already works.
  const [pincodeSource, setPincodeSource] = useState<"manual" | "auto">("manual");
  // once "Use My Location" succeeds, the dealer list should show every
  // dealer ordered by distance rather than being narrowed to the detected
  // city — that city/pincode auto-fill is only used for the info badge and
  // the call-lead form below. Typing a manual search takes back over.
  const [locationMode, setLocationMode] = useState(false);

  // look up city/area from the pincode typed in the UI via India Post's
  // public pincode API, then reuse the existing city-search filter with it
  useEffect(() => {
    const digits = pincode.trim();
    if (digits.length !== 6 || !/^\d{6}$/.test(digits)) {
      setPincodeStatus("idle");
      setPincodeResult(null);
      return;
    }

    let cancelled = false;
    setPincodeStatus("loading");
    const timer = setTimeout(() => {
      lookupPincode(digits)
        .then((result) => {
          if (cancelled) return;
          if (result) {
            setPincodeStatus("found");
            setPincodeResult(result);
            setQuery(result.district);
          } else {
            setPincodeStatus(pincodeSource === "manual" ? "not-found" : "idle");
            setPincodeResult(null);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setPincodeStatus(pincodeSource === "manual" ? "not-found" : "idle");
            setPincodeResult(null);
          }
        });
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [pincode, pincodeSource]);

  function requestLocation() {
    // clear whatever city/pincode search was in place so the freshly
    // detected location is all that's shown
    setQuery("");
    setPincode("");
    setPincodeStatus("idle");
    setPincodeResult(null);
    setPincodeSource("manual");
    setSelectedId(null);
    setLocationMode(true);

    if (!navigator.geolocation) {
      setLocation({ status: "denied" });
      return;
    }
    setLocation({ status: "pending" });
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ status: "granted", lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocation({ status: "denied" }),
      { timeout: 8000 },
    );
  }

  const userLat = location.status === "granted" ? location.lat : null;
  const userLng = location.status === "granted" ? location.lng : null;
  const userLocation = useMemo(
    () => (userLat !== null && userLng !== null ? { lat: userLat, lng: userLng } : null),
    [userLat, userLng],
  );

  // best-effort reverse geocode of the location captured via "Use My
  // Location", so the call-lead form can auto-fill a readable location
  // instead of raw coordinates. Falls back to coordinates if it fails.
  useEffect(() => {
    if (!userLocation) {
      setLocationLabel("");
      return;
    }
    let cancelled = false;
    setLocationLabel(`${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`);
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation.lat}&lon=${userLocation.lng}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const addr = data?.address;
        const label = [addr?.suburb || addr?.neighbourhood, addr?.city || addr?.town || addr?.state]
          .filter(Boolean)
          .join(", ");
        if (label) setLocationLabel(label);

        // auto-fill the city and pincode boxes from the detected location
        const cityName = addr?.city || addr?.town || addr?.county || addr?.state_district;
        if (cityName) setQuery(cityName);
        if (addr?.postcode) {
          setPincodeSource("auto");
          setPincode(addr.postcode.replace(/[^0-9]/g, ""));
        }
      })
      .catch(() => {
        // keep the coordinate fallback already set above
      });
    return () => {
      cancelled = true;
    };
  }, [userLocation]);

  // bidirectional + word-level match: a district like "Central Delhi" from
  // a pincode lookup should still match a dealer city of just "Delhi"
  function textMatches(value: string, q: string) {
    const v = value.toLowerCase();
    if (v.includes(q) || q.includes(v)) return true;
    return q.split(/\s+/).some((word) => word.length > 2 && v.includes(word));
  }

  const { filteredDealers, matchTier } = useMemo(() => {
    if (locationMode) {
      // Show every dealer, nearest-first (sorting happens below once
      // distances are computed) — the detected city/pincode is shown only
      // as an informational badge, not used to narrow this list.
      return { filteredDealers: dealers, matchTier: "all" as const };
    }

    if (pincodeResult) {
      const district = pincodeResult.district.trim().toLowerCase();
      const state = pincodeResult.state.trim().toLowerCase();
      const byDistrict = dealers.filter(
        (d) => textMatches(d.city, district) || textMatches(d.name, district),
      );
      if (byDistrict.length > 0) return { filteredDealers: byDistrict, matchTier: "district" as const };

      const byState = dealers.filter((d) => d.state.toLowerCase() === state);
      if (byState.length > 0) return { filteredDealers: byState, matchTier: "state" as const };

      return { filteredDealers: [], matchTier: "none" as const };
    }

    const q = query.trim().toLowerCase();
    if (!q) return { filteredDealers: dealers, matchTier: "none" as const };
    return {
      filteredDealers: dealers.filter((d) => textMatches(d.city, q) || textMatches(d.name, q)),
      matchTier: "none" as const,
    };
  }, [query, pincodeResult, locationMode]);

  const dealersWithDistance = useMemo(() => {
    const withDistance = filteredDealers.map((d) => ({
      ...d,
      distanceKm: userLocation ? haversineKm(userLocation, d) : null,
    }));

    if (userLocation) {
      withDistance.sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
    }
    return withDistance;
  }, [filteredDealers, userLocation]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="brand-gradient-text text-3xl font-extrabold sm:text-4xl">Dealer Locator</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-black/70 sm:text-base">
        Find your nearest Woscher dealer and reach out directly on WhatsApp.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={requestLocation}
          disabled={location.status === "pending"}
          className="brand-gradient shrink-0 rounded-[10px] px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white disabled:opacity-60"
        >
          {location.status === "pending" ? "Locating..." : "Use My Location"}
        </button>
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            // a manual city edit should take over from a previous pincode lookup
            setPincode("");
            setPincodeStatus("idle");
            setPincodeResult(null);
            setLocationMode(false);
          }}
          placeholder="Or search by city..."
          className="w-full rounded-[10px] border border-black/15 px-4 py-2.5 text-sm text-[#141718] outline-none focus:border-[var(--brand-teal)] sm:max-w-xs"
        />
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={pincode}
          onChange={(e) => {
            setPincodeSource("manual");
            setPincode(e.target.value.replace(/[^0-9]/g, ""));
            setLocationMode(false);
          }}
          placeholder="Or enter pincode..."
          className="w-full rounded-[10px] border border-black/15 px-4 py-2.5 text-sm text-[#141718] outline-none focus:border-[var(--brand-teal)] sm:max-w-[180px]"
        />
        {location.status === "denied" && (
          <span className="text-xs text-black/50">
            Location access denied — search by city instead.
          </span>
        )}
      </div>

      {pincodeStatus !== "idle" && (
        <p className="mt-2 text-xs">
          {pincodeStatus === "loading" && <span className="text-black/50">Looking up pincode...</span>}
          {pincodeStatus === "found" && pincodeResult && (
            <span className="font-medium text-[var(--brand-teal)]">
              📍 {pincodeResult.areaName}, {pincodeResult.district}, {pincodeResult.state}
              {matchTier === "all" && " — showing all dealers, nearest first"}
              {matchTier === "state" && ` — showing dealers across ${pincodeResult.state}`}
              {matchTier === "none" && filteredDealers.length === 0 && " — no dealers nearby yet"}
            </span>
          )}
          {pincodeStatus === "not-found" && (
            <span className="text-red-500">Couldn&apos;t find that pincode — try searching by city instead.</span>
          )}
        </p>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="isolate order-1 h-[320px] overflow-hidden rounded-2xl border border-black/10 sm:h-[420px] lg:order-2 lg:col-span-3 lg:h-[600px]">
          <DealerMap
            dealers={dealersWithDistance}
            selectedId={selectedId}
            userLocation={userLocation}
            onSelectDealer={setSelectedId}
          />
        </div>

        <div className="order-2 flex max-h-[600px] flex-col gap-3 overflow-y-auto lg:order-1 lg:col-span-2">
          {dealersWithDistance.length === 0 && (
            <p className="py-8 text-center text-sm text-black/40">No dealers found for that search.</p>
          )}
          {dealersWithDistance.map((dealer) => (
            <DealerCard
              key={dealer.id}
              dealer={dealer}
              distanceKm={dealer.distanceKm}
              active={dealer.id === selectedId}
              onSelect={() => setSelectedId(dealer.id)}
              onCall={() => setCallFormDealer(dealer)}
            />
          ))}
        </div>
      </div>

      <CallLeadForm
        dealer={callFormDealer}
        locationLabel={locationLabel}
        onClose={() => setCallFormDealer(null)}
      />
    </div>
  );
}

function DealerCard({
  dealer,
  distanceKm,
  active,
  onSelect,
  onCall,
}: {
  dealer: Dealer;
  distanceKm: number | null;
  active: boolean;
  onSelect: () => void;
  onCall: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
      className={`cursor-pointer rounded-2xl border px-5 py-4 text-left transition-colors ${
        active ? "border-[var(--brand-purple)] bg-[#7828ec0d]" : "border-black/10 hover:border-black/20"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[#141718]">{dealer.name}</h3>
          <p className="mt-1 text-xs leading-relaxed text-black/60">{dealer.address}</p>
          <p className="mt-1 text-xs font-medium text-black/50">
            {dealer.city}, {dealer.state}
          </p>
        </div>
        {distanceKm !== null && (
          <span className="shrink-0 whitespace-nowrap text-xs font-semibold text-[var(--brand-teal)]">
            {distanceKm < 1 ? "< 1 km" : `${distanceKm.toFixed(1)} km`}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCall();
          }}
          className="brand-gradient inline-flex flex-1 items-center justify-center gap-2 rounded-[10px] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white"
        >
          <PhoneIcon className="h-3.5 w-3.5" />
          Call
        </button>
        <a
          href={`https://wa.me/${dealer.phone.replace("+", "")}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-label="Contact on WhatsApp"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#25D366] text-white"
        >
          <WhatsappIcon className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
