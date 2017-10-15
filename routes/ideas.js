const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/idea');
const Idea = mongoose.model('idea');

// Idea index page
router.get('/', (req, res) => {
    Idea.find({})
        .sort({date:'desc'})
        .then(ideas => {
            res.render('ideas/index', {ideas});
        });
});

// Edit idea page
router.get('/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit', {idea});
    });
    
});
// Add idea form
router.get('/add', (req, res) => {
    res.render('ideas/add');
});

// Process form
router.post('/', (req, res) => {
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
                req.flash('success_message', 'Video idea added!')
                res.redirect('/ideas');
            })
    }
    
})

// Edit form process
router.put('/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    }).then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
        .then(idea => {
            req.flash('success_message', 'Video idea updated!')
            res.redirect('/ideas');
        })
    });
});

// Delete Idea
router.delete('/:id', (req, res) => {
    Idea.remove({_id: req.params.id})
        .then(() => {
            req.flash('success_message', 'Video idea removed!')
            res.redirect('/ideas');
        });
});

module.exports = router;