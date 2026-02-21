import { MdManageAccounts } from 'react-icons/md';
// @ts-ignore
import { API_ADRESSE, API_KEY, refreshPage, userName } from '../CONFIG/config'
import { useNotification } from '../notif/notif';
import './css/mon-compte.css'
import type React from 'react';

function MyAccount () {
    const { addNotification } = useNotification();

    const handlePseudo = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const changePseudoEl = document.getElementById("pseudo") as HTMLInputElement;
        const changePseudoValue = changePseudoEl.value.trim()

        // Récup l'id users
        const IdUserForPseudo = localStorage.getItem("UserLoggedIntoId")

        if (!changePseudoValue) {
            addNotification({
                type: "warning",
                title: "Champ vide",
                message: "Veuillez fournir un pseudo",
                duration: 3000
            })
        }
        
        console.log(changePseudoValue)

        fetch(`${API_ADRESSE}/auth/pseudo/change`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key" : API_KEY
            },

            body: JSON.stringify({
                pseudoChange: changePseudoValue,
                IdForPseudo : IdUserForPseudo
            })
        })
    }

    return (
        <>
            <header className="landing-header">
                <h1><MdManageAccounts/>Compte</h1>
                <p>{userName}</p>
            </header>

            <div className='myacount-prcp'>
                {/* ------------ */}
                <p>Mon Pseudo {userName}</p>
                <input id='pseudo' type="text" placeholder='Pseudo'/>
                <button onClick={handlePseudo}>Ajouter</button>
                {/* ------------ */}
                







                <button
                    onClick={() => {
                        localStorage.setItem("isConnected", "false")
                        refreshPage()
                    }}
                >Se déconnecter
                </button>

            </div>
        </>
    )
}

export default MyAccount;