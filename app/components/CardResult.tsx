import { CheckCircleIcon, CheckIcon, StarIcon } from "@chakra-ui/icons";
import { Card, Image, Stack, CardBody, Heading, Link, Text, CardFooter, HStack, Button, ButtonGroup, IconButton } from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import { action } from "~/routes/result.favorite";

type CardResultProps = {
  item: any;
};

export default function CardResult({ item }: CardResultProps) {
  const fetcher = useFetcher<typeof action>();

  const favorite = fetcher.data?.favorite ?? item.favorite;

  return (
    <Card
      direction={{ base: 'column', sm: 'row' }}
      variant="outline"
      padding="8px"
      w="full"
    >
      {item.pagemap?.metatags?.length > 0 && (
        <Image
          objectFit='cover'
          maxW={{ base: '100%', sm: '200px' }}
          borderRadius="lg"
          src={item.pagemap.metatags[0]["og:image"]}
        />
      )}

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
              <fetcher.Form action="/result/favorite" method="POST">
                <input type="hidden" name="link" value={item.link} hidden={true} />
                <IconButton
                  isRound={true}
                  variant="ghost"
                  colorScheme="yellow"
                  aria-label="Change theme"
                  icon={<StarIcon fillOpacity={10} color={favorite ? 'orange' : 'gray'} />}
                  type="submit"
                />
              </fetcher.Form>
            </ButtonGroup>
          </HStack>
        </CardFooter>
      </Stack>
    </Card>
  );
}
