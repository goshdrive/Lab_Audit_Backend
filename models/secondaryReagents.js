const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const compositionSchema = new Schema({
    reagent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reagent',
        required: true        
    },
    lotNr: {
        type: String,
        required: true
    }    
}, {
    timestamps: true
});

const secReagentSchema = new Schema({
    reagentName: {
        type: String,
        required: true,
        unique: true
    },
    lotNr: {
        type: String,
        required: true,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    dateCreated: {
        type: Date,
        required: true,
    },
    assayName: {
        type: String,
        default: '',  
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  
    },
    firstUsedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  
    },
    discardedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  
    },
    lasteEditedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  
    },
    status: {
        type: String,
        default: '',  
    },
    reagents: [compositionSchema]
}, {
    timestamps: true
});

var SecReagents = mongoose.model('SecReagent', secReagentSchema);

module.exports = SecReagents;

