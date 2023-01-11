import React from "react";
import logo from '../logo.png' // relative path to image 

const Header = (props) => {

  return ( 
    <header>
    <div id="header-top">
      <div class="row">
        <div class="eudat-link">
          <a href="http://www.eudat.eu" target="_blank">GO TO EUDAT WEBSITE</a>
        </div>
      </div>
    </div>
    <div id="header-main">
      <div class="row">
        <div class="col-md-3">
          <a href="/"><img class="header_logo" src={logo} alt="PCC"/></a>
        </div>
        <div class="col-md-9">
          <div class="navbar navbar-default">
            <div class="container-fluid">
              <div id="gb_menu">
              <ul id="menu" >
             
              <li><a href="#" target="_blank">FOR USERS</a></li>
              <li><a href="#" target="_blank">ABOUT</a></li>
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
