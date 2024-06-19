import {
  json,
  type LoaderFunctionArgs,
} from '@remix-run/cloudflare';
import { Container, AbsoluteCenter, Box, Spacer } from '@chakra-ui/react'
import Logo from '~/components/Logo';
import SearchInput from '~/components/SearchInput';
import { useLoaderData } from '@remix-run/react';

export async function loader({ context }: LoaderFunctionArgs) {
  const { GOOGLE_API_KEY } = context.cloudflare.env;

  const kv = await GOOGLE_API_KEY.get("key-teste");

  console.log(kv);

  return json({ kv });
}

export default function SearchPage() {
  const { kv } = useLoaderData<typeof loader>();

  return (
    <Container
      height="full"
      width="full"
    >
      <AbsoluteCenter w={{ base: "full", md: "unset" }} paddingX="16px">
        <Box w={{ base: "full", md: "576px" }}>
          <h1>{kv ?? "sem kv"}</h1>
          <Logo />
          <Spacer marginBottom="44px" />
          <SearchInput />
        </Box>
      </AbsoluteCenter>
    </Container>
  );
}
