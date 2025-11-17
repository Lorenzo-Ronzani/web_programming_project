import TopBar from "../components/topbar/TopBar";
import Footer from "../components/footer/Footer";
import Programs from "../components/programs/Programs"; 

function ProgramsAll() {
  return (
    <>
      <TopBar />

      {/* The Programs component handles all programs rendering */}
      <main className="min-h-screen bg-white py-12">
          <Programs />
      </main>

      <Footer />
    </>
  );
}

export default ProgramsAll;
