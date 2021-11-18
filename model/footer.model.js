const collection = require('./DB/connection');
const { COLLECTION_NAME } = require('../keys/constant');
const { model } = require('mongoose');

const footerModel = {};

footerModel.getFooter = () => {
    return collection.getCollection(COLLECTION_NAME.FOOTER)
        .then(model => model.find())
        .then(response =>  response);
}

module.exports = footerModel;