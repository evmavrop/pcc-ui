import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = (props) => {
  return (
    <nav
      id="sidebarMenu"
      className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
    >
      <div className="position-sticky pt-3 sidebar-sticky">
        <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted text-uppercase">
          <span>Menu</span>
        </h6>
        <ul className="nav flex-column ms-auto text-start">
          <li className="nav-item">
            <a className="nav-link active" aria-current="page" href="dashboard">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-home align-text-bottom"
                aria-hidden="true"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Dashboard
            </a>
          </li>
          <li className="nav-item">
            <NavLink
              to="prefixes"
              className="nav-link"
            >
              Prefixes
            </NavLink>
          </li>
        </ul>
        <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted text-uppercase">
          <span>Settings</span>
        </h6>
        <ul className="nav flex-column text-start">
          <li className="nav-item">
          <NavLink
              to="providers"
              className="nav-link"
            >
              Providers
            </NavLink>
          </li>
          <li className="nav-item">
          <NavLink
              to="services"
              className="nav-link"
            >
              Services
            </NavLink>
          </li>
          <li className="nav-item">
          <NavLink
              to="domains"
              className="nav-link"
            >
              Domains
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
