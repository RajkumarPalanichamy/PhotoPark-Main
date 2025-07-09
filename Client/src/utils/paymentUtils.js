import axiosInstance from './axiosInstance';

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.body.appendChild(script);
  });
};

// Create payment order (calls backend API to get Razorpay orderId)
export const createPaymentOrder = async (paymentData) => {
  try {
    const response = await axiosInstance.post('/payments/create-order', paymentData);
    return response.data; // should return { orderId, amount, dbOrderId, etc. }
  } catch (error) {
    console.error('❌ Error creating payment order:', error);
    throw error;
  }
};

// Verify payment on server
export const verifyPayment = async (paymentData) => {
  try {
    const response = await axiosInstance.post('/payments/verify', paymentData);
    return response.data;
  } catch (error) {
    console.error('❌ Error verifying payment:', error);
    throw error;
  }
};

// Main function: opens Razorpay modal, handles verification and order saving
export const initializePayment = async (orderData, userDetails) => {
  try {
    const Razorpay = await loadRazorpayScript();

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_eh4eCol0GXNXUS',
      amount: orderData.amount,
      currency: orderData.currency || 'INR',
      name: 'PhotoPark',
      description: 'Photo Frame Order',
      order_id: orderData.orderId,
      handler: async function (response) {
        try {
          // Step 1: Verify payment
          const verificationResult = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            dbOrderId: orderData.dbOrderId,
          });

          // ✅ Step 2: Save frame order in DB before redirect
          const orderPayload = orderData.orderPayload;
          if (orderPayload) {
            // Add payment details to the frame order
            orderPayload.paymentId = response.razorpay_payment_id;
            orderPayload.paymentStatus = 'success';
            orderPayload.paidAt = new Date();
            
            await axiosInstance
              .post('/frameorders/create', orderPayload)
              .then((res) => {
                console.log('✅ Frame order saved successfully:', res.data);
              })
              .catch((err) => {
                console.error('❌ Error saving frame order:', err.response?.data || err.message);
              });
          }

          // ✅ Step 3: Redirect to success page
          const successUrl = `/payment-success?razorpay_payment_id=${response.razorpay_payment_id}&razorpay_order_id=${response.razorpay_order_id}`;
          window.location.href = successUrl;

          return verificationResult;
        } catch (error) {
          console.error('❌ Payment verification or order saving failed:', error);
          throw error;
        }
      },
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.phone,
      },
      notes: {
        address: userDetails.address,
      },
      theme: {
        color: '#3B82F6',
      },
      modal: {
        ondismiss: function () {
          console.log('Payment modal closed by user');
        },
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();

    return new Promise((resolve, reject) => {
      rzp.on('payment.failed', function (response) {
        console.error('❌ Payment failed:', response.error);
        reject(new Error('Payment failed'));
      });

      rzp.on('payment.success', function (response) {
        resolve(response);
      });
    });
  } catch (error) {
    console.error('❌ Error initializing payment:', error);
    throw error;
  }
};
