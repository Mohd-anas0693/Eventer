import React, { useEffect } from "react";
import { useAuth } from "../utils/useAuthClient";
import { useNavigate } from "react-router-dom";
import icp from "../../../assets/icp.png";
import { attendance_proof_system_backend } from "../../../../declarations/attendance_proof_system_backend/index";

// Login component
const Login = () => {
  const navigate = useNavigate();
  const { URLSearchParams } = window;
  const { login, isAuthenticated } = useAuth();

  // Function to handle login
  const handleLogin = async () => {
    await login().then(() => window.location.reload());
  };

  // Function to approve generating a hexcode
  const approveToMakeAHexcode = async (val) => {
    await attendance_proof_system_backend.changeQrGenerateStatus(val);
  }

  const setCookie = (name, value, hours) => {
    const date = new Date();
    date.setTime(date.getTime() + hours * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  };

  useEffect(() => {
    let params = new URLSearchParams(window.location.search);
    let event_id = params.get('event_id');
    let unique_code = params.get('unique_code');

    // Store event_id and unique_code in cookies
    if (event_id && unique_code) {
      setCookie('event_id', event_id, 4);
      setCookie('unique_code', unique_code, 4);
      approveToMakeAHexcode(event_id);
    }

    // navigate to claim seat if user already authenticated
    if (isAuthenticated) {
      navigate('/claimseat')
    }
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full bg-[#f1f1f1]" style={{ height: `calc(100vh - 93px)` }}>
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl p-4 sm:p-6 md:p-10 lg:p-10 xl:p-12 2xl:p-14 bg-white rounded-xl shadow-lg flex flex-col gap-4">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-blue-900 underline decoration-2 underline-offset-4">
            Log in to Claim Rewards
          </h2>
          <p className="text-justify text-md sm:text-lg md:text-lg text-gray-600 lg:my-3 md:my-2 sm:my-1 max-h-32 overflow-y-auto px-4">
            You are just one step away from claiming your rewards. Please log in
            now to claim your rewards. Remember, you can only claim your rewards
            once.
          </p>
          <div className="flex mt-4 w-full justify-center">
            <button className="flex gap-2 justify-center items-center py-1 px-4 border-2  rounded-xl cursor-pointer border-blue-900 hover:bg-blue-900 hover:text-white duration-300 ease-in-out"
              onClick={handleLogin} >
              <img src={icp} alt="Internet Identity" className="w-10 h-10" />
              <span className="text-md lg:text-lg md:text-lg font-semibold">
                Internet Identity
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
