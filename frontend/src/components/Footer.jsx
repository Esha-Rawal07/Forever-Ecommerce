import React from 'react'
import { assets } from '../assets/assets/frontend_assets/assets'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm sm:text-base'>
        <div>
            <img src={assets.logo} className='mb-5 w-32' alt=""/>
            <p className='w-full md:w-2/3 text-black'>Discover your perfect style with Forever — your destination for trendy, timeless, and effortlessly elegant fashion. Shop the latest collections, explore best sellers, and find pieces made to make every moment feel special.</p>
        </div>
       
       <div>
        <p className='text-xl font-medium mb-5'>COMPANY</p>
        <ul className='flex flex-col gap-1 text-black'>
          <li>Home</li>
          <li>About us</li>
          <li>Delivery</li>
          <li>Privacy policy</li>
        </ul>
       </div>

       <div>
        <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
        <ul className='flex flex-col gap-1 text-black'>
          <li>+1-212-456-7890</li>
          <li>contact@foreveryou.com</li>
        </ul>
       </div>
      </div>

      <div>
        <hr className='border-gray-300' />
        <p className='py-5 text-sm sm:text-base text-center text-black'>Copyright 2025@ forever.com - All Right Reserved.</p>
      </div>
    </div>
  )
}

export default Footer
