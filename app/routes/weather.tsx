import { Form, useActionData, useNavigation } from "@remix-run/react";
import { Suspense, lazy, useEffect, useRef } from "react";

const WeatherResult = lazy(() => import("../components/WeatherResult"));
const ErrorAlert = lazy(() => import("../components/ErrorAlert"));

import type { ActionData } from "~/types/weather";
export { action } from "~/actions/weather.server";


export default function Weather() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const formRef = useRef<HTMLFormElement | null>(null);

  const cityFieldError = actionData && "fieldErrors" in actionData ? actionData.fieldErrors?.city : undefined;
  const hasError = actionData && "error" in actionData ? actionData.error : undefined;
  const data = actionData && "data" in actionData ? actionData.data : undefined;

  const latest = data?.timelines?.hourly?.[0];
  const temp = latest?.values?.temperature;
  const humidity = latest?.values?.humidity;

  // Clear the input filed after submitting it 
  useEffect(() => {
    if (actionData && "data" in actionData) {
      formRef.current?.reset();
    }
  }, [actionData]);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Weather Data</h1>
      <p>Enter a city name to see the current forecast.</p>

      <Form ref={formRef} method="post" style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", alignItems: "flex-end" }} noValidate>
        <div style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: 480 }}>
          <label htmlFor="city" style={{ marginBottom: 4, fontWeight: 500 }}>City</label>
          <input
            id="city"
            name="city"
            type="text"
            placeholder="e.g. London"
            aria-invalid={cityFieldError ? "true" : "false"}
            aria-describedby={cityFieldError ? "city-error" : undefined}
            disabled={isSubmitting}
            style={{
              padding: "0.6rem 0.8rem",
              borderRadius: 6,
              border: cityFieldError ? "2px solid #dc3545" : "1px solid #ccc",
              fontSize: "1rem",
              cursor: isSubmitting ? "not-allowed" : "pointer",
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

      {/* Create a separate module for handle error message */}
      {hasError && (
        <Suspense fallback={<div style={{ marginTop: "1rem" }}>Loading error…</div>}>
          <ErrorAlert message={hasError} />
        </Suspense>
      )}

      {/* Make separet component to display the result */}

      {data && latest && (
        <Suspense fallback={<div style={{ marginTop: "1rem" }}>Loading details…</div>}>
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
