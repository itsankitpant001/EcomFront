import { useEffect, useState } from 'react';
import axios from 'axios';
import { ImCross } from "react-icons/im";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import cartslice, { fetchCartData } from '../features/CartSlice';

const Cart = () => {
  const userId = window.localStorage.getItem('userId');
  useEffect(()=>{
    if(!userId){
      navigate("/login")
    }
  },[])
  const dispatch = useDispatch();
  dispatch(fetchCartData(userId));

  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axios.get(`https://ecomback-1dms.onrender.com/getcartdata/${userId}`);
        setCart(response.data.cart);
        calculateTotal(response.data.cart);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  const calculateTotal = (cart) => {
    const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toFixed(2);
    setAmount(total);
  };

  const handleIncreaseQuantity = async (productId) => {
    try {
      await axios.put(`https://ecomback-1dms.onrender.com/incquantity/${productId}`, { userId });
      const updatedCart = cart.map(item => (item.product._id === productId ? { ...item, quantity: item.quantity + 1 } : item));
      setCart(updatedCart);
      calculateTotal(updatedCart);
      dispatch(fetchCartData(userId));
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  };
  const handleDecreaseQuantity = async (productId) => {
    try {
      await axios.put(`https://ecomback-1dms.onrender.com/decquantity/${productId}`, { userId });
      const updatedCart = cart.map(item => (item.product._id === productId ? (item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : null) : item)).filter(item => item !== null);
      setCart(updatedCart);
      calculateTotal(updatedCart);
      dispatch(fetchCartData(userId));
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      await axios.put(`https://ecomback-1dms.onrender.com/removecart/${productId}`, { userId });
      const updatedCart = cart.filter(item => item.product._id !== productId);
      setCart(updatedCart);
      calculateTotal(updatedCart);
      dispatch(fetchCartData(userId));
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  const handlePayment = async () => {
    const response = await axios.post('https://ecomback-1dms.onrender.com/order', { amount });
    handlePaymentVerify(response.data.data, cart);
  };

  const handlePaymentVerify = async (data, cart) => {
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!razorpayKey) {
      console.error("Razorpay key is missing!");
      return;
    }

    const options = {
      key: razorpayKey,
      amount: data.amount,
      currency: data.currency,
      name: "Desi Hai",
      description: "Test Mode",
      order_id: data.id,
      handler: async (response) => {
        const productsData = cart.map(item => ({ name: item.product.name, quantity: item.quantity }));
        const result = await axios.post('https://ecomback-1dms.onrender.com/verify', {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          amount: data.amount,
          products: productsData,
          userId,
        });
        if (result.data.msg === "Payment Successfully") {
          await axios.post('https://ecomback-1dms.onrender.com/clear', { userId });
          dispatch(cartslice.actions.clearCart());
          navigate('/payment', { state: { paymentData: result.data.paymentdata } });
        }
      },
      theme: { color: "#5f63b8" },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-5 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row shadow-md my-5">
        <div className="w-full sm:w-3/4 bg-white px-4 py-4">
          <div className="flex justify-between border-b pb-4">
            <h1 className="font-semibold text-2xl text-indigo-800">Shopping Cart</h1>
            <h2 className="font-semibold text-xl text-gray-600">{cart.length} Items</h2>
          </div>
          <div className="flex mt-4 mb-4">
            <h3 className="font-semibold text-gray-600 text-xs uppercase w-2/5">Product Details</h3>
            <h3 className="font-semibold text-gray-600 text-xs uppercase w-1/5 text-center">Title</h3>
            <h3 className="font-semibold text-gray-600 text-xs uppercase w-1/5 text-center">Quantity</h3>
            <h3 className="font-semibold text-gray-600 text-xs uppercase w-1/5 text-center">Price</h3>
            <h3 className="font-semibold text-gray-600 text-xs uppercase w-1/5 text-center">Total</h3>
            <h3 className="font-semibold text-gray-600 text-xs uppercase w-1/5 text-center">Remove</h3>
          </div>

          {cart.map(item => (
            <div key={item.product._id} className="flex items-center hover:bg-gray-100 -mx-4 px-2 py-3 flex-col sm:flex-row">
              <div className="flex w-full sm:w-2/5 items-center">
                <div className="w-20 h-20 overflow-hidden">
                  <img className="h-full w-full object-cover" src={item.product.imageUrl} alt={item.product.name} />
                </div>
              </div>
              <div className="flex justify-center w-full sm:w-1/5 mt-2 sm:mt-0">
                <span className="font-semibold text-sm text-center text-indigo-700">{item.product.name}</span>
              </div>
              <div className="flex justify-center w-full sm:w-1/5 mt-2 sm:mt-0">
                <div className="flex items-center">
                  <button onClick={() => handleDecreaseQuantity(item.product._id)} className="text-gray-600 w-8 h-8 text-center border border-gray-300 hover:bg-gray-200 transition ease-in-out duration-150">-</button>
                  <span className="mx-2 border text-center w-10">{item.quantity}</span>
                  <button onClick={() => handleIncreaseQuantity(item.product._id)} className="text-gray-600 w-8 h-8 text-center border border-gray-300 hover:bg-gray-200 transition ease-in-out duration-150">+</button>
                </div>
              </div>
              <span className="text-center w-full sm:w-1/5 font-semibold text-sm text-green-600">₹{item.product.price}</span>
              <span className="text-center w-full sm:w-1/5 font-semibold text-sm text-green-600">₹{(item.product.price * item.quantity).toFixed(2)}</span>
              <div className="flex justify-center w-full sm:w-1/5 mt-2 sm:mt-0">
                <button onClick={() => handleRemoveFromCart(item.product._id)} className="font-semibold hover:text-red-600 text-red-500 transition ease-in-out duration-150">
                  <ImCross fontSize='1.5em' />
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-between mt-5 mb-5">
            <button onClick={() => navigate('/', { state: { cart, amount } })} className="flex font-semibold text-sm text-indigo-600 hover:text-indigo-800 transition ease-in-out duration-150">
              Continue Shopping
            </button>
          </div>
        </div>

        <div id="summary" className="w-full sm:w-1/4 px-4 py-4 bg-gray-100 rounded-lg mt-5 sm:mt-0">
          <h1 className="font-semibold text-xl border-b pb-2">Order Summary</h1>
          <div className="flex justify-between mt-4 mb-2">
            <span className="font-semibold text-sm text-gray-600">Items {cart.length}</span>
            <span className="font-semibold text-sm text-gray-600">₹{amount}</span>
          </div>
          <div className="flex justify-between mt-2 mb-5">
            <span className="font-semibold text-sm text-gray-600">Total Amount</span>
            <span className="font-semibold text-sm text-gray-600">₹{amount}</span>
          </div>
          <button onClick={handlePayment} className="bg-indigo-800 hover:bg-indigo-600 px-4 py-2 text-sm text-white rounded-md w-full">Proceed to Payment</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
