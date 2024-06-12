import { StarIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import { action } from "~/routes/result.favorite";

type FavoriteButtonProps = {
  item: any;
};

export default function FavoriteButton({ item }: FavoriteButtonProps) {
  const fetcher = useFetcher<typeof action>();

  const favorite = fetcher.data?.favorite ?? item.favorite;

  return (
    <fetcher.Form action="/result/favorite" method="POST">
      <input type="hidden" name="link" value={item.link} hidden={true} />
      <IconButton
        isRound={true}
        variant="ghost"
        colorScheme="yellow"
        aria-label="Change theme"
        icon={<StarIcon fillOpacity={10} color={favorite ? 'orange' : 'gray'} />}
        type="submit"
      />
    </fetcher.Form>
  );
}
