import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

const createToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//Route for usser login
const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User does not exist"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET
        );

        res.json({
            success: true,
            token
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: error.message
        });
    }
};

//Route for user register
const registerUser = async(req,res)=>{
   try{

    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({success:false, message:'Database unavailable'})
    }

    const { name, email, password } = req.body;

    //Checking user already exists or not 
    const exists = await userModel.findOne({email});
    if(exists){
        return res.json({success:false, message:"User already exists"})
    }

    //validating email format & strong password
    if(!validator.isEmail(email)){
        return res.json({success:false, messsage:"Please enter a valid email"})
     }

    if(password.length < 8){
        return res.json({success:false, messsage:"Please enter a strong password"})
     }

     //hashing user password
     const salt = await bcrypt.genSalt(10)
     const hashedPassword = await bcrypt.hash(password,salt)

     const newUser = new userModel({
        name,
        email,
        password:hashedPassword
     })

     const user = await newUser.save()

     const token = createToken(user._id)

     res.json({success:true,token})
     
   }catch(error){
     console.log(error);
         res.status(503).json({success:false,message:'Database unavailable'})
   }
}

//Route for admin login
const adminLogin = async(req,res)=>{

    try{

        const {email,password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true, token})
        }else {
            res.json({success:false, message:"Invalid credentials"})
        }
    }catch(error){
        console.log(error);
     res.json({success:false,message:error.message})
    }



}

export { loginUser, registerUser, adminLogin }