import type { ActionFunction } from "@remix-run/node";
import type { WeatherResponse } from "~/types/weather";

// Handling the weather data after submitting the form
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const rawCity = formData.get("city");

  if (typeof rawCity !== "string" || rawCity.trim().length === 0) {
    return { error: "Please enter a city name.", fieldErrors: { city: "City is required" } } as const;
  }

  const city = rawCity.trim();
  const apiKey = process.env.TOMORROW_API;

  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`
    );
    const geoJson = await geoRes.json();
    if (!geoJson.results || geoJson.results.length === 0) {
      return { error: `City "${city}" not found. Try another.` } as const;
    }

    const { latitude, longitude, name, country } = geoJson.results[0];

    const url = `https://api.tomorrow.io/v4/weather/forecast?location=${latitude},${longitude}&apikey=${apiKey}`;
    const res = await fetch(url);

    if (!res.ok) {
      return { error: `Weather service error (${res.status}). Please try again.` } as const;
    }

    const json = (await res.json()) as WeatherResponse;

    json.location = { name: `${name}${country ? `, ${country}` : ""}` };

    return { data: json } as const;
  } catch (err) {
    console.error(err);
    return { error: "Unable to fetch weather right now. Check your connection and try again." } as const;
  }
};
