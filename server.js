const express = require('express');
const bodyParser= require ('body-parser');
const cors= require('cors');
const knex=require('knex')({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true
  }
});
const app=express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



//get visits
app.get('/visits', (req,res)=>{
	knex.select("*").from("visits")
	.then(resp=>res.send(resp))
})


//get pages DB
app.get('/', (req,res)=>{
	knex.select('*').from('database')
	.then(db=>res.send({db}))
	.then(res=>{
		//visits counter
		let date=new Date().toLocaleDateString("en-GB");
		date=date.replace(/[/]/g,"")
		knex("visits").where({date: date}).select("*")
		.then(response=>{
			console.log(response)
			if(response.length){
				knex('visits').where({date:date}).increment('visits',1).returning('*')
				.then(incr=>{})
			}
			else{
				knex("visits").returning("*").insert({date: date, visits: 0})
				.then(sh=>{})
			}
		})
		//end visits counter
	})
})
//update pages DB
app.post('/newpage',(req,res)=>{
	const {id, name, url, picture,  category, country, createdby} = req.body;
	console.log(req.body)
	knex('database').where({id: id})
	.then(response=>{
		console.log(response)
		if(response.length){
			res.status(400).send("The page already exists")
		}
		else{
			knex('database').returning('*').insert({id: id, name: name, url: url, picture: picture, category: category, country: country, favourite:0, createdby})
			.then(response=>{
				knex.select('*').from('database')
				.then(db=>{
					setTimeout(()=>{
						res.send({db,message:"Your page has been added to our database"})
					},500)
				})
			})
		}	
	})
})

app.post('/login',(req,res)=>{
	console.log("Reaching login endpoint.")
	const {userId}=req.body;
	console.log("Received response",userId)
	knex('users').where({id: userId}).returning('*')
	.then(check=> {
		console.log("DB response:", check)
		if(check.length){
			console.log("user exists", check[0])
			res.status(200).send(check[0])
		}
		else{	
			console.log("creating new user", userId)
			knex('users').insert({id: userId, fav: []}).returning('*')
			.then(newUser=>res.status(200).send(newUser[0]))
		}	
	})
})

app.post('/updatefavs',(req,res)=>{
	const {user,id} = req.body;
	let pagesDatabase,userToSend;
	knex('users').where({id: user}).select('fav')
	.then(favList=>{
		const fav=favList[0].fav;
		if(fav.includes(id)){
			knex('database').where('id','=',id).decrement('favourite',1)
			.then(resp=>{
				knex('users').where({id: user}).select('fav')
				.then(fav=>{
					knex('users').where({id: user}).returning('*').update({
						fav: fav[0].fav.filter(favId=>favId!==id)
					})
					.then(r=>{
						knex.select('*').from('database').orderBy('favourite','desc')
						.then(pagesDatabase=>{
							knex('users').where({id: user})
							.then(userToSend=>{
								res.send({pagesDatabase, userToSend: userToSend[0], update:true})
							})
						})
					})
				})
			})
		}
		else{
			knex('database').where({id:id}).increment('favourite',1).returning('*')
			.then(record=>{
				knex('users').where({id: user}).select('fav')
				.then(fav=>{
					fav[0].fav.push(id)
					knex('users').where({id: user}).returning('*').update({
						fav: fav[0].fav
					})
					.then(r=>{
						knex.select('*').from('database').orderBy('favourite','desc')
						.then(pagesDatabase=>{
							knex('users').where({id: user})
							.then(userToSend=>{
								res.send({pagesDatabase, userToSend: userToSend[0], update:true})
							})
						})
					})
				})
			})
		}
	})
})




//process.env.PORT || 

app.listen(process.env.PORT || 3000 , ()=>{console.log(`listening on ${process.env.PORT}`)})