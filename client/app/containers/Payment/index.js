import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../components/Common/Button';
import Checkbox from '../../components/Common/Checkbox';
import { makePayment } from '../../actions';
import { connect } from 'react-redux';
import actions from '../../actions';




const PaymentForm = (props) => {
  const { addressFormData, cartItems, placeOrder, finalamount,user,orderitems } = props;




  const generateRandomString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const [formData, setFormData] = useState({
    user_id: user._id,
    amount: orderitems.total,
    cartItems,
    name: user.firstName + ' ' + user.lastName,
    addressFormData,
    txnId: generateRandomString(8),
    orderitems,
    paymentMethods:'online payment'
  });

  
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [captcha, setCaptcha] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const isProceedEnabled =
    paymentMethods.length > 0 &&
    (paymentMethods.includes('online') ||
      (paymentMethods.includes('cod') && captcha === generatedCaptcha));

  const generateCaptcha = () => {
    const newCaptcha = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCaptcha(newCaptcha);
  };

  const handleCheckboxChange = (method) => {
    const updatedMethods = paymentMethods.includes(method)
      ? paymentMethods.filter((m) => m !== method)
      : [...paymentMethods, method];
    setPaymentMethods(updatedMethods);
  };

  const handleSubmit = async () => {
    try {
      await props.makePayment(formData); // Dispatch the makePayment action
      // Handle success or redirection logic here if needed
    } catch (error) {
      // Handle errors if needed
      console.error('Error submitting payment:', error);
    }
  };
    


//   const handlePayment = (e)=>{
//     e.preventDefault();
//     setLoading2(true);
//     axios.post('api/payment', {...data}).then(res => {  
//     setTimeout(() => {
//         setLoading2(false);
//     }, 1500);
//     })
//     .catch(error => {
//         setLoading2(false)
//         console.error(error);
//     });   
// }

  const handlePayment = async (e) => {
    if (e) {
      e.preventDefault(); // Check if event object is defined
    }

    setLoading(true);

    if (paymentMethods.length === 0) {
      alert('Please choose a payment method');
      setLoading(false);
      return;
    }

    if (paymentMethods.includes('cod') && captcha === generatedCaptcha) {
      try {
        placeOrder(addressFormData, cartItems, finalamount, 'Cash on Delivery');
      } catch (error) {
        console.log(error);
      }
    } else if (paymentMethods.includes('online')) {
      await handleSubmit(); // Call handleSubmit without the event object
    }

    setLoading(false);
  };

  return (
    <div>
      <h3>Select Payment Method:</h3>
      <div>
        <label>
          <Checkbox
            type="checkbox"
            value="cod"
            checked={paymentMethods.includes('cod')}
            onChange={() => handleCheckboxChange('cod')}
          />
          Cash on Delivery
        </label>
      </div>
      {paymentMethods.includes('cod') && (
        <div>
          <p>Enter the Captcha: (Hint: {generatedCaptcha})</p>
          <input
            type="text"
            value={captcha}
            onChange={(e) => {
              setCaptcha(e.target.value);
            }}
          />
        </div>
      )}
      <div>
        <label>
          <Checkbox
            type="checkbox"
            value="online"
            checked={paymentMethods.includes('online')}
            onChange={() => handleCheckboxChange('online')}
          />
          Online Payment
        </label>
      </div>
      <br></br>
      <br></br>
      <div>
        <Button
          type="button"
          disabled={loading || !isProceedEnabled}
          text={paymentMethods.includes('online') ? 'Proceed to Online Payment' : 'PAY'}
          onClick={handlePayment}
        />
      </div>
    </div>
  );
};

const mapStateToProps = state => {

  console.log(state,"state")
 
  return {
    user: state.account.user
  };
};




export default connect(mapStateToProps,actions)(PaymentForm);