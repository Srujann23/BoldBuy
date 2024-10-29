import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl,setUserName } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
        if (currentState === 'Sign Up') {
            const response = await axios.post(backendUrl + '/api/user/register', { name, email, password });
            if (response.data.success) {
                handleSuccessfulAuth(response.data.token, name);
                toast.success("Registration successful!");
            } else {
                toast.error(response.data.message);
            }
        } else {
            const response = await axios.post(backendUrl + '/api/user/login', { email, password });
            if (response.data.success) {
                handleSuccessfulAuth(response.data.token);
                toast.success("Login successful!");
            } else {
                toast.error(response.data.message);
            }
        }
    } catch (error) {
        toast.error(error.response?.data?.message || error.message);
    }
}

const handleSuccessfulAuth = (token, name = '') => {
    setToken(token);
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    if (name) {
        setUserName(name);
    } else {
        getUserData(token);
    }
}

const getUserData = async (token) => {
    try {
        const response = await axios.get(backendUrl + '/api/user/profile', {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
            setUserName(response.data.user.name);
        }
    } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || 'Failed to fetch user data');
    }
}

  useEffect(()=>{
    if(token){
      navigate('/')
    }
  },[token,navigate])

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>
      {currentState === 'Login' ? '' : <input onChange={(e) => setName(e.target.value)} value={name} type="text" className="w-full px-3 py-2 border border-gray-800" placeholder='Name' />}
      <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className="w-full px-3 py-2 border border-gray-800" placeholder='Email' />
      <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className="w-full px-3 py-2 border border-gray-800" placeholder='Password' />
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className='cursor-pointer'>Forgot Password</p>
        {
          currentState === 'Login'
            ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Create account</p>
            : <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login Here</p>
        }
      </div>
      <button className='bg-black text-white font-light px-8 py-2 mt-4'>{currentState === 'Login' ? 'Sign In' : 'Sign Up'}</button>

    </form>

  )
}

export default Login