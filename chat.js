

const express = require('express');
const app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var c = require('child_process');

app.use('/', express.static(__dirname + '/index'));
server.listen(880);

c.exec('start http://127.0.0.1:880');
io.on('connection', function (socket) {
    console.log('acc')
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
    socket.on('input event', function (data) {
        console.log(454545445454);
        socket.emit('new message', data);
    });
});
var roomlist = [{ name: 'chat', count: 0 }, { name: 'news', count: 0 }]

for (var i = 0; i < roomlist.length; i++) {
    console.log(roomlist[i])
    roomlist[i].callback = io
        .of('/' + roomlist[i].name)
        .on('connection', function (socket) {
            console.log(this)
            var _this=this
            if(_this.menberlist){} else { _this.menberlist=[]  }
            if (this.menbercount) { this.menbercount++ } else { this.menbercount = 1 }

            if (this.menbercount == 1) {
                this.emit('userinfo', { usertype: 'whiteuser' });
            } else if (this.menbercount == 2) {
                this.emit('userinfo', { usertype: 'blackuser' });
            } else {
                this.emit('userinfo', { usertype: 'watcher' });
            }
            this.emit('new talker', { name: '当前房间人数', text: this.menbercount });
            socket.on('input event', function (data) {
                console.log(444);
                socket.broadcast.emit('new message', data);
                socket.emit('my message', data);
            });
            socket.on('new user', function (data) {
                socket.username = data.username;
                _this.menberlist.push(socket.username)
                console.log(_this.menberlist)
                this.emit('new join', { name: '加入新用户', text: data.username });
            });
            socket.on('disconnect', function () {
                this.menbercount = this.menbercount - 1
                this.emit('new talker', { name: '当前房间人数', text: this.menbercount });
                socket.broadcast.emit('user left', {
                    username: socket.username
                });
            });
        });
}
console.log(roomlist)

/* var newscount=0
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
  }); */
