
import React from 'react';



function SoftBackdrop() {
  return (
    <>
      {/* Backdrop corrigido: fixed e z-0 */}
      <div className='fixed inset-0 z-0 pointer-events-none'>
        <div className='absolute left-1/2 top-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-800/20 rounded-full blur-[120px]' />
        <div className='absolute right-[-10%] bottom-[-10%] w-[300px] h-[300px] bg-indigo-700/20 rounded-full blur-[100px]' />
      </div>
    </>
  )
}

export default SoftBackdrop;
