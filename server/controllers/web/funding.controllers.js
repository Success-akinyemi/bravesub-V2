import TransactionModel from "../../model/Transaction.js";
import UserModel from "../../model/User.js";
import axios from 'axios'

export async function fundAcct(req, res) {
    try {
      const { email, amount } = req.body;
      if(!email){
        return res.status(404).json({ success: false, data: 'Email Address is required'})
      }
      const userExist = await UserModel.findOne({ email: email })
      if(!userExist){
        return res.status(404).json({ success: false, data: 'Email address does not exist' })
      }
      if(!amount){
        return res.status(404).json({ success: false, data: 'Amount is required'})
      }
      if(amount === 0){
        return res.status(404).json({ success: false, data: 'Amount is invalid'})
      }
      const numberRegex = /^(0|[1-9]\d*)$/
      if(!numberRegex.test(amount)){
        return res.status(404).json({ success: false, data: 'Amount is inavlid'})
      }
      const fullAmount = amount * 100;
  
      const response = await axios.post(
        `${process.env.PAYSTACK_INITIALIZE_URL}`,
        {
          email,
          amount: fullAmount,
          callback_url: req.body.fromWhatsApp ? `${process.env.CALLBACK_URL3}` : `${process.env.CALLBACK_URL}`
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_LIVE_SK}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log(response.data);
      const { authorization_url, reference } = response.data.data;
      console.log('refrence',reference)
      
      res.send({ authorizationUrl: authorization_url });
  
  
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Unable to initialize transaction' });
    }
}

export async function paystackWebhook(req, res) {
    const { event, data } = req.body;
  
    // Handle different webhook events
    if (event === 'charge.success') {
      const metadata = data;
      const email = data.customer.email
      const amount = data.amount;
      const refrence = data.reference || ''
      console.log('Amount>>',amount, '>>EMAIL>>',email)
      console.log('Meta data>>',metadata)
      
      const user = await UserModel.findOne({ email });
  
      if (user) {
        const value = amount / 100; // Convert from kobo to naira
        user.acctBalance += value;
        await user.save();
        console.log('Account funded for user:', email);
        const transactionRef = refrence || 'no transaction refrence';
  
        // Saving the transaction
        const transactionData = {
          userId: user._id,
          transcationType: 'Account Funding',
          transactionId: transactionRef,
          email: user.email,
          amount: parseFloat(value),
          transcationDesc: `Account funded successful with ${value}`,
          transcationStatus: 'Successful'
        };
        const createdTransaction = await TransactionModel.create(transactionData);
        console.log('Transaction>>', createdTransaction)
      } else {
        console.log('User not found');
      }
  
      console.log('Successful transaction:');
    } else if (event === 'charge.failed') {
      console.log('Transaction Failure');
    }
  
    res.status(200).end();
  }

export async function verifyPaystackPayment(req, res){
    const { paymentReference } = req.body
    console.log('REFF',paymentReference)
    try {
        if(!paymentReference){
            return res.status(404).json({ success: false, data: 'Invalid Payment refrence'})
        }

        const response = await axios.get(
            `${process.env.PAYSTACK_VERIFY_URL}/${paymentReference}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_LIVE_SK}`,
                'Content-Type': 'application/json'
              }
            }
          );
      
          //console.log('VERIFY DATA>>',response.data);
          const data = response.data.data
          if(data.status !== 'success' && data.gateway_response !== 'Successful'){
            return res.status(403).json({ success: false, data: 'Invalid'})
          }

          const amount = data.amount
          const email = data.customer.email
          const reference = data.reference

          const user = await UserModel.findOne({ email });
          if(!user){
            console.log('USER NOT FOUND', email)
          }
          const transactionExist = await TransactionModel.findOne({ transactionId: reference })
        
          if(transactionExist){
            console.log('TRANSACTIONS ALREADY VERIFIED')
            return res.end()
          }

          if (user) {
            const value = amount / 100; // Convert from kobo to naira
            user.acctBalance += value;
            await user.save();
            console.log('Account funded for user:', email);
            const transactionRef = reference || 'no transaction refrence';
          
            // Saving the transaction
            const transactionData = {
                userId: user._id,
                transcationType: 'Account Funding',
                transactionId: transactionRef,
                email: user.email,
                amount: parseFloat(value),
                transcationDesc: `Account funded successful with NGN${value}`,
                transcationStatus: 'Successful',
                credit: true
            };
            const createdTransaction = await TransactionModel.create(transactionData);
            //console.log('Transaction>>', createdTransaction)
        }

        const { resetPasswordToken, resetPasswordExpire, password, ...userData } = user._doc
        res.status(200).json({ success: true, data: userData })
    } catch (error) {
        console.log('UNABLE TO VERIFY PAYSTACK FUNDING', error)
        res.status(500).json({ success: false, data: error.message || 'Unable to verify paystack funding'})
    }
}
