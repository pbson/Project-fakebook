const mongoose = require("mongoose");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");
const botName = 'ChatCord Bot';
const request = require('request');

module.exports = (io) => {
    io.on("connection", async(socket) => {
        //Joinchat event
        socket.on('joinChat', async(info) => {
            let conversation = await Conversation.findOne({
                UserList: { $all: [info.userid, info.partnerid] },
            });
            if (conversation) {
                socket.join(conversation._id);
            } else {
                let newConversation = new Conversation();
                newConversation.UserList.push(info.userid);
                newConversation.UserList.push(info.partnerid);
                newConversation.LastMessage = Date.now();
                await newConversation.save();
                socket.join(newConversation._id);
            }
        });
        socket.on('joinChat2', async(info) => {
            console.log('abc');
            console.log(info)
            socket.join(info.conversationId)
            // console.log(socket.id)
            // let conversation = await Conversation.findOne({
            //     UserList: { $all: [info.userid, info.partnerid] },
            // });
            // if (conversation) {
            //     console.log(conversartion._id)
            //     socket.join(conversation._id);
            // } else {
            //     let newConversation = new Conversation();
            //     newConversation.UserList.push(info.userid);
            //     newConversation.UserList.push(info.partnerid);
            //     newConversation.LastMessage = Date.now();
            //     await newConversation.save();
            //     socket.join(newConversation._id);
            // }
        });
        socket.on('send2', async data => {
            let partnerId = data.partnerId
            let token = data.token
            let Content = data.Content
            let isUnread = data.isUnread
            let conversationId = data.conversationId

            request({
                url:`http://localhost:3000/it4788/chatsocket/set_message?receiverId=${partnerId}&token=${token}&content=${Content}&isUnread=${isUnread}&conversationId=${conversationId}`,
                method: "POST",
                json: true,
            }, async function (error, response){
                console.log(response.body.data);
                console.log(conversationId);
                io.to(conversationId).emit('onmessage', response.body.data);
            });
        });
        //Send event
        socket.on('send', async data => {
            let partnerId = data.partnerId
            let token = data.token
            let Content = data.Content
            let isUnread = data.isUnread
            let conversationId = data.conversationId

            request({
                url:`http://localhost:3000/it4788/chatsocket/set_message?receiverId=${partnerId}&token=${token}&content=${Content}&isUnread=${isUnread}&conversationId=${conversationId}`,
                method: "POST",
                json: true,
            }, async function (error, response){
                let conversation = await Conversation.findOne({
                    UserList: { $all: [response.body.data.Sender, response.body.data.Receiver] },
                })

                io.to(conversation._id).emit('onmessage', response.body);
            });

        });
        socket.on('deleteMessgae',async data=>{
          let conversation = await Conversation.findOne({UserList: { $all: [data.userid, data.partnerid] }});
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