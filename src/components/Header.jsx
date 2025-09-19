import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Home, Search, FileText } from "lucide-react";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="header" aria-label="Main navigation">
            <nav className="nav">
                <NavLink to="/" className="logo" onClick={() => setIsOpen(false)}>
                    <div className="logo-icon">
                        <FileText size={20} />
                    </div>
                    JMD Petitions
                </NavLink>
                <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            onClick={() => setIsOpen(false)}
                        >
                            <Home size={18} className="inline-block mr-1" /> Главная
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/search"
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            onClick={() => setIsOpen(false)}
                        >
                            <Search size={18} className="inline-block mr-1" /> Поиск
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/create"
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            onClick={() => setIsOpen(false)}
                        >
                            <FileText size={18} className="inline-block mr-1" /> Создать
                        </NavLink>
                    </li>
                </ul>
                <button
                    className={`burger ${isOpen ? 'open' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </nav>
        </header>
    );
}