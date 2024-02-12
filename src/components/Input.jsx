import React from 'react';
import { cls } from '../utils';

export const Input = ({
  className,
  placeholder = 'Enter text here...',
  isDisabled,
  onChange,
  ...props
}) => (
  <input
    className={cls(
      'w-full px-3 h-12 border-2 rounded-xl transition-colors',
      'border-slate-200 bg-slate-50 hover:bg-slate-200',
      'dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800',
      isDisabled && 'opacity-50 pointer-events-none',
      className
    )}
    disabled={isDisabled}
    placeholder={placeholder}
    onChange={(evt) => onChange(evt.target.value, evt)}
    {...props}
  />
);

export default Input;
