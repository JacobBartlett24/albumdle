// root.tsx
import React, { useContext, useEffect, useMemo } from 'react'
import { withEmotionCache } from '@emotion/react'
import { ChakraProvider, cookieStorageManagerSSR, extendTheme } from '@chakra-ui/react'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import { MetaFunction, LinksFunction, LoaderFunction, LoaderArgs } from '@remix-run/node' // Depends on the runtime you choose
import "./utils/fonts.css"
import { ServerStyleContext, ClientStyleContext } from './context'



// Typescript
// This will return cookies
export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  // first time users will not have any cookies and you may not return
  // undefined here, hence ?? is necessary
  return request.headers.get('cookie') ?? ''
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Albumdle',
  viewport: 'width=device-width,initial-scale=1',
});

export let links: LinksFunction = () => {
  return [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap'
    },
  ]
}

const theme = extendTheme({
  shadows:{
    white: "rgba(189, 195, 199, .3) 0px 18px 36px -18px inset, rgba(189, 195, 199, .1) 0px 8px 36px -8px inset, rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;",
    purple: '0 0 0 3px rgba(159, 122, 234, 0.6)'
  },
  colors: { 
    brandred: {
      900: '#ff0d47',
      800: '#153e75',   
      700: '#2a69ac',
    },
    brandyellow: {
      900: '#f2f28d',
      800: '#153e75',
      700: '#2a69ac',
    },
    brandgreen: {
      900: '#5ef10d',
      800: '#153e75',
      700: '#2a69ac',
    },
    brandwhite: {
      900: '#FAF8F6',
      800: '#153e75',
      700: '#2a69ac',
    },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  },
})

interface DocumentProps {
  children: React.ReactNode;
}

const Document = withEmotionCache(
  ({ children }: DocumentProps, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext);
    const clientStyleData = useContext(ClientStyleContext);

    // Only executed on client
    useEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData?.reset();
    }, []);


  function getColorMode (cookies: string) {
    const match = cookies.match(new RegExp(`(^| )${CHAKRA_COOKIE_COLOR_KEY}=([^;]+)`));
    return match == null ? void 0 : match[2];
  }

  // here we can set the default color mode. If we set it to null,
  // there's no way for us to know what is the the user's preferred theme
  // so the cient will have to figure out and maybe there'll be a flash the first time the user visits us.
  const DEFAULT_COLOR_MODE: "dark" | "light" | null = 'light';

  const CHAKRA_COOKIE_COLOR_KEY = "chakra-ui-color-mode";

  let cookies = useLoaderData()

  // the client get the cookies from the document 
  // because when we do a client routing, the loader can have stored an outdated value
  if (typeof document !== "undefined") {
    cookies = document.cookie;
  }

  // get and store the color mode from the cookies.
  // It'll update the cookies if there isn't any and we have set a default value
  let colorMode = useMemo(() => {
    let color = getColorMode(cookies)

    if (!color && DEFAULT_COLOR_MODE) {
      cookies += ` ${CHAKRA_COOKIE_COLOR_KEY}=${DEFAULT_COLOR_MODE}`;
      color = DEFAULT_COLOR_MODE;
    }

    return color
  }, [cookies]);

  return (
    <html
    lang="en"
    {...colorMode
      && {
          "data-theme": colorMode,
          "style": { colorScheme: colorMode },
        }
      }
  >
    <head>
      <Meta />
      <Links />
      {serverStyleData?.map(({ key, ids, css }) => (
        <style
          key={key}
          data-emotion={`${key} ${ids.join(" ")}`}
          dangerouslySetInnerHTML={{ __html: css }}
        />
      ))}
    </head>
    <body  
      {...colorMode && {
        className: `chakra-ui-${colorMode}`
      }}
    >
      <ChakraProvider
        colorModeManager={cookieStorageManagerSSR(cookies)}
        theme={theme}
      >
        {children}
      </ChakraProvider>

      <ScrollRestoration />

      <Scripts />

      <LiveReload />
    </body>
  </html>
  );
  }
);

export default function App() {
  return (
    <Document>
        <Outlet />
    </Document>
  )
}