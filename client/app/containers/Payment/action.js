import { push } from 'connected-react-router';
import { success, error } from 'react-notification-system-redux';
import { SET_ORDERS_LOADING } from './constants';

export const setPaymentLoading = (value) => ({
  type: SET_ORDERS_LOADING,
  payload: value
});

export const makePayment = (formData) => {
  return async (dispatch) => {
    try {
      dispatch(setPaymentLoading(true));

      const options = {
        method: 'POST',
        
        headers: {
          
          'Content-Type': 'application/json',
          'Accept-Language': 'X-Requested-With,content-type,x-app-id, x-auth-token, id-mercury',
          'Origin': 'http://localhost:8080' // Replace with your frontend origin
        },
     
        body: JSON.stringify(formData)
      };
      
      const response = await fetch('http://localhost:8080/api/payment/newPayment', options);
      console.log(response,"this is response")
      if (response.ok) {
        const responseData = response.status === 204 ? "STATUS CODE: 204" : (await response.json()).text;
        console.log('Payment successful:', responseData);
        // You might dispatch an action here to store payment information or handle success
        // Example: dispatch(success({ title: 'Payment Successful', message: responseData }));
        // Dispatching a success notification using react-notification-system-redux
        dispatch(success({ title: 'Payment Successful', message: responseData }));
        // Redirect to a success page or any further handling
        dispatch(push('/api/payment/success'));
      } else {
        // Dispatching an error notification using react-notification-system-redux
        const errorMessage = await response.text();
        dispatch(error({ title: 'Payment Error', message: errorMessage }));
        throw new Error(errorMessage);
      }
    } catch (error) {
      // Dispatch a failure action or handle the error appropriately
      dispatch(error({ title: 'Payment Failure', message: error.message }));
      // Example: dispatch({ type: 'PAYMENT_FAILURE', payload: error.message });
    } finally {
      // Ensure to set loading to false regardless of success or failure
      dispatch(setPaymentLoading(false));
    }
  };
};
