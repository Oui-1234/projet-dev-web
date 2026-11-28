import Button from "./Button";

export default function ConfirmModal({ message, onConfirm, onCancel}) {
    if (!message) return null;

    return <div className="modal-backdrop" onClick={onCancel}>
        <div className="modal" onClick={(event) => event.stopPropagation()}>
            <p>{message}</p>
            <Button content="Annuler" onClick={onCancel} />
            <Button content="Confirmer" className="danger" onClick={onConfirm} />
        </div>
    </div>
}