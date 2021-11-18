const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, callback) =>{
        const path = `./FileSystem/${req.folderPath}`;
        let folderNames = path.split('/');
        let currentPath = '.';
        let i = 1;
        do{     
            currentPath += `/${folderNames[i]}`;
            if (!fs.existsSync(currentPath)){
                fs.mkdirSync(currentPath);
            }
            ++i;
        }while(i < folderNames.length);
        callback(null, path)
    },
    filename:(req, file, callback) =>{
        let fullName = file.originalname;
        let fileName = fullName.split(".")[0] 
        let ext = fullName.split(".")[1];
        callback(null,`${fileName}-${Date.now()}.${ext}`)
    }
});

const upload = multer({storage:storage});

const setPathFilledApplication = (req,res,next) =>{ 
    try{
        req.folderPath = `/FundingProject/${req.params.fundingProjectId}/FilledApplication`;
        next();
    }catch(error){
        throw new ApiError(error, 403);
    }
};
const setPathgrievanceApplication = (req,res,next) =>{ 
    try{
        req.folderPath = `/Grievance/${req.params.PFNumber}/File`;
        next();
    }catch(error){
        throw new ApiError(error, 403);
    }
};
const setPathPublicationApplication = (req,res,next) =>{ 
    try{
        req.folderPath = `/Publication/${req.params.publicationId}/File`;
        next();
    }catch(error){
        throw new ApiError(error, 403);
    }
};
const setPathAck = (req,res,next) =>{ 
    try{
        req.folderPath = `/Grievance/${req.params.refKey}/Acknowledgement`;
        next();
    }catch(error){
        throw new ApiError(error, 403);
    }
};

module.exports = {upload, setPathgrievanceApplication,setPathFilledApplication, setPathAck,setPathPublicationApplication};