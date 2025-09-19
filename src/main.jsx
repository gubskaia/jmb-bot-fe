import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";

// Инициализация Telegram WebApp
if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready();  // App готово
    window.Telegram.WebApp.expand(); // Расширить на весь экран
    window.Telegram.WebApp.enableClosingConfirmation(); // Подтверждение закрытия
    console.log("TMA initialized:", window.Telegram.WebApp.initDataUnsafe?.user);
}

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);