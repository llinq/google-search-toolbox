// root.tsx
import React, { useContext, useEffect, useMemo } from 'react'
import { withEmotionCache } from '@emotion/react'
import { ChakraProvider, ColorModeWithSystem, cookieStorageManagerSSR, theme } from '@chakra-ui/react'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import { MetaFunction, LinksFunction, LoaderFunction } from '@remix-run/cloudflare' // Depends on the runtime you choose

import { ServerStyleContext, ClientStyleContext } from './context'
import Header from './components/Header'
import styles from './styles/styles.css?url';

export const loader: LoaderFunction = async ({ request }) => {
  return request.headers.get('cookie') ?? '';
}

export const meta: MetaFunction = () => {
  return [
    { charSet: 'utf-8' },
    { title: 'Google Search Tool' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ];
};

export const links: LinksFunction = () => {
  return [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap'
    },
    {
      rel: 'stylesheet',
      href: styles
    }
  ]
}

interface DocumentProps {
  children: React.ReactNode;
  colorMode: ColorModeWithSystem;
}

const Document = withEmotionCache(
  ({ children, colorMode }: DocumentProps, emotionCache) => {
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
        // TODO
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData?.reset();
    }, []);

    return (
      <html
        lang="en"
        {...colorMode
        && {
          "data-theme": colorMode,
          "style": { colorScheme: colorMode },
        }}
      >
        <head>
          <Meta />
          <Links />
          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(' ')}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body
          {...colorMode && {
            className: `chakra-ui-${colorMode}`
          }}
        >
          {children}
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    );
  }
);

export default function App() {
  // TODO
  function getColorMode(cookies: string): any {
    const match = cookies.match(new RegExp(`(^| )${CHAKRA_COOKIE_COLOR_KEY}=([^;]+)`));
    return match == null ? void 0 : match[2];
  }

  // here we can set the default color mode. If we set it to null,
  // there's no way for us to know what is the the user's preferred theme
  // so the client will have to figure out and maybe there'll be a flash the first time the user visits us.
  const DEFAULT_COLOR_MODE: ColorModeWithSystem = 'system';

  const CHAKRA_COOKIE_COLOR_KEY = "chakra-ui-color-mode";

  let cookies: string = useLoaderData()

  // the client get the cookies from the document
  // because when we do a client routing, the loader can have stored an outdated value
  if (typeof document !== "undefined") {
    cookies = document.cookie;
  }

  // get and store the color mode from the cookies.
  // It'll update the cookies if there isn't any and we have set a default value
  // TODO
  const colorMode: ColorModeWithSystem = useMemo(() => {
    let color = getColorMode(cookies)

    if (!color && DEFAULT_COLOR_MODE) {
      cookies += ` ${CHAKRA_COOKIE_COLOR_KEY}=${DEFAULT_COLOR_MODE}`;
      color = DEFAULT_COLOR_MODE;
    }

    return color;
  }, [cookies]);

  return (
    <Document colorMode={colorMode}>
      <ChakraProvider
        colorModeManager={cookieStorageManagerSSR(cookies)}
        theme={theme}
      >
        <Header />
        <div className="body-content">
          <Outlet />
        </div>
      </ChakraProvider>
    </Document>
  )
}
