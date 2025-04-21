import jsonServerProvider from "ra-data-json-server";
import RAAdmin from "ra-pages.jsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
//import RAAdmin from "../node_modules/.ra/ra-pages.jsx";
//import RAAdmin from "./ra-pages.jsx";

const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RAAdmin dataProvider={dataProvider} />
  </StrictMode>
);
