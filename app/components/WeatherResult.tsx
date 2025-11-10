type Props = {
  locationName?: string;
  temp?: number;
  humidity?: number;
};

export default function WeatherResult({ locationName, temp, humidity }: Props) {
  return (
    <div
      style={{
        marginTop: '1.5rem',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: '1rem',
        background: '#f9fafb',
        maxWidth: 520,
      }}
    >
      <h2 style={{ marginTop: 0 }}>{locationName}</h2>
      <div style={{ fontSize: 32, fontWeight: 700 }}>
        {typeof temp === 'number' ? `${Math.round(temp)}°C` : 'N/A'}
      </div>
      {typeof humidity === 'number' && (
        <div style={{ marginTop: 8, color: '#374151' }}>Humidity: {humidity}%</div>
      )}
    </div>
  );
}
