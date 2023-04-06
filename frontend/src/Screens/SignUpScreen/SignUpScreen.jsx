import React, { useEffect, useState } from "react";
import "./SignUpScreen.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function SignUpScreen() {
  const navigate = useNavigate();

  
  // validation of email
  const [EE, setEME] = useState("");
  const handleEmailBlur = () => {
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
    if (user.Email === "") {setEME("");} else if (regex.test(user.Email)) {setEME("");} else {setEME("email is invalid");}
  };
  
  // validation of password 
  const [PE, setPE] = useState("");
  const handlePasswordBlur = () => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    if (user.Password === "") {setPE("");} else if (regex.test(user.Password)) {setPE("");} else {setPE("Password must have one letter and one number and at least 8 character long");}
  };


  const [user, setUser] = useState({
    Email: "",
    Password: "",
    RePassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem("AdminAuthToken")) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };
  const config = {
    header: {
      "Content-Type": "application/json",
    },
  };
  const signUp = async () => {
    const {Email ,Password, RePassword } = user;
    // console.log(user)
    if(!EE && !PE){

      if (Email && Password && RePassword) {
        if (Password === RePassword) {
          try {
          // console.log({ FName,LName, Email,Phone, Password});
          const { data } = await axios.post(
            "http://localhost:3004/signup",
            { Email, Password },
            config
          );
          // console.log(data);
          localStorage.setItem("AdminAuthToken", data.token);
          navigate("/");
          toast.success("Register Successfully");
        } catch (error) {
          console.log(error.response);
          toast.error(error.response.data);
        }

      } else {
        toast.error("wrong password");
      }
    } else {
      toast.error("Fill complete form");
    }
  }else{
    toast.error("Fill Correct Details")
  }
  };

  // console.log(user);

  return (
    <div
      className="login-container"
      style={{ transform: "translate(-50%, 0%)" }}
    >
      <div className="center-con">
        {/* <h1>Alayna</h1> */}
        <img src="/logo/logo1.png" alt="logo" />
        {/* <img src={logo} alt="logo" /> */}
        <div className="back-container">
          
          
          <input
            type="email"
            value={user.Email}
            name="Email"
            onChange={handleChange}
            onBlur={handleEmailBlur}
            placeholder="E-mail"
            required
          />
            {EE && <>{EE}</>}
          <input
            type="password"
            value={user.Password}
            name="Password"
            onChange={handleChange}
            onBlur={handlePasswordBlur}
            placeholder="Password"
            required
          />
          {PE && <>{PE}</>}
          <input
            type="password"
            value={user.RePassword}
            name="RePassword"
            onChange={handleChange}
            placeholder="Re-enter Password"
            required
          />
          <div className="login-btn" onClick={signUp}>
            Sign up
          </div>
        </div>
        {/* <div
          className="login-lst-msg"
          style={{ textAlign: "left", padding: "5px 15px" }}
        >
          Already have account? <a href="/signin">Sign in</a>
        </div> */}
      </div>
    </div>
  );
}
