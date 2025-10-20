import { useState } from 'react';
import Home from './pages/Home';
import './App.css';
import DashBoard from './pages/DashBoard';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <DashBoard />
      <Home />
    </>
  );
}

export default App;
