import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentStatus = () => {
  const [status, setStatus] = useState('');
  const txnId = '2038490238'; // Replace this with your logic to get the transaction ID

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        const response = await axios.get(`/api/payment/checkStatus/${txnId}`);
        setStatus(response.data.message);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPaymentStatus();
  }, [txnId]); // Include txnId as a dependency to trigger effect when it changes

  return (
    <div>
      <h1>Payment Status:</h1>
      <p>{status}</p>
    </div>
  );
};

export default PaymentStatus;
