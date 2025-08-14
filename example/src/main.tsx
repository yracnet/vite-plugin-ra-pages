import jsonServerProvider from "ra-data-json-server";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import RAAdmin from "../.ra/ra-pages";
//import RAAdmin from "../node_modules/.ra/ra-pages.jsx";
//import RAAdmin from "./ra-pages.jsx";

const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");

const authAdminProvider = {
  login: async () => {},
  logout: async () => {},
  checkAuth: async () => {},
  checkError: async () => {},
  getPermissions: async () => {
    return ["users"];
  },
  canAccess: async ({ resource }) => {
    console.log(">>>>", resource);
    return ["posts"].includes(resource);
  },
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RAAdmin dataProvider={dataProvider} authProvider={authAdminProvider} />
  </StrictMode>
);
