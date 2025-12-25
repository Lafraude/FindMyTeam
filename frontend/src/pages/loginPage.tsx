import { BiUser } from 'react-icons/bi';
import { API_ADRESSE, API_KEY, refreshPage } from '../CONFIG/config';
import { useUserData } from '../script/LoginLogique';
import './css/LoginPage.css'


function LoginPage() {
    const { user, isLoading, error } = useUserData(API_ADRESSE, API_KEY);

    const addToLocalStorage = (u: any) => {
        if (localStorage.getItem("UserLoggedInto") === null) {
            console.warn("UserLoggedInto non présent, création en cours...");
            localStorage.setItem("UserLoggedInto", "");
            localStorage.setItem("isConnected", "false");
            localStorage.setItem("idLoggedTo", "")
            console.warn("Création Fini");
        }

        localStorage.setItem("UserLoggedInto", u.userName);
        localStorage.setItem("idLoggedTo", u.id)
        localStorage.setItem("isConnected", "true");

        refreshPage();
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

            <div className='loginPage-prcp'>
                <ul className='loginPage'>
                    {user && user.map((u: any) => (
                        <li key={u.id}>
                            <button
                                type="button"
                                onClick={() => addToLocalStorage(u)}
                                className="user-button"
                            >
                                <BiUser className='icon-login-page' />
                                {u.userName}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}


export default LoginPage;