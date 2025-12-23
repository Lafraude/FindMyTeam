import './css/nav.css'
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { API_ADRESSE, API_KEY, isConnected, refreshPage } from '../CONFIG/config';

const API = API_ADRESSE

function Nav() {
    const location = useLocation();
    const [theme, setTheme] = useState<string>('light');
    const [ isAdmin, setIsAdmin ] = useState(false)
    const navRef = useRef<HTMLDivElement>(null);
    const userName = localStorage.getItem("UserLoggedInto")

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }, []);

    useEffect(() => {
        // Animation de l'indicateur de fond
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

    // getAdmin
    useEffect(() => {
        fetch(`${API}/getadmin`, {
            headers: {
                "x-username": userName,
                "x-api-key": API_KEY
            }
        })
            .then(res => res.json())
            .then(data => {
                setIsAdmin(data.isAdmin); // 🔥 LA LIGNE QUI MANQUAIT
            })
            .catch(err => console.error(err));
    }, []);
    

    const navAdmin = () => {
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

        if (isAdmin) {
            return (
                <div className='nav-container-prcp'>
                    <div className='nav-container' ref={navRef}>
                        <Link to='/' className={location.pathname === '/' ? 'active' : ''}>Home</Link>
                        <Link to='/gestion' className={location.pathname === '/gestion' ? 'active' : ''}>Gestion</Link>
                        <Link to='/mon-compte' className={location.pathname === '/mon-compte' ? 'active' : ''}>Compte</Link>
                        <Link to='/carte' className={location.pathname === '/carte' ? 'active' : ''}>Carte</Link>
                        <Link to='/chat' className={location.pathname === '/chat' ? 'active' : ''}>Chat</Link>
                        <button onClick={toggleTheme} className="theme-toggle">
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                    </div>
                </div>
            )
        }

        return (
            <div className='nav-container-prcp'>
                <div className='nav-container' ref={navRef}>
                    <Link to='/' className={location.pathname === '/' ? 'active' : ''}>Home</Link>
                    <Link to='/mon-compte' className={location.pathname === '/mon-compte' ? 'active' : ''}>Compte</Link>
                    <Link to='/carte' className={location.pathname === '/carte' ? 'active' : ''}>Carte</Link>
                    <Link to='/chat' className={location.pathname === '/chat' ? 'active' : ''}>Chat</Link>
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