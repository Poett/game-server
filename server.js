let Game = require('./modules/game');

module.exports = class GameServer
{
    constructor(io, http, app)
    {
        this.io = io;
        this.http = http;
        this.app = app;
        this.modules = [];
        this.count = 0;
        this.games = new Map();

        setInterval(() => 
        {
            let keys = Array.from(this.games.keys());
            io.to('menu').emit('get-games', keys); 
        }, 1000);
    }


    //Games Collection Methods
    getGame(gamename) 
    {
       return this.games.get(gamename);
    }
    addGame(gamename) 
    {
        if(this.games.has(gamename)){return false;}

        this.games.set(gamename, this.createGame(gamename));
        
        return true;
    }
    removeGame(gamename) {this.games.delete(gamename);}
    hasGame(gamename) {return this.games.has(gamename);}

    //Server Methods
    defaultUsername()
    {
        let username = "Client " + this.count;
        return username;
    }


    loadModule(serverModule)
    {
        this.modules.push(serverModule);
    }

    createGame(name)
    {
        let newGame = new Game(name, this.io);

        return newGame;
    }


    ioInitialize()
    {
        this.io.on('connection', (socket) => 
        {
            socket.join('menu');
            
            this.count++;
            socket.username = this.defaultUsername();


            this.modules.forEach(module => 
            {
                module(server, socket);    
            });

            console.log("Client Connected");


            socket.on('disonnect', (reason) => 
            {
                console.log(`${socket.username} disconnected.`);
            })
        })

    }

    startServer(port)
    {

        this.ioInitialize();

        //Start listening on the server
        this.http.listen(port, () => 
        {
            console.log("Listening on port " + port);
        });
    }
}