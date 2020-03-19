/* user */

const createUser = (name, login, password, userId) => `INSERT INTO 
    users(name, login, password, user_id) 
    VALUES ('${name}', '${login}', '${password}', ${userId})`;

const getUserByLogin = login => `SELECT 
    users.name,
    users.login,
    users.password,
    users.user_id as userId
FROM users WHERE login='${login}'`;

const getUserById = userId => `SELECT 
    users.name,
    users.login,
    users.password,
    users.user_id as userId
FROM users WHERE user_id ='${userId}'`;

/* messages */
const sendMessage = (userId, chatId, message, time) => `
    INSERT INTO messages(chat_id, user_id, content, date_create) 
    VALUES('${chatId}', '${userId}', '${message}', '${time}');`;

const getMessages = (chatId) => `SELECT
    message_id AS messageId, user_id as userId, content, date_create as dateCreate, date_change as dateChange
    FROM messages WHERE  messages.chat_id = '${chatId}'`;

const getMessageById = (messageId) => `SELECT
    message_id AS messageId, user_id as userId, content, date_create as dateCreate, date_change as dateChange
    FROM messages WHERE  messages.message_id = '${messageId}'`;

const getNewMessage = (userId, chatId, time) => `SELECT
    message_id AS messageId, user_id as userId, content, date_create as dateCreate, date_change as dateChange
    FROM messages WHERE chat_id = '${chatId}' AND user_id = '${userId}' AND date_create = ${time}
`

const deleteMessage = (messageId) => `DELETE from messages WHERE message_id = ${messageId}`;

const editMessage = (messageId, content, time) => `UPDATE messages
    SET content='${content}', date_change=${time}
    WHERE message_id=${messageId}`;

/* chat */

const getChats = (userId) => `SELECT chat.chat_id as chatId, chat.name FROM \`party\` JOIN \`chat\` 
    ON chat.chat_id = party.chat_id AND party.user_id = ${userId};`;

const createChat = (name, userId) => `INSERT INTO \`chat\`(\`name\`, \`user_id\`) 
    VALUES ('${name}', ${userId});`;

const deleteChat = (chatId) => `DELETE FROM chat WHERE chat_id = '${chatId}';`;

/* party */

const getUsersByChatId = (chatId) => `SELECT *
from party JOIN users ON party.user_id = users.user_id AND party.chat_id = '${chatId}'`;

const addUserToChat = (userId, chatId) => `INSERT INTO party(user_id, chat_id) 
    VALUES('${userId}', '${chatId}')`;

const deleteUserFromChat = (userId, chatId) => `DELETE FRoM party 
    WHERE user_id = '${userId}' AND chat_id = '${chatId}'`;

module.exports = {
    createUser,
    getUserByLogin,
    getUserById,
    sendMessage,
    deleteMessage,
    editMessage,
    getNewMessage,
    getMessages,
    getMessageById,
    addUserToChat,
    deleteUserFromChat,
    createChat,
    deleteChat,
    getChats,
    getUsersByChatId,
};

