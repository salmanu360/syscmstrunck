import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, UpdateData, ToastNotify, ControlOverlay, GetAllDropDown, initHoverSelectDropownTitle, GetUser, sortArray } from '../../Components/Helper.js'
import Select from 'react-select'
import AsyncSelect from 'react-select/async';
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/flatpickr.min.css";
import moment from "moment";
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




function Lifting(props) {
    const { state } = useLocation();
    const [formState, setFormState] = useState({ formType: "New" });
    const globalContext = useContext(GlobalContext);
    const params = useParams();
    const navigate = useNavigate();

    const [port, setPort] = useState([])
    const [vessel, setVessel] = useState([])
    const [containerType, setContainerType] = useState([])

    const POLPOD = [
        { label: "POL", value: "POL" },
        { label: "POD", value: "POD" }

    ]

    const Type = [
        { label: "With Joint Service", value: "WithJointService" },
        { label: "Without Joint Service", value: "WithoutJointService" },
        { label: "Only Joint Service", value: "OnlyJointService" }

    ]

    var modelLinkTemp;

    if (globalContext.userRule !== "") {
        modelLinkTemp = props.data.modelLink
        const objRule = JSON.parse(globalContext.userRule);
        var filteredAp = objRule.Rules.filter(function (item) {
            return item.includes(modelLinkTemp);
        });

    }


    function handlePreview() {

        // if(getPreviewPDFPermission == true){
        var urlLink;
        var StartDate = $(".StartDate").val()
        var EndDate = $(".EndDate").val();
        var PortCode = $("input[name='DynamicModel[Port]']").val()
        var PortType = $("input[name='DynamicModel[POLPOD]']").val()
        var Type = $("input[name='DynamicModel[Type]']").val()

        var VesselCode = $("input[name='DynamicModel[VesselCode]']").val()
        var Port = $("input[name='DynamicModel[Port]']").val()

        var OwnerCheck = $('#OwnershipTypeCheckbox').prop('checked') ? "1" : "0"
        var LadenEmptyCheck = $('#LadenEmptyCheckbox').prop('checked') ? "1" : "0"
        var CtrType = $('#ContainerTypeCheckbox').prop('checked') ? "1" : "0"

        var SOCCOC = $('#SOCCOCCheckbox').prop('checked') ? "1" : "0"
        var LadenEmptyCheck = $('#LadenEmptyCheckbox').prop('checked') ? "1" : "0"
        var JSCheck = $('#JSCheckbox').prop('checked') ? "1" : "0"

        if( props.data.modelLink == "vessel-voyage-lifting" ){
            if(PortCode==""){
                alert("Port Code cannot be empty")
                return false
            }
            if(VesselCode==""){
                alert("Vessel Code cannot be empty")
                return false
            }
        }
       

        // httpGet(globalContext.globalHost + globalContext.globalPathLink +props.data.modelLink+"/preview?StartDate="+StartDate+"&EndDate="+EndDate+"&PortCode="+PortCode+"&PortType="+PortType+"&Type="+Type)

        props.data.modelLink == "vessel-voyage-lifting" ||  props.data.modelLink == "vessel-voyage-lifting-summary" ?
            urlLink = globalContext.globalHost + globalContext.globalPathLink + props.data.modelLink + "/preview?StartDate=" + StartDate + "&EndDate=" + EndDate + "&VesselCode=" + VesselCode + "&Port=" + Port+"&LadenEmpty="+LadenEmptyCheck+"&SOCCOC="+SOCCOC+"&ContainerType="+CtrType+"&JS="+JSCheck:
            urlLink = globalContext.globalHost + globalContext.globalPathLink + props.data.modelLink + "/preview?StartDate=" + StartDate + "&EndDate=" + EndDate + "&PortCode=" + PortCode + "&PortType=" + PortType + "&Type=" + Type + "&Owner=" + OwnerCheck + "&LadenEmpty=" + LadenEmptyCheck + "&CtrType=" + CtrType

        axios({
            url: urlLink,
            method: "GET",
            responseType: 'arraybuffer',
            auth: {
                username: globalContext.authInfo.username,
                password: globalContext.authInfo.access_token
            }
        }).then((response) => {
            window.$("#PreviewPdfModal").modal("toggle");
            var file = new Blob([response.data], { type: 'application/pdf' });
            let url = window.URL.createObjectURL(file);
            //  window.open(url);

            $('#pdfFrame').attr('src', url);
        });

        //   }else{
        //     alert("You are not allowed to preview PDF, Please check your User Permission.")
        //   }

    }

    useEffect(() => {

        var today = new Date();
        var yyyy = today.getFullYear();


        setValue("DynamicModel[StartDate]", "")
        setValue("DynamicModel[EndDate]", "")
        setValue("DynamicModel[Port]", "")
        setValue("DynamicModel[POLPOD]", "POL")
        setValue("DynamicModel[Type]", "WithJointService")


        setValue("DynamicModel[StartDate]", "1/1/" + yyyy)
        setValue("DynamicModel[EndDate]", "31/12/" + yyyy)
        // $(".StartDate").val("1/1/"+yyyy)

        // $(".EndDate").val("31/12/"+yyyy)

        GetAllDropDown(['Area', 'User', "Vessel", "ContainerType"], globalContext).then(res => {

            var arrayPort = []
            var arrayVessel = []
            var arrayContainerType = []
            $.each(res.Area, function (key, value) {
                arrayPort.push({ value: value.AreaUUID, label: value.PortCode })
            })
            $.each(res.Vessel, function (key, value) {
                arrayVessel.push({ value: value.VesselUUID, label: value.VesselCode })
            })
            $.each(res.ContainerType, function (key, value) {
                arrayContainerType.push({ value: value.ContainerTypeUUID, label: value.ContainerType })
            })


            setPort(sortArray(arrayPort))
            setVessel(sortArray(arrayVessel))
            setContainerType(sortArray(arrayContainerType))


        })

        GetUser(globalContext.authInfo.id, globalContext).then(res => {
            setValue("DynamicModel[Port]", res[0].Branch.PortCode)
        })

        return () => {

        }
    }, [props.data.model])


    const { register, handleSubmit, setValue, trigger, getValues, unregister, clearErrors, reset, control, watch, formState: { errors } } = useForm({

    });

    function LiftingSeries() {
        return (
            <div className="row">
                <div className="col-xs-12 col-md-4">

                    <div className="form-group">
                        <label className="control-label">Start Date
                        </label>
                        <Controller
                            name="DynamicModel[StartDate]"
                            control={control}

                            render={({ field: { onChange, value } }) => (
                                <>
                                    <Flatpickr
                                        value={value}
                                        {...register('DynamicModel[StartDate]')}

                                        onChange={val => {

                                            onChange(moment(val[0]).format("DD/MM/YYYY"))
                                        }}
                                        className="form-control StartDate"
                                        options={{
                                            dateFormat: "d/m/Y"
                                        }}

                                    />
                                </>
                            )}
                        />
                    </div>

                </div>

                <div className="col-xs-12 col-md-4">

                    <div className="form-group">
                        <label className="control-label">End Date
                        </label>
                        <Controller
                            name="DynamicModel[EndDate]"
                            control={control}

                            render={({ field: { onChange, value } }) => (
                                <>
                                    <Flatpickr
                                        value={value}
                                        {...register('DynamicModel[EndDate]')}

                                        onChange={val => {

                                            onChange(moment(val[0]).format("DD/MM/YYYY"))
                                        }}
                                        className="form-control EndDate"
                                        options={{
                                            dateFormat: "d/m/Y"
                                        }}

                                    />
                                </>
                            )}
                        />
                    </div>

                </div>


                <div className="col-xs-12 col-md-4">

                    <div className="form-group">
                        <label className="control-label">Port
                        </label>
                        <Controller
                            name="DynamicModel[Port]"
                            id="Port"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Select
                                    isClearable={true}
                                    {...register("DynamicModel[Port]")}
                                    value={value ? port.find(c => c.value === value) : null}
                                    onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                    options={port}
                                    className="form-control Port"
                                    classNamePrefix="select"
                                    styles={globalContext.customStyles}

                                />
                            )}
                        />
                    </div>

                </div>

                <div className="col-xs-12 col-md-4">

                    <div className="form-group">
                        <label className="control-label">POL/POD
                        </label>
                        <Controller
                            name="DynamicModel[POLPOD]"
                            id="POLPOD"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Select
                                    isClearable={true}
                                    {...register("DynamicModel[POLPOD]")}
                                    value={value ? POLPOD.find(c => c.value === value) : null}
                                    onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                    options={POLPOD}
                                    className="form-control POLPOD"
                                    classNamePrefix="select"
                                    styles={globalContext.customStyles}

                                />
                            )}
                        />
                    </div>

                </div>

                <div className="col-xs-12 col-md-4">

                    <div className="form-group">
                        <label className="control-label">Type
                        </label>
                        <Controller
                            name="DynamicModel[Type]"
                            id="Type"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Select
                                    isClearable={true}
                                    {...register("DynamicModel[Type]")}
                                    value={value ? Type.find(c => c.value === value) : null}
                                    onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                    options={Type}
                                    className="form-control Type"
                                    classNamePrefix="select"
                                    styles={globalContext.customStyles}

                                />
                            )}
                        />
                    </div>

                </div>


                <div className="col-4"><button type="button" id="PreviewLifting" className={`${filteredAp.find((item) => item == `preview-${modelLinkTemp}`) !== undefined ? "" : "disabledAccess"} btn btn-success mt-4`} onClick={() => handlePreview()}>Preview</button></div>


                <div className={`col-xs-12 col-md-2 ${props.data.modelLink !== "lifting-summary" ? "" : "d-none"}`}>

                    <div className="form-group">
                        <input type="checkbox" className="OwnershipTypeCheckbox" id="OwnershipTypeCheckbox" />
                        <label className="control-label ml-2" htmlFor='OwnershipTypeCheckbox'>Ownership Type</label>
                    </div>

                </div>

                <div className={`col-xs-12 col-md-2 ${props.data.modelLink !== "lifting-summary" ? "" : "d-none"}`}>

                    <div className="form-group">
                        <input type="checkbox" className="LadenEmptyCheckbox" id="LadenEmptyCheckbox" />
                        <label className="control-label ml-2" htmlFor='LadenEmptyCheckbox'>Laden/Empty</label>
                    </div>

                </div>

                <div className={`col-xs-12 col-md-2 ${props.data.modelLink !== "lifting-summary" ? "" : "d-none"}`}>

                    <div className="form-group">
                        <input type="checkbox" className="ContainerTypeCheckbox" id="ContainerTypeCheckbox" />
                        <label className="control-label ml-2" htmlFor='ContainerTypeCheckbox'>Container Type</label>
                    </div>

                </div>

            </div>
        )
    }

    function VesselVoyageLifting() {
        return (
            <div className="row">

                <div className="col-xs-12 col-md-3">

                    <div className="form-group">
                        <label className="control-label">Vessel Code
                        </label>
                        <Controller
                            name="DynamicModel[VesselCode]"
                            id="VesselCode"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Select
                                    isClearable={true}
                                    {...register("DynamicModel[VesselCode]")}
                                    value={value ? vessel.find(c => c.value === value) : null}
                                    onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                    options={vessel}
                                    className="form-control VesselCode"
                                    classNamePrefix="select"
                                    styles={globalContext.customStyles}

                                />
                            )}
                        />
                    </div>

                </div>
                <div className="col-xs-12 col-md-3">

                    <div className="form-group">
                        <label className="control-label">Start Date
                        </label>
                        <Controller
                            name="DynamicModel[StartDate]"
                            control={control}

                            render={({ field: { onChange, value } }) => (
                                <>
                                    <Flatpickr
                                        value={value}
                                        {...register('DynamicModel[StartDate]')}

                                        onChange={val => {

                                            onChange(moment(val[0]).format("DD/MM/YYYY"))
                                        }}
                                        className="form-control StartDate"
                                        options={{
                                            dateFormat: "d/m/Y"
                                        }}

                                    />
                                </>
                            )}
                        />
                    </div>

                </div>

                <div className="col-xs-12 col-md-3">

                    <div className="form-group">
                        <label className="control-label">End Date
                        </label>
                        <Controller
                            name="DynamicModel[EndDate]"
                            control={control}

                            render={({ field: { onChange, value } }) => (
                                <>
                                    <Flatpickr
                                        value={value}
                                        {...register('DynamicModel[EndDate]')}

                                        onChange={val => {

                                            onChange(moment(val[0]).format("DD/MM/YYYY"))
                                        }}
                                        className="form-control EndDate"
                                        options={{
                                            dateFormat: "d/m/Y"
                                        }}

                                    />
                                </>
                            )}
                        />
                    </div>

                </div>
                <div className="col-xs-12 col-md-3">

                    <div className="form-group">
                        <label className="control-label">Port
                        </label>
                        <Controller
                            name="DynamicModel[Port]"
                            id="Port"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Select
                                    isClearable={true}
                                    {...register("DynamicModel[Port]")}
                                    value={value ? port.find(c => c.value === value) : null}
                                    onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                    options={port}
                                    className="form-control Port"
                                    classNamePrefix="select"
                                    styles={globalContext.customStyles}

                                />
                            )}
                        />
                    </div>

                </div>

                <div className={`col-xs-12 col-md-2 ${props.data.modelLink !== "vessel-voyage-lifting-summary" ? "" : "d-none"}`}>
                
                <div className="form-group">
                    <input type="checkbox" className="LadenEmptyCheckbox" id="LadenEmptyCheckbox" />
                    <label className="control-label ml-2" htmlFor='LadenEmptyCheckbox'>Laden/Empty</label>
                </div>

                </div>

                <div className={`col-xs-12 col-md-2 ${props.data.modelLink !== "vessel-voyage-lifting-summary" ? "" : "d-none"}`}>

                <div className="form-group">
                    <input type="checkbox" className="SOCCOCCheckbox" id="SOCCOCCheckbox" />
                    <label className="control-label ml-2" htmlFor='SOCCOCCheckbox'>SOC/COC</label>
                </div>

                </div>

                <div className={`col-xs-12 col-md-2 ${props.data.modelLink !== "vessel-voyage-lifting-summary" ? "" : "d-none"}`}>

                <div className="form-group">
                    <input type="checkbox" className="ContainerTypeCheckbox" id="ContainerTypeCheckbox" />
                    <label className="control-label ml-2" htmlFor='ContainerTypeCheckbox'>Container Type</label>
                </div>

                </div>

                <div className={`col-xs-12 col-md-2 ${props.data.modelLink !== "vessel-voyage-lifting-summary" ? "" : "d-none"}`}>

                <div className="form-group">
                    <input type="checkbox" className="JSCheckbox" id="JSCheckbox" />
                    <label className="control-label ml-2" htmlFor='JSCheckbox'>JS</label>
                </div>
                </div>
                                
                <div className="col"><button type="button" id="PreviewLifting" className={`${filteredAp.find((item) => item == `preview-${modelLinkTemp}`) !== undefined ? "" : "disabledAccess"} btn btn-success  float-right`} onClick={() => handlePreview()}>Preview</button></div>
            </div>
        )
    }


    return (

        <div className="card card-primary">

            <div className="card-body">
                <div className="card lvl1">
                    <div className="card-body">
                        {props.data.modelLink == "vessel-voyage-lifting" || props.data.modelLink == "vessel-voyage-lifting-summary" ? VesselVoyageLifting() : LiftingSeries()}




                    </div>
                </div>


            </div>

            <div className="modal fade" id="PreviewPdfModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <iframe id="pdfFrame" src="preview?id=" width="100%" height="700"></iframe>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>








    )
}






export default Lifting