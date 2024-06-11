import { Container, AbsoluteCenter, Heading, Highlight, Box } from '@chakra-ui/react'
import SearchInput from '~/components/SearchInput';

export default function SearchPage() {
  return (
    <Container
      minHeight="90vh"
    >
      <AbsoluteCenter>
        <Box w="576px">
          <Heading as="h1" size="4xl" marginBottom="44px" textAlign="center">
            Google
            <br />
            <Highlight query="Search" styles={{ color: "blue.600" }}>
              Search
            </Highlight>
            <br />
            <Highlight query="Tool" styles={{ color: "orange.600" }}>
              Tool
            </Highlight>
          </Heading>
          <SearchInput />
        </Box>
      </AbsoluteCenter>
    </Container>
  );
}
