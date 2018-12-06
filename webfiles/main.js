var socket = io();

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


//Settings Popup//
//Popup Display
$('#settings-button').click(() => 
{
    $('#settings').css("display", "block");
})
//Form
$('#settings-form').submit(() => 
{
    let username = $('#username-input').val();
    if(username.length > 0)
    {
        socket.emit('set-username', username);
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
