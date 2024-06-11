import { As, Heading, HeadingProps, Highlight, ThemingProps } from "@chakra-ui/react";

type LogoProps = {
  as?: As;
  size?: ThemingProps["size"];
} & HeadingProps;

export default function Logo({ as = "h1", size = "4xl", ...props }: LogoProps) {
  return (
    <Heading {...props} as={as} size={size} textAlign="center">
      Google
      <br />
      <Highlight query="Search" styles={{ color: "blue.600" }}>
        Search
      </Highlight>
      <br />
      <Highlight query="Tool" styles={{ color: "orange.600" }}>
        Tool
      </Highlight>
    </Heading>
  );
}
