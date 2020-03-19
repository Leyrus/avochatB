
const { Router } = require('express');
const { createChat, deleteChat, addUserToChat, getChats,
     deleteUserFromChat, getUserByLogin } = require('../db/mysql');

const router = Router();

const connection = require('./');

(async() => {
    const con = await connection;
    router.post('/create', async (req, res) => {
        const { name, userId } = req.body;

        try {
            await con.query(createChat(name, userId));
            res.send({ name, userId, ok: true });
        } catch (error) {
            console.error(error)
            res.json({ ok: false, errorMessage: error.message});
        }
    });

    router.post('/delete', async (req, res) => {
        const { chatId } = req.body;

        try {
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
