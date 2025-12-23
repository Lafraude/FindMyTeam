import { useState, useEffect } from "react";
// @ts-ignore
import { API_ADRESSE, API_KEY } from "../CONFIG/config";
// @ts-ignore
const API = API_ADRESSE;

// --------------- //// --------------- //// --------------- //
// --------------- //// --------------- //// --------------- //
// --------------- //// --------------- //// --------------- //

export function useUserData(API: string, API_KEY: string) {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API}/viewuser`, {
                headers: { "x-api-key": API_KEY }
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || "Erreur lors du chargement des utilisateurs");
            }

            setUser(data.users);

        } catch (err: any) {
            console.error("Erreur API :", err);
            setError(err.message || "Erreur inconnue");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return { user, isLoading, error, fetchUser };
}


// --------------- //// --------------- //// --------------- //
// --------------- //// --------------- //// --------------- //
// --------------- //// --------------- //// --------------- //

export async function callApiDeleteUser(userId: string) {
    try {
        const response = await fetch(`${API}/deleteuser/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Erreur lors de la suppression");
        }

        console.log("Utilisateur supprimé :", data);
        return data;

    } catch (error) {
        console.error("Erreur suppression utilisateur :", error);
        throw error;
    }
}

export function functionError() {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loading = isLoading ? (
        <div className='container-prcp'><p className='loading-missions'>Chargement des missions...</p></div>
    ) : null;

    const ViewError = error ? (
        <div className='container-prcp'><p className='error-missions'>Erreur: {error} <br />Contacter le support</p></div>
    ) : null;
}

