import { Link } from "react-router-dom";

export function Home() {
  return (
    <>
      <main>
        <h2>Welcome!</h2>
        <p>Here you will find some basic examples on various ways you can integrate with CoW Protocol.</p>
      </main>
      <h2>SDK Examples</h2>
      <nav>
        <ul>
          <li><Link to="/Orders">API: Get last 5 orders for a given account</Link></li>
        </ul>
      </nav>
    </>
  );
}