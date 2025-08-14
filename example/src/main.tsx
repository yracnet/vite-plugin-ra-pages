import jsonServerProvider from "ra-data-json-server";
import { StrictMode } from "react";
import { Layout } from "react-admin";
import { createRoot } from "react-dom/client";
import RAMain from "../.ra/ra-main";

const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");

export const MyLayout = ({ children }: any) => {
  //return <Layout menu={NestedMenu}>{children}</Layout>;
  return <Layout>{children}</Layout>;
};
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RAMain dataProvider={dataProvider} layout={MyLayout} />
  </StrictMode>
);
