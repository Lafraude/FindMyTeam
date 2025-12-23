import { MdManageAccounts } from "react-icons/md";
import { refreshPage } from "../CONFIG/config";
import { userName } from "../CONFIG/config";
import './css/mon-compte.css'

function MyAccount() {
    return (
        <>  
            <header className="landing-header">
                <h1><MdManageAccounts/>Compte</h1>
                <p>{userName}</p>
            </header>
            <div className='container-my-acount-prcp'>
                <div className='container-my-acount'>
                    <button
                        onClick={() => {
                            localStorage.setItem("isConnected", "false")
                            refreshPage()
                        }}
                    >Se déconnecter
                    </button>
                </div>
            </div>
        </> 
    )
}

export default MyAccount;