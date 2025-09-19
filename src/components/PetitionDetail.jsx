import React, { useEffect, useState } from "react";
import { fetchPetition, votePetition } from "../api";

export default function PetitionDetail({ id, onBack }) {
    const [pet, setPet] = useState(null);
    const [voted, setVoted] = useState(false);

    useEffect(()=> {
        load();
    }, [id]);

    async function load(){
        const voter = localStorage.getItem("voterId");
        const res = await fetchPetition(id, voter);
        setPet(res.petition);
        setVoted(res.voted);
    }

    async function handleVote(){
        const voter = localStorage.getItem("voterId");
        await votePetition(id, voter);
        setVoted(true);
        await load();
    }

    if(!pet) return <div className="card">Загрузка...</div>;

    return (
        <div>
            <div className="card" style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                    <div style={{ fontWeight:700 }}>{pet.title}</div>
                    <div className="small">{pet.category} · {pet.region}</div>
                </div>
                <div>
                    <button onClick={onBack} style={{ background:"none", border:"none", color:"var(--blue-600)", fontWeight:600 }}>Назад</button>
                </div>
            </div>

            <div className="card">
                <div className="petition-desc">{pet.description}</div>
            </div>

            <div className="card">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>Голоса: <strong>{pet.votes}</strong></div>
                    <div>
                        <button className="vote-btn" onClick={handleVote} disabled={voted}>{voted ? "Вы проголосовали" : "Проголосовать"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
