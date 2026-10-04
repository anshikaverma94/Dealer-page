export type PincodeResult = {
  areaName: string;
  district: string;
  state: string;
};

// India Post's public pincode API — no key required.
// https://api.postalpincode.in/pincode/<code>
export async function lookupPincode(pincode: string): Promise<PincodeResult | null> {
  const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
  if (!res.ok) return null;

  const data = await res.json();
  const first = Array.isArray(data) ? data[0] : null;
  const postOffice = first?.Status === "Success" ? first.PostOffice?.[0] : null;
  if (!postOffice) return null;

  return {
    areaName: postOffice.Name,
    district: postOffice.District,
    state: postOffice.State,
  };
}
