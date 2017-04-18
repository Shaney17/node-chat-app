var socket = io();

function scrollToBottom () {
    //selectors
    var messages            = jQuery('#messages');
    var newMessage          = messages.children('li:last-child');
    //height
    var clientHeight        = messages.prop('clientHeight');
    var scrollTop           = messages.prop('scrollTop');
    var scrollHeight        = messages.prop('scrollHeight');
    var newMessageHeight    = newMessage.innerHeight();
    var lastMessageHeight   = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
};

socket.on('connect', function() {
    var params = jQuery.deparam(window.location.search);
    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = "/";
        } else {
            console.log("connected to the chat room !");
        }
    });
});

socket.on('updateUserList', function (users) {
    var ol = jQuery('<ol></ol>');

    users.forEach((user) => {
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);
});

socket.on('newMes', function(mes) {
    var fommatedTime    = moment(mes.createdAt).format('h:mm a');
    var template        = jQuery('#message-template').html();
    var html            = Mustache.render(template, {
        text: mes.text,
        from: mes.from,
        createdAt: fommatedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();
});

jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();

    const messageBox = jQuery('[name=message]');

    socket.emit('createMes', {
        text: messageBox.val()
    }, function(){
        messageBox.val('');
    });
});

socket.on('disconnect', function() {
    console.log("Disconnected");
});
