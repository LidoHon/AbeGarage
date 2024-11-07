import React from 'react';
import { ClipLoader } from 'react-spinners';

const Spinner = ({ size = 50, color = '#3498db', loading = true, className = '' }) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <ClipLoader color={color} size={size} loading={loading} />
    </div>
  );
};

export default Spinner;
