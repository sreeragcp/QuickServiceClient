import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useLoginMutation } from "../../slices/userApiSlice";
import toast, { Toaster } from "react-hot-toast";
import { setCredentials } from "../../slices/authSlice";
import { forgetUserPasswordFunction } from "../../services/Apis";
import { userSigninValidation } from "../../validations/UserValidation";
import { userForgotPasswordMail } from "../../validations/UserValidation";
import * as yup from "yup";
import { useFormik } from "formik";
import UserNavBar from "../../components/user/UserNavBar";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setresetEmail] = useState("");

  const initialValues = {
    email: "",
    password: "",
  };

  const initialValuesEmail = {
    email: "",
  };

  const [forget, setForget] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: userSigninValidation,
    onSubmit: async (values) => {
      try {
        const userDatas = {
          email: values.email,
          password: values.password,
        };

        const res = await login(userDatas).unwrap();
        const { tocken, userData } = res;

        dispatch(setCredentials({ tocken, userData }));
        if (res.tocken) {
          const user = JSON.stringify(res.userData._id);
          localStorage.setItem("userId", user);
          navigate("/");
        } else if (res.data.message === "Invalid Email or Password") {
          toast.error("Invalid Email or Password");
        }
      } catch (error) {
        toast.error(err?.data?.message || err.error);
      }
    },
  });

  const formiks = useFormik({
    initialValues: initialValuesEmail,
    validationSchema: userForgotPasswordMail,
    onSubmit: async (values) => {
      try {
        const resetEmail = {
          email: values.email,
        };
        const res = await forgetUserPasswordFunction(resetEmail);
        if (res.data.message === "success") {
          localStorage.setItem("timer", new Date());

          toast.success("success");
          navigate("/forgotOtp");
        } else if (res.data.message === "Invalid Email or Password") {
          toast.error("Invalid Email or Password");
        }
      } catch (error) {
        toast.error(error);
      }
    },
  });

  const forgetPassword = async () => {
    setForget(true);
  };

  return (
    <>
      <UserNavBar />
      <Toaster position="top-right" reverseOrder={false} />
      {forget ? (
        <div className="flex justify-center items-center h-full">
          <div className="card ml-5 mt-32 w-5/12 bg-base-100 shadow-xl image-full">
            <figure>
              <img src="./images/bulk-booking.jpg" alt="Shoes" />
            </figure>
            <div className="card-body">
              <p>Enter the Email Last You Entered</p>
              <div className="ml-28 mb-28">
                <input
                  type="email"
                  name="email"
                  // value={resetEmail}
                  placeholder="Email"
                  // onChange={(e) => setresetEmail(e.target.value)}
                  onChange={formiks.handleChange}
                  onBlur={formiks.handleBlur}
                  value={formiks.values.email}
                  className="input input-ghost w-full max-w-xs"
                />
                {formiks.touched.email && formiks.errors.email && (
                  <div className="text-red-500 text-sm">
                    {formiks.errors.email}
                  </div>
                )}
              </div>
              <div className="card-actions justify-end">
                <button
                  className="btn btn-outline"
                  onClick={formiks.handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12 bg-cover">
          <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 lg:max-w-4xl relative top-4">
            <div className="hidden bg-cover lg:block lg:w-1/2 justify-center items-center">
              <img
                className="w-auto h-80 sm:h-80 relative top-28"
                src="./images/bulk-booking.jpg"
                alt=""
              />
            </div>

            <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
              <div className="flex justify-center mx-auto">
                <img
                  className="w-auto h-7 sm:h-8"
                  src="./images/logo-blue.png"
                  alt=""
                />
              </div>

              <p className="mt-3 text-xl text-center text-gray-600 dark:text-gray-200">
                Welcome back!
              </p>

              <a
                href="#"
                className="flex items-center justify-center mt-4 text-gray-600 transition-colors duration-300 transform border rounded-lg dark:border-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <div className="px-4 py-2">
                  <svg className="w-6 h-6" viewBox="0 0 40 40">
                    {/* SVG Path */}
                  </svg>
                </div>
                <span className="w-5/6 px-4 py-3 font-bold text-center">
                  Sign in with Google
                </span>
              </a>

              <div className="flex items-center justify-between mt-4">
                <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>
                <a
                  href="#"
                  className="text-xs text-center text-gray-500 uppercase dark:text-gray-400 hover:underline"
                >
                  or login with email
                </a>
                <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
              </div>

              <div className="mt-4">
                <label
                  className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
                  htmlFor="LoggingEmailAddress"
                >
                  Email Address
                </label>
                <input
                  id="LoggingEmailAddress"
                  className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
                  type="email"
                  name="email"
                  // value={email}
                  // onChange={(e) => setEmail(e.target.value)}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.email}
                  </div>
                )}
              </div>

              <div className="mt-4">
                <div className="flex justify-between">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
                    htmlFor="loggingPassword"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs text-gray-500 dark:text-gray-300 hover:underline"
                    onClick={forgetPassword}
                  >
                    Forget Password?
                  </a>
                </div>
                <input
                  id="loggingPassword"
                  className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
                  type="password"
                  name="password"
                  // value={password}
                  // onChange={(e) => setPassword(e.target.value)}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.password}
                  </div>
                )}
              </div>

              <div className="mt-6">
                <button
                  className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                  onClick={formik.handleSubmit}
                >
                  Sign In
                </button>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
                <NavLink
                  to="/signup"
                  className="text-xs text-gray-500 uppercase dark:text-gray-400 hover:underline"
                >
                  or sign up
                </NavLink>
                <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserLogin;
