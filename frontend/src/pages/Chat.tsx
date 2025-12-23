function Chat() {
    return (
        <>
            <div className="container-prcp-chat">

                <label htmlFor="chatBox">Zone du chat</label>
                <textarea name="chatBox" id="chatBox"></textarea> {/*Ajouter le fait qu'on peut pas écrire dedans*/}

                <label htmlFor="textZone"><button onClick={() => {
                    alert("Envoyer")
                }}>Envoyer</button></label>
                <input type="text" name="textZone" id="textZone" />
            </div>
        </>
    )
}

export default Chat;