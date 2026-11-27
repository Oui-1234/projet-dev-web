import { useState, useEffect } from 'react';
import './App.css';
import Button from './components/Button';
import LoginForm from './views/Login';
import RegisterForm from './views/Register';
import Catalogue from './views/Catalogue';
import MyReservations from './views/MyReservations';
import AdminReservations from './views/admin/Reservations';
import AdminCategories from './views/admin/Categories';
import AdminEquipments from './views/admin/Equipments';
import AdminUsageLogs from './views/admin/UsageLogs';
import AdminUsers from './views/admin/Users';
import Menu from './components/Menu';

const LINKS=[
        { key: "catalogue", label: "Catalogue", component: Catalogue },
    { key: "my-reservations", label: "Mes réservations", component: MyReservations },
    { key: "admin-reservations", label: "Réservations", component: AdminReservations, adminOnly: true },
    { key: "categories", label: "Catégories", component: AdminCategories, adminOnly: true },
    { key: "equipments", label: "Équipements", component: AdminEquipments, adminOnly: true },
    { key: "usage-logs", label: "Historique", component: AdminUsageLogs, adminOnly: true },
    { key: "users", label: "Utilisateurs", component: AdminUsers, adminOnly: true }
    ];

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [showRegister , setShowRegister] = useState(false);
    const [message , setMessage] = useState("");
    const [view, setView] = useState("catalogue");

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
    const links= LINKS.filter(link => !link.adminOnly || user.role ==="admin");
    const current = links.find(link => link.key=== view) || links[0];
    const View= current.component;
    return (
        <>
            <h1>Location de matériel</h1>
            <Menu
                links={links}
                current = {current.key}
                onNavigate={setView}
                user={user}
                onLogout={() => setToken(null)}
            />
            <View user={user} />
        </>
    );
}

export default App;