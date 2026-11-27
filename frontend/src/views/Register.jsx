import { useState } from 'react';
import Button from '../components/Button';
import apiFetch from '../api';

const DEFAULT_ITEM={
    firstname: "",
    lastname: "",
    email: "",
    password: "",
};

export default function RegisterForm({ onRegister }) {
    const [item, setItem] = useState(DEFAULT_ITEM);
    const [errors, setErrors] = useState({});

    function handleChange(event) {
        const key = event.currentTarget.name;
        const value = event.currentTarget.value;
        
        setItem((oldValue) => ({
            ...oldValue,
            [key]: value,
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        setErrors({});

        apiFetch("/register", {
            method: "POST",
            body: JSON.stringify(item),
        })
            .then(async resp => {
                if (resp.status === 422) {
                    setErrors(await resp.json());
                    return;
                }
                if (!resp.ok) throw new Error();
                setItem(DEFAULT_ITEM);
                onRegister();
            }
            )
            .catch(() => setErrors({ global : ["Une erreur est survenue"] }));

    }
    return <form onSubmit={handleSubmit}>
        <h2>Inscription</h2>
        <input name="firstname" placeholder="Prénom" value={item.firstname} onChange={handleChange} />
        <input name="lastname" placeholder="Nom" value={item.lastname} onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" value={item.email} onChange={handleChange} />
        {errors.email && <p className="error">{errors.email.join(", ")}</p>}
        <input name="password" type="password" placeholder="Mot de passe" value={item.password} onChange={handleChange} />
        {errors.password && <p className="error">{errors.password.join(", ")}</p>}
        {errors.global && <p className="error">{errors.global.join(", ")}</p>}
        <Button content="Créer mon compte" />
    </form>
}