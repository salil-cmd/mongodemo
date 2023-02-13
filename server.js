const express = require('express');
const path = require('path')
const app = express();
const mongoose = require('mongoose');

const User = require('./models/User') // ********


// rendering html files configurations
let views_path = path.join(__dirname + '/views')
app.set('view engine', 'ejs');
app.set('views', views_path)


// This help me to use req.body on the server
app.use(express.json());


app.get('/', (req, res) => {
    res.render('form')
})


// ************
app.post('/storeEmail', async(req, res) => {
    const emailFound = await User.findOne({ email: req.body.email })
    if (emailFound) {
        return res.json({
            msg : "Email already taken"
        })
    }

    const user = new User({
        email: req.body.email,
        name: req.body.name
    });

    // As the process of storing the details in mongodb returns a promise
    // (bcz it can get successfully or can get failed)
    try{
        await user.save();  // saves the user in the database
        return res.json({
            msg : "User added successfully"
        })
    }

    // If the addition failed -->
    catch(err){
        return res.json({
            msg : `Operation Failed due to \n ${err}`
        })
    }


})

// *************
// Connection to mongodb
let mongoDBlink = "mongodb://localhost/simpleMongoDB";
mongoose.connect(mongoDBlink)
    .then(() => console.log(`Connected to ${mongoDBlink}...`))
    .catch((err) => console.log(err))


// Listening on port 
app.listen(4000, () => {
    console.log("Listening on port 4000...");
})