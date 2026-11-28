// Textes affichés à l'écran pour les valeurs techniques renvoyées par l'API

export const RESERVATION_STATUS = {
    pending: "En attente",
    approved: "Acceptée",
    rejected: "Refusée",
    cancelled: "Annulée",
    returned: "Rendue"
};

export const EQUIPMENT_STATUS = {
    available: "Disponible",
    maintenance: "En maintenance",
    retired: "Retiré"
};

export const USAGE_TYPES = {
    checkout: "Sortie",
    return: "Retour",
    maintenance: "Maintenance",
    repair: "Réparation"
};

// "2026-12-01" => "01/12/2026"
export function formatDate(date) {
    if (!date) return "";
    return date.slice(0, 10).split("-").reverse().join("/");
}

// Erreurs 422 { champ: ["message"] } => "message 1, message 2"
export function errorText(errors) {
    return Object.values(errors).flat().join(", ");
}
