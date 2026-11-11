interface ImportMetaEnv {
  /** Absolute URL of status.json for the hero panel. Unset: the local /status/status.json. */
  readonly PUBLIC_STATUS_URL?: string;
  /** Seconds before the status file counts as stale. Unset: 180. */
  readonly PUBLIC_STATUS_STALE_S?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
