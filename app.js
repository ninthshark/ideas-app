const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const flash = require('connect-flash');
const session = require('express-session');


const ideas = require('./routes/ideas');
const users = require('./routes/users');
const app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/vidjot', {useMongoClient:true})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err.message));

// Load Handlebars view engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Middlewear
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// method-overide to deal with PUT and DELETE
app.use(methodOverride('_method'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
})

app.use('/ideas', ideas);
app.use('/users', users);

app.get('/', (req, res, next) => {    
    res.render('index', {title:"Welcome"});
});

app.get('/about', (req, res) => {
    res.render('about');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listenting on port...${PORT}`)
})