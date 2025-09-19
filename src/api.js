const BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export async function fetchPetitions(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE}/api/petitions?${qs}`);
    return res.json();
}
export async function fetchMeta() {
    const res = await fetch(`${BASE}/api/meta`);
    return res.json();
}
export async function createPetition(body) {
    const res = await fetch(`${BASE}/api/petitions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    return res.json();
}
export async function votePetition(id, voterId) {
    const res = await fetch(`${BASE}/api/petitions/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-voter-id": voterId },
        body: JSON.stringify({})
    });
    return res.json();
}
export async function fetchPetition(id, voterId) {
    const res = await fetch(`${BASE}/api/petitions/${id}`, {
        headers: { "x-voter-id": voterId || "" }
    });
    return res.json();
}
