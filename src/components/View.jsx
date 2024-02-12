import React from 'react';
import Box from './Box';
import { cls } from '../utils';

export const View = ({ className, ...props }) => (
  <Box
    className={cls(
      'min-h-full',
      'bg-white text-black',
      'dark:bg-black dark:text-white',
      className
    )}
    {...props}
  />
);

export default View;
