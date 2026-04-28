const express= require('express');
const authMiddleware= require("../middleware/auth.middleware");
const accountController= require("../controllers/account.controller");
const router= express.Router()

//POST-/api/account/
// create a account
//protected Route

router.post("/", authMiddleware.authMiddleware,accountController.createAccountController)

router.get("/",authMiddleware.authMiddleware, accountController.getUserAccountsController)


router.get("/balance/:accountId", authMiddleware.authMiddleware, accountController.getAccountBalanceController)


module.exports= router;