import { Container, AbsoluteCenter, Box, Spacer } from '@chakra-ui/react'
import Logo from '~/components/Logo';
import SearchInput from '~/components/SearchInput';

export default function SearchPage() {
  return (
    <Container
      height="full"
      width="full"
    >
      <AbsoluteCenter w={{ base: "full", md: "unset" }} paddingX="16px">
        <Box w={{ base: "full", md: "576px" }}>
          <Logo />
          <Spacer marginBottom="44px" />
          <SearchInput />
        </Box>
      </AbsoluteCenter>
    </Container>
  );
}
