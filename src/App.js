import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { SingersContextProvider } from './hooks/SingersContext';

function App() {
  return (
    <>
      <SingersContextProvider>
        <Home />
      </SingersContextProvider>
    </>
  );
}

export default App;
