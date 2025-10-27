import banner from '../../assets/banner/course_registration_banner.png'; // image path

function Header() {
  // Smooth scroll function
  const scrollToPrograms = () => {
    const section = document.getElementById("programs");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      {/* Main container */}
      <div className='flex-col'>
        {/* Hero section */}
        <div className='w-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 py-16'>
          <div className='mx-auto flex max-w-7xl items-center gap-8 px-6 text-justify'>
            
            {/* Left side content */}
            <div className='flex w-1/2 flex-col'>
              <div className='space-y-2 text-5xl'>
                <h1 className='font-bold text-white text-shadow-xs'>Shape Your Future in</h1>
                <h2 className='font-bold text-amber-200 text-shadow-xs'>Software Development</h2>
              </div>

              <div className='mt-5 text-lg font-extralight text-white text-shadow-2xs'>
                <p>
                  At Bow Valley College, the Software Development program equips students with the technical expertise 
                  and creative mindset to design, develop, and deploy innovative software solutions that drive real-world impact.
                </p>
              </div>

              {/* Buttons */}
              <div className='mt-6 flex items-center gap-5'>
                <button
                  onClick={scrollToPrograms} // ✅ smooth scroll
                  className='w-40 cursor-pointer rounded-md border-2 border-solid border-white bg-white p-2 font-medium text-black shadow-lg duration-300 hover:scale-110 hover:bg-gray-100'
                  type='button'
                >
                  Explore Programs
                </button>

                <button 
                  className='w-35 cursor-pointer rounded-md border-2 border-solid border-white p-2 font-medium text-white duration-300 hover:bg-white hover:text-black' 
                  type='button'
                >
                  Register Now
                </button>
              </div>
            </div>

            {/* Right side image */}
            <div className="flex w-1/2 items-center justify-center">
              <img
                src={banner}
                alt="Students collaborating in a software development program"
                className="rounded-xl shadow-lg max-w-full h-auto object-contain"
              />            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
