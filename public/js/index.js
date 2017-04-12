var socket = io();

socket.on('connect', function() {
    console.log("Connected to the server");
});

socket.on('newMes', function(mes) {
    console.log(`1 new message:`, mes);
});

socket.on('disconnect', function() {
    console.log("Disconnected");
});
