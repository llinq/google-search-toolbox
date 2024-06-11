import { Container, Heading, WrapItem, Wrap, TabPanel, TabPanels, TabList, Tab, Tabs } from "@chakra-ui/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { ClientLoaderFunctionArgs } from "@remix-run/react";
import { cacheClientLoader, createCacheAdapter, useCachedLoaderData } from "remix-client-cache";

// import mock from '../mock.json';
import CardResult from "~/components/CardResult";

const fetchSearch = async (q: string | null, sitesQuery: string, start: number) => {
  const fetchUrl = `https://www.googleapis.com/customsearch/v1?key=[YOUR_API_KEY]&cx=b4644f3e113a54b01&q=${q} ${sitesQuery}&start=${start}`;
  const res = await fetch(fetchUrl);
  const response = await res.json();

  return response;
};

export async function loader({
  request
}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  const sites = url.searchParams.get("sites");
  const sitesFormatted = sites?.match(/[^\r\n]+/gm) ?? [];
  const sitesQuery = sitesFormatted.map((siteFormatted) => {
    return `site:${siteFormatted}`;
  });

  const items = [];

  for (let start = 0; start <= 90; start += 10) {
    const response = await fetchSearch(q, sitesQuery.join(" OR "), start);
    items.push(...response.items);
  }

  return json({ items, sites: sitesFormatted });
}

const { adapter } = createCacheAdapter(() => localStorage); // uses localStorage as the cache adapter

export const clientLoader = (args: ClientLoaderFunctionArgs) => cacheClientLoader(args, {
  type: "normal",
  adapter: adapter
});

clientLoader.hydrate = true;

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
                <Wrap w="full">
                  {items?.filter?.(item => item.link.includes(site)).map((item: any, index: number) => (
                    <WrapItem key={index}>
                      <CardResult item={item} index={index} />
                    </WrapItem>
                  ))}
                </Wrap>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      ) : (
        <Wrap w="full">
          {items.map((item: any, index: number) => (
            <WrapItem key={index}>
              <CardResult item={item} index={index} />
            </WrapItem>
          ))}
        </Wrap>
      )}

    </Container>
  );
}