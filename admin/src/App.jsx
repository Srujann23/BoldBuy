import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes, Route, Navigate } from 'react-router-dom';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import cors from 'cors';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = '₹';
console.log("Backend URL:", backendUrl); // Log the backend URL

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):'');

    // Store the token in localStorage whenever it changes
    useEffect(() => {
            localStorage.setItem('token', token);
      
    }, [token]);

    // Handle logout
    const handleLogout = () => {
        setToken(''); // Clear token in state
    };

    return (
        <div className='bg-gray-50 min-h-screen'>
            <ToastContainer />
            {token === "" ? (
                <Login setToken={setToken} />
            ) : (
                <>
                    <Navbar setToken={setToken} handleLogout={handleLogout} />
                    <hr />
                    <div className='flex w-full'>
                        <Sidebar />
                        <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
                            <Routes>
                                <Route path="/add" element={<Add token={token}/>} />
                                <Route path="/list" element={<List token={token}/>} />
                                <Route path="/orders" element={<Orders token={token}/>} />
                                {/* Redirect to add if no matching route */}
                                <Route path="*" element={<Navigate to="/add" />} />
                            </Routes>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default App;
