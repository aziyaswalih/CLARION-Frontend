import React from 'react';

interface ProgressProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
}

export const Progress: React.FC<ProgressProps> = ({ 
  value, 
  className = '', 
  indicatorClassName = '' 
}) => {
  return (
    <div className={`w-full rounded-full overflow-hidden ${className}`}>
      <div 
        className={`h-full transition-all duration-300 ${indicatorClassName}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

