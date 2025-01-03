import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import { backendUrl } from '../App';

function EditProductModal({ isOpen, onClose, product, token, onProductUpdate }) {
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      price: '',
      category: '',
      subCategory: '',
      sizeStock: [],
      bestseller: false,
      sizes: []
    });
  
    useEffect(() => {
      if (product) {
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          category: product.category,
          subCategory: product.subCategory,
          sizes: product.sizes,
          bestseller: product.bestseller,
          sizeStock: product.sizeStock || [],
        });
      }
    }, [product]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleCheckboxChange = (e) => {
      const { name, checked } = e.target;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    };
  
    const handleSizeStockChange = (index, field, value) => {
      setFormData((prev) => {
        const newSizeStock = [...prev.sizeStock];
        newSizeStock[index] = { ...newSizeStock[index], [field]: parseInt(value) };
        return { ...prev, sizeStock: newSizeStock };
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const dataToSend = {
          id: product._id,
          ...formData,
          sizes: JSON.stringify(formData.sizes),
          sizeStock: JSON.stringify(formData.sizeStock),
          bestseller: formData.bestseller.toString(),
        };
  
        const response = await axios.put(`${backendUrl}/api/product/edit`, dataToSend, {
          headers: {
            'Content-Type': 'application/json',
            token,
          },
        });
  
        if (response.data.success) {
          toast.success('Product updated successfully');
          onProductUpdate();
          onClose();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error('Error details:', error.response || error);
        toast.error(`An error occurred while updating the product: ${error.message}`);
      }
    };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Product</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700">Subcategory</label>
            <input
              type="text"
              id="subCategory"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock and Sold</label>
            <div className="mt-2 space-y-2">
              {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <span className="w-8">{size}</span>
                  <input
                    type="number"
                    name={`stock-${size}`}
                    value={formData.sizeStock.find(item => item.size === size)?.stock || 0}
                    onChange={(e) => {
                      const newSizeStock = [...formData.sizeStock];
                      const index = newSizeStock.findIndex(item => item.size === size);
                      if (index !== -1) {
                        newSizeStock[index].stock = parseInt(e.target.value);
                      } else {
                        newSizeStock.push({ size, stock: parseInt(e.target.value), sold: 0 });
                      }
                      setFormData(prev => ({ ...prev, sizeStock: newSizeStock }));
                    }}
                    className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Stock"
                  />
                  <input
                    type="number"
                    name={`sold-${size}`}
                    value={formData.sizeStock.find(item => item.size === size)?.sold || 0}
                    onChange={(e) => {
                      const newSizeStock = [...formData.sizeStock];
                      const index = newSizeStock.findIndex(item => item.size === size);
                      if (index !== -1) {
                        newSizeStock[index].sold = parseInt(e.target.value);
                      } else {
                        newSizeStock.push({ size, stock: 0, sold: parseInt(e.target.value) });
                      }
                      setFormData(prev => ({ ...prev, sizeStock: newSizeStock }));
                    }}
                    className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Sold"
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="bestseller"
                checked={formData.bestseller}
                onChange={handleCheckboxChange}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="ml-2">Bestseller</span>
            </label>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductModal;

