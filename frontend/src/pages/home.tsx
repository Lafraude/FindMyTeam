import { useEffect, useState } from 'react'
import { API_ADRESSE, API_KEY, isConnected, userName } from '../CONFIG/config'
import { Link } from "react-router-dom";

import './css/home.css'
import { BiBattery } from 'react-icons/bi';
import { CiLocationOn } from 'react-icons/ci';
import { MdOutlineSubscriptions } from 'react-icons/md';
import { GoAlert } from 'react-icons/go';
import { GiTeamDowngrade } from 'react-icons/gi';
import { SiMyspace } from 'react-icons/si';
import { div } from 'motion/react-client';

const API = API_ADRESSE

interface Mission {
    id: number
    employe_id: string
    client_id: string
    objects: string[]
    adresse_id : string
    status?: string
}

function Home() {
    const [isdata, setData] = useState<Mission[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [popupMissionId, setPopupMissionId] = useState<number | null>(null);
    
    const dataMissions = async () => {
        try {
            setIsLoading(true)
            const res = await fetch(`${API}/viewmissions`, {
                method: "GET",
                headers: { "x-api-key" : API_KEY },
            })
            
            if (!res.ok) {
                throw new Error(`Erreur HTTP: ${res.status}`)
            }
            
            const result = await res.json()
            setData(result.missions)
        } catch (error) {
            setError(error instanceof Error ? error.message : "Une erreur est survenue")
            console.error("Erreur lors du chargement des missions:", error)
        } finally {
            setIsLoading(false)
        }
    }
    
    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            const res = await fetch(`${API}/missions/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY
                },
                body: JSON.stringify({ status: newStatus })
            });
            const result = await res.json();
        
            if (!res.ok) {
                alert(result.error);
                return;
            }
        
            setData(prev =>
                prev.map(m => m.id === id ? { ...m, status: newStatus } : m)
            );
        
            if (newStatus === "fini") setPopupMissionId(id);
        } catch (err) {
            console.error(err);
        }
    };


    const confirmFinish = () => {
        if (popupMissionId !== null) {
            // Ici Appeler ton API pour confirmer la mission
            // A faire
            console.log("Mission confirmée :", popupMissionId);
        }
        setPopupMissionId(null);
    };

    const cancelFinish = () => setPopupMissionId(null);

    useEffect(() => {
        dataMissions()
    }, [])

    const loading = isLoading ? (
        <div className='container-prcp'><p className='loading-missions'>Chargement des missions...</p></div>
    ) : null;

    // if (error) {
    //     return <div className='container-prcp'><p className='error-missions'>Erreur: {error} <br />Contacter le support</p></div>
    // }

    const ViewError = error ? (
        <div className='container-prcp'><p className='error-missions'>Erreur: {error} <br />Contacter le support</p></div>
    ) : null;



    if (!isConnected) {
      return (
        <div className="landing-page">
          <header className="landing-header">
            <h1><GiTeamDowngrade/> FindMyTeam</h1>
                <Link to='/login' className={location.pathname === '/login' ? 'active' : ''}>
                    Connexion
                </Link>
          </header>

          <section className="hero">
            <h2>Gérez votre équipe terrain en temps réel</h2>
            <p>Localisez vos collaborateurs, assignez des missions et optimisez vos déplacements</p>
          </section>

          <section className="features">
            <div className="feature">
              <span><CiLocationOn/></span>
              <h3>Localisation en direct</h3>
              <p>Suivez la position de vos équipes sur une carte interactive</p>
            </div>

            <div className="feature">
              <span><MdOutlineSubscriptions/></span>
              <h3>Gestion de missions</h3>
              <p>Assignez et suivez l'avancement des tâches</p>
            </div>

            <div className="feature">
              <span><GoAlert/></span>
              <h3>Alertes zones</h3>
              <p>Recevez des notifications quand vos équipes entrent/sortent de zones définies</p>
            </div>

            <div className="feature">
              <span><BiBattery/></span>
              <h3>Statuts temps réel</h3>
              <p>Batterie, vitesse, dernière connexion... tout en un coup d'œil</p>
            </div>
          </section>
        </div>
      );
    }

    return (
        <>  
            <header className="landing-header">
                <h1><SiMyspace/> Mon Espace</h1>
                <p>{userName}</p>
            </header>
            <div className='container-missions-prcp'>
                <div className='container-missions'>
                    
                    {ViewError}

                    {!isLoading && !error && (
                        isdata.length === 0 ? (
                            <p className='RAS-MISSIONS'>Aucune mission disponible</p>
                        ) : (
                            isdata.map((mission, index) => (
                                <div className='container-info' key={mission.id}>
                                    <p className='client-id'>{mission.client_id}</p>
                                    <p className='adresse-id'>{mission.adresse_id}</p>
                            
                                    <ul>
                                        Liste d'objet
                                        {mission.objects.map((obj: string, i: number) => (
                                            <li key={i}>
                                                - {obj}
                                                <input type="checkbox" name="isTake" placeholder='isTake'/>
                                            </li>
                                        ))}
                                    </ul>
                                    
                                    <select
                                        aria-label="Statut de la mission"
                                        value={mission.status}
                                        onChange={(e) =>
                                            handleStatusChange(mission.id, e.target.value)
                                        }
                                        disabled={mission.status === "fini"}
                                    >
                                        <option value="attente">En attente</option>
                                        <option value="cours">En cours</option>
                                        <option value="fini">Fini</option>
                                    </select>
                                </div>
                            ))
                        )
                    )}
                </div>


                {popupMissionId !== null && (
                    <div className='container-popup-fini-prcp'>
                        <div className='container-popup-fini'>
                            <h1>Voulez-vous confirmer la fin de votre mission ?</h1>
                            <button onClick={cancelFinish}>Non</button>
                            <button onClick={confirmFinish}>Oui</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
export default Home;