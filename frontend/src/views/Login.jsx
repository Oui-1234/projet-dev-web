import { useState } from "react";
import Button from "../components/Button";
import apiFetch from "../api";

export default function LoginForm({ onLogin }) {
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    function handleSubmit(event) {
        event.preventDefault();
        setError("");
        
        apiFetch("/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        })
            .then((resp) => {
                if (resp.status === 401) throw new Error("Identifiants invalides");
                if (!resp.ok) throw new Error("Email et mot de passe requis");
                return resp.json();
            }
            )
            .then(data => onLogin(data.token))
            .catch((error) => setError(error.message));
    }

    return <form onSubmit={handleSubmit}>
        <h2>Connexion </h2>
        <input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(event) => setPassword(event.target.value)} />
        {error && <p className="error">{error}</p>}
        <Button content="Se connecter" />
       </form>
}