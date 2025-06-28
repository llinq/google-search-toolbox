import { Container, Box, Spacer } from '@chakra-ui/react'
import { LoaderFunctionArgs } from '@remix-run/node';
import Logo from '~/components/Logo';
import SearchInput from '~/components/SearchInput';

export function loader({ request }: LoaderFunctionArgs) {
  return null;
}

export default function SearchPage() {
  return (
    <Container
      height="full"
      width="full"
      marginBottom="60px"
    >
      <Box w={{ base: "full", md: "full" }}>
        <Logo />
        <Spacer marginBottom="44px" />
        <SearchInput />
      </Box>
    </Container>
  );
}
