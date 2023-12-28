import type { Resume } from './schema'
export const formatLocation = (location: Resume['basics']['location']) => {
  const { address, postalCode, city, countryCode, region } = location;
  let s = "";
  s += address ? `${address}, ` : "";
  s += city ? `${city}, ` : "";
  s += region ? `${region}, ` : "";
  s += postalCode ? `${postalCode}, ` : "";
  s += countryCode ? `${countryCode}` : "";
  return s;
}

export const getInitials = (name: string) => {
  const names = name.split(" ");
  let initials = "";
  names.forEach((n) => {
    initials += n[0];
  });
  return initials;
}

export const yyyy = (date: string) => {
  return new Date(Date.parse(date)).getFullYear();
}