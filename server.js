// importing all the stuff in here
import express from "express";


//app config
// creating the application 👇
const app = express();
// port where our api is going to run 👇
const port = process.env.PORT || 9000;
// middleware

// DB config

// ????

/// api routes d
// we just make the method, and one of them is downloading data, then url we go is www.something.com/ 👉 this is the base url and show the hello world
// we set the status 200, which means okay 🎊
app.get('/', (req, res) => res.status(200).send('hello rokas'));
// listener
// we listen on the port in 👆 and console log it in here
app.listen(port, () => console.log(`Listening on localhost:${port}`));