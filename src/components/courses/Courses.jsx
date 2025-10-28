function Courses() {
  return (
    <section className="bg-white py-12">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Courses</h2>
        <p className="text-gray-600 mb-10">
          Explore the key courses that form the foundation of your software development journey.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Rapid Application Development</h3>
            <p className="text-sm text-gray-600">
              Learn how to quickly design, develop, and deploy modern applications using efficient frameworks.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-green-700 mb-2">Web Programming</h3>
            <p className="text-sm text-gray-600">
              Master front-end and back-end technologies to build dynamic, responsive, and user-friendly web applications.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-purple-700 mb-2">Object Oriented Programming</h3>
            <p className="text-sm text-gray-600">
              Understand the core concepts of OOP and learn how to design reusable, scalable, and maintainable software.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Courses;
