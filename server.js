const express = require('express');
const bodyParser= require ('body-parser');
const cors= require('cors');
const fs=require('fs');
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

//visits counter
let file;
let date=new Date().toLocaleDateString("en-GB");
date=date.replace(/[/]/g,"")
let jsonData;
try{
	file=fs.readFileSync("./visits.json").toString();
	file=JSON.parse(file);
	if(file[file.length-1].date!==date) throw true;
	file[file.length-1].visits++;
	jsonData=file;
}
catch(err){
	const newData=JSON.parse('{"date":"'+date+'", "visits":"0"}');
	if(file)jsonData=[...file, newData];
}
fs.writeFile("./visits.json",JSON.stringify(jsonData),()=>{})
//end visits counter

//get visits
app.get('/visits', (req,res)=>{
	file=fs.readFileSync("./visits.json").toString();
	file=file.json();
	res.send(file)
})


//get pages DB
app.get('/', (req,res)=>{
	knex.select('*').from('database')
	.then(db=>res.send({db}))
})
//update pages DB
app.post('/newpage',(req,res)=>{
	const {id, name, url, picture,  category, country,username} = req.body;
	knex('database').where({id: id})
	.then(response=>{
		console.log(response)
		if(response.length){
			res.status(400).send("The page already exists")
		}
		else{
			knex('database').returning('*').insert({id: id, name: name, url: url, picture: picture, category: category, country: country, favourite:0, createdby: username.name})
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