import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPetition, votePetition } from "../api";
import { ArrowLeft, Share2, ThumbsUp, User, MapPin, Calendar, Tag, MessageCircle } from "lucide-react";

export default function PetitionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState(null);
    const [voted, setVoted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });

    useEffect(() => {
        load();
    }, [id]);

    async function load() {
        setLoading(true);
        try {
            const voterId = localStorage.getItem("voterId") || Math.random().toString(36).slice(2);
            localStorage.setItem("voterId", voterId);
            const res = await fetchPetition(id, voterId);
            setPet(res.petition);
            setVoted(res.voted);
        } catch (error) {
            console.error(error);
            setToast({ show: true, message: "Ошибка загрузки петиции", type: "error" });
            setTimeout(() => navigate("/search"), 1500);
        } finally {
            setLoading(false);
        }
    }

    async function handleVote() {
        try {
            const voterId = localStorage.getItem("voterId");
            await votePetition(id, voterId);
            setVoted(true);
            setToast({ show: true, message: "Ваш голос учтен!", type: "success" });
            setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
            load();
        } catch (error) {
            setToast({ show: true, message: "Ошибка голосования: " + error.message, type: "error" });
            setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
        }
    }

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/petition/${id}`;
        try {
            if (navigator.share) {
                await navigator.share({ title: pet.title, url: shareUrl });
            } else {
                await navigator.clipboard.writeText(shareUrl);
                setToast({ show: true, message: "Ссылка скопирована в буфер!", type: "success" });
            }
        } catch (error) {
            console.error("Share failed:", error);
        }
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    };

    if (loading) {
        return (
            <main className="detail-container">
                <div className="loading">
                    <div className="skeleton skeleton-card"></div>
                </div>
            </main>
        );
    }

    if (!pet) return (
        <main className="detail-container">
            <div className="empty">Петиция не найдена</div>
        </main>
    );

    return (
        <main className="detail-container fade-in-up" role="main">
            <header className="detail-header flex-between">
                <div>
                    <h1 className="detail-title">{pet.title}</h1>
                    <div className="meta-row" style={{ gap: '1rem' }}>
                        <div className="meta-item" style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                            <Tag size={16} /> {pet.category}
                        </div>
                        <div className="meta-item" style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                            <MapPin size={16} /> {pet.region}
                        </div>
                    </div>
                </div>
                <div className="actions-row">
                    <button onClick={handleShare} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                        <Share2 size={16} className="inline-block mr-1" /> Поделиться
                    </button>
                    <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                        <ArrowLeft size={16} className="inline-block mr-1" /> Назад
                    </button>
                </div>
            </header>

            <section className="detail-main-content card">
                <div className="card-body">
                    <div className="detail-description">{pet.description}</div>
                </div>
            </section>

            <div className="detail-meta-section">
                <div className="meta-card">
                    <User size={20} />
                    <div>
                        <strong>{pet.authorName}</strong>
                        <div className="text-muted" style={{ fontSize: '0.875rem' }}>Автор петиции</div>
                    </div>
                </div>
                <div className="meta-card">
                    <Calendar size={20} />
                    <div>
                        <strong>{new Date(pet.createdAt).toLocaleDateString('ru-RU')}</strong>
                        <div className="text-muted" style={{ fontSize: '0.875rem' }}>Дата создания</div>
                    </div>
                </div>
            </div>

            <section className="card">
                <div className="vote-section-detail">
                    <div className="vote-stats">
                        <div className="vote-number">
                            <ThumbsUp size={24} className="inline-block mr-1" /> {pet.votes}
                        </div>
                        <div className="vote-label">голосов</div>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={handleVote}
                        disabled={voted}
                        style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
                        aria-label={voted ? "Вы уже проголосовали" : "Проголосовать за эту петицию"}
                    >
                        {voted ? "Голос учтен" : "Поддержать петицию"}
                    </button>
                </div>
            </section>

            <section className="card">
                <div className="card-header">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MessageCircle size={20} /> Комментарии (скоро)
                    </h2>
                </div>
                <div className="card-body">
                    <div className="empty" style={{ padding: '1rem 0', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                        Функция комментариев в разработке. Будьте в курсе обновлений!
                    </div>
                </div>
            </section>

            {toast.show && (
                <div className={`toast ${toast.type}`} role="alert" aria-live="polite">
                    {toast.message}
                </div>
            )}
        </main>
    );
}