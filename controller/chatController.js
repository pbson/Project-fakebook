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
            
            socket.join(conversation);

          });
        socket.on('chatMessage', data => {
            message = {}
            message.username = data.userid
            message.text = data.message
            message.time = "aaaa"
            io.to(data.conversation).emit('message',message);
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