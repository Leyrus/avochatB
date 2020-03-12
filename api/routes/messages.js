const { Router } = require('express');
const { getMessages, deleteMessage, sendMessage,
    editMessage, getUsersByChatId, getMessageById, getUserById } = require('../db/mysql');

const router = Router();

const con = require('./');

router.post('/get', (req, res) => {

    const a = con.query(getMessages(req.body.chatId))

    con.query(getMessages(req.body.chatId), (err, messages) => {
        con.query(getUsersByChatId(req.body.chatId), (err, users) => {
            if (err) {
                throw err;
            }
            const fullMessages = messages.map(message => {
                const user = users.find(user => user.user_id === message.userId);

                return ({
                    messageId: message.messageId,
                    content: message.content,
                    dateCreate: message.dateCreate,
                    dateChange: message.dateChange,
                    author: {
                        userId: message.userId,
                        name: user.name,
                        login: user.login,
                    },
                });
            });

            res.json({ messages: fullMessages });
        });
    });
});

router.post('/delete', (req, res) => {
    const { messageId } = req.body;

    con.query(deleteMessage(messageId), err => {
            if (err) {
                throw err;
            }
            con.query(getMessages(), (err, messages) => {
                if (err) {
                    throw err;
                }
                res.json({ messages });
            });
    });
});

router.post('/send', (req, res) => {
        const { userId, chatId, message } = req.body;

        con.query(sendMessage(userId, chatId, message), err => {
            if (err) {
                throw err;
            }
            con.query(getMessages(), (err, messages) => {
                if (err) {
                    throw err;
                }
                res.json({ messages });
            });
        });
});

router.post('/edit', (req, res) => {
        const { messageId, content } = req.body;

        con.query(editMessage(messageId, content, new Date().getTime()), err => {
            if (err) {
                throw err;
            }
            con.query(getMessageById(messageId), (err, [message]) => {
                if (err) {
                    throw err;
                }
                con.query(getUserById(message.userId), (err, [user]) => {
                    if (err) {
                        throw err;
                    }
                    const newMessage = {
                        messageId: message.messageId,
                        content: message.content,
                        dateCreate: message.dateCreate,
                        dateChange: message.dateChange,
                        author: {
                            userId: message.userId,
                            name: user.name,
                            login: user.login,
                        },
                    };

                    res.send({ message: newMessage });
                });
            });
        });
});

module.exports = router;
