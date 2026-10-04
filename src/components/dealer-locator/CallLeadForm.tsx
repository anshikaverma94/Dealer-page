"use client";

import { useEffect, useState } from "react";
import { CloseIcon } from "@/components/icons";
import type { Dealer } from "@/lib/dealers";

export default function CallLeadForm({
  dealer,
  locationLabel,
  onClose,
}: {
  dealer: Dealer | null;
  locationLabel: string;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState(locationLabel);

  // keep the location field in sync with the latest auto-detected value
  // whenever a new dealer's form is opened
  useEffect(() => {
    setLocation(locationLabel);
  }, [locationLabel, dealer]);

  if (!dealer) return null;

  function placeCall() {
    window.location.href = `tel:${dealer!.phone}`;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Lead-capture: name/phone/location would be sent to the dealer
    // database here once the backend from the scope addendum exists.
    placeCall();
  }

  function handleSkip() {
    // skip just means "don't bother filling in the form" — still place the call
    placeCall();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8 sm:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md shrink-0 rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-black/40 hover:text-black/70"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        <h2 className="brand-gradient-text text-xl font-extrabold sm:text-2xl">Before you call</h2>
        <p className="mt-1 text-sm text-black/60">
          {dealer.name} · {dealer.city}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="lead-name" className="mb-1.5 block text-sm font-medium text-[#141718]">
              Name
            </label>
            <input
              id="lead-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-black/20 px-3 py-2.5 text-sm outline-none focus:border-[var(--brand-teal)]"
            />
          </div>

          <div>
            <label htmlFor="lead-phone" className="mb-1.5 block text-sm font-medium text-[#141718]">
              Phone Number
            </label>
            <input
              id="lead-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-md border border-black/20 px-3 py-2.5 text-sm outline-none focus:border-[var(--brand-teal)]"
            />
          </div>

          <div>
            <label htmlFor="lead-location" className="mb-1.5 block text-sm font-medium text-[#141718]">
              Location
            </label>
            <input
              id="lead-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Detecting your location..."
              className="w-full rounded-md border border-black/20 px-3 py-2.5 text-sm outline-none focus:border-[var(--brand-teal)]"
            />
          </div>

          <button
            type="submit"
            className="brand-gradient w-full rounded-[10px] py-3 text-sm font-bold uppercase tracking-wide text-white"
          >
            Continue to Call
          </button>
        </form>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleSkip}
            className="text-xs text-black/40 underline decoration-black/20 underline-offset-2 hover:text-black/60"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
