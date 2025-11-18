type Props = {
  locationName?: string;
  temp?: number;
  humidity?: number;
  windSpeed?: number;
  visibility?: number;
};

export default function WeatherResult({
  locationName,
  temp,
  humidity,
  windSpeed,
  visibility,
}: Props) {
  const tempDisplay = typeof temp === 'number' ? `${Math.round(temp)}°C` : 'N/A';
  return (
    <div className="parent-card">
      <section className="result-card">
        <div className="result-left">
          <h2>{locationName}</h2>
          <div className="condition">
            {/* Condition from API if available */}Partly Cloudy
          </div>
          {/* Optional feels like if available */}
          {/* <div className="feels">Feels like 4°C</div> */}
        </div>
        <div className="result-right">
          <svg
            className="icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M6.76 4.84l-1.8-1.79M1 12h3m8-11v3m7.24 1.84l1.8-1.79M12 20v3m7.24-4.84l1.8 1.79M20 12h3M4.22 18.36l-1.8 1.79"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
          </svg>
          <div className="temp">{tempDisplay}</div>
        </div>
      </section>

      <div className="metrics">
        <div className="metric">
          <div>💧</div>
          <div className="metric-label">Humidity</div>
          <div className="metric-value">
            {typeof humidity === 'number' ? `${humidity}%` : '—'}
          </div>
        </div>
        <div className="metric">
          <div>🌬️</div>
          <div className="metric-label">Wind Speed</div>
          <div className="metric-value">
            {typeof windSpeed === 'number' ? `${windSpeed} m/s` : '—'}
          </div>
        </div>
        <div className="metric">
          <div>👁️</div>
          <div className="metric-label">Visibility</div>
          <div className="metric-value">
            {typeof visibility === 'number' ? `${visibility} km` : '—'}
          </div>
        </div>
      </div>
    </div>
  );
}
