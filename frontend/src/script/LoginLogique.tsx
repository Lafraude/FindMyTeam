import { useState, useEffect } from "react";
import { useNotification } from '../notif/notif';

interface User {
    id: string;
    username: string;
    isAdmin: boolean;
}

export function useUserData(API: string, API_KEY: string) {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { addNotification } = useNotification();

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        try {
            const response = await fetch(`${API}/auth/viewuser`, {
                method: "POST",
                headers: { "x-api-key": API_KEY },
                signal: controller.signal
            });

            clearTimeout(timeout);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erreur chargement utilisateurs");
            }

            setUsers(data.users || []);
        } catch (err: any) {
            if (err.name === "AbortError") {
                setError("Timeout : serveur trop long à répondre");
            } else {
                setError(err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const deleteUser = async (userId: string) => {
        const reqComingId = localStorage.getItem("UserLoggedIntoId")

        try {
            const response = await fetch(`${API}/auth/deleteuser/${userId}`, {
                method: "POST",
                headers: {"Content-Type": "application/json", "x-api-key": API_KEY },
                body: JSON.stringify({reqComingIdToBack : reqComingId})
            });

            const data = await response.json();

            if (data.code === "01") {
                addNotification({
                    type: "error",
                    title: "Erreur",
                    message : data.message,
                    duration : 5000 // 5s
                })
                return;
            }

            if(data.code === "02") {
                addNotification({
                    type: "error",
                    title: "Erreur",
                    message: data.message,
                    duration : 5000
                })
                return;
            }

            if (!response.ok) {
                throw new Error(data.error || "Erreur suppression");
            }

            setUsers(prev => prev.filter(user => user.id !== userId));
        } catch (err: any) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return { users, isLoading, error, fetchUsers, deleteUser };
}