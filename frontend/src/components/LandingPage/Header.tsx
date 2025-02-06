import React from "react";
import "./Header.css";

const Header: React.FC = () => {
  // const [search, setSearch] = useState("");

  return (
    <header className="header-container">
      <nav>
        <ul className="nav-menu">
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#monthly-book">
              Monthly Book
            </a>
          </li>
          <li>
            <form>
              <input
                type="text"
                placeholder="Search..."
              ></input>
            </form>
          </li>
          <li>
            <a href="#sign-up">Sign Up</a>
          </li>
          <li>
            <a href="#login">Login</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
