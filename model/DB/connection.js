const mongoose = require("mongoose");
const {COLLECTION_NAME} = require('../../keys/constant');

mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

mongoose.set("useCreateIndex", true);
mongoose.set('useFindAndModify', false);

const userObj = {
    "PFNumber":{ type:String, required:true },
    "userName": { type: String, required: true },
    "userPassword": { type: String, required: true },
    "phoneNo":{type:String},
    "email":{type:String,default:''},
    "userRole": { type: String, default: '6' },
    "userDepartment": { type: String,default:''},
    "userSection": { type: String,default:''},
    "userStation": { type: String,default:''},
    "serviceStatus":{type:String},
    "DOB":{type:String},
    "DOA":{type:String},
    "Token":{type:String},
    "OTP":{type:String,default:''},
    "isEdited":{type:Boolean,default:false}
};

const departmentObj = {
    "departmentId":{ type:String, required:true },
    "departmentName": { type:String, required:true },
    "Sections": { 
        type: [{
            "sectionId": { type: String, required: true },
            "sectionName": { type: String, required: true },
        }],
        default: []
    }
};

const grievanceObj = {
    "PFNumber":{ type:String, required:true },
    "userName": { type: String, required: true },
    "phoneNumber":{type:String},
    "Email":{type:String,default:''},
    "GCategory": { 
        type: [{ type: String, required: true }],
        required: true
    },
    "Description":{ type:String},
    "referenceKey":{ type:String, required: true},
    "status": { type: String},
    "Remarks":{ type:[{type:String}]}, 
    "documents":{
        type:{
            acknowledgement:[{
                fileName:{ type:String },
                path:{ type:String }
            }],
            filledApplication:
            {type:[{
                fileName:{ type:String},
                path:{type:String}
            }]}        
            }
    },
    "dates":{
        "submitted":{type:Date,required : true},
        "start":{type:Date},
        "end":{type:Date}
    },
    "departments":{
        "APODept":{type:String,default:''},
        "CHOSDept":{type:String,default:''},
        "dealerSection":{type:String,default:''}
    }
};
const EmployeeObj={
    "DEPT": {type:String},
        "BILLUNIT": {type:String},
        "EMPNO": {type:String,required:true},
        "EMPNAME": {type:String},
        "DESIG": {type:String},
        "STATIONCODE": {type:String},
        "DOB": {type:String},
        "DOA": {type:String},
        "EMPGROUP": {type:String},
        "PAYRATE": {type:String},
        "PC7_LEVEL": {type:String},
        "PAN": {type:String},
        "PRAN": {type:String},
        "FATHERNAME": {type:String},
        "SEX": {type:String},
        "EMPTYPE": {type:String},
        "SERVICESTATUS": {type:String}
}
const notificationObj = {
    "id":{type:String, required:true},
    "from": { type: String, required: true },
    "to":{
        type:[{ type: String, required: true}]
    },
    "payload":{ type:String, required: true},
    "unread":{type:Boolean,default:true},
    "type":{type:String,default:'alert info'}
};
const dealersObj ={
    "Section":{type:String},
    "Dealers":{ type:[{type:String}]}, 
}
const CHOSObj ={
    "APO":{type:String},
    "Sections":{ type:[{type:String}]}, 
}
const FooterObj ={
    "Name":{type:String},
    "Desgn":{type:String},
    "CUG No":{type:String}, 
    "eMail ID":{type:String}, 
}
const connection = {};
const usersSchema = new Schema(userObj, { collection: "Users", timestamps: true });
const departmentsSchema = new Schema(departmentObj, { collection: "Departments", timestamps: true });
const grievancesSchema = new Schema(grievanceObj, { collection: "Grievances", timestamps: true });
const notificationsSchema = new Schema(notificationObj, { collection: "Notifications", timestamps: true });
const EmployeeSchema = new Schema(EmployeeObj, { collection: "Employee", timestamps: true });
const CHOSSchema = new Schema(CHOSObj, { collection: "CHOS", timestamps: true });
const DealerSchema = new Schema(dealersObj, { collection: "Dealers", timestamps: true });
const FooterSchema = new Schema(FooterObj, { collection: "Footer", timestamps: true });


connection.getCollection = collectionName => {
    const DB_HOST = "mongodb+srv://dbuser:SampleText00@cluster0.2f1cz.mongodb.net";
    return mongoose.connect(`${DB_HOST}/SRGP`, 
    {useNewUrlParser: true, useUnifiedTopology: true}).then((db) => {
        switch (collectionName){
            case COLLECTION_NAME.USERS: return db.model(collectionName, usersSchema);
            case COLLECTION_NAME.DEPARTMENTS: return db.model(collectionName, departmentsSchema);
            case COLLECTION_NAME.GRIEVANCES: return db.model(collectionName, grievancesSchema);
            case COLLECTION_NAME.NOTIFICATIONS: return db.model(collectionName, notificationsSchema);
            case COLLECTION_NAME.EMPLOYEE: return db.model(collectionName,EmployeeSchema);
            case COLLECTION_NAME.CHOS: return db.model(collectionName,CHOSSchema);
            case COLLECTION_NAME.DEALERS: return db.model(collectionName,DealerSchema);
            case COLLECTION_NAME.FOOTER: return db.model(collectionName,FooterSchema);
        }
    }).catch(err => {
        let error = new Error("Could not connect to database");
        error.status = 500;
        throw error;
    });
}

module.exports = connection;