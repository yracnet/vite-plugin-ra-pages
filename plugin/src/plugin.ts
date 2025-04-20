import path from "path";
import { Plugin } from "vite";
import { generateRAAdmin } from "./generate";
import { getConfigEntries } from "./scan";

export const raPlugin = ({
  root = process.cwd(),
  dir = "",
  cache = ".ra",
  aliasName = "raAdmin.jsx",
}: any): Plugin => {
  const appFile = path.resolve(root, cache, aliasName);
  const config = getConfigEntries(path.join(root, dir));
  generateRAAdmin(appFile, config);
  return {
    name: "vite-plugin-react-admin",
    enforce: "pre",
    config: () => {
      return {
        resolve: {
          alias: {
            [aliasName]: appFile,
          },
        },
      };
    },
  };
};

export default raPlugin;