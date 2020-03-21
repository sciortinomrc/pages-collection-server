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
app.get('/api/root', async (req,res)=>{
	console.log("root endpoint visited")
	let allPages,getTodaysVisit;
	try{
		console.log("Getting all the pages from the database...")
		allPages = await pages.all();
	}
	catch(e){
		console.log(e);
	}

	try{
		console.log("Checking if this is the first visit today...")
		getTodaysVisit = await visits.get();
		
		if(getTodaysVisit==null){
			console.log("It's the first visit.. I add it to the database...")
			getTodaysVisit = await visits.addNew();
		}
		console.log("I increment visit count...")
		await visits.increment(getTodaysVisit.count);
	}
	catch(e){
		console.log(e);
	}
	res.send(JSON.stringify(allPages))
})

//overview
app.get("/api/overview", async(req,res)=>{
	console.log("Requets of overview")

	try{
		const allPages = await pages.all();
		const allUsers = await users.all();
		const allVisits = await visits.all();
		res.send(JSON.strinfigy({allUsers,allPages,allVisits}));
	}
	catch(e){
		e.path = "/api/overview";
		res.status(e.status).send(JSON.stringify(e))
	}
})

//update pages DB
app.post('/api/pages/new',async(req,res)=>{
	try{
		const {pageId} = req.body
		const pageInfo = pagesifyCore.pageInfo(pageId);
		await pages.add(req.body);
		res.send("Ok")
	}
	catch(e){
		e.path="/api/pages/new";
		res.status(e.status).send(JSON.stringify(e));
	}
})

//login
app.get("/api/users/:userid",async(req,res)=>{
	const {userid} = req.params;
	try{
		const user = await users.get(userid);
		res.send(JSON.strinfigy(user));
	}
	catch(e){
		e.path="/api/users/:userid";
		res.status(e.status).send(JSON.stringify(e));
	}
})

app.post('/api/users/new',async(req,res)=>{
	try{
		const {userId}=req.body;
		console.log("Received response",userId)
		await users.create(userId);
		const user = await users.get(userId);
		res.send(JSON.stringify(user));
	}
	catch(e){
		e.path="/api/users/new";
		res.status(e.status).send(JSON.stringify(e));
	}
})

app.post('/api/pages/delete/:pageId',async(req,res)=>{
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
		e.path="/api/pages/delete/:pageId";
		res.status(e.status).send(JSON.stringify(e))
	}
})

app.post("/api/pages/:pageId/updateFavourites",async(req,res)=>{
	try{
		const {pageId} = req.params;
		const {add,current} = req.query;
		if(!current || !add) throw {status: 400, message:"Some parameters are missing", location: "pagesify"}
		const page = { id: pageId, favourites: add?current+1:current-1};
		await pages.updateFavourites(page);
		res.send("Ok");
	}
	catch(e){
		e.path="/api/pages/:oageId/updateFavourites";
		res.status(e.status).send(JSON.strinfigy(e))
	}
})


app.listen(process.env.PORT || 3000 , ()=>{console.log(`listening on ${process.env.PORT}`)})
