import React from 'react'
import { assets } from '../assets/assets/frontend_assets/assets'

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row border border-gray-400 mt-4'>
      {/* Hero Left Side */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-8'>
       <div className='text-black'>
        <div className='flex items-center gap-2'>
            <p className='w-8 md:w-11 h-[2px] bg-black'></p>
            <p className='font-medium text-sm md:text-base tracking-[0.18em] uppercase text-black'>Our Bestseller</p>
        </div>
       <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed text-black'>Latest Arrivals</h1>
       <div className='flex items-center gap-2'>
        <p className='font-semibold text-sm md:text-base tracking-[0.18em] uppercase text-black'>Shop Now</p>
        <p className='w-8 md:w-11 h-[1px] bg-black'></p>
       </div>
       </div>
      </div>
       {/* Hero Right Side */}
       <img className='w-full sm:w-1/2' src={assets.hero_img} alt=""/>
    </div>
  )
}

export default Hero
