const collection = require('./DB/connection');
const { COLLECTION_NAME } = require('../keys/constant');
const { model } = require('mongoose');

const adminModel = {};
adminModel.showGrievances =() =>{
    return collection.getCollection(COLLECTION_NAME.GRIEVANCES)
    .then(model => model.find({status: {$lt:'05' , $gt:'-1'} }).sort({createdAt: -1}))
    .then(response =>  response);
}
adminModel.showReverseGrievances =() =>{
    return collection.getCollection(COLLECTION_NAME.GRIEVANCES)
    .then(model => model.find({$or:[{ status:{$lt:'00'}},{ status:{$gt:'04'}}]}).sort({createdAt: -1}))
    .then(response =>  response);
}
adminModel.changeGrievanceDetails = (refKey,grievanceDetails) =>{
    return collection.getCollection(COLLECTION_NAME.GRIEVANCES)
    .then(model => model.findOneAndUpdate({referenceKey:refKey},{$set:{...grievanceDetails}}))
    .then(response =>  response);
}
adminModel.addRemark =(refKey,remark) =>{
    return collection.getCollection(COLLECTION_NAME.GRIEVANCES)
    .then(model => model.findOneAndUpdate( {referenceKey:refKey}, {$set:{Remarks:remark}}, {new:true}) )
    .then(response =>  response);
}
adminModel.getDatewiseGrievance =(start,end) =>{
    console.log(start,end)
    return collection.getCollection(COLLECTION_NAME.GRIEVANCES)
    .then(model => model.find( { 'dates.submitted' :{$gte: start, $lte: end}} ))
    .then(response =>  response);
}
adminModel.getsendtolist = (role) =>{
    return collection.getCollection(COLLECTION_NAME.USERS)
    .then(model => model.find())
    .then(response => response);
}
adminModel.dealerAction = (refKey) =>{
    return collection.getCollection(COLLECTION_NAME.GRIEVANCES)
    .then(model => model.findOneAndUpdate( {referenceKey:refKey}, {$set:{status:'08'}}, {new:true}) )
    .then(response =>  response);
}
adminModel.chosAction = (refKey) =>{
    return collection.getCollection(COLLECTION_NAME.GRIEVANCES)
    .then(model => model.findOneAndUpdate( {referenceKey:refKey}, {$set:{status:'06'}}, {new:true}) )
    .then(response =>  response);
}
adminModel.gcatCount = () =>{
    console.log("TEST ddd")
    return collection.getCollection(COLLECTION_NAME.GRIEVANCES)
    .then(model => model.find())
    .then(response =>  response);
}
module.exports = adminModel;