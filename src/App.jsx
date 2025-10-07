import { useState } from 'react';
import Header from './components/header/Header';
import Programs from './components/programs/Programs';
import Footer from './components/footer/Footer';
import Terms from './components/terms/Terms';
import './App.css';


function App() {
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
        <Footer />
      </div>
    </>
  );
}

export default App;
