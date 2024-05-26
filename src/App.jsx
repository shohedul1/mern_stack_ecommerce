import React, { useEffect } from 'react'
import Header from './components/Header'
import { Outlet } from 'react-router-dom'
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux';
import { setDataProduct } from './redux/productSlide';


const App = () => {
  const dispatch = useDispatch();
  const productData = useSelector((state)=>state.product)
  // console.log(productData)

  useEffect(() => {
    (async () => {
      const res = await fetch("https://mern-stack-ecommerce-api-pys8.onrender.com/getproduct")
      const resData = await res.json()
      dispatch(setDataProduct(resData))
    })()
  }, []);

  return (
    <>
      <Toaster />
      <div>
        <Header />
        <main className="pt-16 bg-slate-100 min-h-[calc(100vh)]">
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default App