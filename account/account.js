const express = require("express")
const bodyParser = require('body-parser')
const account = require("../db/dbaccount.js")
const bcrypt = require('bcryptjs');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(bodyParser.raw());

router.post('/signup',(req,res)=>{
    let username = req.body.username;
    let password = bcrypt.hashSync(req.body.password,8);
    let phone = req.body.phone
    account.findOne({username: username}).exec((err,doc)=>{
        if(err) console.log(err);
        if(doc == null){
            let accountschema = new account({
                username: username,
                password: password,
                phone: phone,
                islogin: false,
                favorite: [],
                collections: [],
                history:[]
            })
            account.addAccount(accountschema,(err)=>{
                if(err) console.log(err)
                res.json({
                    message: "Successful"
                })
            })
        }
        else{
            res.json({
                message: "you have already account"
            })
        }
    })
})

router.post('/login',(req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    console.log(req.body);
    console.log(`{username = ${username} , password = ${password}}`);
    account.findOne({username: username}).exec((err,doc)=>{
        if(err) console.log(err);
        if(doc != null){
            bcrypt.compare(password,doc.password,function(err,response){
                if(err) console.log(err);
                if(response){
                    account.findOneAndUpdate({username: username},{islogin: true},null,function(err,doc){
                        if(err) console.log(err);
                        console.log(doc);
                        res.json({
                            message: "Successful"
                        })
                    })
                }
                else{
                    res.json({
                        message: "Invalid Password"
                    })
                }
            })
        }
        else{
            res.json({
                message: "Not found account"
            })
        }
    })
})

router.post('/logout',(req,res)=>{
    let username = req.body.username;
    account.findOne({username: username}).exec((err,doc)=>{
        if(err) console.log(err);
        if(doc != null){
            account.findOneAndUpdate({username: username},{islogin: false},null,function(err,doc){
                if(err) console.log(err);
                console.log(doc);
                res.json({
                    message: "Log Out Complete"
                })
            })
        }
        else{
            res.json({
                message: "Not found account"
            })
        }
    })
})

router.put('/forgotpassword',(req,res)=>{
    let username = req.body.username;
    let password = bcrypt.hashSync(req.body.password,8);
    account.findOne({username: username}).exec((err,doc)=>{
        if(err) console.log(err);
        if(doc != null){
            account.findOneAndUpdate({username: username},{password: password},null,function(err,doc){
                if(err) console.log(err);
                console.log(doc);
                res.json({
                    message: "Change Password Successful"
                })
            });
        }
        else{
            res.json({
                message: "Not found account"
            })
        }
    });
})

/*------------------- Favorite Zone -----------------------------*/
router.post('/query/allfavorite',(req,res)=>{
    let username = req.body.username;
    account.findOne({username: username}).exec((err,doc)=>{
        if(err) console.log(err);
        if(doc != null){
            console.log(doc.favorite);
            res.send(doc.favorite);
        }
    })
})

router.post('/query/favorite',(req,res)=>{
    let username = req.body.username;
    let movie = req.body.movie;
    account.findOne({username: username}).exec((err,doc)=>{
        if(err) console.log(err);
        if(doc != null){
            let favorite = doc.favorite;
            let breakloop;
            for(let i=0;i<favorite.length;i++){
                if(favorite[i].name === movie){
                    i = favorite.length;
                    breakloop = true;
                }
                else{
                    breakloop = false;
                }
            }
            if(breakloop){
                res.json({
                    message : true
                })
            }
            else{
                res.json({
                    message : false
                })
            }
        }
        else{
            res.json({
                message : false
            })
        }
    })
})

router.put('/favorite',(req,res)=>{
    let username = req.body.username;
    let movie = req.body.movie;
    account.findOne({username: username}).exec((err,doc)=>{
        if(err) console.log(err);
        if(doc != null){
            let favorite = doc.favorite;
            favorite.push(movie);
            console.log(favorite);
            account.findOneAndUpdate({username: username},{favorite: favorite},null,function(err,doc){
                if(err) console.log(err);
                console.log(doc);
                res.json({
                    message: "ok"
                })
            });
        }
        else{
            res.sendStatus(404);
        }
    })
})

router.delete('/unfavorite',(req,res)=>{
    let username = req.body.username;
    let movie = req.body.movie;
    account.findOne({username: username}).exec((err,doc)=>{
        if(err) console.log(err);
        if(doc != null){
            let favorite = doc.favorite;
            let real_favorite = [];
            for(let i=0;i<favorite.length;i++){
                if(favorite[i].name !== movie.name){
                    real_favorite.push(favorite[i]);
                }
            }
            account.findOneAndUpdate({username: username},{favorite: real_favorite},null,function(err,doc){
                if(err) console.log(err);
                console.log(doc);
                res.json({
                    message: "ok"
                })
            });
        }
        else{
            res.sendStatus(404);
        }
    })
})

/*--------------------------------------------------------------------*/

router.post('/query/allcollection',(req,res)=>{
    let username = req.body.username;
    account.findOne({username: username}).exec((err,doc)=>{
        if(err) console.log(err);
        if(doc != null){
            console.log(doc.collections);
            res.send(doc.collections);
        }
    })
})

router.post('/query/collection',(req,res)=>{
    let username = req.body.username;
    let movie = req.body.movie;
    account.findOne({username: username}).exec((err,doc)=>{
        if(err) console.log(err);
        if(doc != null){
            let collections = doc.collections;
            let expired;
            let breakloop;
            for(let i=0;i<collections.length;i++){
                if(collections[i].name === movie){
                   expired = collections[i].expired; 
		   i = collections.length;
                   breakloop = true;
                }
                else{
                    breakloop = false;
                }
            }
            if(breakloop){
                console.log(true);
                res.json({
                    message : true,
                    expired : expired
                })
            }
            else{
                console.log(false);
                res.json({
                    message : false
                })
            }
        }
        else{
            console.log(false);
            res.json({
                message : false
            })
        }
    })
})

router.put('/collection',(req,res)=>{
    let username = req.body.username;
    let movie = req.body.movie;
    account.findOne({username: username}).exec((err,doc)=>{
        if(err) console.log(err);
        if(doc != null){
            let collections = doc.collections;
            for(var j=0;j<movie.length;j++){
                collections.push(movie[j])
            }
            // for(let i=0;i<collections.length;i++){
            //     // console.log(`i = ${collections[i].name}`)
            //     for(let j=0;j<movie.length;j++){
            //         // console.log(collections);
            //         // console.log(`j = ${movie[j].name}`)
            //         if(movie[j].name === collections[i].name){
            //         //     collections[i] = movie[j];
            //         }
            //         else{
            //             collections.push(movie[j])
            //         }
            //     }
            // }
            // console.log(newcollections);
            account.findOneAndUpdate({username: username},{collections: collections,history: collections},null,function(err,doc){
                if(err) console.log(err);
                console.log(doc);
                res.json({
                    message: "ok"
                })
            });
        }
        else{
            res.sendStatus(404);
        }
    })
})

router.post('/query/history',(req,res)=>{
    let username = req.body.username;
    account.findOne({username: username}).exec((err,doc)=>{
        if(err) console.log(err);
        res.send(doc.history.reverse());
    });
})

router.delete('/deletehistory',(req,res)=>{
    let username = req.body.username;
    let position = req.body.position;
    account.findOne({username: username}).exec((err,doc)=>{
        if(err) console.log(err);
        if(doc != null){
            let history = doc.history;
            history.splice(position,1);
            account.findOneAndUpdate({username: username},{history: history},null,function(err,doc){
                if(err) console.log(err);
                res.json({
                    message: "ok"
                })
            });
        }
    });
})

router.put('/recently',(req,res)=>{
    let username = req.body.username;
    let movie = req.body.movie;
    let movienewarray;
    account.findOne({username: username}).exec((err,doc)=>{
        if(err) console.log(err);
        if(doc != null){
            movienewarray = doc.recently;
            for(let i=0;i<doc.recently.length;i++){
                if(movienewarray[i].name == movie.name){
                    movienewarray.splice(i,1);
                }
            }
            movienewarray.push(movie);
            account.findOneAndUpdate({username: username},{recently: movienewarray},null,function(err,doc){
                if(err) console.log(err);
                res.json({
                    message: "ok"
                })
            });
        }
    });
});

router.post('/query/recently',(req,res)=>{
    let username = req.body.username;
    account.findOne({username: username}).exec((err,doc)=>{
        if(err) console.log(err);
        res.send(doc.recently.reverse());
    });
})

module.exports = router;
