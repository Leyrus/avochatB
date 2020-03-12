
const { Router } = require('express');
const { createChat, deleteChat, addUserToChat, getChats,
     deleteUserFromChat, getUserByLogin } = require('../db/mysql');

const router = Router();

const con = require('./');

router.post('/create', (req, res) => {
    const { name, userId } = req.body;

    con.query(createChat(name, userId), (err) => {
        if (err) {
            throw err;
        }

        res.send({ name, userId, ok: true });
    });
});

router.post('/delete', (req, res) => {
    const { chatId } = req.body;

    con.query(deleteChat(chatId), (err) => {
        if (err) {
            throw err;
        }

        res.send({ chatId, ok: true });
    });
});

router.post('/user/add', (req, res) => {
    const { login, chatId } = req.body;

    con.query(getUserByLogin(login), (err, [user]) => {
        if(!user) {
            return res.send({ok: false, errorMessage: 'User not found'});
        }

        con.query(getChats(user.userId), (err, chatResult) => {
            if (err) {
                throw err;
            }
            const alreadyHasChat = chatResult.some(chat => chat.chatId === chatId)
            if (alreadyHasChat) {
                return res.send({ok: false, errorMessage: 'User alredy has this chat'});
            }
            con.query(addUserToChat(user.userId, chatId), (err) => {
                if (err) {
                    throw err;
                }
                con.query(getChats(user.userId), (err, newChats) => {
                    if (err) {
                        throw err;
                    }
                    res.send({ ok: true, chat: newChats.filter(chat => chat.chatId === chatId)[0] });
                });
            });
        });
    });

});

router.post('/user/delete', (req, res) => {
    const { login, chatId } = req.body;

    con.query(getUserByLogin(login), (err, [user]) => {
        if (err) {
            throw err;
        }
        if(!user) {
            return res.send({ok: false, errorMessage: 'User not found'});
        }
        con.query(deleteUserFromChat(user.userId, chatId), (err) => {
            if (err) {
                throw err;
            }

            con.query(getChats(user.userId), (err, chatResult) => {
                if (err) {
                    throw err;
                }
                res.send({ ok: true });
            });
        });
    })
});

module.exports = router;
