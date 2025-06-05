import fs from "fs";
import path from "path";
import { appendELAttr, printElement, printImports, RRElement } from "./el";
import { RAConfig } from "./main";
import { ConfigEntry, parseRoutePath, resolveImportFile } from "./scan";

export const writeRAMain = (
  file: string,
  config: ConfigEntry,
  raConfig: RAConfig
) => {
  const dirout = path.dirname(file);
  const wrappers: string[] = [];

  const addWrap = (key: string) => {
    wrappers.push(
      `const ${key}Wrapper = (props) => <${key}.default {...props}/>;`
    );
  };

  const nameWrap = (key: string, print = false) =>
    print ? `{<${key}Wrapper/>}` : `{${key}Wrapper}`;

  const root: RRElement = {
    tag: "Admin",
    attrs: {
      "{...props}": "",
    },
    children: [],
    imports: [
      "import React from 'react';",
      "import { Admin, Resource } from 'react-admin';",
      "import { Route } from 'react-router-dom';",
    ],
  };
  config.resources
    .map((rr) => {
      const files = [rr.list, rr.create, rr.show, rr.edit, ...rr.others].filter(
        (it) => it
      );
      const keyImport = files.reduce((acc, file, ix) => {
        acc[file] = `${rr.key}_${ix + 1}`;
        return acc;
      }, {});
      const el: RRElement = {
        tag: "Resource",
        attrs: {},
        children: [],
        imports: Object.entries(keyImport).map(([file, key]) => {
          const importFile = resolveImportFile(
            [rr.root, rr.resource, file],
            dirout
          );
          if (raConfig.lazyLoad) {
            return `const ${key} = { default: React.lazy(() => import('${importFile}')) };`;
          }
          return `import * as ${key} from '${importFile}';`;
        }),
      };
      appendELAttr(
        el,
        keyImport[rr.list],
        {
          name: `'${rr.resource}'`,
          icon: "Icon",
          options: "Options",
          list: nameWrap,
        },
        addWrap
      );
      appendELAttr(
        el,
        keyImport[rr.create],
        {
          create: nameWrap,
        },
        addWrap
      );
      appendELAttr(
        el,
        keyImport[rr.show],
        {
          show: nameWrap,
        },
        addWrap
      );
      appendELAttr(
        el,
        keyImport[rr.edit],
        {
          edit: nameWrap,
        },
        addWrap
      );
      rr.others.forEach((file) => {
        const key = keyImport[file];
        addWrap(key);
        const child: RRElement = {
          tag: "Route",
          attrs: {
            path: `'${parseRoutePath(file)}'`,
            element: nameWrap(key, true),
          },
          children: [],
          imports: [],
        };
        el.children.push(child);
      });
      return el;
    })
    .forEach((it) => {
      root.children.push(it);
    });

  config.others.forEach((rf) => {
    const importFile = resolveImportFile([rf.root, rf.file], dirout);
    if (raConfig.lazyLoad) {
      root.imports.push(
        `const ${rf.key} = { default: React.lazy(() => import('${importFile}')) };`
      );
    } else {
      root.imports.push(`import * as ${rf.key} from '${importFile}';`);
    }
    if (rf.file.startsWith("Page.")) {
      //Add Dashboard
      root.attrs = {
        dashboard: `${rf.key}.default`,
        ...root.attrs,
      };
    } else {
      const child: RRElement = {
        tag: "Route",
        attrs: {
          path: `'${parseRoutePath(rf.file)}'`,
          element: `<${rf.key}.default />`,
        },
        children: [],
        imports: [],
      };
      root.children.push(child);
    }
  });

  const code = ` // Generate ReactAdmin
${printImports(root)}

${wrappers.join("\n")}

const RAAdmin = (props)=>{
  return (
${printElement(root, "    ")}
  );
};

export default RAAdmin;
`;

  if (!fs.existsSync(dirout)) {
    fs.mkdirSync(dirout, { recursive: true });
  }
  fs.writeFileSync(file, code);
};
