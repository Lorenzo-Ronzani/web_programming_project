import { useState } from 'react';
import Home from './pages/Home';
import './App.css';
import Dashboard from './pages/DashBoard';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Dashboard />
      <Home />
    </>
  );
}

export default App;
