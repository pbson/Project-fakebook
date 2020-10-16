const users = {}

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("new connection");
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
        socket.on("message", () => {
            io.emit("message", {
                content: "Hello",
            });
        });
        socket.on("joinchat", name => {
            users[socket.id] = name
            socket.broadcast.emit('user-connected', name)
        })
    });
};