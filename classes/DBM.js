const knex = require("knex")({
    client: 'mysql2',
    connection: {
        host: '127.0.0.1',
        user: process.env.PAGESIFY_DB_USER,
        password: `${process.env.PAGESIFY_DB_PASS}`,
        database: 'pagesify'
    }
})

class DBM{
    async all(db){
        try{
            if(db=="pages"){
                const req = await knex.select("*").from(db).orderBy("favourites","desc")
                return req;
            }
            const req = await knex.select("*").from(db)
            return req;
        }
        catch(e){
            throw e
        }
    }
    async create(db,info){
        try{
           return await knex(db).insert(info)
        }
        catch(e){
            throw e
        }
    }
    async delete(id){
        try{
            await knex("pages").where({id}).del()
            return "Record Deleted"
        }
        catch(e){
            throw  e
        }
    }
    async update(query,pageInfo){
        try{
            await knex("pages").where(query).update({...pageInfo});
            return "Record Updated";
        }
        catch(e){
            throw e
        }
    }
    async get(db,field){
        return await knex.select("*").from(db).where(field)
    }
}


module.exports = new DBM();