import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "./dashboard.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Domains from "./components/Domains";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";


function App() {

  return (
    <BrowserRouter basename="/">
      <div className="App">
        <Header></Header>
        <div className="container-fluid">
          <div className="row">
            <Sidebar/>
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 mt-4">
              <Routes>
                <Route
                  exact
                  path="/domains"
                  element={<Domains />}
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
