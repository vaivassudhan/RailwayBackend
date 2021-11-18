const jwt = require('jsonwebtoken');
const {ApiError} = require('../objectCreator/objectCreator');
const {JWT_KEY, ROLE_WITH_ADMIN_AUTH,ROLE_WITH_MGMT_AUTH} = require('../keys/constant');

const userAuth = (req,res,next)=>{
   try {
        const token = req.headers.authorization.split(" ")[1]; 
        const decoded = jwt.verify(token, JWT_KEY.SECRET);
        req.auth = {PFNumber: decoded.PFNumber, userRole: decoded.userRole};
        next();
    } catch(error){
        throw new ApiError("Authentication Failed", 401);
    }
};

const mgmtAuth = (req,res,next) =>{ 
    try{
        const token = req.headers.authorization.split(" ")[1]; 
        const decoded = jwt.verify(token, JWT_KEY.SECRET);
        // console.log(decoded)
        req.auth = {PFNumber: decoded.PFNumber, userRole: decoded.userRole};
        if( !ROLE_WITH_MGMT_AUTH.includes(req.auth.userRole)) throw 'Forbidden Access';
        next();
    }catch(error){
        throw new ApiError(error, 403);
    }
};

const adminAuth = (req,res,next) =>{ 
    try{
        const token = req.headers.authorization.split(" ")[1]; 
        const decoded = jwt.verify(token, JWT_KEY.SECRET);
        req.auth = {PFNumber: decoded.PFNumber, userRole: decoded.userRole};
        if( !ROLE_WITH_ADMIN_AUTH.includes(req.auth.userRole)) throw 'Forbidden Access';
        next();
    }catch(error){
        throw new ApiError(error, 403);
    }
};


module.exports = {userAuth, mgmtAuth, adminAuth};