import productModel from '../models/productModel.js';
import { v2 as cloudinary } from "cloudinary"
import path from 'path';
// Function for add product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    const images = Object.values(req.files ?? {}).flat().filter(Boolean)

    if (images.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one product image is required' })
    }

     let imagesUrl = await Promise.all(
        images.map(async (item) =>{
          try {
            let result = await cloudinary.uploader.upload(item.path, {resource_type:'image'});
            return result.secure_url
          } catch (uploadError) {
            console.error('Cloudinary upload failed; using local image:', uploadError.message)
            return `${req.protocol}://${req.get('host')}/uploads/${path.basename(item.path)}`
          }
        })
      )

   const productData = {
    name,
    description,
    category,
    price: Number(price),
    subCategory,
    bestseller: bestseller === "true" ? true : false,
    sizes: JSON.parse(sizes),
    image: imagesUrl,
    date: Date.now()
   }
   console.log(productData);

   const product = new productModel(productData);
   await product.save()

    res.json({ success: true, message: "Product Added" })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
};

// Function for list product
const listProduct = async (req, res) => {
  try{

    const products = await productModel.find({});
    res.json({success:true,products})

  }catch(error){
    console.log(error);
    res.json({ success: false, message: error.message })
  
  }
 
}

// Function for remove product
const removeProduct = async (req, res) => {
  try{

    await productModel.findByIdAndDelete(req.body.id)
    res.json({success:true, message:"Product Removed"})

  }catch(error){
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}

// Function for single product info
const singleProduct = async (req, res) => {
  try{

    const { productId } = req.body
    const product = await productModel.findById(productId)
    res.json({success:true, product})

  }catch(error){
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}

export { listProduct, addProduct, removeProduct, singleProduct };
