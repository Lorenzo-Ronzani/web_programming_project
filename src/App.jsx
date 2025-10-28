import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Programs from "./components/programs/Programs";
import ProgramsAll from "./pages/ProgramsAll";
import Courses from "./components/courses/Courses";
import CoursesAll from "./pages/CoursesAll";
import Terms from "./components/terms/Terms";
import DashboardUser from "./pages/DashboardUser";
import MainContent from "./pages/MainContent";
import LoginPage from "./pages/LoginPage"; 
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboarduser" element={<DashboardUser />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programsall" element={<ProgramsAll />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/coursesall" element={<CoursesAll />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/content" element={<MainContent />} />
          <Route path="/login" element={<LoginPage />} /> 
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
