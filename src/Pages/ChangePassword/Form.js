
import React, { useState, useEffect, useRef, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import { GetUpdateData, CreateData, UpdateData, ToastNotify, ControlOverlay, Reset, initHoverSelectDropownTitle, ChangePassword } from '../../Components/Helper.js'
import GlobalContext from "../../Components/GlobalContext"
import Select from 'react-select'
import $ from "jquery";
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useLocation,
    useParams,
    useNavigate
} from "react-router-dom";

function Form(props) {
    const { state } = useLocation();
    const [formState, setFormState] = useState({ formType: "New" });
    const globalContext = useContext(GlobalContext);
    const params = useParams();
    const navigate = useNavigate();

    const { register, handleSubmit, setValue, getValues, reset, control, trigger, watch, formState: { errors } } = useForm({ mode: "onChange" });

    const password = useRef({});
    password.current = watch("ChangePasswordForm[new_password]", "");

    function handleLogOut() {
        var info = JSON.parse(localStorage.getItem('authorizeInfos'));
        var formData = new FormData();
        axios.post(
            globalContext.globalHost + globalContext.globalPathLink + "site/logout",
            { formData },
            {
                auth: {
                    username: info.username,
                    password: info.access_token,
                },
            }
        );
        localStorage.removeItem('authorizeInfos')
        globalContext.setToken(null)


    }

    function handleReset() {
        var info = JSON.parse(localStorage.getItem('authorizeInfos'));
        var object = {}
        object["UserUUIDs"] = [info.id]
        Reset(globalContext, "user", object).then(res => {
            handleLogOut()
        })

    }

    const onSubmit = (data, event) => {

        event.preventDefault();
        const formdata = new FormData($("form")[0]);
        ControlOverlay(true)


        ChangePassword(globalContext, formdata).then(res => {
            if (res.status == 200) {
                if (res.data.message == "Password changed successfully.") {
                    ToastNotify("success", "Password changed successfully.")
                    ControlOverlay(false)
                    handleLogOut()
                }

            }



        }).catch(err => { ToastNotify("error", "Current Password not match"); ControlOverlay(false) })



    }
    useEffect(() => {
        if (state == null) {
            reset()
            setFormState({ formType: "Update", id: params.id })
        }
        else {
            reset()
            setFormState(state)
        }
        return () => {

        }
    }, [state])

    useEffect(() => {
        trigger();

        initHoverSelectDropownTitle()





        return () => {

        }

    }, [formState])

    const handleSubmitForm = (e) => {
        handleSubmit(onSubmit)(e);
      };

    return (
			<form>
				<div className='col-md-12'>
					<div className='card card-primary'>
						<div className='card-header'>Change Password</div>
						<div className='card-body'>
							<div className='row'>
								<div className='col-xs-12 col-md-4'>
									<div className='form-group'>
										<label
											className={`control-label ${
												errors.ChangePasswordForm
													? errors.ChangePasswordForm.current_password
														? "has-error-label"
														: ""
													: ""
											}`}>
											Current Password
										</label>

										<input
											type='password'
											defaultValue=''
											{...register("ChangePasswordForm[current_password]", {
												required: "Current Password cannot be blank.",
											})}
											className={`form-control ${
												errors.ChangePasswordForm
													? errors.ChangePasswordForm.current_password
														? "has-error"
														: ""
													: ""
											}`}
										/>
										<p>
											{errors.ChangePasswordForm
												? errors.ChangePasswordForm.current_password && (
														<span style={{color: "#A94442"}}>
															{
																errors.ChangePasswordForm.current_password
																	.message
															}
														</span>
												  )
												: ""}
										</p>
									</div>
								</div>

								<div className='col-xs-12 col-md-4'>
									<div className='form-group'>
										<label
											className={`control-label ${
												errors.ChangePasswordForm
													? errors.ChangePasswordForm.new_password
														? "has-error-label"
														: ""
													: ""
											}`}>
											New Password
										</label>
										<input
											type='password'
											defaultValue=''
											{...register("ChangePasswordForm[new_password]", {
												required: "New Password cannot be blank.",
											})}
											className={`form-control ${
												errors.ChangePasswordForm
													? errors.ChangePasswordForm.new_password
														? "has-error"
														: ""
													: ""
											}`}
										/>
										<p>
											{errors.ChangePasswordForm
												? errors.ChangePasswordForm.new_password && (
														<span style={{color: "#A94442"}}>
															{errors.ChangePasswordForm.new_password.message}
														</span>
												  )
												: ""}
										</p>
									</div>
								</div>

								<div className='col-xs-12 col-md-4'>
									<div className='form-group'>
										<label
											className={`control-label ${
												errors.ChangePasswordForm
													? errors.ChangePasswordForm.confirm_password
														? "has-error-label"
														: ""
													: ""
											}`}>
											Confirm Password
										</label>
										<input
											type='password'
											defaultValue=''
											className={`form-control ${
												errors.ChangePasswordForm
													? errors.ChangePasswordForm.confirm_password
														? "has-error"
														: ""
													: ""
											}`}
											{...register("ChangePasswordForm[confirm_password]", {
												validate: (value) =>
													value === password.current ||
													"Confirm Password must be equal to New Password.",
											})}
										/>
										{errors.ChangePasswordForm
											? errors.ChangePasswordForm.confirm_password && (
													<span style={{color: "#A94442"}}>
														{errors.ChangePasswordForm.confirm_password.message}
													</span>
											  )
											: ""}
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className='row'>
						<div className='col-12'>
							<div className='m-3'>
								<button
									type='button'
									className='btn btn-success mr-2'
									onClick={handleSubmitForm}>
									Change Password
								</button>
								<button
									type='button'
									className='btn btn-success mr-2'
									onClick={handleReset}>
									Reset
								</button>
							</div>
						</div>
					</div>
				</div>
			</form>
		);
}






export default Form