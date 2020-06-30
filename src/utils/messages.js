const generateMessage = (username,text)=>{
    return{
        username,
        text,
        createdAt:new Date().getTime()
    }
}

const generateLocationMessage=(username,url)=>{
    return{
        url,
        createdAt:new Date().getTime(),
        username
    }
}

module.exports={
    generateMessage,
    generateLocationMessage
}