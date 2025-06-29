import { Container, Heading, WrapItem, Wrap, TabPanel, TabPanels, TabList, Tab, Tabs } from "@chakra-ui/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { ClientLoaderFunctionArgs, ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { cacheClientLoader, useCachedLoaderData } from "remix-client-cache";

import mock from '../mock.json';
import CardResult from "~/components/CardResult";
import { userPrefs } from "~/cookies.server";
import { formatSites } from "~/utils/formatSites";
import { fetchSearch, type FetchSearchParams } from "~/utils/search";
import { monitoringMiddleware } from "~/utils/monitoring";

const loadFavoritesInCookies = async (request: Request): Promise<string[]> => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || [];
  return cookie.favorites;
};

export async function loader({
  request,
  context
}: LoaderFunctionArgs) {
  const monitoring = monitoringMiddleware(request, context);

  try {
    const favoritesInCookies = await loadFavoritesInCookies(request);

    const url = new URL(request.url);
    const qParam = url.searchParams.get("q");
    const afterParam = url.searchParams.get("after");
    const excludeTerms = url.searchParams.get("excludeTerms");
    const sitesParam = url.searchParams.get("sites");
    const sitesFormatted = formatSites(sitesParam ?? "");

    let items = [];

    if (process.env.LOCAL) {
      items = mock;
    } else {
      const sitesQuery = sitesFormatted.map((siteFormatted) => {
        return `site:${siteFormatted}`;
      });
      const afterQuery = afterParam ? `after:${afterParam}` : "";

      const params: FetchSearchParams = {
        after: afterQuery,
        q: qParam,
        sites: sitesQuery.join(" OR "),
        start: 0,
        excludeTerms: excludeTerms ?? ""
      };

      const response = await fetchSearch({ ...params, start: 0 });
      items.push(...response.items);

      // for (let start = 0; start <= 90; start += 10) {
      //   const response = await fetchSearch({ ...params, start });
      //   items.push(...response.items);
      // }
    }

    const itemsFormattedWithFavorite = items.map((item) => ({
      ...item,
      favorite: favoritesInCookies?.includes?.(item.link),
    }));

    const result = json({ items: itemsFormattedWithFavorite, sites: sitesFormatted });
    
    // Log sucesso
    monitoring.logSuccess(200);
    
    return result;
  } catch (error) {
    // Log erro
    monitoring.logError(error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
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

  const sitesWithLink = sites.filter((s) => !!items.find((i) => i.link.includes(s)));

  return (
    <Container
      marginBottom="20px"
      maxWidth="full"
      w="full"
    >
      <Heading marginBottom="24px">
        Results
      </Heading>
      {sites && sites.length > 0 ? (
        <Tabs variant='enclosed'>
          <TabList>
            {sitesWithLink.map((site) => (
              <Tab key={site}>{site}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {sitesWithLink.map((site) => (
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