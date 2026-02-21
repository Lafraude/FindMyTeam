// @ts-ignore
import React, { useEffect, useState } from 'react';
import { API_ADRESSE, API_KEY, userName } from '../CONFIG/config';
import { FiSettings } from 'react-icons/fi';
import { useUserData } from '../script/LoginLogique';
import { useNotification } from '../notif/notif';
import './css/gestion.css';

const API = API_ADRESSE;

function Gestion() {
    const { addNotification } = useNotification();
    const [isSlow, setIsSlow] = useState(false);

    const [addListObjectValueTempo, setAddListObjectValueTempo] = React.useState<string[]>([]);
    const { users, isLoading, error, fetchUsers, deleteUser } = useUserData(API, API_KEY);
    
    useEffect(() => {
        const savedObjects = localStorage.getItem("objectList");
        if (savedObjects) {
            try {
                const parsed = JSON.parse(savedObjects);
                if (Array.isArray(parsed)) {
                    setAddListObjectValueTempo(parsed);
                }
            } catch (err) {
                console.error("Erreur lors du chargement de objectList:", err);
            }
        }
    }, []);

    const handleAddObjectToList = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const addListObjectEl = document.getElementById("addListObject") as HTMLInputElement;
        const addListObjectValue = addListObjectEl.value.trim();
        
        if (!addListObjectValue) {
            addNotification({
                type: 'warning',
                title: 'Champ vide',
                message: 'Veuillez entrer un objet',
                duration: 3000
            });
            return;
        }

        setAddListObjectValueTempo(prev => {
            const newList = [...prev, addListObjectValue];
            localStorage.setItem("objectList", JSON.stringify(newList));
            return newList;
        });

        addListObjectEl.value = "";
        
        console.log(`- Objet ajouté : ${addListObjectValue}`);
    }

    const handleRemoveObject = (index: number) => {
        setAddListObjectValueTempo(prev => {
            const newList = prev.filter((_, i) => i !== index);
            localStorage.setItem("objectList", JSON.stringify(newList));
            return newList;
        });
        
        console.log(`- Objet supprimé à l'index ${index}`);
    };

    const handleSubmitMissions = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const selectValueEl = document.getElementById("addMissions") as HTMLSelectElement;
        const selectValue = selectValueEl.value;

        const addClientEl = document.getElementById("addClient") as HTMLInputElement;
        const addClientValue = addClientEl.value.trim();
        
        const addAdresseEl = document.getElementById("addAdresse") as HTMLInputElement;
        const addAdresseValue = addAdresseEl.value.trim();

        if (!addClientValue || !addAdresseValue) {
            addNotification({
                type: 'error',
                title: 'Informations incomplètes',
                message: 'Veuillez remplir tous les champs (client et adresse)',
                duration: 5000
            });
            return;
        }

        if (selectValue === "disable") {
            addNotification({
                type: 'error',
                title: 'Employé non sélectionné',
                message: 'Veuillez sélectionner un employé pour la mission',
                duration: 5000
            });
            return;
        }

        if (addListObjectValueTempo.length === 0) {
            addNotification({
                type: 'error',
                title: 'Liste vide',
                message: 'Veuillez ajouter au moins un objet à la mission',
                duration: 5000
            });
            return;
        }

        const missions_id = Date.now() + Math.floor(Math.random() * 1000);
        
        const dataToSend = {
            missions_id: missions_id,
            employe_id: selectValue,
            client_id: addClientValue,
            adresse_id: addAdresseValue,
            objects: addListObjectValueTempo,
        };

        console.log("- Données à envoyer:", dataToSend);

        try {
            const response = await fetch(`${API}/auth/creatework`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY
                },
                body: JSON.stringify(dataToSend)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Erreur lors de la création de la mission");
            }

            console.log("- Mission créée avec succès:", result);

            addNotification({
                type: 'success',
                title: 'Mission créée',
                message: `La mission pour ${addClientValue} a été créée avec succès`,
                duration: 5000
            });

            setAddListObjectValueTempo([]);
            localStorage.removeItem("objectList");
            selectValueEl.value = "disable";
            addClientEl.value = "";
            addAdresseEl.value = "";

        } catch (error: any) {
            console.error("Erreur lors de la création de la mission:", error);
            
            addNotification({
                type: 'error',
                title: 'Erreur',
                message: error.message || 'Impossible de créer la mission',
                duration: 5000
            });
        }
    }

    const handleAddUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const addUserEl = document.getElementById("addUser") as HTMLInputElement;
        const addUserValue = addUserEl.value.trim();

        const addMdpEl = document.getElementById("addMdp") as HTMLInputElement;
        const addMdpValue = addMdpEl.value.trim();

        const addIsAdminEl = document.getElementById("isAdmin") as HTMLSelectElement;
        const addIsAdminValue = addIsAdminEl.value;

        if (!addUserValue || !addMdpValue) {
            addNotification({
                type: 'error',
                title: 'Informations incomplètes',
                message: 'Veuillez remplir le nom d\'utilisateur et le mot de passe',
                duration: 5000
            });
            return;
        }

        if (addIsAdminValue === "disable") {
            addNotification({
                type: 'error',
                title: 'Statut manquant',
                message: 'Veuillez indiquer si l\'utilisateur est admin',
                duration: 5000
            });
            return;
        }

        console.log("- Création utilisateur:", { addUserValue, addIsAdminValue });

        try {
            const response = await fetch(`${API}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY
                },
                body: JSON.stringify({
                    username: addUserValue,
                    password: addMdpValue,
                    isAdmin: addIsAdminValue === "true",
                    pseudo : addUserValue
                })
            });

            const data = await response.json();

            if (response.status !== 201) {
                throw new Error(data.message || "Erreur lors de la création de l'utilisateur");
            }

            console.log("- Utilisateur créé:", data);

            addNotification({
                type: 'success',
                title: 'Utilisateur créé',
                message: `${addUserValue} a été ajouté avec succès`,
                duration: 5000
            });

            addUserEl.value = "";
            addMdpEl.value = "";
            addIsAdminEl.value = "disable";

            fetchUsers();

        } catch (error: any) {
            console.error("❌ Erreur handleAddUser:", error);
            
            addNotification({
                type: 'error',
                title: 'Erreur',
                message: error.message || 'Impossible de créer l\'utilisateur',
                duration: 5000
            });
        }
    }

    useEffect(() => {
        // @ts-ignore
        let timer;
        
        if (isLoading) {
            setIsSlow(false);
    
            timer = setTimeout(() => {
                setIsSlow(true);
            }, 5000);
        }
        
        // @ts-ignore
        return () => clearTimeout(timer);
    }, [isLoading]);

    return (
        <>
            <header className="landing-header">
                <h1><FiSettings /> Gestion</h1>
                <p>{userName}</p>
            </header>

            <div className='container-prcp-gestion'>

                <div className='container-prcp-GE'>
                    <h1>Gestion des employés</h1>
                    
                    {isLoading && !isSlow && (
                        <p className='loading-missions'>
                            Chargement des utilisateurs...
                        </p>
                    )}

                    {isLoading && isSlow && (
                        <p className='loading-missions' style={{color: "#FB7185"}}>Error : 408 <br /> Request Timeout</p>
                    )}

                    {error && (
                        <p className='error-missions'>
                            Erreur: {error} <br />
                            Contacter le support
                        </p>
                    )}

                    {users && users.length === 0 && !isLoading && (
                        <p>Aucun employé pour le moment</p>
                    )}

                    {users.map(user => (
                        <div key={user.id}>
                            <li>
                                {user.username}
                                <button onClick={() => deleteUser(user.id)}>
                                    X
                                </button>
                            </li>
                        </div>
                    ))}
                </div>

                <div className='container-prcp-addEm'>
                    <h1>Ajouter un employé</h1>

                    <input 
                        type="text" 
                        name='addUser' 
                        id='addUser' 
                        placeholder='Prénom & Nom'
                    />
                    <input 
                        style={{marginTop: "10px"}} 
                        type="password" 
                        name='addMdp' 
                        id='addMdp' 
                        placeholder='Mot de passe' 
                    />

                    <select name="isAdmin" id="isAdmin" aria-label="Statut admin ou non">
                        <option value="disable">Est-il admin ?</option>
                        <option value="true">Oui</option>
                        <option value="false">Non</option>
                    </select>

                    <button onClick={handleAddUser}>Ajouter</button>
                </div>

                <div className='container-prcp-addM' style={{marginBottom: "120px"}}> 
                    <h1>Ajouter une mission</h1>

                    <select name="addMissions" id="addMissions" aria-label="Sélectionner un employé">
                        <option value="disable">
                            Choisissez un employé
                        </option>
                        
                        {error && (
                            <option disabled className="error-missions">
                                Erreur: {error}
                            </option>
                        )}
                    
                        {users.map((u, index) => (
                            <option key={index} value={u.id}>
                                {u.username}
                            </option>
                        ))}
                    </select>

                    <div className="objects-section">
                        <h3>Liste des objets</h3>
                        <input 
                            type="text" 
                            name="addListObject" 
                            id="addListObject" 
                            placeholder='Ajouter un produit...'
                        />
                        <button onClick={handleAddObjectToList}>➕ Ajouter</button>

                        <ul className="objects-list">
                            {addListObjectValueTempo.length === 0 && (
                                <li className="empty-list">Aucun objet ajouté</li>
                            )}
                            {addListObjectValueTempo.map((item, index) => (
                                <li key={index}>
                                    {item} 
                                    <button 
                                        className="btn-remove" 
                                        onClick={() => handleRemoveObject(index)}
                                    >
                                        ❌
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <input 
                        type="text" 
                        name="addClient" 
                        id="addClient" 
                        placeholder='Nom du client...'
                    />

                    <input 
                        type="text" 
                        name="addAdresse" 
                        id="addAdresse" 
                        placeholder='Adresse...'
                    />

                    <button 
                        className="btn-submit-mission"
                        onClick={handleSubmitMissions}
                    >
                        Créer la mission
                    </button>
                </div>
            </div>
        </>
    )
}

export default Gestion;