import { useState } from 'react';

const SideBarMenu = () => {
  return (
    <div className='w-bg-white border-b border-gray-200 px-6 py-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'></div>
        <div className='flex items-center space-x-6'>
          <nav>
            <span className='text-primary-600 border-primary-600 cursor-pointer border-b-2 pb-1 font-medium'>Dashboard</span>
            <span className='cursor-pointer text-gray-600 transition-colors hover:text-gray-900'>Courses</span>
            <span className='cursor-pointer text-gray-600 transition-colors hover:text-gray-900'>Registration</span>
            <span className='cursor-pointer text-gray-600 transition-colors hover:text-gray-900'>Schedule</span>
          </nav>
          <div className='flex items-center space-x-4'>
            <button className='relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900'>
              <i></i>
            </button>
            <div className='flex items-center space-x-3'>
              <img src='' alt='' />
              <div className='hidden lg:block'>
                <p className='text-sm font-medium text-gray-900'>Lorenzo</p>
                <p className='text-xs text-gray-500'>Ronzani</p>
              </div>
              <i></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBarMenu;
