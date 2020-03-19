const createMessage = (message, user) => ({
    messageId: message.messageId,
    content: message.content,
    dateCreate: message.dateCreate,
    dateChange: message.dateChange,
    author: {
        userId: message.userId,
        name: user.name,
        login: user.login,
    },
})
const createUser = (user, chats) => ({
    ...user,
    isAuth: true,
    chats,
})

module.exports = {
    createMessage,
    createUser,
}