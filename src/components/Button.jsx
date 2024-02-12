import React from 'react';
import { cls } from '../utils';

const variants = {
  solid: {
    default:
      'border-slate-500 bg-slate-500 text-white hover:border-slate-600 hover:bg-slate-600',
    primary:
      'border-blue-500 bg-blue-500 text-white hover:border-blue-600 hover:bg-blue-600',
    secondary:
      'border-purple-500 bg-purple-500 text-white hover:border-purple-600 hover:bg-purple-600',
    success:
      'border-green-500 bg-green-500 text-black hover:border-green-600 hover:bg-green-600',
    warning:
      'border-yellow-500 bg-yellow-500 text-black hover:border-yellow-600 hover:bg-yellow-600',
    danger:
      'border-red-500 bg-red-500 text-white hover:border-red-600 hover:bg-red-600',
  },
  bordered: {
    default:
      'border-slate-500 bg-transparent text-slate-500 hover:border-slate-600 hover:text-slate-600',
    primary:
      'border-blue-500 bg-transparent text-blue-500 hover:border-blue-600 hover:text-blue-600',
  },
  light: {},
  flat: {},
  faded: {},
  shadow: {
    default:
      'shadow-lg shadow-slate-500/50 border-slate-500 bg-slate-500 text-white hover:border-slate-600 hover:bg-slate-600',
    primary:
      'shadow-lg shadow-blue-500/50 border-blue-500 bg-blue-500 text-white hover:border-blue-600 hover:bg-blue-600',
  },
  ghost: {
    default:
      'border-slate-500 bg-transparent text-slate-500 hover:bg-slate-500 hover:text-white',
    primary:
      'border-blue-500 bg-transparent text-blue-500 hover:bg-blue-500 hover:text-white',
  },
};

const sizes = {
  xs: 'text-xs px-3 rounded-lg min-w-16 h-8',
  sm: 'text-sm px-4 rounded-xl min-w-20 h-10',
  md: 'text-base px-6 rounded-2xl min-w-24 h-12',
  lg: 'text-lg px-8 rounded-2xl min-w-28 h-14',
};

export const Button = ({
  color = 'default',
  variant = 'solid',
  isDisabled = false,
  className,
  size = 'md',
  ...props
}) => (
  <button
    className={cls(
      'border-2 transition',
      isDisabled
        ? 'opacity-50 pointer-events-none'
        : 'cursor-pointer active:scale-95',
      sizes[size],
      variants[variant][color],
      className
    )}
    disabled={isDisabled}
    {...props}
  />
);

export default Button;
