var net = require('net');
require('./commandHandler.js')

var connections = [];
 
function newConnection(socket) {
    connections.push(socket);
    socket.write(
                '===============================================\n'+
                '|     Welcome to the MUD Serer of Geo         |\n'+
                '===============================================\n'
            );
    login(socket);
}

function login(socket) {
    socket.write(
        'If you already have an account please type in (L)ogin to login into your existing account.'+
        'If you are a new please please type in (R)egister to create a new account and start playing.'
    );
    socket.on('data', function(data) {
        if (data === 'l' || data == 'L' || data == 'Login' || data == 'login') {
            socket.write('Successfully logged in');
        }
        else if (data == 'r' || data == 'R' || data == 'Register' || data == 'register') {
            socket.write('Successfully registered a new account');
        } else {
            socket.write(data);
        }
    })
}

var server = net.createServer(newConnection).listen(7575);