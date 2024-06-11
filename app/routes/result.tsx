import { Container, Heading, Text, Stack, Image, CardBody, CardFooter, Button, Card, WrapItem, Wrap, Link, HStack, IconButton, ButtonGroup } from "@chakra-ui/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { ClientLoaderFunctionArgs } from "@remix-run/react";
import { cacheClientLoader, createCacheAdapter, useCachedLoaderData } from "remix-client-cache";

import mock from '../mock.json';
import { CheckCircleIcon, CheckIcon, StarIcon } from "@chakra-ui/icons";

// const { adapter } = createCacheAdapter(() => localStorage); // uses localStorage as the cache adapter

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

  console.log(sitesQuery, q);

  // const fetchUrl = `https://www.googleapis.com/customsearch/v1?key=AIzaSyB9avZpj75uJSe89QbKbZaglxKhy31pDKY&cx=34d73736b5a9f473f&q=${q} ${sitesQuery.join(" OR ")}`;
  // const res = await fetch(fetchUrl);
  // const response = await res.json();
  const response = mock;

  await new Promise((resolve) => setTimeout(resolve, 5000));

  return json({ items: response.items });
}

const { adapter } = createCacheAdapter(() => localStorage); // uses localStorage as the cache adapter

export const clientLoader = (args: ClientLoaderFunctionArgs) => cacheClientLoader(args, {
  type: "normal",
  adapter: adapter
});

clientLoader.hydrate = true;

export default function ResultPage() {
  const { items } = useCachedLoaderData<typeof loader>();

  return (
    <Container
      minHeight="100vh"
      marginBottom="20px"
    >
      <Heading marginBottom="24px">
        Result Page!!
      </Heading>
      <Wrap w="full">
        {items?.map((item: any, index: number) => (
          <WrapItem key={index}>
            <Card
              direction={{ base: 'column', sm: 'row' }}
              variant="outline"
              padding="8px"
              w="full"
            >
              <Image
                objectFit='cover'
                maxW={{ base: '100%', sm: '200px' }}
                borderRadius="lg"
                src={item.pagemap.metatags[0]["og:image"]}
              />

              <Stack>
                <CardBody w="300px">
                  <Heading size="md" dangerouslySetInnerHTML={{ __html: item.htmlTitle }} noOfLines={2} title={item.title} marginBottom="8px" />
                  <Link href={item.link} isExternal _visited={{ color: 'purple.300' }} color="blue.300">
                    {item.link}
                  </Link>
                  <Text dangerouslySetInnerHTML={{ __html: item.htmlSnippet }} noOfLines={3} paddingTop="8px" />
                </CardBody>

                <CardFooter>
                  <HStack justifyContent="space-between" w="full">
                    <Button
                      colorScheme="orange"
                      onClick={() => {
                        window.open(item.link, '_blank');
                      }}
                    >
                      Go
                    </Button>
                    <ButtonGroup>
                      <IconButton
                        isRound={true}
                        variant="ghost"
                        colorScheme="cyan"
                        aria-label="Change theme"
                        icon={<CheckIcon />}
                      />
                      <IconButton
                        isRound={true}
                        variant="ghost"
                        colorScheme="green"
                        aria-label="Change theme"
                        icon={<CheckCircleIcon />}
                      />
                      <IconButton
                        isRound={true}
                        variant="ghost"
                        colorScheme="yellow"
                        aria-label="Change theme"
                        icon={<StarIcon fillOpacity={10} color={index === 0 ? 'orange' : 'gray'} />}
                      />
                    </ButtonGroup>
                  </HStack>
                </CardFooter>
              </Stack>
            </Card>
          </WrapItem>
        ))}
      </Wrap>
    </Container>
  );
}