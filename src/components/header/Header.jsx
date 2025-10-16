import { useState } from 'react';

function Header() {
  return (
    <div>
      {/* Container principal */}
      <div className='flex-col'>
        {/* Barra superior */}
        <div className='w-full'>
          <div className='flex w-full items-center justify-center'>
            {/* Logo e títulos */}
            <div className='flex w-1/3 items-center justify-center space-x-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-black'>
                <span className='material-symbols-outlined text-3xl text-white'>school</span>
              </div>
              <div className='flex-col text-left'>
                <div className='text-2xl font-bold'>
                  <a href=''>Bow Course Registration</a>
                </div>
                <div className='text-lg text-gray-500'>
                  <a href=''>Software Development Department</a>
                </div>
              </div>
            </div>
            <div className='flex w-1/3 items-center justify-center gap-5'>
              <div className='text-lg font-normal text-gray-700 duration-200 hover:text-black'>
                <a href=''>Programs</a>
              </div>
              <div className='text-lg font-normal text-gray-700 duration-200 hover:text-black'>
                <a href=''>Courses</a>
              </div>
              <div className='text-lg font-normal text-gray-700 duration-200 hover:text-black'>
                <a href=''>About</a>
              </div>
              <div className='text-lg font-normal text-gray-700 duration-200 hover:text-black'>
                <a href=''>Contact</a>
              </div>
            </div>

            {/* Login / Sign Up */}
            <div className='flex w-1/3 items-center justify-center gap-4 text-center'>
              <button className='w-20 cursor-pointer rounded-md bg-gray-100 p-1 duration-300 ease-in-out hover:bg-gray-200' type='button'>
                <a className='text-md' href=''>
                  Login
                </a>
              </button>
              <button className='w-24 cursor-pointer rounded-md bg-gray-700 p-1 text-white duration-300 ease-in-out hover:bg-gray-800'>
                <a className='text-md' href=''>
                  Sign Up
                </a>
              </button>
            </div>
          </div>
        </div>

        <div className='h-120 w-full bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%'>
          <div className='mx-auto flex h-full max-w-7xl items-center gap-8 gap-x-12 text-justify'>
            <div className='flex w-1/2 flex-col'>
              <div className='space-y-2 text-5xl'>
                <h1 className='font-bold text-white text-shadow-xs'>Shape Your Future in</h1>
                <h2 className='font-bold text-amber-200 text-shadow-xs'>Software Development</h2>
              </div>
              <div className='mt-5 text-lg font-extralight text-white text-shadow-2xs'>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s Lorem Ipsum has Lorem Ipsum has Lorem Ipsum has </p>
              </div>
              <div className='mt-6 flex items-center gap-5'>
                <button className='w-40 cursor-pointer rounded-md border-2 border-solid border-white bg-white p-2 font-medium text-black shadow-lg duration-400 hover:scale-110 hover:bg-gray-100' type='button' onClick={() => alert('Botao clicado!')}>
                  <a href=''>Explore Programs</a>
                </button>
                <button className='w-35 cursor-pointer rounded-md border-2 border-solid border-white p-2 font-medium text-white duration-300 hover:bg-white hover:text-black' type='button'>
                  <a href=''>Register Now</a>
                </button>
              </div>
            </div>
            {/* Imagem */}
            <div className='flex w-1/2 items-center justify-center'>
              <div className='h-70 w-200 bg-black'>
                <img src='' alt='imagem' className='h-auto max-w-full' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Header;
