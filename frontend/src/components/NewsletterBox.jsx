import React from 'react'

const NewsletterBox = () => {

    const onSubmitHandler = (event) => {
        event.preventDefault();

    }
  return (
    <div className='text-center'>
        <p className='text-2xl font-medium text-black'>Subscribe now & get 20% off</p>
        <p className='text-black mt-3'>Subscribe now and enjoy 20% off your first order! Get exclusive offers, fresh updates, and stylish picks delivered straight to you. Don’t miss out—subscribe today!</p>
        <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border border-gray-300 pl-3'>
          <input className='w-full sm:flex-1 outline-none text-gray-700 placeholder:text-gray-700' type="email" placeholder='Enter your email' required />
            <button type='submit' className='bg-black text-white text-xs px-10 py-4'>SUBSCRIBE</button>
        </form>
    </div>
  )
}

export default NewsletterBox
