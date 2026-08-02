import { useEffect } from 'react';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * Access token chỉ sống trong bộ nhớ nên mất khi F5. Hook này chạy đúng 1
 * lần lúc App mount, thử gọi /api/auth/refresh (gửi kèm cookie httpOnly) để
 * lấy access token mới — nếu không có cookie hợp lệ thì coi như chưa đăng nhập.
 */
export function useBootstrapAuth() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    let isMounted = true;

    authService
      .refresh()
      .then((data) => {
        if (isMounted) setAuth(data);
      })
      .catch(() => {
        if (isMounted) clearAuth();
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
