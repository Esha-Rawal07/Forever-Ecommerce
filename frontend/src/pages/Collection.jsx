import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets, products as localProducts } from '../assets/assets/frontend_assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {

  const { products, search, showSearch } = useContext(ShopContext);
  const catalogProducts = products.length ? products : localProducts;
  const [showFilter,setShowFilter] = useState(false);
  const [filterProducts,setFilterProducts] = useState(catalogProducts);
  const [category,setCategory] = useState([]);
  const [subCategory, setSubcategory] = useState([]);;
  const [sortType,setSortType] = useState('releavent')

  const toggleCategory = (e) => {

    if (category.includes(e.target.value)) {
      setCategory(prev=> prev.filter(item => item !== e.target.value))
    }
    else{
      setCategory(prev => [...prev,e.target.value])
    }
  }

  const toggleSubCategory = (e) =>{
    if (subCategory.includes(e.target.value)){
      setSubcategory(prev=> prev.filter(item => item !== e.target.value))
    }
    else{
      setSubcategory(prev => [...prev,e.target.value])
    }
  }

  useEffect(()=>{
    let productsCopy = catalogProducts.slice();

    if(showSearch && search){
      productsCopy = productsCopy.filter(item => item.name?.toLowerCase().includes(search.toLowerCase()));
    }

    if (category.length > 0){
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }

    if (subCategory.length > 0){
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
    }

    if (sortType === 'low-high'){
      productsCopy.sort((a,b)=>(a.price - b.price));
    } else if (sortType === 'high-low'){
      productsCopy.sort((a,b)=>(b.price - a.price));
    }

    setFilterProducts(productsCopy);
  }, [catalogProducts, category, subCategory, search, showSearch, sortType])
  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t border-gray-300'>

      {/* Filter Options */}
      <div className='min-w-60'>
        <p onClick={()=>setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt=""/>
        </p>

        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-medium font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-medium font-light text-black'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Men'} onChange={toggleCategory}/> Men
            </p>
             <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Women'} onChange={toggleCategory} /> Women
            </p>
             <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Kids'} onChange={toggleCategory}/> Kids
            </p>
          </div>
        </div>
        {/* Subcategory Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-medium font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-medium font-light text-black'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Topwear'} onChange={toggleSubCategory}/> Topwear
            </p>
             <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Bottomwear'} onChange={toggleSubCategory}/> Bottomwear
            </p>
             <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Winterwear'} onChange={toggleSubCategory}/> Winterwear
            </p>
          </div>
        </div>
      </div>
      
      {/* Right Side */}
      <div className='flex-1'>

        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={'COLLECTION'}/>
          {/* Product Sort */}
          <select onChange={(e)=>setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
            <option value="relavent">Sort by: Relavent</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

     {/* Map Products */}
     <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gp-y-6'>
       {
        filterProducts.map((item,index)=>(
          <ProductItem key={item._id || item.name || index} name={item.name} image={item.image} id={item._id} price={item.price} description={item.description}/>
        ))
       }

     </div>
      </div>
    </div>
  )
}

export default Collection
