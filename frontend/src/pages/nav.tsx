// Nav.tsx - VERSION CORRIGÉE

import './css/nav.css'
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { API_ADRESSE, API_KEY, isConnected, refreshPage } from '../CONFIG/config';

const API = API_ADRESSE

function Nav() {
    const location = useLocation();
    const [theme, setTheme] = useState<string>('dark');
    const [isAdmin, setIsAdmin] = useState(false); // État pour savoir si l'user est admin
    const [isLoadingAdmin, setIsLoadingAdmin] = useState(true); // État de chargement
    const navRef = useRef<HTMLDivElement>(null);
    const userName = localStorage.getItem("UserLoggedInto");

    // ========================================
    // Gestion du thème
    // ========================================
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }, []);

    // ========================================
    // Animation de l'indicateur de navigation
    // ========================================
    useEffect(() => {
        if (navRef.current) {
            const activeLink = navRef.current.querySelector('a.active') as HTMLElement;
            const navContainer = navRef.current;
            
            if (activeLink) {
                const left = activeLink.offsetLeft;
                const width = activeLink.offsetWidth;
                
                navContainer.style.setProperty('--indicator-left', `${left}px`);
                navContainer.style.setProperty('--indicator-width', `${width}px`);
            }
        }
    }, [location.pathname]);
    
    // ========================================
    // Toggle du thème clair/sombre
    // ========================================
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (newTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    };

    // ========================================
    // ✅ CORRECTION : Vérifier si l'utilisateur est admin
    // ========================================
    useEffect(() => {
        // Si pas connecté, pas besoin de vérifier
        if (!isConnected || !userName) {
            setIsLoadingAdmin(false);
            return;
        }

        // Appel API pour vérifier le statut admin
        fetch(`${API}/auth/getadmin`, { // ✅ ROUTE CORRIGÉE : /auth/getadmin
            headers: {
                "x-username": userName,
                "x-api-key": API_KEY
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Erreur ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setIsAdmin(data.isAdmin); // ✅ Mise à jour de l'état
                console.log(`✅ Statut admin récupéré pour ${userName}: ${data.isAdmin}`);
            })
            .catch(err => {
                console.error("❌ Erreur lors de la récupération du statut admin:", err);
                setIsAdmin(false); // Par défaut, on considère que l'user n'est pas admin
            })
            .finally(() => {
                setIsLoadingAdmin(false); // Fin du chargement
            });
    }, [userName]); // ✅ Dépendance sur userName pour recharger si changement

    // ========================================
    // Rendu de la navigation selon le statut
    // ========================================
    const navAdmin = () => {
        // Si pas connecté : afficher login
        if (!isConnected) {
            return (
                <div className='nav-container-prcp'>
                    <div className='nav-container' ref={navRef}>
                        <Link to='/' className={location.pathname === '/' ? 'active' : ''}>
                            Home
                        </Link>
                        <Link to='/login' className={location.pathname === '/login' ? 'active' : ''}>
                            Connexion
                        </Link>
                        <button onClick={toggleTheme} className="theme-toggle">
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                    </div>
                </div>
            )
        }

        // Si en cours de chargement du statut admin
        if (isLoadingAdmin) {
            return (
                <div className='nav-container-prcp'>
                    <div className='nav-container' ref={navRef}>
                        <p>Chargement...</p>
                    </div>
                </div>
            )
        }

        // Si admin : afficher toutes les options
        if (isAdmin) {
            return (
                <div className='nav-container-prcp'>
                    <div className='nav-container' ref={navRef}>
                        <Link to='/' className={location.pathname === '/' ? 'active' : ''}>
                            Home
                        </Link>
                        <Link to='/gestion' className={location.pathname === '/gestion' ? 'active' : ''}>
                            Gestion
                        </Link>
                        <Link to='/mon-compte' className={location.pathname === '/mon-compte' ? 'active' : ''}>
                            Compte
                        </Link>
                        <Link to='/carte' className={location.pathname === '/carte' ? 'active' : ''}>
                            Carte
                        </Link>
                        <Link to='/chat' className={location.pathname === '/chat' ? 'active' : ''}>
                            Chat
                        </Link>
                        <button onClick={toggleTheme} className="theme-toggle">
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                    </div>
                </div>
            )
        }

        // Si utilisateur normal (pas admin)
        return (
            <div className='nav-container-prcp'>
                <div className='nav-container' ref={navRef}>
                    <Link to='/' className={location.pathname === '/' ? 'active' : ''}>
                        Home
                    </Link>
                    <Link to='/mon-compte' className={location.pathname === '/mon-compte' ? 'active' : ''}>
                        Compte
                    </Link>
                    <Link to='/carte' className={location.pathname === '/carte' ? 'active' : ''}>
                        Carte
                    </Link>
                    <Link to='/chat' className={location.pathname === '/chat' ? 'active' : ''}>
                        Chat
                    </Link>
                    <button onClick={toggleTheme} className="theme-toggle">
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <>
            {navAdmin()}
        </>  
    )
}

export default Nav;