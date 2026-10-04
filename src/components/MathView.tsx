import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  block?: boolean;
  className?: string;
  errorColor?: string;
}

export const MathView: React.FC<MathViewProps> = ({
  math,
  block = false,
  className = '',
  errorColor = '#ef4444',
}) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
        errorColor,
      });
    } catch (err) {
      console.warn('KaTeX render error:', err);
      return `<span style="color: ${errorColor}; font-family: monospace;">${math}</span>`;
    }
  }, [math, block, errorColor]);

  return (
    <span
      className={`inline-block select-text ${block ? 'w-full text-center my-1' : ''} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
