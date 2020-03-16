const dbm = require("../classes/DBM");
const Users  = require("../classes/Users");
const users = new Users();

test ( "I request all the users, they are returned " ,async ()=>{

    dbm.all=jest.fn().mockReturnValue(Promise.resolve({data:["abc"]}))

    const result = await users.all()
    expect(dbm.all).toHaveBeenCalledWith("users")
    expect(result).toEqual({data:["abc"]})
})

test ( "I request all the users, the connection is rejected, I get an error " ,async ()=>{

    dbm.all=jest.fn().mockReturnValue(Promise.reject(new Error()))

    let result = {status:null}
    try{
        await users.all()
    }
    catch(e){
        result = e;
    }
    expect(result.status).toBe(500)
})