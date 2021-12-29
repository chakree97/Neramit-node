const express = require("express");
const path = require("path")
const app = express();
const moviehome = require("./homepage/home.js")
const playmovie = require("./video/playmovie.js")
const account = require("./account/account.js")

const PORT = 3000;

app.use('/',moviehome)
app.use('/videos', playmovie);
app.use('/account',account);

app.get('/index',(req,res)=>{
    res.sendFile(path.join(__dirname+'/index.html'))
})

app.listen(PORT,()=>{
    console.log(`server run at port ${PORT}`)
})
