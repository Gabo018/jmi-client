const mongoose = require("mongoose")

const Schema = mongoose.Schema;
const PersonSchema =  new Schema({
    Name:{
        type: String,
        required: true
    }
 
})

const Person = mongoose.model("Person", PersonSchema);
module.exports =  Person;