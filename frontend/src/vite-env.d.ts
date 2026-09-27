/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vite-plugin-pwa/react" />
/// <reference types="vite-plugin-pwa/info" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Ionicons ships as a web component used directly in JSX.
declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      "ion-icon": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          name?: string;
          size?: string;
        },
        HTMLElement
      >;
    }
  }
}
