const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bycryptjs');
const uuid = require('uuid'); 

const app = express();

//defaults the port to 4000
const port = process.argv.length >2 ? process.argv[2] : 4000;



//lets the reader read json files
app.use(express.json());
//lets read cookies
app.use(cookieParser());

//when the files are public, serve them automatically
app.use(express.static('public'));