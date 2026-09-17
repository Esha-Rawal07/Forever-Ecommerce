import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { products as localProducts } from '../assets/assets/frontend_assets/assets';

const LatestCollection = () => {
 
    const { products } = useContext(ShopContext);
    const latestProducts = (products.length ? products : localProducts).slice(0, 10);
  
      
  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'LATEST'} text2={'COLLECTION'}/>
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-black'>Discover our latest collection, featuring stylish and trendy pieces designed to elevate your everyday look. Explore fresh designs, premium quality, and modern styles—all carefully selected to bring you the best of fashion in one place.</p>
      </div>

     {/* Rendering Products */} 
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {
              latestProducts.map((item,index)=>(
                <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} description={item.description}/>
              ))
            }

          </div>
    </div>
  )
}

export default LatestCollection
