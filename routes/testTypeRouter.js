const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const TestTypes = require('../models/testTypes')

const testTypeRouter = express.Router();

testTypeRouter.use(bodyParser.json());

testTypeRouter.route('/') // mounting
.get(authenticate.verifyUser, (req,res,next) => {
    TestTypes.find({})
    .then((testTypes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(testTypes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req,res,next) => {
    TestTypes.create(req.body)
    .then((testType) => {
        console.log('Test Type Created ', testType);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(testType);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403; //operation not supported
    res.end('PUT operation not supported on /testTypes');
})
.delete(authenticate.verifyUser, (req,res,next) => {
    TestTypes.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

testTypeRouter.route('/:testTypeId')
.get(authenticate.verifyUser, (req,res,next) => {
    TestTypes.findById(req.params.testTypeId)
    .populate('conductedBy')
    .then((testType) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(testType);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /testTypes/' 
        + req.params.testTypeId);
})
.put(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403; //operation not supported
    res.end('PUT operation not supported on /testTypes/' 
        + req.params.testTypeId);  
})
.delete(authenticate.verifyUser, (req,res,next) => {
    TestTypes.findByIdAndRemove(req.params.testTypeId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = testTypeRouter;