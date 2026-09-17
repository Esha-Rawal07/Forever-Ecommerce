import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'

const List = ({ token }) => {

  const [list, setList] = useState([])

  const fetchList = async () => {
    try{
      const response = await axios.get(backendUrl + '/api/product/list')
      if(response.data.success){
        setList(response.data.products || []);
      }
      else{
        toast.error(response.data.message)
      }

    }catch(error){
      console.error(error);
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success(response.data.message)
        setList((currentList) => currentList.filter((item) => item._id !== id))
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || error.message)

    }
  }
  useEffect(()=>{
    fetchList()
  },[])
  return (
   <>
   <p className='text-black mb-2'>All Products Lists</p>
   <div className='flex flex-col gap-2'>
    {/* List Table Title */}

    <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 bg-gray-200 text-sm font-semibold'>
      <b className='text-gray-900'>Image</b>
      <b className='text-gray-900'>Name</b>
      <b className='text-gray-900'>Category</b>
      <b className='text-gray-900'>Price</b>
      <b className='text-gray-900 text-center'>Action</b>
    </div>

    {/* Product List */}

    {
      list.map((item) => (
        <div key={item._id} className='grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-3 border-b border-gray-300 px-3 py-3 text-base text-gray-900'>
          <img
            className='h-20 w-20 object-cover'
            src={item.image?.[0] || assets.upload_area}
            alt={item.name}
            onError={(event) => {
              event.currentTarget.src = assets.upload_area
            }}
          />
          <p className='truncate'>{item.name}</p>
          <p>{item.category}</p>
          <p>{currency}{item.price}</p>
          <button
            type='button'
            onClick={() => removeProduct(item._id)}
            className='text-center text-lg text-red-600'
            aria-label={`Remove ${item.name}`}
          >
            X
          </button>
          </div>
      ))
    }
   </div>
   </>
  )
}

export default List
