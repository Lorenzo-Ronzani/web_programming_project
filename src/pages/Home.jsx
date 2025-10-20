import Header from '../components/header/Header';
import Programs from '../components/programs/Programs';
import Courses from '../components/courses/Courses';
import Terms from '../components/terms/Terms';
import Footer from '../components/footer/Footer';

function Home() {
  return (
    <>
      <Header />
      <main>
        <Programs />
        <Courses />
        <Terms />
      </main>
      <Footer />
    </>
  );
}

export default Home;
