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
              <div>{/* ícone aqui */}</div>
              <h3 className='mb-4 text-2xl font-bold text-gray-900'>Diploma Program</h3>
              <p className='mb-6 text-gray-600'>A comprehensive two-year software development diploma program designed to equip students with foundational and advanced programming skills.</p>
              <div>
                <i></i>
                <span>Duration: 2 Years</span>
              </div>
              <div>
                <i></i>
                <span>Start: September 5, 2025</span>
              </div>
              <div>
                <i></i>
                <span>End Date: June 15, 2026</span>
              </div>
              <div>
                <i></i>
                <span>Fees: $9,254 domestic / $27,735 international</span>
              </div>
              <button className='mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700'>Learn More</button>
            </div>

            {/* Post Diploma Program */}
            <div className='cursor-pointer rounded-xl bg-white p-8 shadow-lg duration-300 hover:scale-102'>
              <div>{/* ícone aqui */}</div>
              <h3 className='mb-4 text-2xl font-bold text-gray-900'>Post Diploma Program</h3>
              <p className='mb-6 text-gray-600'>A one-year post-diploma program designed to enhance your software development skills with advanced concepts and hands-on projects.</p>
              <div>
                <i></i>
                <span>Duration: 1 Year</span>
              </div>
              <div>
                <i></i>
                <span>Start: September 5, 2025</span>
              </div>
              <div>
                <i></i>
                <span>End Date: June 15, 2026</span>
              </div>
              <div>
                <i></i>
                <span>Fees: $7,895 domestic / $23,675 international</span>
              </div>
              <button className='mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700'>Learn More</button>
            </div>

            {/* Certificate Program */}
            <div className='cursor-pointer rounded-xl bg-white p-8 shadow-lg duration-300 hover:scale-102'>
              <div>{/* ícone aqui */}</div>
              <h3 className='mb-4 text-2xl font-bold text-gray-900'>Certificate Program</h3>
              <p className='mb-6 text-gray-600'>A six-month certificate program providing practical, industry-relevant skills for software development beginners or professionals seeking specialization.</p>
              <div>
                <i></i>
                <span>Duration: 6 Months</span>
              </div>
              <div>
                <i></i>
                <span>Start: September 5, 2025</span>
              </div>
              <div>
                <i></i>
                <span>End Date: June 15, 2026</span>
              </div>
              <div>
                <i></i>
                <span>Fees: $3,895 domestic / $12,675 international</span>
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
