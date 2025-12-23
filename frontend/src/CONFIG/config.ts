export const API_ADRESSE = import.meta.env.VITE_API_URL;
export const API_KEY = import.meta.env.VITE_API_KEY;
export const isConnected = localStorage.getItem("isConnected") == "true";
export const userName = localStorage.getItem("UserLoggedInto")
export const isAdmin = true;

export const refreshPage = () => {
    window.location.reload()
    window.location.assign("/")
}

