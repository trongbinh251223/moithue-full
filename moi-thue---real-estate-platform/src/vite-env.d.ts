/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Canonical public URL of the SPA (no trailing slash), e.g. https://moithue.com */
  readonly VITE_SITE_URL?: string;
  /** Nest dev server for Vite proxy (default http://127.0.0.1:3333) */
  readonly VITE_API_PROXY_TARGET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
