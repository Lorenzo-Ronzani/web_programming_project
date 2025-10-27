function Courses() {
  const courses = [
    {
      name: 'Rapid Application Development',
      description: 'Learn how to quickly design, develop, and deploy modern applications using efficient frameworks.',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700'
    },
    {
      name: 'Web Programming',
      description: 'Master front-end and back-end technologies to build dynamic, responsive, and user-friendly web applications.',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700'
    },
    {
      name: 'Object Oriented Programming',
      description: 'Understand the core concepts of OOP and learn how to design reusable, scalable, and maintainable software.',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700'
    },
    {
      name: 'Rapid Application Development',
      description: 'Learn how to quickly design, develop, and deploy modern applications using efficient frameworks.',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      textColor: 'text-pink-700'
    },
    {
      name: 'Web Programming',
      description: 'Master front-end and back-end technologies to build dynamic, responsive, and user-friendly web applications.',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700'
    },
    {
      name: 'Object Oriented Programming',
      description: 'Understand the core concepts of OOP and learn how to design reusable, scalable, and maintainable software.',
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

        {/* <div className='mb-8 grid grid-cols-1 gap-8 sm:grid-cols-3'>
          <div className='rounded-xl border border-blue-200 bg-blue-50 p-6 shadow transition hover:shadow-lg'>
            <h3 className='mb-2 text-xl font-semibold text-blue-700'>Rapid Application Development</h3>
            <p className='text-sm text-gray-600'>Learn how to quickly design, develop, and deploy modern applications using efficient frameworks.</p>
          </div>

          <div className='rounded-xl border border-green-200 bg-green-50 p-6 shadow transition hover:shadow-lg'>
            <h3 className='mb-2 text-xl font-semibold text-green-700'>Web Programming</h3>
            <p className='text-sm text-gray-600'>Master front-end and back-end technologies to build dynamic, responsive, and user-friendly web applications.</p>
          </div>

          <div className='rounded-xl border border-purple-200 bg-purple-50 p-6 shadow transition hover:shadow-lg'>
            <h3 className='mb-2 text-xl font-semibold text-purple-700'>Object Oriented Programming</h3>
            <p className='text-sm text-gray-600'>Understand the core concepts of OOP and learn how to design reusable, scalable, and maintainable software.</p>
          </div>
        </div> */}
        {/* <div className='grid grid-cols-1 gap-8 sm:grid-cols-3'>
          <div className='rounded-xl border border-blue-200 bg-blue-50 p-6 shadow transition hover:shadow-lg'>
            <h3 className='mb-2 text-xl font-semibold text-blue-700'>Rapid Application Development</h3>
            <p className='text-sm text-gray-600'>Learn how to quickly design, develop, and deploy modern applications using efficient frameworks.</p>
          </div>

          <div className='rounded-xl border border-green-200 bg-green-50 p-6 shadow transition hover:shadow-lg'>
            <h3 className='mb-2 text-xl font-semibold text-green-700'>Web Programming</h3>
            <p className='text-sm text-gray-600'>Master front-end and back-end technologies to build dynamic, responsive, and user-friendly web applications.</p>
          </div>

          <div className='rounded-xl border border-purple-200 bg-red-50 p-6 shadow transition hover:shadow-lg'>
            <h3 className='mb-2 text-xl font-semibold text-red-700'>Object Oriented Programming</h3>
            <p className='text-sm text-gray-600'>Understand the core concepts of OOP and learn how to design reusable, scalable, and maintainable software.</p>
          </div>
        </div>*/}
      </div>
    </section>
  );
}

export default Courses;
