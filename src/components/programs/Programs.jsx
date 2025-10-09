import { useState } from 'react';

function Programs() {
  return (
    <>
      <section className='bg-gray-50 pt-10 pb-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mt-12 text-center'>
            <h2 className='mb-4 text-4xl font-bold text-gray-900'>Our Programs</h2>
            <p className='mx-auto max-w-3xl text-xl text-gray-600'>Choose the program that fits your career goals and timeline. All programs are designed to give you practical, industry-relevant skills.</p>
          </div>

          {/* Grid de programas */}
          <div className='mt-18 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8'>
            {/* Diploma Program */}
            <div className='cursor-pointer rounded-xl bg-white p-8 shadow-lg duration-300 hover:scale-102'>
              <div>
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-blue-100'>
                  <span class='material-symbols-outlined text-blue-600' style={{ fontSize: '32px' }}>
                    school
                  </span>
                </div>
              </div>
              <h3 className='mt-4 mb-4 text-2xl font-bold text-gray-900'>Diploma Program</h3>
              <p className='mb-6 text-gray-600'>A comprehensive two-year software development diploma program designed to equip students with foundational and advanced programming skills.</p>
              <div className='mb-8 space-y-4'>
                <div className='flex items-center text-gray-700'>
                  <span class='material-symbols-outlined mr-3 text-blue-600'>schedule</span>
                  <span>Duration: 2 Years</span>
                </div>
                <div className='flex items-center text-gray-700'>
                  <span class='material-symbols-outlined mr-3 text-blue-600'>calendar_today</span>
                  <span>Start: September 5, 2025</span>
                </div>

                <div className='flex items-center text-gray-700'>
                  <span class='material-symbols-outlined mr-3 text-blue-600'>attach_money</span>
                  <span>Fees: $9,254 domestic / $27,735 international</span>
                </div>
              </div>
              <button className='mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700'>Learn More</button>
            </div>

            {/* Post Diploma Program */}
            <div className='cursor-pointer rounded-xl bg-white p-8 shadow-lg duration-300 hover:scale-102'>
              <div>
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
                  <span class='material-symbols-outlined text-green-600' style={{ fontSize: '32px' }}>
                    rocket_launch
                  </span>
                </div>
              </div>
              <h3 className='mt-4 mb-4 text-2xl font-bold text-gray-900'>Post Diploma Program</h3>
              <p className='mb-6 text-gray-600'>A one-year post-diploma program designed to enhance your software development skills with advanced concepts and hands-on projects.</p>
              <div className='mb-8 space-y-4'>
                <div className='flex items-center text-gray-700'>
                  <span class='material-symbols-outlined mr-3 text-green-600'>schedule</span>
                  <span>Duration: 1 Year</span>
                </div>
                <div className='flex items-center text-gray-700'>
                  <span class='material-symbols-outlined mr-3 text-green-600'>calendar_today</span>
                  <span>Start: September 5, 2025</span>
                </div>

                <div className='flex items-center text-gray-700'>
                  <span class='material-symbols-outlined mr-3 text-green-600'>attach_money</span>
                  <span>Fees: $7,895 domestic / $23,675 international</span>
                </div>
              </div>
              <button className='mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700'>Learn More</button>
            </div>

            {/* Certificate Program */}
            <div className='cursor-pointer rounded-xl bg-white p-8 shadow-lg duration-300 hover:scale-102'>
              <div>
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-purple-100'>
                  <span class='material-symbols-outlined text-purple-600' style={{ fontSize: '32px' }}>
                    license
                  </span>
                </div>
              </div>
              <h3 className='mt-4 mb-4 text-2xl font-bold text-gray-900'>Certificate Program</h3>
              <p className='mb-6 text-gray-600'>A six-month certificate program providing practical, industry-relevant skills for software development beginners or professionals seeking specialization.</p>
              <div className='mb-8 space-y-4'>
                <div className='flex items-center text-gray-700'>
                  <span class='material-symbols-outlined mr-3 text-purple-600'>schedule</span>
                  <span>Duration: 6 Months</span>
                </div>
                <div className='flex items-center text-gray-700'>
                  <span class='material-symbols-outlined mr-3 text-purple-600'>calendar_today</span>
                  <span>Start: September 5, 2025</span>
                </div>
                <div className='flex items-center text-gray-700'>
                  <span class='material-symbols-outlined mr-3 text-purple-600'>attach_money</span>
                  <span>Fees: $3,895 domestic / $12,675 international</span>
                </div>
              </div>
              <button className='mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700'>Learn More</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Programs;
