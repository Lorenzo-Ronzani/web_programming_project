// ------------------------------------------------------
// Programs.jsx (Enhanced - Active Intakes + Multiple Starts)
// ------------------------------------------------------
import { useEffect, useState } from "react";
import { buildApiUrl } from "../../api";
import { Link } from "react-router-dom";

function Programs({ limit }) {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // ---- 1. PROGRAMS ----
        const resPrograms = await fetch(buildApiUrl("getPrograms"));
        const dataPrograms = await resPrograms.json();

        // ---- 2. PUBLIC INTAKES ----
        const resIntakes = await fetch(buildApiUrl("getPublicIntakes"));
        const dataIntakes = await resIntakes.json();

        // ---- 3. TUITION ----
        const resTuition = await fetch(buildApiUrl("getTuition"));
        const dataTuition = await resTuition.json();

        // ---- MAPA DE INTAKES (somente ENABLED) ----
        const intakeMap = {};

        dataIntakes.items
          ?.filter((i) => i.enable_status === "enabled")
          .forEach((i) => {
            if (!intakeMap[i.program_id]) {
              intakeMap[i.program_id] = [];
            }
            intakeMap[i.program_id].push(i.starts_in);
          });

        // ---- MAPA DE FEES ----
        const tuitionMap = {};
        dataTuition.items?.forEach((t) => {
          tuitionMap[t.program_id] = {
            domestic: t.domestic?.estimated_total || null,
            international: t.international?.estimated_total || null,
          };
        });

        // ---- MERGE FINAL ----
        const merged = dataPrograms.items?.map((p) => ({
          ...p,

          // MULTIPLE INTAKES
          start: Array.isArray(intakeMap[p.id])
            ? intakeMap[p.id].join(", ")
            : "Not Available",

          // FEES
          fees: tuitionMap[p.id]
            ? `Domestic: $${tuitionMap[p.id].domestic}\nInternational: $${tuitionMap[p.id].international}`
            : "Not Available",

          terms: p.program_length ? `${p.program_length} Terms` : "N/A",
        }));

        setPrograms(merged || []);
      } catch (err) {
        console.error("Error loading programs:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const displayedPrograms = limit ? programs.slice(0, limit) : programs;

  // Color palette
  const colorMap = {
    blue: "bg-blue-100 text-blue-600 hover:bg-blue-200",
    green: "bg-green-100 text-green-600 hover:bg-green-200",
    purple: "bg-purple-100 text-purple-600 hover:bg-purple-200",
    amber: "bg-amber-100 text-amber-600 hover:bg-amber-200",
    red: "bg-red-100 text-red-600 hover:bg-red-200",
    indigo: "bg-indigo-100 text-indigo-600 hover:bg-indigo-200",
    cyan: "bg-cyan-100 text-cyan-600 hover:bg-cyan-200",
    pink: "bg-pink-100 text-pink-600 hover:bg-pink-200",
  };

  const buttonColorMap = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
    purple: "bg-purple-600 hover:bg-purple-700",
    amber: "bg-amber-600 hover:bg-amber-700",
    red: "bg-red-600 hover:bg-red-700",
    indigo: "bg-indigo-600 hover:bg-indigo-700",
    cyan: "bg-cyan-600 hover:bg-cyan-700",
    pink: "bg-pink-600 hover:bg-pink-700",
  };

  if (loading) {
    return (
      <section className="py-12 text-center text-gray-600">
        Loading programs...
      </section>
    );
  }

  return (
    <section id="programs" className="bg-gray-50 pt-5 pb-10">
      <div className="mx-auto w-[95%] max-w-[1600px] px-6">
        
        <div className="mt-1 text-center">
          <h2 className="mb-1 text-4xl font-bold text-gray-900">Our Programs</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Choose the program that fits your career goals and timeline.
          </p>
        </div>

        {/* PROGRAM CARDS */}
        <div className="mt-18 grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-6">
          {displayedPrograms.map((program) => (
            <div
              key={program.id}
              className="flex min-h-[520px] cursor-pointer flex-col rounded-xl bg-white p-6 shadow-lg duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Icon */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <span
                  className={`material-symbols-outlined ${
                    colorMap[program.color]?.split(" ")[1]
                  }`}
                  style={{ fontSize: "32px" }}
                >
                  {program.icon}
                </span>
              </div>

              {/* Title */}
              <h3 className="mt-2 mb-3 text-2xl font-bold text-gray-900">
                {`${program.title} - ${program.credential}`}
              </h3>

              {/* Description */}
              <p className="mb-4 grow text-gray-600">{program.description}</p>

              {/* DETAILS */}
              <div className="mb-6 space-y-3 text-gray-700">

                <div className="flex items-center">
                  <span className={`material-symbols-outlined mr-3 ${colorMap[program.color]?.split(" ")[1]}`}>
                    schedule
                  </span>
                  <span>Duration: {program.duration}</span>
                </div>

                <div className="flex items-center">
                  <span className={`material-symbols-outlined mr-3 ${colorMap[program.color]?.split(" ")[1]}`}>
                    layers
                  </span>
                  <span>Terms: {program.terms}</span>
                </div>

                <div className="flex items-center">
                  <span className={`material-symbols-outlined mr-3 ${colorMap[program.color]?.split(" ")[1]}`}>
                    calendar_today
                  </span>
                  <span>Start: {program.start}</span>
                </div>

                <div className="flex items-center">
                  <span className={`material-symbols-outlined mr-3 ${colorMap[program.color]?.split(" ")[1]}`}>
                    attach_money
                  </span>
                  <span className="whitespace-pre-line">
                    Fees:
                    <br />
                    {program.fees}
                  </span>
                </div>
              </div>

              {/* BUTTON */}
              <div className="mt-auto pt-4">
                <Link to={`/program/${program.id}`}>
                  <button
                    className={`w-full cursor-pointer rounded-lg py-3 font-semibold text-white transition-colors ${
                      buttonColorMap[program.color] ||
                      "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    Learn More
                  </button>
                </Link>
              </div>

            </div>
          ))}
        </div>

        {limit && (
          <div className="text-center mt-12">
            <Link
              to="/programsall"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              View All Programs →
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}

export default Programs;
