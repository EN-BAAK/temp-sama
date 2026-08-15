import React from 'react';
import { LinkProps } from './types';

export const Link: React.FC<LinkProps> = ({ value, action, className = '' }) => {
  return (
    <button
      type="button"
      onClick={action}
      className={`
        group relative inline-flex items-center 
        font-medium text-blue-600 hover:text-blue-700 
        cursor-pointer transition-colors duration-200 
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        ${className}
      `}
    >
      {value}
      
      <span 
        aria-hidden="true" 
        className="absolute bottom-0 left-0 h-[1px] w-full origin-bottom-right scale-x-0 bg-blue-700 transition-transform duration-200 ease-out group-hover:origin-bottom-left group-hover:scale-x-100" 
      />
    </button>
  );
};