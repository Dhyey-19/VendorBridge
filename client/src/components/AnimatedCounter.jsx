import React, { useState, useEffect } from 'react';

const AnimatedCounter = ({ value, duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);

    // If it's not a valid number, just render the value directly
    if (isNaN(end)) {
      setCount(value);
      return;
    }

    if (end === 0) {
      setCount(0);
      return;
    }

    const totalFrames = 30; // 30 updates
    const frameDuration = duration / totalFrames;
    const increment = Math.ceil(end / totalFrames);

    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(current);
      }
    }, frameDuration);

    return () => clearInterval(timer);
  }, [value, duration]);

  // If the original value had a string component (e.g., "$12,500" or similar, keep formatting if needed, but since we parse it, we render the formatted number or count)
  return <span>{count.toLocaleString()}</span>;
};

export default AnimatedCounter;
