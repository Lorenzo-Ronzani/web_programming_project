import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { buildApiUrl } from "../../api";

import TopBar from "../topbar/TopBar";

const CourseDetails = () => {
  const { id } = useParams();

  // Stores the selected course
  const [course, setCourse] = useState(null);

  // Controls loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const url = buildApiUrl("getCourses");
        const res = await fetch(url);
        const data = await res.json();

        let items = [];

        if (Array.isArray(data.items)) items = data.items;
        else if (Array.isArray(data)) items = data;

        const found = items.find((c) => String(c.id) === String(id)) || null;
        setCourse(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return <p className="p-10 text-center text-gray-600">Loading...</p>;
  }

  if (!course) {
    return <p className="p-10 text-center text-gray-700">Course not found.</p>;
  }

  return (
    <div className="w-full">
      <TopBar />

      {/* HERO SECTION */}
      <div className="w-full bg-gradient-to-r from-indigo-700 to-blue-900 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold">{course.title}</h1>
          <p className="text-xl mt-2 opacity-80">{course.code}</p>
        </div>
      </div>

      {/* BREADCRUMB */}
      <div className="max-w-6xl mx-auto px-6 py-4 text-sm text-gray-500">
        <span>Study</span> {">"} <span>Open Studies</span> {">"}{" "}
        <span className="text-gray-700 font-medium">{course.title}</span>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* LEFT SIDE – DESCRIPTION */}
        <div className="col-span-2">

          {/* Course Description */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Course Description
          </h2>

          <p className="text-gray-700 leading-relaxed mb-8">
            {course.details || "No description available."}
          </p>

        </div>

        {/* RIGHT SIDE – META + OFFERINGS */}
        <div className="space-y-6">

          {/* Credits Box */}
          <div className="border rounded-md p-6 text-center">
            <p className="text-4xl font-bold text-gray-900">{course.credits}</p>
            <p className="text-gray-600 font-medium">Credits</p>
          </div>

          {/* Course Offerings */}
          <div className="border rounded-md p-6 shadow-sm bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Available course offerings
            </h3>

            {/* Sample offering (static template) */}
            <div className="mb-4">
              <p className="font-semibold text-gray-800">
                Face to Face – Synchronous
              </p>

              {/* Example collapsible group */}
              <details className="mt-2 cursor-pointer">
                <summary className="text-gray-700 text-sm font-medium">
                  January 7, 2026 – April 28, 2026
                </summary>

                <div className="ml-4 mt-2 text-gray-600 text-sm">
                  <p>Days: Monday, Wednesday, Friday</p>
                  <p>Instructor: {course.instructor || "TBA"}</p>
                </div>
              </details>

              <details className="mt-2 cursor-pointer">
                <summary className="text-gray-700 text-sm font-medium">
                  January 7, 2026 – April 28, 2026
                </summary>

                <div className="ml-4 mt-2 text-gray-600 text-sm">
                  <p>Days: Tuesday & Thursday</p>
                  <p>Instructor: {course.instructor || "TBA"}</p>
                </div>
              </details>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
