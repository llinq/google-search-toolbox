import { Container, Heading, VStack, Text, Box, Stack, Link, Spacer, Image } from "@chakra-ui/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({
  request
}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');

  const sites = url.searchParams.get('sites');
  const sitesFormatted = sites?.match(/[^\r\n]+/gm) ?? [];
  const sitesQuery = sitesFormatted.map((siteFormatted) => {
    return `site:${siteFormatted}`;
  });

  const fetchUrl = `https://www.googleapis.com/customsearch/v1?key=AIzaSyD3ygwY3BSKKr6Axi32eSXMrYNMjAVJyfM&cx=b4644f3e113a54b01&q=${q} ${sitesQuery.join(' OR ')}`;
  const res = await fetch(fetchUrl);
  const response = await res.json();

  return json({ items: response.items });
};

export default function ResultPage() {
  const { items } = useLoaderData<typeof loader>();

  console.log(items);

  return (
    <Container
      minHeight="100vh"
    >
      <Heading marginBottom="24px">
        Result Page!!
      </Heading>
      {items.map((item: any, index: number) => (
        <Stack key={index} id="result-item" marginBottom="16px" border="1px solid" borderColor="orange.600" borderRadius={6} padding="8px">
          {item.pagemap.metatags.length > 0 && (
            <Image src={item.pagemap.metatags[0]["og:image"]} />
          )}
          <Link href={item.formattedUrl} dangerouslySetInnerHTML={{ __html: item.htmlFormattedUrl }} />
          <Box as="span" dangerouslySetInnerHTML={{ __html: item.htmlTitle }} />
          <Box as="span" dangerouslySetInnerHTML={{ __html: item.htmlSnippet }} />
        </Stack>
      ))}
    </Container>
  );
}