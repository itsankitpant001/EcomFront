import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


const Payment = () => {
  const navigate=useNavigate()
  const userId = window.localStorage.getItem('userId');
  useEffect(()=>{
    if(!userId){
      navigate("/login")
    }
  },[])
  const location = useLocation();
  const paymentData = location.state?.paymentData; // Access paymentData from the location state

  // If paymentData is not available, display a fallback or an error message
  if (!paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center text-red-600 mb-4">No payment data available!</h2>
          <p className="text-center text-gray-700">Please try again or contact support.</p>
          <div className="text-center mt-6">
            <button
              onClick={() => window.location.href = '/'} // Navigate to home or other page
              className="bg-indigo-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-700 transition duration-300"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { razorpay_payment_id, amount, products } = paymentData;

  return (
    <div>
      
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-green-600 mb-4">Payment Successful!</h2>

        <p className="text-center text-lg text-gray-700 mb-6">
          Thank you for your purchase! Your fresh peanut butter will be delivered within one business day.
        </p>

        <div className="mb-6">
          <p className="text-lg font-semibold">Order ID:</p>
          <p className="text-gray-700">{razorpay_payment_id}</p>
        </div>

        <div className="mb-6">
          <p className="text-lg font-semibold">Total Amount:</p>
          <p className="text-gray-700">₹{amount}</p> {/* Convert amount from paise to rupees */}
        </div>

        <div className="mb-6">
          <p className="text-lg font-semibold">Products Purchased:</p>
          <ul className="list-disc list-inside text-gray-700">
            {products.map((product, index) => (
              <li key={index} className="mt-2">
                <span className="font-semibold">{product.name}</span> - Quantity: {product.quantity}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => window.location.href = '/'} // Navigate to home or other page
            className="bg-indigo-600 text-white py-3 px-6 rounded-md shadow-md hover:bg-indigo-700 transition duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Payment;
