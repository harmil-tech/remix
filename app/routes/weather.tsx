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
    const windSpeed = latest?.values?.windSpeed;
    const visibility = latest?.values?.visibility;

    // Clear the input filed after submitting it
    useEffect(() => {
      if (actionData && 'data' in actionData) {
        formRef.current?.reset();
        setCityError(null); // clear FE error after success
      }
    }, [actionData]);

    useEffect(() => {
      if (hasError) {
        formRef.current?.reset();
        const input = formRef.current?.querySelector('input[name="city"]') as HTMLInputElement | null;
        input?.focus();
      }
    }, [hasError]);

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
      <div className="container">
        <header className="hero">
          <h1 className="hero-title">Weather Forecast</h1>
          <p className="hero-subtitle">Get real-time weather information for any city</p>
        </header>

        <section className="search-card">
          <label htmlFor="city" className="search-label">Search by City</label>
          <Form
            ref={formRef}
            method="post"
            onSubmit={handleSubmit} // <-- add this
            noValidate
            className="search-row"
          >
            <input
              id="city"
              name="city"
              type="text"
              placeholder="e.g. London"
              aria-invalid={!!(cityFieldError || cityError)}
              aria-describedby={cityFieldError ? 'city-error' : undefined}
              disabled={isSubmitting}
              className={`input ${cityFieldError || cityError ? 'error' : ''}`}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="button"
            >
              {isSubmitting ? 'Fetching...' : 'Get Weather'}
            </button>
          </Form>

          {/* Show frontend validation error */}
          {cityError && (
            <div id="city-error" role="alert" className="error-text">
              {cityError}
            </div>
          )}

          {/* Show server-side validation error */}
          {cityFieldError && (
            <div id="city-error" role="alert" className="error-text">
              {cityFieldError}
            </div>
          )}
        </section>

        {/* Error message from backend */}
        {hasError && (
          <Suspense fallback={<div className="mt-4">Loading error…</div>}>
            <ErrorAlert message={hasError} />
          </Suspense>
        )}

        {/* Weather result */}
        {data && latest && (
          <Suspense fallback={<div className="mt-4">Loading details…</div>}>
            <WeatherResult
              locationName={data.location?.name}
              temp={temp}
              humidity={humidity}
              windSpeed={windSpeed}
              visibility={visibility}
            />
          </Suspense>
        )}
      </div>
    );
  }
