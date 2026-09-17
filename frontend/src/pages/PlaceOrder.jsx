import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets/frontend_assets/assets';
import { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
 
  const [method, setMethod] = useState('cod');
  const {navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products} = useContext(ShopContext);
  const [formData, setFormData] = useState({
    firstName:'',
    lastName:'',
    email:'',
    street:'',
    city:'',
    state:'',
    zipcode:'',
    country:'',
    phone:''
  })

  const onChangeHandler = (event) =>{
    const name = event.target.name 
    const value = event.target.value
    setFormData(data => ({...data,[name]:value}))
  }

 const initPay = (order) =>{
   const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: 'Order Payment',
    description: 'Order Payment',
    order_id: order.id,
    receipt: order.receipt,
    handler: async (response) => {
      console.log(response);
      try{
   
        const { data } = await axios.post(backendUrl + '/api/order/verifyRazorpay',response,{headers:{token}})
        if(data.success){
          navigate('/orders')
          setCartItems({})
        }
      }catch(error){
        console.log(error);
        toast.error(error)
        
      }
    }
   }
   const rzp = new window.Razorpay(options)
   rzp.open()
 }

  const onSubmitHandler = async (event) =>{
    event.preventDefault()

    try{

      let orderItems = []

      for(const items in cartItems){
        for(const item in cartItems[items]){
          if(cartItems[items][item] > 0){
            const itemInfo = structuredClone(
              products.find(product => String(product._id) === String(items))
            )
            if(itemInfo){
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }


      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      }

      switch(method){

        case 'cod': 
          const response = await axios.post(
            backendUrl + '/api/order/place',
            orderData,{headers:{token}})
    
          
          if(response.data.success){
            if(response.data.order){
              localStorage.setItem('lastOrder', JSON.stringify(response.data.order))
            }
            setCartItems({})
            navigate('/orders', { replace: true })
          }else{
            toast.error(response.data.message)
          }
          break;

  case "stripe":

    try {

        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please login before placing an order");
            return;
        }

        const responseStripe = await axios.post(
            backendUrl + "/api/order/stripe",
            orderData,
            {
                headers: {
                    token: token
                }
            }
        );

        console.log("Stripe Response:", responseStripe.data);

        if (responseStripe.data.success) {

            const { session_url } = responseStripe.data;

            if (session_url) {

                window.location.href = session_url;

            } else {

                toast.error("Stripe session URL not found");

            }

        } else {

            toast.error(responseStripe.data.message);

        }

    } catch (error) {

        console.log("Stripe Error:", error);

        toast.error(
            error.response?.data?.message ||
            "Stripe payment failed"
        );
    }
    break;

    case 'razorpay':
      
    const responseRazorpay = await axios.post(backendUrl + '/api/order/razorpay',orderData,{headers:{token}})
    if(responseRazorpay.data.success){
       initPay(responseRazorpay.data.order);
    }
    break;

         default:
            break;
      }
      
    }catch(error){
      toast.error(
        error.response?.data?.message ||
        (error.request ? 'Unable to connect to the order server' : error.message)
      )
    }
  }


  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t border-gray-200'>
     {/* Left Side  */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
      
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-400 text-gray-900 placeholder-gray-700 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name'/>
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-400 text-gray-900 placeholder-gray-700 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name'/>
        </div>
          <input required onChange={onChangeHandler} name='email' value={formData.email}className='border border-gray-400 text-gray-900 placeholder-gray-700 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address'/>
          <input required onChange={onChangeHandler} name='street' value={formData.street}className='border border-gray-400 text-gray-900 placeholder-gray-700 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street'/>
         <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-400 text-gray-900 placeholder-gray-700 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City'/>
          <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-400 text-gray-900 placeholder-gray-700 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State'/>
        </div>
         <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-400 text-gray-900 placeholder-gray-700 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode'/>
          <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-400 text-gray-900 placeholder-gray-700 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country'/>
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone}className='border border-gray-400 text-gray-900 placeholder-gray-700 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone'/>
      </div>
      {/* Right Side */}
      <div className='mt-8'>

        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          {/* Payment Method Selection */}
         <div className='flex gap-3 flex-col lg:flex-row'>
          <div onClick={()=>setMethod('stripe')}className='flex items-center gap-3 border border-gray-400 rounded p-2 px-3 cursor-pointer'>
            <p className={`min-w-3.5 h-3.5 border border-gray-400 rounded-full ${method === 'stripe' ? 'bg-green-500' : ''}`}></p>
            <img className='h-5 mx-4 brightness-30' src={assets.stripe_logo} alt=""/>
          </div>
          <div onClick={()=>setMethod('razorpay')} className='flex items-center gap-3 border border-gray-400 rounded p-2 px-3 cursor-pointer'>
            <p className={`min-w-3.5 h-3.5 border border-gray-400 rounded-full ${method === 'razorpay' ? 'bg-green-500' : ''}`}></p>
            <img className='h-5 mx-4 brightness-30' src={assets.razorpay_logo} alt=""/>
          </div>
          <div onClick={()=>setMethod('cod')} className='flex items-center gap-3 border border-gray-400 rounded p-2 px-3 cursor-pointer'>
            <p className={`min-w-3.5 h-3.5 border border-gray-400 rounded-full ${method === 'cod' ? 'bg-green-500' : ''}`}></p>
            <p className='text-black text-sm font-medium mx-4'>CASH ON DELIVERY</p>
          </div>
         </div>
         <div className='w-full text-end mt-8'>
          <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
          
         </div>
        </div>

      </div>
    </form>
  )
}

export default PlaceOrder
