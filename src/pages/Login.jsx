
import React, { useState } from "react";
import loginSignupImage from "../assets/login-animation.gif";
import { BiShow, BiHide } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { loginRedux } from "../redux/userSlice";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [data, setData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user);
    // console.log("redux data", userData);

    const handleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = data;
        if (email && password) {
            try {
                const fetchData = await fetch("https://mern-stack-ecommerce-api-pys8.onrender.com/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

                if (!fetchData.ok) {
                    const errorData = await fetchData.json();
                    console.error("Error:", errorData);
                    toast.error(errorData.message || "Something went wrong!");
                    return;
                }

                const dataRes = await fetchData.json();
                console.log("Response:", dataRes);

                toast.success(dataRes.message);

                if (dataRes.alert) {
                    dispatch(loginRedux(dataRes)); // Ensure dataRes contains the expected structure
                    setTimeout(() => {
                        navigate("/");
                    }, 1000); 
                }
            } catch (error) {
                console.error("Error:", error);
                toast.error("Network error, please try again later.");
            }
        } else {
            toast.error("Please enter required fields");
        }
    };
  
    return (
        <div className="p-3 md:p-4">
            <div className="w-full max-w-sm bg-white m-auto flex flex-col p-4">
                <div className="w-20 overflow-hidden rounded-full drop-shadow-md shadow-md m-auto">
                    <img src={loginSignupImage} className="w-full" alt="Login Animation" />
                </div>

                <form className="w-full py-3 flex flex-col" onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300"
                        value={data.email}
                        onChange={handleOnChange}
                    />

                    <label htmlFor="password">Password</label>
                    <div className="flex px-2 py-1 bg-slate-200 rounded mt-1 mb-2 focus-within:outline focus-within:outline-blue-300">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            className="w-full bg-slate-200 border-none outline-none"
                            value={data.password}
                            onChange={handleOnChange}
                        />
                        <span
                            className="flex text-xl cursor-pointer"
                            onClick={handleShowPassword}
                        >
                            {showPassword ? <BiShow /> : <BiHide />}
                        </span>
                    </div>

                    <button
                        type="submit"
                        className="w-full max-w-[150px] m-auto bg-red-500 hover:bg-red-600 cursor-pointer text-white text-xl font-medium text-center py-1 rounded-full mt-4"
                    >
                        Login
                    </button>
                </form>
                <p className="text-left text-sm mt-2">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-red-500 underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;

