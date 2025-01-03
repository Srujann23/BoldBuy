import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/frontend_assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { toast } from 'react-toastify';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  const fetchProductData = async () => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  // Check if all sizes are out of stock
  const isOutOfStock = productData && productData.sizeStock && productData.sizeStock.every(item => item.stock === 0);

  const handleAddToCart = () => {
    if (!size) {
      toast.error('Please select a size!');
      return;
    }
    addToCart(productData._id, size);
    setSize(''); // Reset the selected size after adding to the cart
  };

  return productData ? (
    <div className="border t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/*-----------Product Data-----------*/}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">

        {/*-----------Product Images-----------*/}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img onClick={() => setImage(item)} src={item} key={index} className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer" alt="" />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="Product" />
          </div>
        </div>

        {/* -----------Product Info----------- */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_dull_icon} alt="" className="w-3.5" />
            <p className="p1-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">{currency}{productData.price}</p>
          <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>
          
          <div className="flex flex-col gap-4 my-8">
            {!isOutOfStock && <p>Select Size</p>}
            <div className="flex gap-2">
              {productData.sizeStock && productData.sizeStock.length > 0 ? (
                productData.sizeStock
                  .filter(item => item.stock > 0) // Only display sizes with stock > 0
                  .map((item, index) => (
                    <button
                      onClick={() => setSize(item.size)}
                      className={`border py-2 px-4 bg-gray-100 ${item.size === size ? 'border-orange-500' : ''}`}
                      key={index}
                    >
                      {item.size}
                    </button>
                  ))
              ) : (
                <p>No available sizes</p> // If no sizes are available, display a message
              )}
            </div>
            {isOutOfStock && <p className="text-red-500 mt-3">Out of Stock</p>} {/* Display Out of Stock message */}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`bg-black text-white px-8 py-3 text-sm active:bg-gray-700 ${isOutOfStock || !size ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isOutOfStock || !size}
          >
            {isOutOfStock ? 'Out of Stock' : 'ADD TO CART'}
          </button>

          <hr className="mt-8 sm:w-4/5" /> 

          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original Product</p>
            <p>COD Available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/*  -----------Description and Review Section----------- */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
      </div>

      {/*-----------Display Related Products-----------*/}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
