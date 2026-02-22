import { MdManageAccounts } from 'react-icons/md';
// @ts-ignore
import { API_ADRESSE, API_KEY, refreshPage, userName, userPseudo } from '../CONFIG/config'
import { useNotification } from '../notif/notif';
import './css/mon-compte.css'
import type React from 'react';

function MyAccount () {
    const { addNotification } = useNotification();

    const handlePseudo = async (e: React.MouseEvent<HTMLButtonElement>) => {
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

        const changePseudo = await fetch(`${API_ADRESSE}/auth/pseudo/change`, {
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
        
        const data = await changePseudo.json();

        if (changePseudo.status == 200) {
            addNotification({
                type: "success",
                title: "Changement de pseudo",
                message: `${data.message}`,
                duration: 3000
            })
            localStorage.setItem("UserPseudo", changePseudoValue)
            setTimeout(() => refreshPage(), 1000);
            return;
        }
        if (changePseudo.status == 500) {
            addNotification({
                type : "error",
                title: "Erreur",
                message: `${data.message}`,
                duration: 3000
            })
            return;
        }

        changePseudoEl.value = ""
    }

    const handleUserModif = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const newNameEl = document.getElementById("userName") as HTMLInputElement;
        const newNameValue = newNameEl.value.trim()
        const IdUserForPseudo = localStorage.getItem("UserLoggedIntoId")

        if (!newNameValue) {
            addNotification({
                type: "warning",
                title: "Champ vide",
                message: "Veuillez fournir un nom d'utilisateur",
                duration: 3000
            })
        }

        const userNameChange = await fetch(`${API_ADRESSE}/auth/user/change-name`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key" : API_KEY
            },
            body: JSON.stringify({newUserName : newNameValue, idUserName : IdUserForPseudo})
        })

        const data = await userNameChange.json();

        if (userNameChange.status == 200) {
            addNotification({
                type: "success",
                title: "Changement de nom d'utilisateur",
                message : data.message,
                duration : 3000
            })
            localStorage.setItem("UserLoggedInto", newNameValue)
            refreshPage()
        }

        newNameEl.value = ""
    }

    const handleMdpModif = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        const lastMdpEl = document.getElementById("lastmdp") as HTMLInputElement;
        const lastMdpValue = lastMdpEl.value.trim();

        const newMdpEl = document.getElementById("newmdp") as HTMLInputElement;
        const newMdpValue = newMdpEl.value.trim();
        
        const idUserr = localStorage.getItem("UserLoggedIntoId");

        const modifMdp = await fetch(`${API_ADRESSE}/auth/mdp/modif`, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
                "x-api-key" : API_KEY
            },
            body : JSON.stringify({lastmdp : lastMdpValue, newmdp : newMdpValue, idUser : idUserr})
        })

        const data = await modifMdp.json();

        if (modifMdp.status == 200) {
            addNotification({
                type: "success",
                title: "Changement de mot de passe",
                message : data.message,
                duration : 3000
            })
        }

        if (modifMdp.status == 400) {
            addNotification({
                type: "info",
                title: "Changement de mot de passe",
                message : data.message,
                duration : 3000
            })
        }

        if (modifMdp.status == 403) {
            addNotification({
                type: "warning",
                title: "Changement de mot de passe",
                message : data.message,
                duration : 3000
            })
        }

        if (modifMdp.status == 500) {
            addNotification({
                type: "error",
                title: "Changement de mot de passe",
                message : data.message,
                duration : 3000
            })
        }

        console.log(data);

        lastMdpEl.value = "";
        newMdpEl.value = "";
    }

    return (
        <>
            <header className="landing-header">
                <h1><MdManageAccounts/>Compte</h1>
                <p>{userName}</p>
            </header>

            <div className='myacount-prcp'>

                <div>
                    <h1 style={{marginBottom: "10px"}}><span style={{color: 'rgba(248, 250, 252, 0.65)'}}>Nom d'utilisateur :</span> {userName}</h1>
                    <input id='userName' type="text" placeholder="Nom d'utilisateur "/>
                    <button onClick={handleUserModif}>Modifier</button>

                    <h1 style={{marginBottom: "10px", marginTop: "10px"}}><span style={{color: 'rgba(248, 250, 252, 0.65)'}}>Mon Pseudo : </span>{userPseudo}</h1>
                    <input id='pseudo' type="text" placeholder='Pseudo'/>
                    <button onClick={handlePseudo}>Modifier</button>
                    
                    <h1 style={{marginBottom: "10px", marginTop: "10px", color: 'rgba(248, 250, 252, 0.65)'}}>Modifier le mot de passe</h1>
                    <input style={{marginBottom: "10px"}} id='lastmdp' type="text" placeholder='Votre ancien mot de passe'/>
                    <input id='newmdp' type="text" placeholder='Votre nouveau mot de passe'/>
                    
                    <button onClick={handleMdpModif}>Modifier</button>
                </div>

                <button className='loagout-btn'
                    onClick={() => {
                        localStorage.clear()
                        refreshPage()
                    }}
                >Se déconnecter
                </button>

            </div>
        </>
    )
}

export default MyAccount;