module.exports = class SocketIOManager
{
    constructor(io)
    {
        this.io = io;
    }


    defineConnection(modules)
    {
        //Set up Socket.io connection for the client connecting
        this.io.on('connection', (socket) => 
        {
            //Allows a default username per socket
            socket.username = defaultUsername();
            //Log to console
            console.log(`${socket.username} has joined`);

            for(let i = 0; i < modules.length; i++)
            {
                modules[i]()
            }
        });
    }
}

