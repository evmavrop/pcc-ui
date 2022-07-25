import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "./dashboard.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { useEffect, useState } from "react";

import Container from "./components/Container";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DataManager from "./api/DataManager";

function App() {
  const [domains, setDomains] = useState([]);

  useEffect(() => {
    let DM = new DataManager("localhost:8080/v1");
    DM.getDomains().then((response) => setDomains(response));
  }, []);

  return (
    <BrowserRouter basename="/">
      <div className="App">
        <Header></Header>
        <div className="container-fluid">
          <div className="row">
            <Sidebar/>
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
              <Routes>
                <Route
                  exact
                  path="/domains"
                  element={<Container domains={domains} />}
                />
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
