import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Check, AlertCircle } from 'lucide-react';
import { updateProfileSchema, changePasswordSchema } from '@/utils/validationSchemas';
import { useUpdateProfile, useChangePassword, useUploadAvatar } from '@/hooks/useUser';
import { useLogout } from '@/hooks/useAuth';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { useAuthStore } from '@/store/useAuthStore';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input, TextArea, FormField } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';

function InlineAlert({ variant = 'success', children }) {
  const isError = variant === 'error';
  return (
    <div
      className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium ${
        isError ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'
      }`}
    >
      {isError ? <AlertCircle className="h-4 w-4 shrink-0" /> : <Check className="h-4 w-4 shrink-0" />}
      {children}
    </div>
  );
}

function AvatarUploader() {
  const user = useAuthStore((s) => s.user);
  const fileInputRef = useRef(null);
  const uploadAvatar = useUploadAvatar();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadAvatar.mutate(file);
    e.target.value = '';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Avatar src={user?.avatarUrl} name={user?.fullName} size="xl" />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadAvatar.isPending}
          className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-elevated hover:opacity-90 transition disabled:opacity-60"
        >
          <Camera className="h-4 w-4" />
        </button>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
      </div>
      {uploadAvatar.isPending && <p className="text-xs text-muted-foreground mt-2">Đang tải ảnh lên...</p>}
      {uploadAvatar.isError && (
        <p className="text-xs text-destructive mt-2">{getApiErrorMessage(uploadAvatar.error, 'Tải ảnh thất bại.')}</p>
      )}
    </div>
  );
}

function ProfileInfoForm() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { fullName: user?.fullName || '', phone: user?.phone || '', bio: user?.bio || '' }
  });

  const onSubmit = (data) => {
    // Bỏ field rỗng để không gửi chuỗi rỗng đè lên giá trị cũ không cần thiết
    const payload = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== ''));
    updateProfile.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Họ và tên" error={errors.fullName?.message}>
          <Input error={!!errors.fullName} {...register('fullName')} />
        </FormField>
        <FormField label="Số điện thoại" error={errors.phone?.message}>
          <Input type="tel" placeholder="0901234567" error={!!errors.phone} {...register('phone')} />
        </FormField>
      </div>
      <FormField label="Giới thiệu bản thân" error={errors.bio?.message}>
        <TextArea placeholder="Chia sẻ vài dòng về sở thích du lịch của bạn..." error={!!errors.bio} {...register('bio')} />
      </FormField>

      {updateProfile.isSuccess && <InlineAlert>Cập nhật hồ sơ thành công.</InlineAlert>}
      {updateProfile.isError && (
        <InlineAlert variant="error">{getApiErrorMessage(updateProfile.error, 'Cập nhật thất bại.')}</InlineAlert>
      )}

      <div className="flex justify-end">
        <Button type="submit" isLoading={updateProfile.isPending} disabled={!isDirty}>
          Lưu thay đổi
        </Button>
      </div>
    </form>
  );
}

function ChangePasswordForm() {
  const changePassword = useChangePassword();
  const logout = useLogout();
  const [justChanged, setJustChanged] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ resolver: zodResolver(changePasswordSchema) });

  const onSubmit = ({ currentPassword, newPassword }) => {
    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          reset();
          setJustChanged(true);
        }
      }
    );
  };

  if (justChanged) {
    return (
      <div className="space-y-4">
        <InlineAlert>Đổi mật khẩu thành công. Vui lòng đăng nhập lại để tiếp tục.</InlineAlert>
        <Button variant="outline" onClick={() => logout.mutate()} isLoading={logout.isPending}>
          Đăng nhập lại
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Mật khẩu hiện tại" error={errors.currentPassword?.message}>
        <Input type="password" error={!!errors.currentPassword} {...register('currentPassword')} />
      </FormField>
      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Mật khẩu mới" error={errors.newPassword?.message}>
          <Input type="password" error={!!errors.newPassword} {...register('newPassword')} />
        </FormField>
        <FormField label="Nhập lại mật khẩu mới" error={errors.confirmNewPassword?.message}>
          <Input type="password" error={!!errors.confirmNewPassword} {...register('confirmNewPassword')} />
        </FormField>
      </div>

      {changePassword.isError && (
        <InlineAlert variant="error">{getApiErrorMessage(changePassword.error, 'Đổi mật khẩu thất bại.')}</InlineAlert>
      )}

      <div className="flex justify-end">
        <Button type="submit" variant="outline" isLoading={changePassword.isPending}>
          Đổi mật khẩu
        </Button>
      </div>
    </form>
  );
}

export default function ProfilePage() {
  return (
    <div>
      <PageHeader title="Hồ sơ của tôi" description="Quản lý thông tin cá nhân và bảo mật tài khoản." />

      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <AvatarUploader />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileInfoForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Đổi mật khẩu</CardTitle>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
