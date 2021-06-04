// importing all the stuff in here
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";

//app config
// creating the application 👇
const app = express();
// port where our api is going to run 👇
const port = process.env.PORT || 9000;
// middleware
// this is total shit
app.use(express.json());

// DB config
// This is the thing, how we connect to the database
const connection_url =
    "mongodb+srv://admin:LTOWzeXb5ytR1bSq@cluster0.gjzbn.mongodb.net/backend?retryWrites=true&w=majority";

// helping mongoose to connect to the db
mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})



// ????

/// api routes d
// we just make the method, and one of them is downloading data, then url we go is www.something.com/ 👉 this is the base url and show the hello world
// we set the status 200, which means okay 🎊
app.get('/', (req, res) => res.status(200).send('hello world 🚀'));
app.get('/messages/sync', (req, res) => {
    // this gets all the data from the server
    Messages.find((err, data) => {
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})
// this posts a message to the database, does not work because the db and app is not linked for some reason
app.post('/messages/new', (req, res) => {
    const dbMessage = req.body
    Messages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err);
            console.log("ERROR", err);
        } else {
            res.status(201).send(`new message created \n ${data}`)
        }
    })
})

// listener
// we listen on the port in 👆 and console log it in here
app.listen(port, () => console.log(`Listening on localhost:${port}`));


//LTOWzeXb5ytR1bSq