import React, { useState } from 'react'
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios'
import { toast } from 'react-toastify';

const Login = () => {

	const [currentState, setCurrentState] = useState('Login');
	const { setToken, backendUrl, navigate } = useContext(ShopContext)

	const [name, setName] = useState('')
	const [password, setPassword] = useState('')
	const [email, setEmail] = useState('')

	const onSubmitHandler = async (event) =>{
        event.preventDefault();
		try{
			const isSignUp = currentState === 'Sign Up'
			const endpoint = isSignUp ? '/api/user/register' : '/api/user/login'
			const payload = isSignUp ? { name, email, password } : { email, password }
			const response = await axios.post(backendUrl + endpoint, payload)

			if (!response.data.success || !response.data.token) {
				toast.error(response.data.message || `${isSignUp ? 'Registration' : 'Login'} failed`)
				return
			}

			setToken(response.data.token)
			localStorage.setItem('token', response.data.token)
			toast.success(isSignUp ? 'Registration successful' : 'Login successful')
			navigate('/')
			
		}catch(error){
			console.error(error)
			if (error.response?.status === 503) {
				return
			}
			toast.error(error.response?.data?.message || 'Unable to connect to the server')
		}
	}

	return (
		<form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-black'>
			<div className='inline-flex items-center gap-2 mb-2 mt-10'>
				<p className='prata-regular text-3xl'>{currentState}</p>
				<hr className='border-none h-[1.5px] w-8 bg-gray-800'/>
			</div>
	          {currentState ==='Login' ? '' : <input onChange={(e)=>setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-gray-800 text-gray-900 placeholder:text-gray-700' placeholder='Name' required/>}
				<input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800 text-gray-900 placeholder:text-gray-700' placeholder='Email' required/>
				<input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800 text-gray-900 placeholder:text-gray-700' placeholder='Password' required/>
				<div className='w-full flex justify-between text-base mt-[-8px]'>
					<p className='cursor-pointer text-black'>Forgot your password?</p>
					{
						currentState === 'Login'
						? <p onClick={()=>setCurrentState('Sign Up')} className='cursor-pointer text-black'>Create account</p>
						: <p onClick={()=>setCurrentState('Login')} className='cursor-pointer text-black'>Login Here</p>
					}
					</div>
					<button className='bg-black text-white font-light px-8 py-2 mt-4'>{currentState === 'Login' ? 'Sign In' : 'Sign Up'}</button>		    
		</form>
	)
}

export default Login
