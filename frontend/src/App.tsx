import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { NotificationProvider } from "./notif/notif";

import Home from "./pages/home"
import Nav from "./pages/nav"
import Gestion from "./pages/Gestion";
import Carte from "./pages/Carte";
import Chat from "./pages/Chat";
import NotFound from "./Error/!notFound";
import './index.css'
import MyAccount from "./pages/mon-compte";
import LoginPage from "./pages/loginPage";



function App() {

  return (
    <>
      <NotificationProvider>
        <Router>
          <Nav/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gestion" element={<Gestion />} />
            <Route path="/carte" element={<Carte />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/mon-compte" element={<MyAccount />}/>
            <Route path="/login" element={<LoginPage />}/>
            <Route path="*" element={<NotFound/>}/>
          </Routes>
        </Router>
      </NotificationProvider>
    </>
  )
}

export default App
