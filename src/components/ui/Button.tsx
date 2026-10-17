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
        'bg-gradient-to-r from-burgundy-900 via-burgundy-800 to-wine-900 text-white hover:from-burgundy-950 hover:to-wine-950 border border-rose-400/30 shadow-md focus:ring-burgundy-500',
      secondary:
        'bg-cream-100/90 text-burgundy-950 hover:bg-cream-200 border border-rose-200/60 focus:ring-rose-300',
      gold:
        'bg-gradient-to-r from-gold-400 via-gold-500 to-rose-400 text-burgundy-950 hover:from-gold-300 hover:to-rose-300 border border-gold-400/50 font-semibold shadow-md focus:ring-gold-400',
      outline:
        'bg-transparent text-burgundy-950 hover:bg-burgundy-50 border border-burgundy-800/30 focus:ring-burgundy-500',
      danger:
        'bg-rose-700 text-white hover:bg-rose-800 border border-rose-800 focus:ring-rose-500 shadow-sm',
      ghost:
        'bg-transparent text-burgundy-900 hover:bg-burgundy-50 border border-transparent focus:ring-burgundy-400',
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
