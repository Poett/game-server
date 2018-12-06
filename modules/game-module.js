module.exports = function(server, socket)
{

    let events = 
        {
            //Menu Events
            "chat-message" : chatMessage,
            "game-update" : update
        };

        

    //Event Functions

    let io = server.io;
    let app = server.app;

    //Define a 'chat message' event
    function chatMessage(msg)
    {
        let room = Object.keys(socket.rooms)[1];
        let label = socket.username;

        if(msg && msg !== "")
        io.to(room).emit('chat-message', msg, label);
    };


    function update(y)
    {
        let room = Object.keys(socket.rooms)[1];
        let game = server.getGame(room);
        if(game !== undefined)
        {
            game.updatePlayer(socket.id, y);
            game.update();
        }
    }






    //Add events for the passed-in socket for the current module
    for (const key in events) {
        if (events.hasOwnProperty(key)) {
            const event = events[key];
            socket.on(key, event);
        }
    }
}

