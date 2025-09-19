import React from "react";

export default function Filters({ meta, onFilterChange, filters }) {
    return (
        <div style={{ display:"flex", gap:8, marginBottom:12 }}>
            <select value={filters.category || ""} onChange={e=>onFilterChange({category: e.target.value || null})}>
                <option value="">Все категории</option>
                {meta.categories?.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filters.region || ""} onChange={e=>onFilterChange({region: e.target.value || null})}>
                <option value="">Все области</option>
                {meta.regions?.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
        </div>
    );
}
