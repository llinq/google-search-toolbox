// entry.server.tsx
import { renderToString } from 'react-dom/server'
import { CacheProvider } from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance'
import { RemixServer } from '@remix-run/react'
import type { EntryContext } from '@remix-run/node' // Depends on the runtime you choose

import { ServerStyleContext } from './context'
import createEmotionCache from './createEmotionCache'

// Color mode detection function
function getColorMode(cookies: string): string {
  const CHAKRA_COOKIE_COLOR_KEY = "chakra-ui-color-mode";
  const match = cookies.match(new RegExp(`(^| )${CHAKRA_COOKIE_COLOR_KEY}=([^;]+)`));
  const color = match ? match[2] : undefined;
  
  // Default to 'system' if no color mode is found
  return color || 'system';
}

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)

  // Get cookies from request headers
  const cookies = request.headers.get('cookie') ?? '';
  const colorMode = getColorMode(cookies);

  const html = renderToString(
    <ServerStyleContext.Provider value={null}>
      <CacheProvider value={cache}>
        <RemixServer context={remixContext} url={request.url} />
      </CacheProvider>
    </ServerStyleContext.Provider>,
  )

  const chunks = extractCriticalToChunks(html)

  const markup = renderToString(
    <ServerStyleContext.Provider value={chunks.styles}>
      <CacheProvider value={cache}>
        <RemixServer context={remixContext} url={request.url} />
      </CacheProvider>
    </ServerStyleContext.Provider>,
  )

  // Add color mode attributes to the HTML to prevent flash
  const htmlWithColorMode = markup.replace(
    '<html lang="en">',
    `<html lang="en" data-theme="${colorMode}" style="color-scheme: ${colorMode};">`
  ).replace(
    '<body>',
    `<body class="chakra-ui-${colorMode}">`
  );

  responseHeaders.set('Content-Type', 'text/html')

  return new Response(`<!DOCTYPE html>${htmlWithColorMode}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}
