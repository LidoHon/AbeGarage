import React from 'react';

const Skeleton = ({ width = 'w-full', height = 'h-4', rounded = 'rounded-md', className = '' }) => (
  <div className={`bg-gray-500 animate-pulse ${width} ${height} ${rounded} ${className} mb-2`} />
);

export default Skeleton;
