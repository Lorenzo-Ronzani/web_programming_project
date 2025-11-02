import banner from '../../assets/banner/course_registration_banner.png'; // Import banner image
import '@fortawesome/fontawesome-free/css/all.min.css';

function Header() {
  // Smooth scroll to the "Programs" section
  const scrollToPrograms = () => {
    const section = document.getElementById('programs');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Smooth scroll to the "Courses" section
  const scrollToCourses = () => {
    const section = document.getElementById('courses');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* ===== Main Container ===== */}
      <div className='flex-col'>
        {/* ===== Hero Section ===== */}
        <div className='w-full bg-linear-to-r from-indigo-600 via-sky-700 to-emerald-600 py-28'>
          <div className='mx-auto flex max-w-7xl items-center gap-8 px-6 text-justify'>
            {/* ===== Left Side Content ===== */}
            <div className='flex w-1/2 flex-col'>
              <div className='space-y-2 text-5xl'>
                <h1 className='font-bold text-white text-shadow-xs'>Shape Your Future in</h1>
                <h2 className='font-bold text-amber-300 text-shadow-xs'>Software Development</h2>
              </div>

              {/* Description Text */}
              <div className='mt-10 text-lg font-extralight text-white text-shadow-2xs'>
                <p>At Bow Valley College, the Software Development program equips students with the technical expertise and creative mindset to design, develop, and deploy innovative software solutions that drive real-world impact.</p>
              </div>

              {/* ===== Action Buttons ===== */}
              <div className='mt-6 flex items-center gap-5'>
                <button
                  onClick={scrollToPrograms} // Smooth scroll
                  className='w-40 cursor-pointer rounded-md border-2 border-solid border-white p-2 font-medium text-white shadow-lg duration-300 hover:scale-110 hover:bg-white hover:text-black'
                  type='button'>
                  Explore Programs
                </button>

                <button
                  onClick={scrollToCourses} // Smooth scroll
                  className='w-35 cursor-pointer rounded-md border-2 border-solid border-white p-2 font-medium text-white duration-300 hover:bg-white hover:text-black'
                  type='button'>
                  Explore Courses
                </button>

                <button className='w-35 cursor-pointer rounded-md border-2 border-solid border-white p-2 font-medium text-white duration-300 hover:bg-white hover:text-black' type='button'>
                  Register Now
                </button>
              </div>
            </div>

            {/* ===== Right Side Image ===== */}
            <div className='flex w-1/2 items-center justify-center'>
              <img src={banner} alt='Students collaborating in a software development program' className='h-auto max-w-full rounded-xl object-contain shadow-lg' />
            </div>
          </div>
        </div>

        {/* ===== Statistics Section ===== */}
        <section id='stats-section' className='bg-white py-16'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
              {/* Students Enrolled */}
              <div className='text-center'>
                <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100'>
                  <i className='fa-solid fa-users text-2xl text-blue-600'></i>
                </div>
                <h3 className='mb-2 text-3xl font-bold text-gray-900'>2,500+</h3>
                <p className='text-gray-600'>Students Enrolled</p>
              </div>

              {/* Available Courses */}
              <div className='text-center'>
                <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
                  <i className='fa-solid fa-book-open text-2xl text-green-600'></i>
                </div>
                <h3 className='mb-2 text-3xl font-bold text-gray-900'>150+</h3>
                <p className='text-gray-600'>Available Courses</p>
              </div>

              {/* Program Types */}
              <div className='text-center'>
                <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100'>
                  <i className='fa-solid fa-award text-2xl text-purple-600'></i>
                </div>
                <h3 className='mb-2 text-3xl font-bold text-gray-900'>3</h3>
                <p className='text-gray-600'>Program Types</p>
              </div>

              {/* Employment Rate */}
              <div className='text-center'>
                <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100'>
                  <i className='fa-solid fa-briefcase text-2xl text-orange-600'></i>
                </div>
                <h3 className='mb-2 text-3xl font-bold text-gray-900'>95%</h3>
                <p className='text-gray-600'>Employment Rate</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Header;
