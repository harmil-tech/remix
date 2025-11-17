import type { ActionFunction } from '@remix-run/node';
import type { OpenWeatherResponse, WeatherResponse } from '~/types/weather';

// Handling the weather data after submitting the form
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const rawCity = formData.get('city');

  if (typeof rawCity !== 'string' || rawCity.trim().length === 0) {
    return {
      error: 'Please enter a city name.',
      fieldErrors: { city: 'City is required' },
    } as const;
  }

  const city = rawCity.trim();
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    // Fetch weather data directly from OpenWeather
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric`;

    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404) {
        return { error: `City "${city}" not found. Try another.` } as const;
      }
      return {
        error: `Weather service error (${res.status}). Please try again.`,
      } as const;
    }

    const json = (await res.json()) as OpenWeatherResponse;

    // Normalize response to fit your existing structure
    const data: WeatherResponse = {
      location: { name: `${json.name}, ${json.sys?.country ?? ''}` },
      timelines: {
        hourly: [
          {
            time: new Date(json.dt * 1000).toISOString(),
            values: {
              temperature: json.main?.temp ?? 0,
              humidity: json.main?.humidity ?? 0,
              weatherCode: json.weather?.[0]?.id ?? 0,
              windSpeed: json.wind?.speed ?? 0, // <-- ADD THIS
              visibility: json.visibility ? json.visibility / 1000 : 0, // meters → km
            },
          },
        ],
      },
    };
    return { data } as const;
  } catch (err) {
    return {
      error:
        'Unable to fetch weather right now. Check your connection and try again.',
    } as const;
  }
};
