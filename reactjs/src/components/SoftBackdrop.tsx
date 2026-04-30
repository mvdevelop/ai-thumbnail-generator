
import React from 'react';

function SoftBackdrop() {
  return (
    <div className='absolute inset-0 z-0 pointer-events-none overflow-hidden'>
      {/* Luz superior */}
      <div className='absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-pink-800/30 to-transparent rounded-full blur-[100px]' />
      
      {/* Luz inferior */}
      <div className='absolute right-0 bottom-0 w-[400px] h-[200px] bg-gradient-to-bl from-red-700/25 to-transparent rounded-full blur-[80px]' />
    </div>
  );
}

export default SoftBackdrop;
