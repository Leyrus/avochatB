const { get } = require('lodash');
const createMessage = (message, user) => ({
    messageId: message.messageId,
    content: message.content,
    dateCreate: message.dateCreate,
    dateChange: message.dateChange,
    author: {
        userId: message.userId,
        name: get(user, 'name', 'Deleted user'),
        login:  get(user, 'login', 'Deleted user'),
    },
})
const createUser = (user, chats) => ({
    ...user,
    chats,
})

module.exports = {
    createMessage,
    createUser,
}