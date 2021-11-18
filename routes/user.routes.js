const express = require("express");
const usersService = require("../service/user.service");
const { userAuth, adminAuth } = require('../middleware/auth.middleware');
const userService = require("../service/user.service");
const {upload,setPathgrievanceApplication, setPathFilledApplication, setPathAck} = require('../middleware/file-system.middleware');
const userRouter = express.Router();
const path = require('path');
userRouter.post("/login", (req, res, next) => {
    usersService.loginUser(req.body)
    .then(response => res.send(response))
    .catch(error => next(error));
});
// Landing Snapshot Details
userRouter.get("/landingSnapshot", (req, res, next) => {
    console.log('in routes');
    usersService.landingSnapshot()
        .then(response => res.send(response))
        .catch(error => next(error));
});
userRouter.post("/registerValidation", (req, res, next) => {
    usersService.registerUser(req.body)
    .then(response => res.send(response))
    .catch(error => next(error));
});
userRouter.post("/create", (req, res, next) => {
    usersService.createUser(req.body)
    .then(response => res.send(response))
    .catch(error => next(error));
});
// Footer
userRouter.get("/footer", (req,res,next) =>{
    userService.getFooter(req.params.refKey)
    .then(response =>res.send(response))
    .catch(error => next(error));
});
userRouter.get("/:PFNumber", userAuth, (req, res, next) => {
    usersService.getUserById(req.params.PFNumber)
    .then(response => res.send(response))
    .catch(error => next(error));
});

userRouter.post("/edit/:PFNumber", adminAuth, (req, res, next) => {
    usersService.editUserById(req.params.PFNumber,req.body)
    .then(response => res.send(response))
    .catch(error => next(error));
});
userRouter.get("/all", (req, res, next) => {
    usersService.getAllUserDetails()
    .then(response => res.send(response))
    .catch(error => next(error));
});
// userRouter.get("/edited-users/", (req, res, next) => {
//     console.log("test")
//     usersService.getAllEditedUsers()
//     .then(response => res.send(response))
//     .catch(error => next(error));
// });
userRouter.post("/createEmployee", adminAuth, (req, res, next) => {
    usersService.createEmployee(req.body)
    .then(response => res.send(response))
    .catch(error => next(error));
});
// Password Rest functions
userRouter.get("/forgotpassword/:PFNumber", (req, res, next) => {
    usersService.forgotPassword(req.params.PFNumber)
    .then(response => res.send(response))
    .catch(error => next(error));
});
userRouter.put("/update-password/:PFNumber", (req, res, next) => {
    usersService.updatePassword(req.body, req.params.PFNumber)
    .then(response => res.send(response))
    .catch(error => next(error));
});
// USER GRIEVANCES
userRouter.get("/userGrievances/:PFNumber",userAuth, (req,res,next) =>{
    userService.getAllUserGrievances(req.params.PFNumber)
    .then(response =>res.send(response))
    .catch(error => next(error));
});
userRouter.post("/new-grievance", userAuth, (req, res, next) => {
    userService.createNewGrievance(req.body, req.auth.PFNumber)
        .then(response => res.status(201).send(response))
        .catch(error => next(error));
});
userRouter.get("/grievance/:refKey",userAuth, (req,res,next) =>{
    userService.getOneGrievances(req.params.refKey)
    .then(response =>res.send(response))
    .catch(error => next(error));
});
//File upload
userRouter.put("/file-upload/:refKey",
    userAuth,
    setPathAck,
    upload.single('file'),
    (req, res, next) => {
        
    const acknowlegdment = {
    path : req.file.destination,
    fileName: req.file.filename
    }
    
userService.addFolderPathApplication(acknowlegdment, req.params.refKey)
.then(response => res.status(201).send(response))
.catch(error => next(error));
});
userRouter.put("/grievance-file-upload/:PFNumber",
    userAuth,
    setPathgrievanceApplication,
    upload.single('file'),
    (req, res, next) => {
    const filledApplication = {
    path : req.file.destination,
    fileName: req.file.filename
    }
    res.status(200).send(filledApplication)
    });
userRouter.post("/download", userAuth, (req, res, next) => {
    const docPath = path.join(__dirname,`../`) + req.body.path;
    res.sendFile(docPath);
});
//homepage snapshot
userRouter.post("/homepageSnapshot/", userAuth, (req, res, next) => {
    userService.homepageSnapshot(req.body)
        .then(response => res.status(201).send(response))
        .catch(error => next(error));
});

module.exports = userRouter;