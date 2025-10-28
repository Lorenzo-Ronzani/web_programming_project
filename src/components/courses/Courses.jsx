function Courses() {
  const courses = [
    {
      name: 'Rapid Application Development',
      description: 'Learn programming techniques in a rapid application development environment to build GUI and data-driven applications using forms, controls, and user-defined classes.',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700'
    },
    {
      name: 'Web Programming',
      description: 'Learn to build secure, interactive web applications using three-tier architecture, session management, OOP, advanced databases, and modern CSS.',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700'
    },
    {
      name: 'Object Oriented Programming',
      description: 'Explore OOP design concepts, threads, and event handling to build advanced applications with database and network integration.',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700'
    },
    {
      name: 'Project Management in Software Development',
      description: 'Learn core principles of managing software projects, including planning, execution, control techniques, and methodologies for projects of varying scope.',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      textColor: 'text-pink-700'
    },
    {
      name: 'User Experience Design',
      description: 'Learn UX principles and hands-on interface design through design sprints, persona development, and industry-relevant projects.',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700'
    },
    {
      name: 'Networking Essentials',
      description: 'Learn core networking concepts, protocols, and security while gaining hands-on skills to plan and implement small networks.',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700'
    }
  ];

  return (
    <section className='bg-white py-12'>
      <div className='mx-auto max-w-6xl px-6 text-center'>
        <h2 className='mb-2 text-3xl font-bold text-gray-800'>Courses</h2>
        <p className='mb-10 text-gray-600'>Explore the key courses that form the foundation of your software development journey.</p>

        <div className='mb-8 grid grid-cols-1 gap-8 sm:grid-cols-3'>
          {courses.map((course, index) => (
            <div key={index} className={`rounded-xl border ${course.borderColor} ${course.bgColor} p-6 shadow transition hover:shadow-lg`}>
              <h3 className={`mb-2 text-xl font-semibold ${course.textColor}`}>{course.name}</h3>
              <p className='text-sm text-gray-600'>{course.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Courses;
