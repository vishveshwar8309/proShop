import React from "react";
import Headers from "./components/Headers";
import { Container } from "react-bootstrap";
import Footers from "./components/Footers";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Headers />
      <main className="py-3">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footers />
      <ToastContainer />
    </>
  );
}

export default App;
