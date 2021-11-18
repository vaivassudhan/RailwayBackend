const jwt = require('jsonwebtoken');

const userModel = require('../model/user.model');
const { ApiError } = require('../objectCreator/objectCreator');
const { JWT_KEY } = require('../keys/constant');
const serviceUtils = require('../utils/service.util');
const adminModel = require('../model/admin.model');
const userService ={};
const footerModel = require('../model/footer.model');
const nodemailer = require('nodemailer'); 
var currentdate=new Date();
const tFactor_api="3e66fc3a-5fa4-11eb-8153-0200cd936042"

userService.createUser = userDetails => {
    return userModel.getUserById(userDetails.PFNumber)
        .then(response => {
            if(response) throw new ApiError("PFNumber already exist",400);
             return true;
        })
        .then( canCreate => {
            if(canCreate){
                let mailDetails = { 
                    from: 'Sahaayata - Southern Railways Grievance Portal', 
                    to: userDetails.email, 
                    subject: 'Southern Railway Grievance portal - Grievance Submission', 
                    text:"your grievance has been submitted successfully",
                    html: `<html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    </head>
                    <body style="font-family: Arial, Helvetica, sans-serif;">
                                    <h2 style="color:blue;text-align:center;margin-top:50px;">Welcome to Southern Railways  Grievance Portal</h2>
                                    <div style="text-align: center;">
                                    <p>
                                        Hi `+userDetails.userName+` .Your account has been created.
                                        Please use your PFNumber and password given below to login.
                                    </p>
                                    <h2 style="text-align:center"> PFNumber: `+userDetails.PFNumber+` </h2><br>
                                    <h2 style="text-align:center"> Password: `+userDetails.userPassword+` </h2><br>
                                </div>
               
                    </body>
                    </html>`
                
                }; 
                let smstext="Your account has been created. Please use your PFnumber and password to login. Password: "+userDetails.userPassword;
                // serviceUtils.sendSMS(userDetails.phoneNo,smstext)
                // serviceUtils.sendMail(mailDetails)
                return userModel.createUser(userDetails)
                .then(response => ({message: `User #${response.userName} Registered successfully. Please use your PFnumber and password to login.`}) )
            }
        })
} 
userService.editUser = (userDetails,userId) => {
        return userModel.editUser(userDetails,userId)
        .then(response => ({message: `User #${response.userName} Edited successfully`}) )
            
        
} 
userService.getAllUserDetails = () => {
    return userModel.getAllUser()
        .then(response =>{
            if(response) return response;
            throw new ApiError("User not found", 404);
        });
} 
userService.getAllEditedUsers = () => {
    return userModel.getAllUser()
        .then(response =>{
            if(response){
                console.log(response)
                let res=response.filter(r=>r.isEdited==true)
                return res;
            }
            throw new ApiError("User not found", 404);
        });
} 
userService.loginUser = async loginDetails  => {
    try{
        const userData = await userModel.getUserById(loginDetails.PFNumber);
        if(!userData) throw 401;
        else{
            const isNotMatch = loginDetails.userPassword.localeCompare(userData.userPassword);
            console.log(isNotMatch)
            if (isNotMatch)  throw 401; 
            else {
                const message = `Hi ${userData.userName}`;
                const payload = { PFNumber: userData.PFNumber, userRole: userData.userRole };
                const token = jwt.sign(payload, JWT_KEY.SECRET);
                const user = {
                    PFNumber: userData.PFNumber,
                    userName: userData.userName,
                    userRole: userData.userRole,
                    userDepartment: userData.userDepartment,
                    userSection:userData.userSection,
                    userStation:userData.userStation
                }             
                console.log(user)
                return { message, token, user };
            }
        }
    }
    catch(statusCd){
        console.log("error")
        throw new ApiError("Invalid PFNumber or password", statusCd);
    }
}

// -----------------Grievance---------------------

// userService.createNewGrievance = (grievanceDetails, PFNumber) => {
//     return userModel.getAllUserGrievances(PFNumber).then( a => a.length )
//         .then( count => serviceUtils.generateId(PFNumber,count) )
//         .then( referenceKey =>{
//             console.log(grievanceDetails);
//             //ui should send createdAt date
//             return userModel.submitGrievance({referenceKey, ...grievanceDetails})
//                 .then(response => {
//                     if(response) return response;
//                     throw new ApiError("Grievance not submitted. Please try Later! ", 500);
//                 });
//         })
//         .then( response =>{
//             return {referenceKey: response.referenceKey, message :`Grievance (Reference Key: ${response.referenceKey}) submitted successfully`};
//         });
// }

userService.createNewGrievance = (grievanceDetails, PFNumber) => {
    return userModel.getAllUserGrievances(PFNumber).then( a => a.length )
        .then( count => serviceUtils.generateId(PFNumber,count) )
        .then( refKey =>{
            grievances=[];
            categories=grievanceDetails.GCategory
            delete grievanceDetails['GCategory']
            for(var i=0; i<categories.length;i++)
            {   category=categories[i];
                var c=String(Number(refKey.count)+i).padStart(3,'0')
                var referenceKey=`${refKey.prefix}-${c}`
                grievances[i]={referenceKey,GCategory:category, ...grievanceDetails}
            }
            // MAIL Service
            let mailTransporter = nodemailer.createTransport({ 
                service: 'gmail', 
                auth: { 
                    user: 'helloworld022020@gmail.com', 
                    pass: 'SampleText00'
                } 
            }); 
            let mailDetails = { 
                from: 'Sahaayata - Southern Railway Grievance Portal', 
                to: grievanceDetails.Email, 
                subject: 'Southern Railway Grievance portal - Grievance Submission', 
                text:"your grievance has been submitted successfully",
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
                                    Hi `+grievanceDetails.userName+` . Your Grievance has been submitted successfully.
                                    You can check the grievance status by using the given reference keys.
                                </p>
                                <h2 style="text-align:center"> `+grievances[0].referenceKey+` </h2><br>
                            </div>
           
                </body>
                </html>`
            
            }; 
            mailTransporter.sendMail(mailDetails, function(err, data) { 
                if(err) { 
                    console.log('Error Occurs in sending mail in GrieSub'); 
                } else { 
                    console.log('Email sent successfully'); 
                } 
            }); 
            let smstext="Your Grievance has been successfully submitted. Use this reference key to track your grievance."+grievances[0].referenceKey;
            // serviceUtils.sendSMS(grievanceDetails.phoneNumber,smstext)
            return userModel.submitGrievance(grievances)
            .then(response => {
                if(response) return response;
                throw new ApiError("Grievance not submitted. Please try Later! ", 500);
            });
        })
        .then( response =>{
            return {referenceKey: grievances[0].referenceKey, message :`Grievance (Reference Key: ${grievances[0].referenceKey}) submitted successfully`};
        });
}

userService.getAllUserGrievances = (PFNumber) => {
    return userModel.getAllUserGrievances(PFNumber)
        .then(response =>{
            if(response) return response;
            throw new ApiError("User not found", 404);
        });
} 

userService.getOneGrievances = (refKey) => {
    return userModel.getOneGrievances(refKey)
        .then(response =>{
            if(response) return response;
            throw new ApiError("User not found", 404);
        });
} 
//File
userService.addFolderPathApplication = (acknowledgement, refKey) => {
    //console.log("inside service")
    return userModel.getOneGrievance(refKey).then(response=>{
        var doc=response.documents
        doc.acknowledgement=acknowledgement
    return userModel.addFolderPathApplication(doc, refKey)
        .then(response => {
            if(response){
                return {response, message :`Filled Application uploaded Successfully`};
            } 
            throw new ApiError("Filled Application not uploaded", 403);
        });
    }); 
}
//Employee Register 
userService.registerUser = async registerDetails  => {
    try{
        const userData = await userModel.getEmployeeById(registerDetails.PFNumber);
        console.log(userData)
        if(!userData) throw 401;
        else{
            const isNotMatch = (registerDetails.PFNumber.localeCompare(userData.EMPNO) ||  registerDetails.dob.localeCompare(userData.DOB));
            console.log("does not match",isNotMatch)
            if (isNotMatch)  throw 401; 
            else {
                var digits = '0123456789'; 
                let OTP = ''; 
                for (let i = 0; i < 4; i++ ) { 
                    OTP += digits[Math.floor(Math.random() * 10)]; 
                } 
    
                let mailDetails = { 
                    from: 'helloworld022020@gmail.com', 
                    to: registerDetails.email, 
                    subject: 'Southern Railway Grievance portal account', 
                    text: 'Please use this code to create your account '+OTP
                }; 
                serviceUtils.sendMail(mailDetails)
                serviceUtils.sendOTP(tFactor_api,OTP,registerDetails.phoneNo)
                const message = `Hi ${userData.userName}`;
                const payload = { PFNumber: userData.PFNumber, userRole: userData.userRole };
                const token = jwt.sign(payload, JWT_KEY.SECRET);
                const otp={otp:OTP}
                const user = {
                    PFNumber: userData.EMPNO,
                    userName: userData.EMPNAME,
                    userDepartment: userData.DEPT,
                    serviceStatus:userData.SERVICESTATUS,
                    email:registerDetails.email,
                    userStation:userData.STATIONCODE,
                    phoneNo:registerDetails.phoneNo
                    }             
                return { message, token, user,OTP };
                }
        }
    }
    catch(statusCd){
        console.log("errror")
        throw new ApiError("Invalid PFNumber or DOB", statusCd);
    }
}

userService.createEmployee = employeeDetails => {
    return userModel.getEmployeeById(employeeDetails.empId)
        .then(response => {
            if(response) throw new ApiError("UserId already exist",400);
             return true;
        })
        .then( canCreate => {
            if(canCreate){
                return userModel.createEmployee(employeeDetails)
                .then(response => ({message: `User #${response.PFNumber} created successfully`}) )
            }
        })
} 
userService.getUserById = (PFNumber) => {
    return userModel.getUserById(PFNumber)
    .then(response =>{
        return userModel.getAllUserGrievances(PFNumber)
        .then(res =>{
            if(res){
                var details={}
                details=response
                details.gcount=res.length;
            return {details:details,count:res.length}};
            throw new ApiError("User not found", 404);
        })
        
        
    });
} 
userService.editUserById = (PFNumber,userData) => {
    console.log("edit user service ",userData)
    return userModel.editUserById(PFNumber,userData)
    .then(response => ({message: `User #${response.PFNumber} Edited successfully`}) )
} 
userService.forgotPassword = (PFNumber) => {
    return userModel.getUserById(PFNumber)
        .then(response =>{
            if(response){
            let passdetails={oldPassword:response.userPassword,otp:''}
            var digits = '0123456789'; 
            let OTP = ''; 
            for (let i = 0; i < 4; i++ ) { 
                OTP += digits[Math.floor(Math.random() * 10)]; 
            } 

            // nexmo.message.sendSms(from, to, text);

            let mailTransporter = nodemailer.createTransport({ 
                service: 'gmail', 
                auth: { 
                    user: 'helloworld022020@gmail.com', 
                    pass: 'SampleText00'
                } 
            }); 

            let mailDetails = { 
                from: 'helloworld022020@gmail.com', 
                to: response.email, 
                subject: 'Southern Railway Grievance portal account', 
                text: 'Please use this code to reset your password '+OTP
            }; 

            mailTransporter.sendMail(mailDetails, function(err, data) { 
                if(err) { 
                    console.log('Error Occurs in sending mail reset pass'); 
                } else { 
                    console.log('Email sent successfully'); 
                } 
            }); 
            return userModel.putOTP(PFNumber,OTP)
            .then(response =>{
                if(response){
                        passdetails.otp=response.OTP
                        return passdetails
                    }
                })
            }
            throw new ApiError("User not found", 404);
        }); 
}
userService.updatePassword = (passwords,PFNumber) => {
    console.log("service",PFNumber)
    return userModel.getUserById(PFNumber)
        .then(response => {
            if(response){
                console.log("servicedd")
                if(response.userPassword !== passwords.oldPassword) throw new ApiError("Incorrect old password", 400);
                return true;
            }
        })
        .then(isoldPasswordCorrect => {
            if(isoldPasswordCorrect){
               return userModel.updatePassword(passwords.newPassword, PFNumber)
               .then( (response) =>{
                   if(response.userPassword === passwords.newPassword)
                        return {message: `Password updated successfully`}
                    throw new ApiError("Password not updated", 500);
                });
            }
        })
}; 
// Snapshots
userService.landingSnapshot = () => {
    const snapshot={};
    return userModel.getAllUser()
        .then(response =>{
            snapshot.users=response.length;
            return userModel.getAllGrievances()
            .then(response=>{
                snapshot.allGrievances=response.length;
                snapshot.verifiedGrievances=response.filter(res=> res.status=="09").length;
                snapshot.dailyGrievances=response.filter(res=> res.createdAt.getFullYear()==currentdate.getFullYear() && res.createdAt.getMonth()==currentdate.getMonth() && res.createdAt.getDate()==currentdate.getDate()).length;
                if(snapshot) return snapshot;
                throw new ApiError("User not found", 404);
            });
        });
} 
userService.homepageSnapshot = (userData) => {
    const snapshot={};
    return userModel.getAllUser()
        .then(response =>{
            snapshot.users=response.length;
            return userModel.getAllGrievances()
            .then(response=>{
                snapshot.allGrievances=response.length;
                snapshot.verifiedGrievances=response.filter(res=> res.status=="09").length;
                if(userData.userRole=="6")
                {
                    snapshot.verifiedGrievances=response.filter(res=> res.PFNumber==userData.PFNumber && res.status=='09').length;
                    snapshot.dailyGrievances=response.filter(res=> res.PFNumber==userData.PFNumber).length;}
                if(userData.userRole=="1")
                {snapshot.dailyGrievances=response.filter(grievance=>grievance.status=='01' || grievance.status=='07' || grievance.status=='-02').length;}
                if(userData.userRole=="2")
                {snapshot.dailyGrievances=response.filter(grievance=>(grievance.status=='02' || grievance.status=='06' || grievance.status=='-01') && grievance.departments.APODept == userData.userDepartment).length;}
                if(userData.userRole=="3")
                {snapshot.dailyGrievances=response.filter(grievance=>grievance.status=='00' || grievance.status=='08' || grievance.status=='-03').length;}
                if(userData.userRole=="4")
                {snapshot.dailyGrievances=response.filter(grievance=>(grievance.status=='03' || grievance.status=='05') && grievance.departments.CHOSDept == userData.userDepartment).length;}
                if(userData.userRole=="5")
                {snapshot.dailyGrievances=response.filter(grievance=>(grievance.status=='04') && grievance.departments.APODept == userData.userDepartment).length;}
                if(snapshot) return snapshot;
                throw new ApiError("User not found", 404);
            });
        });
} 
// Footer Service
userService.getFooter=()=>{
    return footerModel.getFooter()
    .then(response => {
        if(response) return response;
        throw new ApiError("Cannot Get Footer List", 500);
    });
}
module.exports = userService;