const dbm = require("../classes/DBM");
const Users  = require("../classes/Users");
const users = new Users();

test ( "I request get the users, they are returned " ,async ()=>{

    const id = "userid";
    dbm.get=jest.fn().mockReturnValue(Promise.resolve([{user:"userid", favourites:""}]))

    const result = await users.get(id);
    expect(dbm.get).toHaveBeenCalledWith("users",{id})
    expect(result).toEqual({user:"userid",favourites:[],admin: false})
})

test ( "I request get the users, the connection is rejected, I get an error " ,async ()=>{
    const id = "userid"

    dbm.get=jest.fn().mockReturnValue(Promise.reject(new Error()))

    let result = {status:null}
    try{
        await users.get(id)
    }
    catch(e){
        result = e;
    }
    expect(result.status).toBe(500)
})
test ( "I request get the users, the id is missing, I get an error " ,async ()=>{

    dbm.get=jest.fn().mockReturnValue(Promise.resolve([{data:["abc"]}]))

    let result = {status:null}
    try{
        await users.get()
    }
    catch(e){
        result = e;
    }
    expect(result.status).toBe(400)
})