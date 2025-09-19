import React, { useState } from "react";

export default function CreatePetition({ onCreate }) {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [category, setCategory] = useState("");
    const [region, setRegion] = useState("");
    const [author, setAuthor] = useState("");

    async function submit(e){
        e.preventDefault();
        if(!title || !desc) return alert("Заполните заголовок и описание");
        await onCreate({ title, description: desc, category, region, authorName: author });
        setTitle(""); setDesc(""); setCategory(""); setRegion(""); setAuthor("");
    }

    return (
        <form className="card" onSubmit={submit}>
            <div style={{ fontWeight:600, marginBottom:8 }}>Создать петицию</div>
            <input placeholder="Заголовок" value={title} onChange={e=>setTitle(e.target.value)} style={{ width:"100%", padding:10, marginBottom:8, borderRadius:8, border:"1px solid #f0f5fb" }}/>
            <textarea placeholder="Описание" value={desc} onChange={e=>setDesc(e.target.value)} rows={4} style={{ width:"100%", padding:10, marginBottom:8, borderRadius:8, border:"1px solid #f0f5fb" }} />
            <div style={{ display:"flex", gap:8 }}>
                <input placeholder="Категория" value={category} onChange={e=>setCategory(e.target.value)} style={{ flex:1, padding:10, borderRadius:8, border:"1px solid #f0f5fb" }}/>
                <input placeholder="Область" value={region} onChange={e=>setRegion(e.target.value)} style={{ flex:1, padding:10, borderRadius:8, border:"1px solid #f0f5fb" }}/>
            </div>
            <input placeholder="Ваше имя (необязательно)" value={author} onChange={e=>setAuthor(e.target.value)} style={{ width:"100%", padding:10, marginTop:8, borderRadius:8, border:"1px solid #f0f5fb" }}/>
            <div style={{ display:"flex", justifyContent:"flex-end", marginTop:8 }}>
                <button className="vote-btn" type="submit">Опубликовать</button>
            </div>
        </form>
    );
}
