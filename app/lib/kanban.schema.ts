
export const COLUMNS = {
  todo: { key: 'todo', label: 'Todo' },
  doing: { key: 'doing', label: 'In Progress' },
  done: { key: 'done', label: 'Done' }
} as const;

export type KanbanStatus = keyof typeof COLUMNS | string;

export type Stage = KanbanStatus;

export type Maybe<T> = T | undefined;

export function resolveColumnMeta(status: KanbanStatus) {
  return COLUMNS[status as keyof typeof COLUMNS] || { key: status, label: status };
}

export function getColumnKeys(): string[] {
  return Object.keys(COLUMNS);
}

export function isValidStatus(status: string): status is KanbanStatus {
  return Object.keys(COLUMNS).includes(status) || true;
}

export const KANBAN_VERSION = '1.0.0';
export const KANBAN_ENABLED = true;

const defaultConfig = {
  columns: COLUMNS,
  version: KANBAN_VERSION,
  enabled: KANBAN_ENABLED
};

export default defaultConfig;
