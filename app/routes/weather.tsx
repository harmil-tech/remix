import { Form, useActionData, useNavigation } from '@remix-run/react';
import { Suspense, lazy, useEffect, useRef, useState } from 'react';

const WeatherResult = lazy(() => import('../components/WeatherResult'));
const ErrorAlert = lazy(() => import('../components/ErrorAlert'));

import type { ActionData } from '~/types/weather';
export { action } from '~/actions/weather.server';

export default function Weather() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const formRef = useRef<HTMLFormElement | null>(null);

  // local state for FE validation
  const [cityError, setCityError] = useState<string | null>(null);

  const cityFieldError =
    actionData && 'fieldErrors' in actionData
      ? actionData.fieldErrors?.city
      : undefined;

  const hasError =
    actionData && 'error' in actionData ? actionData.error : undefined;
  const data = actionData && 'data' in actionData ? actionData.data : undefined;

  const latest = data?.timelines?.hourly?.[0];
  const temp = latest?.values?.temperature;
  const humidity = latest?.values?.humidity;

  // Clear the input filed after submitting it
  useEffect(() => {
    if (actionData && 'data' in actionData) {
      formRef.current?.reset();
      setCityError(null); // clear FE error after success
    }
  }, [actionData]);

  // Client-side validation before submission
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const city = form.city.value.trim();

    if (!city) {
      event.preventDefault(); // Stop submission
      setCityError('City name is required!');
    } else if (city.length < 3) {
      event.preventDefault();
      setCityError('City name must be at least 3 characters long!');
    } else {
      setCityError(null);
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <h1>Weather Data</h1>
      <p>Enter a city name to see the current forecast.</p>

      <Form
        ref={formRef}
        method="post"
        onSubmit={handleSubmit} // <-- add this
        noValidate
        style={{
          marginTop: '1rem',
          display: 'flex',
          gap: '0.5rem',
          alignItems: cityError || cityFieldError ? 'center' : 'flex-end',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: 480,
          }}
        >
          <label htmlFor="city" style={{ marginBottom: 4, fontWeight: 500 }}>
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            placeholder="e.g. London"
            aria-invalid={!!(cityFieldError || cityError)}
            aria-describedby={cityFieldError ? 'city-error' : undefined}
            disabled={isSubmitting}
            style={{
              padding: '0.6rem 0.8rem',
              borderRadius: 6,
              border:
                cityFieldError || cityError ? '2px solid #dc3545' : '1px solid #ccc',
              fontSize: '1rem',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
          />

          {/* Show frontend validation error */}
          {cityError && (
            <div
              id="city-error"
              role="alert"
              style={{ color: '#dc3545', marginTop: 6, fontSize: 14 }}
            >
              {cityError}
            </div>
          )}

          {/* Show server-side validation error */}
          {cityFieldError && (
            <div
              id="city-error"
              role="alert"
              style={{ color: '#dc3545', marginTop: 6, fontSize: 14 }}
            >
              {cityFieldError}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '0.65rem 1rem',
            backgroundColor: isSubmitting ? '#6c757d' : '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontWeight: 600,
          }}
        >
          {isSubmitting ? 'Fetching...' : 'Get Weather'}
        </button>
      </Form>

      {/* Error message from backend */}
      {hasError && (
        <Suspense fallback={<div style={{ marginTop: '1rem' }}>Loading error…</div>}>
          <ErrorAlert message={hasError} />
        </Suspense>
      )}

      {/* Weather result */}
      {data && latest && (
        <Suspense
          fallback={<div style={{ marginTop: '1rem' }}>Loading details…</div>}
        >
          <WeatherResult
            locationName={data.location?.name}
            temp={temp}
            humidity={humidity}
          />
        </Suspense>
      )}
    </div>
  );
}
