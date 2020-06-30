const users=[]

//add user
const addUser = ({id, username, room})=>{
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    if(!username|| !room){
        return{
            error:'Username and room are required'
            
        }
    }

    const existinguser = users.find((user)=>{
        return user.room===room && user.username===username

    })

    if(existinguser){
        return{
            error:'Another user in the room with same username'
        }
    }

    const user={id,username,room}
   
    users.push(user)
    return {user}

}

const removeUser=(id)=>{
    const index = users.findIndex((user)=>{
        return user.id===id
        
    })
    if(index!== -1){
        return users.splice(index,1)[0]

    }

}

const getUser=(id)=>{
    return users.find((user)=>user.id===id)

}

const getUserInRoom = (room)=>{
    
    return users.filter((user)=>user.room===room)
}


module.exports={
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}