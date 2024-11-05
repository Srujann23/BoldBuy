import React, { useEffect, useState } from 'react';
import { backendUrl } from '../App';
import axios from 'axios';
import { currency } from '../App';
import { toast } from 'react-toastify';

const List = ({ token }) => {
    const [list, setList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const itemsPerPage = 10; // Display 15 products per page

    // Fetch the list of products
    const fetchList = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list', { headers: { token } });
            if (response.data.success) {
                setList(response.data.products);

                // Extract unique categories from products
                const uniqueCategories = ["All", ...new Set(response.data.products.map(product => product.category))];
                setCategories(uniqueCategories);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // Remove a product
    const removeProduct = async (id) => {
        try {
            const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } });
            if (response.data.success) {
                toast.success(response.data.message);
                await fetchList();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    // Handle category filter change
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setCurrentPage(1); // Reset to first page when changing filter
    };

    // Handle price filter change
    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        if (name === "minPrice") setMinPrice(value);
        else if (name === "maxPrice") setMaxPrice(value);
        setCurrentPage(1); // Reset to first page when changing filter
    };

    // Filter products based on the selected category and price range
    const filteredList = list.filter(item => {
        const categoryMatch = selectedCategory === "All" || item.category === selectedCategory;
        const priceMatch =
            (!minPrice || item.price >= parseFloat(minPrice)) &&
            (!maxPrice || item.price <= parseFloat(maxPrice));
        return categoryMatch && priceMatch;
    });

    // Calculate the current products to display based on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

    // Calculate total pages for pagination
    const totalPages = Math.ceil(filteredList.length / itemsPerPage);

    // Pagination controls
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            <p className='mb-4 text-lg font-semibold'>All Products List</p>

            {/* Category Filter */}
            <div className="mb-4 flex items-center gap-4">
                <div>
                    <label htmlFor="category" className="font-semibold mr-2">Filter by Category:</label>
                    <select
                        id="category"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="p-2 border rounded-md"
                    >
                        {categories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                {/* Price Range Filter */}
                <div>
                    <label className="font-semibold mr-2">Price Range:</label>
                    <input
                        type="number"
                        name="minPrice"
                        value={minPrice}
                        onChange={handlePriceChange}
                        placeholder="Min"
                        className="p-2 border rounded-md w-20 mr-2"
                    />
                    <input
                        type="number"
                        name="maxPrice"
                        value={maxPrice}
                        onChange={handlePriceChange}
                        placeholder="Max"
                        className="p-2 border rounded-md w-20"
                    />
                </div>
            </div>

            <div className='flex flex-col gap-4'>
                {/* Table Header for large screens */}
                <div className='hidden md:grid grid-cols-[100px_2fr_1fr_1fr_80px] items-center py-2 px-4 border-b bg-gray-200 text-sm font-semibold'>
                    <span>Image</span>
                    <span>Name</span>
                    <span>Category</span>
                    <span>Price</span>
                    <span className='text-center'>Action</span>
                </div>
                
                {/* Product List */}
                {currentItems.map((item, index) => (
                    <div
                        className='grid md:grid-cols-[100px_2fr_1fr_1fr_80px] grid-cols-1 items-start gap-4 py-3 px-4 border rounded-md shadow-sm text-sm bg-white'
                        key={index}
                    >
                        {/* Image */}
                        <div className='flex justify-center md:justify-start'>
                            <img className='w-16 h-16 object-cover rounded-md' src={item.image[0]} alt={item.name} />
                        </div>
                        {/* Name, Category, Price for small screens */}
                        <div className='md:hidden'>
                            <p className='font-bold'>{item.name}</p>
                            <p className='text-gray-600'>{item.category}</p>
                            <p>{currency}{item.price}</p>
                        </div>
                        {/* For larger screens */}
                        <p className='hidden md:block truncate'>{item.name}</p>
                        <p className='hidden md:block'>{item.category}</p>
                        <p className='hidden md:block'>{currency}{item.price}</p>
                        {/* Action button */}
                        <p
                            onClick={() => removeProduct(item._id)}
                            className='text-center cursor-pointer text-red-500 font-bold hover:text-red-700 transition-colors'
                        >
                            ✖
                        </p>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className='flex justify-center mt-4'>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-3 py-1 mx-1 ${index + 1 === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-md`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </>
    );
};

export default List;
