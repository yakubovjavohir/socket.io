const socket = io("http://localhost:7777");
const select = document.getElementById("select");
const ul = document.getElementById("ul");
const input = document.getElementById("input");
const btn = document.getElementById("btn");
const textarea = document.getElementById("textarea");
const create = document.getElementById("create")
const deleteM = document.getElementById("delete")
const get = document.getElementById("get")
const patch = document.getElementById("patch")




socket.on("users", (onlineUsers)=>{
    select.innerHTML = ""
    onlineUsers.forEach(element => {
        const option = document.createElement("option")
        option.innerHTML = element
        option.value = element
        select.appendChild(option)
    });
})

btn.addEventListener("click", ()=>{
    const message = input.value
    const selectValue = select.value
    input.value = ""
    socket.emit("send", [message, selectValue])
})
socket.on("message_and_userId", (data)=>{
    textarea.innerHTML = ""
    const li = document.createElement("li")
    li.innerHTML = data.message
    ul.appendChild(li)
    textarea.innerHTML = `user : ${data.userId} || message : ${data.message}`
})


socket.on("error", (error)=>{
    console.error(error)
    alert(error.message)
})

socket.on("message", (data)=>{
    const message = data.data.message
    const user = data.data.user
    const li = document.createElement("li")
    li.innerHTML = `${user}  :  ${message}`
    ul.appendChild(li)

    textarea.innerHTML = `user :   ${user} ||  message :    ${message}`
})


socket.on("messageUpdated", (data)=>{
    const li = document.createElement("li")
    li.innerHTML = `...tahrirlangan : ${data.data.message}`
    ul.appendChild(li)
})

socket.on("messageDeleted", (data)=>{
    const deleteLi = ul.forEach((el)=>{
        return el === data.data.message
    })

    delete deleteLi
})