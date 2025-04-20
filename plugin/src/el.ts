export type RRElement = {
  tag: string;
  attrs: Record<string, string>;
  children: RRElement[];
  imports: string[];
};

type FnName = (key: string) => string;
export const appendELAttr = (
  el: RRElement,
  key: string,
  attrs: Record<string, string | FnName>,
  on: (key: string) => void
) => {
  if (key) {
    Object.entries(attrs).forEach(([k, v]) => {
      if (typeof v === "function") {
        v = v(key);
      }
      if (v.startsWith("{") && v.endsWith("}")) {
        el.attrs[k] = v;
      } else if (v.startsWith("'") && v.endsWith("'")) {
        el.attrs[k] = v;
      } else if (v.startsWith('"') && v.endsWith('"')) {
        el.attrs[k] = v;
      } else {
        el.attrs[k] = `${key}.${v}`;
      }
    });
    on(key);
  }
};

export const printImports = (root: RRElement) => {
  const collected: string[] = [];
  const walk = (node: RRElement) => {
    node.imports.forEach((imp) => collected.push(imp));
    node.children.forEach((child) => walk(child));
  };
  walk(root);
  return collected.sort().join("\n");
};

export const printElement = (el: RRElement, tab: string = "  "): string => {
  const tab1 = " ".padStart(el.tag.length + 2, " ");

  const attrs = Object.entries(el.attrs)
    .map(([k, v]) => {
      if (k.startsWith("{") && k.endsWith("}")) {
        return k;
      } else if (v.startsWith("'") && v.endsWith("'")) {
        return `${k}=${v}`;
      } else if (v.startsWith('"') && v.endsWith('"')) {
        return `${k}=${v}`;
      } else if (v.startsWith("{") && v.endsWith("}")) {
        return `${k}=${v}`;
      } else {
        return `${k}={${v}}`;
      }
    })
    .join(`\n${tab}${tab1}`);
  const openTag = attrs ? `<${el.tag} ${attrs}>` : `<${el.tag}>`;
  const children = el.children.map((child) => printElement(child, tab + "  "));
  return [`${tab}${openTag}`, ...children, `${tab}</${el.tag}>`].join("\n");
};
