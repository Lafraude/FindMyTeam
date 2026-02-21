import { MdManageAccounts } from "react-icons/md";
import { refreshPage, userName, API_ADRESSE, API_KEY } from "../CONFIG/config";
import './css/mon-compte.css'

function MyAccount2() {

    const testregistermysql = () => {
        fetch(`${API_ADRESSE}/auth/register`, {method: "POST", headers: {
            "Content-Type": "application/json",
            "x-api-key" : API_KEY
        },
        body: JSON.stringify({username: "admin", email: "admin@admin.com", password: "admin"})})
    };

    const testloginmysql = () => {
        console.log("test")
    };

    const testRQTviewuser = () => {
        fetch(`${API_ADRESSE}/auth/viewuser`, {method: "POST", headers: {
            "Content-Type": "application/json",
            "x-api-key" : API_KEY
        }})
    }

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

                    <button onClick={testRQTviewuser}>
                        TEST RQT (viewuser)
                    </button>
                </div>
            </div>
        </> 
    )
}

export default MyAccount2;