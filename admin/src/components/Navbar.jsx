import React from 'react'
import {assets} from '../assets/assets'

const Navbar = ({setToken}) =>{
   return (
    <div className='flex items-center justify-between px-5 py-4 sm:px-10'>
      <img className='w-40 sm:w-48' src={assets.logo} alt='Forever Admin Panel'/>
      <button onClick={()=>setToken('')}className='rounded-full bg-gray-600 px-5 py-2 text-xs text-white sm:px-7 sm:text-sm'>Logout</button>
    </div>
   )
}

export default Navbar
