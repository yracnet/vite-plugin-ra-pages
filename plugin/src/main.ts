import path from "path";
import { type PluginOption } from "vite";
import { getConfigEntries } from "./scanDirectory2";
import { writeAdminWrapper } from "./writeAdminWrapper";
import { writeMenuWrapper } from "./writeMenuWrapper";
import { ensureRAConfig, type RAOpts } from "./types";

export const raPages = (raOpts: RAOpts = {}): PluginOption => {
  const raConfig = ensureRAConfig(raOpts);
  const rootPageDir = path.resolve(raConfig.root, raConfig.pageDir);
  const raAdminFileFile = path.resolve(
    raConfig.root,
    raConfig.cacheDir,
    raConfig.raAdminFile
  );
  const raMenuFileFile = path.resolve(
    raConfig.root,
    raConfig.cacheDir,
    raConfig.raMenuFile
  );
  const shouldRegenerate = (file: string) => file.startsWith(rootPageDir);

  const regenerate = () => {
    const config = getConfigEntries(rootPageDir);
    writeAdminWrapper(raAdminFileFile, config, raConfig);
    writeMenuWrapper(raMenuFileFile, config, raConfig);
  };

  regenerate();
  return {
    name: "vite-plugin-ra-pages",
    enforce: "pre",
    config: () => {
      return {
        resolve: {
          alias: {
            [raConfig.raAdminId]: raAdminFileFile,
            [raConfig.raMenuId]: raMenuFileFile,
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
