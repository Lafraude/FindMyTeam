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
import { useNotification } from '../notif/notif';

const API = API_ADRESSE;

interface Mission {
  id: number
  employe_id: string
  client_id: string
  objects: string[]
  adresse_id: string
  status?: "attente" | "cours" | "fini"
}

function Home() {

  const [missions, setMissions] = useState<Mission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [popupMissionId, setPopupMissionId] = useState<number | null>(null)
  const [activeFilter, setActiveFilter] = useState<"attente" | "cours" | "fini">("attente")
  const { addNotification } = useNotification();

  const dataMissions = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const userId = localStorage.getItem("UserLoggedIntoId");
      
      if (!userId) {
        throw new Error("Utilisateur non connecté");
      }

      const res = await fetch(`${API}/auth/getmissions`, {
        headers: {
          "x-api-key": API_KEY,
          "x-username": userId
        }
      })

      if (!res.ok) {
        throw new Error(`Erreur ${res.status}: ${res.statusText}`)
      }

      const result = await res.json()
      
      if (!Array.isArray(result.missions)) {
        throw new Error("Format de réponse invalide");
      }

      setMissions(result.missions)
      console.log(`- ${result.missions.length} mission(s) chargée(s)`);

    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des missions")
      console.error("- Erreur dataMissions:", err)
      
      addNotification({
        type: 'error',
        title: 'Erreur de chargement',
        message: 'Impossible de récupérer les missions',
        duration: 5000
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isConnected) {
      dataMissions()
    }
  }, [])

  const handleStatusChange = async (id: number, newStatus: string) => {
    if (newStatus === "fini") {
      setPopupMissionId(id)
      return
    }

    try {
      const response = await fetch(`${API}/auth/missions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la mise à jour");
      }

      setMissions(prev =>
        prev.map(m =>
          m.id === id ? { ...m, status: newStatus as any } : m
        )
      )

      console.log(`- Mission ${id} mise à jour : ${newStatus}`);

      addNotification({
        type: 'success',
        title: 'Statut mis à jour',
        message: `La mission est maintenant "${newStatus}"`,
        duration: 3000
      })

    } catch (err: any) {
      console.error("- Erreur handleStatusChange:", err)
      
      addNotification({
        type: 'error',
        title: 'Erreur de mise à jour',
        message: err.message || 'Impossible de mettre à jour le statut',
        duration: 5000
      })
    }
  }

  const confirmFinish = async () => {
    if (!popupMissionId) return

    try {
      const response = await fetch(`${API}/auth/missions/${popupMissionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY
        },
        body: JSON.stringify({ status: "fini" })
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la confirmation");
      }

      setMissions(prev =>
        prev.map(m =>
          m.id === popupMissionId ? { ...m, status: "fini" } : m
        )
      )

      setPopupMissionId(null)

      console.log(`- Mission ${popupMissionId} terminée`);

      addNotification({
        type: 'success',
        title: 'Mission terminée',
        message: 'La mission a été marquée comme terminée',
        duration: 5000
      })

    } catch (err: any) {
      console.error("- Erreur confirmFinish:", err)
      
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: err.message || 'Impossible de terminer la mission',
        duration: 5000
      })
    }
  }

  if (!isConnected) {
    return (
      <div className="landing-page">
        <header className="landing-header">
          <h1><GiTeamDowngrade /> FindMyTeam</h1>
          <Link
            to="/login"
            className={location.pathname === '/login' ? 'active' : ''}
          >
            Connexion
          </Link>
        </header>

        <section className="hero">
          <h2>Gérez votre équipe terrain en temps réel</h2>
          <p>
            Localisez vos collaborateurs, assignez des missions et optimisez vos déplacements
          </p>
        </section>

        <section className="features">
          <div className="feature">
            <span><CiLocationOn /></span>
            <h3>Localisation en direct</h3>
            <p>Suivez la position de vos équipes sur une carte interactive</p>
          </div>

          <div className="feature">
            <span><MdOutlineSubscriptions /></span>
            <h3>Gestion de missions</h3>
            <p>Assignez et suivez l'avancement des tâches</p>
          </div>

          <div className="feature">
            <span><GoAlert /></span>
            <h3>Alertes zones</h3>
            <p>Recevez des notifications quand vos équipes entrent/sortent de zones définies</p>
          </div>

          <div className="feature">
            <span><BiBattery /></span>
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
        <h1><SiMyspace /> Mon Espace</h1>
        <p>{userName}</p>
      </header>

      <div className="container-filter-prcp">
        <div className="container-filter">
          <button 
            onClick={() => setActiveFilter("attente")}
            className={activeFilter === "attente" ? "active" : ""}
          >
            En attente ({missions.filter(m => (m.status ?? "attente") === "attente").length})
          </button>
          <button 
            onClick={() => setActiveFilter("cours")}
            className={activeFilter === "cours" ? "active" : ""}
          >
            En cours ({missions.filter(m => m.status === "cours").length})
          </button>
          <button 
            onClick={() => setActiveFilter("fini")}
            className={activeFilter === "fini" ? "active" : ""}
          >
            Terminées ({missions.filter(m => m.status === "fini").length})
          </button>
        </div>
      </div>

      <div className="container-missions-prcp">
        {isLoading && (
          <div className="loading-container">
            <p className="loading-missions">Chargement des missions...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <p className="error-missions">Erreur: {error}</p>
            <button onClick={dataMissions}>Réessayer</button>
          </div>
        )}

        {!isLoading && !error && ["attente", "cours", "fini"].map((status) => {
          const filteredMissions = missions.filter(m => (m.status ?? "attente") === status);

          return (
            <div
              key={status}
              className="container-missions"
              style={{
                opacity: activeFilter === status ? 1 : 0,
                pointerEvents: activeFilter === status ? "auto" : "none",
                position: activeFilter === status ? "relative" : "absolute",
              }}
            >
              {filteredMissions.length === 0 && (
                <div className="no-missions">
                  <p>Aucune mission {status === "attente" ? "en attente" : status === "cours" ? "en cours" : "terminée"}</p>
                </div>
              )}

              {filteredMissions.map(mission => (
                <div className="container-info" key={mission.id}>
                  <div className="mission-header">
                    <h3>{mission.client_id}</h3>
                    <span className={`status-badge status-${mission.status ?? "attente"}`}>
                      {mission.status ?? "attente"}
                    </span>
                  </div>

                  <p className="mission-address">
                    {mission.adresse_id}
                  </p>

                  <div className="mission-objects">
                    <h4>Liste des objets :</h4>
                    <ul>
                      {mission.objects.map((obj, i) => (
                        <li key={i}>
                          <input 
                            type="checkbox" 
                            id={`obj-${mission.id}-${i}`}
                          />
                          <label htmlFor={`obj-${mission.id}-${i}`}>
                            {obj}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mission-actions">
                    <select
                      aria-label='Changer le statut'
                      value={mission.status ?? "attente"}
                      onChange={(e) =>
                        handleStatusChange(mission.id, e.target.value)
                      }
                      disabled={mission.status === "fini"}
                      className="status-select"
                    >
                      <option value="attente">En attente</option>
                      <option value="cours">En cours</option>
                      <option value="fini">Terminée</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {popupMissionId && (
        <div className="container-popup-fini-prcp">
          <div className="container-popup-fini">
            <h2>Confirmer la fin de mission ?</h2>
            <p>Cette action est irréversible. La mission sera marquée comme terminée.</p>
            <div className='container-popup-fini-button'>
              <button 
                className='btn-popup-no' 
                onClick={() => setPopupMissionId(null)}
              >
                Annuler
              </button>
              <button 
                className='btn-popup-yes' 
                onClick={confirmFinish}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Home;