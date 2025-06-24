export interface Message {
  summary: string;

  detail?: string;

  severity: string;
}

export const Severity = {
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  DANGER: 'danger',
};
