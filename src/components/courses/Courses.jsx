import { useEffect, useState } from "react";
//import { buildApiUrl } from "../api"; // Adjust the path depending on your folder structure
import { buildApiUrl } from "../../api";


function Courses({ limit }) {
  // Tailwind color classes for dynamic styling
  const colorMap = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    red: "bg-red-50 border-red-200 text-red-700",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
    cyan: "bg-cyan-50 border-cyan-200 text-cyan-700",
    orange: "bg-orange-50 border-orange-200 text-orange-700",
    teal: "bg-teal-50 border-teal-200 text-teal-700",
    pink: "bg-pink-50 border-pink-200 text-pink-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    violet: "bg-violet-50 border-violet-200 text-violet-700",
    rose: "bg-rose-50 border-rose-200 text-rose-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    lime: "bg-lime-50 border-lime-200 text-lime-700",
    slate: "bg-slate-50 border-slate-200 text-slate-700",
    fuchsia: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700",
    sky: "bg-sky-50 border-sky-200 text-sky-700",
    stone: "bg-stone-50 border-stone-200 text-stone-700",
    neutral: "bg-neutral-50 border-neutral-200 text-neutral-700",
  };

  // React state to store the list of courses
  const [courses, setCourses] = useState([]);

  // Fetch courses from backend (Firebase Functions)
  useEffect(() => {
    // Automatically builds the correct API URL:
    // - Dev: http://localhost:5001/.../getCourses
    // - Prod: https://getcourses-xxxx.a.run.app
    const url = buildApiUrl("getCourses");

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched courses:", data);
        setCourses(data);
      })
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  // Apply "limit" if the component receives a limit prop
  const displayedCourses = limit ? courses.slice(0, limit) : courses;

  return (
    <section id="courses" className="bg-white py-12">
      <div className="max-w-6xl mx-auto px-6 text-center">

        {/* Section Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Courses</h2>

        {/* Section Subtitle */}
        <p className="text-gray-600 mb-10">
          Explore the key courses that form the foundation of your software development journey.
        </p>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayedCourses.map((course) => (
            <div
              key={course.id}
              className={`${
                colorMap[course.color] || "bg-gray-50 border-gray-200 text-gray-700"
              } rounded-xl p-6 shadow hover:shadow-lg transition`}
            >
              {/* Course Title */}
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>

              {/* Course Description */}
              <p className="text-sm text-gray-600">{course.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Courses;
