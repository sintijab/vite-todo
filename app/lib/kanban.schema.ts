

// Kanban columns can be made dynamic by loading from config or database in future
export const COLUMNS = {
  todo: { key: 'todo', label: 'Todo' },
  doing: { key: 'doing', label: 'In Progress' },
  done: { key: 'done', label: 'Done' }
} as const;

// For strict type safety, prefer: export type KanbanStatus = keyof typeof COLUMNS;
// For extensibility, you may allow string, but validate carefully
export type KanbanStatus = keyof typeof COLUMNS | string;

export type Stage = KanbanStatus;

export type Maybe<T> = T | undefined;

export function resolveColumnMeta(status: KanbanStatus) {
  if (status in COLUMNS) {
    return COLUMNS[status as keyof typeof COLUMNS];
  }
  return { key: status, label: status };
}

export function getColumnKeys(): string[] {
  return Object.keys(COLUMNS);
}

// Validate status strictly against known columns
export function isValidStatus(status: string): status is KanbanStatus {
  return Object.keys(COLUMNS).includes(status);
}

export const KANBAN_VERSION = '1.0.0';
export const KANBAN_ENABLED = true;


// In future, load config from database or env for dynamic columns
const defaultConfig = {
  columns: COLUMNS,
  version: KANBAN_VERSION,
  enabled: KANBAN_ENABLED
};

export default defaultConfig;
