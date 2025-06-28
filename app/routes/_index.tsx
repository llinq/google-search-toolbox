import { Input } from "@chakra-ui/react";
import { ActionFunction, redirect, type MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Google Search Tool" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <Input variant="filled" placeholder="Outline" />
  );
}
