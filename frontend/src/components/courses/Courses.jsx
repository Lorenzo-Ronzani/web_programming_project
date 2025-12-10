import { useEffect, useState } from "react";
import { buildApiUrl } from "../../api";
import { useNavigate } from "react-router-dom";

// Color Map for Gradient
const COLOR_GRADIENT = {
  blue: "from-blue-500 to-blue-700",
  green: "from-green-500 to-green-700",
  purple: "from-purple-500 to-purple-700",
  yellow: "from-yellow-500 to-yellow-700",
  red: "from-red-500 to-red-700",
  indigo: "from-indigo-500 to-indigo-700",
  cyan: "from-cyan-500 to-cyan-700",
  orange: "from-orange-500 to-orange-700",
  teal: "from-teal-500 to-teal-700",
  pink: "from-pink-500 to-pink-700",
  emerald: "from-emerald-500 to-emerald-700",
  violet: "from-violet-500 to-violet-700",
  rose: "from-rose-500 to-rose-700",
  amber: "from-amber-500 to-amber-700",
  lime: "from-lime-500 to-lime-700",
  slate: "from-slate-500 to-slate-700",
  fuchsia: "from-fuchsia-500 to-fuchsia-700",
  sky: "from-sky-500 to-sky-700",
  stone: "from-stone-500 to-stone-700",
  neutral: "from-neutral-500 to-neutral-700",
};

function Courses({ limit }) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  // Fetch courses from backend
  useEffect(() => {
    const url = buildApiUrl("getCourses");

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched courses:", data);

        if (data && Array.isArray(data.items)) {
          setCourses(data.items.filter((c) => c.is_active && c.show_on_homepage));
        } else if (Array.isArray(data)) {
          setCourses(data.filter((c) => c.is_active && c.show_on_homepage));
        } else {
          setCourses([]);
        }
      })
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  // Apply limit if provided
  const displayedCourses = limit ? courses.slice(0, limit) : courses;

  return (
    <section id="courses" className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">

        {/* Section Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Featured Courses
        </h2>

        {/* Subtitle */}
        <p className="text-gray-600 mb-12">
          Explore the key courses available in our academic offerings.
        </p>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

          {displayedCourses.length === 0 && (
            <p className="col-span-full text-gray-500">No courses available.</p>
          )}

          {displayedCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow hover:shadow-xl transition cursor-pointer overflow-hidden"
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              {/* TOP COLOR BAR WITH ICON */}
              <div
                className={`h-40 flex items-center justify-center text-white text-6xl bg-gradient-to-r ${
                  COLOR_GRADIENT[course.color] || COLOR_GRADIENT.indigo
                }`}
              >
                <span className="material-symbols-outlined">
                  {course.icon || "school"}
                </span>
              </div>

              {/* CARD CONTENT */}
              <div className="p-5 text-left">

                {/* CODE + CREDITS */}
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span className="font-semibold">{course.code}</span>
                  <span>{course.credits} credits</span>
                </div>

                {/* TITLE */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {course.title}
                </h3>

                {/* Instructor */}
                <p className="text-gray-600 text-sm mb-4">
                  Instructor: {course.instructor || "TBA"}
                </p>

                {/* BUTTON  */}
                <button
                  className="text-indigo-600 font-medium text-sm hover:text-indigo-800"
                  onClick={(e) => {
                    e.stopPropagation(); // prevents triggering the card onClick
                    navigate(`/courses/${course.id}`);
                  }}
                >
                  View Details →
                </button>

              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default Courses;
