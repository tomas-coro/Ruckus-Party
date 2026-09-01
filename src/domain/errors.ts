export type AppError =
  | { type: 'invalid-input'; code: 'PLAYERS_COUNT' | 'PLAYER_NAME' | 'SETUP_RESOURCE'; field?: string }
  | { type: 'invalid-transition'; code: 'COMMAND_NOT_ALLOWED'; phase: string }
  | {
      type: 'storage-unavailable' | 'read-failed' | 'write-failed' | 'migration-failed';
      code: string;
      safeState: 'preserved';
    }
  | { type: 'missing-content' | 'missing-translation'; code: string; key: string }
  | { type: 'update-offline' | 'update-check-failed'; code: string }
  | { type: 'confirmation-required'; code: 'DISCARD_UNSAVED_SETUP' }
  | { type: 'unknown-route'; code: 'ROUTE_UNKNOWN'; route: string }
  | { type: 'unexpected-ui-error'; code: 'UNEXPECTED_UI_ERROR' };
