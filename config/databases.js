require('dotenv').load();
// gotta keep those db credentials secret
module.exports = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    db: process.env.DB_NAME,
    authKey: process.env.AUTH_KEY
};