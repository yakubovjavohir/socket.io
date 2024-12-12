const {id} = require("./randomID")
class Message {
    constructor(user, message) {
        this.serverId = id()
        this.user = user
        this.message = message
    }
}
module.exports = {Message}