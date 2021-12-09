const mongoose = require("mongoose");
const Issue = require("../models/issuemodel");
require('dotenv').config('../.env');
const checkAuth = require('../middleware/userauth');

exports.addIssue = (req, res, next) => {
    if (req.body.issueheading === undefined || req.body.issueDescription === undefined || req.body.issueStatus === undefined) {
        res.status(404).json({
            success: false,
            error: 'missing parameters!'
        });
    }
    const newIssue = new Issue({
        _id: new mongoose.Types.ObjectId(),
        issueheading: req.body.issueTitle,issueDescription: req.body.issueDesc,issueStatus: req.body.issueStatus,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        createdBy: req.userId,
        modifiedBy: req.userId
    });
    newIssue
        .save()
        .then(result => {
            console.log(`Issue with id ${result._id} added by user with id ${result.createdBy}`);
            res.status(200).json({success: true,message: "Issue Added",newIssue: result
            });
        })
        .catch(error => {
            console.log(`Error!: ${error}`);
            res.status(500).json({success: false,error: error
            });
        });
};

exports.getAllIssues = (req, res, next) => {
    Issue.find()
        .populate({ path: 'createdBy', select: 'username -_id', })
        .populate({ path: 'updatedBy', select: 'username -_id', })
        .exec()
        .then(docs => {
            res.status(200).json({success: true,message: docs
            });
        })
        .catch(error => {
            console.error('Error: ${error}');
            res.status(404).json({success: false,error: error
            });
        });
};

async function getByQuery (req, res,next){
    if(req.query.status) 
       return next();
    const query_Phase=req.query.phase;
    const prior=req.query.priority;
    try {
        const issues = await Issue.find({phase:query_Phase,priority:prior})
            .populate({path :'created_By', select: 'username -_id',}) 
            .populate({path :'updated_By', select: 'username -_id',}).exec()
        if(!issues){
            res.status(200).json({success: true,issues: docs
            })
        }
    } 
    catch (error) {
        res.status(500).send()
    }
}

exports.updateIssue = (req, res, next) => {
    const issueId = req.params.id;
    if (req.body.issueheading === undefined || req.body.issueDescription === undefined || req.body.issueStatus === undefined) {
        res.status(404).json({
            success: false,
            error: 'missing parameters'
        });
    }
    const a = await Issue.findById(issueId);
    const updatedIssue = {
        _id: issueId,
        issueheading: req.body.issueTitle,issueDescription: req.body.issueDesc,issueStatus: req.body.issueStatus,
        createdAt: a.createdAt,
        updatedAt: Date.now(),
        createdBy: a.createdBy,
        updatedBy: req.userId
    }
    Issue.findByIdAndUpdate(issueId, { $set: updatedIssue })
        .exec()
        .then(result => {
            console.log('Updated!');
            res.status(200).json({success: true,message: result
            });
        })
        .catch(err => {
            console.log('ERROR!');
            res.status(500).json({success: false,error: err
            });
        });
};

exports.deleteIssue = (req, res, next) => {
    const issueId = req.params.id;
    if (req.body.issueheading === undefined || req.body.issueDescription === undefined || req.body.issueStatus === undefined) {
        res.status(404).json({
            success: false,
            error: ' missing parameters'
        });
    }
    Issue.deleteOne({ _id: issueId })
        .exec()
        .then(result => {
            console.log(' deleted!');
            res.status(200).json({success: true,message: result
            });
        })
        .catch(err => {
            console.log(`Error in deleting issue`);
            res.status(500).json({success: false,error: err
            });
        });
}