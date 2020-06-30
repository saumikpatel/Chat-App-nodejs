const http = require('http')
const socketio = require('socket.io')
const express = require('express')
const path = require('path')
const Filter= require('bad-words')
const {addUser, removeUser, getUser, getUserInRoom}= require('./utils/users')


const app = express()
const server = http.createServer(app)
const io = socketio(server)
const {generateMessage, generateLocationMessage}=require('./utils/messages')
const port = process.env.Port ||3000
const publicDirectoryPath = path.join(__dirname,'../public')



app.use(express.static(publicDirectoryPath))


io.on('connection',(socket)=>{
    console.log('new web socket connection')
    


    socket.on('join',({username, room},callback)=>{
        const {error, user}=addUser({
            id:socket.id,
            username,
            room
        })
        if(error){
            return callback(error) 
        }

        socket.join(user.room)
        //console.log(user)
        
        socket.emit('message',generateMessage('Admin','Welcome'))
        socket.broadcast.to(user.room).emit('message',generateMessage('Admin',user.username+' has joined the room'))
        
        console.log()
        io.to(user.room).emit('roomData',{
            room: user.room,
            users:getUserInRoom(user.room)
            
        })
        callback()


        
    })

    socket.on('sendMessage', (message,callback)=>{
        const user= getUser(socket.id)
        const filter=new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed')
        }
        io.to(user.room).emit('message',generateMessage(user.username,message))
        callback() 
    })

   


    socket.on('sendLocation', (coords, callback)=>{
        const user= getUser(socket.id)
        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()

    })

    socket.on('disconnect',()=>{
        const user= removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message',generateMessage('Admin',user.username+' has left'))
            io.to(user.room).emit('roomData',{
                room: user.room,
                users:getUserInRoom(user.room)
            })
        }
        
    })
  

})




server.listen(port,()=>{
    console.log('server is up on port'+port)
})