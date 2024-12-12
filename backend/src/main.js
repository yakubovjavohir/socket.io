const express = require("express");
const cors = require("cors");
const http = require("http");
const socket = require("socket.io");
const {ResData} = require("./lib/resData")
const {Message} = require("./lib/messages")
const {id} = require("./lib/randomID")

const app = express();

app.use(cors());
app.use(express.json());


const server = http.createServer(app);
const io = socket(server, { cors: { origin: "*" } });

app.get("/", (req, res) => {
    res.json({ message: "nothing is new" });
});
const messages = []
const users = []

io.on("connection", (socket) => {
    console.log("user is connected: " + socket.id);
    users.push(socket.id)
    io.emit("users", users);
    
    socket.on("send",  (data) => {
        if (!data[0]) {
            return socket.emit("error", new ResData(400, "inputni toldiring!"));
            
        }
        const classMessage = {
            serverId : id(),
            userId : socket.id,
            message : data[0]
        }
        console.log(classMessage);
        
        messages.push(classMessage)
        console.log(messages);
        
        socket.broadcast.emit("message_and_userId", classMessage);
    });

    socket.on("disconnect", () => {
        console.log("user is disconnected: " + socket.id);
        const index = users.indexOf(socket.id);
        if (index !== -1) {
            users.splice(index, 1);
        }
        io.emit("users", users);
    });
});

app.get("/messages", async (req, res) => {
    res.json(new ResData(200, "barcha yozishganlar", messages));
});

app.post("/messages-create", (req, res) => {
    const body = req.body;
    if (!body.message) {
        const resdata = new ResData(400, "iltimos message kirting")
        return res.status(resdata.statusCode).json(resdata);
    }

    const newMessage = new Message(body.users, body.message)
    messages.push(newMessage);

    io.emit("message", new ResData(200, "yangi xabar qoshildi", newMessage));
    res.status(201).json(new ResData(201, "yangi xabar qoshildi", newMessage));
});

app.put("/messages/:id", (req, res) => {
    const  id  = req.params.id;
    const  messageBody = req.body;
    console.log(id);
    
    const index = messages.findIndex((msg) => {
        return msg.serverId === Number(id)
    });
    console.log(index);
    
    if (index === -1) {        
        const resdata = new ResData(404, "bunday userda yozishmalar mavjud emas")
        return res.status(resdata.statusCode).json(resdata);
    }
    
    messages[index].message = messageBody.message


    res.json(new ResData(200, "message-tahrirlandi", messages[index]));
});

app.delete("/messages/:id", (req, res) => {
    const  id  = req.params.id;

    const index = messages.findIndex((msg) => msg.serverId === Number(id));

    if (index === -1) {
        return res.status(404).json(new ResData(404, "bunday user mavjud emas ekan"));
    }

    const deletedMessage = messages.splice(index, 1);


    res.json(new ResData(200, "message ochiril tashlandi", deletedMessage[0]));
});

server.listen(7777, () => {
    console.log("Server running at http://localhost:7777");
});
