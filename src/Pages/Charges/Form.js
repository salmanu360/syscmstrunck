import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, UpdateData, ToastNotify, ControlOverlay, GetAllDropDown, toFourDecimalPlaces, getEffectedDocumentsConfirm, getCheckCharges, initHoverSelectDropownTitle, GetTaxCodeById, CreateData2, getEffectedDocuments, sortArray } from '../../Components/Helper.js'
import Select from 'react-select'
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

    const [chargesType, setChargesType] = useState([])
    const [freightTerm, setFreightTerm] = useState([])
    const [containerType, setContainerType] = useState([])
    const [currencyType, setCurrencyType] = useState([])
    const [taxCode, setTaxCode] = useState([])
    const [port, setPort] = useState([])
    const [foundEffected, setFoundEffected] = useState(false)
    const [vesselType, setVesselType] = useState([])
    const [flag, setFlag] = useState(false)

    const [oriCharges, setOriCharges] = useState([])

    const [triggerState, setTriggerState] = useState(false)

    const [updateFormData, setUpdataFormData] = useState([])



    const [notApplytoAllPortArrayList, setNotApplytoAllPortArrayList] = useState([])
    const DefaultUserPort=globalContext.userPort;



    const [checkDisabledAllPort, setCheckDisabledAllPort] = useState(true)



    const UOMOptions = [
        {
            "value": "UNIT",
            "label": "UNIT"
        },
        {
            "value": "M3",
            "label": "M3"
        },
        {
            "value": "KG",
            "label": "KG"
        },
        {
            "value": "MT",
            "label": "MT"
        },
        {
            "value": "TRIP",
            "label": "TRIP"
        },
        {
            "value": "SET",
            "label": "SET"
        },
        {
            "value": "PAGE",
            "label": "PAGE"
        },
        {
            "value": "SHIPMENT",
            "label": "SHIPMENT"
        },

    ]

    const { register, handleSubmit, setValue, trigger, getValues, unregister, clearErrors, reset, control, watch, formState: { errors } } = useForm({
        mode: "onChange",
        defaultValues: {
            Charges: [{ PortCode: "" }]
        }
    });

    const {
        fields,
        append,
        prepend,
        remove,
        swap,
        move,
        insert,
        replace
    } = useFieldArray({
        control,
        name: "Charges"
    });

    function handleKeydown(event){
        var Closest=$(event.target).parent().parent().parent().parent()
        if (event.key === "ArrowDown") {
            if($(Closest).hasClass("Readonly")){
                event.preventDefault()
            }
        }
      
    }


    useEffect(() => {

        if (checkDisabledAllPort) {
            trigger()
        }

        return () => {

        }
    }, [checkDisabledAllPort])

    useEffect(() => {

        trigger()
        toFourDecimalPlaces()


        $('.dynamicReferencePrice').off("change").on("change", function () {
            $(this).val(parseFloat($(this).val()).toFixed(4))
            if ($(this).closest("tr").find(".dynamicMinPrice").val() == "") {
                $(this).closest("tr").find(".dynamicMinPrice").val(parseFloat($(this).val()).toFixed(4))
            }
        })
        return () => {

        }
    }, [fields])

    useEffect(() => {
        //check for all condition met for update charges 
        if (flag) {
            UpdateData(formState.id, globalContext, props.data.modelLink, updateFormData).then(res => {
                ControlOverlay(true)
                if (res.data.data) {
                    ToastNotify("success", "Charges updated successfully.")
                    navigate("/setting/sales-settings/charges/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                    ControlOverlay(false)

                }
                else {
                    ToastNotify("error", "Error")
                    ControlOverlay(false)
                }
            })
        }
        return () => {

        }
    }, [flag])

    $('.referencePrice').off("change").on('change', function (event) {
        if ($('.minPrice').val() == "") {
            $('.minPrice').val(parseFloat($(this).val()).toFixed(4))

        }
    });


    // $(document).on("blur", ".inputDecimalFourPlaces", function () {
    //     if (this.value != "") {
    //         this.value = parseFloat(this.value).toFixed(4);
    //     }
    // })



    $('.dynamicReferencePrice').off("change").on("change", function () {
        $(this).val(parseFloat($(this).val()).toFixed(4))
        if ($(this).closest("tr").find(".dynamicMinPrice").val() == "") {
            $(this).closest("tr").find(".dynamicMinPrice").val(parseFloat($(this).val()).toFixed(4))
        }
    })

    $('#confirm').unbind().click(function () {

        var arrayTariffUUIDs = [];
        var arrayQuotationUUIDs = [];
        var arrayBookingReservationUUIDs = [];
        var arrayInvoiceUUIDs = [];

        $('.checkboxTariffs').each(function () {
            if ($(this).is(':checked')) {
                arrayTariffUUIDs.push($(this).parent().find("input:hidden").val())
            }
        });
        $('.checkboxQuotation').each(function () {
            if ($(this).is(':checked')) {
                arrayQuotationUUIDs.push($(this).parent().find("input:hidden").val())
            }
        });
        $('.checkboxBR').each(function () {
            if ($(this).is(':checked')) {
                arrayBookingReservationUUIDs.push($(this).parent().find("input:hidden").val())
            }
        });
        $('.checkboxInvoice').each(function () {
            if ($(this).is(':checked')) {
                arrayInvoiceUUIDs.push($(this).parent().find("input:hidden").val())
            }
        });

        var arrayUUIDs = [];
        var listArray = [];
        var arrayCharges = [];
        if ($("#applyToAllCheckbox").prop("checked") == true) {
            var chargesuuid;
            state ? chargesuuid = state.id : chargesuuid = params.id




            arrayUUIDs.push({
                "Tariff": arrayTariffUUIDs,
                "Quotation": arrayQuotationUUIDs,
                "BookingReservation": arrayBookingReservationUUIDs,
                "SalesInvoice": arrayInvoiceUUIDs,
                "ChargesUUID": chargesuuid,
                "ChargesCode": getValues("DynamicModel[ChargesCode]"),
                "ChargesName": getValues("DynamicModel[ChargesName]"),
                "ChargesType": getValues("DynamicModel[ChargesType]"),
                "FreightTerm": getValues("DynamicModel[FreightTerm]"),
                "ContainerType": getValues("DynamicModel[ContainerType]"),
                "UOM": getValues("DynamicModel[UOM][]"),
                "StartDate": getValues("DynamicModel[StartDate]"),
                "EndDate": getValues("DynamicModel[EndDate]"),
                "CurrencyType": getValues("DynamicModel[CurrencyType]"),
                "AccountCode": getValues("DynamicModel[AccountCode]"),
                "VesselType": getValues("DynamicModel[VesselType]"),
                "ReferencePrice": getValues("DynamicModel[ReferencePrice]"),
                "MinPrice": getValues("DynamicModel[MinPrice]"),
                "TaxCode": getValues("DynamicModel[TaxCode]"),
                "TaxRate": getValues("DynamicModel[TaxRate]"),
                "Description": getValues("DynamicModel[Description]"),
            })
        }
        else {
            $('.ChargesUUID').each(function () {
                var index = $(this).parent().closest("tr").index()
                var listArray = {
                    ChargesUUID: $(this).val(),
                    PortCode: getValues(`Charges[${index}][PortCode]`),
                    CurrencyType: getValues(`Charges[${index}][CurrencyType]`),
                    AccountCode: getValues(`Charges[${index}][AccountCode]`),
                    VesselType: getValues(`Charges[${index}][VesselType]`),
                    ReferencePrice: getValues(`Charges[${index}][ReferencePrice]`),
                    MinPrice: getValues(`Charges[${index}][MinPrice]`),
                    TaxCode: getValues(`Charges[${index}][TaxCode]`),
                    TaxRate: getValues(`Charges[${index}][TaxRate]`),
                    ContainerType: getValues(`Charges[${index}][ContainerType]`),
                    UOM: getValues(`Charges[${index}][UOM]`),
                    ChargesCode: getValues("DynamicModel[ChargesCode]"),
                    ChargesName: getValues("DynamicModel[ChargesName]"),
                    ChargesType: getValues("DynamicModel[ChargesType]"),
                    FreightTerm: getValues("DynamicModel[FreightTerm]"),
                    StartDate: getValues("DynamicModel[StartDate]"),
                    EndDate: getValues("DynamicModel[EndDate]"),
                    Description: getValues("DynamicModel[Description]"),
                }
                arrayCharges.push(listArray)
            });
            arrayUUIDs = {
                "Tariff": arrayTariffUUIDs,
                "Quotation": arrayQuotationUUIDs,
                "BookingReservation": arrayBookingReservationUUIDs,
                "SalesInvoice": arrayInvoiceUUIDs,
                arrayCharges
            }

        }

        $("select:disabled").prop('disabled', false);
        $(".flatpickr-input").prop("disabled", false);
        ControlOverlay(true)
        getEffectedDocumentsConfirm(arrayUUIDs, globalContext).then(res => {
            if (state) {
                navigate("/setting/sales-settings/charges/update/id=" + state.id, { state: { formType: "Update", id: state.id } })
            }
            else {
                navigate("/setting/sales-settings/charges/update/id=" + params.id, { state: { formType: "Update", id: params.id } })
            }

        })
    })




    function AfftedDocumenModal() {
        // <!-- Affected Document Modal-->
        return (
            <div className="modal fade" id="affectedDocument" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Affected Document</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="card container-charges lvl1">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <p style={{ fontSize: "20px" }}><b>Tariff</b></p>
                                                            <input type="checkbox" id="tariffCheck" className="tariffCheckGroup"></input>&ensp; <label for="tariffCheck" style={{ fontSize: "15px" }}>Toggle All</label>
                                                            <div className="tariff">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-3">
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <p style={{ fontSize: "20px" }}><b>Quotation</b></p>
                                                            <input type="checkbox" id="quotationCheck" className="quotationCheckGroup"></input>&ensp;<label for="quotationCheck" style={{ fontSize: "15px" }}>Toggle All</label>
                                                            <div className="quotation">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-3">
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <p style={{ fontSize: "20px" }}><b>Booking Reservation</b></p>
                                                            <input type="checkbox" id="BRCheck" className="BRCheckGroup"></input> &ensp;<label for="BRCheck" style={{ fontSize: "15px" }}>Toggle All</label>
                                                            <div className="bookingReservation">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-3">
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <p style={{ fontSize: "20px" }}><b>Sales Invoice</b></p>
                                                            <input type="checkbox" id="invoiceCheck" className="invoiceCheckGroup"></input>&ensp;<label for="invoiceCheck" style={{ fontSize: "15px" }}>Toggle All</label>
                                                            <div className="salesInvoice">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" id="confirm" data-dismiss="modal">Confirm</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )

    }


    function handleTaxCode(val, index) {
        if (val) {
            if (index !== undefined) {
                GetTaxCodeById(val.value, globalContext).then(res => {
                    if (res.data) {
                        setValue(`Charges[${index}][TaxRate]`, res.data.TaxRate)
                    }
                })

            } else {
                GetTaxCodeById(val.value, globalContext).then(res => {
                    if (res.data) {
                        setValue("DynamicModel[TaxRate]", res.data.TaxRate)
                    }
                })
            }

        }

    }


    function handleApplyAllPort(event) {

        if ($(event.target).prop("checked")) {
            remove()
            append()
            setCheckDisabledAllPort(true);
            $(".notApplyAllport").removeClass("d-none")
            $(".ApplyToAllField").val("1")

            // remove()
            // append()

        } else {

            $(".ApplyToAllField").val("0")
            unregister('DynamicModel.ChargesCode');
            unregister('DynamicModel.UOM');
            unregister('DynamicModel.ReferencePrice');
            $(".notApplyAllport").addClass("d-none")
            setCheckDisabledAllPort(false);
            trigger()
        }


        $(event.target).prop("checked") ? $(".Ports").addClass("d-none") : $(".Ports").removeClass("d-none")

    }

    function handleFloating(event) {
        if ($(event.target).prop("checked")) {
            $(".FloatingField").val("1")
            $(".startDate").addClass('pointerEventsStyle')
            $(".endDate").addClass('pointerEventsStyle')

            setValue("DynamicModel[StartDate]", "")
            setValue("DynamicModel[EndDate]", "")

        } else {
            $(".startDate").removeClass('pointerEventsStyle')
            $(".endDate").removeClass('pointerEventsStyle')
            $(".FloatingField").val("0")
        }
    }

    function portCard() {
        return (

            <div className="card Ports lvl1 col-xs-12 col-md-12 d-none">
                <div className="card-header">
                    <h3 className="card-title">Ports</h3>

                </div>
                <div className="card-body">
                    <div class="table_wrap">
                        <div class="table_wrap_inner">
                            <table className="table table-bordered commontable" style={{ width: "100%" }}>
                                <thead>
                                    <tr>
                                        <th>Container Type</th>
                                        <th>Vessel Type</th>
                                        <th>GL Code</th>
                                        <th>Port Code</th>
                                        <th>Currency Type</th>
                                        <th>UOM</th>
                                        <th>Reference Price</th>
                                        <th>Min Price</th>
                                        <th>Tax Code</th>
                                        <th>Tax Rate</th>
                                    </tr>

                                </thead>
                                <tbody className="portList">
                                    {fields.map((item, index) => (

                                        <tr key={item.id}>
                                            <td>

                                                <div className="row">
                                                    <div className="col-md-2">
                                                        <div className="dropdownbar float-left ml-1">
                                                            <button style={{ position: "relative", left: "0px", top: "-5px", padding: "0px 3px 0px 3px" }} className="btn btn-xs mt-2 btn-secondary dropdown-toggle float-right mr-1" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                <i className="fa fa-ellipsis-v"></i></button>
                                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                <button className="dropdown-item remove-container" type="button" onClick={() => remove(index)}>Remove</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <input  {...register("Charges" + '[' + index + ']' + '[ChargesUUID]')} className={`form-control  ChargesUUID d-none`} />
                                                    <div className="col-md-10">
                                                        <Controller
                                                            name={("Charges" + '[' + index + ']' + '[ContainerType]')}

                                                            control={control}

                                                            render={({ field: { onChange, value } }) => (
                                                                <Select
                                                                    isClearable={true}
                                                                    {...register("Charges" + '[' + index + ']' + '[ContainerType]')}
                                                                    value={value ? containerType.find(c => c.value === value) : null}
                                                                    onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                                    options={containerType}
                                                                    menuPortalTarget={document.body}
                                                                    className="basic-single"
                                                                    classNamePrefix="select"
                                                                    styles={globalContext.customStyles}

                                                                />
                                                            )}
                                                        />
                                                    </div>

                                                </div>
                                            </td>
                                            <td>

                                                <Controller
                                                    name={("Charges" + '[' + index + ']' + '[VesselType]')}

                                                    control={control}

                                                    render={({ field: { onChange, value } }) => (
                                                        <Select
                                                            isClearable={true}
                                                            {...register("Charges" + '[' + index + ']' + '[VesselType]')}
                                                            value={value ? vesselType.find(c => c.value === value) : null}
                                                            onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                            options={vesselType}
                                                            menuPortalTarget={document.body}
                                                            className="basic-single"
                                                            classNamePrefix="select"
                                                            styles={globalContext.customStyles}

                                                        />
                                                    )}
                                                />

                                            </td>
                                            <td><input  {...register("Charges" + '[' + index + ']' + '[AccountCode]')} className={`form-control`} /></td>
                                            <td>

                                                {checkDisabledAllPort == false ?
                                                    <Controller
                                                        name={("Charges" + '[' + index + ']' + '[PortCode]')}

                                                        control={control}

                                                        render={({ field: { onChange, value } }) => (
                                                            <Select
                                                                isClearable={true}
                                                                {...register("Charges" + '[' + index + ']' + '[PortCode]',{ required: "Port Code cannot be blank." })}
                                                                value={value ? port.find(c => c.value === value) : null}
                                                                onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                                options={port}
                                                                menuPortalTarget={document.body}
                                                                className={`basic-single PortCode ${errors.Charges ? errors.Charges[`${index}`] ? errors.Charges[`${index}`].PortCode ? "has-error-select" : "" : "" : ""}`}                     
                                                                classNamePrefix="select"
                                                                styles={globalContext.customStyles}
                                                                onKeyDown={handleKeydown}

                                                            />
                                                        )}
                                                    />

                                                    :
                                                    <Controller
                                                        name={("Charges" + '[' + index + ']' + '[PortCode]')}

                                                        control={control}

                                                        render={({ field: { onChange, value } }) => (
                                                            <Select
                                                                isClearable={true}
                                                                {...register("Charges" + '[' + index + ']' + '[PortCode]')}
                                                                value={value ? port.find(c => c.value === value) : null}
                                                                onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                                options={port}
                                                                menuPortalTarget={document.body}
                                                                className="basic-single PortCode"
                                                                classNamePrefix="select"
                                                                styles={globalContext.customStyles}

                                                            />
                                                        )}
                                                    />
                                                }



                                            </td>
                                            <td>

                                                <Controller
                                                    name={("Charges" + '[' + index + ']' + '[CurrencyType]')}

                                                    control={control}

                                                    render={({ field: { onChange, value } }) => (
                                                        <Select
                                                            isClearable={true}
                                                            {...register("Charges" + '[' + index + ']' + '[CurrencyType]')}
                                                            value={value ? currencyType.find(c => c.value === value) : null}
                                                            onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                            options={currencyType}
                                                            menuPortalTarget={document.body}
                                                            className="basic-single"
                                                            classNamePrefix="select"
                                                            styles={globalContext.customStyles}

                                                        />
                                                    )}
                                                />

                                            </td>
                                            <td>
                                                {checkDisabledAllPort == false ?
                                                    <Controller
                                                        name={`Charges[${index}][UOM][]`}
                                                        control={control}
                                                        render={({ field: { onChange, value } }) => (
                                                            <Select
                                                                isClearable={true}
                                                                isMulti
                                                                {...register(`Charges[${index}][UOM][]`, { required: "UOM cannot be blank." })}
                                                                value={
                                                                    value
                                                                        ? Array.isArray(value)
                                                                            ? value.map((c) =>
                                                                                UOMOptions.find((z) => z.value === c)
                                                                            )
                                                                            : UOMOptions.find(
                                                                                (c) => c.value === value
                                                                            )
                                                                        : null
                                                                }
                                                                onChange={(val) =>
                                                                    val == null
                                                                        ? onChange(null)
                                                                        : onChange(val.map((c) => c.value))
                                                                }
                                                                options={UOMOptions}
                                                                menuPortalTarget={document.body}
                                                                className={`basic-multiple-select ${errors.Charges ? errors.Charges[`${index}`] ? errors.Charges[`${index}`].UOM ? "has-error-select" : "" : "" : ""}`}
                                                                classNamePrefix="select"
                                                                styles={globalContext.customStyles}
                                                            />
                                                        )}
                                                    /> :
                                                    <Controller
                                                        name={`Charges[${index}][UOM][]`}
                                                        control={control}
                                                        render={({ field: { onChange, value } }) => (
                                                            <Select
                                                                isClearable={true}
                                                                isMulti
                                                                name={`Charges[${index}][UOM][]`}
                                                                value={
                                                                    value
                                                                        ? Array.isArray(value)
                                                                            ? value.map((c) =>
                                                                                UOMOptions.find((z) => z.value === c)
                                                                            )
                                                                            : UOMOptions.find(
                                                                                (c) => c.value === value
                                                                            )
                                                                        : null
                                                                }
                                                                onChange={(val) =>
                                                                    val == null
                                                                        ? onChange(null)
                                                                        : onChange(val.map((c) => c.value))
                                                                }
                                                                options={UOMOptions}
                                                                menuPortalTarget={document.body}
                                                                className="basic-multiple-select"
                                                                classNamePrefix="select"
                                                                styles={globalContext.customStyles}
                                                            />
                                                        )}
                                                    />

                                                }

                                            </td>
                                            <td>
                                                {checkDisabledAllPort == false ?
                                                    <input  {...register("Charges" + '[' + index + ']' + '[ReferencePrice]', { required: "eee" })} className={`form-control dynamicReferencePrice inputDecimalFourPlaces ${errors.Charges ? errors.Charges[`${index}`] ? errors.Charges[`${index}`].ReferencePrice ? "has-error" : "" : "" : ""}`} /> :
                                                    <input  {...register("Charges" + '[' + index + ']' + '[ReferencePrice]',)} className={`form-control dynamicReferencePrice inputDecimalFourPlaces}`} />

                                                }
                                            </td>

                                            <td><input  {...register("Charges" + '[' + index + ']' + '[MinPrice]')} className={`form-control dynamicMinPrice inputDecimalFourPlaces`} /></td>
                                            <td>
                                                <Controller
                                                    name={("Charges" + '[' + index + ']' + '[TaxCode]')}

                                                    control={control}
                                                    render={({ field: { onChange, value } }) => (
                                                        <Select
                                                            isClearable={true}
                                                            {...register("Charges" + '[' + index + ']' + '[TaxCode]')}
                                                            value={value ? taxCode.find(c => c.value === value) : null}
                                                            onChange={val => { val == null ? onChange(null) : onChange(val.value); handleTaxCode(val, index) }}
                                                            options={taxCode}
                                                            menuPortalTarget={document.body}
                                                            className="basic-single TaxCode"
                                                            classNamePrefix="select"
                                                            styles={globalContext.customStyles}

                                                        />
                                                    )}
                                                />
                                            </td>
                                            <td><input  {...register("Charges" + '[' + index + ']' + '[TaxRate]')} className={`form-control inputDecimalFourPlaces`} /></td>

                                        </tr>

                                    ))}
                                </tbody>



                            </table>
                        </div>
                    </div>

                    <button type="button" className="add-container btn btn-success btn-xs mb-2 mt-2" onClick={() => { append({ Name: "" }) }} ><span class="fa fa-plus"></span>Add Port</button>
                </div>
            </div>


        )


    }

    const onSubmit = async (data, event) => {

        setFlag(false)

        event.preventDefault();
        var tempForm = $("form")[0]

        $(tempForm).find(".inputDecimalFourPlaces").each(function () {
            var value1 = $(this).val();
            if (value1 !== "") {
                $(this).val(parseFloat(value1).toFixed(4));

            }
        })
        const formdata = new FormData(tempForm);



        var DataString = window.$($("form")[0]).serializeJSON()
        var flag
        formdata.append("data", JSON.stringify(DataString))
        if(notApplytoAllPortArrayList.length==0){
            var tempArrayList=[formState.id]
            formdata.append("DynamicModel[ChargesUUID]", JSON.stringify(tempArrayList))
        }else{
            formdata.append("DynamicModel[ChargesUUID]", JSON.stringify(notApplytoAllPortArrayList))
            
        }
       
        setUpdataFormData(formdata)
       

        if (formState.formType == "New" || formState.formType == "Clone") {

            var filters = {
                "ChargesCode": getValues("DynamicModel[ChargesCode]"),
                "ChargesName": getValues("DynamicModel[ChargesName]"),
                "ChargesType": getValues("DynamicModel[ChargesType]"),
                "FreightTerm": getValues("DynamicModel[FreightTerm]"),
                "ContainerType": getValues("DynamicModel[ContainerType]"),
                "CurrencyType ": getValues("DynamicModel[CurrencyType]"),
                "VesselType": getValues("DynamicModel[VesselType]"),
                "StartDate": $("input[name='DynamicModel[StartDate]']").val(),
                "EndDate": $("input[name='DynamicModel[EndDate]']").val(),
                "Floating": $(".FloatingField").val(),
                "ApplyToAllPort": $(".applyToAllCheckbox").is(':checked') ? 1 : 0,
            };

            getCheckCharges(filters, globalContext).then(res => {
                ControlOverlay(true)
                if (res) {
                    flag = res.data.ChargesUUID
                    if (flag) {
                        alert("The record already exist.")
                        if (window.confirm('Do you want to update the existing record?')) {
                            navigate("/setting/sales-settings/charges/update/id=" + flag);
                            return false;
                        } else {
                            ControlOverlay(false)
                            return false;
                        }

                    } else {
                        CreateData(globalContext, props.data.modelLink, formdata).then(res => {
                            if (res.data) {
                                if (res.data.message == "Charges has already been taken.") {
                                    ToastNotify("error", res.data.message)
                                    ControlOverlay(false)
                                }
                                else {
                                    ToastNotify("success", "Charges created successfully.")
                                    navigate("/setting/sales-settings/charges/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                                }
                            }

                        })
                    }



                } else {
                    CreateData(globalContext, props.data.modelLink, formdata).then(res => {
                        if (res.data) {
                            if (res.data.message == "Charges has already been taken.") {
                                ToastNotify("error", res.data.message)
                                ControlOverlay(false)
                            }
                            else {
                                ToastNotify("success", "Charges created successfully.")
                                navigate("/setting/sales-settings/charges/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                            }
                        }

                    })
                }
            })




        }
        else {

            var chargesUUID = []
            var flag;
            // if ($("#applyToAllCheckbox").prop("checked") == true) {
            chargesUUID = notApplytoAllPortArrayList;

            if ($("#applyToAllCheckbox").prop("checked") == true) {
                chargesUUID = []
            }

            if (state) {
                chargesUUID.push(state.id)
            } else {
                chargesUUID.push(params.id)
            }

    

            var filters = {
                "ChargesCode": getValues("DynamicModel[ChargesCode]"),
                "ChargesName": getValues("DynamicModel[ChargesName]"),
                "ChargesType": getValues("DynamicModel[ChargesType]"),
                "FreightTerm": getValues("DynamicModel[FreightTerm]"),
                "ContainerType": getValues("DynamicModel[ContainerType]"),
                "CurrencyType ": getValues("DynamicModel[CurrencyType]"),
                "VesselType": getValues("DynamicModel[VesselType]"),
                "StartDate": getValues("DynamicModel[StartDate]"),
                "EndDate": getValues("DynamicModel[EndDate]"),
                "Floating": $(".FloatingField").val(),
                "ApplyToAllPort": $(".applyToAllCheckbox").is(':checked') ? 1 : 0,
                "ChargesUUID": JSON.stringify(chargesUUID)
            };

            getCheckCharges(filters, globalContext).then(res => {
                if (res) {
                    flag = res.data.ChargesUUID
                    alert("The record already exist.")
                    if (window.confirm('Do you want to update the existing record?')) {
                        navigate("/setting/sales-settings/charges/update/id=" + flag);
                        return false;
                    } else {
                        return false;
                    }

                } else {
                    if (foundEffected == true) {
                        var madeChanged = false;
                        var arrayCharges = [];
                        if ($("#applyToAllCheckbox").prop("checked") == true) {

                            arrayCharges.push({
                                "ChargesUUID": state ? state.id : params.id,
                                "ChargesCode": $(".ChargesCode").val(),
                                "ChargesName": getValues("DynamicModel[ChargesName]"),
                                "ChargesType": getValues("DynamicModel[ChargesType]"),
                                "ContainerType": getValues("DynamicModel[ContainerType]"),
                                "FreightTerm": getValues("DynamicModel[FreightTerm]"),
                                "StartDate": getValues("DynamicModel[StartDate]"),
                                "EndDate": getValues("DynamicModel[EndDate]"),
                                "UOM": getValues("DynamicModel[UOM][]"),
                                "CurrencyType": getValues("DynamicModel[CurrencyType]"),
                                "AccountCode": getValues("DynamicModel[AccountCode]"),
                                "VesselType": getValues("DynamicModel[VesselType]"),
                                "ReferencePrice": $(".referencePrice").val(),
                                "MinPrice": getValues("DynamicModel[MinPrice]"),
                                "TaxCode": getValues("DynamicModel[TaxCode]"),
                                "TaxRate": getValues("DynamicModel[TaxRate]"),
                                "Description": getValues("DynamicModel[Description]"),
                            })


                        }
                        else {
                            $('.EffectedPortCode').each(function () {
                                var index = $(this).parent().closest("tr").index()
                                var listArray = {
                                    ChargesUUID: $(this).val(),
                                    PortCode: getValues(`Charges[${index}][PortCode]`),
                                    CurrencyType: getValues(`Charges[${index}][CurrencyType]`),
                                    AccountCode: getValues(`Charges[${index}][AccountCode]`),
                                    VesselType: getValues(`Charges[${index}][VesselType]`),
                                    ReferencePrice: getValues(`Charges[${index}][ReferencePrice]`),
                                    MinPrice: getValues(`Charges[${index}][MinPrice]`),
                                    TaxCode: getValues(`Charges[${index}][TaxCode]`),
                                    TaxRate: getValues(`Charges[${index}][TaxRate]`),
                                    ContainerType: getValues(`Charges[${index}][ContainerType]`),
                                    UOM: getValues(`Charges[${index}][UOM][]`),
                                    ChargesCode: getValues(`DynamicModel[ChargesCode]`),
                                    ChargesName: getValues(`DynamicModel[ChargesName]`),
                                    ChargesType: getValues(`DynamicModel[ChargesType]`),
                                    FreightTerm: getValues(`DynamicModel[FreightTerm]`),
                                    StartDate: getValues(`DynamicModel[StartDate]`),
                                    EndDate: getValues(`DynamicModel[EndDate]`),
                                    Description: getValues(`DynamicModel[Description]`)
                                }
                                arrayCharges.push(listArray)
                            });
                        }

                        getEffectedDocuments(arrayCharges, globalContext).then(res => {
                            if (res.data.updated == "0") {
                                var newCharges = []

                                $(".ChargesUUID").each(function () {
                                    var index = $(this).parent().closest("tr").index()
                                    var array = {
                                        ChargesUUID: $(this).val(),
                                        PortCode: getValues(`Charges[${index}][PortCode]`),
                                        CurrencyType: getValues(`Charges[${index}][CurrencyType]`),
                                        AccountCode: getValues(`Charges[${index}][AccountCode]`),
                                        VesselType: getValues(`Charges[${index}][VesselType]`),
                                        ContainerType: getValues(`Charges[${index}][ContainerType]`),
                                        UOM: getValues(`Charges[${index}][UOM][]`),
                                        ReferencePrice: getValues(`Charges[${index}][ReferencePrice]`),
                                        MinPrice: getValues(`Charges[${index}][MinPrice]`),
                                        TaxCode: getValues(`Charges[${index}][TaxCode]`),
                                        TaxRate: getValues(`Charges[${index}][TaxRate]`)
                                    }
                                    newCharges.push(array)
                                })

                                if (oriCharges.length == newCharges.length) {

                                    if (JSON.stringify(oriCharges) !== JSON.stringify(newCharges)) {
                                        madeChanged = true

                                    }

                                } else {

                                    setFlag(true)
                                    ControlOverlay(false)

                                    madeChanged = true
                                }
                                if (madeChanged !== true) {

                                    alert("No changes has been made.")
                                }
                            } else {

                                //clear all data inside modal before open
                                $(".tariff").html("");
                                $(".quotation").html("");
                                $(".bookingReservation").html("");
                                $(".salesInvoice").html("");

                                setFlag(false)
                                window.$('#affectedDocument').modal('toggle');
                                ControlOverlay(false)

                                if (res.data.Tariffs != null) {
                                    $.each(res.data.Tariffs, function (key, value) {
                                        $(".tariff").append("<div class='row'>&ensp;<input type='checkbox' class='checkboxTariffs'><div><input type = 'hidden' value = " + value.TariffUUID + "> &ensp;<a href='../../tariff/update/id=" + value.TariffUUID + "' class = 'checkPermissionLinkTariff' target='_blank'><span style='font-size: 15px'>" + value.pOLPortCode.PortCode + "-" + value.pODPortCode.PortCode + "</span></a></div></div>")
                                    });
                                }
                                if (res.data.Quotations != null) {
                                    $.each(res.data.Quotations, function (key, value) {
                                        if (value.Barge == 1) {
                                            $(".quotation").append("<div class='row'>&ensp;<input type='checkbox' class='checkboxQuotation'><input type = 'hidden' value = " + value.QuotationUUID + ">&ensp;<a href='../../../../sales/standard/quotation-barge/update/id=" + value.QuotationUUID + "' class = 'checkPermissionLinkQT' target='_blank'><span style='font-size: 15px'>" + value.DocNum + " </span></a></div>")
                                        } else {
                                            $(".quotation").append("<div class='row'>&ensp;<input type='checkbox' class='checkboxQuotation'><input type = 'hidden' value = " + value.QuotationUUID + ">&ensp;<a href='../../../../sales/container/quotation/update/id=" + value.QuotationUUID + "' class = 'checkPermissionLinkQT' target='_blank'><span style='font-size: 15px'>" + value.DocNum + " </span></a></div>")
                                        }
                                    });
                                }

                                if (res.data.BookingReservations != null) {
                                    $.each(res.data.BookingReservations, function (key, value) {
                                        if (value.Barge == 1) {
                                            $(".bookingReservation").append("<div class='row'>&ensp;<input type='checkbox' class='checkboxBR'><input type = 'hidden' value = " + value.BookingReservationUUID + "> &ensp;<a href='../../../../sales/standard/booking-reservation-barge/update/id=" + value.BookingReservationUUID + "' class = 'checkPermissionLinkBR' target='_blank'><span style='font-size: 15px'>" + value.DocNum + "</span></a></div>")
                                        } else {
                                            $(".bookingReservation").append("<div class='row'>&ensp;<input type='checkbox' class='checkboxBR'><input type = 'hidden' value = " + value.BookingReservationUUID + "> &ensp;<a href='../../../../sales/container/booking-reservation/update/id=" + value.BookingReservationUUID + "' class = 'checkPermissionLinkBR' target='_blank'><span style='font-size: 15px'>" + value.DocNum + "</span></a></div>")

                                        }
                                    });
                                }

                                if (res.data.SalesInvoices != null) {
                                    $.each(res.data.SalesInvoices, function (key, value) {
                                        if (value.Barge == 1) {
                                            $(".salesInvoice").append("<div class='row'>&ensp;<input type='checkbox' class='checkboxInvoice'><input type = 'hidden' value = " + value.SalesInvoiceUUID + "> &ensp;<a href='../../../../sales/standard/sales-invoice-barge/update/id=" + value.SalesInvoiceUUID + "' class = 'checkPermissionLinkINV' target='_blank'><span style='font-size: 15px'>" + value.DocNum + "</span></a></div>")
                                        } else {
                                            $(".salesInvoice").append("<div class='row'>&ensp;<input type='checkbox' class='checkboxInvoice'><input type = 'hidden' value = " + value.SalesInvoiceUUID + "> &ensp;<a href='../../../../sales/container/sales-invoice/update/id=" + value.SalesInvoiceUUID + "' class = 'checkPermissionLinkINV' target='_blank'><span style='font-size: 15px'>" + value.DocNum + "</span></a></div>")
                                        }
                                    });
                                }
                                $(".tariffCheckGroup").prop("checked", true);
                                $(".quotationCheckGroup").prop("checked", true);
                                $(".checkboxTariffs").prop("checked", true);
                                $(".checkboxQuotation").prop("checked", true);

                                //access control
                                // if (getQTViewPermission == false) {
                                //     $.each($(".checkPermissionLinkQT"), function () {
                                //         var oldherf = $(this).attr("href");
                                //         var newUrl = oldherf.replace(oldherf, "#"); // Create new url

                                //         $(this).attr("href", newUrl);
                                //         $(this).attr("class", "NoPermissionLink");
                                //         $(this).removeAttr("target");
                                //     })
                                // }
                                // if (getBRViewPermission == false) {
                                //     $.each($(".checkPermissionLinkBR"), function () {
                                //         var oldherf = $(this).attr("href");
                                //         var newUrl = oldherf.replace(oldherf, "#"); // Create new url

                                //         $(this).attr("href", newUrl);
                                //         $(this).attr("class", "NoPermissionLink");
                                //         $(this).removeAttr("target");
                                //     })
                                // }
                                // if (getINVViewPermission == false) {
                                //     $.each($(".checkPermissionLinkINV"), function () {
                                //         var oldherf = $(this).attr("href");
                                //         var newUrl = oldherf.replace(oldherf, "#"); // Create new url

                                //         $(this).attr("href", newUrl);
                                //         $(this).attr("class", "NoPermissionLink");
                                //         $(this).removeAttr("target");
                                //     })
                                // }
                                // if (getTariffViewPermission == false) {
                                //     $.each($(".checkPermissionLinkTariff"), function () {
                                //         var oldherf = $(this).attr("href");
                                //         var newUrl = oldherf.replace(oldherf, "#"); // Create new url

                                //         $(this).attr("href", newUrl);
                                //         $(this).attr("class", "NoPermissionLink");
                                //         $(this).removeAttr("target");
                                //     })
                                // }
                                $("select:disabled").prop('disabled', false)
                                $("input:disabled").prop('disabled', false)

                            }


                        })

                        if (madeChanged == true) {
                            $("select:disabled").prop('disabled', false)
                            $("input:disabled").prop('disabled', false)
                            setFlag(true)
                            ControlOverlay(false)
                        } else {
                            setFlag(false)
                            ControlOverlay(false)
                        }



                    } else {
                        setFlag(true)
                        ControlOverlay(false)
                    }

                }
            })

            // UpdateData(formState.id, globalContext, props.data.modelLink, formdata).then(res => {
            //     if (res.data.data) {
            //         ToastNotify("success", "Charges updated successfully.")
            //         navigate("/setting/sales-settings/charges/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })

            //     }
            //     else {
            //         ToastNotify("error", "Error")
            //         ControlOverlay(false)
            //     }
            // })

        }


    }

    useEffect(() => {
        $(".ContainerType").removeClass("Readonly")
        setValue("Charges[UOM][]", "")
        setValue("DynamicModel[UOM][]", "")

        trigger();
        reset()
        setCheckDisabledAllPort(true)
        $(".Ports").addClass('d-none')
        $(".notApplyAllport").removeClass('d-none')
        $("#applyToAllCheckbox").prop("disabled", false)
        setFoundEffected(false)

        setOriCharges([])
        toFourDecimalPlaces()

        $(".startDate").removeClass('pointerEventsStyle')
        $(".endDate").removeClass('pointerEventsStyle')




        initHoverSelectDropownTitle()
        GetAllDropDown(['CurrencyType', 'ChargesType', 'FreightTerm', 'ContainerType', 'VesselType', 'CurrencyType', 'TaxCode', 'Area'], globalContext).then(res => {
            var ArrayCurrencyType = [];
            var ArrayChargesType = [];
            var ArrayFreightTerm = [];
            var ArrayContainerType = [];
            var ArrayTaxCode = [];
            var ArrayPortCode = [];
            var ArrayVesselType = [];
            $.each(res.CurrencyType, function (key, value) {
                ArrayCurrencyType.push({ value: value.CurrencyTypeUUID, label: value.CurrencyName })
            })
            $.each(res.ChargesType, function (key, value) {
                ArrayChargesType.push({ value: value.ChargesTypeUUID, label: value.ChargesType })
            })
            $.each(res.FreightTerm, function (key, value) {
                ArrayFreightTerm.push({ value: value.FreightTermUUID, label: value.FreightTerm })
            })
            $.each(res.ContainerType, function (key, value) {
                ArrayContainerType.push({ value: value.ContainerTypeUUID, label: value.ContainerType })
            })
            $.each(res.TaxCode, function (key, value) {
                ArrayTaxCode.push({ value: value.TaxCodeUUID, label: value.TaxCode })
            })

            $.each(res.Area, function (key, value) {
                ArrayPortCode.push({ value: value.AreaUUID, label: value.PortCode })
            })

            $.each(res.VesselType, function (key, value) {
                ArrayVesselType.push({ value: value.VesselTypeUUID, label: value.VesselType })
            })



            setCurrencyType(sortArray(ArrayCurrencyType))
            setChargesType(sortArray(ArrayChargesType))
            setFreightTerm(sortArray(ArrayFreightTerm))
            setContainerType(sortArray(ArrayContainerType))
            setTaxCode(sortArray(ArrayTaxCode))
            setPort(sortArray(ArrayPortCode))
            setVesselType(sortArray(ArrayVesselType))

            var arrayDynamic = []
            var arrayOriCharges = []
            if (state) {
                if (state.formType == "Update" || state.formType == "Clone") {
                    ControlOverlay(true)
                    GetUpdateData(state.id, globalContext, props.data.modelLink).then(res => {
                        $.each(res.data.data, function (key, value) {
                            if (key == 0) {
                                $.each(value, function (key2, value2) {
                                    setValue('DynamicModel[' + key2 + ']', value2);

                                })

                                if( state.formType !== "Clone"){
                                    if(value.AccessPort){
                                        setValue('DynamicModel[AccessPort][]', value.AccessPort.split(","));
                                    }else{
                                        setValue('DynamicModel[AccessPort][]', value.AccessPort);
                                    }
                                }

                                if (value.VerificationStatus == "Pending") {
                                    $(".VerificationStatusField").text("Draft")
                                    $(".VerificationStatusField").removeClass("text-danger")
                                } else if (value.VerificationStatus == "Rejected") {
                                    $(".VerificationStatusField").text("Rejected")
                                    $(".VerificationStatusField").addClass("text-danger")
                                }
                                if (value.Floating == 1) {
                                    $(".startDate").addClass('pointerEventsStyle')
                                    $(".endDate").addClass('pointerEventsStyle')
                                } else {
                                    $(".startDate").removeClass('pointerEventsStyle')
                                    $(".endDate").removeClass('pointerEventsStyle')
                                }
                                $(".VerificationStatusField").last().addClass("d-none")
                                if (value.UOM) {


                                    setValue("DynamicModel[UOM][]", (value.UOM).split(','))

                                }
                                value.Floating == 0 ? $(".floatingCheckbox").prop("checked", false) : $(".floatingCheckbox").prop("checked", true)
                                value.Valid == 0 ? $(".validCheckbox").prop("checked", false) : $(".validCheckbox").prop("checked", true)




                                if (value.PortCode == "" || value.PortCode == null) {

                                    unregister('DynamicModel.ApplyToAllPort', { keepDefaultValue: false })
                                    setValue("DynamicModel[ApplyToAllPort]", "0")
                                    unregister('DynamicModel.ChargesCode');
                                    clearErrors('DynamicModel.UOM')
                                    // unregister('DynamicModel.UOM');
                                    unregister('DynamicModel.ReferencePrice');

                                    $(".applyToAllCheckbox").prop("checked", true)
                                    setValue("DynamicModel[ApplyToAllPort]", 1)



                                }
                                else {
                                    $(".applyToAllCheckbox").prop("checked", false)

                                    setCheckDisabledAllPort(false)

                                    unregister('DynamicModel.ChargesCode');
                                    unregister('DynamicModel.UOM');
                                    clearErrors('DynamicModel.UOM')
                                    // setValue("DynamicModel[ChargesUUID]", "")
                                    setValue("DynamicModel[ContainerType]", "")
                                    setValue("DynamicModel[UOM][]", "")
                                    setValue("DynamicModel[CurrencyType]", "")
                                    setValue("DynamicModel[VesselType]", "")
                                    setValue("DynamicModel[AccountCode]", "")
                                    setValue("DynamicModel[ReferencePrice]", "")
                                    setValue("DynamicModel[MinPrice]", "")
                                    setValue("DynamicModel[TaxCode]", "")
                                    setValue("DynamicModel[TaxRate]", "")
                                    $(".notApplyAllport").addClass("d-none")
                                    // unregister('Charges.UOM');

                                    setValue("DynamicModel[ApplyToAllPort]", 0)

                                    unregister('DynamicModel.ReferencePrice');
                                    clearErrors('DynamicModel.ReferencePrice')

                                }
                            }

                        })

                        if (res.data.data[0].PortCode !== "" && res.data.data[0].PortCode !== null) {

                            if (res.data.data.length > 0) {
                                $(".applyToAllCheckbox").prop("checked", false);
                                $(".Ports").removeClass('d-none')

                                $.each(res.data.data, function (key, value) {
                                    arrayOriCharges.push({
                                        ChargesUUID: value.ChargesUUID,
                                        PortCode: value.PortCode,
                                        CurrencyType: value.CurrencyType,
                                        AccountCode: value.AccountCode,
                                        VesselType: value.VesselType,
                                        ContainerType: value.ContainerType,
                                        UOM: (value.UOM).split(","),
                                        ReferencePrice: value.ReferencePrice,
                                        MinPrice: value.MinPrice,
                                        TaxCode: value.TaxCode,
                                        TaxRate: value.TaxRate
                                    })
                                    arrayDynamic.push(value);
                                    value.UOM = (value.UOM).split(",")
                                    remove()
                                    append(arrayDynamic)

                                })
                                setOriCharges(arrayOriCharges)

                            }

                        }
                        var arrayCharges = [];
                        if (res.data.data[0].PortCode == "" || res.data.data[0].PortCode == null) {
                            var chargesuuid = state.id

                            arrayCharges.push({
                                "ChargesUUID": chargesuuid,
                                "ChargesCode": $(".ChargesCode").val(),
                                "ChargesName": getValues("DynamicModel[ChargesName]"),
                                "ChargesType": getValues("DynamicModel[ChargesType]"),
                                "ContainerType": getValues("DynamicModel[ContainerType]"),
                                "FreightTerm": getValues("DynamicModel[FreightTerm]"),
                                "StartDate": getValues("DynamicModel[StartDate]"),
                                "EndDate": getValues("DynamicModel[EndDate]"),
                                "UOM": getValues("DynamicModel[UOM][]"),
                                "CurrencyType": getValues("DynamicModel[CurrencyType]"),
                                "AccountCode": getValues("DynamicModel[AccountCode]"),
                                "VesselType": getValues("DynamicModel[VesselType]"),
                                "ReferencePrice": $(".referencePrice").val(),
                                "MinPrice": getValues("DynamicModel[MinPrice]"),
                                "TaxCode": getValues("DynamicModel[TaxCode]"),
                                "TaxRate": getValues("DynamicModel[TaxRate]"),
                                "Description": getValues("DynamicModel[Description]"),
                            })

                        } else {
                            var tempArray = []
                            $.each(res.data.data, function (key, value) {

                                tempArray.push(value.ChargesUUID)
                                arrayCharges.push({
                                    "ChargesUUID": value.ChargesUUID,
                                    "ChargesCode": value.ChargesCode,
                                    "ChargesName": value.ChargesName,
                                    "ChargesType": value.ChargesType,
                                    "ContainerType": value.ContainerType,
                                    "FreightTerm": value.FreightTerm,
                                    "StartDate": value.StartDate,
                                    "EndDate": value.EndDate,
                                    "UOM": (value.UOM),
                                    "CurrencyType": value.CurrencyType,
                                    "AccountCode": value.AccountCode,
                                    "VesselType": value.VesselType,
                                    "ReferencePrice": value.ReferencePrice,
                                    "MinPrice": value.MinPrice,
                                    "TaxCode": value.TaxCode,
                                    "TaxRate": value.TaxRate,
                                    "Description": value.Description
                                })

                            })
                            setNotApplytoAllPortArrayList(tempArray)


                        }
                        if(state.formType!=="Clone"){
                            getEffectedDocuments(arrayCharges, globalContext).then(res => {
                                if (res.data.Quotations != "" || res.data.BookingReservations != "" || res.data.SalesInvoices != "" || res.data.Tariffs != "") {
                                    $("#applyToAllCheckbox").attr("disabled", true);
                                    if (state.formType !== "Clone") {
                                        $(".ContainerType").addClass("Readonly")
                                    }
                                    setFoundEffected(true)
    
                                } else {
                                    $("#applyToAllCheckbox").attr("disabled", false);
                                    $(".ContainerType").removeClass("Readonly")
    
                                }
                                $.each(res.data.CheckCharges, function (key, value) {
                                    $(".PortCode").each(function () {
    
                                        if (value.PortCode == $(this).find(":hidden").val()) {
                                            if (value.bookingReservationCharges != "" || value.quotationCharges != "" || value.salesInvoiceHasCharges != "" || value.tariffHasContainerTypeCharges != "") {
                                                $(this).addClass("Readonly")
                                                $(this).parent().closest("tr").find(".remove-container").prop("disabled", true)
                                                $(this).parent().closest("tr").find(".ChargesUUID").addClass("EffectedPortCode")
    
                                                setFoundEffected(true)
                                            }
                                        }
                                    });
                                });
                            })
                        }   

                    

                        ControlOverlay(false)
                    })


                }
            } else {
                ControlOverlay(true)
                GetUpdateData(params.id, globalContext, props.data.modelLink).then(res => {
                    $.each(res.data.data, function (key, value) {
                        if (key == 0) {
                            $.each(value, function (key2, value2) {
                                setValue('DynamicModel[' + key2 + ']', value2);
                            })
                            if(value.AccessPort){
                                setValue('DynamicModel[AccessPort][]', value.AccessPort.split(","));
                            }else{
                                setValue('DynamicModel[AccessPort][]', value.AccessPort);
                            }
                            if (value.VerificationStatus == "Pending") {
                                $(".VerificationStatusField").text("Draft")
                                $(".VerificationStatusField").removeClass("text-danger")
                            } else if (value.VerificationStatus == "Rejected") {
                                $(".VerificationStatusField").text("Rejected")
                                $(".VerificationStatusField").addClass("text-danger")
                            }
                            if (value.Floating == 1) {
                                $(".startDate").addClass('pointerEventsStyle')
                                $(".endDate").addClass('pointerEventsStyle')
                            } else {
                                $(".startDate").removeClass('pointerEventsStyle')
                                $(".endDate").removeClass('pointerEventsStyle')
                            }

                            $(".VerificationStatusField").last().addClass("d-none")
                            if (value.UOM) {


                                setValue("DynamicModel[UOM][]", (value.UOM).split(','))

                            }
                            value.Floating == 0 ? $(".floatingCheckbox").prop("checked", false) : $(".floatingCheckbox").prop("checked", true)
                            value.Valid == 0 ? $(".validCheckbox").prop("checked", false) : $(".validCheckbox").prop("checked", true)




                            if (value.PortCode == "" || value.PortCode == null) {

                                unregister('DynamicModel.ApplyToAllPort', { keepDefaultValue: false })
                                setValue("DynamicModel[ApplyToAllPort]", "0")
                                unregister('DynamicModel.ChargesCode');
                                clearErrors('DynamicModel.UOM')
                                // unregister('DynamicModel.UOM');
                                unregister('DynamicModel.ReferencePrice');

                                $(".applyToAllCheckbox").prop("checked", true)
                                setValue("DynamicModel[ApplyToAllPort]", 1)



                            }
                            else {
                                $(".applyToAllCheckbox").prop("checked", false)

                                setCheckDisabledAllPort(false)

                                unregister('DynamicModel.ChargesCode');
                                clearErrors('DynamicModel.UOM')
                                // setValue("DynamicModel[ChargesUUID]", "")
                                setValue("DynamicModel[ContainerType]", "")
                                setValue("DynamicModel[UOM][]", "")
                                setValue("DynamicModel[CurrencyType]", "")
                                setValue("DynamicModel[VesselType]", "")
                                setValue("DynamicModel[AccountCode]", "")
                                setValue("DynamicModel[ReferencePrice]", "")
                                setValue("DynamicModel[MinPrice]", "")
                                setValue("DynamicModel[TaxCode]", "")
                                setValue("DynamicModel[TaxRate]", "")
                                $(".notApplyAllport").addClass("d-none")
                                // unregister('Charges.UOM');

                                setValue("DynamicModel[ApplyToAllPort]", 0)

                                unregister('DynamicModel.ReferencePrice');
                                clearErrors('DynamicModel.ReferencePrice')

                            }
                        }

                    })

                    if (res.data.data[0].PortCode !== "" && res.data.data[0].PortCode !== null) {

                        if (res.data.data.length > 0) {
                            $(".applyToAllCheckbox").prop("checked", false);
                            $(".Ports").removeClass('d-none')

                            $.each(res.data.data, function (key, value) {
                                arrayOriCharges.push({
                                    ChargesUUID: value.ChargesUUID,
                                    PortCode: value.PortCode,
                                    CurrencyType: value.CurrencyType,
                                    AccountCode: value.AccountCode,
                                    VesselType: value.VesselType,
                                    ContainerType: value.ContainerType,
                                    UOM: (value.UOM).split(","),
                                    ReferencePrice: value.ReferencePrice,
                                    MinPrice: value.MinPrice,
                                    TaxCode: value.TaxCode,
                                    TaxRate: value.TaxRate
                                })
                                arrayDynamic.push(value);
                                value.UOM = (value.UOM).split(",")
                                remove()
                                append(arrayDynamic)

                            })
                            setOriCharges(arrayOriCharges)
                        }

                    }
                    var arrayCharges = [];
                    if (res.data.data[0].PortCode == "" || res.data.data[0].PortCode == null) {
                        var chargesuuid = params.id

                        arrayCharges.push({
                            "ChargesUUID": chargesuuid,
                            "ChargesCode": $(".ChargesCode").val(),
                            "ChargesName": getValues("DynamicModel[ChargesName]"),
                            "ChargesType": getValues("DynamicModel[ChargesType]"),
                            "ContainerType": getValues("DynamicModel[ContainerType]"),
                            "FreightTerm": getValues("DynamicModel[FreightTerm]"),
                            "StartDate": getValues("DynamicModel[StartDate]"),
                            "EndDate": getValues("DynamicModel[EndDate]"),
                            "UOM": getValues("DynamicModel[UOM][]"),
                            "CurrencyType": getValues("DynamicModel[CurrencyType]"),
                            "AccountCode": getValues("DynamicModel[AccountCode]"),
                            "VesselType": getValues("DynamicModel[VesselType]"),
                            "ReferencePrice": $(".referencePrice").val(),
                            "MinPrice": getValues("DynamicModel[MinPrice]"),
                            "TaxCode": getValues("DynamicModel[TaxCode]"),
                            "TaxRate": getValues("DynamicModel[TaxRate]"),
                            "Description": getValues("DynamicModel[Description]"),
                        })

                    } else {
                        var tempArray = []
                        $.each(res.data.data, function (key, value) {
                            arrayCharges.push({
                                "ChargesUUID": value.ChargesUUID,
                                "ChargesCode": value.ChargesCode,
                                "ChargesName": value.ChargesName,
                                "ChargesType": value.ChargesType,
                                "ContainerType": value.ContainerType,
                                "FreightTerm": value.FreightTerm,
                                "StartDate": value.StartDate,
                                "EndDate": value.EndDate,
                                "UOM": (value.UOM).split(","),
                                "CurrencyType": value.CurrencyType,
                                "AccountCode": value.AccountCode,
                                "VesselType": value.VesselType,
                                "ReferencePrice": value.ReferencePrice,
                                "MinPrice": value.MinPrice,
                                "TaxCode": value.TaxCode,
                                "TaxRate": value.TaxRate,
                                "Description": value.Description
                            })

                        })
                        setNotApplytoAllPortArrayList(tempArray)

                    }


                    getEffectedDocuments(arrayCharges, globalContext).then(res => {
                        if (res.data.Quotations != "" || res.data.BookingReservations != "" || res.data.SalesInvoices != "" || res.data.Tariffs != "") {
                            $("#applyToAllCheckbox").attr("disabled", true);

                            $(".ContainerType").addClass("Readonly")
                            setFoundEffected(true)
                        } else {
                            $("#applyToAllCheckbox").attr("disabled", false);

                            $(".ContainerType").removeClass("Readonly")
                        }
                        $.each(res.data.CheckCharges, function (key, value) {
                            $(".PortCode").each(function () {

                                if (value.PortCode == $(this).find(":hidden").val()) {
                                    if (value.bookingReservationCharges != "" || value.quotationCharges != "" || value.salesInvoiceHasCharges != "" || value.tariffHasContainerTypeCharges != "") {
                                        $(this).addClass("Readonly")
                                        $(this).parent().closest("tr").find(".remove-container").prop("disabled", true)
                                        $(this).parent().closest("tr").find(".ChargesUUID").addClass("EffectedPortCode")

                                        setFoundEffected(true)
                                    }
                                }
                            });
                        });
                    })



                    ControlOverlay(false)




                })
            }

            return () => {

            }

        })
    }, [state])

    useEffect(() => {
        if (state == null) {
            trigger()
            setFormState({ formType: "Update", id: params.id })
        }
        else {
            trigger()
            setFormState(state)
        }
        return () => {

        }
    }, [state])


    $('.validCheckbox').unbind('change').bind('change', function () {
        if ($(this).prop("checked")) {
            setValue("DynamicModel[Valid]", "1")
        } else {
            setValue("DynamicModel[Valid]", "0")
        }


    });

    const handleSubmitForm = (e) => {
        handleSubmit(onSubmit)(e);
      };

    return (
        <form>
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title='Charges' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="Charges" model="charges" selectedId="ChargesUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='Charges' data={props} />}
            <div className="col-md-12">
                <div className="card card-primary">
                    <div className="card-header">Charges Form</div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-xs-12 col-md-1">
                                <div className="form-group mt-4 mb-1">
                                    <input type="checkbox" className="applyToAllCheckbox" id="applyToAllCheckbox" defaultChecked onChange={handleApplyAllPort} />
                                    <input type="text" className="form-control d-none ApplyToAllField" defaultValue='1' {...register('DynamicModel[ApplyToAllPort]')} />
                                    <label className="control-label ml-2" htmlFor='applyToAllCheckbox'>Apply To All Port</label>
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-1">
                                <div className="form-group mt-4 mb-1">
                                    <input type="checkbox" className="floatingCheckbox" id="floatingCheckbox" onChange={handleFloating} />
                                    <input type="text" className="form-control d-none FloatingField" defaultValue='0' {...register('DynamicModel[Floating]')} />
                                    <label className="control-label ml-2" htmlFor='floatingCheckbox'>Floating</label>
                                </div>
                            </div>

                        </div>
                        <div className="row">

                            <div className="row col-xs-12 col-md-12">
                                <div className="col-xs-12 col-md-2">
                                    <div className="form-group">
                                        <label className={`control-label ${errors.DynamicModel ? errors.DynamicModel.ChargesCode ? "has-error-label" : "" : ""}`}>Charges Code</label>
                                        {checkDisabledAllPort == true ?
                                            <input defaultValue='' {...register("DynamicModel[ChargesCode]", { required: "Charges Code cannot be blank." })} className={`form-control ChargesCode ${errors.DynamicModel ? errors.DynamicModel.ChargesCode ? "has-error" : "" : ""}`} /> :
                                            <input defaultValue='' {...register("DynamicModel[ChargesCode]")} className={`form-control ChargesCode ${errors.DynamicModel ? errors.DynamicModel.ChargesCode ? "has-error" : "" : ""}`} />
                                        }

                                        <p>{errors.DynamicModel ? errors.DynamicModel.ChargesCode && <span style={{ color: "#A94442" }}>{errors.DynamicModel.ChargesCode.message}</span> : ""}</p>
                                    </div>
                                </div>

                                <div className="col-xs-12 col-md-2">
                                    <div className="form-group">
                                        <label className="control-label">Charges Name</label>

                                        <input defaultValue='' {...register("DynamicModel[ChargesName]")} className={`form-control`} />
                                    </div>
                                </div>



                                <div className="col-xs-12 col-md-2">
                                    <div className="form-group">
                                        <label className="control-label" >Charges Type
                                        </label>
                                        <Controller
                                            name="DynamicModel[ChargesType]"
                                            id="ChargesType"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <Select
                                                    isClearable={true}
                                                    {...register("DynamicModel[ChargesType]")}
                                                    value={value ? chargesType.find(c => c.value === value) : null}
                                                    onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                    options={chargesType}
                                                    className="form-control size"
                                                    classNamePrefix="select"
                                                    styles={globalContext.customStyles}

                                                />
                                            )}
                                        />
                                    </div>
                                </div>


                                <div className="col-xs-12 col-md-2">
                                    <div className="form-group">
                                        <label className="control-label" >Freight Term
                                        </label>
                                        <Controller
                                            name="DynamicModel[FreightTerm]"
                                            id="FreightTerm"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <Select
                                                    isClearable={true}
                                                    {...register("DynamicModel[FreightTerm]")}
                                                    value={value ? freightTerm.find(c => c.value === value) : null}
                                                    onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                    options={freightTerm}
                                                    className="form-control FreightTerm"
                                                    classNamePrefix="select"
                                                    styles={globalContext.customStyles}

                                                />
                                            )}
                                        />
                                    </div>
                                </div>


                                <div className="col-xs-12 col-md-1">
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
                                                        className="form-control startDate"
                                                        options={{
                                                            dateFormat: "d/m/Y"
                                                        }}

                                                    />
                                                </>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="col-xs-12 col-md-1">
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
                                                        className="form-control startDate"
                                                        options={{
                                                            dateFormat: "d/m/Y"
                                                        }}

                                                    />
                                                </>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="col-xs-12 col-md-2">
                                <div className="form-group">

                                    <label className={`control-label`} >Access Port</label>
                                    <Controller
                                    name={`DynamicModel[AccessPort][]`}
                                    control={control}
                                    defaultValue={DefaultUserPort}
                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            isClearable={true}
                                            isMulti
                                            defaultValue={DefaultUserPort}
                                            name={`DynamicModel[AccessPort][]`}
                                            value={
                                                value
                                                    ? Array.isArray(value)
                                                        ? value.map((c) =>
                                                           port.find((z) => z.value === c)
                                                        )
                                                        : port.find(
                                                            (c) => c.value === value
                                                        )
                                                    : null
                                            }
                                            onChange={(val) =>
                                                val == null
                                                    ? onChange(null)
                                                    : onChange(val.map((c) => c.value))
                                            }
                                            options={port}
                                            className="basic-multiple-select AccessPort"
                                            classNamePrefix="select"
                                            styles={globalContext.customStyles}
                                        />
                                    )}
                                />
                                </div>
                            </div>
                            </div>
                            <div className="row notApplyAllport col-xs-12 col-md-12">
                                <div className="col-xs-12 col-md-1">
                                    <div className="form-group">
                                        <label className="control-label" >Container Type
                                        </label>
                                        <Controller
                                            name="DynamicModel[ContainerType]"
                                            id="ContainerType"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <Select
                                                    isClearable={true}
                                                    {...register("DynamicModel[ContainerType]")}
                                                    value={value ? containerType.find(c => c.value === value) : null}
                                                    onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                    options={containerType}
                                                    className="form-control ContainerType"
                                                    classNamePrefix="select"
                                                    styles={globalContext.customStyles}
                                                    onKeyDown={handleKeydown}

                                                />
                                            )}
                                        />
                                    </div>
                                </div>



                                <div className="col-xs-12 col-md-2">
                                    <div className="form-group">

                                        <label className={`control-label ${errors.DynamicModel ? errors.DynamicModel.UOM ? "has-error-label" : "" : ""}`} >UOM</label>
                                        {checkDisabledAllPort == true ? <Controller
                                            name="DynamicModel[UOM][]"
                                            control={control}

                                            render={({ field: { onChange, value } }) => (

                                                <Select
                                                    isClearable={true}
                                                    isMulti
                                                    {...register("DynamicModel[UOM][]", { required: "UOM cannot be blank." })}
                                                    value={
                                                        value
                                                            ? Array.isArray(value)
                                                                ? value.map((c) =>
                                                                    UOMOptions.find((z) => z.value === c)
                                                                )
                                                                : UOMOptions.find(
                                                                    (c) => c.value === value
                                                                )
                                                            : null
                                                    }
                                                    onChange={(val) =>
                                                        val == null
                                                            ? onChange(null)
                                                            : onChange(val.map((c) => c.value))
                                                    }
                                                    options={UOMOptions}
                                                    className={`basic-multiple-select ${errors.DynamicModel ? errors.DynamicModel.UOM ? "has-error-select" : "" : ""}`}
                                                    classNamePrefix="select"
                                                    styles={globalContext.customStyles}
                                                />
                                            )}
                                        /> :
                                            <Controller
                                                name="DynamicModel[UOM][]"
                                                control={control}

                                                render={({ field: { onChange, value } }) => (

                                                    <Select
                                                        isClearable={true}
                                                        isMulti
                                                        {...register("DynamicModel[UOM][]")}
                                                        value={
                                                            value
                                                                ? Array.isArray(value)
                                                                    ? value.map((c) =>
                                                                        UOMOptions.find((z) => z.value === c)
                                                                    )
                                                                    : UOMOptions.find(
                                                                        (c) => c.value === value
                                                                    )
                                                                : null
                                                        }
                                                        onChange={(val) =>
                                                            val == null
                                                                ? onChange(null)
                                                                : onChange(val.map((c) => c.value))
                                                        }
                                                        options={UOMOptions}
                                                        className={`basic-multiple-select ${errors.DynamicModel ? errors.DynamicModel.UOM ? "has-error-select" : "" : ""}`}
                                                        classNamePrefix="select"
                                                        styles={globalContext.customStyles}
                                                    />
                                                )}
                                            />}

                                        <p>{errors.DynamicModel ? errors.DynamicModel.UOM && <span style={{ color: "#A94442" }}>{errors.DynamicModel.UOM.message}</span> : ""}</p>
                                    </div>
                                </div>


                                <div className="col-xs-12 col-md-1">
                                    <div className="form-group">
                                        <label className="control-label" >Currency Type
                                        </label>
                                        <Controller
                                            name="DynamicModel[CurrencyType]"
                                            id="CurrencyType"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <Select
                                                    isClearable={true}
                                                    {...register("DynamicModel[CurrencyType]")}
                                                    value={value ? currencyType.find(c => c.value === value) : null}
                                                    onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                    options={currencyType}
                                                    className="form-control size"
                                                    classNamePrefix="select"
                                                    styles={globalContext.customStyles}

                                                />
                                            )}
                                        />
                                    </div>
                                </div>



                                <div className="col-xs-12 col-md-1">
                                    <div className="form-group">
                                        <label className="control-label" >Vessel Type
                                        </label>
                                        <Controller
                                            name="DynamicModel[VesselType]"
                                            id="VesselType"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <Select
                                                    isClearable={true}
                                                    {...register("DynamicModel[VesselType]")}
                                                    value={value ? vesselType.find(c => c.value === value) : null}
                                                    onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                    options={vesselType}
                                                    className="form-control size"
                                                    classNamePrefix="select"
                                                    styles={globalContext.customStyles}

                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="col-xs-12 col-md-1">
                                    <div className="form-group">
                                        <label className="control-label">GL Code</label>

                                        <input defaultValue='' {...register("DynamicModel[AccountCode]")} className={`form-control`} />
                                    </div>
                                </div>


                                <div className="col-xs-12 col-md-1">
                                    <div className="form-group">
                                        <label className={`control-label ${errors.DynamicModel ? errors.DynamicModel.ReferencePrice ? "has-error-label" : "" : ""}`}>Reference Price</label>
                                        {checkDisabledAllPort == true ?
                                            <input defaultValue='' {...register("DynamicModel[ReferencePrice]", { required: "Reference Price cannot be blank." })} className={`form-control inputDecimalFourPlaces referencePrice ${errors.DynamicModel ? errors.DynamicModel.ReferencePrice ? "has-error" : "" : ""}`} />
                                            : <input    {...register("DynamicModel[ReferencePrice]")} className={`form-control inputDecimalFourPlaces referencePrice ${errors.DynamicModel ? errors.DynamicModel.ReferencePrice ? "has-error" : "" : ""}`} />
                                        }
                                        <p>{errors.DynamicModel ? errors.DynamicModel.ReferencePrice && <span style={{ color: "#A94442" }}>{errors.DynamicModel.ReferencePrice.message}</span> : ""}</p>
                                    </div>
                                </div>


                                <div className="col-xs-12 col-md-1">
                                    <div className="form-group">
                                        <label className="control-label">Min Price</label>

                                        <input defaultValue='' {...register("DynamicModel[MinPrice]")} className={`form-control minPrice inputDecimalFourPlaces`} />
                                    </div>
                                </div>



                                <div className="col-xs-12 col-md-2">
                                    <div className="form-group">
                                        <label className="control-label" >Tax Code
                                        </label>
                                        <Controller
                                            name="DynamicModel[TaxCode]"
                                            id="TaxCode"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <Select
                                                    isClearable={true}
                                                    {...register("DynamicModel[TaxCode]")}
                                                    value={value ? taxCode.find(c => c.value === value) : null}
                                                    onChange={val => { val == null ? onChange(null) : onChange(val.value); handleTaxCode(val) }}
                                                    options={taxCode}
                                                    className="form-control TaxCode"
                                                    classNamePrefix="select"
                                                    styles={globalContext.customStyles}

                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="col-xs-12 col-md-2">
                                    <div className="form-group">
                                        <label className="control-label">Tax Rate</label>

                                        <input defaultValue='' {...register("DynamicModel[TaxRate]")} className={`form-control inputDecimalFourPlaces`} />
                                    </div>
                                </div>
                            </div>
                            <div className="row  col-xs-12 col-md-12">
                                <div className="col-xs-12 col-md-12">
                                    <div className="form-group">
                                        <label className="control-label">Description</label>

                                        <textarea defaultValue='' {...register("DynamicModel[Description]")} className={`form-control`} />
                                    </div>
                                </div>

                            </div>

                            {portCard()}

                            <div className="col-xs-12 col-md-3 mt-2">
                                <div className="form-group mt-4 mb-1">
                                    <input type="checkbox" className="validCheckbox" id="validCheckbox" defaultChecked />
                                    <input type="text" className="form-control d-none" defaultValue='1' {...register('DynamicModel[Valid]')} />
                                    <label className="control-label ml-2" htmlFor='validCheckbox'>Valid</label>
                                </div>
                            </div>
                            {AfftedDocumenModal()}




                        </div>


                    </div>




                </div>




            </div>
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title='Charges' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="Charges" model="charges" selectedId="ChargesUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='Charges' data={props} />}


        </form>



    )
}






export default Form