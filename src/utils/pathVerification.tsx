export const actionAuthorization = (
  toBeVerifiedPath: string,
  permissions: any[]
) => {
  const access = permissions.some(
    (permission: any) => permission.path === toBeVerifiedPath
  );
  return access;
};
