import { Container, AbsoluteCenter, Box, Spacer } from '@chakra-ui/react'
import Logo from '~/components/Logo';
import SearchInput from '~/components/SearchInput';

export default function SearchPage() {
  return (
    <Container
      minHeight="90vh"
    >
      <AbsoluteCenter>
        <Box w="576px">
          <Logo />
          <Spacer marginBottom="44px" />
          <SearchInput />
        </Box>
      </AbsoluteCenter>
    </Container>
  );
}
