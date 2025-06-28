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
import { MetaFunction, LinksFunction, LoaderFunction } from '@remix-run/node' // Depends on the runtime you choose

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
  return (
    <Document colorMode="dark">
      <ChakraProvider
        // colorModeManager={cookieStorageManagerSSR(cookies)}
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

if (typeof window !== "undefined") {
  const hydratedPathname = window.location.pathname;
  window.__remixContext.url = hydratedPathname;
}
