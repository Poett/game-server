module.exports = class Game
{
    constructor(name)
    {
        this.name = name;
        this.host = undefined;
        this.guest = undefined;
    }

    setHost(hostSocket)
    {
        this.host = hostSocket;
    }

    setGuest(guestSocket)
    {
        
    }
}