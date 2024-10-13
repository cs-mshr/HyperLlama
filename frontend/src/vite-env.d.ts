/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GULLU_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}