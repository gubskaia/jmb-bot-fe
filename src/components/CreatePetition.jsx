import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPetition } from "../api";
import { FileText, Send, User, MapPin, Tag, FileText as DescriptionIcon } from "lucide-react";

export default function CreatePetition() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        region: "",
        authorName: ""
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({}); // Для real-time валидации
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });
    const navigate = useNavigate();

    const validateField = (name, value) => {
        const newErrors = { ...errors };
        switch (name) {
            case 'title':
                if (!value.trim()) newErrors.title = "Заголовок обязателен";
                else delete newErrors.title;
                break;
            case 'description':
                if (!value.trim()) newErrors.description = "Описание обязательно";
                else delete newErrors.description;
                break;
            case 'authorName':
                if (!value.trim()) newErrors.authorName = "Имя автора обязательно (нельзя анонимно)";
                else if (value.trim().length < 2) newErrors.authorName = "Имя должно быть минимум 2 символа";
                else delete newErrors.authorName;
                break;
            default:
                delete newErrors[name];
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (touched[name]) {
            validateField(name, value);
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched({ ...touched, [name]: true });
        validateField(name, value);
    };

    const validateAll = () => {
        let isValid = true;
        Object.keys(formData).forEach(key => {
            if (['title', 'description', 'authorName'].includes(key)) {
                if (!validateField(key, formData[key])) isValid = false;
            }
        });
        return isValid;
    };

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateAll()) {
            showToast("Заполните все обязательные поля", "error");
            return;
        }
        setLoading(true);
        try {
            await createPetition(formData);
            showToast("Петиция успешно создана!", "success");
            setTimeout(() => navigate("/search"), 1500);
        } catch (error) {
            showToast("Ошибка создания: " + error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <main className="detail-container" style={{ maxWidth: "40rem" }}>
                <form onSubmit={handleSubmit} className="fade-in-up" noValidate>
                    <fieldset className="form-section">
                        <legend className="required">Основная информация</legend>
                        <div className="form-group">
                            <label className="form-label required" htmlFor="title">
                                <FileText size={16} className="inline-block mr-1" /> Заголовок
                            </label>
                            <input
                                id="title"
                                type="text"
                                name="title"
                                placeholder="Краткий и ясный заголовок петиции"
                                value={formData.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`form-input ${errors.title ? 'error' : ''}`}
                                required
                                aria-describedby={errors.title ? "title-error" : undefined}
                                maxLength={200}
                            />
                            {errors.title && <span id="title-error" className="error-text">{errors.title}</span>}
                        </div>
                        <div className="form-group">
                            <label className="form-label required" htmlFor="description">
                                <DescriptionIcon size={16} className="inline-block mr-1" /> Описание
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Подробно опишите проблему, цели и предложения по решению"
                                value={formData.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                rows={6}
                                className={`form-textarea ${errors.description ? 'error' : ''}`}
                                required
                                aria-describedby={errors.description ? "desc-error" : undefined}
                                maxLength={2000}
                            />
                            {errors.description && <span id="desc-error" className="error-text">{errors.description}</span>}
                        </div>
                    </fieldset>

                    <fieldset className="form-section">
                        <legend>Дополнительная информация</legend>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label" htmlFor="category">
                                    <Tag size={16} className="inline-block mr-1" /> Категория
                                </label>
                                <input
                                    id="category"
                                    type="text"
                                    name="category"
                                    placeholder="Например: Городская среда, Экономика"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="form-input"
                                    maxLength={50}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="region">
                                    <MapPin size={16} className="inline-block mr-1" /> Регион
                                </label>
                                <input
                                    id="region"
                                    type="text"
                                    name="region"
                                    placeholder="Например: Бишкек, Ошская область"
                                    value={formData.region}
                                    onChange={handleChange}
                                    className="form-input"
                                    maxLength={50}
                                />
                            </div>
                        </div>
                    </fieldset>

                    <fieldset className="form-section">
                        <legend className="required">Автор</legend>
                        <div className="form-group">
                            <label className="form-label required" htmlFor="authorName">
                                <User size={16} className="inline-block mr-1" /> Ваше имя
                            </label>
                            <input
                                id="authorName"
                                type="text"
                                name="authorName"
                                placeholder="Введите ваше имя"
                                value={formData.authorName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`form-input ${errors.authorName ? 'error' : ''}`}
                                required
                                aria-describedby={errors.authorName ? "author-error" : undefined}
                                maxLength={100}
                            />
                            {errors.authorName && <span id="author-error" className="error-text">{errors.authorName}</span>}
                        </div>
                    </fieldset>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", marginTop: "1rem" }}>
                        <Send size={18} className="inline-block mr-1" /> {loading ? "Создание петиции..." : "Опубликовать петицию"}
                    </button>
                </form>
            </main>

            {toast.show && (
                <div className={`toast ${toast.type}`} role="alert" aria-live="polite">
                    {toast.message}
                </div>
            )}
        </>
    );
}