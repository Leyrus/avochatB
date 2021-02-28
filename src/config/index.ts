const config = {
    env: process.env.NODE_ENV || '',
    apiKey: process.env.MAILGUN_API_KEY || '',
    apiDomain: process.env.MAILGUN_API_DOMAIN || '',
    jsCodeMail: process.env.JS_CODE_MAIL || '',
    jwtSecret: process.env.JWT_SECRET || '',
    jwtTime: process.env.JWT_TIME || '15m',
    feAppUrl: process.env.FE_APP_URL || 'http://localhost:3000',
    publicKeyPath: process.env.PUBLIC_KEY_PATH || '',
    privateKeyPath: process.env.PRIVATE_KEY_PATH || '',
    enableMain: process.env.ENABLE_MAIL || 'false',
    apiVersion: process.env.API_VERSION || 0,
};

const isDev = config.env === 'development';
const isProd = config.env === 'production';

export {
    isDev,
    isProd,
    config,
};
