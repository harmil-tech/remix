# Remix Weather Example

This project adds a single route (`/weather`) that lets a user enter a city name and fetches current weather data from the OpenWeather API. Results show temperature, conditions, and basic details, with clear error states.

## Prerequisites
- Node.js 18+
- tomorrow io API

## Setup
1. Install dependencies:

```
npm install
```

2. Set your tomorrow API key in the environment before starting the server. For example:

```bash
export TOMORROW_API=your_api_key_here
```

On Windows (PowerShell):

```powershell
$Env:TOMORROW_API="your_api_key_here"
```

3. Start the dev server:

```
npm run dev
```

4. Navigate to `http://localhost:3000/weather`

```
If you navigate to http://localhost:3000 then please click on weather which is present in navbar

```

## Implementation Notes
- Route: `app/routes/weather.tsx`
  - Uses a Remix `Form` with a server-side `action` to validate input and fetch data.
  - Validation: ensures a non-empty city name; surfaces 404s and API errors.
  - Loading state while fetching; clear error messages on failures.
  - Server-side fetch to protect the API key; it is never exposed to the browser.
- Navbar updated in `app/root.tsx` to include a link to `/weather`.

