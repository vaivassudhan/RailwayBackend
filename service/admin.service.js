const jwt = require('jsonwebtoken');

const adminModel = require('../model/admin.model');
const userModel = require('../model/user.model');
const dealersModel = require('../model/dealers.model');
const footerModel = require('../model/footer.model');
const { ApiError } = require('../objectCreator/objectCreator');
const serviceUtils = require('../utils/service.util');

const adminService ={};
var currentdate=new Date();
var startdate=new Date(2021,0,1)

adminService.showGrievances = (mgmtData) => {
    if(mgmtData.userRole>5){throw new ApiError("Unauthorized",401);}
    return adminModel.showGrievances()
    .then(response =>{
        if(mgmtData.userRole==1){
            return response.filter(grievance=>grievance.status=='01');
        }
        
        if(mgmtData.userRole==2){
            return response.filter(grievance=>grievance.status=='02' && grievance.departments.APODept == mgmtData.userDepartment);
        }
        
        if(mgmtData.userRole==3){
            return response.filter(grievance=>grievance.status=='00');
        }
        
        if(mgmtData.userRole==4){
            return response.filter(grievance=>grievance.status=='03' && grievance.departments.CHOSDept == mgmtData.userDepartment);
        }
        
        if(mgmtData.userRole==5){
            return response.filter(grievance=>grievance.status=='04' && grievance.departments.dealerSection == mgmtData.userSection);
        }
        if(response) return response;
        throw new ApiError("Grievance not found", 404);
    });
} 
adminService.showReverseGrievances= (mgmtData) => {
    if(mgmtData.userRole>5){throw new ApiError("Unauthorized",401);}
    return adminModel.showReverseGrievances()
    .then(response =>{
        if(mgmtData.userRole==1){
            return response.filter(grievance=>grievance.status=='07' || grievance.status=='-02');
        }
        
        if(mgmtData.userRole==2){
            return response.filter(grievance=>grievance.status=='06'&& grievance.departments.APODept == mgmtData.userDepartment);
        }
        
        if(mgmtData.userRole==3){
            return response.filter(grievance=>grievance.status=='08' || grievance.status=='-03');
        }
        
        if(mgmtData.userRole==4){
            console.log(response.filter(grievance=>grievance.status=='05'));
            return response.filter(grievance=>grievance.status=='05' && grievance.departments.CHOSDept == mgmtData.userDepartment);
        }
        if(response) return response;
        throw new ApiError("Grievance not found", 404);
    });
}
adminService.verifyGrievance= (refKey,editedData,userRole) => {
    console.log("testt")
    if(userRole>5){throw new ApiError("Unauthorized",401);}
    return userModel.getOneGrievance(refKey)
    .then(response =>{
        if(userRole==1){
            if(response.status=='01')
            {
                response.status='02';
                console.log('SUPER ADMIN',editedData)
                response.departments.APODept=editedData.department
            }
            else if(response.status=='07')
            {
                response.status='08';
            }
        }
        if(userRole==2){
            if(response.status=='02')
            {
                response.status='03';
                response.departments.CHOSDept=editedData.department
            }
            else if(response.status=='06')
            {
                response.status='07';
            }        
        }
        if(userRole==3){
            if(response.status=='00')
            {
                response.status='01';
                response.dates.start=currentdate;
            }
            else if(response.status=='08')
            {
                response.status='09';
                response.dates.end=currentdate;
                let mailDetails = { 
                    from: 'Sahaayata - Southern Railways Grievance Portal', 
                    to: response.Email, 
                    subject: 'Southern Railway Grievance portal - Grievance Submission', 
                    text:"your grievance has been verified successfully",
                    html: `<html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    </head>
                    <body style="font-family: Arial, Helvetica, sans-serif;">
                                    <h2 style="color:blue;text-align:center;margin-top:50px;"> Your Grievance successfully submitted.</h2>
                                    <div style="text-align: center;">
                                    <p>
                                        Hi `+response.userName+` . Your Grievance has been verified successfully.
                                        Thank you 
                                    </p>
                                </div>
               
                    </body>
                    </html>`
                
                }; 
                serviceUtils.sendMail(mailDetails)
            }        
        }
        if(userRole==4){
            if(response.status=='03')
            {
                response.status='04';
                response.departments.dealerSection=editedData.section
            }
            else if(response.status=='05')
            {
                response.status='06';
            }
        }
        if(userRole==5){
            if(response.status=='04')
            {
                response.status='05';
            }
        }
        return adminModel.changeGrievanceDetails(refKey,response).then(response =>{
        if(response) return response;
        throw new ApiError("Grievance not verified", 403);});
    });
}
adminService.rejectGrievance = (refKey,userRole) => {
    if(userRole>5){throw new ApiError("Unauthorized",401);}
    return userModel.getOneGrievance(refKey)
    .then(response =>{
        if(userRole==1){
            if(response.status=='-02' || response.status=='01')
            {
                response.status='-03';
            }
        }
        if(userRole==2){
            if(response.status=='-01' || response.status=='02')
            {
                response.status='01';
            }       
        }
        if(userRole==3){
            if(response.status=='-03')
            {
                response.dates.end=currentdate;
                response.status='-04';
                let remark='';
                for(var i=0;i<response.Remarks.length;i++){
                    remark=remark+response.Remarks[i]+'. ';
                }
                let mailDetails = { 
                    from: 'Sahaayata - Southern Railways Grievance Portal', 
                    to: response.Email, 
                    subject: 'Southern Railway Grievance portal - Grievance Submission', 
                    text:"your grievance has been Regreted",
                    html: `<html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    </head>
                    <body style="font-family: Arial, Helvetica, sans-serif;">
                                    <h2 style="color:blue;text-align:center;margin-top:50px;"> Your Grievance successfully submitted.</h2>
                                    <div style="text-align: center;">
                                    <p>
                                        Hi `+response.userName+` . Your Grievance has been regreted.
                                        `+remark+`
                                        Thank you 
                                    </p>
                                </div>
               
                    </body>
                    </html>`
                
                }; 
                serviceUtils.sendMail(mailDetails)
            }    
        }
        if(userRole==4){
            if(response.status=='03')
            {
                response.status='02';
            }
        }
        if(userRole==5){
            if(response.status=='04')
            {
                response.status='03';
            }
        }
        console.log(response)
        return adminModel.changeGrievanceDetails(refKey,response).then(response =>{
        if(response) return response;
        throw new ApiError("Grievance not verified", 403);});
    });
}
adminService.getsendtolist = (mgmtData) => {
    if(mgmtData.userRole>5){throw new ApiError("Unauthorized",401);}
    return adminModel.getsendtolist()
    .then(response =>{
        if(mgmtData.userRole==1){
            return response.filter(res=>res.userRole=='2');
        }
        
        if(mgmtData.userRole==2){
            return response.filter(res=>res.userRole=='4');
        }
        
        // if(mgmtData.userRole==3){
        //     return response.filter(grievance=>grievance.status=='00');
        // }
        
        if(mgmtData.userRole==4){
            return response.filter(res=>res.userRole==5 && res.userDepartment==mgmtData.userDepartment);
        }
        
        // if(mgmtData.userRole==5){
        //     return response.filter(grievance=>grievance.status=='04' && grievance.departments.dealerSection == mgmtData.userSection);
        // }
        if(response) return response;
        throw new ApiError("Grievance not found", 404);
    });
} 
adminService.addRemark = (refKey, remark) => {
    return adminModel.addRemark(refKey,remark)
    .then(response => {
        if(response) return response;
        throw new ApiError("Cannot add remark", 500);
    });
}
adminService.getDatewiseGrievance = (start, end) => {
    if(!start){start=startdate}
    if(!end){end=currentdate}
    var day = new Date(end);
    var nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    return adminModel.getDatewiseGrievance(start,nextDay)
    .then(response => {
        if(response) return response;
        throw new ApiError("Cannot add remark", 500);
    });
}
adminService.getEditedUsers = () => {
    return userModel.getEditedUsers()
    .then(response => {
        if(response) return response;
        throw new ApiError("Cannot add remark", 500);
    });
}
adminService.dealerAction = (refKey) => {
    return adminModel.dealerAction(refKey)
    .then(response => {
        if(response) return response;
        throw new ApiError("Cannot forward", 500);
    });
}
adminService.chosAction = (refKey) => {
    return adminModel.chosAction(refKey)
    .then(response => {
        if(response) return response;
        throw new ApiError("Cannot forward", 500);
    });
}
adminService.gcatCount = () => {
    return adminModel.gcatCount()
    .then(response => {
        if(response) {
            let catCount={};
            for(var i=0;i<response.length;i++){
                console.log(response[i].GCategory[0])
                console.log(catCount.hasOwnProperty(response[i].GCategory[0]))
                if (catCount.hasOwnProperty(response[i].GCategory[0])) {
                    catCount[response[i].GCategory[0]]+=1;
                    console.log("inside if")
                }
                else{
                    catCount[response[i].GCategory[0]]=1;
                }
            } 
            console.log(catCount)
            return catCount;
        }
        throw new ApiError("Cannot forward", 500);
    });
}
// Dealers APO , CHOS
adminService.dealersList = (chos) => {
    return dealersModel.dealersList(chos)
    .then(response => {
        if(response) return response;
        throw new ApiError("Cannot add remark", 500);
    });
}
adminService.chosList = () => {
    return dealersModel.chosList()
    .then(response => {
        if(response) return response;
        throw new ApiError("Cannot Get CHOS List", 500);
    });
}
adminService.APOList = () => {
    return dealersModel.APOList()
    .then(response => {
        if(response) return response;
        throw new ApiError("Cannot Get APO List", 500);
    });
}

module.exports = adminService;