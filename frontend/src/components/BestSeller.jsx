import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';
import { products as localProducts } from '../assets/assets/frontend_assets/assets';

const BestSeller = () => {

    const {products} = useContext(ShopContext);
    const selectedProducts = [];
    const selectedNames = new Set();

    for (const product of localProducts.filter((item) => item.bestseller)) {
        if (!selectedNames.has(product.name)) {
            selectedNames.add(product.name);
            selectedProducts.push(product);
        }
    }

    for (const product of localProducts) {
        if (selectedProducts.length === 5) break;
        if (!selectedNames.has(product.name)) {
            selectedNames.add(product.name);
            selectedProducts.push(product);
        }
    }

    const bestSeller = selectedProducts
        .map((localProduct) => products.find((product) => product.name === localProduct.name) || localProduct);

  return (
    <div className='my-10'>
        <div className='text-center text-3xl py-8'>
            <Title text1={'BEST'} text2={'SELLERS'}/>
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-black'>Shop our most-loved styles, chosen by customers for their quality, comfort, and timeless appeal. Discover popular picks that are selling fast—find your favorites before they’re gone!</p>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {
                bestSeller.map((item,index)=>(
                    <ProductItem key={index} id={item._id} name={item.name} image={item.image} price={item.price} description={item.description}/>
                ))
            }
        </div>
    </div>
  )
}

export default BestSeller
