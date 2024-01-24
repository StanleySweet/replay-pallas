/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_PASSWORD_SALT: string
    readonly VITE_EMAIL_SALT: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
