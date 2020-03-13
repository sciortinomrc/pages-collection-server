const knex = require("knex")

const db = knex({
    client: 'mysql2',
    connection: {
        connectionString : process.env.DATABASE_URL,
        ssl: true
    }
})

class DBM{
    async get(){
        const req = await knex.select("*").from("pages").orderBy("favourite","desc")
        return req;
    }
}

module.exports = DBM