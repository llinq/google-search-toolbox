import {
  Box,
  Button,
  Collapse,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
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
import DatePicker from "./DatePicker";
import moment from "moment";

type SearchInputProps = {
  hideButton?: boolean;
  isResultPage?: boolean;
};

export default function SearchInput({ hideButton, isResultPage }: SearchInputProps) {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const qParam = searchParams.get("q");
  const sitesParam = searchParams.get("sites");
  const afterParam = searchParams.get("after");
  const excludeTermsParam = searchParams.get("excludeTerms");

  const navigation = useNavigation();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has('q');

  const { isOpen: isOpenSitesTextarea, onToggle: onToggleSitesTextArea } = useDisclosure();
  const [multipleSitesLength, setMultipleSitesLength] = useState(0);
  const [queryValue, setQueryValue] = useState(qParam || "");
  const [sitesValue, setSitesValue] = useState(sitesParam ?? "");
  const [excludeTermsValue, setExcludeTermsValue] = useState(excludeTermsParam ?? "");
  const [date, setDate] = useState<Date | undefined>(afterParam ? moment(afterParam).toDate() : undefined);

  const handleMultipleSitesChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = event.target.value;
    setSitesValue(inputValue);

    const pattern = /[^\r\n]+/gm;
    const matches = inputValue.match(pattern);

    setMultipleSitesLength(matches ? matches.length : 0);
  }

  const handleExcludeTermsChange = (event: ChangeEvent<HTMLInputElement>) => {
    setExcludeTermsValue(event.target.value);
  };

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
          <HStack alignItems="center" marginBottom="16px" marginTop="8px">
            <FormLabel>
              Results after
            </FormLabel>
            <DatePicker name="after" date={date} onDateChange={setDate} />
          </HStack>

          <FormControl variant="outline" w="full" marginBottom="16px" isInvalid={multipleSitesLength > 25}>
            <FormLabel>
              Sites
            </FormLabel>
            <Textarea
              name="sites"
              id="sites"
              resize="none"
              size="sm"
              rows={10}
              value={sitesValue}
              onChange={handleMultipleSitesChange}
              placeholder="Split sites with break lines, e.g.:

www.site1.com
www.site2.com
www.site3.com
            "
            />
            {multipleSitesLength <= 25 ? (
              <FormHelperText>
                Searching on {multipleSitesLength} sites
              </FormHelperText>
            ) : (
              <FormErrorMessage>
                Maximum quantity of sites allowed is 25
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl variant="outline" w="full">
            <FormLabel>
              Exclude filter
            </FormLabel>
            <Input
              type="text"
              id="excludeTerms"
              name="excludeTerms"
              value={excludeTermsValue}
              onChange={handleExcludeTermsChange}
            />
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
    </Form >
  );
}
