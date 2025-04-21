import path from "path";
import { PluginOption } from "vite";
import { getConfigEntries } from "./scan";
import { writeRAAdmin } from "./write";

export type RAOpts = {
  root?: string;
  pageDir?: string;
  cacheDir?: string;
  aliasPage?: string;
};

export const raPages = ({
  root = process.cwd(),
  pageDir = "src/pages",
  cacheDir = ".ra",
  aliasPage = "ra-pages.jsx",
}: RAOpts = {}): PluginOption => {
  const rootPageDir = path.resolve(root, pageDir);
  const mainPageFile = path.resolve(root, cacheDir, aliasPage);
  const shouldRegenerate = (file: string) => file.startsWith(rootPageDir);

  const regenerate = () => {
    const config = getConfigEntries(rootPageDir);
    writeRAAdmin(mainPageFile, config);
  };

  regenerate();

  return {
    name: "vite-plugin-react-admin",
    enforce: "pre",

    config: () => {
      return {
        resolve: {
          alias: {
            [aliasPage]: mainPageFile,
          },
        },
      };
    },

    configureServer: (server) => {
      server.watcher.add(rootPageDir);

      server.watcher.on("add", (file) => {
        if (shouldRegenerate(file)) regenerate();
      });

      server.watcher.on("unlink", (file) => {
        if (shouldRegenerate(file)) regenerate();
      });

      server.watcher.on("change", (file) => {
        if (shouldRegenerate(file)) regenerate();
      });
    },
  };
};

export default raPages;
