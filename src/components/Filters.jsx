import React from "react";

export default function Filters({ meta, onFilterChange, filters }) {
    return (
        <div className="search-row">
            <select
                className="search-select"
                value={filters.category || ""}
                onChange={e => onFilterChange({ category: e.target.value || null })}
                aria-label="Select category"
            >
                <option value="">Все категории</option>
                {meta.categories?.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
                className="search-select"
                value={filters.region || ""}
                onChange={e => onFilterChange({ region: e.target.value || null })}
                aria-label="Select region"
            >
                <option value="">Все регионы</option>
                {meta.regions?.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
        </div>
    );
}