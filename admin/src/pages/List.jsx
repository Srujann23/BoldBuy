import React, { useEffect, useState } from 'react';
import { backendUrl } from '../App';
import axios from 'axios';
import { currency } from '../App';
import { toast } from 'react-toastify';
import ImageModal from '../components/ImageModal';
import ConfirmationModal from '../components/ConfirmationModal';

const List = ({ token }) => {
    const [list, setList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedSubCategory, setSelectedSubCategory] = useState("All");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [minStock, setMinStock] = useState("");
    const [maxStock, setMaxStock] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [productToDelete, setProductToDelete] = useState(null);  // Store the product ID to be deleted


    const itemsPerPage = 10;

    // Fetch the list of products
    const fetchList = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list', { headers: { token } });
            if (response.data.success) {
                setList(response.data.products);

                const uniqueCategories = ["All", ...new Set(response.data.products.map(product => product.category))];
                setCategories(uniqueCategories);

                const uniqueSubCategories = ["All", ...new Set(response.data.products.map(product => product.subCategory))];
                setSubCategories(uniqueSubCategories);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };
    const removeProduct = async (id) => {
        try {
            const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } });
    
            if (response.data.success) {
                toast.success(response.data.message);
                fetchList();  // Refresh the list after deletion
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    };

    

    // Open modal with images
    const openImageModal = (images) => {
        setSelectedImages(images);
        setIsModalOpen(true);
    };

    // Close the modal
    const closeImageModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        fetchList();
    }, []);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setCurrentPage(1);
    };

    const handleSubCategoryChange = (e) => {
        setSelectedSubCategory(e.target.value);
        setCurrentPage(1);
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        if (name === "minPrice") setMinPrice(value);
        else if (name === "maxPrice") setMaxPrice(value);
        setCurrentPage(1);
    };

    const handleStockChange = (e) => {
        const { name, value } = e.target;
        if (name === "minStock") setMinStock(value);
        else if (name === "maxStock") setMaxStock(value);
        setCurrentPage(1);
    };

    const filteredList = list.filter(item => {
        const categoryMatch = selectedCategory === "All" || item.category === selectedCategory;
        const subCategoryMatch = selectedSubCategory === "All" || item.subCategory === selectedSubCategory;
        const priceMatch =
            (!minPrice || item.price >= parseFloat(minPrice)) &&
            (!maxPrice || item.price <= parseFloat(maxPrice));
        const stockMatch =
            (!minStock || item.stock >= parseInt(minStock)) &&
            (!maxStock || item.stock <= parseInt(maxStock));
        return categoryMatch && subCategoryMatch && priceMatch && stockMatch;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredList.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            <p className='mb-4 text-lg font-semibold'>All Products List</p>
            <div className="mb-4 flex items-center gap-4">
    <div className="flex flex-col">
        <label htmlFor="category" className="font-semibold mb-1">Filter by Category:</label>
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

    <div className="flex flex-col">
        <label htmlFor="subcategory" className="font-semibold mb-1">Filter by Subcategory:</label>
        <select
            id="subcategory"
            value={selectedSubCategory}
            onChange={handleSubCategoryChange}
            className="p-2 border rounded-md"
        >
            {subCategories.map((subCategory, index) => (
                <option key={index} value={subCategory}>{subCategory}</option>
            ))}
        </select>
    </div>

    <div className="flex flex-col">
        <label className="font-semibold mb-1">Price Range:</label>
        <div className="flex gap-2">
            <input
                type="number"
                name="minPrice"
                value={minPrice}
                onChange={handlePriceChange}
                placeholder="Min"
                className="p-2 border rounded-md w-24"
            />
            <span className="font-semibold">to</span>
            <input
                type="number"
                name="maxPrice"
                value={maxPrice}
                onChange={handlePriceChange}
                placeholder="Max"
                className="p-2 border rounded-md w-24"
            />
        </div>
    </div>

    <div className="flex flex-col">
        <label className="font-semibold mb-1">Stock Range:</label>
        <div className="flex gap-2">
            <input
                type="number"
                name="minStock"
                value={minStock}
                onChange={handleStockChange}
                placeholder="Min"
                className="p-2 border rounded-md w-24"
            />
            <span className="font-semibold">to</span>
            <input
                type="number"
                name="maxStock"
                value={maxStock}
                onChange={handleStockChange}
                placeholder="Max"
                className="p-2 border rounded-md w-24"
            />
        </div>
    </div>
</div>


            <div className='flex flex-col gap-4'>
                <div className='hidden md:grid grid-cols-[100px_2fr_1fr_1fr_1fr_1fr_80px] items-center py-2 px-4 border-b bg-gray-200 text-sm font-semibold'>
                    <span>Image</span>
                    <span>Name</span>
                    <span>Category</span>
                    <span>Subcategory</span>
                    <span>Price</span>
                    <span>Stock</span>
                    <span className='text-center'>Action</span>
                </div>

                {currentItems.map((item, index) => (
                    <div
                        className='grid md:grid-cols-[100px_2fr_1fr_1fr_1fr_1fr_80px] grid-cols-1 items-start gap-4 py-3 px-4 border rounded-md shadow-sm text-sm bg-white'
                        key={index}
                    >
                        <div className='flex justify-center md:justify-start'>
                            <img
                                className='w-16 h-16 object-cover rounded-md cursor-pointer'
                                src={item.image[0]}
                                alt={item.name}
                                onClick={() => openImageModal(item.image)}
                            />
                        </div>

                        <div className='md:hidden'>
                            <p className='font-bold'>{item.name}</p>
                            <p className='text-gray-600'>{item.category}</p>
                            <p>{item.subCategory}</p>
                            <p>{currency}{item.price}</p>
                            <p>{item.stock}</p>
                        </div>

                        <p className='hidden md:block truncate'>{item.name}</p>
                        <p className='hidden md:block'>{item.category}</p>
                        <p className='hidden md:block'>{item.subCategory}</p>
                        <p className='hidden md:block'>{currency}{item.price}</p>
                        <p className='hidden md:block'>{item.stock}</p>
                        <p
                            onClick={() => setProductToDelete(item._id)}  // Set the product ID to delete
                            className='text-red-500 font-bold hover:text-red-700 cursor-pointer'
                        >
                            ✖ Delete
                        </p>
                    </div>
                ))}
            </div>

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
            {productToDelete && (
    <ConfirmationModal
        onClose={() => setProductToDelete(null)}  // Close modal on 'No'
        onConfirm={() => {
            removeProduct(productToDelete);  // Call removeProduct to delete
            setProductToDelete(null);  // Close modal after deletion
        }}
    />
)}

            {/* Modal to display images */}
            <ImageModal isOpen={isModalOpen} images={selectedImages} onClose={closeImageModal} />
        </>
    );
};

export default List;
