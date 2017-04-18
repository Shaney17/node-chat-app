const path              = require('path');
const http              = require('http');
const express           = require('express');
const socketIO          = require('socket.io');

const {generateMessage}     = require('./utils/message.js');
const {isRealString}        = require('./utils/validation.js');
const {Users}               = require('./utils/users.js');

const publicPath    = path.join(__dirname, '../public');
const port          = process.env.PORT || 3000;

var app         = express();
var server      = http.createServer(app);
var io          = socketIO(server);
var currentDate = new Date();
var users       = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log("New user connected");

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback("require name and room name");
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMes', generateMessage('admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMes', generateMessage('admin', `${params.name} joined`));

        callback();
    });

    socket.on('createMes', (newMes, callback) => {
        var user = users.getUser(socket.id);

        if(user && isRealString(newMes.text)) {
            io.to(user.room).emit('newMes', generateMessage(user.name, newMes.text));
        }

        callback();
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMes', generateMessage('Admin', `${user.name} has left`));
        }
    });
});

server.listen(port, () => {
    console.log(`Server is running at ${port}`);
})
