import {
  Box,
  Button,
  Collapse,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Textarea,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from "@chakra-ui/icons";
import { Form, useLocation, useNavigation } from "@remix-run/react";
import { ChangeEvent, useState } from "react";

type SearchInputProps = {
  hideButton?: boolean;
  isResultPage?: boolean;
};

export default function SearchInput({ hideButton, isResultPage }: SearchInputProps) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const q = searchParams.get('q');
  const sites = searchParams.get('sites');

  const navigation = useNavigation();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has('q');

  const { isOpen: isOpenSitesTextarea, onToggle: onToggleSitesTextArea } = useDisclosure();
  const [multipleSitesLength, setMultipleSitesLength] = useState(0);
  const [queryValue, setQueryValue] = useState(q || "");
  const [sitesValue, setSitesValue] = useState(sites ?? "");

  const handleMultipleSitesChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = event.target.value;
    setSitesValue(inputValue);

    const pattern = /[^\r\n]+/gm;
    const matches = inputValue.match(pattern);

    setMultipleSitesLength(matches ? matches.length : 0);
  }

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setQueryValue(inputValue);
  };

  return (
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
              isLoading={isResultPage && searching}
            />
          </InputRightElement>
          <Input
            placeholder="Search here..."
            w="full"
            id="q"
            name="q"
            value={queryValue}
            onChange={handleQueryChange}
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
              value={sitesValue}
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

        {!hideButton && (
          <Button
            variant="outline"
            size="md"
            width="200px"
            colorScheme="blue"
            type="submit"
            isLoading={searching}
          >
            Search
          </Button>
        )}
      </VStack>
    </Form>
  );
}