import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span>🛸 Rick & Morty</span>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink to="/characters" className={({ isActive }) => isActive ? "active" : ""}>
            Personajes
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;