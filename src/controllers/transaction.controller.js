const transactionModel = require("../models/transaction.model");
const ledgerModel= require("../models/ledger.model");
const emailService=require("../services/emailservice");



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


