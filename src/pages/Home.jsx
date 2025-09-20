import React, { useState } from "react";
import Hero from "../components/Hero";
import TopPetitions from "../components/TopPetitions";
import { votePetition } from "../api";

export default function Home() {
    const [votedMap, setVotedMap] = useState({});

    async function handleVote(id) {
        try {
            const voterId = localStorage.getItem("voterId");
            await votePetition(id, voterId);
            setVotedMap(prev => ({ ...prev, [id]: true }));
        } catch (error) {
            alert("Не удалось проголосовать: " + error.message);
        }
    }

    return (
        <>
            <Hero />
            <TopPetitions onVote={handleVote} votedMap={votedMap} />
        </>
    );
}