import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';

const Orders = () => {

	const { backendUrl, token, currency } = useContext(ShopContext);
	const [orders,setOrders] = useState([])

	useEffect(() => {
		const loadOrders = async () => {
			const storedOrder = () => {
				try{
					const lastOrder = localStorage.getItem('lastOrder');
					return lastOrder ? JSON.parse(lastOrder) : null;
				}catch(error){
					return null;
				}
			};

			if(!token){
				const lastOrder = storedOrder();
				setOrders(lastOrder ? [lastOrder] : []);
				return;
			}

			try{
				const response = await axios.post(`${backendUrl}/api/order/userorders`, {}, {headers:{token}})
				if(response.data.success){
					const lastOrder = storedOrder();
					setOrders(response.data.orders.length ? response.data.orders : (lastOrder ? [lastOrder] : []))
				}
			}catch(error){
				console.log(error)
				const lastOrder = storedOrder();
				setOrders(lastOrder ? [lastOrder] : [])
			}
		}
 
		loadOrders()
	}, [backendUrl, token])

	const trackOrder = (orderToTrack) => {
		const updatedOrders = orders.map(order => {
			const sameOrder = order === orderToTrack ||
				(order._id && order._id === orderToTrack._id)
			return sameOrder ? { ...order, status: 'Out for Delivery' } : order
		})

		setOrders(updatedOrders)
		const lastOrder = localStorage.getItem('lastOrder')
		if(lastOrder){
			try{
				const storedOrder = JSON.parse(lastOrder)
				if(storedOrder._id === orderToTrack._id || storedOrder.date === orderToTrack.date){
					localStorage.setItem('lastOrder', JSON.stringify({ ...storedOrder, status: 'Out for Delivery' }))
				}
			}catch(error){
				console.log(error)
			}
		}
	}

	const orderItems = orders.flatMap(order =>
		(order.items || []).map(item => ({...item, order}))
	)
	return (

		<div className='border-t border-gray-200 pt-16'>
         <div className='text-2xl'>
			<Title text1={'MY'} text2={'ORDERS'}/>
		 </div>
		 <div>
			{orderItems.length ? orderItems.map((item,index) => (
					<div key={index} className='py-4 border-t border-b border-gray-200 text-black flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
						<div className='flex items-start gap-6 text-sm'>
							<img className='w-16 sm:w-20' src={item.image?.[0] || item.image} alt={item.name}/>
							<div>
								<p className='sm:text-base font-medium'>{item.name}</p>
								<div className='flex items-center gap-3 mt-2 text-base text-black'>
									<p>{currency}{item.price}</p>
									<p>Quantity: {item.quantity}</p>
									<p>Size: {item.size}</p>
									</div>
								<p className='mt-2'>Date: <span className='text-gray-700'>{item.order.date ? new Date(item.order.date).toLocaleDateString() : new Date().toLocaleDateString()}</span></p>
								<p className='mt-1'>Payment: <span className='text-gray-700'>{item.order.paymentMethod || 'COD'} ({item.order.payment ? 'Paid' : 'Pending'})</span></p>
							</div>
							</div>
							<div className='md:w-1/2 flex justify-between'>
							<div className='flex items-center gap-2'>
								<p className='min-w-2 h-2 rounded-full bg-green-500'></p>
								<p className='text-sm md:text-base'>{item.order.status || 'Order Placed'}</p>
								</div>
								<button type='button' onClick={()=>trackOrder(item.order)} className='border border-gray-300 px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>
							</div>
					</div>
				)) : <p className='py-8 text-gray-500'>No orders yet.</p>}
		 </div>
	</div>
			

	)

}

export default Orders
