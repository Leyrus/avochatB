const { Router } = require('express');
const { getUserByLogin, getChats, createUser } = require('../db/mysql');
const { createUser: createUserWithChats } = require('../utils')

const router = Router();

const connection = require('./');

(async() => {
    const con = await connection;
    router.post('/create', async (req, res) => {
        const { name, login, password1, password2 } = req.body;
        try {
            if(password1 !== password2) {
                return res.send({ 
                    ok: false,
                    isAuth: false,
                    errorMessage: 'Different passwords',
                });
            }

            const userId = +Date.now().toString().slice(2, 11);
            const [[user]] = await con.query(getUserByLogin(login));

            if (user) {
                return res.send({ 
                    ok: false,
                    isAuth: false,
                    errorMessage: 'User already exists',
                });
            }

            await con.query(createUser(name, login, password1, userId));
            const [[newUser]] = await con.query(getUserByLogin(login)); 
            const [chats] = await con.query(getChats(newUser.userId)); 
            delete newUser.password,
            res.json({ ok: true, isAuth: true, ...createUserWithChats(newUser, chats) });
        } catch (error) {
            console.error(error)
            res.json({ ok: false, isAuth: false, errorMessage: error.message});
        }
    });

    router.post('/', async (req, res) => {
        const { login, password } = req.body;
        try {
            const [[user]] = await con.query(getUserByLogin(login));
            if (!user) {
                return res.send({ 
                    ok: false,
                    isAuth: false,
                    errorMessage: 'Invalid login or password!',
                });
            }
            if (user.login === login && user.password === password) {
                const [chats] = await con.query(getChats(user.userId));
                delete user.password,
                res.json({ ok: true, isAuth: true, ...createUserWithChats(user, chats)} );
            } else {
                return res.json({ 
                    ok: false,
                    isAuth: false,
                    errorMessage: 'Invalid login or password!',
                });
            }
            
        } catch (error) {
            console.error(error)
            res.json({ ok: false, isAuth: false, errorMessage: error.message});
        }
    });
})()


module.exports = router;
