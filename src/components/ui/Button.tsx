import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'gold' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none';

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'px-3.5 py-1.5 text-xs gap-1.5',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-7 py-3 text-base gap-2.5 font-semibold',
    };

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        'bg-forest-800 text-cream-50 hover:bg-forest-900 border border-forest-700 focus:ring-forest-600 shadow-sm',
      secondary:
        'bg-cream-100 text-ink-900 hover:bg-cream-200 border border-cream-300 focus:ring-cream-400',
      gold:
        'bg-gold-500 text-forest-950 hover:bg-gold-400 border border-gold-600 focus:ring-gold-500 font-semibold shadow-sm',
      outline:
        'bg-transparent text-ink-800 hover:bg-cream-100 border border-cream-300 focus:ring-forest-600',
      danger:
        'bg-rose-700 text-white hover:bg-rose-800 border border-rose-800 focus:ring-rose-600 shadow-sm',
      ghost:
        'bg-transparent text-ink-700 hover:bg-cream-100 border border-transparent focus:ring-cream-400',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
