module.exports = function(server, socket)
{

    let events = 
        {
            //Menu Events
            "host-game" : hostGame,
            "join-game" : joinGame,
            "leave-game" : leaveGame,
            "get-games" : getGames
        };

        

    //Event Functions

    let io = server.io;
    let app = server.app;

    function hostGame(gamename)
    {
        server.addGame(gamename);

        let game = server.getGame(gamename);
        game.setPlayer1(socket);

        socket.join(`${gamename}`);
        socket.leave('menu');
        socket.emit('display-game');
    }

    function joinGame(gamename)
    {
        let game = server.getGame(gamename);
        if(game !== 'undefined')
        {
            
            socket.join(`${gamename}`);
            socket.leave('menu');
            socket.emit('display-game');
            game.setPlayer2(socket);
            game.startGame();
        }
    }

    function leaveGame(gamename)
    {
    }

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

