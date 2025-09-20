import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import PetitionCard from "../components/PetitionCard";
import { fetchPetitions } from "../api";

export default function Home() {
    const [topPetitions, setTopPetitions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadTopPetitions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetchPetitions({ top: true });
            setTopPetitions(res.data || []);
        } catch (err) {
            console.error("Fetch error:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTopPetitions();
    }, [loadTopPetitions]);

    return (
        <main className="home-container" role="main">
            <header className="home-header">
                <h1 className="home-title">JMD Петиции</h1>
                <p className="home-subtitle">
                    Создавайте и поддерживайте инициативы для изменений
                </p>
            </header>

            <section className="top-petitions" aria-label="Популярные петиции">
                <h2 className="top-petitions-title">Популярные петиции</h2>
                {error && <div className="error-message">{error}</div>}
                {loading ? (
                    <div className="loading">
                        <div className="skeleton skeleton-card"></div>
                        <div className="skeleton skeleton-card"></div>
                        <div className="skeleton skeleton-card"></div>
                    </div>
                ) : topPetitions.length === 0 ? (
                    <div className="empty">Популярные петиции не найдены</div>
                ) : (
                    <div className="petitions-grid">
                        {topPetitions.map((p) => (
                            <PetitionCard key={p.id} p={p} />
                        ))}
                    </div>
                )}
            </section>

            <section className="actions" aria-label="Действия">
                <Link to="/search" className="action-btn">
                    Найти петиции
                </Link>
                <Link to="/create" className="action-btn">
                    Создать петицию
                </Link>
            </section>
        </main>
    );
}