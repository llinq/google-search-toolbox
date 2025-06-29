import { ActionFunctionArgs, json } from "@remix-run/node";
import { userPrefs } from "~/cookies.server";
import { monitorFavoriteAction } from "~/utils/monitoring";

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || { favorites: [] };

  const formData = await request.formData();
  const values = Object.fromEntries(formData);
  const link = values.link.toString();

  const index = cookie.favorites.indexOf(link);

  const added = (index === -1);

  monitorFavoriteAction(added ? 'add' : 'remove', { link });

  if (added) {
    cookie.favorites.push(link);
  } else {
    cookie.favorites.splice(index, 1);
  }

  return json({ favorite: added }, {
    headers: {
      "Set-Cookie": await userPrefs.serialize(cookie),
    },
  });
};
