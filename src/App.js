import './App.css';
import { Routes, Route } from "react-router-dom";
import { Home } from './pages/Home';
import { Orders } from './pages/api/Orders';


function App() {
  return (
    <>
      <h1>CoW Protocol Examples</h1>
      <hr />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="orders" element={<Orders />} />
      </Routes>
    </>
  )
}

export default App;
