"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import apiHandler from "@/lib/api";
import Image from "next/image";

import brandLogo from "@/public/assets/images/kci-institute-brand-logo.png";
import { MdOutlineErrorOutline } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

type LoginForm = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const formik = useFormik<LoginForm>({
    initialValues: {
      username: "",
      password: "",
    },

    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        setError(false);

        const res = await apiHandler.post("/login", values);

        if (res.status === 200) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error(error);

        setError(true);

        setTimeout(() => {
          setError(false);
        }, 3000);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        {/* LOGO + TITLE */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center rounded-full text-xl font-bold">
            <Image src={brandLogo} alt="kci-brand-logo-image" loading="eager" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-[#0b2c5f]">
            KCI Admin Login
          </h2>
        </div>

        {/* FORM */}
        <form onSubmit={formik.handleSubmit}>
          {/* USERNAME */}
          <div className="mb-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${
                formik.touched.username && formik.errors.username
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-black"
              }`}
            />

            {/* ERROR */}
            {formik.touched.username && formik.errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.username}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={` w-full p-2 border rounded focus:outline-none focus:ring-2 ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-black"
              }`}
              maxLength={20}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-2.75 right-3   text-sm text-gray-600"
            >
              {showPassword ? (
                <IoMdEye size={20} className="cursor-pointer" />
              ) : (
                <IoMdEyeOff size={20} className="cursor-pointer" />
              )}
            </button>

            {/* ERROR */}
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          <hr />

          {error && (
            <p className="text-red-500 text-sm mt-3 p-2 border rounded transition-opacity duration-500 flex items-center">
              <MdOutlineErrorOutline />{" "}
              <span className="ms-1">Invalid Credentials</span>
            </p>
          )}
          {/* BUTTON */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="cursor-pointer w-full bg-[#0b2c5f] text-white p-2 mt-4 rounded hover:bg-[#ffa100] transition"
          >
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
