const {ID_PREFIX} = require('../keys/constant');
const userModel = require('../model/user.model');

const serviceUtils = {};
const nodemailer = require('nodemailer'); 
const https = require('https');
serviceUtils.sendMail = mailDetails =>{
    let mailTransporter = nodemailer.createTransport({ 
        service: 'gmail', 
        auth: { 
            user: 'helloworld022020@gmail.com', 
            pass: 'SampleText00'
        } 
    }); 
    mailTransporter.sendMail(mailDetails, function(err, data) { 
        if(err) { 
            console.log('Error Occurs in sending mail SvcUtil'); 
        } else { 
            console.log('Email sent successfully'); 
        } 
    }); 
}
serviceUtils.sendSMS = (to,text) =>{
    var unirest = require("unirest");

    var req = unirest("GET", "https://www.fast2sms.com/dev/bulk");

    req.query({
    "authorization": "fR8XFz1DNA9aeMriqumBxyWZ4snPSCKb5vow3U26HVktLOhlIpy06SrTkpueci91wH8JQA7vVxqZaILP",
    "sender_id": "FSTSMS",
    "message": text,
    "language": "english",
    "route": "p",
    "numbers": to,
    });

    req.headers({
    "cache-control": "no-cache"
    });


    req.end(function (res) {
    if (res.error) throw new Error(res.error);

    console.log(res.body);
    });

}
serviceUtils.sendOTP =(api_key,otp,phone_number) =>{
    https.get(`https://2factor.in/API/V1/${api_key}/SMS/${phone_number}/${otp}`, (resp) => {
        let data = '';
    
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });
    
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            console.log(JSON.parse(data).explanation);
        });
    
        }).on("error", (err) => {
        console.log("Error: " + err.message);
        });
}

serviceUtils.mapProjectSummary =  projects =>{
    let result = [];
    if(projects.length > 0)
        result =  projects.map( ({
            projectId,
            projectTitle,
            projectSummary,
            team,
            remarks,
            projectDepartment,
            approved,
            keywords,
            visibility,
            isarchived,
            start,
            createdAt,
            updatedAt,
            status}) => ({
                projectId,
                projectTitle,
                projectSummary,
                team,
                remarks,
                projectDepartment,
                approved,
                keywords,
                visibility,
                isarchived,
                start,
                createdAt,
                updatedAt,
                status}) );
    return result;
}

serviceUtils.mapIdToUser =  team =>{
    return team.map( id  =>  {
        return userModel.getUserById(id).then( ({userId, userName}) =>{
            return `${userId}-${userName}`;
        })
    })
}


serviceUtils.generateId = ( prefix, count) =>{
    count=String(count+1).padStart(3,'0');

    refKey={prefix:prefix.substring(prefix.length-8),count:count};
    return refKey;
    switch(prefix){
        case ID_PREFIX.NOTIFICATION: return `${ID_PREFIX.NOTIFICATION}${100000+count+1}`;
        default: return `${prefix.substring(prefix.length-8)}-${count+1}`;
    }
}

module.exports = serviceUtils;