import { ArrowBackIcon, ChevronDownIcon, ChevronUpIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Box, Collapse, Flex, IconButton, useColorMode } from "@chakra-ui/react";
import SearchInput from "./SearchInput";
import { Form, useLocation } from "@remix-run/react";
import { useState, useEffect } from "react";

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode()
  const location = useLocation();
  const [showHeader, setShowHeader] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);

  const isDark = colorMode === 'dark';
  const isResultPage = location.pathname.includes('result');

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const newHasScrolled = scrollTop > 0;
    setHasScrolled(newHasScrolled);

    if (!newHasScrolled) {
      setShowHeader(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <header>
      <Collapse in={showHeader} animateOpacity>
        <Flex
          w="full"
          alignItems="start"
          justifyContent={isResultPage ? "space-between" : "flex-end"}
          padding="16px"
          gap={{ base: "2rem" }}
        >
          {isResultPage && (
            <>
              <Form action="/search">
                <Box>
                  <IconButton
                    aria-label="Back to home"
                    icon={<ArrowBackIcon />}
                    type="submit"
                  />
                </Box>
              </Form>
              <Box w="full">
                <SearchInput isResultPage={isResultPage} />
              </Box>
            </>
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
      </Collapse>
      {isResultPage && hasScrolled && (
        <Flex alignItems="center" justifyContent="center">
          <IconButton
            aria-label="Toggle header"
            icon={showHeader ? <ChevronUpIcon /> : <ChevronDownIcon />}
            onClick={() => setShowHeader(!showHeader)}
            variant="ghost"
            size="sm"
            colorScheme={isDark ? 'yellow' : 'teal'}
            rounded="none"
            width="100%"
            _hover={{
              bg: isDark ? "gray.700" : "gray.100"
            }}
          />
        </Flex>
      )}

      {/* <Stack spacing={1} margin="24px">
        <Progress colorScheme="yellow" value={20} size="xs" />
        <Text as="i">
          Quota limit
        </Text>
      </Stack> */}
    </header>
  )
}