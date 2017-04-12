const path      = require('path');
const http      = require('http');
const express   = require('express');
const socketIO  = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app     = express();
var server  = http.createServer(app);
var io      = socketIO(server);
var currentDate = new Date();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log("New user connected");

    socket.emit('newMes', {
        from: 'Admin',
        text: "Welcome to the chat room"
    });

    socket.broadcast.emit('newMes', {
        from: 'admin',
        text: '1 new connected'
    });

    socket.on('createMes', (newMes) => {
        console.log(`1 new message:`, newMes);
        io.emit('newMes', {
            from: newMes.from,
            text: newMes.text
        });

        // socket.broadcast.emit('newMes', {
        //     from: newMes.from,
        //     text: newMes.text,
        //     createdAt: new Date().getTime()
        // });
    });

    socket.on('disconnect', () => {
        console.log('1 user disconected');
    });
});

server.listen(port, () => {
    console.log(`Server is running at ${port}`);
})
