export type RouteResource = {
    key: string;
    root: string;
    resource: string;
    list: any;
    create?: any;
    edit?: any;
    show?: any;
    others: any[];
};

export type RouteFile = {
    key: string;
    root: string;
    file: string;
};

export type ConfigEntry = {
    resources: RouteResource[];
    others: RouteFile[];
};

export type ScanDir = (dir: string) => ConfigEntry;