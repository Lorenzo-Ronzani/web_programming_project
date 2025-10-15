import { useState } from 'react';
import Header from '../header/Header';
import Programs from '../programs/Programs';
import Terms from '../terms/Terms';
import Footer from '../footer/Footer';
import '../../App.css';

function Home() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <Header />
      </div>
      <div>
        <Programs />
      </div>
      <div>
        <Terms />
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
}

export default Home;
