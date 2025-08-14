import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { raPages } from "../plugin/src/main.ts";
//import raPages from "vite-plugin-ra-pages";

// https://vite.dev/config/
export default defineConfig({
  server: { port: 8080 },
  plugins: [
    //
    react(),
    //@ts-ignore
    raPages({ lazyLoad: true }),
  ],
});
