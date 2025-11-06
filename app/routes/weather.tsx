import { Form, useActionData, useNavigation } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";

type WeatherResponse = {
  location?: { name?: string };
  timelines?: {
    hourly?: Array<{
      time: string;
      values: {
        temperature?: number;
        humidity?: number;
        weatherCode?: number;
      };
    }>;
  };
};

type ActionData =
  | { error: string; fieldErrors?: { city?: string } }
  | { data: WeatherResponse };

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const rawCity = formData.get("city");

  if (typeof rawCity !== "string" || rawCity.trim().length === 0) {
    return { error: "Please enter a city name.", fieldErrors: { city: "City is required" } };
  }

  const city = rawCity.trim();
  const apiKey = process.env.TOMORROW_API; // Tomorrow.io API key

  try {
    // Step 1: Convert city -> lat/lon using Open-Meteo’s geocoding API
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`
    );
    const geoJson = await geoRes.json();
    if (!geoJson.results || geoJson.results.length === 0) {
      return { error: `City "${city}" not found. Try another.` };
    }

    const { latitude, longitude, name, country } = geoJson.results[0];

    // Step 2: Call Tomorrow.io Weather API
    const url = `https://api.tomorrow.io/v4/weather/forecast?location=${latitude},${longitude}&apikey=${apiKey}`;
    const res = await fetch(url);

    if (!res.ok) {
      return { error: `Weather service error (${res.status}). Please try again.` };
    }

    const json = (await res.json()) as WeatherResponse;

    // Attach readable name info
    json.location = { name: `${name}${country ? `, ${country}` : ""}` };

    return { data: json };
  } catch (err) {
    console.error(err);
    return { error: "Unable to fetch weather right now. Check your connection and try again." };
  }
};

export default function Weather() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const cityFieldError = actionData && "fieldErrors" in actionData ? actionData.fieldErrors?.city : undefined;
  const hasError = actionData && "error" in actionData ? actionData.error : undefined;
  const data = actionData && "data" in actionData ? actionData.data : undefined;

  const latest = data?.timelines?.hourly?.[0];
  const temp = latest?.values?.temperature;
  const humidity = latest?.values?.humidity;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Weather (Tomorrow.io)</h1>
      <p>Enter a city name to see the current forecast.</p>

      <Form method="post" style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }} noValidate>
        <div style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: 480 }}>
          <label htmlFor="city" style={{ marginBottom: 4, fontWeight: 500 }}>City</label>
          <input
            id="city"
            name="city"
            type="text"
            placeholder="e.g. London"
            aria-invalid={cityFieldError ? "true" : "false"}
            aria-describedby={cityFieldError ? "city-error" : undefined}
            style={{
              padding: "0.6rem 0.8rem",
              borderRadius: 6,
              border: cityFieldError ? "2px solid #dc3545" : "1px solid #ccc",
              fontSize: "1rem",
            }}
          />
          {cityFieldError && (
            <div id="city-error" role="alert" style={{ color: "#dc3545", marginTop: 6, fontSize: 14 }}>
              {cityFieldError}
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "0.65rem 1rem",
            backgroundColor: isSubmitting ? "#6c757d" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: isSubmitting ? "not-allowed" : "pointer",
            fontWeight: 600,
          }}
        >
          {isSubmitting ? "Fetching..." : "Get Weather"}
        </button>
      </Form>

      {hasError && (
        <div role="alert" style={{ marginTop: "1rem", padding: "1rem", background: "#fee", color: "#c33", border: "1px solid #fcc", borderRadius: 6 }}>
          {hasError}
        </div>
      )}

      {data && latest && (
        <div style={{ marginTop: "1.5rem", border: "1px solid #e5e7eb", borderRadius: 8, padding: "1rem", background: "#f9fafb", maxWidth: 520 }}>
          <h2 style={{ marginTop: 0 }}>{data.location?.name}</h2>
          <div style={{ fontSize: 32, fontWeight: 700 }}>
            {typeof temp === "number" ? `${Math.round(temp)}°C` : "N/A"}
          </div>
          {typeof humidity === "number" && (
            <div style={{ marginTop: 8, color: "#374151" }}>Humidity: {humidity}%</div>
          )}
        </div>
      )}
    </div>
  );
}
