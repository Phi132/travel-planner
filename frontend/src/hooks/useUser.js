import { useMutation } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { useAuthStore } from '@/store/useAuthStore';

export function useUpdateProfile() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const accessToken = useAuthStore((s) => s.accessToken);

  return useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (user) => setAuth({ user, accessToken })
  });
}

export function useChangePassword() {
  return useMutation({ mutationFn: userService.changePassword });
}

export function useUploadAvatar() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const accessToken = useAuthStore((s) => s.accessToken);

  return useMutation({
    mutationFn: userService.uploadAvatar,
    onSuccess: (user) => setAuth({ user, accessToken })
  });
}
