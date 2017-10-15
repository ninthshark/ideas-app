const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/vidjot', {useMongoClient:true})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err.message));

// Load Idea Model
require('./models/idea');
const Idea = mongoose.model('idea');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Middlewear
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.get('/', (req, res, next) => {    
    res.render('index', {title:"Welcome"});
});

app.get('/about', (req, res) => {
    res.render('about');
});

// Idea index page
app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({date:'desc'})
        .then(ideas => {
            res.render('ideas/index', {ideas});
        });
});

// Edit idea page
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit', {idea});
    });
    
});
// Add idea form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

// Process form
app.post('/ideas', (req, res) => {
    let errors = [];

    if(!req.body.title) {
        errors.push({text: 'Please add a title'});
    }
    if(!req.body.details) {
        errors.push({text: 'Please add some details'});
    }

    if(errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                res.redirect('/ideas');
            })
    }
    
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listenting on port...${PORT}`)
})