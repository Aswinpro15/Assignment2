require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(
    process.env.DB_CONN_STRING,
    {
         useUnifiedTopology: true, 
         useNewUrlParser: true
    },
    console.log('Database Connected!!')
);

app.use(express.json());

const userRoute = require('./routes/userRoutes');
const issueRoute = require('./routes/issueRoutes');
app.use('/user', userRoute);
app.use('/issue', issueRoute);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.listen(3000, () => console.log('SERVER STARTED!!'));