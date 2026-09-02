import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tanstackStart(),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  ssr: {
    noExternal: ["@tanstack/react-router"],
  },
});
