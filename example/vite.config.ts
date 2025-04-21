import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { raPages } from "../plugin/src/main.ts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    //
    react(),
    raPages(),
  ],
});
