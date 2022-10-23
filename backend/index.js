require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./controllers/routes');
const User = require('./models/User');

const app = express();

mongoose.connect('mongodb://localhost:27017/twitter', () => console.log('mongo connected'));
app.use(express.json());
app.use(cookieParser());
app.use(router);

app.listen(3005);
