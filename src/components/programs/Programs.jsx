import { Link } from 'react-router-dom';
import programsData from '../../data/programs.json';

function Programs({ limit }) {
  // Show only part of the programs (for Home)
  const displayedPrograms = limit ? programsData.slice(0, limit) : programsData;

  // Color palette associated with programs
  const colorMap = {
    blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    green: 'bg-green-100 text-green-600 hover:bg-green-200',
    purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
    amber: 'bg-amber-100 text-amber-600 hover:bg-amber-200',
    red: 'bg-red-100 text-red-600 hover:bg-red-200',
    indigo: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200',
    cyan: 'bg-cyan-100 text-cyan-600 hover:bg-cyan-200',
    pink: 'bg-pink-100 text-pink-600 hover:bg-pink-200'
  };

  return (
    <section id='programs' className='bg-gray-50 pt-5 pb-10'>
      <div className='mx-auto w-[95%] max-w-[1600px] px-6'>
        <div className='mt-1 text-center'>
          <h2 className='mb-1 text-4xl font-bold text-gray-900'>Our Programs</h2>
          <p className='mx-auto max-w-2xl text-lg text-gray-600'>Choose the program that fits your career goals and timeline. All programs are designed to give you practical, industry-relevant skills.</p>
        </div>

        {/* Dynamic program cards */}
        <div className='mt-18 grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-6'>
          {displayedPrograms.map((program) => (
            <div key={program.id} className='flex min-h-[480px] cursor-pointer flex-col rounded-xl bg-white p-6 shadow-lg duration-300 hover:-translate-y-1 hover:shadow-xl'>
              {/* Icon */}
              <div className='flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
                <span className={`material-symbols-outlined ${colorMap[program.color]?.split(' ')[1]}`} style={{ fontSize: '32px' }}>
                  {program.icon}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className='mt-2 mb-3 text-2xl font-bold text-gray-900'>{program.title}</h3>
              <p className='mb-4 grow text-gray-600'>{program.description}</p>

              {/* Details */}
              <div className='mb-6 space-y-3 text-gray-700'>
                <div className='flex items-center'>
                  <span className={`material-symbols-outlined mr-3 ${colorMap[program.color]?.split(' ')[1]}`}>schedule</span>
                  <span>Duration: {program.duration}</span>
                </div>
                <div className='flex items-center'>
                  <span className={`material-symbols-outlined mr-3 ${colorMap[program.color]?.split(' ')[1]}`}>calendar_today</span>
                  <span>Start: {program.start}</span>
                </div>
                <div className='flex items-center'>
                  <span className={`material-symbols-outlined mr-3 ${colorMap[program.color]?.split(' ')[1]}`}>attach_money</span>
                  <span>Fees: {program.fees}</span>
                </div>
              </div>

              {/* Button fixed at bottom */}
              <div className='mt-auto pt-4'>
                <button className={`w-full cursor-pointer rounded-lg py-3 font-semibold text-white transition-colors ${program.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : program.color === 'green' ? 'bg-green-600 hover:bg-green-700' : program.color === 'purple' ? 'bg-purple-600 hover:bg-purple-700' : program.color === 'amber' ? 'bg-amber-600 hover:bg-amber-700' : program.color === 'red' ? 'bg-red-600 hover:bg-red-700' : program.color === 'indigo' ? 'bg-indigo-600 hover:bg-indigo-700' : program.color === 'cyan' ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-pink-600 hover:bg-pink-700'}`}>Learn More</button>
              </div>
            </div>
          ))}
        </div>

        {/* Show “View All Programs” only when limited */}
        {/*{limit && (
          <div className="text-center mt-12">
            <Link
              to="/programsall"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              View All Programs →
            </Link>
          </div>
        )}*/}
      </div>
    </section>
  );
}

export default Programs;
