import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PetitionCard from "./PetitionCard";
import { fetchPetitions } from "../api";
import { ArrowRight } from "lucide-react";

export default function TopPetitions({ onVote, votedMap }) {
    const [topList, setTopList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTop() {
            try {
                const res = await fetchPetitions({ top: true });
                setTopList(res.data);
            } catch (error) {
                console.error("Failed to load top petitions:", error);
            } finally {
                setLoading(false);
            }
        }
        loadTop();
    }, []);

    if (loading) {
        return (
            <div className="loading" aria-live="polite">
                <div className="skeleton skeleton-card"></div>
                <div className="skeleton skeleton-card"></div>
            </div>
        );
    }

    return (
        <section className="fade-in-up">
            <div className="card">
                <h2 style={{ fontSize: "1.75rem", fontWeight: 600, marginBottom: "1.5rem" }}>
                    Популярные петиции
                </h2>
                <div className="petitions-grid">
                    {topList.map(p => (
                        <PetitionCard key={p.id} p={p} onVote={onVote} voted={!!votedMap[p.id]} isTop />
                    ))}
                </div>
                <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                    <Link to="/search" className="btn btn-secondary">
                        Все петиции <ArrowRight size={18} className="inline-block ml-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
}