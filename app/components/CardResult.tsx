import {
  Card,
  Stack,
  CardBody,
  Heading,
  Link,
  Text,
  CardFooter,
  HStack,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import FavoriteButton from "./FavoriteButton";

type CardResultProps = {
  item: any;
};

export default function CardResult({ item }: CardResultProps) {
  return (
    <Card
      direction={{ base: 'column', sm: 'row' }}
      variant="outline"
      padding="8px"
      w="full"
      maxWidth="318px"
      h="400px"
      maxHeight="400px"
    >
      {/* {item.pagemap?.metatags?.length > 0 && (
        <Image
          objectFit='cover'
          maxW={{ base: '100%', sm: '200px' }}
          borderRadius="lg"
          src={item.pagemap.metatags[0]["og:image"]}
        />
      )} */}

      <Stack>
        <CardBody w="300px">
          <Heading size="md" dangerouslySetInnerHTML={{ __html: item.htmlTitle }} noOfLines={2} title={item.title} marginBottom="8px" />
          <Link href={item.link} isExternal _visited={{ color: 'purple.300' }} color="blue.300" noOfLines={2}>
            {item.link}
          </Link>
          <Text dangerouslySetInnerHTML={{ __html: item.htmlSnippet }} noOfLines={6} paddingTop="8px" />
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
              <FavoriteButton item={item} />
            </ButtonGroup>
          </HStack>
        </CardFooter>
      </Stack>
    </Card>
  );
}
