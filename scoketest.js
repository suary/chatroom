

const express = require('express');
const app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
app.use('/', express.static(__dirname + '/index'));
server.listen(880);


io.on('connection', function (socket) {
    console.log('acc')
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on('input event', function (data) {
    console.log(454545445454);
    socket.emit('new message',data);
  });
});
var chatcount=0
var chat = io
  .of('/chat')
  .on('connection', function (socket) {
    chatcount=chatcount+1
        if(chatcount==1){
            chat.emit('userinfo',{usertype:'whiteuser'});
        }else if(chatcount==2){
            chat.emit('userinfo',{usertype:'blackuser'});
        }else{
            chat.emit('userinfo',{usertype:'watcher'});
        }
        chat.emit('new message',{name:'当前房间人数',text:chatcount});
        socket.on('input event', function (data) {
            console.log(444);
            chat.emit('new message',data);
        });
        socket.on('new user', function (data) {
            socket.username = data.username;
            chat.emit('new message',{name:'加入新用户',text:data.username});
        });
        socket.on('disconnect', function () { 
            chatcount=chatcount-1
            chat.emit('new message',{name:'当前房间人数',text:chatcount});
            socket.broadcast.emit('user left', {
                username: socket.username
            });
        });
  });
var newscount=0
var news = io
  .of('/news')
  .on('connection', function (socket) {
        newscount=newscount+1;
        if(newscount==1){
            news.emit('userinfo',{usertype:'whiteuser'});
        }else if(newscount==2){
            news.emit('userinfo',{usertype:'blackuser'});
        }else{
            news.emit('userinfo',{usertype:'watcher'});
        }
        socket.on('new user', function (data) {
            socket.username = data.username;
            chat.emit('new message',{name:'加入新用户',text:data.username});
        });
        news.emit('new message',{name:'当前房间人数',text:newscount});
        socket.on('input event', function (data) {
            console.log(444);
            news.emit('new message',data);
        });
        socket.on('disconnect', function () { 
            newscount=newscount-1
            news.emit('new message',{name:'当前房间人数',text:newscount});
            socket.broadcast.emit('new message', {name:'用户离开',text:data.username});
        });
  });