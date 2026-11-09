/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_BUG_REPORT_EMAIL: string;
    readonly VITE_REIMBURSEMENT_REPORT_EMAIL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}