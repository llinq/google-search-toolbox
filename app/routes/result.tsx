import { Container, Heading, WrapItem, Wrap, TabPanel, TabPanels, TabList, Tab, Tabs } from "@chakra-ui/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { ClientLoaderFunctionArgs, ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { cacheClientLoader, useCachedLoaderData } from "remix-client-cache";

import mock from '../mock.json';
import CardResult from "~/components/CardResult";
import { userPrefs } from "~/cookies.server";

export type FetchSearchParams = {
  after: string | null;
  q: string | null;
  sites: string;
  start: number;
};

const fetchSearch = async (params: FetchSearchParams) => {
  const fetchUrl = 
  `https://www.googleapis.com/customsearch/v1?key=[YOUR_API_KEY]&cx=b4644f3e113a54b01&q=${params.q} ${params.sites} ${params.after} &start=${params.start}`;
  
  const res = await fetch(fetchUrl);
  const response = await res.json();

  return response;
};

const loadFavoritesInCookies = async (request: Request): Promise<string[]> => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || [];
  return cookie.favorites;
};

export async function loader({
  request
}: LoaderFunctionArgs) {
  const favoritesInCookies = await loadFavoritesInCookies(request);

  const url = new URL(request.url);
  const qParam = url.searchParams.get("q");
  const sitesParam = url.searchParams.get("sites");
  const afterParam = url.searchParams.get("after");

  const sitesFormatted = sitesParam?.match(/[^\r\n]+/gm) ?? [];
  const sitesQuery = sitesFormatted.map((siteFormatted) => {
    return `site:${siteFormatted}`;
  });
  const afterQuery = afterParam ? `after:${afterParam}` : "";

  const items = mock;

  // const items = [];

  // for (let start = 0; start <= 90; start += 10) {
  //   const response = await fetchSearch(qParam, sitesQuery.join(" OR "), start, afterQuery);
  //   items.push(...response.items);
  // }

  const itemsFormattedWithFavorite = items.map((item) => ({
    ...item,
    favorite: favoritesInCookies?.includes?.(item.link),
  }));

  return json({ items: itemsFormattedWithFavorite, sites: sitesFormatted });
}

export const clientLoader = (args: ClientLoaderFunctionArgs) => cacheClientLoader(args);

clientLoader.hydrate = true;

export function shouldRevalidate({
  actionResult,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  if (actionResult && 'favorite' in actionResult) {
    return false;
  }

  return defaultShouldRevalidate;
}

export default function ResultPage() {
  const { items, sites } = useCachedLoaderData<typeof loader>();

  return (
    <Container
      minHeight="100vh"
      marginBottom="20px"
      maxWidth="full"
      w="full"
    >
      <Heading marginBottom="24px">
        Result Page!!
      </Heading>
      {sites && sites.length > 0 ? (
        <Tabs variant='enclosed'>
          <TabList>
            {sites.map((site) => (
              <Tab key={site}>{site}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {sites.map((site) => (
              <TabPanel key={site}>
                <Wrap w="full" justify="center" spacing="24px">
                  {items?.filter?.(item => item.link.includes(site)).map((item: any, index: number) => (
                    <WrapItem key={index}>
                      <CardResult item={item} />
                    </WrapItem>
                  ))}
                </Wrap>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      ) : (
        <Wrap w="full" justify="center" spacing="24px">
          {items.map((item: any, index: number) => (
            <WrapItem key={index}>
              <CardResult item={item} />
            </WrapItem>
          ))}
        </Wrap>
      )}

    </Container>
  );
}