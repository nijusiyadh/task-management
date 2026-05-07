export const PERMISSION_MAP = {
   task: ['create', 'read', 'update', 'delete', 'assign'],
} as const;

export type PermissionMap = typeof PERMISSION_MAP;
export type Resource = keyof PermissionMap;
export type Action<R extends Resource> = PermissionMap[R][number];
