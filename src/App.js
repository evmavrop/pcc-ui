import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "./dashboard.css";
import { BrowserRouter, Route, Routes} from "react-router-dom";

import { NotFound } from "./components/Utils";
import Domains from "./components/Domains";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Providers, ProviderDetails } from "./components/Providers";
import { Prefixes, PrefixDetails, PrefixAdd, PrefixUpdate, PrefixLookup } from "./components/Prefixes";
import Services from "./components/Services";

function App() {

  return (
    <BrowserRouter basename="/">
      <div className="App">
        <Header></Header>
       
        <div className="container-fluid h-100">
          <div className="row">
          <Sidebar/>
          <div id="main" className="col">
            <main>
              <Routes>
                <Route
                  path="/dashboard"
                  element={<></>}
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
                  exact
                  path="/providers/:name"
                  element={<ProviderDetails />}
                />
                <Route
                  path="/prefixes"
                  element={<Prefixes />}
                />
                <Route
                  path="/prefixes/:id"
                  element={<PrefixDetails toDelete={false}/>}
                />
                <Route
                  path="/prefixes/:id/delete"
                  element={<PrefixDetails toDelete={true}/>}
                />
                <Route
                  path="/prefixes/add"
                  element={<PrefixAdd />}
                />
                <Route
                  path="/prefixes/:id/update"
                  element={<PrefixUpdate/>}
                />
                <Route
                  path="/lookup"
                  element={<PrefixLookup/>}
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
        <Footer />
      </div>
      
    </BrowserRouter>
  );
}

export default App;
