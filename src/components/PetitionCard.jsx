import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { Share2 } from "lucide-react";
import { votePetition } from "../api";

export default function PetitionCard({ p, onVote, voted }) {
    const handleShare = useCallback(() => {
        if (window.Telegram?.WebApp) {
            const shareUrl = `https://your-app.vercel.app/petition/${p.id}`; // Replace with your Vercel URL
            const shareText = `Поддержите петицию: ${p.title}`;
            window.Telegram.WebApp.showPopup({
                title: "Поделиться петицией",
                message: `Поделиться "${p.title}"?`,
                buttons: [
                    {
                        id: "share",
                        type: "default",
                        text: "Поделиться",
                    },
                    {
                        type: "cancel",
                        text: "Отмена",
                    },
                ],
            }, (buttonId) => {
                if (buttonId === "share") {
                    window.Telegram.WebApp.sendData(JSON.stringify({
                        action: "share",
                        url: shareUrl,
                        text: shareText,
                    }));
                    window.Telegram.WebApp.openLink(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`);
                }
            });
        } else {
            navigator.share({
                title: p.title,
                text: p.description,
                url: `https://your-app.vercel.app/petition/${p.id}`,
            }).catch((err) => console.error("Share failed:", err));
        }
    }, [p.id, p.title, p.description]);

    const handleVote = useCallback(() => {
        if (onVote && !voted) {
            onVote(p.id);
        }
    }, [p.id, onVote, voted]);

    return (
        <div className="petition-card" role="article">
            <Link to={`/petition/${p.id}`} className="petition-link">
                <h3 className="petition-title">{p.title}</h3>
                <p className="petition-description">{p.description}</p>
                <div className="petition-meta">
                    <span>Автор: {p.authorName}</span>
                    <span>Голосов: {p.votes}</span>
                    {p.category && <span>Категория: {p.category}</span>}
                    {p.region && <span>Регион: {p.region}</span>}
                </div>
            </Link>
            <div className="petition-actions">
                <button
                    className="vote-btn"
                    onClick={handleVote}
                    disabled={voted}
                    aria-label={voted ? "Вы уже проголосовали" : "Проголосовать"}
                >
                    {voted ? "Проголосовано" : "Голосовать"}
                </button>
                <button
                    className="share-btn"
                    onClick={handleShare}
                    aria-label="Поделиться петицией"
                >
                    <Share2 size={16} />
                </button>
            </div>
        </div>
    );
}