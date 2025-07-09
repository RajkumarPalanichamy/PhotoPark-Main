import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Get payment details from URL params
    const paymentId = searchParams.get("razorpay_payment_id");
    const orderId = searchParams.get("razorpay_order_id");
    
    if (paymentId && orderId) {
      setOrderDetails({
        paymentId,
        orderId,
      });
    }
  }, [searchParams]);

  const handleContinueShopping = () => {
    navigate("/");
  };

  const handleViewOrders = () => {
    navigate("/my-orders");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Payment Successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {orderDetails && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Order Details
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Payment ID
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {orderDetails.paymentId}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Order ID
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {orderDetails.orderId}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleViewOrders}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View My Orders
          </button>
          <button
            onClick={handleContinueShopping}
            className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Continue Shopping
          </button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            You will receive an email confirmation shortly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 