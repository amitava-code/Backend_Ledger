const transactionModel = require("../models/transaction.model");
const ledgerModel= require("../models/ledger.model");
const accountModel=require("../models/account.model");
const emailService=require("../services/email.service");
const { default: mongoose } = require("mongoose");



//THE 10-STEP TRANSFER FLOW:
 /**
  * validate request
  * validate idempotencykey
  * check account status
  * Derive sender balance from ledger
  * Create transaction(PENDING)
  * Cretae DEBIT ledger entry
  * Create CREDIT ledger entry
  * Mark transaction COMPLETED
  * Commit MoongoDB session
  * Send EMAIL notifiaction
  */

 //1 Validate Request 

async function createTransaction(req,res){

    const{fromAccount,toAccount,amount,idempotencyKey}=req.body

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"THIS field is REQUIRED "
        })
    }

    const fromUserAccount= await accountModel.findOne({
        _id:fromAccount,
    })

    const toUserAccount= await accountModel.findOne({
        _id:toAccount,
    })

    if(!fromUserAccount || !toUserAccount){
        return res.status(404).json({
            message:"Invalid from or to account"
        })
    }

}


//2 Validate IdempotencyKey


const isTransactionAlreadyExists= await transactionModel.findone({
    idempotencyKey:idempotencyKey
})

if(isTransactionAlreadyExists){
    if(isTransactionAlreadyExists.status==="COMPLETED"){
        return res.status(200).json({
            message:"Transaction already processed",
            transaction:isTransactionAlreadyExists
        })
    }
    if(isTransactionAlreadyExists.status==="PENDING"){
        return res.status(200).json({
            message:"Transaction in process"
        })
    }
    if(isTransactionAlreadyExists.sttaus==="FAILED"){
        return res.status(500).json({
            message:"Transaction processing Failed , pls RETRY"
        })
    }
    if(isTransactionAlreadyExists.status==="REVERSED"){
        return res.status(500).json({
            message:"Transaction was reversed, pls try again"
        })
    }
}


//3 Checking account status

if(fromUserAccount !== "ACTIVE" || toUserAccount !=="ACTIVE"){
    return res.status(400).json({
        message:"BOTH fromAccount and toAcoount must be ACTIVE to process transaction"
    })
}

















async function createInitialFundsTransaction(req,res){

    console.log("controller hit")

    const{ toAccount,amount,idempotencyKey}= req.body

    if(!toAccount || !amount || !idempotencyKey){    // request validation guard /**
    //                                                  without this -> invalid transaction    
    //                                                  DB integrity breaks + null values is DB  */
        return res.status(400).json({
            message:"toAccount, amount and idempotencyKey are required"
        })
    }

    const toUserAccount= await accountModel.findOne({
        _id:toAccount,
    })

    if(!toUserAccount){
        return res.status(400).json({
            message:"INVALID toAccount"
        })
    }

    const fromUserAccount= await accountModel.findOne({
        
        user: req.user._id

    })

    // if this does not exist in DB , this code will still work

    if(!fromUserAccount){
        return res.status(400).json({
            message:"System user account not found "
        })
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = new transactionModel({
        fromAccount: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    },)


    const debitLedgerEntry = await ledgerModel.create([{
        account:fromUserAccount._id,
        amount:amount,
        transaction:transaction._id,
        type:"DEBIT"
    }],{ session })


     const creditLedgerEntry = await ledgerModel.create([ {
            account: toAccount,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT"
        } ], { session })



    transaction.status="COMPLETED"
    await transaction.save({ session })

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
        message:"Initial funds transaction completed successfully",
        transaction: transaction
    })





}





module.exports={
    createTransaction,createInitialFundsTransaction
}