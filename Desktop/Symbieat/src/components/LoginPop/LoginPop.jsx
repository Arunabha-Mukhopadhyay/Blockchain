import React, { useState } from 'react'
import './LoginPop.css'
import { assets } from '../../assets/assets'

const LoginPop = ({ setShowLogin }) => {

  const [currState, setCurrState] = useState("Sign up");

  return (
    <div className="login-popup">
      <form className="login-pop-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your email" required />
          <input type="password" placeholder="Password" required />
        </div>
        <button>{currState=== "Sign up" ? "Create account":"Login"}</button>
        <div className="login-popup-condition">
          <input type="checkbox" required/>
          <p>By continuing, I agree to the termsof use & privacy policy.</p>
        </div>
        {currState==="Login"
        ? <p>Create a new account? <span onClick={()=>setCurrState("Sign up")}>Click here</span></p>
        : <p>Already have a account? <span onClick={()=>setCurrState("Login")}>Login here</span></p>
        }
        
      </form>
    </div>
  );
};

export default LoginPop