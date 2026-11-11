import { Link } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import { AdminOnlyWrapper } from "../UniversalComponents/UniversalComponents";
import { useState } from "react";
import "./NavBar.css";

export default function NavBar() {
  const auth = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="nav-bar">
      <Link to="/" onClick={() => setMenuOpen(false)}>
        <img
          src="/fiveoaksbanner.png"
          alt="Five Oaks Church"
          className="nav-bar-image"
        ></img>
      </Link>

      <button
        className="menu-toggle"
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      <ul className={`link-list ${menuOpen ? "open" : ""}`}>
        <li>
          {auth?.user?.email !== undefined ? (
            <Link className="link-list-item" to="/">
              Dashboard
            </Link>
          ) : (
            ""
          )}
        </li>
        <li>
          <AdminOnlyWrapper>
            <Link className="link-list-item" to="/userdashboard">
              User Dashboard
            </Link>
          </AdminOnlyWrapper>
        </li>
        <li>
          <Link className="link-list-item" to="/about">
            About
          </Link>
        </li>
        <li>
          {auth?.user?.email !== undefined ? (
            <Link className="link-list-item" to="/bugreport">
              Bug Report
            </Link>
          ) : (
            ""
          )}
        </li>
        <li>
          {auth?.user?.email !== undefined ? (
            <Link className="link-list-item" to="/Account">
              {auth?.user?.email}
            </Link>
          ) : (
            <Link className="link-list-item" to="/Account/login">
              {"Login"}
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
