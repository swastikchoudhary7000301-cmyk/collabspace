import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'sm',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  // 6px - 8px radius, tight padding, sharp contrast, anti-pill
  const base = 'inline-flex items-center justify-center font-medium transition-colors select-none whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#18181B] focus-visible:outline-offset-1 disabled:opacity-50 disabled:pointer-events-none cursor-pointer rounded-md tracking-tight';

  const sizeClasses = {
    xs: 'text-[11px] px-2 py-1 gap-1 h-6',
    sm: 'text-xs px-2.5 py-1.5 gap-1.5 h-7.5',
    md: 'text-xs px-3 py-1.5 gap-2 h-8.5',
    lg: 'text-sm px-3.5 py-2 gap-2 h-9.5',
  };

  const variantClasses = {
    primary: 'bg-[#18181B] hover:bg-[#27272A] text-white border border-[#18181B] shadow-2xs font-semibold active:translate-y-[0.5px]',
    secondary: 'bg-white hover:bg-[#F6F5F2] text-[#18181B] border border-[#E2DFD7] shadow-2xs hover:border-[#D0CCC3] active:translate-y-[0.5px]',
    outline: 'bg-transparent hover:bg-[#F1F0EC] text-[#18181B] border border-[#E2DFD7] active:translate-y-[0.5px]',
    ghost: 'bg-transparent hover:bg-[#F1F0EC] text-[#57534E] hover:text-[#18181B] active:translate-y-[0.5px]',
    danger: 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 active:translate-y-[0.5px]',
  };

  return (
    <button
      className={`${base} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
