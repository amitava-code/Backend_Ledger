const mongoose= require("mongoose");


const ledgerSchema= new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true, "Ledger must be associated with an account"],
        index:true,
        immutable:true
    },
    amount:{
        type:Number,
        required:[true,"Amount is required for creating a ledger entry"],
        immutable:true
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"transaction",
        required:[true, "Ledger must be associated with a transaction"],
        index:true,
        immutable:true
    },
    type:{
         type:String,
         enum:{
            values:["CREDIT","DEBIT"],
            message:"Types can be either CREDIT or DEBIT",
         },
         required:[true, "Ledger type is required"],
         immutable:true
    }
})


function preventLedgerMOdification(){
    throw new Error("Ledger_entriesa are immutable and cannot be modified or deleted");
}

ledgerSchema.pre('findOneAndUpdate',preventLedgerMOdification);
ledgerSchema.pre('updateOne',preventLedgerMOdification);
ledgerSchema.pre('deleteOne',preventLedgerMOdification);
ledgerSchema.pre('remove',preventLedgerMOdification);
ledgerSchema.pre('deleteMany',preventLedgerMOdification);
ledgerSchema.pre('updateMany',preventLedgerMOdification);
ledgerSchema.pre('findOneAndDelete',preventLedgerMOdification);
ledgerSchema.pre('findOneAndReplace',preventLedgerMOdification);


const ledgerModel= mongoose.model("ldger",ledgerSchema);

module.exports=ledgerModel;
