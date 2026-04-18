const userModel= require("../models/user.model");
const jwt =require("jsonwebtoken");
const emailService= require("../services/email.service");

/** 
* - user register controller
* - POST /api/auth/register
*/

async function userregisterController(req,res){


    const{email,password,name}= req.body

    const isExists= await userModel.findOne({
        email: email
    })

    if(isExists){
        return res.status(422).json({
            message: " User already exists with same email",
            status:"failed"
        })
    }

    const user = await userModel.create({
        email,password,name                        // user is now created and exists in DataBase 
    })



// why we create TOKEN  ??


// User registers → account created → now what?


//server dose not remeber the user automatically 
//http is stateless -> so every request is independent





    const token= jwt.sign({
        userId:user._id          // identify a specific user in DB  // _id = UNIQUE ID in mongoDB 
    },process.env.JWT_SECRET,    //   TOKEN = portable identity proof with ID
     {expiresIn:"8d"})






    res.cookie("token",token)   // token saved as cookie ->  Browser automatically sends it with every request 
                                // cause Server cannot remember user between requests




    res.status(201).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name
        },
        token
    })

    await emailService.sendRegistrationEmail(user.email, user.name)


   

}

async function userLoginController(req, res) {
    const { email, password } = req.body

    const user = await userModel.findOne({ email }).select("+password")

    if (!user) {
        return res.status(401).json({
            message: "Email or password is INVALID"   // why validate same messgae twice cause attackers can now if the email is correct right or wrong

                                                       // email wrong NO
                                                       //password wrong NO 


                                                       // YES email or password is invalid

        })
    }

    const isValidPassword = await user.comparePassword(password)

    if (!isValidPassword) {
        return res.status(401).json({
            message: "Email or password is INVALID"
        })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "8d" })

    res.cookie("token", token)

    res.status(200).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })


}


module.exports={ userregisterController,userLoginController};