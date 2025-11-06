import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import Index from "./routes/_index";
import Weather from "./routes/weather";

// SVG string for meta title and for use in UI
const remixSvg =
  `<svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;"><rect width="32" height="32" rx="7" fill="#38bdf8"/><path d="M9 16c0-3.87 3.13-7 7-7h6a1 1 0 010 2h-6a5 5 0 00-5 5v2a5 5 0 005 5h2.5a1 1 0 010 2H17c-3.87 0-7-3.13-7-7z" fill="#fff"/><circle cx="22.5" cy="22.5" r="1.5" fill="#fff"/></svg>`;

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  // Add SVG in front of the title using Unicode object replacement (not technically possible for browser tab, but you could use emoji or similar for effect).
  // Title in <title> can't contain inline SVG, but for demonstration, let's add a 🔵 emoji to simulate an icon.
  // For actual SVG favicon in browser tab, it should be set as favicon, but sticking to prompt: "add with the title in meta"
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
  {
    rel: "icon",
    type: "image/svg+xml",
    href:
      "data:image/svg+xml," +
      encodeURIComponent(
        `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="#38bdf8"/><path d="M9 16c0-3.87 3.13-7 7-7h6a1 1 0 010 2h-6a5 5 0 00-5 5v2a5 5 0 005 5h2.5a1 1 0 010 2H17c-3.87 0-7-3.13-7-7z" fill="#fff"/><circle cx="22.5" cy="22.5" r="1.5" fill="#fff"/></svg>`
      ),
  },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <nav
          style={{
            borderBottom: "1px solid #e0e0e0",
            padding: "1rem 2rem",
            backgroundColor: "#f8f9fa",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "2rem", alignItems: "center" }}>
            <Link
              to="/"
              style={{
                textDecoration: "none",
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#333",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              {/* SVG logo next to title */}
              <span
                dangerouslySetInnerHTML={{ __html: remixSvg }}
                style={{ display: "inline-block", verticalAlign: "middle" }}
                aria-hidden="true"
              />
              <span style={{ verticalAlign: "middle" }}>Remix App</span>
            </Link>
            <div style={{ display: "flex", gap: "1.5rem", marginLeft: "auto" }}>
             
              <Link
                to="/weather"
                style={{ textDecoration: "none", color: "#555", fontWeight: "500" }}
              >
                Weather
              </Link>
            </div>
          </div>
        </nav>
        <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
