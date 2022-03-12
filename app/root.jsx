import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "remix";

import styleUrl from '~/styles/global.css';

export const links = () => {
  return [
    {
      rel: 'stylesheet',
      href: styleUrl
    }
  ]
}

export function meta() {
  return { title: "Just Shadowing It" };
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <link rel="stylesheet" href="https://unpkg.com/modern-normalize@1.1.0/modern-normalize.css" />
        <link rel="stylesheet" href="https://unpkg.com/lite-youtube-embed@0.2.0/src/lite-yt-embed.css" />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <script src="https://unpkg.com/lite-youtube-embed@0.2.0/src/lite-yt-embed.js" async="async" />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }) {
  console.error(error.message);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        {/* add the UI you want your users to see */}
        <div className="error">Error -> {error.message}</div>
        <Scripts />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <html>
      <head>
        <title>{`${caught.status} ${caught.statusText}`}</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="error"> {caught.status} {caught.statusText}</div>
        <Scripts />
      </body>
    </html>
  );
}