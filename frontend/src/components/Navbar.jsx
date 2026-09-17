import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets/frontend_assets/assets'
import {Link, NavLink} from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  
    const [visible,setVisible] = useState(false);

    const {setShowSearch, getCartCount, navigate, token, setToken, setCartItems} = useContext(ShopContext);

    const logout = () =>{
        localStorage.removeItem('token')
        navigate('/login')
        setToken('')
        setCartItems({})
    
    }
    return (
    <div className='flex items-center justify-between py-5 font-medium'>

        <Link to='/'><img src={assets.logo} className='w-52 h-auto object-contain' alt="Logo"/></Link>

        <ul className='hidden sm:flex gap-5 text-base text-black'>

            <NavLink end to='/' className='flex flex-col items-center gap-1'>
                <p className='text-base font-medium'>HOME</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-slate-700 hidden'/>
            </NavLink>

            <NavLink to='/collection' className='flex flex-col items-center gap-1'>
                <p className='text-base font-medium'>COLLECTION</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-slate-700 hidden'/>
            </NavLink>

            <NavLink to='/about' className='flex flex-col items-center gap-1'>
                <p className='text-base font-medium'>ABOUT</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-slate-700 hidden'/>
            </NavLink>

            <NavLink to='/contact' className='flex flex-col items-center gap-1'>
                <p className='text-base font-medium'>CONTACT</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-slate-700 hidden'/>
            </NavLink>
        </ul>
      
      <div className='flex items-center gap-6'>
        <img onClick={()=>setShowSearch(true)} src={assets.search_icon} className='nav-icon w-5 cursor-pointer' alt=""/>

          <div className='group relative'>
              <img className='nav-icon w-5 cursor-pointer' src={assets.profile_icon} alt="Profile"/>
          {/* Dropdown Menu */}
              <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50'>
            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-200 text-gray-600 rounded'>
                     <p onClick={()=>token ? null : navigate('/login')} className='cursor-pointer hover:text-black'>My Profile</p>
                     <p onClick={()=>token ? navigate('/orders') : navigate('/login')} className='cursor-pointer hover:text-black'>Orders</p>
                     {token ?
                        <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p> :
                        <p onClick={()=>navigate('/login')} className='cursor-pointer hover:text-black'>Login</p>
                     }
            </div>
              </div>
        </div>
        <Link to='/cart' className='relative'>
            <img src={assets.cart_icon} className='nav-icon w-5 min-w-5' alt=""/>
            <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
        </Link>
        <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt=""/>
      </div>

      {/* Sidebar menu for small screens */}
      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
        <div className='flex flex-col text-black'>
            <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer text-black'>
                <img className='nav-icon h-4 rotate-180' src={assets.dropdown_icon} alt=""/>
                <p>Back</p>
            </div>
            <NavLink end onClick={() => setVisible(false)} className='py-2 pl-6 border-b border-gray-200 text-black' to='/'>HOME</NavLink>
            <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-b border-gray-200 text-black' to='/collection'>COLLECTION</NavLink>
            <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-b border-gray-200 text-black' to='/about'>ABOUT</NavLink>
            <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-b border-gray-200 text-black' to='/contact'>CONTACT</NavLink>

        </div>
      </div>
</div>
  )
}

export default Navbar
