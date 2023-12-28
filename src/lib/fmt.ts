import type { Resume } from "./schema";
export const formatLocation = (location: NonNullable<Resume["basics"]["location"]>) => {
  const { address, postalCode, city, countryCode, region } = location;
  let s = "";
  s += address ? `${address}, ` : "";
  s += city ? `${city}, ` : "";
  s += region ? `${region}, ` : "";
  s += postalCode ? `${postalCode}, ` : "";
  s += countryCode ? `${countryCode}` : "";
  return s;
};

export const getInitials = (name: string) => {
  const names = name.split(" ");
  let initials = "";
  names.forEach((n) => {
    initials += n[0];
  });
  return initials;
};

export const yyyy = (date: string) => {
  if (date.localeCompare("present", undefined, { sensitivity: "accent" }) === 0)
    "Present";
  if (date.localeCompare("current", undefined, { sensitivity: "accent" }) === 0)
    "Present";
  return new Date(Date.parse(date)).getFullYear();
};

export const dateRange = (start?: string, end?: string) => {
  if (!start) {
    if (!end) return "";
    return yyyy(end);
  };
  if (!end) return yyyy(start) + " - Present";
  const s = yyyy(start);
  const e = yyyy(end);
  return `${s} - ${e}`;
};
