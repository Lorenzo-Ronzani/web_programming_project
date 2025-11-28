import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { buildApiUrl } from "../../api";

import TopBar from "../../components/topbar/TopBar";
import TuitionSection from "../../components/programs/TuitionSection";

const CourseDetails = () => {
  const { id } = useParams();

  const [program, setProgram] = useState(null);
  const [requirements, setRequirements] = useState(null);
  const [admissions, setAdmissions] = useState(null);
  const [tuition, setTuition] = useState(null);
  const [structure, setStructure] = useState(null);
  const [intakes, setIntakes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // ---------------------------------------
        // 1) PROGRAM — via getPrograms (filtered)
        // ---------------------------------------
        const resPrograms = await fetch(buildApiUrl("getPrograms"));
        const pData = await resPrograms.json();
        const foundProgram = pData.items?.find((p) => p.id === id) || null;
        setProgram(foundProgram);

        // ---------------------------------------
        // 2) REQUIREMENTS
        // ---------------------------------------
        const resReq = await fetch(buildApiUrl("getRequirements"));
        const reqData = await resReq.json();
        const foundReq =
          reqData.items?.find((r) => r.program_id === id) || null;
        setRequirements(foundReq);

        // ---------------------------------------
        // 3) ADMISSIONS
        // ---------------------------------------
        const resAdm = await fetch(buildApiUrl("getAdmissions"));
        const admData = await resAdm.json();
        const foundAdm =
          admData.items?.find((a) => a.program_id === id) || null;
        setAdmissions(foundAdm);

        // ---------------------------------------
        // 4) TUITION
        // ---------------------------------------
        const resTuition = await fetch(buildApiUrl("getTuition"));
        const tData = await resTuition.json();
        const foundTuition =
          tData.items?.find((t) => t.program_id === id) || null;
        setTuition(foundTuition);

        // ---------------------------------------
        // 5) STRUCTURE
        // ---------------------------------------
        const resStruct = await fetch(buildApiUrl("getProgramStructure"));
        const sData = await resStruct.json();
        const foundStruct =
          sData.items?.find((s) => s.program_id === id) || null;
        setStructure(foundStruct);

        // ---------------------------------------
        // 6) PUBLIC INTAKES (enabled only)
        // ---------------------------------------
        const resIntakes = await fetch(buildApiUrl("getPublicIntakes"));
        const iData = await resIntakes.json();
        const enabledIntakes =
          iData.items?.filter(
            (i) => i.program_id === id && i.enable_status === "enabled"
          ) || [];
        setIntakes(enabledIntakes);
      } catch (error) {
        console.error("Error loading program details:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) {
    return <p className="p-10 text-center text-gray-600">Loading...</p>;
  }

  if (!program) {
    return (
      <p className="p-10 text-center text-gray-700">
        Program not found.
      </p>
    );
  }

  // Utility to split text into list items
  const splitLines = (text) =>
    text ? text.split("\n").filter((l) => l.trim() !== "") : [];

  return (
    <div className="w-full">
      {/* TOP BAR */}
      <TopBar />
      
      {/* --------------------------------------
          HERO SECTION
      --------------------------------------- */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-16 px-6 md:px-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {program.title}
            </h1>
            <p className="max-w-2xl text-lg opacity-90">
              {program.description}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-5 min-w-[260px] shadow">
            <div className="mb-2">
              <p className="text-sm font-semibold opacity-80">Credential</p>
              <p className="font-bold">{program.credential}</p>
            </div>

            <div className="mb-2">
              <p className="text-sm font-semibold opacity-80">Program length</p>
              <p className="font-bold">
                {program.program_length}{" "}
                {program.program_length === 1 ? "Term" : "Terms"}
              </p>
            </div>

            <div className="mb-2">
              <p className="text-sm font-semibold opacity-80">Area</p>
              <p className="font-bold">{program.area}</p>
            </div>

            <div>
              <p className="text-sm font-semibold opacity-80">School</p>
              <p className="font-bold">{program.school}</p>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------
          ABOUT SECTION
      --------------------------------------- */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-12">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">About</h2>
        <p className="text-gray-700 leading-relaxed">
          {program.about || program.description}
        </p>
      </section>

      {/* --------------------------------------
          REQUIREMENTS + SOFTWARE
      --------------------------------------- */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-10">

          {/* Left Column */}
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              Admission Requirements
            </h2>

            {requirements ? (
              <ul className="list-disc ml-6 space-y-2 text-gray-700">
                {splitLines(requirements.requirements).map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">
                Admission requirements not available.
              </p>
            )}

            {admissions && (
              <>
                <h3 className="text-xl font-semibold text-blue-900 mt-6 mb-2">
                  English Language Proficiency
                </h3>
                <p className="text-gray-700">
                  {admissions.language_proficiency}
                </p>

                <h3 className="text-xl font-semibold text-blue-900 mt-6 mb-2">
                  Academic Upgrading
                </h3>
                <p className="text-gray-700">
                  {admissions.academic_upgrading}
                </p>
              </>
            )}
          </div>

          {/* Right Column */}
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              Laptop Requirements
            </h2>
            {requirements ? (
              <ul className="list-disc ml-6 space-y-1 text-gray-700">
                {splitLines(requirements.laptop).map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">
                Laptop requirements not available.
              </p>
            )}

            <h3 className="text-xl font-semibold text-blue-900 mt-6 mb-2">
              Software Tools
            </h3>
            {requirements?.software_tools?.length ? (
              <ul className="list-disc ml-6 space-y-1 text-gray-700">
                {requirements.software_tools.map((tool, idx) => (
                  <li key={idx}>{tool}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Software tools not available.</p>
            )}
          </div>
        </div>
      </section>

      {/* --------------------------------------
          TUITION & FEES (Bow Valley)
      --------------------------------------- */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-12">
        <TuitionSection tuition={tuition} />
      </section>

      {/* --------------------------------------
          PROGRAM STRUCTURE
      --------------------------------------- */}
      {structure && (
        <section className="bg-gray-50 py-12">
          <div className="max-w-6xl mx-auto px-6 md:px-10">
            <h2 className="text-3xl font-bold text-blue-900 mb-6">
              Program Structure
            </h2>

            {structure.terms?.map((term, idx) => (
              <div key={idx} className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {term.term_name}
                </h3>

                <ul className="list-disc ml-6 text-gray-700 space-y-1">
                  {term.courses?.map((course, j) => (
                    <li key={j}>{course}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --------------------------------------
          ACTIVE INTAKES
      --------------------------------------- */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-12">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">
          Available Intakes
        </h2>

        {intakes.length ? (
          <ul className="list-disc ml-6 space-y-1 text-gray-700">
            {intakes.map((intake, idx) => (
              <li key={idx}>{intake.starts_in}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">
            There are no active public intakes for this program at the moment.
          </p>
        )}
      </section>
    </div>
  );
};

export default CourseDetails;
