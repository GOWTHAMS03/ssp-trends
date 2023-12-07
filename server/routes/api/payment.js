const crypto = require('crypto');
const axios = require('axios');
require("dotenv").config();





const newPayment = async (req, res) => {
  try {
   
    const { user_id, amount, name } = req.body;


    function generateTransactionID(){
      const timestamp = Date.now(); 
    
      const randomNum =Math.floor(Math.random() * 1000000);
      const marchantPrefix = "T";
      const transactionID = `${marchantPrefix}${timestamp}${randomNum}`;
      return transactionID;
    }

    const data = {
      merchantId:process.env.MERCHANT_ID,
      merchantTransactionId: generateTransactionID(),
      merchantUserId: 'MUID' + user_id,
      name: name,
      amount: parseFloat(amount) * 100, // Convert amount to numeric value
      redirectUrl: `/api/status/${generateTransactionID()}`,
      redirectMode: 'POST',
      
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    
    

    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString('base64');
    const keyIndex = 1;
    const string = payloadMain + '/pg/v1/pay' + process.env.SALT_KEY;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + '###' + keyIndex;

    const options = {
      method: 'POST',
      url: 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum
      },
      data: {
        request: payloadMain
      }
    };

    const response = await axios.request(options);

    console.log(response,"this is response from")
    res.redirect(response.data.data.instrumentResponse.redirectInfo.url);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: error.message,
      success: false
    });
  }
};


const checkStatus = async(req, res) => {

  console.log(req.params,"this is request")
  console.log(res,"this is")
  const merchantTransactionId = req.params['txnId']
  const merchantId = process.env.MERCHANT_ID
  const keyIndex = 2;
  const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + process.env.SALT_KEY;
  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
  const checksum = sha256 + "###" + keyIndex;
 const options = {
  method: 'GET',
  url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
 
  headers: {
  accept: 'application/json',
  'Content-Type': 'application/json',
  'X-VERIFY': checksum,
  'X-MERCHANT-ID': `${merchantId}`
  }
  };
 // CHECK PAYMENT STATUS
  axios.request(options).then(async(response) => {
  if (response.data.success === true) {
  console.log(response.data)
  return res.status(200).send({success: true, message:"Payment Success"});
  } else {
  return res.status(400).send({success: false, message:"Payment Failure"});
  }
  })
  .catch((err) => {
  console.error(err);
  res.status(500).send({msg: err.message});
  });
 };
 module.exports = {
  newPayment,
  checkStatus
 } 