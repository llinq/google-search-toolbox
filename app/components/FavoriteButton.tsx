import { StarIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import { action } from "~/routes/result.favorite";
import { useEffect } from "react";
import { trackButtonClick } from "~/utils/analytics";

type FavoriteButtonProps = {
  item: any;
  onToggleFavorite?: (newFavoriteState: boolean) => void;
};

export default function FavoriteButton({ item, onToggleFavorite }: FavoriteButtonProps) {
  const fetcher = useFetcher<typeof action>();

  const favorite = fetcher.data?.favorite ?? item.favorite;

  useEffect(() => {
    if (fetcher.data && onToggleFavorite) {
      onToggleFavorite(fetcher.data.favorite);
    }
  }, [fetcher.data, onToggleFavorite]);

  const handleFavoriteClick = () => {
    trackButtonClick('favorite', favorite ? 'remove' : 'add');
  };

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
        onClick={handleFavoriteClick}
      />
    </fetcher.Form>
  );
}
