import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  Link,
  useTransition,
  useNavigate
} from "remix";

import ContentLoader from 'react-content-loader';

import supabase from '~/utils/supabase';

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

const Spinner = (props) => (
  <ContentLoader 
    speed={2}
    width={340}
    height={84}
    viewBox="0 0 340 84"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="3" ry="3" width="67" height="11" /> 
    <rect x="76" y="0" rx="3" ry="3" width="140" height="11" /> 
    <rect x="127" y="48" rx="3" ry="3" width="53" height="11" /> 
    <rect x="187" y="48" rx="3" ry="3" width="72" height="11" /> 
    <rect x="18" y="48" rx="3" ry="3" width="100" height="11" /> 
    <rect x="0" y="71" rx="3" ry="3" width="37" height="11" /> 
    <rect x="18" y="23" rx="3" ry="3" width="140" height="11" /> 
    <rect x="166" y="23" rx="3" ry="3" width="173" height="11" />
  </ContentLoader>
)

export default function App() {
  const noLogin = !supabase.auth.session();
  const transition = useTransition();
  const navigator = useNavigate();
  const isLoaidng = transition.type !== 'actionReload' && transition.state === 'loading'
  const login = () => {
    supabase.auth.signIn({
      provider: 'github'
    })
  }

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
        <header className="root-header">
          <div className="links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </div>
          <div className="action">
            <button className="button" onClick={() => navigator('/new')}>New Execise</button>
            {noLogin && <button onClick={login} className="button">Login With Github</button>}
          </div>
        </header>
        { isLoaidng ? <Spinner /> : <Outlet />}
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