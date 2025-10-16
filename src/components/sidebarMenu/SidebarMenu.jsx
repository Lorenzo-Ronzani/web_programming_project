import { useState } from 'react';

const SideBarMenu = () => {
  return (
    <div className='w-bg-white border-b border-gray-200 px-6 py-2'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-3'>
            <div className='bg-primary-600 flex h-10 w-10 items-center justify-center rounded-lg bg-black'>
              <span className='material-symbols-outlined text-3xl text-white'>school</span>
            </div>
            <div>
              <h1 className='text-xl font-semibold text-gray-900'>Bow Course Registration</h1>
              <p className='text-md text-gray-500'>Student Dashboard</p>
            </div>
          </div>
        </div>
        <div className='flex items-center space-x-6'>
          <nav className='hidden items-center space-x-8 lg:flex'>
            <span className='cursor-pointer border-b-2 border-gray-600 font-medium text-gray-600'>Dashboard</span>
            <span className='cursor-pointer border-b-2 border-transparent text-gray-600 transition-all duration-200 hover:border-gray-800 hover:text-gray-900'>Courses</span>
            <span className='cursor-pointer border-b-2 border-transparent text-gray-600 transition-all duration-200 hover:border-gray-800 hover:text-gray-900'>Registration</span>
            <span className='cursor-pointer border-b-2 border-transparent text-gray-600 transition-all duration-200 hover:border-gray-800 hover:text-gray-900'>Profile</span>
          </nav>

          <div className='flex items-center space-x-4'>
            <button className='relative flex cursor-pointer items-center justify-center rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900'>
              <span class='material-symbols-outlined'>notifications</span>
            </button>
            <div className='flex items-center space-x-3'>
              {/*precisamos colocar o img ao inves de um span */}
              {/*<img src='' alt='' />*/}
              <button className='relative flex cursor-pointer rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900'>
                <span class='material-symbols-outlined'>account_circle</span>
              </button>
              <div className='hidden lg:block'>
                <p className='text-sm font-medium text-gray-900'>Lorenzo</p>
                <p className='text-xs text-gray-500'>Ronzani</p>
              </div>
              <button className='relative flex cursor-pointer rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900'>
                <span class='material-symbols-outlined' style={{ fontSize: '30px' }}>
                  keyboard_arrow_down
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBarMenu;
