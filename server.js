const express = require('express')
const app = express()
const port = process.env.PORT || 4000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const yargs = require('yargs');
const cors = require('cors');
// const expressValidator = require('express-validator');
// const cookieParser = require('cookie-parser');
// const expressSession = require('express-session')
const arguments = yargs.argv._


console.log(arguments)
//--middleware--//
app.use(cors());
// app.use(expressSession({secret:'bla'}));
// app.use(expressValidator());
// app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
//--Creating DB--//
const url = "mongodb://localhost:27017/AvivProject";
mongoose.connect(url, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('we are connected to DB!');
});

//--users collections--//
const Schema = mongoose.Schema;
const LoginDetailsSchema = new Schema({
    username: String,
    password: String,
    date: String,
    fullname: String,
    institute: String,
    degree: String,
    descript: String,
    phone: Number,

});

const uandpModel = mongoose.model('uandp', LoginDetailsSchema);


var instanceLogin = new uandpModel({ username: 'admin', password: "12345" });

instanceLogin.save(function (err) {
    console.log('uandp saved')
});

//--learn Posts collection --//
const LearnPagePostsSchema = new Schema({
    course: String,
    headline: String,
    context: String,
    date: String
})

const learnPagePostsModel = mongoose.model('learnpageposts', LearnPagePostsSchema);

// var instaceLearnPagePost = new learnPagePostsModel({ course: "kadarut", headline: "heeelp", context: "lorem" })

// instaceLearnPagePost.save(function (err) {
//     console.log("LPP saved")
// })

//--teach posts collection--//
const TeachPagePostsSchema = new Schema({
    course: String,
    headline: String,
    context: String,
    date: String
})

const teachPagePostsModel = mongoose.model('teachpageposts', TeachPagePostsSchema);

// var instaceTeachPagePost = new teachPagePostsModel({ course: "kadarut", headline: "let me teach u", context: "lorem" })

// instaceTeachPagePost.save(function (err) {
//     console.log("TPP saved")
// })

//--share posts collection--//
const SharePagePostsSchema = new Schema({
    course: String,
    headline: String,
    context: String,
    date: String
})

const sharePagePostsModel = mongoose.model('sharegeposts', SharePagePostsSchema);

const DescriptSchema = new Schema({
    course: String,
    headline: String,
    context: String
})

const DescriptPostModel = mongoose.model('descripts', DescriptSchema);
// var instacesharePagePostsModel = new sharePagePostsModel({ course: "kadarut", headline: "sikum", context: "lorem" })

// instacesharePagePostsModel.save(function (err) {
//     console.log("SPP saved")
// })

//--LOGINPAGE--//
app.post('/login', (req, res) => {
    console.log("hi")
    //get username and password
    const { username, password } = req.body;
    console.log('name and pass:', username, password)

    // search in db and find if user name and password exists
    uandpModel.findOne({ username: username }, (err, docs) => {
        if (err) throw err;
        // res.send(docs)
        console.log(docs)
        if (docs && docs.username) {

            //check if password match
            if (docs.password == password) {
                //send valid to client
                res.send({ valid: true });
            } else {
                res.send({ valid: false });
            }
        } else {
            res.send({ valid: false });
        }
    })
});





    //--SIGNUPAGE--//
    app.post('/register', (req, res) => {
        console.log("hi")
        //get username and password
        const { username, password, email } = req.body;
        console.log('name and pass and email:', username, password, email)

        // search in db and find if user name or email exists
        uandpModel.findOne({ username: username }, (err, docs) => {
            if (err) {
                console.log(err);
            };
            // res.send(docs)
            console.log(docs)
            if (docs) {
                if (docs.username || docs.email) {
                    res.send({ valid: false });
                }
            }
            else {
                //--add the user to the users collection--//
                db.collection("uandps").insert({
                    "username": username,
                    "password": password,
                    "email": email
                }, (err, docs) => {
                    if (err) throw err;
                    else {
                        console.log(docs)
                        res.send({ valid: true });
                    }
                })
            }
        })
    }),

    //--LEARNPAGE--//
    app.post('/learn', (req, res) => {
        //get post details
        const { course, headline, context } = req.body;
        console.log(course, headline, context)
        //add post to learnpage db
        db.collection("learnPagePostsModels").insertOne({
            "course": course,
            "headline": headline,
            "context": context,
            "date": new Date().toLocaleString()
        }, (err, docs) => {
            if (err) { throw err }
            else {

                db.collection("learnPagePostsModels").find({}).toArray((err, docs) => {
                    console.log(docs);
                    res.send(docs)
                })

            }
        })
    }),

    //--TEACHPAGE--//
    app.post('/teach', (req, res) => {
        //get post details
        const { course, headline, context } = req.body;
        console.log(course, headline, context)
        //add post to teachpage db
        db.collection("teachPagePostsModels").insert({
            "course": course,
            "headline": headline,
            "context": context,
            "date": new Date().toLocaleString()
        }, (err, docs) => {
            if (err) throw err;
            else {
                db.collection("teachPagePostsModels").find({}).toArray((err, docs) => {
                    console.log(docs);
                    res.send(docs)
                })
            }
        })
    }),


    //--SHAREPAGE--//
    app.post('/share', (req, res) => {
        //get post details
        const { course, headline, context } = req.body;
        console.log(course, headline, context)
        //add post to sharepage db
        db.collection("sharePagePostsModels").insert({
            "course": course,
            "headline": headline,
            "context": context,
            "date": new Date().toLocaleString()
        }, (err, docs) => {
            if (err) throw err;
            else {
                db.collection("sharePagePostsModels").find({}).toArray((err, docs) => {
                    console.log(docs);
                    res.send(docs)
                })
            }
        })
    }),

    //--loadtechtable--//
    app.get('/onloadteach', (req, res) => {
        db.collection("teachPagePostsModels").find({}).toArray((err, docs) => {
            console.log(docs);
            res.send(docs)
        })
    }),

    //--loadlearnable--//
    app.get('/onloadlearn', (req, res) => {
        db.collection("learnPagePostsModels").find({}).toArray((err, docs) => {
            console.log(docs);
            res.send(docs)
        })
    }),
//--loadprofiledata--//
    app.get('/onloadprofile', (req, res) => {
        db.collection("uandp").find({}).toArray((err, docs) => {
            console.log(docs);
            res.send(docs)
        })
    }),

    //--loadsharetable--//
    app.get('/onloadshare', (req, res) => {
        db.collection("sharePagePostsModels").find({}).toArray((err, docs) => {
            console.log(docs);
            res.send(docs)
        })
    }),


    app.listen(port, () => {
        console.log("were on port number 4000")
    })