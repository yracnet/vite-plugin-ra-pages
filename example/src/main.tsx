import jsonServerProvider from "ra-data-json-server";
import RAAdmin from "ra-main.jsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RAAdmin dataProvider={dataProvider} />
  </StrictMode>
);
