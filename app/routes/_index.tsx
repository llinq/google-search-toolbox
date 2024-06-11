import { Input } from "@chakra-ui/react";
import { ActionFunction, redirect, type MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: ActionFunction = () => {
  return redirect('/search');
};

export default function Index() {
  return (
    <Input variant="filled" placeholder="Outline" />
  );
}
