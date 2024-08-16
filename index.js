//For server configuration
const http = require('http');
const dotenv = require('dotenv'); // loads environment variable from .env file to process.env file
const mongoose = require('mongoose');
const express = require('express');
const app = express(); // a framework of nodejs
const morgan = require('morgan'); // to log api requests
const cors = require('cors'); // for req and res bw two different ports
const bodyParser = require('body-parser');

app.use(morgan('dev'));
// List of allowed origins
const allowedOrigins = [
    'https://aayojan.alokknight.com',
    'https://aayojan-jyww.onrender.com',
    'https://www.alokknight.com',
    'https://adarshlibrary.netlify.app',
    'https://adarshlibrary.alokknight.com',
    'https://alokknight.github.io'
];

const corsOptions = {
    origin: function (origin, callback) {
        // Check if the incoming origin is in the list of allowed origins
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
    credentials: true // If you need to handle cookies or authentication headers
};

app.use(cors(corsOptions));
// app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); //A middleware extracts the entire body portion of an incoming request stream and exposes it on req.body.

// Routes
// app.use('/', require('./routes/home'));
app.use('/api/signup', require('./routes/signup'));
app.use('/api/signin', require('./routes/signin'));
app.use('/api/event', require('./routes/addevent'));
app.use('/api/password', require('./routes/forgetpassword'))


//Config Path
dotenv.config({path: './config.env'});
const port = process.env.PORT || 5000;
// console.log(process.env.USER)
// Connecting to DB via mongoose
const url = process.env.MONGO_URI;
const connect = mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
connect.then(()=>{
    console.log('DB Connection Successful.')
}).catch((err) => console.log('Error: '+ err));

// Heroku
if(process.env.NODE_ENV == "production"){
    app.use(express.static("client/build"));
    const path = require("path");
    app.get("*", (req,res)=>{
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

const server = http.createServer(app);
server.listen(port);

console.log('Server is running at: 127.0.0.1:'+ port);
