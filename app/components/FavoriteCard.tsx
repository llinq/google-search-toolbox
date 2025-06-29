import {
  Card,
  Stack,
  CardBody,
  CardFooter,
  HStack,
  Button,
  ButtonGroup,
  Box,
} from "@chakra-ui/react";
import FavoriteButton from "./FavoriteButton";
import { useState, ReactNode } from "react";
import ResumeIcon from "./ResumeIcon";

type FavoriteCardProps = {
  item: any;
  children: ReactNode;
};

export default function FavoriteCard({
  item,
  children,
}: FavoriteCardProps) {
  const [isFavorite, setIsFavorite] = useState(item.favorite ?? false);

  const handleToggleFavorite = (newFavoriteState: boolean) => {
    setIsFavorite(newFavoriteState);
  };

  return (
    <Card
      direction={{ base: 'column', sm: 'row' }}
      variant="outline"
      padding="8px"
      w="full"
      maxWidth="318px"
      h="400px"
      maxHeight="400px"
      position="relative"
      borderWidth={isFavorite ? "2px" : "1px"}
      borderColor={isFavorite ? "yellow.400" : "inherit"}
      borderStyle={isFavorite ? "solid" : "inherit"}
      boxShadow={isFavorite ? "0 0 10px rgba(255, 193, 7, 0.3)" : "inherit"}
      transition="all 0.1s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        "& .favorite-button": {
          opacity: 1,
          visibility: "visible",
        },
        transform: isFavorite ? "scale(1.02)" : "scale(1.01)",
        boxShadow: isFavorite
          ? "0 0 15px rgba(255, 193, 7, 0.4), 0 4px 8px rgba(0, 0, 0, 0.1)"
          : "0 4px 8px rgba(0, 0, 0, 0.1)"
      }}
    >
      <Box
        position="absolute"
        top="8px"
        right="8px"
        zIndex={2}
        className="favorite-button"
        opacity={0}
        visibility="hidden"
        transition="opacity 0.2s, visibility 0.2s"
      >
        <FavoriteButton item={item} onToggleFavorite={handleToggleFavorite} />
      </Box>

      <Stack>
        <CardBody w="300px">
          {children}
        </CardBody>

        <CardFooter>
          <HStack justifyContent="space-between" w="full">
            <Button
              colorScheme="orange"
              onClick={() => {
                window.open(item.link, '_blank');
              }}
            >
              Go
            </Button>
            <ButtonGroup>
              <ResumeIcon item={item} />
            </ButtonGroup>
          </HStack>
        </CardFooter>
      </Stack>
    </Card>
  );
} 