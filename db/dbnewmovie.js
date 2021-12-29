const mongoose = require('mongoose');

const dbUrl = 'mongodb://myUserAdmin:%20@localhost:27017/movieapp?authSource=admin'

mongoose.connect(dbUrl,{
    useNewUrlParser: true,
    useUnifiedTopology:true,
}).catch(err => console.log(err))

let movieslist = mongoose.Schema({
    name: String,
    background: String,
    head: String,
    rating: Number,
    type: Array,
    view: Number,
    trailer: String,
    director: Array,
    actor: Array,
    description: String,
    full: String
})

let newmovie = mongoose.model("newmovie",movieslist)
module.exports = newmovie

module.exports.addMovie = function(model,data){
    model.save(data)
}