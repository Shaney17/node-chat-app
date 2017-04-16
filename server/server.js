const path              = require('path');
const http              = require('http');
const express           = require('express');
const socketIO          = require('socket.io');

const {generateMessage}   = require('./utils/message.js');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app     = express();
var server  = http.createServer(app);
var io      = socketIO(server);
var currentDate = new Date();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log("New user connected");

    socket.emit('newMes', generateMessage('admin', 'Welcome to the chat app'));

    socket.broadcast.emit('newMes', generateMessage('admin', 'New user joined'));

    socket.on('createMes', (newMes, callback) => {
        console.log(`1 new message:`, newMes);
        io.emit('newMes', generateMessage(newMes.from, newMes.text));
        callback();
    });

    socket.on('disconnect', () => {
        console.log('1 user disconected');
    });
});

server.listen(port, () => {
    console.log(`Server is running at ${port}`);
})
