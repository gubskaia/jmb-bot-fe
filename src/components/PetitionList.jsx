import React, { useEffect, useState } from "react";
import PetitionCard from "./PetitionCard";
import Filters from "./Filters";
import CreatePetition from "./CreatePetition";
import { fetchPetitions, createPetition, fetchMeta, votePetition } from "../api";

export default function PetitionList({ onOpen }) {
    const [list, setList] = useState([]);
    const [meta, setMeta] = useState({ categories: [], regions: [] });
    const [q, setQ] = useState("");
    const [filters, setFilters] = useState({ category: null, region: null });
    const [loading, setLoading] = useState(false);
    const [votedMap, setVotedMap] = useState({}); // id->true local

    const voterId = localStorage.getItem("voterId") || (Math.random().toString(36).slice(2));

    useEffect(()=> { localStorage.setItem("voterId", voterId); }, []);

    useEffect(()=> {
        loadMeta();
        load();
    }, []);

    async function loadMeta(){
        const m = await fetchMeta();
        setMeta(m);
    }

    async function load(){
        setLoading(true);
        const params = {};
        if(q) params.q = q;
        if(filters.category) params.category = filters.category;
        if(filters.region) params.region = filters.region;
        const res = await fetchPetitions(params);
        setList(res.data || []);
        setLoading(false);
    }

    async function handleCreate(body){
        await createPetition(body);
        await load();
        await loadMeta();
    }

    async function handleVote(id){
        const voter = localStorage.getItem("voterId");
        try {
            await votePetition(id, voter);
            setVotedMap(prev => ({ ...prev, [id]: true }));
            await load();
        } catch (e) {
            alert("Не удалось проголосовать: " + e.message);
        }
    }

    return (
        <div>
            <div className="card header" style={{ justifyContent: "space-between" }}>
                <div style={{display:"flex", alignItems:"center", gap:12}}>
                    <div className="logo">JMD</div>
                    <div>
                        <div className="title">JMD — Петиции</div>
                        <div className="small">Создай и голосуй — mobile-first</div>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom:12 }}>
                <div className="searchRow">
                    <input placeholder="Поиск по заголовку или описанию" value={q} onChange={e=>setQ(e.target.value)} />
                    <button className="vote-btn" onClick={load}>Поиск</button>
                </div>

                <Filters meta={meta} onFilterChange={(change)=>{ setFilters(s=>({...s,...change})); setTimeout(load, 0); }} filters={filters} />
            </div>

            <CreatePetition onCreate={handleCreate} />

            <div style={{ marginTop:12 }}>
                {loading ? <div className="card">Загрузка...</div> :
                    list.length === 0 ? <div className="card">Петиций нет</div> :
                        list.map(p => <PetitionCard key={p.id} p={p} onOpen={onOpen} onVote={handleVote} voted={!!votedMap[p.id]} />)
                }
            </div>
        </div>
    );
}
