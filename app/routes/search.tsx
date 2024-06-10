import {
  Container,
  AbsoluteCenter,
  Heading,
  Input,
  Box,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Textarea,
  VStack,
  FormLabel,
  FormControl,
  Button,
  FormHelperText,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react'
import { Form } from '@remix-run/react';
import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from '@chakra-ui/icons'
import { ChangeEvent, useState } from 'react';

export default function SearchPage() {
  const { isOpen: isOpenSitesTextarea, onToggle: onToggleSitesTextArea } = useDisclosure()
  const [multipleSitesLength, setMultipleSitesLength] = useState(0);

  const handleMultipleSitesChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = event.target.value

    const pattern = /[^\r\n]+/gm;
    const matches = inputValue.match(pattern);

    setMultipleSitesLength(matches ? matches.length : 0);
  }

  return (
    <Container
      minHeight="100vh"
    >
      <AbsoluteCenter>
        <Box w="576px">
          <Heading as="h1" size="4xl" marginBottom="44px" textAlign="center">
            Google
          </Heading>
          <Form role="search" id="search-form" action="/result">
            <VStack gap="16px">
              <InputGroup variant="outline">
                <InputLeftElement pointerEvents='none'>
                  <SearchIcon color='gray.300' />
                </InputLeftElement>
                <InputRightElement>
                  <IconButton
                    isRound={true}
                    variant="ghost"
                    size="sm"
                    aria-label="Open multiple sites textarea"
                    icon={isOpenSitesTextarea ? <ArrowUpIcon /> : <ArrowDownIcon />}
                    onClick={onToggleSitesTextArea}
                  />
                  {/* <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label='Options'
                      icon={<SettingsIcon />}
                      variant=''
                    />
                    <MenuList>
                      <MenuItem
                        icon={<HamburgerIcon />}
                        onClick={() => setMultipleSearch(true)}
                      >
                        Search on multiple sites
                      </MenuItem>
                      <MenuItem icon={<EditIcon />}>
                        Open File...
                      </MenuItem>
                    </MenuList>
                  </Menu> */}
                </InputRightElement>
                <Input
                  placeholder="Search here..."
                  w="full"
                  id="q"
                  name="q"
                />
              </InputGroup>

              <Box as={Collapse} in={isOpenSitesTextarea} w="full" animateOpacity>
                <FormControl variant="outline" w="full">
                  <FormLabel>
                    Multiple search tool
                  </FormLabel>
                  <Textarea
                    name="sites"
                    id="sites"
                    resize="none"
                    // value={value}
                    onChange={handleMultipleSitesChange}
                    size="sm"
                    rows={10}
                    placeholder="Split sites with break lines, e.g.:

www.site1.com
www.site2.com
www.site3.com
                    "
                  />
                  {multipleSitesLength > 0 && (
                    <FormHelperText>
                      Searching on {multipleSitesLength} sites
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>

              <Button
                variant="outline"
                size="md"
                width="200px"
                colorScheme="blue"
                type="submit"
              >
                Search
              </Button>
            </VStack>
          </Form>
        </Box>
      </AbsoluteCenter>
      {/* There are many benefits to a joint design and development system. Not only
      does it bring benefits to the design team, but it also brings benefits to
      engineering teams. It makes sure that our experiences have a consistent look
      and feel, not just in our design specs, but in production */}
    </Container>
  );
}
