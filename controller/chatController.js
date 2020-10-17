const Message = require("../models/Message");

module.exports = (io) => {
    io.on("connection", async (client) => {
        console.log("new connection"+ client.id);
        // client.emit("joinchat",
        //     messageAttributes = {
        //         Content: data.Content,
        //         Sender: data.Sender,
        //     }        
        // )
        client.on("disconnect", () => {
            console.log("user disconnected");
        });
        //Listen to event message
        client.on("message",async data => {
            let messageAttributes = {
                Content: data.Content,
                Sender: data.Sender,
            };
            //save sent message to database
            try {
                m = new Message(messageAttributes);
                await m.save();
            } catch (error) {
                console.log(error);
            }
            //forward message to users
            io.emit("message", 
                messageAttributes
            );
        });

        //GET most recent messages
        let currentMessage = await Message.find({}).sort({ createdAt: -1 }).limit(10)
        client.emit("load all messages", currentMessage.reverse())
    });
};