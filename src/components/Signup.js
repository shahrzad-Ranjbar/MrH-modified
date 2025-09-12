import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { GiHouse } from "react-icons/gi";
import "../assets/css/Signup.css";
import myLogo from "../assets/Images/logo.8ea9ff34.png";

const SignIn = () => {
  const navigateTo = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(120); 
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      setErrorMsg("زمان تایید به پایان رسید. لطفاً دوباره تلاش کنید.");
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const submitLogin = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setErrorMsg("لطفاً شماره تماس معتبر وارد کنید");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    
    try {
      const response = await axios.post("https://api.mrh-store.com/api/authorize/login", {
        login: phoneNumber,
      });
      
      setAuthToken(response.data.data.token);
      setIsTimerActive(true);
      setTimer(120);
      
      navigateTo("/Verify", {
        state: {
          token: response.data.data.token,
          status: response.data.data.status,
        },
      });
    } catch (err) {
      console.log(err);
      setErrorMsg(err.response?.data?.message || "خطا در ارسال کد. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    if (timer === 0) {
      setTimer(120);
      setIsTimerActive(true);
      submitLogin();
    }
  };

  return (
    <div className="background">
      <div className="main-box">
        <div className="card">
          <div className="card-title">
            <Link to="/">
              <GiHouse />
              <h6>صفحه اصلی</h6>
            </Link>
            <div className="myLogo">
              <img src={myLogo} alt="Logo" />
            </div>
          </div>
          <form className="card-get" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="phone">شماره تماس خود را وارد کنید</label>
            <div className="card-get">
              <input
                id="phone"
                type="tel"
                value={phoneNumber}
                placeholder="شماره تماس..."
                onChange={(e) => setPhoneNumber(e.target.value)}
                dir="rtl"
                disabled={isLoading}
              />
            </div>

            <button 
              type="button" 
              onClick={submitLogin}
              disabled={isLoading || !phoneNumber}
              className={isLoading ? 'loading' : ''}
            >
              {isLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <span>در حال ارسال...</span>
                </div>
              ) : (
                'ارسال کد تایید'
              )}
            </button>

            {isTimerActive && timer > 0 && (
              <div className="timer-info">
                <p>زمان باقی‌مانده: <span className="timer">{formatTime(timer)}</span></p>
              </div>
            )}

            {timer === 0 && (
              <button 
                type="button" 
                onClick={handleResendCode}
                className="resend-button"
              >
                ارسال مجدد کد
              </button>
            )}
          </form>
          
          {errorMsg && (
            <div className="error-message">
              <p>{errorMsg}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
