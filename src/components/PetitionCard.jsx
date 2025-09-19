import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, User, Calendar, ThumbsUp, ArrowRight } from "lucide-react";

export default function PetitionCard({ p, onVote, voted, isTop = false }) {
    const progressWidth = Math.min((p.votes / 1000) * 100, 100); // Примерный прогресс (адаптировать по max votes)

    return (
        <article className="card" role="article">
            <div className="card-header">
                <div className="petition-card-header">
                    <h3 className="petition-title">
                        {/*{isTop && <Star size={16} className="inline-block mr-2 text-blue-600" aria-label="Популярная" />}*/}
                        {p.title}
                    </h3>
                    <span className="petition-badge">Активно</span>
                </div>
            </div>

            <div className="card-body">
                <p className="petition-desc">{p.description}</p>

                <div className="meta-row">
                    <div className="meta-item">
                        <MapPin size={12} />
                        {p.region}
                    </div>
                    <div className="meta-item">
                        <User size={12} />
                        {p.authorName}
                    </div>
                    <div className="meta-item">
                        <Calendar size={12} />
                        {new Date(p.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                </div>

                <div className="vote-bar">
                    <div className="vote-progress" style={{ width: `${progressWidth}%` }}></div>
                </div>
            </div>

            <div className="card-footer">
                <div className="flex-between">
                    <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                        <ThumbsUp size={14} className="inline-block mr-1" /> {p.votes} голосов
                    </div>
                    <div className="card-actions">
                        <button
                            className="btn-vote-small"
                            onClick={() => onVote(p.id)}
                            disabled={voted}
                            aria-label={voted ? "Вы уже проголосовали" : "Проголосовать за петицию"}
                        >
                            {voted ? "Голосовано" : "Голосовать"}
                        </button>
                        <Link to={`/petition/${p.id}`} className="btn-detail-small" aria-label="Подробнее о петиции">
                            Подробнее <ArrowRight size={14} className="inline-block ml-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}