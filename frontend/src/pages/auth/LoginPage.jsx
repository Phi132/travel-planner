import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { loginSchema } from '@/utils/validationSchemas';
import { useLogin } from '@/hooks/useAuth';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { Input, FormField } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: zodResolver(loginSchema) });

  const loginMutation = useLogin();

  const onSubmit = (data) => loginMutation.mutate(data);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Chào mừng trở lại</h2>
      <p className="text-sm text-muted-foreground mb-6">Đăng nhập để tiếp tục hành trình của bạn.</p>

      {loginMutation.isError && (
        <div className="flex items-start gap-2 rounded-2xl bg-destructive/10 text-destructive px-4 py-3 mb-5 text-sm font-medium">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          {getApiErrorMessage(loginMutation.error, 'Đăng nhập thất bại.')}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Email" error={errors.email?.message}>
          <Input type="email" placeholder="ban@email.com" autoComplete="email" error={!!errors.email} {...register('email')} />
        </FormField>

        <FormField label="Mật khẩu" error={errors.password?.message}>
          <Input type="password" placeholder="••••••••" autoComplete="current-password" error={!!errors.password} {...register('password')} />
        </FormField>

        <Button type="submit" size="lg" className="w-full" isLoading={loginMutation.isPending}>
          Đăng nhập
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="text-primary font-semibold hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
