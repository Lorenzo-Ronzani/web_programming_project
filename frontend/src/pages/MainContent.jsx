import TopBar from '../components/topbar/TopBar';
import MainContent from '../components/content/MainContent';
import Programs from '../components/programs/Programs';
import Courses from '../components/courses/Courses';
import Terms from '../components/terms/Terms';
import Footer from '../components/footer/Footer';

import { Link } from "react-router-dom";

function Content() {
  return (
    <>
      <TopBar />
        <MainContent />

        <Programs limit={3} />

        <Courses limit={8} />
        {/* Link to view all courses */}
        <div className="text-center mt-8 pb-10">
          <Link
            to="/coursesall"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            View All Courses →
          </Link>
        </div>

        <Terms />
      <Footer />
    </>
  );
}
export default Content;