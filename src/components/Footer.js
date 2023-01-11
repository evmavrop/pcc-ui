import React from "react";

const Footer = (props) => {

  return ( 
    <footer>
        <div class="footer-main">
            <div class="row">
                <div class="col-md-6">
                    <div class="footer-logo footer-eudat-logo">
                    </div>
                    <div class="footer-logo">© 2023 EUDAT Collaborative Data Infrastructure / GRNET </div>
                </div>
                <div class="col-md-6">
                    <nav class="navbar navbar-footer pull-right">
                    <ul id="menu" class="nav nav-footer">
                        <li><a href="https://www.eudat.eu/eudat-cdi-aup" target="_blank">EUDAT Service ToU</a></li>
                        <li><a href="#" target="_blank">Data Privacy Policy</a></li>
                        <li><a href="#" target="_blank">Legal Notice</a></li>
                        <li><a href="https://eudat.eu/eudat-cdi" target="_blank">About EUDAT</a></li>
                    </ul>
                    </nav>
                </div>
            </div>
            <hr class="footer-line"/>
            <div class="row">
                <div class="col-md-8">
                   <div class="footer-logo">
                        PCC is the central catalogue where you may find information about all handles of EUDAT.
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="footer-powered">
                        <a href="https://www.grnet.gr" target="_blank">Powered by GRNET</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  );
};

export default Footer;
