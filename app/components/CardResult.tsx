import {
  Heading,
  Link,
  Text,
} from "@chakra-ui/react";
import FavoriteCard from "./FavoriteCard";
import ResumeIcon from "./ResumeIcon";

type Result = {
  displayLink: string;
  formattedUrl: string;
  htmlFormattedUrl: string;
  htmlSnippet: string;
  htmlTitle: string;
  link: string;
  title: string;
  snippet: string;
  favorite?: boolean;
  pagemap: {
    metatags: {
    };
  };
};

type CardResultProps = {
  item: Result;
};

export default function CardResult({ item }: CardResultProps) {
  return (
    <FavoriteCard item={item}>
      <Link
        href={item.link}
        isExternal
        color="blue.300"
        textDecoration="none"
        _visited={{ color: 'purple.300' }}
        _hover={{ textDecoration: 'underline' }}
      >
        <Heading
          size="md"
          dangerouslySetInnerHTML={{ __html: item.htmlTitle }}
          noOfLines={2}
          title={item.title}
          marginBottom="8px"
          cursor="pointer"
        />
      </Link>

      <Text fontSize="sm" color="orange.600" marginBottom="8px">
        {item.displayLink}
      </Text>

      <Text
        dangerouslySetInnerHTML={{ __html: item.htmlSnippet }}
        noOfLines={10}
        paddingTop="8px"
        fontSize="sm"
      />
    </FavoriteCard>
  );
}
