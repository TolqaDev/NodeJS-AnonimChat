var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var chaters = 0;
var port = 3000;

io.on('connection', (socket) => {
    socket.on('login', (response) => {
        console.log('"'+response.name+'" Adlı Kullanıcı Sohbete Katıldı.'); chaters++;
        socket.name = response.name;
        var data = {
            name : response.name,
            online : chaters
        }
        io.emit('login', data);
    });
    socket.on('chat', (response) => {
        console.log('"'+socket.name+'" Adlı Kullanıcı Bir Mesaj Gönderdi: '+response.msg);
        var data = {
            name: socket.name,
            message: response.msg
        };
        socket.broadcast.emit('chat', data);
    });
    socket.on('disconnect', () => {
        console.log('"'+socket.name+'" Adlı Kullanıcı Sohbetten Ayrıldı.'); chaters--;
        var data = {
            name : socket.name,
            online : chaters
        }
        io.emit('disconnected', data);
    });
});

app.get("/", (req,res) => {
    res.sendFile(__dirname + "/index.html");
});

http.listen(port, () => console.log(`Server listening on port: ${port}`));