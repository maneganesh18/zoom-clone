const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server,{
    debug: true
});
app.use(express.static('public'));

app.set('views', './views');
app.set('view engine','ejs');

app.use('/peerjs',peerServer);

app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`);
})

app.get('/:room',(req,res)=>{
    res.render('room',{ roomid : req.param.room })
})
 
io.on('connection',socket =>{
    socket.on('join-room',(roomid,userID)=>{
        console.log("join rooom");
        socket.join(roomid);
        socket.to(roomid).broadcast.emit('user-connected',userID);
        socket.on('message',message =>{
            io.to(roomid).emit('createmessage',message)
        })
    })
})



server.listen(3030);
