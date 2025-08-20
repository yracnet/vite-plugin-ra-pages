# vite-plugin-ra-pages

> Vite plugin to automatically generate routes for React-Admin from a folder structure

## Features

- 📁 Scans the `src/pages` folder (you can configure another path).
- 🧠 Interprets structures like `users/Index.jsx` as a resource.
- 🧠 Interprets structures like `posts/[id]/edit/Page.jsx` as a path.
- ⚛️ Automatically generates React-Admin routes using `<Resource />` and nested `<Route />`.
- 🧩 Uses individual wrappers per component to avoid `cloneElement` bugs in React-Admin.
- 🚀 Exports a pre-mounted `RAAdmin` component ready to use.

## Installation

```bash
yarn add -D vite-plugin-ra-pages
```

## Basic Usage

In your `vite.config.js`:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import raPages from "vite-plugin-ra-pages";

export default defineConfig({
  plugins: [
    react(),
    raPages({
      // Default
      // root: process.cwd(),
      // pageDir: "src/pages",
      // cacheDir: ".ra",
      // aliasPage: "ra-pages.jsx",
    }),
  ],
});
```

## Folder Conventions and Mapping

The plugin interprets the folder structure like this:

- `Page.jsx` represents a page
- `Index.jsx` represents a main list and is assumed to be the `list` component inside a `<Resource>`, marking the entire folder as a resource

### Example structure:

```
src/pages/
│   Page.jsx            // Dashboard
├───dashboard           // or
│   │   Page.jsx        // Dashboard
├───posts
│   │   Index.jsx       // Resource posts
│   ├───create/Page.jsx
│   ├───notify/Page.jsx
│   └───[id]
│       ├───confirm/Page.jsx
│       ├───docs/Page.jsx
│       ├───edit/Page.jsx
│       ├───notify/Page.jsx
│       ├───report/Page.jsx
│       └───show/Page.jsx
├───profile           // Custom Routes
│   ├───config/Page.jsx
│   └───info/Page.jsx
└───users             // Resource posts (list, create, edit, show)
    │   Index.jsx
    ├───create/Page.jsx
    └───[id]
        ├───edit/Page.jsx
        └───show/Page.jsx
```

## Generated Code

This tree is automatically turned into a complete `RAAdmin` like this:

```tsx
import { Admin, Resource } from "react-admin";
import { Route } from "react-router-dom";

const RAAdmin = (props) => {
  return (
    <Admin dashboard={R_3.default} {...props}>
      <Resource
        name="users"
        icon={R_1_1.Icon}
        options={R_1_1.Options}
        list={R_1_1Wrapper}
        create={R_1_2Wrapper}
        show={R_1_3Wrapper}
        edit={R_1_4Wrapper}
      />

      <Resource
        name="posts"
        icon={R_2_1.Icon}
        options={R_2_1.Options}
        list={R_2_1Wrapper}
        create={R_2_2Wrapper}
        show={R_2_3Wrapper}
        edit={R_2_4Wrapper}
      >
        <Route path=":id/report" element={<R_2_5Wrapper />} />
        <Route path=":id/notify" element={<R_2_6Wrapper />} />
        <Route path=":id/docs" element={<R_2_7Wrapper />} />
        <Route path=":id/confirm" element={<R_2_8Wrapper />} />
        <Route path="notify" element={<R_2_9Wrapper />} />
      </Resource>

      <Route path="profile/info" element={<R_4.default />} />
      <Route path="profile/config" element={<R_5.default />} />
    </Admin>
  );
};

export default RAAdmin;
```

## Index.jsx

The `Index.jsx` file, when detected as a resource list, also defines the Icon and Options:

```jsx
import { Badge } from "@mui/icons-material";
import { ListGuesser } from "react-admin";

export default () => <ListGuesser />;

export const Icon = Badge;

export const Options = {
  label: "Post Index",
};
```

## React-Admin Fix

React-Admin performs a `cloneElement` of the components defined as `list`, `edit`, `create`, `show`. This can break Hot Module Replacement (HMR), which prevents hot reloading during development.

To solve this, the plugin automatically generates _wrapper_ components for each of these elements. These wrappers ensure that the original components can reload without errors or loss of state.

```jsx
const R_1_1Wrapper = (props) => <R_1_1.default {...props} />;
const R_1_2Wrapper = (props) => <R_1_2.default {...props} />;
const R_1_3Wrapper = (props) => <R_1_3.default {...props} />;
const R_1_4Wrapper = (props) => <R_1_4.default {...props} />;
```

## `RAAdmin`

The `RAAdmin` component is automatically generated. It includes:

- All resources
- Nested subroutes
- Dashboard if `src/pages/Page.jsx` exists

You can import it like this:

```jsx
import RAAdmin from 'ra-pages.jsx';

function App() {
  return <RAAdmin dataProvider={...} authProvider={...} />;
}
```

## Internal Behavior

The plugin scans the folder tree under `src/pages` (or the directory you configure) and generates an intermediate module in `cacheDir` (default is `.ra/ra-pages.jsx`). This intermediate file contains the `RAAdmin` component and all necessary imports, including the wrappers that fix the `cloneElement` issue in React-Admin.

This file is automatically referenced via the alias `ra-pages.jsx`, so you can import it directly without worrying about its real location:

```js
import RAAdmin from "ra-pages.jsx";
```

The file is regenerated automatically when changes are detected in the `src/pages` file tree.

## Requirements

- React-Admin v4 or higher
- Vite

## License

MIT
