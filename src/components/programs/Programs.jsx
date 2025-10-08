import { useState } from 'react';

function Programs() {
  return (
    <>
      <section id='' className='bg-gray-50'>
        <div className='mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8'>
          <div className='mt-12 text-center'>
            <h2 className='mb-4 text-4xl font-bold text-gray-900'>Our Programs</h2>
            <p className='mx-auto max-w-3xl text-xl text-gray-600'>Choose the program that fits your career goals and timeline. All programs are designed to give you practical, industry-relevant skills.</p>
          </div>
        </div>
        {/*Diplomas*/}
        <div className='max-w-7x1 mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3'>
          <div className='cursor-pointer rounded-xl bg-white p-8 shadow-lg duration-300 hover:scale-102'>
            <div>{/*vamos colocar um icone */}</div>
            <h3 className='mb-4 text-2xl font-bold text-gray-900'>Diploma Program</h3>
            <p className='mb-6 text-gray-600'>A comprehensive two-year software development diploma program designed to equip students with foundational and advanced programming skills.</p>
            <div>
              <i></i>
              <span>Durantion: 2 Years</span>
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
            <div>
              <button className='mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700'>Learn More</button>
            </div>
          </div>

          <div>
            <div className='cursor-pointer rounded-xl bg-white p-8 shadow-lg duration-300 hover:scale-102'>
              <div>{/*vamos colocar um icone */}</div>
              <h3 className='mb-4 text-2xl font-bold text-gray-900'>Post Diploma Program</h3>
              <p className='mb-6 text-gray-600'>A comprehensive two-year software development diploma program designed to equip students with foundational and advanced programming skills.</p>
              <div>
                <i></i>
                <span>Durantion: 1 Year</span>
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
                <span> $7,895 domestic / $23,675 international</span>
              </div>
              <div>
                <button className='mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700'>Learn More</button>
              </div>
            </div>
          </div>

          <div>
            <div className='cursor-pointer rounded-xl bg-white p-8 shadow-lg duration-300 hover:scale-102'>
              <div>{/*vamos colocar um icone */}</div>
              <h3 className='mb-4 text-2xl font-bold text-gray-900'>Certificate Program</h3>
              <p className='mb-6 text-gray-600'>A comprehensive two-year software development diploma program designed to equip students with foundational and advanced programming skills.</p>
              <div>
                <i></i>
                <span>Durantion: 6 Months</span>
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
                <span> $3,895 domestic / $12,675 international</span>
              </div>
              <div>
                <button className='mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700'>Learn More</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Programs;
