const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const Tests = require('../models/tests')

const testRouter = express.Router();

testRouter.use(bodyParser.json());

testRouter.route('/') // mounting
.get(authenticate.verifyUser, (req,res,next) => {
    Tests.find({})
    .populate('conductedBy')
    .then((tests) => {
        out_tests = tests.map(entry => {
            let temp = {
                conductedBy: entry.conductedBy ? (entry.conductedBy.lastName + ", " + entry.conductedBy.firstName): null,
            }
            return {...entry._doc, ...temp}
        });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(out_tests);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req,res,next) => {
    req.body.conductedBy = req.user._id;
    Tests.create(req.body)
    .then((test) => {
        console.log('Test Created ', test);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(test);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403; //operation not supported
    res.end('PUT operation not supported on /tests');
})
.delete(authenticate.verifyUser, (req,res,next) => {
    Tests.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

testRouter.route('/:testId')
//populate user ids
.get(authenticate.verifyUser, (req,res,next) => {
    Tests.findById(req.params.testId)
    .populate('conductedBy')
    .then((test) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(test);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /tests/' 
        + req.params.testId);
})
.put(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403; //operation not supported
    res.end('PUT operation not supported on /tests/' 
        + req.params.testId);  
})
.delete(authenticate.verifyUser, (req,res,next) => {
    Tests.findByIdAndRemove(req.params.testId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = testRouter;