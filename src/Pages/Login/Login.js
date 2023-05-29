import "../../Assets/css/index.css";
import React, { useState, useRef, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext"
import { ChangePasswordDefault,ToastNotify,ControlOverlay } from '../../Components/Helper.js'
import Home from "../Dashboard/Home"
import $ from 'jquery'
import axios from "axios"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";

function Login(props) {
  const globalContext = useContext(GlobalContext);
  var formData = new FormData();

  //const { register, handleSubmit, setValue, getValues, reset, control, trigger, watch, formState: { errors } } = useForm({ mode: "onChange" });
  const { register, handleSubmit, getValues,watch, reset,formState: { errors } } = useForm({mode:"onChange" });
  const navigate = useNavigate();

  const password = useRef({});
  password.current = watch("ChangePasswordForm[new_password]", "");

  const [resetForm, setResetForm] = useState(false)
  const onSubmit = (data) => {
    ControlOverlay(true)
    // setSubmitState(!SubmitStat)
    formData.append("username", data.username);
    formData.append("password", data.password);
  
  axios
    .post(globalContext.globalHost + globalContext.globalPathLink + "site/login", formData)
    .then((res) => {
      if (res) {
        if(res.data.data.message){
          var authorizeInfo = { "username": res.data.data.username, "access_token": res.data.data.access_token, "id": res.data.data.id }
          localStorage.setItem('tempauthorizeInfos', JSON.stringify(authorizeInfo));
          setResetForm(true)
          ControlOverlay(false)
        }
        else if (res.data.data.password) {    
          alert(res.data.data.password);
          ControlOverlay(false)
        }else {
          var authorizeInfo = { "username": res.data.data.username, "access_token": res.data.data.access_token, "id": res.data.data.id }
          localStorage.removeItem("tempauthorizeInfos");
          localStorage.setItem('authorizeInfos', JSON.stringify(authorizeInfo));
          props.setToken(authorizeInfo)
          navigate('/')
          ControlOverlay(false)
        }

      }


    })
    .catch((error) => {
      if (error.response.status) {
        ControlOverlay(false)
        alert('Incorrect username or password');
      }

    });
}

const onSubmit2 = (data) => {
  ControlOverlay(true)
  var formData = new FormData();
  formData.append("ChangePasswordForm[new_password]",getValues("ChangePasswordForm[new_password]"))
  formData.append("ChangePasswordForm[confirm_password]",getValues("ChangePasswordForm[confirm_password]"))
  formData.append("ChangePasswordForm[current_password]","88888888")
  var info = JSON.parse(localStorage.getItem('tempauthorizeInfos'));
  
  ChangePasswordDefault(globalContext,info, formData).then(res => {
   
    if (res.status==200) {
      if (res.data.message == "Password changed successfully.") {   
         ControlOverlay(false)
        setResetForm(false)
      }
     
  }
  })
}

// function handleChangePassword() {

// }
useEffect(() => {
  reset();

  return () => {
    
  }
}, [resetForm])


return (

  <div className="Auth-form-container">
    {resetForm ? <form className="Auth-form resetForm" onSubmit={handleSubmit(onSubmit2)}>
      <div className="Auth-form-content">
   
        <h3 className="Auth-form-title">Change Password</h3>

        <div className="form-group mt-3">
          <label className={`control-label ${errors.ChangePasswordForm ? errors.ChangePasswordForm.new_password ? "has-error-label" : "" : ""}`} >New Password
          </label>

          <input type="password" defaultValue='' {...register("ChangePasswordForm[new_password]", { required: "Current Password cannot be blank.",minLength: 6 })}
            className={`form-control ${errors.ChangePasswordForm ? errors.ChangePasswordForm.new_password ? "has-error" : "" : ""}`} />
          <p>{errors.ChangePasswordForm ? errors.ChangePasswordForm.new_password && <span style={{ color: "#A94442" }}>{errors.ChangePasswordForm.new_password.message}</span> : ""}</p>
          <p>{errors.ChangePasswordForm ? errors.ChangePasswordForm.new_password && errors.ChangePasswordForm.new_password.type === "minLength" && <span style={{ color: "#A94442" }}>Password must be at least 6 characters</span> : ""}</p>
        </div>
        <div className="form-group mt-3">
          <label className={`control-label ${errors.ChangePasswordForm ? errors.ChangePasswordForm.confirm_password ? "has-error-label" : "" : ""}`} >Confirm Password
          </label>
          <input type="password" defaultValue='' className={`form-control ${errors.ChangePasswordForm ? errors.ChangePasswordForm.confirm_password ? "has-error" : "" : ""}`}  {...register("ChangePasswordForm[confirm_password]", {
            validate: value =>
              value === password.current || "Confirm Password must be equal to New Password."
          })}
          />
          {errors.ChangePasswordForm ? errors.ChangePasswordForm.confirm_password && <span style={{ color: "#A94442" }}>{errors.ChangePasswordForm.confirm_password.message}</span> : ""}
        </div>
        <div className="d-grid gap-2 mt-3">
          {/* <button type="button" className="btn btn-primary" onClick={handleChangePassword}> */}
          <button type="submit" className="btn btn-primary">
            Change Password
          </button>

          <button type="button" className="btn btn-primary ml-2">
            Reset
          </button>
        </div>

      </div>
    </form> :
      <form className="Auth-form loginForm" onSubmit={handleSubmit(onSubmit)}>
        <div className="Auth-form-content">
        <div class="PageOverlay d-none"> <div class="PageSpinner"><i class="fas fa-3x fa fa-spinner fa-spin"></i><p class="loadingText"><b>Loading</b></p></div></div>
          <h3 className="Auth-form-title">Login</h3>

          <div className="text-center">
            Please fill out the following fields to login:

          </div>
          <div className="form-group mt-3">
            <label>Username</label>
            <input defaultValue='' {...register("username", { required: "Please enter Username." })} className={`form-control`} />

          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input type="password" {...register("password", { required: "Please enter Password." })} className={`form-control`} />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>

        </div>
      </form>


    }

  </div>
)

}

export default Login