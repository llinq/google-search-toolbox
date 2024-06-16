import { Container, AbsoluteCenter, Box, Spacer } from '@chakra-ui/react'
import { LoaderFunctionArgs, json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import Logo from '~/components/Logo';
import SearchInput from '~/components/SearchInput';

export async function loader({context}: LoaderFunctionArgs) {
  const { GOOGLE_API_KEY } = context.cloudflare.env;

  const kv = await GOOGLE_API_KEY.get("key-teste");
  
  return json({ kv });
}

export default function SearchPage() {
  const { kv } = useLoaderData<typeof loader>();

  console.log(kv);

  return (
    <Container
      minHeight="90vh"
      width="full"
    >
      <AbsoluteCenter w={{ base: "full", md: "unset" }} paddingX="16px">
        <Box w={{ base: "full", md: "576px" }}>
          <Logo />
          <Spacer marginBottom="44px" />
          <h1>{kv ?? "Sem kv!!"}</h1>
          <Spacer marginBottom="44px" />
          <SearchInput />
        </Box>
      </AbsoluteCenter>
    </Container>
  );
}
