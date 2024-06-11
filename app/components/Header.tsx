import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Button, Flex, IconButton, useColorMode } from "@chakra-ui/react";
import { Form } from "@remix-run/react";

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode()

  const isDark = colorMode === 'dark';

  return (
    <header>
      <Flex
        w="full"
        alignItems="center"
        justifyContent="space-between"
        padding="16px"
      // borderBottom="1px solid"
      // borderBottomColor="orange.600"
      // bgGradient="linear(orange.600, blue.400)"
      >
        <Form action="/search">
          <Button variant="outline" type="submit">
            Logo
          </Button>
        </Form>
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