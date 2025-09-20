import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Create from "./pages/Create";
import PetitionDetail from "./components/PetitionDetail";

export default function App() {
    const location = useLocation();
    const showHeader = location.pathname !== "/";

    useEffect(() => {
        if (window.Telegram?.WebApp) {
            // Главная кнопка TMA
            // const mainButton = window.Telegram.WebApp.MainButton;
            // mainButton.setText("Создать петицию").show().onClick(() => {
            //     window.location.href = "/create";
            // });

            // Back button
            if (location.pathname !== "/") {
                window.Telegram.WebApp.BackButton.show().onClick(() => {
                    window.history.back();
                });
            } else {
                window.Telegram.WebApp.BackButton.hide();
            }
        }
    }, [location.pathname]);

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