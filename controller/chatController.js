const mongoose = require("mongoose");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");
const botName = 'ChatCord Bot';
module.exports = (io) => {
    io.on("connection", async(socket) => {
        //Joinchat event
        socket.on('joinChat', async(info) => {
            console.log(info)
            let conversation = await Conversation.findOne({
                UserList: { $in: [info.userid, info.partnerid] },
            });
            if (conversation) {
                socket.join(conversation._id);
                io.to(conversation._id).emit('roomUsers', {
                    room: conversation._id,
                    users: 2
                });
            } else {
                let newConversation = new Conversation();
                newConversation.UserList[0] = { id: info.userid }
                newConversation.UserList[1] = { id: info.partnerid }
                newConversation.LastMessage = Date.now();
                await newConversation.save();
                socket.join(newConversation._id);
                io.to(newConversation._id).emit('roomUsers', {
                    room: newConversation._id,
                    users: 2
                });
            }
        });
        //Send event
        socket.on('send', async data => {
            let conversation = await Conversation.findOne({
                UserList: { $in: [data.Sender, data.Receiver] },
            });

            message = {
                Receiver: data.Receiver,
                Sender: data.Sender,
                Content: data.Content,
                Unread: data.Unread,
                IdConversation: conversation._id,
                CreatedAt: Date.now()
            }
            try {
                let newMessage = new Message(message);
                await newMessage.save();
                await Conversation.findOneAndUpdate({ _id: conversation._id }, { $push: { MessageList: newMessage._id.toString() } });
            } catch (error) {
                console.log(error);
            }

            io.to(conversation._id).emit('onmessage', message);
        });
        socket.on('deleteMessgae',async data=>{
          let conversation = await Conversation.findOne({
            "UserList.id": data.userid,
            "UserList.id": data.partnerid,
        });
          if(conversation){
            await Message.findOneAndDelete({_id:data.message_id},(err,docs)=>{
              if(err){
                  io.to(conversation._id).emit('deleteMessageError',err)
              } else {
                  io.to(conversation._id).emit('deleteMessageSuccess',docs)
              }
          })
          }
        
        })
        //Error handling event

        socket.on('reconnect', (attemptNumber) => {
            console.log(attemptNumber);
        });
        socket.on('reconnecting', (attemptNumber) => {
            console.log(attemptNumber);
        });
        socket.on('reconnect_error', (error) => {
            console.log(error);
        });
        socket.on('reconnect_failed', () => {
            console.log("Reconnect failed");
        });
        socket.on('connect_error', (error) => {
            console.log(error);
        });
        socket.on('connect_timeout', (timeout) => {
            console.log(timeout);
        });
        socket.on('error', (error) => {
            console.log(error);
        });
    });

}