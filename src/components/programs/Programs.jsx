import { useState } from 'react';

function Programs() {
  return (
    <>
      <section className='bg-gray-50'>
        <div className='mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8'>
          <div className='mt-16 text-center'>
            <h2 className='text-4xl font-bold'>Our Programs</h2>
            <p className='mx-auto mt-5 max-w-4xl justify-center text-center text-2xl font-light text-gray-500'>Choose the program that fits your career goals and timeline. All programs are designed to give you practical, industry-relevant skills.</p>
          </div>
        </div>
        {/*Diplomas*/}
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          <div className='rounded-xl bg-white p-8 shadow-lg duration-300 hover:scale-105'>
            <div>{/*vamos colocar um icone */}</div>
            <h3 className='mb-4 text-2xl font-bold text-gray-900'>Diploma Program</h3>
            <p className='mb-6 text-gray-600'>A comprehensive two-year software development diploma program designed to equip students with foundational and advanced programming skills.</p>
          </div>
          <div></div>
          <div></div>
        </div>
      </section>
    </>
  );
}

export default Programs;
