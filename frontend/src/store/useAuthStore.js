import { create } from 'zustand';

/**
 * Access token chỉ lưu trong bộ nhớ (không persist ra localStorage) để giảm
 * rủi ro XSS. Khi tải lại trang, App sẽ tự gọi /api/auth/refresh (dựa vào
 * httpOnly cookie) để khôi phục phiên đăng nhập — xem hooks/useAuth.js.
 */
export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isInitializing: true, // true trong lúc đang thử khôi phục phiên đăng nhập lúc tải trang

  setAuth: ({ user, accessToken }) => set({ user, accessToken, isInitializing: false }),
  clearAuth: () => set({ user: null, accessToken: null, isInitializing: false }),
  finishInitializing: () => set({ isInitializing: false })
}));
