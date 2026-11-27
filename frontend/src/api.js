const API_URL= "http://localhost:3000/api";

export default function apiFetch(path, options = {}) {
    const token = localStorage.getItem("token");

    return fetch(API_URL + path, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": "Bearer " + token }),
            ...options.headers
        }
    });
}