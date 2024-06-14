import { createCookie } from "@remix-run/cloudflare"; // or cloudflare/deno

export const userPrefs = createCookie("user-prefs", {
  maxAge: undefined,
});
