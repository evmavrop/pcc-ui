import React from "react";

const Footer = (props) => {

  return ( 
    <footer>
        <div className="footer-main">
            <div className="row">
                <div className="col-md-6">
                    <div className="footer-logo footer-eudat-logo">
                    </div>
                    <div className="footer-logo">© 2023 EUDAT Collaborative Data Infrastructure / GRNET </div>
                </div>
                <div className="col-md-6">
                    <nav className="navbar navbar-footer pull-right">
                    <ul id="menu" className="nav nav-footer">
                        <li><a href="https://www.eudat.eu/eudat-cdi-aup" target="_blank" rel="noreferrer">EUDAT Service ToU</a></li>
                        <li><a href="#" target="_blank" rel="noreferrer">Data Privacy Policy</a></li>
                        <li><a href="#" target="_blank" rel="noreferrer">Legal Notice</a></li>
                        <li><a href="https://eudat.eu/eudat-cdi" target="_blank" rel="noreferrer">About EUDAT</a></li>
                    </ul>
                    </nav>
                </div>
            </div>
            <hr className="footer-line"/>
            <div className="row">
                <div className="col-md-8">
                   <div className="footer-logo">
                        PCC is the central catalogue where you may find information about all handles of EUDAT.
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="footer-powered">
                        <a href="https://www.grnet.gr" target="_blank" rel="noreferrer" >Powered by GRNET</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  );
};

export default Footer;
