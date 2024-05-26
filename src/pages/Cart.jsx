import React from "react";
import { useSelector } from "react-redux";
import emptyCartImage from "../assets/empty.gif";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import CartProduct from "../components/cartProduct";

const Cart = () => {
  const productCartItem = useSelector((state) => state.product.cartItem);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  console.log(productCartItem);

  const totalPrice = productCartItem.reduce(
    (acc, curr) => acc + parseInt(curr.total),
    0
  );
  const totalQty = productCartItem.reduce(
    (acc, curr) => acc + parseInt(curr.qty),
    0
  );

  const handlePayment = async () => {
    if (user.email) {
      try {
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
        const res = await fetch("https://mern-stack-ecommerce-api-pys8.onrender.com/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(productCartItem)
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error("Server error details:", errorData); // Log server error details
          throw new Error('Server error');
        }

        const data = await res.json();
        if (!data.id) {
          throw new Error('Invalid sessionId returned');
        }

        toast("Redirect to payment Gateway...!");
        await stripe.redirectToCheckout({ sessionId: data.id });
      } catch (error) {
        console.error("Payment error:", error.message);
        toast.error(error.message || "Payment failed. Please try again later.");
      }
    } else {
      toast("You have not logged in!");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  };

  return (
    <div className="p-2 md:p-4">
      <h2 className="text-lg md:text-2xl font-bold text-slate-600">Your Cart Items</h2>

      {productCartItem[0] ? (
        <div className="my-4 flex md:flex-row flex-col gap-3">
          <div className="w-full max-w-3xl ">
            {productCartItem.map((el) => (
              <CartProduct
                key={el._id}
                id={el._id}
                name={el.name}
                image={el.image}
                category={el.category}
                qty={el.qty}
                total={el.total}
                price={el.price}
              />
            ))}
          </div>
          <div className="w-full max-w-md ml-auto">
            <h2 className="bg-blue-500 text-white p-2 text-lg">Summary</h2>
            <div className="flex w-full py-2 text-lg border-b">
              <p>Total Qty :</p>
              <p className="ml-auto w-32 font-bold">{totalQty}</p>
            </div>
            <div className="flex w-full py-2 text-lg border-b">
              <p>Total Price</p>
              <p className="ml-auto w-32 font-bold">
                <span className="text-red-500">₹</span> {totalPrice}
              </p>
            </div>
            <button
              onClick={handlePayment}
              className="bg-red-500 w-full text-lg font-bold py-2 text-white"
            >
              Payment
            </button>
          </div>
        </div>
      ) : (
        <div className="flex w-full justify-center items-center flex-col">
          <img src={emptyCartImage} className="w-full max-w-sm" alt="Empty Cart" />
          <p className="text-slate-500 text-3xl font-bold">Empty Cart</p>
        </div>
      )}
    </div>
  );
};

export default Cart;
