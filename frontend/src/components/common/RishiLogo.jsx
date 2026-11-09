import React from 'react';
import emblemPng from '../../assets/rishi-logo-emblem.png';

/**
 * Official Rishi Healthcare Logo Emblem
 * Teal medical cross with signature S-curve division
 */
export default function RishiLogo({ size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14',
  };

  const imgSize = sizeMap[size] || size;

  return (
    <img
      src={emblemPng}
      alt="Rishi Hospital Logo"
      className={`${imgSize} object-contain ${className}`}
      loading="eager"
    />
  );
}

