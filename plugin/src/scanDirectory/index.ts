import { RAConfig } from "src/types";
import legacy from "./legacy"
import path from "slash-path";
import v2 from "./v2"
import { ConfigEntry, ScanDir } from "./types";

const wrapper: Record<string, ScanDir> = {
    "legacy": legacy,
    "v2": v2,
}

export const getConfigEntries = (root: string, raConfig: RAConfig): ConfigEntry => {
    const scan = wrapper[raConfig.mode] ?? wrapper.legacy;
    return scan(root);
}

export const resolveImportFile = (pathFile: string[], root: string) => {
    let importFile = path.relative(root, path.join(...pathFile));
    if (!importFile.startsWith(".")) {
        importFile = `./${importFile}`;
    }
    return importFile;
};

export const parseRoutePath = (name: string) =>
    name
        .replace(/\/(Index|Page)\.(jsx|tsx)$/, "")
        .replace("[", ":")
        .replace("]", "");