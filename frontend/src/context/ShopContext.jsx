import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from 'axios'
import { products as localProducts } from '../assets/assets/frontend_assets/assets';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '$';
    const delivery_fee = 10;
    const backendUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000').trim().replace(/\/$/, '')
    const [search,setSearch] = useState('');
    const [showSearch,setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState(() => localStorage.getItem('token') || '')
    const [products, setProducts] = useState(localProducts);
    const navigate = useNavigate();

    const addToCart = async (itemId,size) =>{

        if(!size){
          toast.error('Select Product Size')
          return;
        }
       
        let cartData = structuredClone(cartItems);

        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1;
            }
            else{
                cartData[itemId][size] = 1;
            }
        }
        else{
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        if (token){
            try{
                await axios.post(backendUrl + '/api/cart/add',{itemId,size}, {headers:{token}})
         }catch(error){
            console.log(error);
            toast.error(error.message)
            
         }
    }

     }

    const getCartCount = () =>{
        let totalCount = 0;
        for(const items in cartItems){
            for(const item in cartItems[items]){
              try{
                if(cartItems[items][item]){
                   totalCount += cartItems[items][item];
                }
              } catch(error){

              }           
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {

        let cartData = structuredClone(cartItems);

        if (quantity > 0) {
            cartData[itemId][size] = quantity;
        } else if (cartData[itemId]) {
            delete cartData[itemId][size];
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
        }

        setCartItems(cartData)

        if(token){
            try{
                await axios.post(backendUrl + '/api/cart/update', {itemId,size,quantity},{headers:{token}})
            }catch(error){
            console.log(error);
            toast.error(error.message) 
            }
        }

    }

    const getCartAmount = () =>{
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product) => product._id === items);
                for(const item in cartItems[items]){
                   try{
                    if(cartItems[items][item] > 0){
                       totalAmount += itemInfo.price * cartItems[items][item];
                   }
                    } catch(error){
                    
                   }
                
            }
        }
        return totalAmount;
    }

    const getProductsData = async () =>{
        try{

            const response = await axios.get(backendUrl + '/api/product/list')
            if(response.data.success){
                const apiProducts = response.data.products || []
                const localNames = new Set(
                    localProducts.map(product => product.name.trim().toLowerCase())
                )
                const additionalProducts = apiProducts.filter(product =>
                    product.name &&
                    product.name.trim().toLowerCase() !== 'testing' &&
                    !localNames.has(product.name.trim().toLowerCase())
                )

                setProducts([...localProducts, ...additionalProducts])
            }else{
                setProducts(localProducts)
            }

        }catch(error){
            console.log(error);
            setProducts(localProducts)
        }
    }

    const getUserCart = async ( token ) =>{
        if(!token){
            return
        }

        try{
            const response = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})
            if(response.data.success){
                setCartItems(response.data.cartData)
            }else if(response.data.message?.toLowerCase().includes('authorized')){
                localStorage.removeItem('token')
                setToken('')
                setCartItems({})
            }
        }catch(error){
            console.log(error)
            if(error.response?.status === 401){
                localStorage.removeItem('token')
                setToken('')
                setCartItems({})
            }else{
                toast.error(error.response?.data?.message || error.message)
            }
        }
    }

    useEffect(() => {
        getProductsData();
        getUserCart(localStorage.getItem('token'));
    }, [])

    const value = {
       products,
       currency,
       delivery_fee,
       search,
       setSearch,
       showSearch,
       setShowSearch,
       addToCart,
       cartItems,
       getCartCount,
       updateQuantity,
       getCartAmount,
       navigate,
       backendUrl,
       setToken,
       token,
       setCartItems
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};


export default ShopContextProvider;


