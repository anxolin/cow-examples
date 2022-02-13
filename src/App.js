import './App.css';
import { Routes, Route, Link } from "react-router-dom";
import { Orders } from './pages/api/Orders';
import { PostOrders } from './pages/api/PostOrder';

function Home() {
  return (
    <>
      <main>
        <h2>Welcome!</h2>
        <p>Here you will find some basic examples on various ways you can integrate with CoW Protocol.</p>
      </main>
      <h2>SDK Examples</h2>
      <nav>
        <ul>
        <li><Link to="/orders">Get last 5 orders for a given account</Link></li>
        <li><Link to="/post-order">Post an order</Link></li>
        </ul>
      </nav>
    </>
  );
}


function App() {
  return (
    <>
      <h1>CoW Protocol Examples</h1>
      <hr />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="orders" element={<Orders />} />
        <Route path="post-order" element={<PostOrders />} />
      </Routes>
    </>
  )
}

export default App;
