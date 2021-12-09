const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Issue = require('../models/issuemodel');
const issueController = require('../controller/issuecontroller');
const checkAuth = require('../middleware/userauth');

router.post('/add', checkAuth.verifyToken, issuecontroller.addIssue);
router.patch('/update/:id', checkAuth.verifyToken, issuecontroller.updateIssue);
router.get('/getall', checkAuth.verifyToken, issuecontroller.getAllIssues);
router.get('/get/:status', checkAuth.verifyToken, issuecontroller.getIssueByStatus);
router.patch('/update/:id', checkAuth.verifyToken, issuecontroller.updateIssue);
router.delete('/remove/:id', checkAuth.verifyToken, issuecontroller.deleteIssue);

module.exports = router;