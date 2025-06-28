import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import netlify from "@netlify/vite-plugin";

export default defineConfig({
  plugins: [
    remix(),
    tsconfigPaths(),
    netlify(),
  ],
});
