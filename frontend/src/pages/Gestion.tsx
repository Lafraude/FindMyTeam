// @ts-ignore
import React, { useEffect, useState } from 'react'
import { API_ADRESSE, API_KEY, userName } from '../CONFIG/config';
import './css/gestion.css'
import { FiSettings } from 'react-icons/fi';
import { callApiDeleteUser, useUserData } from '../script/LoginLogique';
import { p } from 'motion/react-client';

const API = API_ADRESSE

function Gestion() {

    const [addListObjectValueTempo, setAddListObjectValueTempo] = React.useState<string[]>([]);
    const { user, fetchUser, isLoading, error } = useUserData(API_ADRESSE, API_KEY);
    const [addUser, setAddUser] = React.useState<string[]>([])

    // Ajouter quelque choses a la liste :
    const handleAddObjectToList = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Empeche le rechargement de la page

        // Récup l'info de l'id addListObject
        const addListObjectEl = document.getElementById("addListObject") as HTMLInputElement;
        const addListObjectValue = addListObjectEl.value.trim();
        if (!addListObjectValue) return;

        // Ajoute quelque choses dans le tableaux
        setAddListObjectValueTempo(prev => {
            const newList = [...prev, addListObjectValue];
            localStorage.setItem("objectList", JSON.stringify(newList)); // Stocke directement la nouvelle liste
            return newList;
        });


        if (localStorage.getItem("objectList") !== null) {
            console.log("objectList présent")
        } else {
            console.error("objectList non présente")
            console.warn("Création en cours...")
            localStorage.setItem("objectList", JSON.stringify(addListObjectValueTempo))
            console.warn("Création Fini")
        }


        // Reset la valeur dans le champs
        addListObjectEl.value = "";
    }

    // Supprimer un objet a la liste :

    const handleRemoveObject = (index: number) => {
        setAddListObjectValueTempo(prev => {
            const newList = prev.filter((_, i) => i !== index); // delete l'élément
            localStorage.setItem("objectList", JSON.stringify(newList)); // met a jour localStorage
            return newList;
        });
    };

    // Ajouter la missions a l'employer
    const handleSubmitMissions = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Empeche le rechargement de la page

        const selectValueEl = document.getElementById("addMissions") as HTMLSelectElement;
        const selectValue = selectValueEl.value;

        const addClientEl = document.getElementById("addClient") as HTMLInputElement;
        const addClientValue = addClientEl.value.trim();
        const addAdresseEl = document.getElementById("addAdresse") as HTMLInputElement;
        const addAdresseValue = addAdresseEl.value.trim();

        if(!addClientValue || !addAdresseValue) return;

        if (localStorage.getItem("addUserMissions") !== null) {
            console.log("addUserMissions présent")
        } else {
            console.error("addUserMissions non présent")
            console.warn("Création en cours...")
            localStorage.setItem("addUserMissions", "")
            console.warn("Création Fini")
        }

        const dataToSendBackWoula = {
            employe_id : selectValue,                 
            client_id: addClientValue,               
            adresse_id: addAdresseValue,
            objects: addListObjectValueTempo
        }

        try {
            const response = await fetch(`${API}/missionsAdd`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY
                },
                body: JSON.stringify(dataToSendBackWoula)
            });

            const result = await response.json();
            console.log("Réponse du backend :", result)

            setAddListObjectValueTempo([]);

            selectValueEl.value = "disable";
            addClientEl.value = ""
            addAdresseEl.value = ""

        } catch (error) {
            console.error("Erreurs lors de l'envoie du la missions vers le backend : ", error)
        }
    }

    const handleAddUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Empeche le rechargement de la page


        const addUserEl = document.getElementById("addUser") as HTMLInputElement;
        const addUserValue = addUserEl.value.trim();

        const addIsAdminEl = document.getElementById("isAdmin") as HTMLSelectElement;
        const addIsAdminValue = addIsAdminEl.value;

        if (!addUserValue || !addIsAdminValue) return;

        const dataAddUser = {
            addUserValue: addUserValue,
            addAdminValue: addIsAdminValue
        };

        console.log(addUserValue)
        console.log(addIsAdminValue)

        try {
            const response = await fetch(`${API}/adduser`, {method: "POST", headers : {"Content-Type": "application/json", "x-api-key": API_KEY},
                body: JSON.stringify(dataAddUser)
            });
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.log("Erreur interne (BACKEND)", error);
        }

        addUserEl.value = ""
        addIsAdminEl.value = "disable"
    }

    // Retiré la missions au bout de 24h du localstorage et envoyer la data depuis l'api ! Pour que sa soit plus stocké dans le navigateur et que sa sois dater

    return(
        <>
            <header className="landing-header">
                <h1><FiSettings/>Gestion</h1>
                <p>{userName}</p>
            </header>
            <div className='container-prcp-gestion'>

                <div className='container-prcp-GE'>
                    <h1>Gestion employer</h1>
                    
                    {isLoading && (
                        <p className='loading-missions'>Chargement des utilisateurs...</p>
                    )}
                    {error && (
                        <p className='error-missions'>Erreur: {error} <br />Contacter le support</p>
                    )}

                    {user && user.map((u: any, index: number) => (
                        <ul key={index}>
                            <li>
                                {u.userName} <button
                                onClick={async () => { await callApiDeleteUser(u.id), fetchUser()}}>X</button>
                            </li>
                        </ul>
                    ))}
                </div>

                <div className='container-prcp-addEm'>
                    <h1>Ajouter des employers</h1>
                    <p>Ajouter le nom prénom</p>

                    <input type="text" name='addUser' id='addUser' placeholder='Prénom & Nom'/>

                    <select name="isAdmin" id="isAdmin" aria-label="Statut admin ou non">
                        <option value="disable" disabled selected>Et-t-il admin ?</option>
                        <option value="true">Oui</option>
                        <option value="false">Non</option>
                    </select>

                    <button onClick={handleAddUser}>Ajouter</button>

                    
                </div>

                <div className='container-prcp-addM' style={{marginBottom: "120px"}}> 
                    <h1>Ajouter des missions</h1>

                    <select name="addMissions" id="addMissions" aria-label='addMissions'>
                        <option value="disable" disabled selected>Choisissez un employé</option>
                        <option value="option1">Mr. Jefferson</option>
                    </select>

                    <input type="text" name="addListObject" id="addListObject" placeholder='Ajouter un produit...'/>
                    <button onClick={handleAddObjectToList}>Ajouter</button>

                    <ul>
                        {addListObjectValueTempo.map((item, index) => (
                            <li key={index}>
                                {item} <button onClick={() => handleRemoveObject(index)}>X</button>
                            </li>
                        ))}
                    </ul>

                    <input type="text" name="addClient" id="addClient" placeholder='Nom du client...'/>

                    <input type="text" name="addAdresse" id="addAdresse" placeholder={`Adresse...`}/>

                    <button onClick={handleSubmitMissions}>Ajouter la missions</button>

                </div>
            </div>
        </>
    )
}

export default Gestion;