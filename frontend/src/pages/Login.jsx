import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import axios from "axios";
import "../styles/Login.css"; 
import logo from "/src/assets/logo.png"; 

const Login = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    
    const navigate = useNavigate(); // ✅ Initialize navigation hooksasasssa

    const handleAuth = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isRegistering 
                ? `https://fintree-lms-backend.onrender.com/api/auth/register`
                : `https://fintree-lms-backend.onrender.com/api/auth/login`;

            const requestData = isRegistering ? { username, email, password } : { username, password };

            const response = await axios.post(endpoint, requestData);

            if (!isRegistering) {
                localStorage.setItem("token", response.data.token); // ✅ Save token
                setMessage("Login successful!");
                navigate("/dashboard"); // ✅ Redirect to Dashboard
            } else {
                setMessage("Registration successful! Please log in.");
                setIsRegistering(false);
            }
        } catch (error) {
            setMessage("Error: " + (error.response?.data.message || "Something went wrong"));
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <img src={logo} alt="Fintree Logo" className="logo" />
                <h2 className="login-label">{isRegistering ? "Register for Fintree LMS" : "Fintree LMS Login"}</h2>
                <form className="login-form" onSubmit={handleAuth}>
                    <label>Username</label>
                    <input className="login-input" type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    
                    {/* ✅ Show email field only if registering */}
                    {isRegistering && (
                        <>
                            <label>Email</label>
                            <input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </>
                    )}

                    <label>Password</label>
                    <input className="login-input" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    
                    <button type="submit">{isRegistering ? "Register" : "Sign In"}</button>
                </form>

                <p className="error-message">{message}</p>

                <button className="toggle-auth-btn" onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
                </button>
            </div>
        </div>
    );
};

export default Login;