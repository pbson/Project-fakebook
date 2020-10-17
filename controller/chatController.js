const Message = require("../models/Message");
const botName = 'ChatCord Bot';
module.exports = (io) => {
    io.on("connection", async (socket) => {
        socket.on('joinChat', ({ userid, conversation }) => {
            socket.join(conversation);
            console.log(socket.id)
            io.to(conversation).emit('roomUsers', {
              room: conversation,
              users: userid
            });
          });
          socket.on('chatMessage', data => {
            message = {}
            message.username = data.userid
            message.text = data.message
            message.time = "aaaa"
            io.to(data.conversation).emit('message',message);
          });
    });

};