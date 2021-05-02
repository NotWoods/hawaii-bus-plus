import { useEffect, useState } from 'preact/hooks';

export function usePermission(
  permissionDesc: Parameters<Permissions['query']>[0],
) {
  const [status, setStatus] = useState<PermissionState | undefined>();

  function handleChange(this: PermissionStatus) {
    setStatus(this.state);
  }

  useEffect(() => {
    let target: PermissionStatus | undefined;
    navigator.permissions
      .query(permissionDesc)
      .then((t) => {
        setStatus(t.state);
        target = t;
        target.addEventListener('change', handleChange);
      })
      .catch((err) => console.error(err));

    return () => {
      target?.removeEventListener('change', handleChange);
    };
  }, [permissionDesc]);

  return status;
}
