import { Icon, IconButton } from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import { FaWandMagicSparkles } from "react-icons/fa6";

type ResumeIconProps = {
  item: any;
};

export default function ResumeIcon({ item }: ResumeIconProps) {
  const fetcher = useFetcher<{ resumed?: boolean }>();

  const isResumed = fetcher.data?.resumed ?? item.resumed;

  return (
    <fetcher.Form action="/result/resume" method="POST">
      <input type="hidden" name="link" value={item.link} hidden={true} />
      <IconButton
        isRound={true}
        variant="ghost"
        colorScheme="blue"
        aria-label="Resume item"
        icon={<Icon as={FaWandMagicSparkles} fillOpacity={10} />}
        type="submit"
      />
    </fetcher.Form>
  );
} 