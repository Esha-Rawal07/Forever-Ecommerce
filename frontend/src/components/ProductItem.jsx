import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import {Link} from 'react-router-dom'
import { assets } from '../assets/assets/frontend_assets/assets';


const ProductItem = ({id,image,name,price}) => {

    const {currency} = useContext(ShopContext);
  const productImage = image?.[0] || assets.upload_area;

  return (
    <Link className='text-black cursor-pointer' to={`/product/${id}`}>
        <div className='overflow-hidden'>
            <img
              className='hover:scale-110 transition ease-in-out'
              src={productImage}
              alt={name}
              onError={(event) => {
                event.currentTarget.src = assets.upload_area
              }}
            />
            </div>
             <p className='pt-3 pb-1 text-[15px] sm:text-base font-medium leading-snug text-gray-900'>{name}</p>
             <p className='text-sm font-bold text-black'>{currency}{price}</p>
      
    </Link>
  )
}

export default ProductItem
