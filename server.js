var net = require('net');
var CommandHandler = require('./commandHandler');
global.sockets = [];
 
/*
 * Cleans the input of carriage return, newline
 */
function cleanInput(data) {
	return data.toString().replace(/(\r\n|\n|\r)/gm,"");
}
 
/*
 * Method executed when data is received from a socket
 */
function receiveData(socket, data, commandHandler) {
    var cleanData = cleanInput(data);
    commandHandler.checkCommand(cleanData);
}
 
/*
 * Method executed when a socket ends
 */
function closeSocket(socket) {
	var i = sockets.indexOf(socket);
	if (i != -1) {
		sockets.splice(i, 1);
    }
    //Remove the player from the online players
    var j = players.findIndex(function(element) {
        if (element.socket == socket) {
            return true;
        }
        return false;
    });
    if (j != -1) {
        players.splice(j, 1);
    }
    console.log(players);
}
 
/*
 * Callback method executed when a new TCP socket is opened.
 */
function newSocket(socket) {
    socket.id = id;
    id++;
    sockets.push(socket);
    socket.write(
        '===============================================\r\n'+
        '|     Welcome to the MUD Serer of Geo         |\r\n'+
        '===============================================\r\n'
    );
    socket.write(
        'If you already have an account please type in (L)ogin to login into your existing account '+
        'or if you are a new player please type in (R)egister to create a new account and start playing.\r\n'
    );
    var commandHandler = new CommandHandler(socket);
	socket.on('data', function(data) {
		receiveData(socket, data, commandHandler);
	})
	socket.on('end', function() {
		closeSocket(socket);
	})
}
 
// Create a new server and provide a callback for when a connection occurs
var id = 0;
var server = net.createServer(newSocket);

// Listen on port 7575
server.listen(7575);