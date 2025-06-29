// entry.server.tsx
import { renderToString } from 'react-dom/server'
import { CacheProvider } from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance'
import { RemixServer } from '@remix-run/react'
import type { EntryContext } from '@remix-run/node' // Depends on the runtime you choose

import { ServerStyleContext } from './context'
import createEmotionCache from './createEmotionCache'

// Constants
const CHAKRA_COOKIE_COLOR_KEY = "chakra-ui-color-mode"
const DEFAULT_COLOR_MODE = 'system'

// Utility functions
const getColorMode = (cookies: string): string => {
  const match = cookies.match(new RegExp(`(^| )${CHAKRA_COOKIE_COLOR_KEY}=([^;]+)`))
  const color = match ? match[2] : undefined
  return color || DEFAULT_COLOR_MODE
}

const applyColorModeToHtml = (markup: string, colorMode: string): string => {
  return markup
    .replace(
      '<html lang="en">',
      `<html lang="en" data-theme="${colorMode}" style="color-scheme: ${colorMode};">`
    )
    .replace(
      '<body>',
      `<body class="chakra-ui-${colorMode}">`
    )
}

// Main handler
export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)

  // Extract color mode from cookies
  const cookies = request.headers.get('cookie') ?? ''
  const colorMode = getColorMode(cookies)

  // First render to extract styles
  const html = renderToString(
    <ServerStyleContext.Provider value={null}>
      <CacheProvider value={cache}>
        <RemixServer context={remixContext} url={request.url} />
      </CacheProvider>
    </ServerStyleContext.Provider>,
  )

  const chunks = extractCriticalToChunks(html)

  // Second render with styles
  const markup = renderToString(
    <ServerStyleContext.Provider value={chunks.styles}>
      <CacheProvider value={cache}>
        <RemixServer context={remixContext} url={request.url} />
      </CacheProvider>
    </ServerStyleContext.Provider>,
  )

  // Apply color mode attributes to prevent flash
  const htmlWithColorMode = applyColorModeToHtml(markup, colorMode)

  responseHeaders.set('Content-Type', 'text/html')

  return new Response(`<!DOCTYPE html>${htmlWithColorMode}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}
