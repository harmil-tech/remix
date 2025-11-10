# Remix Weather Example

This project adds a single route (`/weather`) that lets a user enter a city name and fetches current weather data from the OpenWeather API. Results show temperature, conditions, and basic details, with clear error states.

## Prerequisites

- Node.js 18+
- Open weather API

## Setup

1. Install dependencies:

```
npm install
```

2. Set your Open weather API key in the environment before starting the server. For example:

```bash
export OPENWEATHER_API_KEY=your_api_key_here
```

On Windows (PowerShell):

```powershell
$Env:OPENWEATHER_API_KEY="your_api_key_here"
```

3. Start the dev server:

```
npm run dev
```

4. Navigate to `http://localhost:3000/weather`

```
If you navigate to http://localhost:3000 then please click on weather which is present in navbar
In the new version, you will be automatically redirected to **[http://localhost:3000/weather](http://localhost:3000/weather)**. If you try to access any other invalid or miscellaneous URL, you will be redirected to a **404 page** that provides a suggestion to navigate back to **/weather**.
```

## Implementation Notes

- Route: `app/routes/weather.tsx`
  - Uses a Remix `Form` with a server-side `action` to validate input and fetch data.
  - Validation: ensures a non-empty city name; surfaces 404s and API errors.
  - Loading state while fetching; clear error messages on failures.
  - Server-side fetch to protect the API key; it is never exposed to the browser.
- Navbar updated in `app/root.tsx` to include a link to `/weather`.
