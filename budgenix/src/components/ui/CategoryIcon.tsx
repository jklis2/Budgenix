import React from 'react';

interface CategoryIconProps {
  name: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function CategoryIcon({ 
  name, 
  color = 'currentColor', 
  size = 'medium',
  className = ''
}: CategoryIconProps) {
  const sizeClass = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-3xl'
  };

  return (
    <span 
      className={`material-icons ${sizeClass[size]} ${className}`}
      style={{ color }}
    >
      {name}
    </span>
  );
}
