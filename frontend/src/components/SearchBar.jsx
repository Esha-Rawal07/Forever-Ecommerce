import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets/frontend_assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {

    const {search, setSearch, showSearch, setShowSearch} = useContext(ShopContext);
    const [visible,setVisible] = useState(false)
    const location = useLocation();

    useEffect(()=>{
      if(location.pathname.includes('collection')){
         setVisible(true);
      }
      else{
        setVisible(false);
      }
    },[location])

  return showSearch && visible ? (
    <div className='bg-white py-2 text-center'>
      <div className='inline-flex items-center justify-center border border-gray-500 bg-white px-5 py-3 my-3 mx-3 rounded-full w-3/4 sm:w-1/2'>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='flex-1 outline-none bg-transparent text-base text-gray-800 placeholder:text-gray-500'
          type='text'
          placeholder='Search'
        />
        <img
          className='w-4'
          src={assets.search_icon}
          alt='Search icon'
          style={{ filter: 'grayscale(1) brightness(0.35)' }}
        />
      </div>
      <img
        onClick={() => setShowSearch(false)}
        className='inline w-3.5 cursor-pointer'
        src={assets.cross_icon}
        alt='Close search'
        style={{ filter: 'grayscale(1) brightness(0.35)' }}
      />
    </div>
  ) : null
}

export default SearchBar
