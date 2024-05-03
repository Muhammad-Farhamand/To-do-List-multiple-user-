const express = require('express');
const path = require('path');

const user = require('./Application/Routes/userRoutes');
const todo = require('./Application/Routes/todoRoutes');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const app = express();

// Security headers
app.use(helmet());

// limits the amount of request on the server
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'too many request from this IP, please try again later'
});
app.use('/api', limiter);

// data sanitization
app.use(mongoSanitize());
app.use(xss());

// Parser
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// Serve static files from 'Presentation' Folder
app.use(express.static(path.join(__dirname, 'Presentation')));

// ROUTES
app.use('/api/user', user);
app.use('/api/todo', todo);


// -----------------------------------------
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong')
});

app.listen(8000, () => {
    console.log('Server is running');
});