import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="navbar">
            <h2 className="fin-logo">Fintree LMS By SAJAG JAIN</h2>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
    );
};

export default Navbar;
