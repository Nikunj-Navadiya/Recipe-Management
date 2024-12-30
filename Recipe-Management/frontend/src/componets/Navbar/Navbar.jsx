import React, { useState } from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../serachBar/serachBar";

const Navbar = ({userInfo, onSerchNote, handleClearSerch}) => {
    const [serchQuery, setSerchQuery] = useState("");
    const navigete = useNavigate();

    const onlogout = () => {
        localStorage.clear();
        navigete("/login")
    }

    const handlesearch = () => {
        if(serchQuery){
            onSerchNote(serchQuery)
        }
    };

    const onClearSearch = () => {
        setSerchQuery("");
        handleClearSerch()
    };


    return (
        <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow" >
            <div className="text-xl font-medium text-black py-2">Recipe-Management</div>

            <SearchBar value={serchQuery} onChange={({ target }) => { setSerchQuery(target.value) }} handleSearch={handlesearch} onClearSearch={onClearSearch} />
                
            <ProfileInfo userInfo={userInfo} onLogout={onlogout} />
        </div>
    )
}

export default Navbar;