import React from "react";

export default function PetitionCard({ p, onOpen, onVote, voted }) {
    return (
        <div className="card">
            <div className="petition-title">{p.title}</div>
            <div className="petition-desc">{p.description}</div>
            <div className="petition-meta">
                <div>
                    <div className="small">{p.category} · {p.region}</div>
                    <div className="small">Автор: {p.authorName}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <div style={{ marginBottom: 8 }} className="small">Голоса: {p.votes}</div>
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button className="vote-btn" onClick={() => onVote(p.id)} disabled={voted}> {voted ? "Вы проголосовали" : "Проголосовать"} </button>
                        <button onClick={() => onOpen(p.id)} style={{ background: "none", border: "none", color: "var(--blue-600)", fontWeight:600, cursor: "pointer" }}>Открыть</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
