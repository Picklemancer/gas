import React from 'react';
import Box from './Box';
import { cls } from '../utils';

export const Card = ({ className, ...props }) => (
  <Box
    className={cls(
      'border-2 rounded-xl',
      'border-slate-200 bg-slate-50',
      'dark:border-slate-800 dark:bg-slate-950',
      className
    )}
    {...props}
  />
);

export const CardBody = ({ className, ...props }) => (
  <Box className={cls('p-3', className)} {...props} />
);

export default Card;
