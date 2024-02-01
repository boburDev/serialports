const {Server} = require('socket.io');
const io = new Server();

var Socket = {
    emit: function (event, data) {
        // console.log(event, data);
        io.sockets.emit(event, data);
    },
    on: function (event) {
        io.sockets.on('data', data => {
            console.log(data)
        })
    },
};

io.on("connection", function (socket) {
    console.log("connected")
    // socket.on('data', data => console.log(data))
    socket.on('disconnect', () => {
        console.log('disconnected');
    });
});





exports.Socket = Socket;
exports.io = io;
