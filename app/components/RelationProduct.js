import React from 'react'
import { getProducts } from '@/sanity/product-util';
import Card from '../components/Card';

const products = await getProducts();

const RelationProduct = () => {
  return (
    <>
    <div className="flex flex-col items-center justify-center mt-10 space-y-4">
    <h1 className="text-4xl font-bold text-[#5B20B6] text-center">Related Products</h1>
 </div>

 <div className='flex p-10'>
 <div className='mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16'>
 {
   products.map((product)=>(
     <Card key={product._id} product={product}/>
   ))
 }
 </div>
 </div>
    </>
  )
}

export default RelationProduct;