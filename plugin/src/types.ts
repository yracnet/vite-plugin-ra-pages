

// export type FileRole =
//     | "LIST"
//     | "CREATE"
//     | "EDIT"
//     | "SHOW"
//     | "INDEX"
//     | "PAGE"

// export type RoleMeta = {
//     role: FileRole,
//     lazy: boolean,
//     wrap: boolean,
//     menu: boolean,
//  }

//  export type RoleConfig = Record<string, RoleMeta>;


// export const DEFAULT_ROLE_MAPPING: RoleConfig = {
//     "Index"          : { role: "LIST",   lazy: false, wrap: true, menu: true  },
//     "create/Page"    : { role: "CREATE", lazy: false, wrap: true, menu: false },
//     "[id]/edit/Page" : { role: "EDIT",   lazy: false, wrap: true, menu: false },
//     "[id]/show/Page" : { role: "SHOW",   lazy: false, wrap: true, menu: false },
//     "PageIndex"      : { role: "INDEX",  lazy: false, wrap: true, menu: true  },
//     "Page"           : { role: "PAGE",   lazy: false, wrap: true, menu: false },
//     "LIST"                     : { role: "LIST",   lazy: false, wrap: true, menu: true  },
//     "CREATE"    : { role: "CREATE", lazy: false, wrap: true, menu: false },
//     "EDIT" : { role: "EDIT",   lazy: false, wrap: true, menu: false },
//     "SHOW"  : { role: "SHOW",   lazy: false, wrap: true, menu: false },
//     "INDEX"      : { role: "INDEX",  lazy: false, wrap: true, menu: true  },
//     "PAGE"           : { role: "PAGE",   lazy: false, wrap: true, menu: false },
// };

export type RAConfig = {
    root:      string;
    raAdminId:    string;
    raMenuId:    string;
    pageDir:   string;
    cacheDir:  string;
    raAdminFile:    string;
    raMenuFile:    string;
    raPkg:     string;
    lazyLoad:  boolean;
    withRole: boolean;
    // roleMapping: Record<string, RoleMeta>
};
export type RAOpts = {
    root?:     string;
    pageDir?:  string;
    cacheDir?: string;
    raAdminId?:   string;
    raAdminFile?:   string;
    raMenuId?:   string;
    raMenuFile?:   string;
    raPkg?:    string;
    lazyLoad?: boolean;
    withRole?: boolean;
    // roleMapping: Record<string, RoleMeta|false>
};

export const ensureRAConfig = ({
    root = process.cwd(),
    pageDir = "src/pages",
    cacheDir = ".ra",
    raAdminId = "ra-admin.jsx",
    raAdminFile = "ra-admin.jsx",
    raMenuId = "ra-menu.jsx",
    raMenuFile = "ra-menu.jsx",
    raPkg = 'react-admin',
    lazyLoad = false,
    withRole = false,
    //roleMapping = {},
}: RAOpts): RAConfig => {
    return {
        root,
        raAdminId,
        raMenuId,
        pageDir,
        cacheDir,
        raAdminFile,
        raMenuFile,
        raPkg,
        //roleMapping: { ...DEFAULT_ROLE_MAPPING, ...roleMapping },
        lazyLoad,
        withRole,
    };
};