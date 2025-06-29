import { ArrowBackIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, useColorMode } from "@chakra-ui/react";
import SearchInput from "./SearchInput";
import { Form, useLocation } from "@remix-run/react";

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
      >
        <Form action="/search">
          <Box>
            {isResultPage && (
              <IconButton
                aria-label="Back to home"
                icon={<ArrowBackIcon />}
                type="submit"
              />
            )}
          </Box>
        </Form>
        {isResultPage && (
          <Box w="full">
            <SearchInput isResultPage={isResultPage} />
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
      {/* <Stack spacing={1} margin="24px">
        <Progress colorScheme="yellow" value={20} size="xs" />
        <Text as="i">
          Quota limit
        </Text>
      </Stack> */}
    </header>
  )
}