export type RAConfig = {
  root: string;
  pageDir: string;
  cacheDir: string;
  aliasPage: string;
  lazyLoad: boolean;
};

export type RAOpts = Partial<RAConfig>;

export const ensureRAConfig = ({
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