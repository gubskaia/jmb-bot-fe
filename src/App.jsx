import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Create from "./pages/Create";
import PetitionDetail from "./components/PetitionDetail";

export default function App() {
    const location = useLocation();
    const showHeader = location.pathname !== "/";

    return (
        <div className="app">
            {showHeader && <Header />}
            <div className="container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/create" element={<Create />} />
                    <Route path="/petition/:id" element={<PetitionDetail />} />
                </Routes>
            </div>
        </div>
    );
}