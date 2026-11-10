import { Link } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import { AdminOnlyWrapper } from "../UniversalComponents/UniversalComponents";
import "./NavBar.css";

export default function NavBar() {
  const auth = useAuth();

  return (
    <nav className="nav-bar">
      <Link to="/">
        <img
          src="/fiveoaksbanner.png"
          alt="Five Oaks Church"
          className="nav-bar-image"
        ></img>
      </Link>
      <ul className="link-list">
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
