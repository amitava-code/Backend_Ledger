const express= require('express');
const authMiddleware= require("../middleware/auth.middleware");
const accountController= require("../controllers/account.controller");
const router= express.Router()

//POST-/api/account/
// create a account
//protected Route

router.post("/", authMiddleware.authMiddleware,accountController.createAccountController)





module.exports= router;