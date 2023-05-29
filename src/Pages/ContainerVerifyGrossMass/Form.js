
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import { GetUpdateData, CreateData, UpdateData, ToastNotify, ControlOverlay, initHoverSelectDropownTitle, GetAllDropDown, getContainerVerifyGrossMassListDataByPort, getBookingReservationContainerById } from '../../Components/Helper.js'
import GlobalContext from "../../Components/GlobalContext"
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

function Form(props) {
    const { state } = useLocation();
    const [formState, setFormState] = useState({ formType: "New" });
    const globalContext = useContext(GlobalContext);
    const params = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, getValues, reset, control, watch, formState: { errors } } = useForm({ mode: "onChange" });

    const [bookingReservation, setBookingReservation] = useState([])
    const [containerReleaseOrder, setContainerReleaseOrder] = useState([])
    const [agent, setAgent] = useState([])
    const [shipper, setShipper] = useState([])
    const [vesselName, setVesselName] = useState([])

    const [defaultAgentState, setDefaultAgentState] = useState(null)
    const [defaultShipperState, setDefaultShipperState] = useState(null)


    const {
        fields,
        append,
        update,
        prepend,
        remove,
        swap,
        move,
        insert,
        replace
    } = useFieldArray({
        control,
        name: "ContainerVerifyGrossMass"
    });

    // load options using API call
    const loadOptions = (inputValue) => {
        // company/get-company-by-company-name?search=shin&type=public&companyType=Depot&q=shin
        const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "company/get-company-by-company-name?search=" + inputValue + "&companyType=&q=" + inputValue, {

            auth: {
                username: globalContext.authInfo.username,
                password: globalContext.authInfo.access_token,
            },
        }).then(res => res.data.data)

        return response



    }

    function replaceNull(someObj, replaceValue = "***") {
        const replacer = (key, value) =>
            String(value) === "null" || String(value) === "undefined" ? replaceValue : value;
        return JSON.parse(JSON.stringify(someObj, replacer));
    }
    
    function openTextAreaModal(event) {
        window.$(event.target).next().modal("toggle");
    }

    function handleChangeBr(val) {
        if (val) {
            getBookingReservationContainerById(val.value, globalContext).then(res => {

                var replacedCROid = replaceNull(res.data.CRO, "");
                var replacedAgentRoc = replaceNull(res.data.Agent.ROC, "");
                var replacedShipperRoc = replaceNull(res.data.Shipper.ROC, "");
                var replacedVoyageVessel = replaceNull(res.data.Voyage, "");

                // $("#dynamicmodel-crono").val(replacedCROid.ContainerReleaseOrderUUID).trigger("change.select2");
                // $("#dynamicmodel-agent").val(replacedAgentRoc).trigger("change.select2");
                // $("#dynamicmodel-shipper").val(replacedShipperRoc).trigger("change.select2");
                // $("#dynamicmodel-vesselname").val(replacedVoyageVessel.Vessel).trigger("change.select2");
                setValue("DynamicModel[VesselName]", replacedVoyageVessel.Vessel)
                setValue("DynamicModel[CRONo]", replacedCROid.ContainerReleaseOrderUUID)


                setDefaultAgentState({ CompanyName: res.data.Agent.CompanyName, CompanyUUID: replacedAgentRoc })
                setDefaultShipperState({ CompanyName: res.data.Shipper.CompanyName, CompanyUUID: replacedShipperRoc })

                // $(".Agent").find(".select__placeholder").text(res.data.Agent.CompanyName)
                // $(".Agent").find(":hidden").val(replacedAgentRoc)


                // $(".Shipper").find(".select__placeholder").text(res.data.Shipper.CompanyName)
                // $(".Shipper").find(":hidden").val(replacedShipperRoc)

                remove()
                var arrayDynamic = []

                $.each(res.data.BookingReservationHasContainerTypes, function (key, value) {
                    $.each(value.BookingReservationHasContainers, function (key2, value2) {

                        var object = { ContainerType: value.ContainerType, ContainerTypeName: value.ContainerTypeName, ContainerCode: value2.ContainerCode, ContainerCodeName: value2.ContainerCodeName }
                        arrayDynamic.push(object)


                    })
                })


                append(arrayDynamic)





            })
        }
    }

    const onSubmit = (data, event) => {

        event.preventDefault();
        const formdata = new FormData($("form")[0]);
        ControlOverlay(true)
        if (formState.formType == "New" || formState.formType == "Clone") {

            CreateData(globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data) {
                    if (res.data.message == "Duplicate Port Code.") {
                        ToastNotify("error", "Duplicate port code.")
                        ControlOverlay(false)
                    }
                    else {
                        ToastNotify("success", "Container Verify Gross Mass created successfully.")
                        navigate("/movement/container/container-verify-gross-mass/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                    }
                }

            })
        }
        else {

            UpdateData(formState.id, globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data.data) {
                    ToastNotify("success", "Container Verify Gross Mass created successfully.")
                    navigate("/movement/container/container-verify-gross-mass/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })

                }
                else {
                    ToastNotify("error", "Error")
                    ControlOverlay(false)
                }
            })

        }


    }
    
    function setRemarkControl(e, index){
        $(`input[data-target='remark-${index}']`).val($(e.target).val())
    }

    window.$(".RemarkModal").on("shown.bs.modal", function() {
        $(this).find(".remarkInModal").focus()
    }); 


    useEffect(() => {
        if (state == null) {

            setFormState({ formType: "Update", id: params.id })
        }
        else {

            setFormState(state)
        }
        return () => {

        }
    }, [state])

    useEffect(() => {

        reset()
        initHoverSelectDropownTitle()
        setDefaultAgentState(null)
        setDefaultShipperState(null)
        remove()

        GetAllDropDown(['Vessel'], globalContext, false).then(res => {
            var ArrayVessel = [];

            $.each(res.Vessel, function (key, value) {
                //filter out vessel type = barge and vessel that are approved
                if (value.VerificationStatus == "Approved" && value.VesselType !== "----07039c85-63e7-11ed-ad61-7446a0a8dedc") {
                    ArrayVessel.push({ value: value.VesselUUID, label: value.VesselName })
                }
            })
            setVesselName(ArrayVessel)
        })

        getContainerVerifyGrossMassListDataByPort(globalContext).then(res => {

            var ArrayBr = [];
            var ArrayCro = [];
            $.each(res.data.BookingReservations, function (key, value) {

                ArrayBr.push({ value: value.BookingReservationUUID, label: value.DocNum })
            });

            $.each(res.data.ContainerReleaseOrders, function (key, value) {

                ArrayCro.push({ value: value.ContainerReleaseOrderUUID, label: value.DocNum })
            });

            setBookingReservation(ArrayBr)
            setContainerReleaseOrder(ArrayCro)
            //  $("#dynamicmodel-brno").html(htmlBr).val(PreviousBR)
            //  $("#dynamicmodel-crono").html(htmlCRO).val(PreviousCRO)


        })





        // $(".region").find(".select__control").addClass("has-error")
        if (formState) {
            if (formState.formType == "Update" || formState.formType == "Clone") {
                ControlOverlay(true)
                GetUpdateData(formState.id, globalContext, props.data.modelLink).then(res => {

                    // $.each(res.data.data[0], function (key, value) {
                    //     setValue('DynamicModel[' + key + ']', value);
                    // })
                    remove()
                    var arrayDynamic = []

                    $.each(res.data.data, function (key, value) {


                        var object = {
                            TicketNum: value.TicketNum, TicketDateTime: value.TicketDateTime, GrossWeight: value.GrossWeight,
                            ContainerCode: value.ContainerCode, ContainerCodeName: value.containerCode.ContainerCode, ContainerTypeName: value.containerCode.containerType.ContainerType,
                            ContainerVerifyGrossMassUUID: value.ContainerVerifyGrossMassUUID,
                            Remark: value.Remark,
                        }

                        arrayDynamic.push(object)
                    })

                    setValue("DynamicModel[BRNo]", res.data.data[0].BookingReservation)
                    setValue("DynamicModel[CRONo]", res.data.data[0].ContainerReleaseOrder)
                    setDefaultAgentState({ CompanyName: res.data.data[0].agent.CompanyName, CompanyUUID: res.data.data[0].Agent })
                    setDefaultShipperState({ CompanyName: res.data.data[0].shipper.CompanyName, CompanyUUID: res.data.data[0].Shipper })

                    setValue("DynamicModel[VesselName]",res.data.data[0].VesselCode)
                    setValue("DynamicModel[VesselETA]",res.data.data[0].VesselETA)

                    append(arrayDynamic)
                    setTimeout(()=>{
                        $.each($(".remark"), function (key, value) {
                            $(value).val($(value).next().find(".remarkInModal").val())
                        })
                    },100)
    
                    ControlOverlay(false)


                })

            }

        }
        else {
            ControlOverlay(true)
            GetUpdateData(params.id, globalContext, props.data.modelLink).then(res => {
                remove()
                var arrayDynamic = []

                $.each(res.data.data, function (key, value) {


                    var object = {
                        TicketNum: value.TicketNum, TicketDateTime: value.TicketDateTime, GrossWeight: value.GrossWeight,
                        ContainerCode: value.ContainerCode, ContainerCodeName: value.containerCode.ContainerCode, ContainerTypeName: value.containerCode.containerType.ContainerType,
                        ContainerVerifyGrossMassUUID: value.ContainerVerifyGrossMassUUID,
                        Remark: value.Remark,
                    }

                    arrayDynamic.push(object)
                })

                setValue("DynamicModel[BRNo]", res.data.data[0].BookingReservation)
                setValue("DynamicModel[CRONo]", res.data.data[0].ContainerReleaseOrder)
                setDefaultAgentState({ CompanyName: res.data.data[0].agent.CompanyName, CompanyUUID: res.data.data[0].Agent })
                setDefaultShipperState({ CompanyName: res.data.data[0].shipper.CompanyName, CompanyUUID: res.data.data[0].Shipper })

                setValue("DynamicModel[VesselName]",res.data.data[0].VesselCode)
                setValue("DynamicModel[VesselETA]",res.data.data[0].VesselETA)
                append(arrayDynamic)

                setTimeout(()=>{
                    $.each($(".remark"), function (key, value) {
                        $(value).val($(value).next().find(".remarkInModal").val())
                    })
                },100)

                ControlOverlay(false)
                ControlOverlay(false)


            })

        }



        return () => {

        }

    }, [formState])

    function ContainerDetails() {
        return (
            <div className="dynamicform_wrapper"><div className="card lvl1">
                <div className="card-body">
                    <div className="table_wrap">
                        <div className="table_wrap_inner">
                            <table id="container-table" className="table table-bordered commontable ">
                                <thead>
                                    <tr><th>Container Type</th>
                                        <th>Container Code</th>
                                        <th>Container Gross Weight</th>
                                        <th>Weight Ticket No.</th>
                                        <th>Weight Ticket Date</th>
                                        <th>Remarks</th>
                                    </tr>

                                </thead>
                                <tbody className="container-items">
                                    {fields.map((item, index) => {
                                        return (
                                            <tr key={item.id}>

                                                <td>
                                                    <input defaultValue='' {...register(`ContainerVerifyGrossMass[${index}][ContainerVerifyGrossMassUUID]`)} className={`form-control d-none`} />
                                                    <input defaultValue='' {...register(`ContainerVerifyGrossMass[${index}][ContainerTypeName]`)} className={`form-control`} readOnly />
                                                </td>
                                                <td>
                                                    <input defaultValue='' {...register(`ContainerVerifyGrossMass[${index}][ContainerCodeName]`)} className={`form-control`} readOnly />
                                                    <input defaultValue='' {...register(`ContainerVerifyGrossMass[${index}][ContainerCode]`)} className={`form-control d-none`} />
                                                </td>
                                                <td>
                                                    <input defaultValue='' {...register(`ContainerVerifyGrossMass[${index}][GrossWeight]`)} className={`form-control`} />
                                                </td>
                                                <td>
                                                    <input defaultValue='' {...register(`ContainerVerifyGrossMass[${index}][TicketNum]`)} className={`form-control`} />
                                                </td>
                                                <td>
                                                    <Controller

                                                        control={control}
                                                        name={`ContainerVerifyGrossMass[${index}][TicketDateTime]`}
                                                        render={({ field: { onChange, value } }) => (
                                                            <>
                                                                <Flatpickr
                                                                    value={value ? value : ""}
                                                                    {...register(`ContainerVerifyGrossMass[${index}][TicketDateTime]`)}
                                                                    onChange={val => {

                                                                        onChange(moment(val[0]).format("DD/MM/YYYY"))
                                                                    }}
                                                                    className="form-control ticketDate"
                                                                    options={{
                                                                      
                                                                        time_24hr: true,
                                                                        dateFormat: "d/m/Y"
                                                                    }}

                                                                />
                                                            </>
                                                        )}
                                                    />
                                                </td>
                                                <td>
                                                    <input type="text" className={`form-control remark`} onClick={openTextAreaModal} data-target={`remark-${index}`}/>
                                                    <div className="modal fade RemarkModal">
                                                        <div className="modal-dialog">
                                                            <div className="modal-content">
                                                                <div className="modal-header">
                                                                    <h4 className="modal-title">Remark</h4>
                                                                </div>
                                                                <div className="modal-body">
                                                                    <div className="form-group">
                                                                        <textarea id="" className={`form-control remarkInModal`} {...register(`ContainerVerifyGrossMass[${index}][Remark]`)} rows="5" data-target={`remark-${index}`} placeholder={`Enter Remarks`}  onBlur={(val) => setRemarkControl(val,index)}></textarea>
                                                                    </div>
                                                                </div>
                                                                <div className="modal-footer">
                                                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>


                                        )
                                    })}
                                </tbody>



                            </table>



                        </div>
                    </div>
                </div>

            </div>
            </div>
        )
    }


    const handleSubmitForm = (e) => {
        handleSubmit(onSubmit)(e);
      };



    return (
        <form >
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title='Container Verify Gross Mass' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="Container Verify Gross Mass" model="container-verify-gross-mass" selectedId="ContainerVerifyGrossMassUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='Container Verify Gross Mass' data={props} />}
            <div className="col-md-12">
                <div className="card card-primary">
                    <div className="card-header">Container Verify Gross Mass Form</div>
                    <div className="card-body">

                        <div className="row">

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label">BR No.</label>

                                    <Controller
                                        name="DynamicModel[BRNo]"
                                        id="BookingReservation"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("DynamicModel[BRNo]")}
                                                value={value ? bookingReservation.find(c => c.value === value) : null}
                                                onChange={val => { val == null ? onChange(null) : onChange(val.value); handleChangeBr(val) }}
                                                options={bookingReservation}
                                                className={`form-control BookingReservation}`}
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body}
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label">CRO No.</label>

                                    <Controller
                                        name="DynamicModel[CRONo]"
                                        id="ContainerReleaseOrder"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("DynamicModel[CRONo]")}
                                                value={value ? containerReleaseOrder.find(c => c.value === value) : null}
                                                onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                options={containerReleaseOrder}
                                                menuPortalTarget={document.body}
                                                className={`form-control ContainerReleaseOrder}`}
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label">Agent</label>
                                    <Controller
                                        name="DynamicModel[Agent]"
                                        id="Agent"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <AsyncSelect
                                                isClearable={true}
                                                {...register("DynamicModel[Agent]")}
                                                placeholder={globalContext.asyncSelectPlaceHolder}
                                                value={defaultAgentState}
                                                cacheOptions
                                                menuPortalTarget={document.body}
                                                onChange={e => { e == null ? onChange(null) : onChange(e.id); setDefaultAgentState(e) }}
                                                getOptionLabel={e => e !== null && e.CompanyName}
                                                getOptionValue={e => e !== null && e.CompanyUUID}
                                                loadOptions={loadOptions}
                                                className="form-control Agent"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label">Shipper</label>
                                    <Controller
                                        name="DynamicModel[Shipper]"
                                        id="Shipper"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <AsyncSelect
                                                isClearable={true}
                                                {...register("DynamicModel[Shipper]")}
                                                value={defaultShipperState}
                                                cacheOptions
                                                placeholder={globalContext.asyncSelectPlaceHolder}
                                                onChange={e => { e == null ? onChange(null) : onChange(e.id); setDefaultShipperState(e) }}
                                                getOptionLabel={e => e.CompanyName}
                                                getOptionValue={e => e.CompanyUUID}
                                                loadOptions={loadOptions}
                                                menuPortalTarget={document.body}
                                                className="form-control Shipper"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label">Vessel Name</label>

                                    <Controller
                                        name="DynamicModel[VesselName]"
                                        id="VesselName"
                                        control={control}

                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}

                                                {...register("DynamicModel[VesselName]")}
                                                value={value ? vesselName.find(c => c.value === value) : null}
                                                onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                options={vesselName}
                                                menuPortalTarget={document.body}
                                                className={`form-control VesselName`}
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label">Vessel ETA</label>
                                    <Controller

                                        control={control}
                                        name="DynamicModel[VesselETA]"
                                        render={({ field: { onChange, value } }) => (
                                            <>
                                                <Flatpickr
                                                    value={value ? value : ""}
                                                    {...register("DynamicModel[VesselETA]")}
                                                    onChange={val => {

                                                        onChange(moment(val[0]).format("DD/MM/YYYY HH:mm"))
                                                    }}
                                                    className="form-control dateformat"
                                                    options={{
                                                        enableTime: true,
                                                        time_24hr: true,
                                                        dateFormat: "d/m/Y H:i"
                                                    }}

                                                />
                                            </>
                                        )}
                                    />
                                </div>


                            </div>



                        </div>
                        {ContainerDetails()}
                        <div className="col-xs-12 col-md-3 mt-2">
                            <div className="form-group mt-4 mb-1">
                                <input type="checkbox" className="validCheckbox" id="validCheckbox" defaultChecked />
                                <input type="text" className="form-control d-none" defaultValue='1' {...register('DynamicModel[Valid]')} />
                                <label className="control-label ml-2" htmlFor='validCheckbox'>Valid</label>
                            </div>
                        </div>

                    </div>



                </div>




            </div>
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title='Container Verify Gross Mass' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="Container Verify Gross Mass" model="container-verify-gross-mass" selectedId="ContainerVerifyGrossMassUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='Container Verify Gross Mass' data={props} />}
        </form>



    )
}






export default Form