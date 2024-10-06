import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App';
import axios from 'axios';
import { currency } from '../App';
import { toast } from 'react-toastify';
const List = ({ token }) => {


    const [list, setList] = useState([]);

    const fetchList = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list', { headers: { token } });
            if (response.data.success) {
                setList(response.data.products);
            }
            else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const removeProduct = async (id) => {
        try {
            const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })

            if (response.data.success) {
                toast.success(response.data.message)
                await fetchList();
            }
            else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        fetchList();
    }, [])


    return (
        <>
    <p className='mb-4 text-lg font-semibold'>All Products List</p>
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
        {
            list.map((item, index) => (
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
            ))
        }
    </div>
</>


    )
}
export default List
