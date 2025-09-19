import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PetitionCard from "./PetitionCard";
import Filters from "./Filters";
import { fetchPetitions, fetchMeta, votePetition } from "../api";

export default function SearchPetitions() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [list, setList] = useState([]);
    const [meta, setMeta] = useState({ categories: [], regions: [] });
    const [q, setQ] = useState(searchParams.get("q") || "");
    const [filters, setFilters] = useState({
        category: searchParams.get("category") || null,
        region: searchParams.get("region") || null
    });
    const [loading, setLoading] = useState(false);
    const [votedMap, setVotedMap] = useState({});

    const voterId = localStorage.getItem("voterId") || Math.random().toString(36).slice(2);
    useEffect(() => { localStorage.setItem("voterId", voterId); }, [voterId]);

    useEffect(() => {
        loadMeta();
        load();
    }, []);

    async function loadMeta() {
        try {
            const m = await fetchMeta();
            setMeta(m);
        } catch (error) {
            console.error("Failed to load meta:", error);
        }
    }

    async function load() {
        setLoading(true);
        try {
            const params = { ...filters, q: q || undefined };
            const res = await fetchPetitions(params);
            setList(res.data || []);
        } catch (error) {
            console.error("Failed to load petitions:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleFilterChange(change) {
        setFilters(prev => ({ ...prev, ...change }));
        const newParams = { ...Object.fromEntries(searchParams), ...change };
        if (change.category === null) delete newParams.category;
        if (change.region === null) delete newParams.region;
        setSearchParams(newParams);
        setTimeout(load, 100);
    }

    async function handleSearch(e) {
        e.preventDefault();
        const newParams = { ...Object.fromEntries(searchParams), q };
        if (!q) delete newParams.q;
        setSearchParams(newParams);
        load();
    }

    async function handleVote(id) {
        try {
            await votePetition(id, voterId);
            setVotedMap(prev => ({ ...prev, [id]: true }));
            load(); // Reload to update votes
        } catch (error) {
            alert("Не удалось проголосовать: " + error.message);
        }
    }

    return (
        <div>
            <h1 style={{ fontSize: "2rem", fontWeight: "600", marginBottom: "24px" }}>Поиск петиций 🔍</h1>

            <form onSubmit={handleSearch} className="search-row">
                <input
                    type="text"
                    placeholder="Поиск по заголовку, описанию или автору"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    className="search-input"
                />
                <button type="submit" className="search-btn" disabled={loading}>
                    {loading ? "Поиск..." : "Найти"}
                </button>
            </form>

            <Filters meta={meta} onFilterChange={handleFilterChange} filters={filters} />

            {loading ? (
                <div className="loading">Загрузка...</div>
            ) : list.length === 0 ? (
                <div className="empty">Петиций не найдено. Попробуйте изменить поиск.</div>
            ) : (
                <div className="petitions-grid">
                    {list.map(p => (
                        <PetitionCard key={p.id} p={p} onVote={handleVote} voted={!!votedMap[p.id]} />
                    ))}
                </div>
            )}
        </div>
    );
}