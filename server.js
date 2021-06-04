// importing all the stuff in here
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher";
import cors from "cors";

//app config
// creating the application 👇
const app = express();

// port where our api is going to run 👇
const port = process.env.PORT || 9000;

// pusher login details
const pusher = new Pusher({
    appId: "1214358",
    key: "be01aa18ea94a4ff1264",
    secret: "bbcfaf0ac0fd3a0f17d9",
    cluster: "eu",
    useTLS: true
});

// middleware
// this is total shit
app.use(express.json());
// this should set some rules
app.use(cors());
// Do not do in production, because it is open for anyone in any case
// app.use((req, res, next) => {
//    res.setHeader('Access-Control-Allow-Origin', '*');
//    res.setHeader('Access-Control-Allow-Headers', '*');
//    next();
// });

// DB config
// This is the thing, how we connect to the database
const connection_url =
    "mongodb+srv://admin:LTOWzeXb5ytR1bSq@cluster0.gjzbn.mongodb.net/backend?retryWrites=true&w=majority";

// helping mongoose to connect to the db
mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
// onece the connection is open
db.once('open', () => {
    console.log("DB is connected");

    // creates a collection in mongo db
    const msgCollection = db.collection('messagecontents');
    // watches for the something
    // console.log(msgCollection);
    const changeStream = msgCollection.watch();

    changeStream.on('change', (change) => {
        console.log('A change occurred', change);

        // then the change occurs, we save the change into the varible if the type of change is insert, then
        // there is a full document field, which we save into variable, and then it is the time then we trigger the pusher, to
        //we are going to rerender everything now, with pusher
        // the change is made in here
        if(change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            // pusher trigerred with some shit in this side
            pusher.trigger('messages', 'inserted', {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received,
            });
        } else {
            console.log("Error triggering the Pusher");
        }
    });
    //==========================================================
});



// ????

/// api routes d
// we just make the method, and one of them is downloading data, then url we go is www.something.com/ 👉 this is the base url and show the hello world
// we set the status 200, which means okay 🎊
app.get('/', (req, res) => res.status(200).send('hello world 🚀'));
app.get('/messages/sync', (req, res) => {
    // this gets all the data from the server
    Messages.find((err, data) => {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
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
            res.status(201).send(`new message created \n ${data}`);
        }
    })
})

// listener
// we listen on the port in 👆 and console log it in here
app.listen(port, () => console.log(`Listening on localhost:${port}`));


//LTOWzeXb5ytR1bSq