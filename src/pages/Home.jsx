import { useState } from 'react';
import Header from '../components/header/Header';
import Programs from '../components/programs/Programs';
import Terms from '../components/terms/Terms';
import Footer from '../components/footer/Footer';
import '../App.css';

function Home() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <Programs />
      <Terms />
      <Footer />
    </>
  );
}

export default Home;
