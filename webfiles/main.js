
//Initialize
var WIDTH = 700;
var HEIGHT = 600;
var UpArrow   = 38;
var DownArrow = 40;

var canvas, ctx, keystate;

var player = {
	x: null,
	y: null,

	width:  20,
	height: 100,

	/**
	 * Update the position depending on pressed keys
	 */
	update: function() {
		if (keystate[UpArrow]) this.y -= 7;
		if (keystate[DownArrow]) this.y += 7;
		// keep the paddle inside of the canvas
		this.y = Math.max(Math.min(this.y, HEIGHT - this.height), 0);
	},

	draw: function() {
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}; 

var opponent = {
	x: null,
	y: null,

	width:  20,
	height: 100,

	/**
	 * Draw the ai paddle to the canvas
	 */
	draw: function() {
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
};


var ball = {
	x:   null,
	y:   null,
	
	side:  20,

	draw: function() {
		ctx.fillRect(this.x, this.y, this.side, this.side);
	}
};


function main() {
	// create, initiate and append game canvas
	canvas = document.createElement("canvas");
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
 	ctx = canvas.getContext("2d");
  	let board = document.getElementById("gameBox");
	board.innerHTML = "";
	board.appendChild(canvas);

	keystate = {};
  
  //Key Event Functions
  document.addEventListener("keydown", (evt) => 
  {
		keystate[evt.keyCode] = true;
	});
  document.addEventListener("keyup", (evt) => 
  {
		delete keystate[evt.keyCode];
	});


  init();
  

	// game loop function
	var loop = function() {
		update();
		draw();

		window.requestAnimationFrame(loop, canvas);
	};
	window.requestAnimationFrame(loop, canvas);
}

/**
 * Initatite game objects and set start positions
 */
function init() {
}

/**
 * Update all game objects
 */
function update() 
{
  player.update();
  socket.emit('game-update', player.y);
}

/**
 * Clear canvas and draw all game objects and net
 */
function draw() {
	ctx.fillRect(0, 0, WIDTH, HEIGHT);

	ctx.save();

	ctx.fillStyle = "#fff";

	player.draw();
  opponent.draw();
  ball.draw();

	ctx.restore();
}



/*
*	Socket.IO segment
*/
var socket = io();
		
$('#msg').submit( () => 
{
    socket.emit('chat-message', $('#textBox').val());
    $('#textBox').val('');
    
    return false;
});

socket.on('chat-message', (msg, id) => 
{
    $('#chatContainer').scrollTop($('#chatContainer')[0].scrollHeight);	
    $('#messages').append($('<li>').text(id + ": " + msg));
});

socket.on('game-initial', (player1, player2, gameball) =>
{
	player.x = player1.x;
	player.y = player1.y;

	opponent.x = player2.x;
	opponent.y = player2.y;

	ball.x = gameball.x;
	ball.y = gameball.y;
	
	main();
});

socket.on('game-update', (player1, player2, gameball) => 
{
	opponent.y = player2.y;

	ball.x = gameball.x;
	ball.y = gameball.y;
})


socket.on('get-games', (roomsArray) => 
{
    $('#rooms-list').text('');
    for(var i = 0; i < roomsArray.length; i++)
        {
            $('#rooms-list').append($('<li>').text(roomsArray[i]));
        }
});

socket.on('join-game', () => 
{})

//Join-Room Popup//
//Popup Display
$('#join-button').click( () => 
{
    socket.emit('get-games');
    $('#rooms').css("display", "block");
});
$('#rooms-list').on("click", "li", (e) => 
{
    socket.emit('join-game', e.target.innerHTML);
});   

//Host-Room Popup//
//Popup Display
$('#host-button').click( () => 
{
    $('#host').css("display", "block");
});
//Form
$('#host-form').submit(() => 
{
    let roomname = $('#room-name-input').val();
    if(roomname.length > 0)
    {
        socket.emit('host-game', roomname);
    }

    closePopups();
    return false;
});

//Generalized Close button for popups under the notion only one popup shows at a time
$('.close').click(() => 
{
    closePopups();
})


function closePopups()
{
    $('.popup').css(
        {
            "display" : "none"
        })
} 

//Other Utilities
socket.on('display-menu', () =>  
{
	let menu = document.getElementById('menu-layout');
	let game = document.getElementById('game-layout');
	menu.style.setProperty("display", "block");
	game.style.setProperty("display", "none");
});

socket.on('display-game', () => 
{
	let menu = document.getElementById('menu-layout');
	let game = document.getElementById('game-layout');
	game.style.setProperty("display", "block");
	menu.style.setProperty("display", "none");
});