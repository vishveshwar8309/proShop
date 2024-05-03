import React from "react";
import Headers from "./components/Headers";
import { Container } from "react-bootstrap";
import Footers from "./components/Footers";
// import Home from "./screens/Home";
import { Outlet } from "react-router-dom";

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
        </>
    );
}

export default App;
