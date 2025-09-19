import React, { useState } from "react";
import PetitionList from "./components/PetitionList";
import PetitionDetail from "./components/PetitionDetail";

export default function App(){
    const [openId, setOpenId] = useState(null);

    return (
        <div className="container" style={{ maxWidth: 900, margin: "0 auto" }}>
            {!openId && <PetitionList onOpen={(id)=>setOpenId(id)} />}
            {openId && <PetitionDetail id={openId} onBack={()=>setOpenId(null)} />}
        </div>
    );
}
