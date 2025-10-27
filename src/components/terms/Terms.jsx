import { useState } from 'react';
function Terms() {
  return (
    <section id="terms" className='bg-white py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-4xl font-bold text-gray-900'>Academic Terms</h2>
          <p className='text-xl text-gray-600'>Plan your studies with our flexible term schedule</p>
        </div>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <div className='text-center-xl rounded-xl border border-green-200 bg-green-100 p-6 text-center hover:border-green-400'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-200'>
              <span class='material-symbols-outlined text-green-600' style={{ fontSize: '32px' }}>
                psychiatry
              </span>
            </div>
            <h3 className='mb-2 text-xl font-bold text-gray-900'>Spring Term</h3>
            <p>March - June</p>
            <div className='text-md mt-5 text-gray-500'>
              <p>Registration Opens: February 1</p>
              <p>Classes Start: March 1</p>
            </div>
          </div>
          <div className='rounded-xl border border-yellow-200 bg-yellow-100 p-6 text-center hover:border-yellow-400'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-200'>
              <span class='material-symbols-outlined text-yellow-600' style={{ fontSize: '32px' }}>
                brightness_7
              </span>
            </div>
            <h3 className='mb-2 text-xl font-bold text-gray-900'>Summer Term</h3>
            <p>June - August</p>
            <div className='text-md mt-5 text-gray-500'>
              <p>Registration Opens: May 1</p>
              <p>Classes Start: June 1</p>
            </div>
          </div>
          <div className='rounded-xl border border-orange-200 bg-orange-100 p-6 text-center hover:border-orange-400'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-200'>
              <span class='material-symbols-outlined text-orange-500' style={{ fontSize: '32px' }}>
                nest_eco_leaf
              </span>
            </div>
            <h3 className='mb-2 text-xl font-bold text-gray-900'>Fall Term</h3>
            <p>September - December</p>
            <div className='text-md mt-5 text-gray-500'>
              <p>Registration Opens: August 1</p>
              <p>Classes Start: September 1</p>
            </div>
          </div>
          <div className='rounded-xl border border-blue-200 bg-blue-100 p-6 text-center hover:border-blue-400'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-200'>
              <span class='material-symbols-outlined text-blue-500' style={{ fontSize: '32px' }}>
                mode_cool
              </span>
            </div>
            <h3 className='mb-2 text-xl font-bold text-gray-900'>Winter Term</h3>
            <p>January - March</p>
            <div className='text-md mt-5 text-gray-500'>
              <p>Registration Opens: December 1</p>
              <p>Classes Start: January 1</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Terms;
