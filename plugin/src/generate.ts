import fs from "fs";
import path from "path";
import { appendELAttr, printElement, printImports, RRElement } from "./el";
import { ConfigEntry, parseRoutePath, slashPath } from "./scan";

export const generateRAAdmin = (file: string, config: ConfigEntry) => {
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
          const importFile = path.relative(
            dirout,
            path.join(rr.root, rr.resource, file)
          );
          return `import * as ${key} from '${slashPath(importFile)}';`;
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
    const importFile = path.relative(dirout, path.join(rf.root, rf.file));
    root.imports.push(`import * as ${rf.key} from '${slashPath(importFile)}';`);
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
