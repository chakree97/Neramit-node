const express = require("express")
const bodyParser = require('body-parser')
const db = require("../db/db.js")
const dbnewmovie = require("../db/dbnewmovie.js")
const dbmostview = require("../db/dbmostview.js")
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(bodyParser.raw());

router.get('/',(req,res)=>{
    res.json({"message":"ok"}).status(200)
})

router.post('/addmovie',(req,res)=>{
    let movieschema = new db({
        name: req.body.name,
        background: req.body.background,
        head: req.body.head,
        rating: req.body.rating,
        type: req.body.type,
        view: req.body.view,
        trailer: req.body.trailer,
        director: req.body.director,
        actor: req.body.actor,
        description: req.body.description,
        full: req.body.full
    })
    db.addMovie(movieschema,(err)=>{
        if(err) console.log(err)
        res.sendStatus(200)
    })
})

router.post('/addnewmovie',(req,res)=>{
    let movieschema = new dbnewmovie({
        name: req.body.name,
        background: req.body.background,
        head: req.body.head,
        rating: req.body.rating,
        type: req.body.type,
        view: req.body.view,
        trailer: req.body.trailer,
        director: req.body.director,
        actor: req.body.actor,
        description: req.body.description,
        full: req.body.full
    })
    dbnewmovie.addMovie(movieschema,(err)=>{
        if(err) console.log(err)
        res.sendStatus(200)
    })
})

router.post('/addmostview',(req,res)=>{
    let movieschema = new dbmostview({
        name: req.body.name,
        background: req.body.background,
        head: req.body.head,
        rating: req.body.rating,
        type: req.body.type,
        view: req.body.view,
        trailer: req.body.trailer,
        director: req.body.director,
        actor: req.body.actor,
        description: req.body.description,
        full: req.body.full
    })
    dbmostview.addMovie(movieschema,(err)=>{
        if(err) console.log(err)
        res.sendStatus(200)
    })
})

router.get('/query/recomment',(req,res)=>{
    db.find().exec((err,doc)=>{
        if(err) console.log(err);
        console.log(doc);
        res.json(doc);
    })
})

router.get('/query/newvideo',(req,res)=>{
    dbnewmovie.find().exec((err,doc)=>{
        if(err) console.log(err);
        console.log(doc);
        res.json(doc);
    })
})

router.get('/query/mostview',(req,res)=>{
    dbmostview.find().exec((err,doc)=>{
        if(err) console.log(err);
        console.log(doc);
        res.json(doc);
    })
})

module.exports = router