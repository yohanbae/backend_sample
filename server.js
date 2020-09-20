const express = require('express')   // 설치해라
const cors = require('cors')  // 설치해라
const mongoose = require('mongoose') //설치해야겠지 // 만약 mongoDB를 사용한다면
var passport = require('passport');
require('./passport')(passport);
require('dotenv').config()  // 설치해라

const app = express()    // express server 시작하기
const port = process.env.PORT || 5000;

app.use(cors());  // cors middleware
app.use(express.json());   //  서버에서 json을 쓸수있도록 설정해줌

const uri = process.env.ATLAS_URI
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB connection successfully")
})



const exercisesRouter = require('./routes/exercises');
const usersRouter = require('./routes/users');
app.use('/exercises', exercisesRouter);
app.use('/users', usersRouter);

app.use(passport.initialize());
app.use(passport.session());

app.listen(port, () => {
    console.log(`server running on port: ${port}`);
})