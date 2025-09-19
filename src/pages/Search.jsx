import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import PetitionCard from "../components/PetitionCard";
import Filters from "../components/Filters";
import { fetchPetitions, fetchMeta, votePetition } from "../api";
import { Search as SearchIcon, X, ChevronLeft, ChevronRight, Filter } from "lucide-react";

// Собственная функция debounce
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [list, setList] = useState([]);
  const [meta, setMeta] = useState({ categories: [], regions: [] });
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || null,
    region: searchParams.get("region") || null,
    sort: searchParams.get("sort") || "votes-desc",
  });
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1", 10));
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [votedMap, setVotedMap] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const voterId = useMemo(() => {
    const id = localStorage.getItem("voterId") || Math.random().toString(36).slice(2);
    localStorage.setItem("voterId", id);
    return id;
  }, []);

  const debouncedLoad = useCallback(
    debounce(async (params, currentPage) => {
      setLoading(true);
      try {
        const res = await fetchPetitions({ ...params, page: currentPage, limit: 10 });
        setList(res.data || []);
        setTotalPages(res.totalPages || 1);
      } catch (error) {
        setToast({ show: true, message: `Ошибка загрузки: ${error.message}`, type: "error" });
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  const loadMeta = useCallback(async () => {
    try {
      const m = await fetchMeta();
      setMeta(m);
    } catch (error) {
      console.error("Failed to load meta:", error);
      setToast({ show: true, message: `Ошибка фильтров: ${error.message}`, type: "error" });
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    }
  }, []);

  const load = useCallback(() => {
    const params = {
      q: query.trim() || undefined,
      category: filters.category || undefined,
      region: filters.region || undefined,
      sort: filters.sort || undefined,
    };
    debouncedLoad(params, page);
  }, [query, filters, page, debouncedLoad]);

  useEffect(() => {
    loadMeta();
    load();
  }, [loadMeta, load]);

  const handleFilterChange = useCallback(
    (change) => {
      setFilters((prev) => ({ ...prev, ...change }));
      const newParams = { ...Object.fromEntries(searchParams), ...change, page: "1" };
      if (change.category === null) delete newParams.category;
      if (change.region === null) delete newParams.region;
      if (!newParams.q) delete newParams.q;
      setSearchParams(newParams);
      setPage(1);
      load();
    },
    [searchParams, setSearchParams, load]
  );

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      const newParams = { ...Object.fromEntries(searchParams), q: query.trim() || undefined, page: "1" };
      if (!query.trim()) delete newParams.q;
      setSearchParams(newParams);
      setPage(1);
      load();
    },
    [query, searchParams, setSearchParams, load]
  );

  const handleClearSearch = useCallback(() => {
    setQuery("");
    const newParams = { ...Object.fromEntries(searchParams), page: "1" };
    delete newParams.q;
    setSearchParams(newParams);
    setPage(1);
    load();
  }, [searchParams, setSearchParams, load]);

  const handleVote = useCallback(
    async (id) => {
      try {
        await votePetition(id, voterId);
        setVotedMap((prev) => ({ ...prev, [id]: true }));
        setToast({ show: true, message: "Ваш голос учтен!", type: "success" });
        load();
      } catch (error) {
        setToast({ show: true, message: `Ошибка: ${error.message}`, type: "error" });
      }
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    },
    [voterId, load]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage < 1 || newPage > totalPages) return;
      setPage(newPage);
      setSearchParams({ ...Object.fromEntries(searchParams), page: newPage.toString() });
      load();
    },
    [totalPages, searchParams, setSearchParams, load]
  );

  const handleSortChange = useCallback(
    (e) => {
      const sort = e.target.value;
      setFilters((prev) => ({ ...prev, sort }));
      setSearchParams({ ...Object.fromEntries(searchParams), sort, page: "1" });
      setPage(1);
      load();
    },
    [searchParams, setSearchParams, load]
  );

  return (
    <main className="search-container" role="main">
      <header className="search-header">
        <h1 className="search-title">Поиск петиций</h1>
        <p className="search-subtitle">
          Найдите инициативы, которые вам важны, или создайте свою
        </p>
      </header>

      <section className="search-form-card" aria-label="Форма поиска">
        <form onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <SearchIcon size={18} className="search-input-icon" aria-hidden="true" />
            <input
              type="text"
              placeholder="Поиск по заголовку, описанию или автору"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
              aria-label="Поиск петиций"
              disabled={loading}
            />
            {query && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={handleClearSearch}
                aria-label="Очистить поиск"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button type="submit" className="search-btn" disabled={loading}>
            <SearchIcon size={18} className="inline-block mr-1" />
            {loading ? "Поиск..." : "Найти"}
          </button>
        </form>
      </section>

      <section className="filters-row" aria-label="Фильтры и сортировка">
        <Filters meta={meta} onFilterChange={handleFilterChange} filters={filters} />
        <div style={{ position: "relative" }}>
          <Filter size={16} className="filter-icon" aria-hidden="true" />
          <select
            className="sort-select"
            value={filters.sort}
            onChange={handleSortChange}
            aria-label="Сортировка петиций"
          >
            <option value="votes-desc">Популярные (по убыванию)</option>
            <option value="votes-asc">Популярные (по возрастанию)</option>
            <option value="createdAt-desc">Новые</option>
            <option value="createdAt-asc">Старые</option>
          </select>
        </div>
      </section>

      <section className="results" aria-live="polite">
        {loading ? (
          <div className="loading">
            <div className="skeleton skeleton-card"></div>
            <div className="skeleton skeleton-card"></div>
            <div className="skeleton skeleton-card"></div>
          </div>
        ) : list.length === 0 ? (
          <div className="empty">Петиций не найдено. Попробуйте изменить поиск или фильтры.</div>
        ) : (
          <div className="petitions-grid">
            {list.map((p) => (
              <PetitionCard key={p.id} p={p} onVote={handleVote} voted={!!votedMap[p.id]} />
            ))}
          </div>
        )}
      </section>

      {totalPages > 1 && (
        <section className="pagination" aria-label="Пагинация">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            aria-label="Предыдущая страница"
          >
            <ChevronLeft size={16} />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              className={`pagination-btn ${page === i + 1 ? "active" : ""}`}
              onClick={() => handlePageChange(i + 1)}
              aria-current={page === i + 1 ? "page" : undefined}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            aria-label="Следующая страница"
          >
            <ChevronRight size={16} />
          </button>
        </section>
      )}

      {toast.show && (
        <div className={`toast ${toast.type}`} role="alert" aria-live="polite">
          {toast.message}
        </div>
      )}
    </main>
  );
}
