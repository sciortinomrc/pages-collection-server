const express = require('express');
const bodyParser= require ('body-parser');
const cors= require('cors');


const app=express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const Pages = require ("./classes/Pages");
const Users = require ("./classes/Users");
const Visits = require ("./classes/Visits");

const PagesifyCore = require("./classes/Pagesify-Core");
const pagesifyCore = new PagesifyCore();

const pages = new Pages(), users = new Users(), visits = new Visits();

//get pages DB
app.post("/api/visits",async(req,res)=>{
	try{
		let getTodaysVisit;
		console.log("Checking if this is the first visit today...")
		getTodaysVisit = await visits.get();
		
		if(getTodaysVisit==null){
			console.log("It's the first visit.. I add it to the database...")
			await visits.addNew();
			getTodaysVisit = {count:0};
		}
		console.log("I increment visit count...")
		await visits.increment(getTodaysVisit.count);
		res.send();
	}
	catch(e){
		console.log(e)
		e.path="/api/visits"
		res.status(e.status).send(JSON.stringify(e));
	}
})

app.get('/api/pages', async (req,res)=>{
	console.log("Pages list request")
	let allPages;
	try{
		console.log("Getting all the pages from the database...")
		allPages = await pages.all();
		res.send(JSON.stringify(allPages))
	}
	catch(e){
		console.log(e)
		e.path="/api/pages";
		res.status(e.status).send(JSON.stringify(e));
	}
})
app.post('/api/pages',async(req,res)=>{
	console.log("Request of new page");
	const {id} = req.body
	try{
		console.log("Scraping facebook page...");
		const pageInfo = pagesifyCore.pageInfo(id);
		console.log("Creating page record on DB");
		await pages.add({...req.body,...pageInfo});
		res.send("Ok")
	}
	catch(e){
		e.path="/api/pages";
		res.status(e.status).send(JSON.stringify(e));
	}
})
app.post('/api/admin/pages/refresh',async(req,res)=>{
	console.log("About to refresh all pages info");
	const allPages = await pages.all();
	try{
		for(const current of allPages){
			console.l
			const pageInfo = pagesifyCore.pageInfo(current.id);
			await pages.update({...current,...pageInfo});
		}
		res.send();
	}
	catch(e){
		console.log(e);
		res.status(e.status).send();
	}
})
app.delete('/api/pages/:pageId/delete',async(req,res)=>{
	try{
		const {pageId} = req.params;
		const allUsers = await users.all();
		for(const user of allUsers){
			await users.updateFavourites(user,pageId);
		}
		await pages.remove(pageId);
		res.send("Ok")
	}
	catch(e){
		e.path="/api/pages/:pageId/delete";
		res.status(e.status).send(JSON.stringify(e))
	}
})

app.put("/api/pages/:pageId/favourites/update",async(req,res)=>{
	try{
		const {pageId} = req.params;
		const {add,current} = req.query;
		if(!current || !add) throw {status: 400, message:"Some parameters are missing", location: "pagesify"}
		const page = { id: pageId, favourites: add==true?current*1+1:current*1-1};
		await pages.updateFavourites(page);
		res.send("Ok");
	}
	catch(e){
		e.path="/api/pages/:pageId/favourites/update";
		res.status(e.status).send(JSON.stringify(e))
	}
})

app.get("/api/users",async(req,res)=>{
	try{
		console.log("Getting all users");
		const usersAll = await users.all();
		res.send(JSON.stringify(usersAll));
	}
	catch(e){
		e.path="/api/users"
		res.status(e.status).send(JSON.stringify(e))
	}
})

app.post('/api/users/:userId',async(req,res)=>{
	try{
		const {userId}=req.params;
		console.log("Received response",userId)
		await users.create(userId);
		const user = await users.get(userId);
		res.send(JSON.stringify(user));
	}
	catch(e){
		e.path="/api/users/:userid";
		res.status(e.status).send(JSON.stringify(e));
	}
})

app.get("/api/users/:userid",async(req,res)=>{
	const {userid} = req.params;
	try{
		const user = await users.get(userid);
		res.send(JSON.stringify(user));
	}
	catch(e){
		e.path="/api/users/:userid";
		res.status(e.status).send(JSON.stringify(e));
	}
})
app.put("/api/users/:userid/favourites/update",async(req,res)=>{
	const {pageId,userInfo} = req.body;
	try{
		await users.updateFavourites(userInfo,pageId);
		res.send()
	}
	catch(e){
		e.path="/api/users/:userid/favourites/update";
		res.status(e.status).send(JSON.stringify(e));
	}
})

app.get("/api/visits",async(req,res)=>{
	try{
		const allVisits = await visits.all();
		res.send(JSON.stringify(allVisits));
	}
	catch(e){
		e.path="/api/visits";
		res.status(e.status).send(JSON.stringify(e));
	}
})




app.listen(process.env.PORT || 3000 , ()=>{console.log(`listening on ${process.env.PORT}`)})
