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

const API = API_ADRESSE

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

  const dataMissions = async () => {
    try {
      setIsLoading(true)

      const res = await fetch(`${API}/viewmissions`, {
        headers: {
          "x-api-key": API_KEY,
          "x-username": localStorage.getItem("idLoggedTo") || ""
        }
      })

      if (!res.ok) throw new Error(`Erreur ${res.status}`)

      const result = await res.json()
      setMissions(result.missions)

    } catch (err) {
      setError("Erreur lors du chargement des missions")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    dataMissions()
  }, [])


  const handleStatusChange = async (id: number, newStatus: string) => {
    if (newStatus === "fini") {
      setPopupMissionId(id)
      return
    }

    try {
      await fetch(`${API}/missions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY
        },
        body: JSON.stringify({ status: newStatus })
      })

      setMissions(prev =>
        prev.map(m =>
          m.id === id ? { ...m, status: newStatus as any } : m
        )
      )

    } catch (err) {
      console.error(err)
    }
  }

  const confirmFinish = async () => {
    if (!popupMissionId) return

    await fetch(`${API}/missions/${popupMissionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY
      },
      body: JSON.stringify({ status: "fini" })
    })

    setMissions(prev =>
      prev.map(m =>
        m.id === popupMissionId ? { ...m, status: "fini" } : m
      )
    )

    setPopupMissionId(null)
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

      {/* FILTRES */}
      <div className="container-filter-prcp">
        <div className="container-filter">
          <button onClick={() => setActiveFilter("attente")}>En attente</button>
          <button onClick={() => setActiveFilter("cours")}>En cours</button>
          <button onClick={() => setActiveFilter("fini")}>Fini</button>
        </div>
      </div>

      {/* MISSIONS */}
      <div className="container-missions-prcp">
        {["attente", "cours", "fini"].map((status) => (
          <div
            key={status}
            className="container-missions"
            style={{
              opacity: activeFilter === status ? 1 : 0,
              pointerEvents: activeFilter === status ? "auto" : "none",
              position: activeFilter === status ? "relative" : "absolute",
            }}
          >
            {isLoading && <p>Chargement...</p>}
            {error && <p>{error}</p>}

            {!isLoading && missions
              .filter(m => (m.status ?? "attente") === status)
              .map(mission => (
                <div className="container-info" key={mission.id}>
                  <p>{mission.client_id}</p>
                  <p>{mission.adresse_id}</p>

                  <ul>
                    Liste d'objet
                    {mission.objects.map((obj, i) => (
                      <li key={i}>
                        - {obj}
                        <input type="checkbox" />
                      </li>
                    ))}
                  </ul>

                  <select
                    value={mission.status ?? "attente"}
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
              ))}
          </div>
        ))}
      </div>

      {/* POPUP */}
      {popupMissionId && (
        <div className="container-popup-fini-prcp">
          <div className="container-popup-fini">
            <h1>Confirmer la fin de mission ?</h1>
            <div className='container-popup-fini-button'>
                <button className='btn-popup-no' onClick={() => setPopupMissionId(null)}>Non</button>
                <button className='btn-popup-yes' onClick={confirmFinish}>Oui</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Home
