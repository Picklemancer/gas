import React, { useState, useEffect } from 'react';
import Text from './Text';

// const dots = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export const Loading = ({ text = 'Loading' }) => {
  const [state, setState] = useState(1);

  useEffect(() => {
    const interval = setInterval(
      () => setState((prev) => (prev < text.length ? prev + 1 : 1)),
      200
    );
    return () => clearInterval(interval);
  }, []);

  return <Text>{text.slice(0, state)}</Text>;
};

export default Loading;
