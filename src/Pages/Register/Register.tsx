import { zodResolver } from "@hookform/resolvers/zod";
import  { useState } from "react";
import { useForm } from "react-hook-form";
import { RegisterSchema } from "../../Schemas/auth.schema";
import { type RegisterSchemaType } from "../../Schemas/auth.schema";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

// interface UserData {
//   name: string;

//   email: string;
//   dateOfBirth: string;
//   gender: "male" | "female";
//   password: string;
//   repassword: string;
//htena el registerschematype
// }

export default function Register() {
  const [apiError, setApiError] = useState(null);
  const [isloading, setIsloading] = useState(false);
  const navigate = useNavigate();
  const form = useForm<RegisterSchemaType>({
    defaultValues: {
      name: "",
      email: "",
      dateOfBirth: "",
      gender: "male",
      password: "",
      rePassword: "",
    },
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
  });
  let { register, handleSubmit, formState} = form;
  // console.log(formState.errors);
  function handleRegister(values: RegisterSchemaType) {
    setIsloading(true);
    console.log(values);

    axios
      .post("https://route-posts.routemisr.com/users/signup", values)
      .then((res) => {
        console.log(res.data);

        if (res.data.success) {
          console.log("userToken", res.data.data.token);
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        setApiError(err.response?.data?.message || "Something went wrong");
      })
      .finally(() => setIsloading(false));

    // if (values.repassword===values.password){
    // }
    // else{
    //   setError("repassword",{message:"password and repassword not match "})
    // }}
    // bs de hthsl lma a3ml submit hata lw ana 3mla el mode on change
    //validation
    //call API
  }

  // const [name, setName] = useState("");
  // function handleRegister(e) {
  //   e.preventDefault();
  //   console.log("submit");
  // }
  // function handleNameInput(e) {
  //   setName(e.target.value);
  // }
  return (
    <>
      <h1 className="text-center text-5xl font-bold "> Register Now</h1>
      {apiError ? (
        <p className="bg-red-500 text-white text-center font-bold rounded-sm w-[300px] mx-auto">
          {apiError}
        </p>
      ) : (
        ""
      )}
      <form
        onSubmit={handleSubmit(handleRegister)}
        // onSubmit={(e) => handleRegister(e)}
        className="max-w-md mx-auto my-5"
      >
        <div className="relative z-0 w-full mb-5 group">
          <input
            {...register(
              "name",
              //   {
              //   required: {
              //     value: true,
              //     message: "Name is required",
              //   },
              //   minLength: {
              //     value: 3,
              //     message: "min length should be more than 3 chars",
              //   },
              //   maxLength: 10,
              // }
            )}
            type="text"
            id="name"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />
          {formState.errors.name && formState.touchedFields.name && (
            <span className="text-red-500 text-sm">
              {formState.errors.name.message}
            </span>
          )}
          <label
            htmlFor="name"
            className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Enter Your Name
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="email"
            {...register(
              "email",
              //   {
              //   required: {
              //     value: true,
              //     message: "Email is required",
              //   },
              //   pattern: {
              //     value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              //     message: "Invalid email format",
              //   },
              // }
            )}
            id="email"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />
          {formState.errors.email && formState.touchedFields.email && (
            <span className="text-red-500 text-sm">
              {formState.errors.email.message}
            </span>
          )}
          <label
            htmlFor="email"
            className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Enter Your Email
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="date"
            {...register(
              "dateOfBirth",
              //    {
              //   required: {
              //     value: true,
              //     message: "Date of birth is required",
              //   },
              // }
            )}
            id="dateOfBirth"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />
          {formState.errors.dateOfBirth &&
            formState.touchedFields.dateOfBirth && (
              <span className="text-red-500 text-sm">
                {formState.errors.dateOfBirth.message}
              </span>
            )}
          <label
            htmlFor="dateOfBirth"
            className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Enter Your Birthday
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="password"
            {...register(
              "password",
              //   {
              //   required: {
              //     value: true,
              //     message: "Password is required",
              //   },
              //   minLength: {
              //     value: 6,
              //     message: "Password must be at least 6 characters long",
              //   },
              // }
            )}
            id="password"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />
          {formState.errors.password && formState.touchedFields.password && (
            <span className="text-red-500 text-sm">
              {formState.errors.password.message}
            </span>
          )}
          <label
            htmlFor="password"
            className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Enter Your Password
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="password"
            {...register("rePassword")}
            id="rePassword"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />
          {formState.errors.rePassword &&
            formState.touchedFields.rePassword && (
              <span className="text-red-500 text-sm">
                {formState.errors.rePassword.message}
              </span>
            )}
          <label
            htmlFor="rePassword"
            className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Enter Your Confirm Password
          </label>
        </div>
        <div className="flex gap-3 items-center ">
          <div className="flex items-center mb-4">
            <input
              id="country-option-1"
              {...register("gender")}
              type="radio"
              className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"
              value="male"
            />
            {formState.errors.gender && formState.touchedFields.gender && (
              <span className="text-red-500 text-sm">
                {formState.errors.gender.message}
              </span>
            )}
            <label
              htmlFor="country-option-1"
              className="select-none ms-2 text-sm font-medium text-heading"
            >
              Male
            </label>
          </div>
          <div className="flex items-center mb-4">
            <input
              {...register("gender")}
              id="country-option-2"
              type="radio"
              name="gender"
              value="female"
              className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"
            />
            {formState.errors.gender && formState.touchedFields.gender && (
              <span className="text-red-500 text-sm">
                {formState.errors.gender.message}
              </span>
            )}
            <label
              htmlFor="country-option-2"
              className="select-none ms-2 text-sm font-medium text-heading"
            >
              Female
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isloading}
          className={`text-white w-full rounded-lg transition-all box-border border border-transparent shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none ${
            isloading
              ? "bg-blue-300 cursor-not-allowed opacity-70"
              : "bg-blue-500 cursor-pointer hover:bg-blue-600 hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium"
          }`}
        >
          {isloading ? "Loading..." : "Register"}
        </button>
        <div className="flex justify-center text-blue-600 cursor-pointer" >
          {" "}
          <Link to={"/login"}>Do You Have An Account? Go Login</Link>
        </div>
      </form>
    </>
  );
}
