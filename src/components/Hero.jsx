import React from "react";
import { Link } from "react-router-dom";
import { Search, FileText } from "lucide-react";

export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-content fade-in-up">
                <h1 className="hero-title">Ваш голос меняет будущее</h1>
                <p className="hero-subtitle">
                    JMD Petitions - платформа для создания и поддержки инициатив. Вносите изменения, которые важны для вас и вашего сообщества.
                </p>
                <div className="hero-actions">
                    <Link to="/search" className="btn btn-primary">
                        <Search size={18} className="inline-block mr-1" /> Просмотреть петиции
                    </Link>
                    <Link to="/create" className="btn btn-secondary">
                        <FileText size={18} className="inline-block mr-1" /> Создать петицию
                    </Link>
                </div>
            </div>
        </section>
    );
}