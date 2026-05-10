import { useEffect, useState } from 'react';
import { ADMIN_ACCESS_EVENT, hasAdminAccess } from './adminAccess';

export const useAdminAccess = () => {
  const [isAdmin, setIsAdmin] = useState(hasAdminAccess);

  useEffect(() => {
    const syncAdminAccess = () => setIsAdmin(hasAdminAccess());

    window.addEventListener(ADMIN_ACCESS_EVENT, syncAdminAccess);
    window.addEventListener('storage', syncAdminAccess);

    return () => {
      window.removeEventListener(ADMIN_ACCESS_EVENT, syncAdminAccess);
      window.removeEventListener('storage', syncAdminAccess);
    };
  }, []);

  return isAdmin;
};
