import { type GlobOptionsWithFileTypesUnset, globSync } from "glob";
import path, { slash } from "slash-path";
import { ConfigEntry, RouteResource } from "./types";

const removeSufix = (name: string) =>
  name.replace(/\/(LIST|INDEX|PAGE)\.(jsx|tsx)$/, "");

const globSlash = (
  pattern: string,
  options: GlobOptionsWithFileTypesUnset
) => {
  const files = globSync(pattern, options);
  return files.map((path) => slash(path));
};

const getEntries = (root: string) => {
  const options = {
    cwd: root,
    ignore: "node_modules/**",
  };
  const resources = globSlash("**/LIST.@(jsx|tsx)", options).map(removeSufix);
  const others = globSlash("**/@(PAGE|INDEX).@(jsx|tsx)", options).filter(
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
  const files = globSlash("**/@(PAGE|INDEX|LIST).@(jsx|tsx)", {
    cwd: path.join(root, resource),
    ignore: "node_modules/**",
    nodir: true,
  });
  console.log(">>>>", files);
  const list = files.find((it) => it.startsWith("LIST."))!;
  const create = files.find((it) => it.startsWith("create/PAGE."));
  const withParam = files.filter((it) => it.startsWith("[id]/"));
  const edit = withParam.find((it) => it.startsWith("[id]/edit/PAGE."));
  const show = withParam.find((it) => it.startsWith("[id]/show/PAGE."));
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
  console.log(resources, others);
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