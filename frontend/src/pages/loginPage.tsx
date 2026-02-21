import { API_ADRESSE, API_KEY, refreshPage } from '../CONFIG/config';
import { useUserData } from '../script/LoginLogique';
import { useNotification } from '../notif/notif';

import './css/LoginPage.css'

function LoginPage() {
    const { isLoading, error } = useUserData(API_ADRESSE, API_KEY);
    const { addNotification } = useNotification();

    const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const entryUserEl = document.getElementById("entryUser") as HTMLInputElement;
        const entryUserValue = entryUserEl.value.trim();

        const entryMdpEl = document.getElementById("entryMdp") as HTMLInputElement;
        const entryMdpValue = entryMdpEl.value.trim();

        try {
            if (!entryUserValue || !entryMdpValue) {
                return addNotification({
                    type: 'warning',
                    title: 'Informations incomplètes',
                    message: 'Merci de renseigner le nom d\'utilisateur et le mot de passe',
                    duration: 5000
                });
            }

            const response = await fetch(`${API_ADRESSE}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY
                },
                body: JSON.stringify({
                    userLogin: entryUserValue,
                    passwordLogin: entryMdpValue
                })
            });

            if (response.status === 401) {
                addNotification({
                    type: 'error',
                    title: 'Échec de connexion',
                    message: 'Identifiants invalides',
                    duration: 5000
                });
                return;
            }

            if (response.status === 400) {
                addNotification({
                    type: 'error',
                    title: 'Erreur',
                    message: 'Requête invalide',
                    duration: 5000
                });
                return;
            }

            if (response.status === 200) {
                const data = await response.json();
                console.log("Connexion réussie :", data);

                localStorage.setItem("UserLoggedInto", entryUserValue);
                localStorage.setItem("UserLoggedIntoId", data.idUser);
                localStorage.setItem("UserPseudo", data.pseudo)
                localStorage.setItem("isConnected", "true");

                addNotification({
                    type: 'success',
                    title: 'Connexion réussie',
                    message: `Bienvenue ${entryUserValue}`,
                    duration: 3000
                });

                setTimeout(() => refreshPage(), 1000);
            }

        } catch (err) {
            console.error("Erreur de connexion:", err);
            addNotification({
                type: 'error',
                title: 'Erreur serveur',
                message: 'Impossible de se connecter au serveur',
                duration: 5000
            });
        } finally {
            entryUserEl.value = "";
            entryMdpEl.value = "";
        }
    }

    return (
        <>
            <header className="landing-header-login-page">
                <h1>Choisissez votre profil correspondant</h1>
            </header>

            <div className='container-prcp'>
                {isLoading && (
                    <p className='loading-missions'>Chargement des utilisateurs...</p>
                )}
                {error && (
                    <p className='error-missions'>Erreur: {error} <br />Contacter le support</p>
                )}
            </div>
            
            <div className='loginPage-prcp' style={{display: "flex", flexDirection: "column"}}>
                <input 
                    type="text" 
                    name='entryUser' 
                    id='entryUser' 
                    placeholder="Nom d'utilisateur" 
                />
                <input 
                    type="password"
                    name='entryMdp' 
                    id='entryMdp' 
                    placeholder='Mot de passe' 
                />

                <button onClick={handleLogin}>Connexion</button>
            </div>
        </>
    );
}

export default LoginPage;