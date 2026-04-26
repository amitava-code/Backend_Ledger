
const userModel=require("../models/user.model");
const jwt = require("jsonwebtoken");


async function authMiddleware(req,res,next){

    
console.log("Cookies:", req.cookies);
console.log("Auth Header:", req.headers.authorization);

    const token= req.cookies?.token || req.headers.authorization?.split(" ")[1]

    if(!token){

        return res.status(401).json({
            message:"Unauthorization access , token is missing "
        })

    }



    try{

        const decoded= jwt.verify(token, process.env.JWT_SECRET )  //if token is present verify it 

        const user= await userModel.findById(decoded.userId)       //find the detail from database that comes from token

        req.user= user                                             //set the detail in req.user

        return next()                                              // forward to controller


    }catch(err){

        return res.status(401).json({
            message:"Unauthorized access , token is Invvalid"
        })
    }
}

async function authSystemUserMiddleware(req,res,next){

    console.log("cookies:", req.cookies)
    console.log("header:",req.headers.authorization)


     const token= req.cookies?.token || req.headers.authorization?.split(" ")[1]




    if(!token){
        return res.status(401).json({
            message:"Unauthorization Access, Token is Missing"
        })
    }

    try{
        const decoded= jwt.verify(token, process.env.JWT_SECRET)

        const user= await userModel.findById(decoded.userId).select("+systemUser")
        if(!user.systemUser){
            return res.status(403).json({
                message:" FORBIDDEN ACCESS , not a system user"
            })
        }

        req.user= user

        return next()
    }

    catch(err){
        return res.status(401).json({
            message:"TOKEN IS INNVALID , EXPIRED"

        })
    }


}



module.exports={
    authMiddleware,authSystemUserMiddleware
}