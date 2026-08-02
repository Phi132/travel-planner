import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Input = forwardRef(({ className, type = 'text', error, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="relative">
      <input
        ref={ref}
        type={isPassword && showPassword ? 'text' : type}
        className={cn(
          'flex h-12 w-full rounded-2xl border bg-card px-4 text-[15px] text-foreground placeholder:text-muted-foreground transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring',
          error ? 'border-destructive focus:ring-destructive/40' : 'border-border',
          isPassword && 'pr-11',
          className
        )}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
});
Input.displayName = 'Input';

export function FormField({ label, error, children, hint }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-foreground/90">{label}</label>}
      {children}
      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
      {!error && hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export const TextArea = forwardRef(({ className, error, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'flex min-h-[100px] w-full rounded-2xl border bg-card px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground transition-colors resize-none',
      'focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring',
      error ? 'border-destructive focus:ring-destructive/40' : 'border-border',
      className
    )}
    {...props}
  />
));
TextArea.displayName = 'TextArea';
