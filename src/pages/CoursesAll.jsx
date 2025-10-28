import TopBar from "../components/topbar/TopBar";
import Footer from "../components/footer/Footer";
import Courses from "../components/courses/Courses"; 

function CoursesAll() {
  return (
    <>
      <TopBar />

      {/* The Courses component handles all course rendering */}
      <main className="min-h-screen bg-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <Courses />
        </div>
      </main>

      <Footer />
    </>
  );
}

export default CoursesAll;
