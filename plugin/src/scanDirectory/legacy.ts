import { type GlobOptionsWithFileTypesUnset, globSync } from "glob";
import path, {slash} from "slash-path";
import { ConfigEntry, RouteResource } from "./types";



const removeSufix = (name: string) =>
  name.replace(/\/(Index|Page)\.(jsx|tsx)$/, "");

const globSlash = (
  pattern: string,
  options: GlobOptionsWithFileTypesUnset
) => {
  const files = globSync(pattern, options);
  return files.map((path) =>  slash(path));
};

const getEntries = (root: string) => {
  const options = {
    cwd: root,
    ignore: "node_modules/**",
  };
  const resources = globSlash("**/Index.@(jsx|tsx)", options).map(removeSufix);
  const others = globSlash("**/@(Page|PageIndex).@(jsx|tsx)", options).filter(
    (path) => !resources.some((prefix) => path.startsWith(prefix + "/"))
  );
  return {
    resources,
    others,
  };
};

type Config = {
  key: string;
  root: string;
  resource: string;
};

const getRouteResource = ({
  resource,
  root,
  key,
}: Config): RouteResource => {
  const files = globSlash("**/@(Page|Index).@(jsx|tsx)", {
    cwd: path.join(root, resource),
    ignore: "node_modules/**",
    nodir: true,
  });
  const list = files.find((it) => it.startsWith("Index."))!;
  const create = files.find((it) => it.startsWith("create/Page."));
  const withParam = files.filter((it) => it.startsWith("[id]/"));
  const edit = withParam.find((it) => it.startsWith("[id]/edit/Page."));
  const show = withParam.find((it) => it.startsWith("[id]/show/Page."));
  const others = files.filter(
    (it) => it !== list && it !== create && it !== edit && it !== show
  );
  return {
    key,
    root,
    resource,
    list,
    show,
    create,
    edit,
    others,
  };
};


const getConfigEntries = (root: string): ConfigEntry => {
  const { resources, others } = getEntries(root);
  const routeResources = resources.map((resource, ix) => {
    return getRouteResource({
      resource,
      root,
      key: `R_${ix + 1}`,
    });
  });
  const size = routeResources.length + 1;
  const routeFiles = others.map((file, ix) => {
    return {
      key: `R_${ix + size}`,
      file,
      root,
    };
  });
  return {
    resources: routeResources,
    others: routeFiles,
  };
};


export default getConfigEntries;