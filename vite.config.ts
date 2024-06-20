import {
	vitePlugin as remix,
	cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { getLoadContext } from './load-context';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [
		remixCloudflareDevProxy({ getLoadContext }),
		remix(),
		tsconfigPaths(),
		react({
			jsxImportSource: '@emotion/react',
			babel: {
				plugins: ['@emotion/babel-plugin'],
			},
		}),
	],
});
