
function setList(data) {
   let liste = $("#waitingListItems");

   if (data.items.length > 5) {
       $("#waitingListDiv").css("overflow-y", "scroll");
       $("#waitingListDiv").css("height", "300");
   }

   liste.empty();

   for (let i = 0; i < data.items.length; i++) {
       if (i == 0) {
           liste.append("<li class='list-group-item active'><span class='badge badge-light badge-pill'>1</span>" + data.items[i].name + "</li>");
       } else {
           liste.append("<li class='list-group-item'><span class='badge badge-primary badge-pill'>" + (i+1) + "</span>" + data.items[i].name + "</li>");
       }
   }
}

$(document).ready(function() {

    new QRCode(document.getElementById("qrcode"), "http://myurl.de");

    setList({items : [{name : 'hallo'}, {name : 'welt'}, {name : 'hallo'}]});

    // open connection
    let socket = io();
    socket.on('connect', () => {
        console.log("Connected to server.");


        socket.emit('registerDevice', localStorage.getItem('deviceID'), (newUid) => {
            localStorage.setItem('deviceID', newUid);
        });


    });

    socket.on('disconnect', () => {
        console.log("Disconnected from server.");
    });

    socket.on('command', (value, approveCommand) => {
        // TODO: React to the command from the server (see command catalog)
        console.log(value);
        // Callback at the end. This way, the server knows if and when the client has handeled the command.
        approveCommand();
    });

});
