import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Link, useSearchParams } from "react-router-dom";
import { GiHouse } from "react-icons/gi";
import "../assets/css/Signup.css";
import myLogo from "../assets/Images/logo.8ea9ff34.png";

const Verify = ({ setIsFirstTime, isFirstTime, setName, setLastName, setIsLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [code, setCode] = useState("");
  const [name, setNameLocal] = useState("");
  const [lastname, setLastNameLocal] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(120); 
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.state && location.state.token) {
      setToken(location.state.token);
    }
    const storedName = localStorage.getItem("name");
    const storedLastName = localStorage.getItem("lastName");
    if (storedName && storedLastName) {
      setNameLocal(storedName);
      setLastNameLocal(storedLastName);
      setIsFirstTime(false);
    } else {
      setIsFirstTime(true);
    }
  }, [location, setIsFirstTime]);

  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      setError("زمان تایید به پایان رسید. لطفاً دوباره وارد شوید.");
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async () => {
    if (!code || code.length < 4) {
      setError("لطفاً کد تایید را وارد کنید");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(`https://api.mrh-store.com/api/authorize/verify`, {
        name,
        lastname,
        token,
        code,
      });

      const { data } = response.data;
      setToken(data);
      localStorage.setItem("token", data);
      localStorage.setItem("name", name);
      localStorage.setItem("lastName", lastname);
      localStorage.setItem("isLoggedIn", true);
      setName(name);
      setLastName(lastname);
      setIsLogin(true);
      navigate("/", { state: { name, lastname } });
    } catch (error) {
      console.error(error);
      setError("تایید ناموفق، لطفاً کد را بررسی کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    if (timer === 0) {
      setTimer(120);
      setIsTimerActive(true);
      setError("");
      navigate("/Login");
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
          <div className="card-get">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerify();
              }}
            >
              {isFirstTime && (
                <>
                  <label style={{ direction: "rtl" }}>
                    نام
                    <input
                      className="x"
                      type="text"
                      value={name}
                      onChange={(e) => setNameLocal(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </label>
                  <label style={{ direction: "rtl" }}>
                    فامیل
                    <input
                      className="x"
                      type="text"
                      value={lastname}
                      onChange={(e) => setLastNameLocal(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </label>
                </>
              )}
              <label style={{ direction: "rtl" }}>
                کد ارسال شده
                <input
                  className="x"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  disabled={isLoading}
                  maxLength="6"
                />
              </label>

              {isTimerActive && timer > 0 && (
                <div className="timer-info">
                  <p>زمان باقی‌مانده: <span className="timer">{formatTime(timer)}</span></p>
                </div>
              )}

              {error && <p className="error">{error}</p>}
              
              <button 
                type="submit" 
                disabled={isLoading || timer === 0}
                className={isLoading ? 'loading' : ''}
              >
                {isLoading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    <span>در حال تایید...</span>
                  </div>
                ) : (
                  'تایید'
                )}
              </button>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;