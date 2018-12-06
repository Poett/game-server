module.exports = function(server, socket)
{

    let events = 
        {
            //Menu Events
            "set-username" : setUsername,
            "host-game" : hostGame,
            "join-game" : joinGame,
            "leave-game" : leaveGame,
            "get-games" : getGames
        };

        

    //Event Functions

    let io = server.io;
    let app = server.app;

    function setUsername(username)
    {
        for(var i in io.sockets.connected)
        {
            if(username === io.sockets.connected[i].username)
            {
                console.log(`${socket.username} tried to change their username to ${username} but it was taken.`);
                return;
            }
        }

        console.log(`${socket.username} changed their username to ${username}`);
        socket.username = username;
    }

    function hostGame(gamename)
    {
        if(server.addGame(gamename))
        {
            let game = server.getGame(gamename);
        }
    }

    function joinGame(gamename)
    {
        socket.leave('menu');
        socket.join(gamename);
    }

    function leaveGame(gamename){}

    function getGames()
    {

        games = [];

        server.games.forEach((value, key, map) => 
        {
            games.push(key);
        });

        socket.emit('get-games', games);
    }






    //Add events for the passed-in socket for the current module
    for (const key in events) {
        if (events.hasOwnProperty(key)) {
            const event = events[key];
            socket.on(key, event);
        }
    }
}

