const mongoose = require('mongoose');

const dbUrl = 'mongodb://myUserAdmin:%20@localhost:27017/movieapp?authSource=admin'

mongoose.connect(dbUrl,{
    useNewUrlParser: true,
    useUnifiedTopology:true,
}).catch(err => console.log(err))

let accountlist = mongoose.Schema({
    username: String,
    password: String,
    phone: String,
    islogin: Boolean,
    favorite: Array,
    collections: Array,
    history: Array,
    recently: Array
})

let accountsmodel = mongoose.model("accountmovie",accountlist)
module.exports = accountsmodel

module.exports.addAccount = function(model,data){
    model.save(data)
}