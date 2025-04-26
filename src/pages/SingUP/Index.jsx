import React, { useState } from "react";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { getDatabase, push, ref, set } from "firebase/database";
import libaray from "../../lib/lib";
import { HashLoader } from "react-spinners";
import { Link } from "react-router";

const SignUp = () => {
  const auth = getAuth();
  const db = getDatabase();
  const { SucessToast, ErrorToast, infoToast } = libaray;
  const [email, setemail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  //   error state
  const [emailError, setemailError] = useState("");
  const [fullNameError, setfullNameError] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [loading, setloading] = useState(false);
  const [eye, seteye] = useState(false);

  /**
   * todo : handleChange funtion implemnet
   * @param({event})
   * return void
   */

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };
  const handleSignUp = () => {
    if (!email) {
      setemailError("Email Missing");
    } else if (!fullName) {
      setemailError("");
      setfullNameError("FullName Missing   !");
    } else if (!password) {
      setfullNameError("");
      setpasswordError("password Missing !");
    } else {
      setloading(true);
      setpasswordError("");
      createUserWithEmailAndPassword(auth, email, password)
        .then((userinfo) => {
          SucessToast("registarion sucessfull ");
          updateProfile(auth.currentUser, {
            displayName: fullName,
            photoURL:
              "https://images.pexels.com/photos/6940512/pexels-photo-6940512.jpeg?auto=compress&cs=tinysrgb&w=600",
          });
        })
        .then(() => {
          const userdb = ref(db, "users/");
          set(push(userdb), {
            userid: auth.currentUser.uid,
            username: auth.currentUser.displayName || fullName,
            email: auth.currentUser.email || email,
            profile_picture:
              auth.currentUser.photoURL ||
              `https://images.pexels.com/photos/6940512/pexels-photo-6940512.jpeg?auto=compress&cs=tinysrgb&w=600`,
          });
          // send email for autheicate user;
          return sendEmailVerification(auth.currentUser);
        })
        .then((mailData) => {
          infoToast("🦄mail send sucessfulll Check your email");
        })
        .catch((err) => {
          ErrorToast(err.code);
        })
        .finally(() => {
          setloading(false);
          setFullName("");
          setemail("");
          setPassword("");
        });
    }
  };

  const handlepassword = (event) => {
    setPassword(event.target.value);
  };
  const handleFullname = (event) => {
    setFullName(event.target.value);
  };

  const handleEmail = (event) => {
    setemail(event.target.value);
  };

  //   handleEye
  const handleEye = () => {
    seteye(!eye);
  };

  return (
    <div>
      <div className="bg-mainBgColor flex items-center justify-between">
        <div className="w-1/2 h-screen flex  justify-center items-center">
          <div>
            <h1>Get started with easily register</h1>
            <p>Free register and you can enjoy it</p>

            <form
              action="#"
              className="mt-10"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex flex-col gap-y-1 items-start mb-5">
                <label htmlFor="email">
                  {`Fill Up The email `}
                  {<span className="text-red-500">*</span>}
                </label>
                <input
                  type={"email"}
                  placeholder={"email"}
                  name={"email"}
                  value={email}
                  onChange={handleEmail}
                  className="border border-gray-500 py-1 px-2"
                />
                {emailError && (
                  <span className="text-red-500"> {emailError}</span>
                )}
              </div>
              <div className="flex flex-col gap-y-1 items-start mb-5">
                <label htmlFor="email">
                  {`Fill Up The FullName `}
                  {<span className="text-red-500">*</span>}
                </label>
                <input
                  type={"text"}
                  placeholder={"fullName"}
                  name={"fullName"}
                  onChange={handleFullname}
                  value={fullName}
                  className="border border-gray-500 py-1 px-2"
                />
                {fullNameError && (
                  <span className="text-red-500"> {fullNameError}</span>
                )}
              </div>

              <div className="flex flex-col gap-y-1 items-start mb-5 relative">
                <label htmlFor="email">
                  {`Fill Up The password `}
                  {<span className="text-red-500">*</span>}
                </label>
                <input
                  type={eye ? "text" : "password"}
                  placeholder={"password"}
                  name={"email"}
                  onChange={handlepassword}
                  value={password}
                  className="border border-gray-500 py-1 px-2"
                />
                <span
                  className="absolute right-[20%] top-[60%] cursor-pointer"
                  onClick={handleEye}
                >
                  {eye ? <FaRegEye /> : <FaEyeSlash />}
                </span>
                {passwordError && (
                  <span className="text-red-500"> {passwordError}</span>
                )}
              </div>
              {loading ? (
                <button
                  onClick={handleSignUp}
                  className="px-5 py-2 bg-mainColor text-white text-lg rounded cursor-pointer"
                >
                  <HashLoader
                    color={"#ffff"}
                    loading={loading}
                    cssOverride={override}
                    size={30}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </button>
              ) : (
                <button
                  onClick={handleSignUp}
                  className="px-5 py-2 bg-mainColor text-white text-lg rounded cursor-pointer"
                >
                  Sign Up
                </button>
              )}
            </form>
            <p className="mt-5">
              Already have an account ? <Link to={"/signin"}>Sign In</Link>
            </p>
          </div>
        </div>
        <div className="w-1/2 bg-yellow-500 h-svh flex  justify-center items-center"></div>
      </div>
    </div>
  );
};

export default SignUp;
