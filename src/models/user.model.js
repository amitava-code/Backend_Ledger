const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");


const userSchema= new mongoose.Schema({
    email:{
        type:String,
        required:[true , "Email is required for creating a user"],
        trim:true,
        lowercase:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            ,"invalid email address"],
            unique:[true,"email already exist"]
    },
    name:{
        type:String,
        required:[true,"Name is required for creating an account"]
    },
    password:{
        type:String,
        required:[true,"Password is required for creating an account"],
        minlength:[6,"password should be conatin more than 6 characters"],
        select:false
    }
},{
    timestamps:true
})

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return
    }

    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash

    return

})

userSchema.methods.comparePassword = async function (password) {  // takes the input password form user//

    console.log(password, this.password)                          // password= input by user // this.password= hashed password saved into db 

    return await bcrypt.compare(password, this.password)          // bcrypt.compare()-> takes 2 arguments and compare 
                                                                  // password -> input plain text pass by user // this.password= hashed pass in db
                                                                  


                                                                  //bcrypt.compare()
                                                                  //Takes input password 
                                                                  //Hash it using same Salt( from stored Hash) Making a NEW HASH
                                                                  // compare NEW HASH with STORED HASH
                                                                  // RETURN true & false
                                                                
                                                            
        

}


const userModel= mongoose.model("user", userSchema)

module.exports=userModel;