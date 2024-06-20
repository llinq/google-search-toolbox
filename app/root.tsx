import {
	json,
	type LinksFunction,
	type LoaderFunctionArgs,
	type MetaFunction,
} from '@remix-run/cloudflare';
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	useLoaderData,
	useRouteError,
} from '@remix-run/react';
// import * as React from 'react';
// import {
// 	Links,
// 	Meta,
// 	Outlet,
// 	Scripts,
// 	ScrollRestoration,
// 	isRouteErrorResponse,
// 	json,
// 	useLoaderData,
// 	useRouteError,
// } from '@remix-run/react';
import stylesUrl from '~/styles.css?url';
import { ErrorLayout, Layout, type Menu } from './layout';
import {
	ChakraProvider,
	cookieStorageManagerSSR,
	theme,
} from '@chakra-ui/react';
import { useMemo } from 'react';
// import { type Menu, ErrorLayout, Layout } from './layout';

export const links: LinksFunction = () => {
	return [{ rel: 'stylesheet', href: stylesUrl }];
};

export const meta: MetaFunction = () => {
	return [
		{ charset: 'utf-8' },
		{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
		{ title: 'remix-cloudlfare-template' },
	];
};

export async function loader({ context, request }: LoaderFunctionArgs) {
	const { env } = context;

	const key = await env.GOOGLE_API_KEY.get('key-teste');

	console.log('--------------', key);

	return json({
		cookies: request.headers.get('cookie') ?? '',
	});
}

export default function App() {
	// root.tsx
	// In your App function

	function getColorMode(cookies: string) {
		const match = cookies.match(
			new RegExp(`(^| )${CHAKRA_COOKIE_COLOR_KEY}=([^;]+)`),
		);
		return match == null ? void 0 : match[2];
	}

	// here we can set the default color mode. If we set it to null,
	// there's no way for us to know what is the the user's preferred theme
	// so the client will have to figure out and maybe there'll be a flash the first time the user visits us.
	const DEFAULT_COLOR_MODE: 'dark' | 'light' | null = 'dark';

	const CHAKRA_COOKIE_COLOR_KEY = 'chakra-ui-color-mode';

	let { cookies } = useLoaderData<typeof loader>();

	// the client get the cookies from the document
	// because when we do a client routing, the loader can have stored an outdated value
	if (typeof document !== 'undefined') {
		cookies = document.cookie;
	}

	// get and store the color mode from the cookies.
	// It'll update the cookies if there isn't any and we have set a default value
	let colorMode = useMemo(() => {
		let color = getColorMode(cookies);

		if (!color && DEFAULT_COLOR_MODE) {
			cookies += ` ${CHAKRA_COOKIE_COLOR_KEY}=${DEFAULT_COLOR_MODE}`;
			color = DEFAULT_COLOR_MODE;
		}

		return color;
	}, [cookies]);

	// Add classes to html and body and add colorModeManager to ChakraProvider

	return (
		<html
			lang="en"
			{...(colorMode && {
				'data-theme': colorMode,
				style: { colorScheme: colorMode },
			})}
		>
			<head>
				<Meta />
				<Links />
			</head>
			<body
				{...(colorMode && {
					className: `chakra-ui-${colorMode}`,
				})}
			>
				<ChakraProvider
					colorModeManager={cookieStorageManagerSSR(cookies)}
					theme={theme}
				>
					<Outlet />
				</ChakraProvider>

				<ScrollRestoration />

				<Scripts />

				<LiveReload />
			</body>
		</html>
	);
}
