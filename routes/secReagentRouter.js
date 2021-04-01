const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const SecReagents = require('../models/secondaryReagents')

const reagentRouter = express.Router();

reagentRouter.use(bodyParser.json());

reagentRouter.route('/') // mounting
.get(authenticate.verifyUser, (req,res,next) => {
    SecReagents.find({})
    .populate('receivedBy')
    .populate('lastEditedBy')
    .populate('discardedBy')
    .populate('firstUsedBy')
    .then((secReagents) => {
        secReagents = secReagents.filter(entry => entry.status != "DELETED");
        out_secReagents = secReagents.map(entry => {
            let temp = {
                lastEditedBy: entry.lastEditedBy ? (entry.lastEditedBy.lastName + ", " + entry.lastEditedBy.firstName): null,
                createdBy: entry.createdBy ? (entry.createdBy.lastName + ", " + entry.createdBy.firstName): null,
                receivedBy: entry.receivedBy ? (entry.receivedBy.lastName + ", " + entry.receivedBy.firstName): null,
                discardedBy: entry.discardedBy ? (entry.discardedBy.lastName + ", " + entry.discardedBy.firstName): null,
            }
            return {...entry._doc, ...temp}
        });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(out_secReagents);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req,res,next) => {
    req.body.createdBy = req.user._id;
    SecReagents.create(req.body)
    .then((secReagent) => {
        console.log('Reagent Created ', secReagent);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(secReagent);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403; //operation not supported
    res.end('PUT operation not supported on /secondary-reagents');
})
.delete(authenticate.verifyUser, (req,res,next) => {
    SecReagents.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

reagentRouter.route('/:secReagentId')
//populate user ids
.get((req,res,next) => {
    SecReagents.findById(req.params.secReagentId)
    .populate('createdBy')
    .populate('lastEditedBy')
    .populate('discardedBy')
    .populate('firstUsedBy')
    .then((secReagent) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(secReagent);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /secondary-reagents/' 
        + req.params.secReagentId);
})
.put(authenticate.verifyUser, (req,res,next) => {
    if (req.query.action === "editDetails") {
        req.body.lastEditedBy = req.user._id;
        var filter = {_id: req.params.secReagentId};
    }    
    else if (req.query.action === "discard") {
        req.body.discardedBy = req.user._id;
        req.body.status = "DISPOSED"; 
        var filter = {_id: req.params.secReagentId};
    }
    else if (req.query.action === "firstTest") {
        req.body.firstUsedBy = req.user._id;
        var filter = {_id: req.params.secReagentId, "firstUsedBy": null};
    }
    else {
        var filter = {_id: req.params.secReagentId};
    }
    SecReagents.findOneAndUpdate(filter, {
        $set: req.body
    }, { new: true })
    .then((secReagent) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(secReagent);
    }, (err) => next(err))
    .catch((err) => next(err));  
})
.delete(authenticate.verifyUser, (req,res,next) => {
    SecReagents.findByIdAndRemove(req.params.secReagentId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = reagentRouter;