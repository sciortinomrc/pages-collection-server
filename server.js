const express = require('express');
const bodyParser= require ('body-parser');
const FB=require('fb');
const bcrypt= require('bcrypt-nodejs');
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

// app
const ACCESS_TOKEN='EAAMyBcjmzcIBANXIEZCvuWKXI5OMwckVtzlX6B6YlxPUommBxEvmvB5OERvMrtBuJ2k2cJxtxAYZC8W7utdAz91GgnG9XDxlA4dfYkcl13hFnw3BfySx3sTbHpQSSePQQe5aOk94jwl7X9AsqcBDishf13B9UZD';
//test
// const ACCESS_TOKEN='EAAHA0tNTMtsBAJwiixLbnjgftZBI9QcBxRvyDtisxlhODQZCxHAbsrWKl8YHAsmtjsh9zTjvgO1c3qJEaAR0KnfmTGg23hvmNFqW6eTZBxqgK8IdDfQXGDpt7SscXBkvHh3ujjatLIEpqNghYwC3SZBJSMUIbkO9JVQEgoZA2B8abo1sEz03jW1VoBs8RG8Tba99GZAXjdKwZDZD';
const cards=[];
const batch=[];
knex.select('id').from('database')
.then(response=>response.map(record=>{
	console.log(record)
	batch.push({method: 'get', relative_url: record+'?fields=id,name,fan_count,link,picture'})
}))
FB.setAccessToken(ACCESS_TOKEN);

FB.api('','post',{
	batch:batch},(response)=>{
		response.map(page=>{
			cards.push(JSON.parse(page.body))
		})
	}
)

const apiCall=(record)=>{
	FB.api('/'+record.id,'get',{access_token:ACCESS_TOKEN, fields:'id,name, fan_count, link, picture'},(response)=>{
		if(!response.error){
			cards.push(response)
		}
		else return "Error - Something went wrong with this ID"
	})
}


//get pages DB
app.get('/', (req,res)=>{
	console.log('ok')
	// knex.select('*').from('database')
	// .then(db=>res.send({db,cards}))
})
//update pages DB
app.post('/newpage',(req,res)=>{
	const {id, category, country} = req.body;
	knex('database').where({id: id})
	.then(response=>{
		if(response.length){
			res.status(400).send("The page already exists")
		}
		else{
			FB.api('/'+id,'get',{access_token:ACCESS_TOKEN, fields:'id,email'},(response)=>{
				if(!response.error){
					res.send({db: undefined,cards: undefined,message: 'Error - The ID you are trying to send is not a Facebook page'})
				}
				else{
					apiCall({id});
					knex('database').returning('*').insert({id: id, category: category, country: country, favourite:0})
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
	const {user,password}=req.body;
	bcrypt.hash(password, null, null, function(err, hash) {
		knex('hash').where({id: user}).select('password')
		.then(pass=> pass[0].password)
		.then(pwd=>{
			bcrypt.compare(password, pwd, function(err, resp) {
				if(resp){
					knex('users').where({id: user}).select('*')
					.then(data=> res.send(data[0]))
				}
				else{
					res.status(400).send("Error - Username and password do not match our record")
				}
			});
		})
		.catch(err=>res.status(400).send("Error - Something went wrong. Please try again") ) 
	});
})

app.post('/register', (req,res)=>{
	const {user,password,email}=req.body;
	if(knex('users').where({id: user}).length){
		res.status(400).json("Account not created");
	}
	else{
		knex('users').insert({id: user, email: email, fav: []})
		.then( response=> {
			bcrypt.hash(password, null, null, function(err, hash) {
				knex('hash').insert({id: user, password: hash})
				.then(response=> res.json("Account created"))
			});
		})
	}

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