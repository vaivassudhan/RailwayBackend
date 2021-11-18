const express = require("express");
const adminService = require("../service/admin.service");
const { userAuth, adminAuth,mgmtAuth } = require('../middleware/auth.middleware');

const adminRouter = express.Router();

adminRouter.post("/showGrievances", mgmtAuth,(req, res, next) => {
    adminService.showGrievances(req.body)
    .then(response => res.send(response))
    .catch(error => next(error));
});
adminRouter.post("/showReverseGrievances", mgmtAuth,(req, res, next) => {
    adminService.showReverseGrievances(req.body)
    .then(response =>{res.send(response)})
    .catch(error => next(error));
});
adminRouter.post("/verifyGrievance/:refKey", mgmtAuth,(req, res, next) => {
    adminService.verifyGrievance(req.params.refKey,req.body,req.auth.userRole)
    .then(response => res.send(response))
    .catch(error => next(error));
});
adminRouter.get("/rejectGrievance/:refKey", mgmtAuth,(req, res, next) => {
    adminService.rejectGrievance(req.params.refKey,req.auth.userRole)
    .then(response => res.send(response))
    .catch(error => next(error));
});
adminRouter.post("/sendtolist", mgmtAuth,(req, res, next) => {
    adminService.getsendtolist(req.body)
    .then(response => res.send(response))
    .catch(error => next(error));
});
adminRouter.post("/grievance/add-remark/:refKey", mgmtAuth,(req, res, next) => {
    adminService.addRemark(req.params.refKey,req.body.remarks)
    .then(response => res.send(response))
    .catch(error => next(error));
});
adminRouter.post("/grievance/date-wise/", mgmtAuth,(req, res, next) => {
    adminService.getDatewiseGrievance(req.body.start,req.body.end)
    .then(response => res.send(response))
    .catch(error => next(error));
});
adminRouter.get("/edited-users", mgmtAuth,(req, res, next) => {
    adminService.getEditedUsers()
    .then(response => res.send(response))
    .catch(error => next(error));
});
adminRouter.get("/dealer-action/:refKey", mgmtAuth,(req, res, next) => {
    adminService.dealerAction(req.params.refKey)
    .then(response => res.send(response))
    .catch(error => next(error));
});
adminRouter.get("/Gcat-count", mgmtAuth,(req, res, next) => {
    adminService.gcatCount()
    .then(response => res.send(response))
    .catch(error => next(error));
});
adminRouter.get("/chos-action/:refKey", mgmtAuth,(req, res, next) => {
    adminService.chosAction(req.params.refKey)
    .then(response => res.send(response))
    .catch(error => next(error));
});
// APO , CHOS , DEALERS 
adminRouter.get("/dealersList/:chos" ,(req, res, next) => {
    adminService.dealersList(req.params.chos)
    .then(response => res.send(response))
    .catch(error => next(error));
});
adminRouter.get("/chosList" ,(req, res, next) => {
    adminService.chosList()
    .then(response => res.send(response))
    .catch(error => next(error));
});
adminRouter.get("/apoList" ,(req, res, next) => {
    adminService.APOList()
    .then(response => res.send(response))
    .catch(error => next(error));
});
module.exports = adminRouter;