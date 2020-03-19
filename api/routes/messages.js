const { Router } = require('express');
const { getMessages, deleteMessage, sendMessage, getNewMessage,
    editMessage, getUsersByChatId, getMessageById, getUserById } = require('../db/mysql');

const { createMessage } = require('../utils');

const router = Router();

const connection = require('./');

(async() => {
    const con = await connection;
    router.post('/get', async (req, res) => {
        const { chatId } = req.body;
        try {
            const [messages] = await con.query(getMessages(chatId))
            const [users] = await con.query(getUsersByChatId(chatId));
            const fullMessages = messages.map(message => {
                const user = users.find(user => user.user_id === message.userId);
                return createMessage(message, user)
            });
            res.json({ ok: true, messages: fullMessages });
            
        } catch (error) {
            console.error(error)
            res.json({ ok: false, errorMessage: error.message});
        }
    });

    router.post('/delete', async (req, res) => {
        const { messageId } = req.body;

        try {
            await con.query(deleteMessage(messageId))

            res.json({ ok: true });
        } catch (error) {
            res.json({ ok: false, errorMessage: error.message});
        }
    });

    router.post('/send', async (req, res) => {
        const { userId, chatId, message } = req.body;

        try {
            const time = Date.now();
            await con.query(sendMessage(userId, chatId, message, time));
            const [newMessage] = await con.query(getNewMessage(userId, chatId, time));

            res.json({ ok: true, message: newMessage })
        } catch (error) {
            res.json({ ok: false, errorMessage: error.message});
        }
    });

    router.post('/edit', async(req, res) => {
        const { messageId, content } = req.body;

        try {
            await con.query(editMessage(messageId, content, Date.now()));
            const [[message]] = await con.query(getMessageById(messageId));
            const [[user]] = await con.query(getUserById(message.userId));
            res.send({ ok: true, message: createMessage(message, user) });
        } catch (error) {
            res.json({ ok: false, errorMessage: error.message});
        }
    });
})()

module.exports = router;
