import type { LinksFunction, MetaFunction } from '@remix-run/node';
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from '@remix-run/react';
import styles from './styles.css';

const remixSvg = `<svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;"><rect width="32" height="32" rx="7" fill="#38bdf8"/><path d="M9 16c0-3.87 3.13-7 7-7h6a1 1 0 010 2h-6a5 5 0 00-5 5v2a5 5 0 005 5h2.5a1 1 0 010 2H17c-3.87 0-7-3.13-7-7z" fill="#fff"/><circle cx="22.5" cy="22.5" r="1.5" fill="#fff"/></svg>`;

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
});

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  {
    rel: 'icon',
    type: 'image/svg+xml',
    href:
      'data:image/svg+xml,' +
      encodeURIComponent(
        `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="#38bdf8"/><path d="M9 16c0-3.87 3.13-7 7-7h6a1 1 0 010 2h-6a5 5 0 00-5 5v2a5 5 0 005 5h2.5a1 1 0 010 2H17c-3.87 0-7-3.13-7-7z" fill="#fff"/><circle cx="22.5" cy="22.5" r="1.5" fill="#fff"/></svg>`
      ),
  },
];

function Header() {
  return (
    <nav
      style={{
        borderBottom: '1px solid #e0e0e0',
        padding: '1rem 2rem',
        backgroundColor: '#f8f9fa',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          gap: '2rem',
          alignItems: 'center',
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <span
            dangerouslySetInnerHTML={{ __html: remixSvg }}
            style={{ display: 'inline-block', verticalAlign: 'middle' }}
            aria-hidden="true"
          />
          <span style={{ verticalAlign: 'middle' }}>Remix App</span>
        </Link>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const isNotFound = caught.status === 404;

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <title>
          {isNotFound ? 'Page not found' : `${caught.status} ${caught.statusText}`}
        </title>
      </head>
      <body>
        <Header />

        <main style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              {isNotFound
                ? '404 - Page not found'
                : `${caught.status} ${caught.statusText}`}
            </h1>
            <p style={{ color: '#555', marginBottom: '1.5rem' }}>
              {isNotFound
                ? 'The page you’re looking for doesn’t exist or has moved.'
                : (caught.data ?? 'Something went wrong.')}
            </p>
            <Link
              to="/weather"
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.25rem',
                backgroundColor: '#007bff',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: 8,
                fontWeight: 600,
              }}
            >
              Go to Weather
            </Link>
          </div>
        </main>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <title>Unexpected error</title>
      </head>
      <body>
        <Header />
        <main
          style={{
            maxWidth: 800,
            margin: '0 auto',
            padding: '3rem 2rem',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#555', marginBottom: '1.5rem' }}>{error.message}</p>
          <Link
            to="/weather"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.25rem',
              backgroundColor: '#007bff',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            Go to Weather
          </Link>
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
