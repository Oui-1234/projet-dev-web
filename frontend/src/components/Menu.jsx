import Button from "./Button";

export default function Menu({links, current, onNavigate, user, onLogout}) {
    return <nav className="menu">
        {links.map(link => 
        <Button 
            key={link.key}
            content={link.label}
            onClick={() => onNavigate(link.key)}
            className={link.key === current ? "active" : ""}
        />)}
        <span className="menu-user">{user.firstname || user.email} ({user.role})</span>
        <Button content="Se déconnecter" onClick={onLogout} />
    </nav>
}