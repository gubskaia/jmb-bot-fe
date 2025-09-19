const BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export async function fetchPetitions(params = {}) {
    const validParams = {};
    // Only include defined and non-"undefined" values
    if (params.q && params.q !== "undefined") validParams.q = params.q;
    if (params.category && params.category !== "undefined") validParams.category = params.category;
    if (params.region && params.region !== "undefined") validParams.region = params.region;
    if (params.page && params.page !== "undefined") validParams.page = params.page;
    if (params.limit && params.limit !== "undefined") validParams.limit = params.limit;
    if (params.sort && params.sort !== "undefined") validParams.sort = params.sort;

    const qs = new URLSearchParams(validParams).toString();
    const res = await fetch(`${BASE}/api/petitions${qs ? `?${qs}` : ""}`);
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch petitions");
    }
    const data = await res.json();
    // Для топа: сортируем на фронте по votes desc
    if (params.top) {
        return { data: data.data.sort((a, b) => b.votes - a.votes).slice(0, 5), totalPages: 1 };
    }
    return data;
}

export async function fetchMeta() {
    const res = await fetch(`${BASE}/api/meta`);
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch meta");
    }
    return res.json();
}

export async function createPetition(body) {
    const res = await fetch(`${BASE}/api/petitions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create petition");
    }
    return res.json();
}

export async function votePetition(id, voterId) {
    const res = await fetch(`${BASE}/api/petitions/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-voter-id": voterId },
        body: JSON.stringify({}),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to vote");
    }
    return res.json();
}

export async function fetchPetition(id, voterId) {
    const res = await fetch(`${BASE}/api/petitions/${id}`, {
        headers: { "x-voter-id": voterId || "" },
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch petition");
    }
    return res.json();
}