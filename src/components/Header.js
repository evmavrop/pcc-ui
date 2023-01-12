import React from "react";
import logo from '../logo.png' // relative path to image 

const Header = (props) => {

  return ( 
    <header>
    <div id="header-top">
      <div className="row">
        <div className="eudat-link">
          <a href="http://www.eudat.eu" target="_blank" rel="noreferrer">GO TO EUDAT WEBSITE</a>
        </div>
      </div>
    </div>
    <div id="header-main">
      <div className="row">
        <div className="col-md-3">
          <a href="/"><img className="header_logo" src={logo} alt="PCC"/></a>
        </div>
        <div className="col-md-9">
          <div className="navbar navbar-default">
            <div className="container-fluid">
              <div id="gb_menu">
              <ul id="menu" >
             
              <li><a href="#" target="_blank" rel="noreferrer">FOR USERS</a></li>
              <li><a href="#" target="_blank" rel="noreferrer">ABOUT</a></li>
            </ul>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </header>
  );
};

export default Header;
