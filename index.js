const express = require('express');

const app = express();

// app.use(function(req, res, next) {
//         res.header("Access-Control-Allow-Origin", "*");
//         res.header("Access-Control-Allow-Headers", "X-Requested-With");
//         res.header("Access-Control-Allow-Headers", "Content-Type");
//         res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
//         next();
// });

const server = require('http').Server(app);

const io = require('socket.io')(server, {
    cors: {origin: "*"}
});

const arrUserInfo = [];

io.on('connection', socket => {
    // Bat su kien dang ky
    socket.on('NGUOI_DUNG_DANG_KY', user => {
        const isExist = arrUserInfo.some(e => e.ten === user.ten); // Kiem tra nguoi dung ton tai chua truoc khi cho dang ky
        socket.peerId = user.peerId;
        if (isExist) return socket.emit('DANG_KY_THAT_BAT');
        arrUserInfo.push(user);
        socket.emit('DANH_SACH_ONLINE', arrUserInfo);
        socket.broadcast.emit('CO_NGUOI_DUNG_MOI', user);
    });

    // Bat su kien ngat ket noi
    socket.on('disconnect', () => {
        const index = arrUserInfo.findIndex(user => user.peerId === socket.peerId);
        arrUserInfo.splice(index, 1);
        io.emit('AI_DO_NGAT_KET_NOI', socket.peerId);
    });
});