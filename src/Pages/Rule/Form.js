
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import { GetUpdateData, CreateData, UpdateData, ToastNotify,ControlOverlay,initHoverSelectDropownTitle, CheckBoxHandle} from '../../Components/Helper.js'
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
    console.log(props)
    const { state } = useLocation();
    const [formState, setFormState] = useState({ formType: "New" });
    const globalContext = useContext(GlobalContext);
    const params = useParams();
    const navigate = useNavigate();
    const regionOption = [

        {
            value: "West",
            label: "West",
        },
        {
            value: "East",
            label: "East",
        }
     


    ]
    const { register, handleSubmit, setValue, getValues, reset, control, trigger,watch, formState: { errors } } = useForm({mode: "onChange"});
    const onSubmit = (data, event) => {

        event.preventDefault();
        const formdata = new FormData($("form")[0]);
        ControlOverlay(true)
        if (formState.formType == "New" || formState.formType == "Clone") {
          
            CreateData(globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data) {
                    if (res.data.message == "Duplicate Rule Code.") {
                        ToastNotify("error", "Duplicate rule code.")
                        ControlOverlay(false)
                    }
                    else {
                        ToastNotify("success", "Rule created successfully.")
                        navigate("/setting/user-settings/rule/update/id=" + res.data.data.RuleUUID, { state: { formType: "Update", id: res.data.data.RuleUUID } })
                    }
                }

            })
        }
        else {
   
            UpdateData(formState.id, globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data.data.RuleUUID) {
                    ToastNotify("success", "Rule updated successfully.")
                    navigate("/setting/user-settings/rule/update/id=" + res.data.data.RuleUUID, { state: { formType: "Update", id: res.data.data.RuleUUID } })

                }
                else {
                    ToastNotify("error", "Error")
                    ControlOverlay(false)
                }
            })

        }


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
       

        setValue("Rule[Region]","") 
        // $(".region").find(".select__control").addClass("has-error")
        if (formState) {
            if (formState.formType == "Update" || formState.formType == "Clone") {
                ControlOverlay(true)
                GetUpdateData(formState.id, globalContext, props.data.modelLink).then(res => {
                   
                    $.each(res.data.data, function (key, value) {
                        setValue('Rule[' + key + ']', value);
                    })
                    ControlOverlay(false)
                    trigger();

                })
                
            }
      
        }
        else {
            ControlOverlay(true)
            GetUpdateData(params.id, globalContext, props.data.modelLink).then(res => {
                $.each(res.data.data, function (key, value) {
                    setValue('Rule[' + key + ']', value);
                })
                ControlOverlay(false)
                trigger();

            })
           
        }


      
        return () => {
           
        }
       
    }, [formState])


    const handleSubmitForm = (e) => {
        handleSubmit(onSubmit)(e);
      };
   
    return (
        <form>
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton  handleSubmitData={handleSubmitForm} title='Rule' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="Rule" model="rule" selectedId="RuleUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='Rule' data={props} />}
            <div className="col-md-12">
                <div className="card card-primary">
                    <div className="card-header">Rule Form</div>
                    <div className="card-body">

                        <div className="row">
                            <div className="col-xs-12 col-md-4">
                                <div className="form-group">
                                    <label className={`control-label`}>Rule</label>

                                    <input defaultValue='' {...register("Rule[Rule]")} className={`form-control`} />
                                </div>
                            </div>
                        </div>

                        <div className={`col-xs-12 col-md-12`}>
                            <div className={`form-group `}>
                                <input type={"checkbox"} className="mt-1" id={`valid`} onChange={CheckBoxHandle} defaultChecked={true}></input>
                                <input type={"hidden"} className="valid" {...register("Rule[Valid]")} defaultValue={1}/>
                                <label htmlFor={`valid`} className="control-label ml-1">Valid</label>
                            </div>
                        </div>

                    </div>



                </div>




            </div>
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton  handleSubmitData={handleSubmitForm} title='Rule' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="Rule" model="rule" selectedId="RuleUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='Rule' data={props} />}
        </form>



    )
}






export default Form