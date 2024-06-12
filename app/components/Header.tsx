import { ChatIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, useColorMode } from "@chakra-ui/react";
import SearchInput from "./SearchInput";
import { Form, useLocation } from "@remix-run/react";
import Logo from "./Logo";

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode()
  const location = useLocation();

  const isDark = colorMode === 'dark';
  const isResultPage = location.pathname.includes('result');

  return (
    <header>
      <Flex
        w="full"
        alignItems="start"
        justifyContent="space-between"
        padding="16px"
        gap={{ base: "2rem" }}
      // borderBottom="1px solid"
      // borderBottomColor="orange.600"
      // bgGradient="linear(orange.600, blue.400)"
      >
        <Form action="/search">
          <Box display={{ base: "block", sm: "none" }}>
            <IconButton
              aria-label="Back to home"
              icon={<ChatIcon />}
              type="submit"
            />
          </Box>
          <Box display={{ base: "none", sm: "block" }}>
            <Button type="submit" variant="ghost" width="80px">
              <Logo size="xs" as="span" fontSize="10px" lineHeight="12px" />
            </Button>
          </Box>
        </Form>
        {isResultPage && (
          <Box w="full">
            <SearchInput hideButton={true} isResultPage={isResultPage} />
          </Box>
        )}
        <div>
          <IconButton
            isRound={true}
            variant="ghost"
            colorScheme={isDark ? 'yellow' : 'teal'}
            aria-label="Change theme"
            icon={isDark ? <SunIcon /> : <MoonIcon />}
            onClick={toggleColorMode}
          />
        </div>
      </Flex>
    </header>
  )
}