import React from 'react';
import Box from './Box';
import { cls } from '../utils';

const variants = {
  solid: {
    default: 'border-slate-500 bg-slate-500 text-white',
    primary: 'border-blue-500 bg-blue-500 text-white',
    warning: 'border-yellow-500 bg-yellow-500 text-black',
  },
  bordered: {
    default: 'border-slate-500 bg-transparent text-slate-500',
    primary: 'border-blue-500 bg-transparent text-blue-500',
  },
  light: {},
  flat: {},
  faded: {},
  shadow: {
    default:
      'shadow-lg shadow-slate-500/50 border-slate-500 bg-slate-500 text-white',
    primary:
      'shadow-lg shadow-blue-500/50 border-blue-500 bg-blue-500 text-white',
  },
  ghost: {
    default: 'border-slate-500 bg-transparent text-slate-500',
    primary: 'border-blue-500 bg-transparent text-blue-500',
  },
};

const sizes = {
  sm: 'text-xs px-1 h-6',
  md: 'text-sm px-1 h-7',
  lg: 'text-base px-2 h-8',
};

export const Chip = ({
  color = 'default',
  variant = 'solid',
  size = 'md',
  className,
  ...props
}) => (
  <Box
    className={cls(
      'border-2 rounded-full flex items-center whitespace-nowrap',
      sizes[size],
      variants[variant][color],
      className
    )}
    {...props}
  />
);

export default Chip;
