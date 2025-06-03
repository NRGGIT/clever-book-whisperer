/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Runtime configuration injected by Docker
interface WindowEnv {
  VITE_API_BASE_URL: string
}

declare global {
  interface Window {
    ENV?: WindowEnv
  }
}

export {}
