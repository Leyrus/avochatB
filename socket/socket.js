const Server = require('socket.io');

const server = new Server({ port: 3100 });

server.on('connection', socket => {
    socket.on('chat', message => {
        server.emit('chat', message);
    });
   server.emit('ready', 'welcome');
});
