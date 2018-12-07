module.exports = class Game
{
    constructor(name, io)
    {
        this.io = io;
        this.name = name;
        this.player1Socket = undefined;
        this.player2Socket = undefined;
        
        this.WIDTH = 700;
        this.HEIGHT = 600;

        // this.player1 = undefined;
        // this.player2 = undefined;
        // this.ball = undefined;


        this.player1 =
        {
            x: null,
            y: null,
            score: 0,
            width:  20,
            height: 100,
        };

        this.player2 =
        {
            x: null,
            y: null,
            score: 0,
            width:  20,
            height: 100,
        };

        this.ball = 
        {
            x:   null,
            y:   null,
            vel: null,
        
            side:  10,
            speed: 5,

            vel: 
            {
                x: 0,
                y: 0
            }
        }

        
    }

    serve(side)
    {
        // set the x and y position
        var r = Math.random();
        this.ball.x = side===1 ? this.player1.x + this.player1.width : this.player2.x - this.ball.side;
        this.ball.y = (this.HEIGHT - side)*r;

        var phi = 0.1*3.14159*(1 - 2*r); //angle for the ball velocity
        // set velocity direction and magnitude
        this.ball.vel.x = side * this.ball.speed * Math.cos(phi);
        this.ball.vel.y = this.ball.speed * Math.sin(phi);

    }


    endGame()
    {
        this.ball.vel.x = 0;
        this.ball.vel.y = 0;
        this.ball.x = this.WIDTH/2;
        this.ball.y = this.HEIGHT/2;
    }

    startGame()
    {
        this.player1.x = this.player1.width;
        this.player1.y = (this.HEIGHT - this.player1.height)/2;
    
        this.player2.x = this.WIDTH - (this.player1.width + this.player2.width);
        this.player2.y = (this.HEIGHT - this.player2.height)/2;

        this.serve(1);

        //Send game info to player2;
        this.player2Socket.emit('game-initial', this.player2, this.player1, this.ball);
        //Send game info to player1;
        this.player1Socket.emit('game-initial', this.player1, this.player2, this.ball);
    }

    setPlayer1(socket)
    {
        if(this.player1Socket === undefined)
        this.player1Socket = socket;
    }

    setPlayer2(socket)
    {
        if(this.player2Socket === undefined)
        this.player2Socket = socket;
    }

    updatePlayer(id, y)
    {
        if(this.player1Socket.id == id)
        {
            this.player1.y = y;
        }
        else if (this.player2Socket.id == id)
        {
            this.player2.y = y;
        }
    }


    updateBall()
    {
        // update position with current velocity
        this.ball.x += this.ball.vel.x;
        this.ball.y += this.ball.vel.y;

        // check if out of the canvas in the y direction
        if (0 > this.ball.y || this.ball.y+this.ball.side > this.HEIGHT) {
            // calculate and add the right offset, i.e. how far
            // inside of the canvas the ball is
            var offset = this.ball.vel.y < 0 ? 0 - this.ball.y : this.HEIGHT - (this.ball.y+this.ball.side);
            this.ball.y += 2 * offset;
            // mirror the y velocity
            this.ball.vel.y *= -1;
        }

        

    

        //Shorthand function
        var bounding = function(ax, ay, aw, ah, bx, by, bw, bh) {
            return ax < bx+bw && ay < by+bh && bx < ax+aw && by < ay+ah;
        };

        //Who is defending the balll
        var player = this.ball.vel.x < 0 ? this.player1 : this.player2;

        if (bounding(player.x, player.y, player.width, player.height, this.ball.x, this.ball.y, this.ball.side, this.ball.side)) 
        {	
            // set the x position and calculate reflection angle
            this.ball.x = player === this.player1 ? this.player1.x+this.player1.width : this.player2.x - this.ball.side;
            var n = (this.ball.y+this.ball.side - player.y)/(player.height+this.ball.side);
            var phi = 0.25*3.14159*(2*n - 1); // pi/4 = 45
            // calculate smash value and update velocity
            var smash = Math.abs(phi) > 0.2*Math.pi ? 1.5 : 1;
            this.ball.vel.x = smash*(player===this.player1 ? 1 : -1)*this.ball.speed*Math.cos(phi);
            this.ball.vel.y = smash*this.ball.speed*Math.sin(phi);
        }

        // reset the ball when ball outside of the canvas in the
        // x direction
        if ((0 > this.ball.x + this.ball.side) || (this.ball.x > this.WIDTH)) {
            if(player===this.player1)
            {
                this.player2.score++;
                this.serve(1);
            }
            else
            {
                this.player1.score++;
                this.serve(-1);
            }
        }
    }

    checkScore()
    {
        if(this.player1.score > 5)
        {
            this.player1.score = 0;
            this.player2.score = 0;
            this.endGame();
            this.io.to(this.name).emit('chat-message', "Player 1 has won.")
        }
        else if(this.player2.score > 5)
        {
            
            this.player1.score = 0;
            this.player2.score = 0;
            this.endGame();
            this.io.to(this.name).emit('chat-message', "Player 2 has won.")
        }
    }

    update()
    {
        //Update Ball Position
        this.updateBall();

        //Check Game Score

        this.checkScore();
        //Send game info to player2;
        this.player2Socket.emit('game-update', this.player2, this.player1, this.ball);
        //Send game info to player1;
        this.player1Socket.emit('game-update', this.player1, this.player2, this.ball);
    }



}