const mongoose = require("mongoose");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");
const botName = 'ChatCord Bot';
module.exports = (io) => {
    io.on("connection", async (socket) => {
        socket.on('joinChat', async (info) => {
            console.log(info)
            let conversation = await Conversation.findOne({
                "UserList.id": info.userid,
                "UserList.id": info.partnerid,
            });
            if(conversation){
                socket.join(conversation);
            } else {
                let newConversation = new Conversation();
                newConversation.UserList[0]={id:info.userid}
                newConversation.UserList[1]={id:info.partnerid}
                newConversation.LastMessage=Date.now();
                await newConversation.save();
                socket.join(newConversation._id);
            }

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
        socket.on('deleteMessgae',async data=>{
            await Message.findOneAndDelete({_id:data.message_id},(err,docs)=>{
                if(err){
                    socket.emit('deleteMessageError',err)
                } else {
                    socket.emit('deleteMessageSuccess',docs)
                }
            });

        })
        
    });

};