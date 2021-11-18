const collection = require('./DB/connection');
const { COLLECTION_NAME } = require('../keys/constant');
const { model } = require('mongoose');

const userModel = {};

userModel.createUser = userDetails => {
    return collection.getCollection(COLLECTION_NAME.USERS)
        .then(model => model.create(userDetails))
        .then(response =>  response);
}
userModel.getAllUser = () => {
    return collection.getCollection(COLLECTION_NAME.USERS)
        .then(model => model.find())
        .then(response =>  response);
}
userModel.getUserById = PFNumber => {
    return collection.getCollection(COLLECTION_NAME.USERS)
        .then(model => model.findOne({PFNumber:PFNumber}))
        .then(response =>  response);
}
userModel.editUserById = (PFNumber,userData) => {
    console.log(userData)
    return collection.getCollection(COLLECTION_NAME.USERS)
        .then(model => model.findOneAndUpdate({PFNumber:PFNumber},{$set:{
            userRole:userData.userRole,
            userDepartment:userData.userDepartment,
            userSection:userData.userSection,
            phoneNo:userData.phoneNo,
            email:userData.email,
            isEdited:true}
        },{new:true}))
        .then(response =>  response);
}
userModel.getEditedUsers = () => {
    return collection.getCollection(COLLECTION_NAME.USERS)
        .then(model => model.find({isEdited:true}))
        .then(response =>  response);
}
userModel.putOTP=(PFNumber,OTP)=>{
    return collection.getCollection(COLLECTION_NAME.USERS)
        .then(model => model.findOneAndUpdate( {PFNumber:PFNumber}, {$set:{OTP:OTP}}, {new:true}) )
        .then(response =>  response);
}
userModel.updatePassword = (userPassword, PFNumber) => {
    return collection.getCollection(COLLECTION_NAME.USERS)
        .then(model => model.findOneAndUpdate( {PFNumber}, {$set:{userPassword}}, {new:true}) )
        .then(response =>  response);
};
/*-------------Grievances----------------*/
userModel.getAllGrievances = () =>{
    return collection.getCollection(COLLECTION_NAME.GRIEVANCES)
    .then(model => model.find())
    .then(response =>  response);
}
userModel.getAllUserGrievances = PFNumber =>{
    return collection.getCollection(COLLECTION_NAME.GRIEVANCES)
    .then(model => model.find({PFNumber:PFNumber}))
    .then(response =>  response);
}
userModel.submitGrievance = grievanceDetails =>{
    return collection.getCollection(COLLECTION_NAME.GRIEVANCES)
    .then(model => model.create(grievanceDetails))
    .then(response =>  response);
}
userModel.submitGrievances = grievanceDetails =>{
    return collection.getCollection(COLLECTION_NAME.GRIEVANCES)
    .then(model => model.insert(grievanceDetails))
    .then(response =>  response);
}
userModel.getOneGrievance = refKey =>{
    return collection.getCollection(COLLECTION_NAME.GRIEVANCES)
    .then(model => model.findOne({referenceKey:refKey}))
    .then(response =>  response);
}
/*------------------file------------------*/
userModel.addFolderPathApplication = (documents, refKey) => {
    console.log("inside model",refKey,documents)
    return collection.getCollection(COLLECTION_NAME.GRIEVANCES)
        .then(model => model.findOneAndUpdate({referenceKey:refKey},{$set:{'documents':documents}},{new:true}))
        .then(response =>  response);
}

/*-----------Employee Register-------------*/
userModel.getEmployeeById = empId => {
    return collection.getCollection(COLLECTION_NAME.EMPLOYEE)
        .then(model => model.findOne({EMPNO:empId}))
        .then(response =>  response);
}
userModel.createEmployee = userDetails => {
    return collection.getCollection(COLLECTION_NAME.EMPLOYEE)
        .then(model => model.create(userDetails))
        .then(response =>  response);
}
module.exports = userModel;