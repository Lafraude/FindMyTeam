import { MdManageAccounts } from "react-icons/md";
import { refreshPage, userName, API_ADRESSE, API_KEY } from "../CONFIG/config";
import './css/mon-compte.css'

function MyAccount() {

    const testregistermysql = () => {
        fetch(`${API_ADRESSE}/auth/register`, {method: "POST", headers: {
            "Content-Type": "application/json",
            "x-api-key" : API_KEY
        },
        body: JSON.stringify({username: "admin", email: "admin@admin.com", password: "admin"})})
    };

    const testloginmysql = () => {
        fetch(`${API_ADRESSE}/auth/login`, {method: "POST", headers: {
            "Content-Type": "application/json",
            "x-api-key" : API_KEY
        },
        body: JSON.stringify({emailLogin: "admin@admin.com", passwordLogin: "admin"})})
        .then(res => {
          if (res.status === 200) {
            return res.json();
          } else {
            throw new Error("Erreur de connexion");
          }
        })
        .then(data => {
            console.log(data)
        })
        .catch(err => {
            console.error(err.message)
        })
    };

    return (
        <>  
            <header className="landing-header">
                <h1><MdManageAccounts/>Compte</h1>
                <p>{userName}</p>
            </header>
            <div className='container-my-acount-prcp'>
                <div className='container-my-acount' style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    <button
                        onClick={() => {
                            localStorage.setItem("isConnected", "false")
                            refreshPage()
                        }}
                    >Se déconnecter
                    </button>

                    <button
                        onClick={testregistermysql}
                    >
                        Test REGISTER MYSQL
                    </button>

                    <button
                        onClick={testloginmysql}
                    >
                        Test LOGIN MYSQL
                    </button>
                </div>
            </div>
        </> 
    )
}

export default MyAccount;