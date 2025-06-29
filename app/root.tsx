// root.tsx
import { useContext, useEffect, useMemo } from 'react'
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
import { MetaFunction, LinksFunction, LoaderFunction } from '@remix-run/node'

import { ServerStyleContext, ClientStyleContext } from './context'
import Header from './components/Header'
import styles from './styles/styles.css?url'

// Constants
const CHAKRA_COOKIE_COLOR_KEY = "chakra-ui-color-mode"
const DEFAULT_COLOR_MODE: ColorModeWithSystem = 'system'

// Types
interface DocumentProps {
  children: React.ReactNode
  colorMode: ColorModeWithSystem
}

// Utility functions
const getColorMode = (cookies: string): ColorModeWithSystem => {
  const match = cookies.match(new RegExp(`(^| )${CHAKRA_COOKIE_COLOR_KEY}=([^;]+)`))
  const color = match ? match[2] as ColorModeWithSystem : undefined
  return color || DEFAULT_COLOR_MODE
}

// Remix exports
export const loader: LoaderFunction = async ({ request }) => {
  return request.headers.get('cookie') ?? ''
}

export const meta: MetaFunction = () => [
  { charSet: 'utf-8' },
  { title: 'Google Search Tool' },
  { name: 'viewport', content: 'width=device-width, initial-scale=1' },
]

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap'
  },
  { rel: 'stylesheet', href: styles }
]

// Document component
const Document = withEmotionCache(
  ({ children, colorMode }: DocumentProps, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext)
    const clientStyleData = useContext(ClientStyleContext)

    useEffect(() => {
      // Re-link sheet container
      emotionCache.sheet.container = document.head
      
      // Re-inject tags
      const tags = emotionCache.sheet.tags
      emotionCache.sheet.flush()
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag)
      })
      
      // Reset cache to reapply global styles
      clientStyleData?.reset()
    }, [clientStyleData])

    return (
      <html
        lang="en"
        data-theme={colorMode}
        style={{ colorScheme: colorMode }}
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
        <body className={`chakra-ui-${colorMode}`}>
          {children}
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    )
  }
)

// Main App component
export default function App() {
  const serverCookies = useLoaderData<string>()
  
  // Use document cookies on client, server cookies on server
  const cookies = typeof document !== "undefined" ? document.cookie : serverCookies

  const colorMode = useMemo(() => getColorMode(cookies), [cookies])

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

// Client-side hydration
if (typeof window !== "undefined") {
  const hydratedPathname = window.location.pathname
  window.__remixContext.url = hydratedPathname
}
