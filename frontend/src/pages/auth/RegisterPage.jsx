import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { registerSchema } from '@/utils/validationSchemas';
import { useRegister } from '@/hooks/useAuth';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { Input, FormField } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: zodResolver(registerSchema) });

  const registerMutation = useRegister();

  const onSubmit = ({ confirmPassword, phone, ...data }) =>
    registerMutation.mutate({ ...data, ...(phone ? { phone } : {}) });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Tạo tài khoản mới</h2>
      <p className="text-sm text-muted-foreground mb-6">Bắt đầu lên kế hoạch cho chuyến đi tiếp theo của bạn.</p>

      {registerMutation.isError && (
        <div className="flex items-start gap-2 rounded-2xl bg-destructive/10 text-destructive px-4 py-3 mb-5 text-sm font-medium">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          {getApiErrorMessage(registerMutation.error, 'Đăng ký thất bại.')}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Họ và tên" error={errors.fullName?.message}>
          <Input placeholder="Nguyễn Văn A" autoComplete="name" error={!!errors.fullName} {...register('fullName')} />
        </FormField>

        <FormField label="Email" error={errors.email?.message}>
          <Input type="email" placeholder="ban@email.com" autoComplete="email" error={!!errors.email} {...register('email')} />
        </FormField>

        <FormField label="Số điện thoại (không bắt buộc)" error={errors.phone?.message}>
          <Input type="tel" placeholder="0901234567" autoComplete="tel" error={!!errors.phone} {...register('phone')} />
        </FormField>

        <FormField label="Mật khẩu" error={errors.password?.message}>
          <Input type="password" placeholder="Ít nhất 6 ký tự" autoComplete="new-password" error={!!errors.password} {...register('password')} />
        </FormField>

        <FormField label="Nhập lại mật khẩu" error={errors.confirmPassword?.message}>
          <Input type="password" placeholder="••••••••" autoComplete="new-password" error={!!errors.confirmPassword} {...register('confirmPassword')} />
        </FormField>

        <Button type="submit" size="lg" className="w-full" isLoading={registerMutation.isPending}>
          Đăng ký
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Đã có tài khoản?{' '}
        <Link to="/login" className="text-primary font-semibold hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
