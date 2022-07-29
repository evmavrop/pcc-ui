import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "./dashboard.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { NotFound } from "./components/Utils";
import Domains from "./components/Domains";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Providers from "./components/Providers";
import { Prefixes, PrefixDetails, PrefixAdd } from "./components/Prefixes";
import Services from "./components/Services";

function App() {

  return (
    <BrowserRouter basename="/">
      <div className="App">
        <Header></Header>
        <div className="container-fluid">
          <div className="row">
            <Sidebar />
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 mt-4">
              <Routes>
                <Route
                  element={<span>Dashboard</span>}
                />
                <Route
                  path="/domains"
                  element={<Domains />}
                />
                <Route
                  exact
                  path="/providers"
                  element={<Providers />}
                />
                <Route
                  path="/prefixes"
                  element={<Prefixes />}
                />
                <Route
                  path="/prefixes/:id"
                  element={<PrefixDetails />}
                />
                <Route
                  path="/prefixes/:id/delete"
                  element={<PrefixDetails toDelete={true}/>}
                />
                <Route
                  path="/prefixes/add"
                  element={<PrefixAdd />}
                />
                <Route path="*"
                  element={<NotFound />}
                />
              <Route
              exact
              path="/services"
              element={<Services />}
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
