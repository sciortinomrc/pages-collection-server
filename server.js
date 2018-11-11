const express = require('express');
const bodyParser= require ('body-parser');
const FB=require('fb');
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

const cards=[];
const batch=[];
FB.setAccessToken(process.env.ACCESS_TOKEN);



knex.select('id').from('database')
.then(response=>response.map(record=>{
	batch.push({method: 'get', relative_url: record.id+'?fields=id,name,fan_count,link,picture'})
}))
.then(r=>{
	FB.api('','post',{
		batch:batch},(response)=>{
			response.map(page=>{
				cards.push(JSON.parse(page.body))
			})
		}
	)
})


const apiCall=(record)=>{
	FB.api('/'+record.id,'get',{fields:'id,name, fan_count, link, picture'},(response)=>{
		if(!response.error){
			cards.push(response)
		}
		else return "Error - Something went wrong with this ID"
	})
}


//get pages DB
app.get('/', (req,res)=>{
	knex.select('*').from('database')
	.then(db=>res.send({db,cards}))
})
//update pages DB
app.post('/newpage',(req,res)=>{
	const {id, category, country,username} = req.body;
	knex('database').where({id: id})
	.then(response=>{
		if(response.length){
			res.status(400).send("The page already exists")
		}
		else{
			FB.api('/'+id,'get',{fields:'id,email'},(response)=>{
				if(!response.error){
					res.send({db: undefined,cards: undefined,message: 'Error - The ID you are trying to send is not a Facebook page'})
				}
				else{
					apiCall({id});
					knex('database').returning('*').insert({id: id, category: category, country: country, favourite:0, addedby: username})
					.then(response=>{
						knex.select('*').from('database')
						.then(db=>{
							setTimeout(()=>{
								res.send({db,cards,message:"Your page has been added to our database"})
							},500)
						})
					})
				}
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
		res.status(200).send(check[0])
		}
		else{
			knex('users').insert({id: userId, fav: []})
			res.status(200).send(check[0])
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






app.listen(process.env.PORT || 3001 , ()=>{console.log(`listening on ${process.env.PORT}`)})