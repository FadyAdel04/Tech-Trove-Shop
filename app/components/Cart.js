'use client';
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import useCartStore from "../../cartStore";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {createOrder} from '@/sanity/order-util'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Cart() {

    const cart = useCartStore((state) => state.cart);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const totalItems = useCartStore((state) => state.totalItems);
    const cartTotal = useCartStore((state) => state.cartTotal);
    const[loading,setLoading] = React.useState(false);
    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter();
    const stripe = useStripe();
    const elements = useElements();

    const handleRemoveFromCart = (productId) => {
        removeFromCart(productId);
    }

    const onSubmit = async (e) => {
      const cardElement = elements?.getElement("card");
      e.preventDefault();
      setLoading(true);
      toast.success('Payed Success');
      
      try {
        if (!stripe || !cardElement){
          return null;
        } 

        const  data  = await axios.post("/api/stripe", {
          data: { amount: cartTotal.toFixed(0) },
        });
        console.log(data);
        const res = await stripe?.confirmCardPayment(data?.data?.intent, {
          payment_method:{ card: cardElement }
        });
        //console.log(res.paymentIntent.status);
        const status = res?.paymentIntent?.status;
        console.log(status);

        if(status === "succeeded"){
          setLoading(false);
          console.log("success")
          const email = user?.emailAddresses[0]?.emailAddress;
          const res = await createOrder(email,cart);  
          if(res){
            router.push('/order')
          }
        }
      } catch (error) {
        console.log(error);
      }
    };    

    return (
        <div className='max-w-3xl mx-auto mt-20'>
            <h1 className="text-3xl text-center font-semibold text-[#5B20B6] mb-6">{totalItems} items in Cart</h1>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="text-[#5B20B6] border-b border-gray-200">
                        <th className="py-2 px-4">Product</th>
                        <th className="py-2 px-4">Quantity</th>
                        <th className="py-2 px-4">Color</th>
                        <th className="py-2 px-4">Price</th>
                        <th className="py-2 px-4">Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {cart?.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 text-center border-b border-gray-300 text-[#5B20B6]">
                            <td className="py-2 px-4 flex items-center">
                                <img className='mr-2' src={product.image} width={50} height={30} alt="art" />
                                {product.name}
                            </td>
                            <td className="py-2 px-4">{product.quantity}</td>
                            <td className="py-2 px-4">{product.color}</td>
                            <td className="py-2 px-4">${(product.price * product.quantity).toFixed(2)}</td>
                            <td className="py-2 px-4">
                            <FaTrash onClick={()=>{handleRemoveFromCart(product?._id)}} className="text-[#5B20B6] mx-auto cursor-pointer" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Total Section */}
            <div className="mt-4 text-[#5B20B6] ml-auto">
                <p className="text-lg font-semibold text-right mr-4">Total: ${cartTotal.toFixed(2)}</p>
            </div>

            {
                cartTotal > 0 && (<>
                <div className='mt-10 p-10 bg-gray-100'>
                <CardElement />
                </div>
                </>)
              }
              
            <div className="mt-6 text-[#5B20B6] max-w-sm mx-auto space-y-4">
            <ToastContainer 
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          />
            {
                cartTotal > 0 && (<>
                  <button onClick={onSubmit} className="text-lg w-full font-semibold text-center mr-4 bg-[#5B20B6]  text-white py-2 px-4 rounded hover:text-[#5B20B6] hover:bg-white border border-[#5B20B6]">
                  {
                    loading ? "Loading..." : "Pay"
                  }
                </button>  
                </>)
              }

              <button className="text-lg w-full font-semibold text-center mr-4 bg-white hover:bg-[#5B20B6] hover:text-white text-[#5B20B6] border border-[#5B20B6] py-2 px-4 rounded">
              <Link href="/">
                Back to Shopping
                </Link>  
              </button>  
            </div>
        </div>
    );
}

export default Cart;