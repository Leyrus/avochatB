
const { Router } = require('express');
const { createChat, deleteChat, addUserToChat, getChats,
     deleteUserFromChat } = require('../db/mysql');

const router = Router();

const con = require('./');

router.post('/create', (req, res) => {
    const { name, userId } = req.body;

    con.query(createChat(name, userId), (err) => {
        if (err) {
            throw err;
        }

        res.send({ name, userId, success: true });
    });
});

router.post('/delete', (req, res) => {
    const { chatId } = req.body;

    con.query(deleteChat(chatId), (err) => {
        if (err) {
            throw err;
        }

        res.send({ chatId, success: true });
    });
});

router.post('/user/add', (req, res) => {
    const { userId, chatId } = req.body;

    con.query(addUserToChat(userId, chatId), (err) => {
        if (err) {
            throw err;
        }
        con.query(getChats(userId), (err, chatResult) => {
            if (err) {
                throw err;
            }
            res.send({ success: true, chats: chatResult });
        });
    });
});

router.post('/user/delete', (req, res) => {
    const { userId, chatId } = req.body;

    con.query(deleteUserFromChat(userId, chatId), (err) => {
        if (err) {
            throw err;
        }

        con.query(getChats(userId), (err, chatResult) => {
            if (err) {
                throw err;
            }
            res.send({ success: true, chats: chatResult });
        });
    });
});

module.exports = router;
