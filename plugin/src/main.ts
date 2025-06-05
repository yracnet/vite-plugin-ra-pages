import path from "path";
import { PluginOption } from "vite";
import { getConfigEntries } from "./scan";
import { writeRAMain } from "./writeRAMain";
import { writeRAMenu } from "./writeRAMenu";

export type RAConfig = {
  root: string;
  pageDir: string;
  cacheDir: string;
  raMain: string;
  raMenu: string;
  lazyLoad: boolean;
};
export type RAOpts = Partial<RAConfig>;

const ensureRAConfig = ({
  root = process.cwd(),
  pageDir = "src/pages",
  cacheDir = ".ra",
  raMain = "ra-main.jsx",
  raMenu = "ra-menu.jsx",
  lazyLoad = false,
}: RAOpts): RAConfig => {
  return {
    root,
    pageDir,
    cacheDir,
    raMain,
    raMenu,
    lazyLoad,
  };
};

export const raPages = (raOpts: RAOpts = {}): PluginOption => {
  const raConfig = ensureRAConfig(raOpts);
  const rootPageDir = path.resolve(raConfig.root, raConfig.pageDir);
  const raMainFile = path.resolve(
    raConfig.root,
    raConfig.cacheDir,
    raConfig.raMain
  );
  const raMenuFile = path.resolve(
    raConfig.root,
    raConfig.cacheDir,
    raConfig.raMenu
  );
  const shouldRegenerate = (file: string) => file.startsWith(rootPageDir);

  const regenerate = () => {
    const config = getConfigEntries(rootPageDir);
    writeRAMain(raMainFile, config, raConfig);
    writeRAMenu(raMenuFile, config, raConfig);
  };

  regenerate();
  return {
    name: "vite-plugin-ra-pages",
    enforce: "pre",
    config: () => {
      return {
        resolve: {
          alias: {
            [raConfig.raMain]: raMainFile,
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
