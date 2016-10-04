module.exports = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    db: process.env.DB_NAME
};


//old koa way:
// module.exports = {
//     rethinkdb: {
//         host: "db.incentify.life",
//         port: 28015,
//         authKey: "",
//         db: "rethinkdb_ex"
//     },
//     express: {
//         port: process.env.PORT || 3000
//     }
// }