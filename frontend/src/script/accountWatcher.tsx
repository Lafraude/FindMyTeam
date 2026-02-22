// AccountWatcher.tsx
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { API_ADRESSE_SOCKET, refreshPage } from "../CONFIG/config";

interface Props {
  currentUserId: number;
}

const AccountWatcher: React.FC<Props> = ({ currentUserId }) => {
  useEffect(() => {
    const socket: Socket = io(API_ADRESSE_SOCKET);

    socket.emit("joinRoom", `user_${currentUserId}`);

    socket.on("accountDeleted", () => {
        localStorage.clear()
        refreshPage()
        alert("Votre compte a été supprimé par un administrateur.");
      
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUserId]);

  return null;
};

export default AccountWatcher;