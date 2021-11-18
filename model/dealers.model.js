const collection = require('./DB/connection');
const { COLLECTION_NAME } = require('../keys/constant');
const { model } = require('mongoose');

const dealersModel = {};
/*-----------APO & DEALERS-------------*/
dealersModel.dealersList = chos => {
    return collection.getCollection(COLLECTION_NAME.DEALERS)
        .then(model => model.find({Section:chos}))
        .then(response =>  response);
}
dealersModel.chosList = () => {
    return collection.getCollection(COLLECTION_NAME.DEALERS)
        .then(model => model.find())
        .then(response =>  response);
}
dealersModel.shiftDealerToOtherList = (chos1,list1,chos2,list2) => {
    return collection.getCollection(COLLECTION_NAME.DEALERS)
        .then(model => model.findOneAndUpdate({Section:chos1},{$set:{Dealers:list1}}, {new:true}))
        .then(model => model.findOneAndUpdate({Section:chos2},{$set:{Dealers:list2}}, {new:true}))
        .then(response =>  response);
}
dealersModel.addDealerToList = (chos,updatedlist) => {
    return collection.getCollection(COLLECTION_NAME.DEALERS)
        .then(model => model.findOneAndUpdate({Section:chos},{$set:{Dealers:updatedlist}}, {new:true}))
        .then(response =>  response);
}
// dealersModel.combinedCHOSList = () => {
//     return collection.getCollection(COLLECTION_NAME.DEALERS)
//         .then(model =>{
//            var x= model.find()
//            return collection.getCollection(COLLECTION_NAME.CHOS).then(model=>{
//                var y= model.find() 
//                return x,y;
//            })
//         })
//         .then(response =>  response);
// }
dealersModel.oneApoChosList = APO => {
    return collection.getCollection(COLLECTION_NAME.CHOS)
        .then(model => model.find({$or:[{APO:APO},{APO:'Common'}]}))
        .then(response =>  response);
}
dealersModel.APOList = () => {
    return collection.getCollection(COLLECTION_NAME.CHOS)
        .then(model => model.find())
        .then(response =>  response);
}
dealersModel.shiftCHOSToOtherList = (apo1,list1,apo2,list2) => {
    return collection.getCollection(COLLECTION_NAME.DEALERS)
        .then(model => model.findOneAndUpdate({APO:apo1},{$set:{Sections:list1}}, {new:true}))
        .then(model => model.findOneAndUpdate({APO:apo2},{$set:{Sections:list2}}, {new:true}))
        .then(response =>  response);
}
dealersModel.addCHOSToList = (apo,updatedlist) => {
    return collection.getCollection(COLLECTION_NAME.DEALERS)
        .then(model => model.findOneAndUpdate({APO:apo},{$set:{Sections:updatedlist}}, {new:true}))
        .then(response =>  response);
}

module.exports = dealersModel;