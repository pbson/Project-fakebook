const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
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
          socket.on('send', async data => {
            let conversation = await Conversation.findById({_id:data.IdConversation });
            let receiver = conversation.MessageList.find(element => element !== data.Sender)

            message = {
              Receiver: receiver,
              Sender: data.Sender,
              Content: data.Content,
              Unread: data.Unread,
              IdConversation: data.IdConversation,
              CreatedAt: Date.now()
            }

            try {
              let newMessage = new Message(message);
              await newMessage.save();
            } catch (error) {
              console.log(error);
            }
            
            io.to(data.IdConversation).emit('onmessage',message);
          });
    });

};