import { useState, useEffect } from 'react';
import './App.css';
import Button from './components/Button';
import LoginForm from './views/Login';
import RegisterForm from './views/Register';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [showRegister , setShowRegister] = useState(false);
    const [message , setMessage] = useState("");

    useEffect(() => {
        if (token) {
            fetch('http://localhost:3000/api/me', {
                headers: {
                    "Authorization": "Bearer " + token
                }
            })
                .then(resp => {
                    if (!resp.ok) throw new Error();
                    return resp.json();

                })
                .then(data => {
                    setUser(data);
                    localStorage.setItem('token', token);
                })
                .catch(() => setToken(null));
        } else {
            setUser(null);
            localStorage.removeItem('token');
        }
    }, [token]);
    
    function handdleRegister() {
        setShowRegister(false);
        setMessage("Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.");
    }
    if (!user) {
        return (
            <>
            <h1>Location de matériel</h1>
            {message && <p>{message}</p>}
            {!showRegister && <>
                <LoginForm onLogin={setToken} />
                <Button content="Créer un compte" onClick={() => setShowRegister(true)} />
            </>}
            {showRegister && <>
                <RegisterForm onRegister={handdleRegister} />
                <Button content="Se connecter" onClick={() => setShowRegister(false)} />
            </>}
            </>
        );
    }
    return (
        <>
            <h1>Location de matériel</h1>
            <p>
                Bonjour {user.firstname || user.email} ({user.role})
                <Button content="Se déconnecter" onClick={() => setToken(null)} />
            </p>
        </>
    );
}

export default App;