const jwt = require('jsonwebtoken')
require('dotenv').config()
const jwt_secret = process.env.JWT_SECRET
const verifyJWT = (req, res,next)=>{
    const authHeder = req.headers.authorization;
    if(!authHeder || !authHeder.startsWith('Bearer ')){
        return res.status(401).json({msg:"Unauthorized"})
    }
    const token = authHeder.split(' ')[1];
    try {
        const decoded = jwt.verify(token, jwt_secret)
        req.user = decoded
        next();
    } catch (error) {
        return res.status(403).json({msg:"Invalid or expired token"})

    }
}
const isadmin = (req, res,next)=>{
    if(req.user.role !== 'systemAdmin') {
        return res.status(403).json({msg:"This Page is only for System Admin"})
    }
    next()
}
const isNormalUser = (req, res, next)=>{
    if(req.user.role !== 'normalUser'){
        return res.status(403).json({msg:"This function is only for normal users"})
    }
    next()
}
const isStoreOwner = (req, res, next)=>{
    if(req.user.role !== 'storeOwner'){
        return res.status(403).json({msg:"This function is only for store owner"})
    }
    next()
}
module.exports = { verifyJWT, isadmin, isNormalUser,isStoreOwner }