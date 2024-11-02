import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import cartslice, { fetchCartData } from '../features/CartSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const categories = [
  { id: 1, name: 'Beverages' },
  { id: 2, name: 'Snacks' },
];

const Home = () => {
  const navigate=useNavigate()
  const userId = window.localStorage.getItem("userId");

  useEffect(()=>{
    if(!userId){
      navigate("/login")
    }
  },[])
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Beverages'); // Default category
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://ecomback-1dms.onrender.com/');
        setProducts(response.data);
      } catch (error) {
        setError('Error fetching products');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    dispatch(fetchCartData(userId));
  }, []);

  // Filter products by selected category
  const filteredProducts = products?.filter(product => product.category === selectedCategory);

  const handleAddToCart = async (product) => {
    const response = await axios.post(`https://ecomback-1dms.onrender.com/addtocart/${product._id}`, { userId });
    console.log(response.data.msg);
    toast(`${response.data.msg} ${product.name}`,{
      autoClose: 500 
    })
    if(response.data.msg=="added to cart")
    dispatch(cartslice.actions.addToCart(product));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg mb-6 text-center text-white">
        <h1 className="text-4xl font-bold mb-2">Welcome to MyShop!</h1>
        <p className="text-xl">Your one-stop shop for the best products!</p>
      </div>

      {/* Categories Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Categories</h2>
        <div className="flex space-x-4">
          {categories.map(category => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full transition-colors duration-300 ${
                selectedCategory === category.name ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
              } hover:bg-blue-500 hover:text-white`}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Section */}
      {loading ? (
        <p className="text-center">Loading products...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">{selectedCategory} Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <div
                  key={product._id}
                  className="border rounded-lg overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <div className="flex justify-center p-4">
                    <img src={product.imageUrl} alt={product.name} className="w-48 h-48 object-cover" />
                  </div>
                  <div className="p-4 bg-gray-100">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-gray-600">{product.description}</p>
                    <p className="font-bold mt-2 text-xl">₹{product.price}</p>
                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="mt-4 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-300 w-full"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center">No products available in this category.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
