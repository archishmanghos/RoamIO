/**
 * Affiliate deep-link builder for flights and hotels.
 * Generates pre-filled URLs for Skyscanner, Booking.com, and Google Flights.
 */

interface FlightParams {
  origin?: string;
  destination: string;
  date?: string; // YYYY-MM-DD
  nearestAirport?: string;
}

interface HotelParams {
  destination: string;
  checkin?: string;  // YYYY-MM-DD
  checkout?: string; // YYYY-MM-DD
  guests?: number;
}

const UTM_PARAMS = "utm_source=roamio&utm_medium=referral&utm_campaign=trip_plan";

/**
 * Build Skyscanner flight search URL.
 */
export function buildSkyscannerUrl({ origin, destination, nearestAirport, date }: FlightParams): string {
  const from = origin || "anywhere";
  const to = nearestAirport || encodeURIComponent(destination.toLowerCase().replace(/\s+/g, "-"));
  const dateSlug = date || "";
  const base = `https://www.skyscanner.net/transport/flights/${from}/${to}/${dateSlug}`;
  return `${base}?${UTM_PARAMS}`;
}

/**
 * Build Booking.com hotel search URL.
 */
export function buildBookingUrl({ destination, checkin, checkout, guests }: HotelParams): string {
  const params = new URLSearchParams({
    ss: destination,
    ...(checkin && { checkin }),
    ...(checkout && { checkout }),
    group_adults: String(guests || 2),
  });
  return `https://www.booking.com/searchresults.html?${params.toString()}&${UTM_PARAMS}`;
}

/**
 * Build Google Flights fallback URL.
 */
export function buildGoogleFlightsUrl(destination: string): string {
  const query = encodeURIComponent(`flights to ${destination}`);
  return `https://www.google.com/travel/flights?q=${query}&${UTM_PARAMS}`;
}

/**
 * Build all affiliate links for a destination.
 */
export function buildAffiliateLinks(params: {
  destination: string;
  origin?: string;
  startDate?: string;
  endDate?: string;
  guests?: number;
  nearestAirport?: string;
}) {
  return {
    skyscanner: buildSkyscannerUrl({
      origin: params.origin,
      destination: params.destination,
      date: params.startDate,
      nearestAirport: params.nearestAirport,
    }),
    booking: buildBookingUrl({
      destination: params.destination,
      checkin: params.startDate,
      checkout: params.endDate,
      guests: params.guests,
    }),
    googleFlights: buildGoogleFlightsUrl(params.destination),
  };
}
