import path from "path";
import { PluginOption } from "vite";
import { getConfigEntries } from "./scan";
import { writeRAAdmin } from "./write";

export type RAConfig = {
  root: string;
  pageDir: string;
  cacheDir: string;
  aliasPage: string;
  lazyLoad: boolean;
};
export type RAOpts = Partial<RAConfig>;

const ensureRAConfig = ({
  root = process.cwd(),
  pageDir = "src/pages",
  cacheDir = ".ra",
  aliasPage = "ra-pages.jsx",
  lazyLoad = false,
}: RAOpts): RAConfig => {
  return {
    root,
    pageDir,
    cacheDir,
    aliasPage,
    lazyLoad,
  };
};

export const raPages = (raOpts: RAOpts = {}): PluginOption => {
  const raConfig = ensureRAConfig(raOpts);
  const rootPageDir = path.resolve(raConfig.root, raConfig.pageDir);
  const mainPageFile = path.resolve(
    raConfig.root,
    raConfig.cacheDir,
    raConfig.aliasPage
  );
  const shouldRegenerate = (file: string) => file.startsWith(rootPageDir);

  const regenerate = () => {
    const config = getConfigEntries(rootPageDir);
    writeRAAdmin(mainPageFile, config, raConfig);
  };

  regenerate();

  return {
    name: "vite-plugin-react-admin",
    enforce: "pre",

    config: () => {
      return {
        resolve: {
          alias: {
            [raConfig.aliasPage]: mainPageFile,
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
