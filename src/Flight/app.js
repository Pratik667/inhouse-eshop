const API_URL = "/api/flights/subscriptions";
const app = document.getElementById("app");
let timelineHistory = [];

const formatDate = (value) => new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(value));
const formatCheckedAt = (value) => new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata", timeZoneName: "short" }).format(new Date(value));
const formatTime = (value) => value.slice(-5);
const formatPrice = (value, currency) => new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
const duration = (minutes) => `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
const cityName = (airport) => airport?.name?.replace(/ International Airport| Airport/g, "") || airport?.id || "Unknown airport";

function getSubscriptions(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.subscriptions)) return payload.subscriptions;
  if (payload?.subscription) return [payload];
  return payload ? [payload] : [];
}

function render(subscription, history, selectedIndex = 0) {
  const response = subscription?.flightResponse || { best_flights: [], price_insights: {} };
  const best = response.best_flights || [];
  const other = response.other_flights || [];
  const flights = [...best, ...other];
  const first = flights[0]?.flights?.[0];
  if (!first) {
    app.innerHTML = '<div class="empty">No flight options were found for this subscription.</div>';
    return;
  }

  const currency = subscription.currency || response.search_parameters?.currency || "INR";
  const destination = first.arrival_airport;
  const origin = first.departure_airport;
  const currentPrice = subscription.currentPrice || response.price_insights?.lowest_price;
  const timeline = history.map((entry, index) => {
    const entryResponse = entry.flightResponse || {};
    const entryFlights = [...(entryResponse.best_flights || []), ...(entryResponse.other_flights || [])];
    const entryFlight = entryFlights[0]?.flights?.[0];
    const entryCurrency = entry.currency || entryResponse.search_parameters?.currency || "INR";
    const entryPrice = entry.currentPrice || entryResponse.price_insights?.lowest_price || entryFlights[0]?.price;
    return `<article class="timeline-entry ${index === selectedIndex ? "selected" : ""}" data-index="${index}" tabindex="0" role="button" aria-label="View flight details from ${entry.lastCheckedAt ? formatCheckedAt(entry.lastCheckedAt) : "this check"}"><div class="timeline-time">${entry.lastCheckedAt ? formatCheckedAt(entry.lastCheckedAt) : "Time unavailable"}<span>UTC converted to IST</span></div><div><div class="timeline-route">${entry.origin || entryFlight?.departure_airport?.id || "--"}<span>→</span>${entry.destination || entryFlight?.arrival_airport?.id || "--"}</div><div class="timeline-detail">${entryFlight ? `${entryFlight.airline} · ${entryFlight.flight_number} · ${entryFlights.length} options` : "No flight options recorded"}</div></div><div class="timeline-price">${entryPrice ? formatPrice(entryPrice, entryCurrency) : "Price unavailable"}</div></article>`;
  }).join("");
  const cards = flights.map((option, index) => {
    const flight = option.flights[0];
    const isBest = index < best.length;
    return `<article class="flight-card ${isBest && index === 0 ? "best" : ""}">
      ${isBest && index === 0 ? '<span class="best-tag">Lowest fare</span>' : ""}
      <div class="airline"><img src="${flight.airline_logo || ""}" alt=""> <span>${flight.airline}</span></div>
      <div class="times"><div><div class="time">${formatTime(flight.departure_airport.time)}</div><div class="meta">${flight.departure_airport.id}</div></div><div class="duration">${duration(option.total_duration)}<br>${option.layovers ? `${option.layovers.length} stop${option.layovers.length === 1 ? "" : "s"}` : "direct"}</div><div><div class="time">${formatTime(flight.arrival_airport.time)}</div><div class="meta">${flight.arrival_airport.id}</div></div></div>
      <div class="card-foot"><span>${flight.flight_number} · ${flight.travel_class || "Economy"}</span><span class="card-price">${formatPrice(option.price, currency)}</span></div>
      <div class="meta">${flight.airplane}${flight.overnight ? " · Arrives next day" : ""}</div>
    </article>`;
  }).join("");

  app.innerHTML = `<section class="hero"><div><p class="eyebrow">Your price watch</p><h1>Make room for the next adventure.</h1><p class="intro">A live snapshot of the best fares found for your subscribed route.</p></div><div class="price-panel"><div class="price-label">Selected price</div><div class="price">${formatPrice(currentPrice, currency)}</div><div class="price-note">${subscription.isActive === false ? "Subscription inactive" : "Subscription is active"}</div></div></section>
    <section class="route-card"><div class="route"><div><div class="airport-code">${subscription.origin || origin.id}</div><div class="airport-name">${cityName(origin)}</div></div><div class="route-line" aria-hidden="true"></div><div><div class="airport-code">${subscription.destination || destination.id}</div><div class="airport-name">${cityName(destination)}</div></div></div><div class="date">Departure · ${formatDate(subscription.departureDate || origin.time)}</div></section>
    <div class="section-heading"><h2>Price timeline</h2><span class="count">${history.length} checks · Tap one to inspect</span></div>
    <section class="timeline">${timeline}</section>
    <div class="section-heading"><h2>Available flights</h2><span class="count">${flights.length} options found</span></div>
    <section class="flight-grid">${cards}</section>
    <div class="notice"><strong>Price insight:</strong> this route is currently ${response.price_insights?.price_level || "being monitored"}. Typical fares range from ${response.price_insights?.typical_price_range ? formatPrice(response.price_insights.typical_price_range[0], currency) + " to " + formatPrice(response.price_insights.typical_price_range[1], currency) : "the latest available range"}. Last checked ${subscription.lastCheckedAt ? formatCheckedAt(subscription.lastCheckedAt) : "recently"}.</div>`;
}

function selectTimelineEntry(event) {
  const entry = event.target.closest(".timeline-entry");
  if (!entry) return;
  const selectedIndex = Number(entry.dataset.index);
  render(timelineHistory[selectedIndex], timelineHistory, selectedIndex);
  document.querySelector(".flight-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

app.addEventListener("click", selectTimelineEntry);
app.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  selectTimelineEntry(event);
  if (event.target.closest(".timeline-entry")) event.preventDefault();
});

fetch(API_URL)
  .then((response) => { if (!response.ok) throw new Error(`Request failed (${response.status})`); return response.json(); })
  .then((payload) => {
    timelineHistory = getSubscriptions(payload).filter((entry) => entry && entry.lastCheckedAt).sort((a, b) => new Date(b.lastCheckedAt) - new Date(a.lastCheckedAt));
    if (!timelineHistory.length) { app.innerHTML = '<div class="empty">No active flight subscriptions were found.</div>'; return; }
    render(timelineHistory[0], timelineHistory);
  })
  .catch((error) => { app.innerHTML = `<div class="error">Unable to load the flight subscription. ${error.message}. Please refresh and try again.</div>`; });