import { useState } from 'react';
function Terms() {
  return (
    <section id='terms-section' className='bg-white py-20'>
      <div className='max-w-7x1 mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-4xl font-bold text-gray-900'>Academic Terms</h2>
          <p className='text-xl text-gray-600'>Plan your studies with our flexible term schedule</p>
        </div>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <div className='text-center-xl rounded-xl border border-green-200 bg-green-50 p-6 text-center'>
            <div>
              <i></i>
            </div>
            <h3>Spring Term</h3>
            <p>March - June</p>
          </div>
          <div className='rounded-xl border border-yellow-200 bg-yellow-50 p-6 text-center'>
            <div>
              <i></i>
            </div>
            <h3>Summer</h3>
            <p>June - August</p>
          </div>
          <div className='rounded-xl border border-orange-200 bg-orange-50 p-6 text-center'>
            <div>
              <i></i>
            </div>
            <h3>Fall</h3>
            <p>September - December</p>
          </div>
          <div className='rounded-xl border border-blue-200 bg-blue-50 p-6 text-center'>
            <div>
              <i></i>
            </div>
            <h3>Winter</h3>
            <p>January - March</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Terms;
