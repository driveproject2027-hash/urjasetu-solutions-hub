import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tanstackStart({
      // The deployed server was returning the SSR 404 page for every nested
      // route (only "/" and "/auth" worked) because the custom src/server.ts
      // entry replaced the framework's default server handler, which owns
      // route matching. Let TanStack Start wire its own server entry.
      customViteReactPlugin: true,
    }),
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
