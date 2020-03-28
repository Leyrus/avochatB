
const { Router } = require('express');
const { createChat, deleteChat, addUserToChat, getChats, deleteAllUsersFromChat,
     deleteUserFromChat, getUserByLogin, getChatById } = require('../db/mysql');

const router = Router();

const connection = require('./');

(async() => {
    const con = await connection;
    router.post('/create', async (req, res) => {
        const { name, login } = req.body;

        try {
            const [[user]] = await con.query(getUserByLogin(login));

            const [{insertId}] = await con.query(createChat(name, user.userId));
            await con.query(addUserToChat(user.userId, insertId));
            const [[chat]] = await con.query(getChatById(insertId))
            res.send({ ok: true, chat })
        } catch (error) {
            console.error(error)
            res.json({ ok: false, errorMessage: error.message});
        }
    });

    router.post('/delete', async (req, res) => {
        const { chatId } = req.body;

        try {
            await con.query(deleteAllUsersFromChat(chatId));
            await con.query(deleteChat(chatId));
            res.send({ chatId, ok: true });
        } catch (error) {
            console.error(error)
            res.json({ ok: false, errorMessage: error.message});
        }
    });

    router.post('/user/add', async (req, res) => {
        const { login, chatId } = req.body;

        try {
            const [[user]] = await con.query(getUserByLogin(login));

            if(!user) {
                return res.send({ok: false, errorMessage: 'User not found'});
            }
            const [chats] = await con.query(getChats(user.userId)); 
            const alreadyHasChat = chats.some(chat => chat.chatId === chatId)
            if (alreadyHasChat) {
                return res.send({ok: false, errorMessage: 'User alredy has this chat'});
            }
            await con.query(addUserToChat(user.userId, chatId)); 

            res.send({ ok: true });
            
        } catch (error) {
            console.error(error)
            res.json({ ok: false, errorMessage: error.message});
        }
    });

    router.post('/user/delete', async (req, res) => {
        const { login, chatId } = req.body;

        try {
            const [[user]] = await con.query(getUserByLogin(login));

            if(!user) {
                return res.send({ok: false, errorMessage: 'User not found'});
            }
            await con.query(deleteUserFromChat(user.userId, chatId));

            res.send({ ok: true, chatId });
        } catch (error) {
            console.error(error)
            res.json({ ok: false, errorMessage: error.message});
        }
    });
})()

module.exports = router;
