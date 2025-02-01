const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        require: true,
    }
});


//.plugin() creates and manages username,password,salting,hashing automatically and store it in db
userSchema.plugin(passportLocalMongoose); 

module.exports = mongoose.model("user", userSchema);



//password is stored in db in hashed form
//to extra protection, salting is used in which the 16 or more length string is added to password and then it is converted to hashed form
//this string is inserted at begin, end and middle also using syntax '&?@'

//passport is library provide authentication in nodejs
// npm install passport
//passport-local is type of passport where authenctication is done based on email,username,password
// npm install passport-local
// npm install passport-local-mongoose