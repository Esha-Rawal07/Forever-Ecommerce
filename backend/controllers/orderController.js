import orderModel from "../models/orderModels.js"
import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import Stripe from 'stripe'
import razorpay from 'razorpay'


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

const currency = 'inr'
const deliveryCharge = 10

//Placing orders using C)D Method
const placeOrder = async (req,res) =>{
   try{

    const { userId, items, amount, address } = req.body;
    let orderUserId = userId;

    if(!orderUserId && req.headers.token){
        try{
            orderUserId = jwt.verify(req.headers.token, process.env.JWT_SECRET).id;
        }catch(error){
            orderUserId = null;
        }
    }

    orderUserId = orderUserId || `guest:${address?.email || Date.now()}`;

    const orderData = {
        userId: orderUserId,
        items,
        address,
        amount,
        paymentMethod:"COD",
        payment: false,
        date: Date.now()
    }

    const newOrder = new orderModel(orderData)
    await newOrder.save()

    if(userId){
        await userModel.findByIdAndUpdate(userId,{cartData:{}})
    }

    res.json({success:true,message:"Order Placed", order: newOrder})

   }catch(error){
    console.log(error)
    res.json({success:false,message:error.message})
   }
}

//Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        // Get frontend URL from request headers
        const { origin } = req.headers;

        // Create order data
        const orderData = {
            userId: userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        };

        // Save order in database
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Create Stripe line items
        const line_items = items.map((item) => ({
            price_data: {
                currency: currency.toLowerCase(),
                product_data: {
                    name: item.name
                },
                unit_amount: Math.round(item.price * 100)
            },
            quantity: item.quantity
        }));

        // Add delivery charge
        line_items.push({
            price_data: {
                currency: currency.toLowerCase(),
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: Math.round(deliveryCharge * 100)
            },
            quantity: 1
        });

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            mode: "payment",

            line_items: line_items,

            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,

            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`
        });

        res.json({
            success: true,
            session_url: session.url
        });

    } catch (error) {
        console.log("Stripe Error:", error);

        res.json({
            success: false,
            message: error.message
        });
    }
};

const verifyStripe = async (req,res) =>{

  const { orderId, success, userId } = req.body

  try{
   
    if(success === "true"){
      await orderModel.findByIdAndUpdate(orderId, {payment:true});
      await userModel.findByIdAndUpdate(userId, {cartData:{}});
      res.json({success: true});
    }else{
      await orderModel.findByIdAndDelete(orderId)
      res.json({success:false})
    }
  }catch(error){
    console.log(error);
    res.json({success: false, message: error.message})

  }
}
//Placing orders using Razorpay Method
const placeOrderRazorpay = async (req,res) =>{

   try {
        const { userId, items, amount, address } = req.body;

        // Get frontend URL from request headers
        const { origin } = req.headers;

        // Create order data
        const orderData = {
            userId: userId,
            items,
            address,
            amount,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now()
        };

        // Save order in database
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString()
        }

        await razorpayInstance.orders.create(options, (error,order)=>{
            if(error){
                console.log(error)
                return res.json({success:false, message: error})
            }
            res.json({success:true,order})
        })
    }catch(error){
       console.log(error);
       res.json({success: false, message: error.message})
    }
}

//Verify Razorpay
const verifyRazorpay = async (req,res) =>{
    try{

        const { userId, razorpay_order_id } = req.body

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        if(orderInfo.status === 'paid'){
            await orderModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});
            await userModel.findByIdAndUpdate(userId,{cartData:{}})
            res.json({success:true, message: 'Payment Successful '});
        }else{
            res.json({success:false, message: 'Payment Failed'})
        }
    }catch(error){
      console.log(error);
      res.json({success: false, message: error.message})
    }

}
//All Orders data for Admin Panel
const allOrders = async (req,res) =>{

    try{
        
        const orders = await orderModel.find({})
        res.json({success:true,orders})
    }catch(error){
        console.log(error);
        res.json({success:false, message:error.message})
        
    }
}

//User Orders Data for Frontend
const userOrders = async (req,res) =>{
    try{
     const orders = await orderModel.find({userId: req.body.userId}).sort({date: -1})
     res.json({success:true, orders})
    }catch(error){
     console.log(error)
     res.json({success:false,message:error.message})
    }
}

//Update Orders Status from Admin Panel
const updateStatus = async (req,res) =>{

    try{

        const { orderId, status } = req.body
        
        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({success:true, message:'Status Updated'})
    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message})
        
    }
}

export { verifyRazorpay, verifyStripe ,placeOrder, placeOrderStripe, placeOrderRazorpay, userOrders, updateStatus, allOrders }