import React, { useState, useEffect, useContext } from 'react'
import Select from 'react-select'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext"
import $ from "jquery";

function AccessControl(props) {

    const globalContext = useContext(GlobalContext);
    const { register, handleSubmit, setValue, getValues, reset, control, watch, formState: { errors } } = useForm({});

    const [port, setPort] = useState([])

    const scopeOption = [
        {
            "value": "PERSONAL",
            "label": "PERSONAL"
        },
        {
            "value": "BRANCH",
            "label": "BRANCH"
        },

    ]

    const freightTermOption = [
        {
            "value": "FREIGHT PREPAID",
            "label": "FREIGHT PREPAID"
        },
        {
            "value": "FREIGHT COLLECT",
            "label": "FREIGHT COLLECT"
        },
        {
            "value": "ALL",
            "label": "ALL"
        },
    ]

    useEffect(() => {
        setPort(props.portOption)
        setValue("AccessControl[Scope]", props.data.scope)
        setValue("AccessControl[FreightTerm]", props.data.freightTerm)
        setValue("AccessControl[Port][]", props.data.port)
        return () => {

        }
    }, [props])



    function handleChangeScope(val) {
        if (val == "BRANCH") {
            $('.portField').removeClass("d-none")
        }
        else {
            $('.portField').addClass("d-none")
        }
    }

    $('td').off("dblclick").on("dblclick",function () {
        if ($(this).children().hasClass("ChildDisplay")) {
            var text = $(this).text().toLowerCase();
            var OneWordText = text.replace(/ /g,'')
            var trimText = $.trim(OneWordText);
            if ($("#AccessControlTable").find("." + trimText + "-child").find("[type='checkbox']:checked").length >= 1) {
            $("#AccessControlTable").find("." + trimText + "-child").find("[type='checkbox']").prop("checked", false)
            }
            else {
            $("#AccessControlTable").find("." + trimText + "-child").find("[type='checkbox']").prop("checked", true)
            }


        }
        else {
            if ($(this).closest("tr").find("[type='checkbox']:checked").length >= 1) {
            $(this).closest("tr").find("[type='checkbox']").prop("checked", false)
            }
            else {
            $(this).closest("tr").find("[type='checkbox']").prop("checked", true)
            }

        }

    });


    $('.ChildDisplay').off('click').on("click",function() {
        var icon = $(this).find("i");
        if ($(this).closest("tr").next().hasClass("d-none")) {
            icon.addClass("fa fa-minus").removeClass("fa fa-plus");
            $(this).closest("tr").next().removeClass('d-none');
        } else {
            icon.addClass("fa fa-plus").removeClass("fa fa-minus");
            $(this).closest("tr").next().addClass('d-none');
        }
    });

    return (
        <div>

            <div className="row">
                <div className="form-group custom-control-inline">
                    <label className="control-label">Scope</label>
                </div>
                <div className="form-group col-xs-12 col-md-2">
                    <Controller
                        name="AccessControl[Scope]"
                        id="Scope"
                        control={control}

                        render={({ field: { onChange, value } }) => (
                            <Select
                                name="AccessControl[Scope]"
                                value={value ? scopeOption.find(c => c.value === value) : null}
                                onChange={val => { val == null ? onChange(null) : onChange(val.value); handleChangeScope(val.value) }}
                                isClearable={true}
                                options={scopeOption}
                                className="basic-single Scope"
                                classNamePrefix="select"
                                styles={globalContext.customStyles}
                            />
                        )}
                    />

                </div>
                <div className="form-group custom-control-inline">
                    <label className="control-label">Freight Term</label>
                </div>
                <div className="form-group col-xs-12 col-md-2">
                    <Controller
                        name="AccessControl[FreightTerm]"
                        id="FreightTerm"
                        control={control}

                        render={({ field: { onChange, value } }) => (
                            <Select
                                name="AccessControl[FreightTerm]"
                                value={value ? freightTermOption.find(c => c.value === value) : null}
                                onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                isClearable={true}
                                options={freightTermOption}
                                className="basic-single"
                                classNamePrefix="select"
                                styles={globalContext.customStyles}
                            />
                        )}
                    />
                </div>
            </div>



            <div className="row">

                <div className="form-group custom-control-inline">
                    <label className="control-label">Port</label>
                </div>
                <div className="form-group col-xs-12 col-md-11">
                    <Controller
                         name="AccessControl[Port][]"
                         id="Port"
                         control={control}
                         render={({ field: { onChange, value } }) => (
                             <Select
                                 isClearable={true}
                                 isMulti
                                 name="AccessControl[Port][]"
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
                                 className="basic-multiple-select Port"
                                 classNamePrefix="select"
                                 styles={globalContext.customStyles}
                             />
                         )}
                    />
                </div>

          
            </div>
            <div>
                <table style={{ "width": "100%" }} className="table table-bordered table-responsive" id="AccessControlTable">
                    <thead>
                        <tr>
                            <th width="10%" rowSpan="2" style={{ "textAlign": "center", "verticalAlign": "middle" }}>Description</th>
                            <th width="4%" rowSpan="2 " style={{ "textAlign": "center", "verticalAlign": "middle" }}>View</th>
                            <th colSpan="16" style={{ "textAlign": "center", "verticalAlign": "middle" }}>Action</th>
                            <th colSpan="1" style={{ "textAlign": "center", "verticalAlign": "middle" }}>PDF</th>
                            <th style={{ "textAlign": "center" }}>Table Listing</th>
                            <th colSpan="2" style={{ "textAlign": "center", "verticalAlign": "middle" }}>Dagangnet</th>
                            <th style={{ "textAlign": "center" }}>Track Gateway</th>

                        </tr>
                        <tr>
                            {/* <!-- action --> */}
                            <th width="4%" style={{ "textAlign": "center", "verticalAlign": "middle" }}>New</th>
                            <th width="4%" style={{ "textAlign": "center", "verticalAlign": "middle" }}>Edit</th>
                            <th width="4%" style={{ "textAlign": "center", "verticalAlign": "middle" }}>Trash</th>
                            <th width="4%" style={{ "textAlign": "center", "verticalAlign": "middle" }}>Delete</th>
                            <th width="4%" style={{ "textAlign": "center", "verticalAlign": "middle" }}>Verify</th>
                            <th width="4%" style={{ "textAlign": "center", "verticalAlign": "middle" }}>View Charges</th>
                            <th width="4%" style={{ "textAlign": "center", "verticalAlign": "middle" }}>Confirm</th>
                            <th width="4%" style={{ "textAlign": "center", "verticalAlign": "middle" }}>Transfer From</th>
                            <th width="4%" style={{ "textAlign": "center", "verticalAlign": "middle" }}>Transfer To</th>
                            <th width="4%" style={{ "textAlign": "center", "verticalAlign": "middle" }}>Merge</th>
                            <th width="4%" style={{ "textAlign": "center", "verticalAlign": "middle" }}>Split</th>
                            <th width="4%" style={{ "textAlign": "center", "verticalAlign": "middle" }}>Revert</th>
                            <th width="4%" style={{ "textAlign": "center", "verticalAlign": "middle" }}>TransferVoyage</th>
                            <th width="4%" style={{ "textAlign": "center", "verticalAlign": "middle" }}>Telex Release</th>
                            <th width="4%" style={{ "textAlign": "center", "verticalAlign": "middle" }}>View All</th>
                            <th width="4%" style={{ "textAlign": "center", "verticalAlign": "middle" }}>Replace</th>
                            {/* <!-- report --> */}
                            <th width="4%" style={{ "textAlign": "center", "verticalAlign": "middle" }}>Preview/ Download/ Print</th>
                            {/* <!-- table listing --> */}
                            <th width="4%" style={{ "textAlign": "center", "verticalAlign": "middle" }}>Export Data</th>
                            {/* <!-- dagangnet --> */}
                            <th width="4%" style={{ "textAlign": "center", "verticalAlign": "middle" }}>Submission</th>
                            <th width="4%" style={{ "textAlign": "center", "verticalAlign": "middle" }}>Status Review</th>
                            {/* <!-- Track Gateway --> */}
                            <th width="4%" style={{ "textAlign": "center", "verticalAlign": "middle" }}>Export</th>

                        </tr>
                    </thead>

                    <tr>
                        <td> <button type="button" className="btn btn-xs ChildDisplay"><i className="fas fa-plus" data-toggle="tooltip"
                            title="Expand"></i> </button>Sales </td>
                    </tr>
                    

                    <tbody class="sales-child d-none">
                        <tr>
                            <td class="child" colspan="23">
                                <div class="ml-4">Container</div>
                            </td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Quotation</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-quotation"></input></td>
                            <td class="check"><input type="checkbox" name="create-quotation"></input></td>
                            <td class="check"><input type="checkbox" name="update-quotation"></input></td>
                            <td class="check"><input type="checkbox" name="throw-quotation"></input></td>
                            <td class="check"><input type="checkbox" name="delete-quotation"></input></td>
                            <td class="check"><input type="checkbox" name="verify-quotation"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td class="check"><input type="checkbox" name="transfer-quotation"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td class="check"><input type="checkbox" name="preview-quotation"></input></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-quotation"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>

                        <tr>
                            <td class="child">
                                <div class="ml-4">Booking</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-booking-reservation"></input></td>
                            <td class="check"><input type="checkbox" name="create-booking-reservation"></input></td>
                            <td class="check"><input type="checkbox" name="update-booking-reservation"></input></td>
                            <td class="check"><input type="checkbox" name="throw-booking-reservation"></input></td>
                            <td class="check"><input type="checkbox" name="delete-booking-reservation"></input></td>
                            <td class="check"><input type="checkbox" name="verify-booking-reservation"></input></td>
                            <td class="check"><input type="checkbox" name="view-charges-booking-reservation"></input></td>
                            <td class="check"><input type="checkbox" name="confirm-booking-reservation"></input></td>
                            <td class="check"><input type="checkbox" name="transferfrom-booking-reservation"></input></td>
                            <td class="check"><input type="checkbox" name="transferto-booking-reservation"></input></td>
                            <td class="check"><input type="checkbox" name="merge-booking-reservation"></input></td>
                            <td class="check"><input type="checkbox" name="split-booking-reservation"></input></td>
                            <td></td>
                            <td class="check"><input type="checkbox" name="transfer-voyage-booking-reservation"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td class="check"><input type="checkbox" name="preview-booking-reservation"></input></td>

                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-booking-reservation"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>

                        <tr>
                            <td class="child">
                                <div class="ml-4">Invoice</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-sales-invoice"></input></td>
                            <td class="check"><input type="checkbox" name="create-sales-invoice"></input></td>
                            <td class="check"><input type="checkbox" name="update-sales-invoice"></input></td>
                            <td class="check"><input type="checkbox" name="throw-sales-invoice"></input></td>
                            <td class="check"><input type="checkbox" name="delete-sales-invoice"></input></td>
                            <td class="check"><input type="checkbox" name="verify-sales-invoice"></input></td>
                            <td></td>
                            <td></td>
                            <td class="check"><input type="checkbox" name="transferfrom-sales-invoice"></input></td>
                            <td class="check"><input type="checkbox" name="transferto-sales-invoice"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td class="check"><input type="checkbox" name="preview-sales-invoice"></input></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-sales-invoice"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>

                        <tr>
                            <td class="child">
                                <div class="ml-4">Credit Note</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-sales-credit-note"></input></td>
                            <td class="check"><input type="checkbox" name="create-sales-credit-note"></input></td>
                            <td class="check"><input type="checkbox" name="update-sales-credit-note"></input></td>
                            <td class="check"><input type="checkbox" name="throw-sales-credit-note"></input></td>
                            <td class="check"><input type="checkbox" name="delete-sales-credit-note"></input></td>
                            <td class="check"><input type="checkbox" name="verify-sales-credit-note"></input></td>
                            <td></td>
                            <td></td>
                            <td class="check"><input type="checkbox" name="transfer-sales-credit-note"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td class="check"><input type="checkbox" name="preview-sales-credit-note"></input></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-sales-credit-note"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>

                        <tr>
                            <td class="child">
                                <div class="ml-4">Debit Note</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-sales-debit-note"></input></td>
                            <td class="check"><input type="checkbox" name="create-sales-debit-note"></input></td>
                            <td class="check"><input type="checkbox" name="update-sales-debit-note"></input></td>
                            <td class="check"><input type="checkbox" name="throw-sales-debit-note"></input></td>
                            <td class="check"><input type="checkbox" name="delete-sales-debit-note"></input></td>
                            <td class="check"><input type="checkbox" name="verify-sales-debit-note"></input></td>
                            <td></td>
                            <td></td>
                            <td class="check"><input type="checkbox" name="transfer-sales-debit-note"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td class="check"><input type="checkbox" name="preview-sales-debit-note"></input></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-sales-debit-note"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>

                        <tr>
                            <td class="child">
                                <div class="ml-4">Receipt</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-customer-payment"></input></td>
                            <td class="check"><input type="checkbox" name="create-customer-payment"></input></td>
                            <td class="check"><input type="checkbox" name="update-customer-payment"></input></td>
                            <td class="check"><input type="checkbox" name="throw-customer-payment"></input></td>
                            <td class="check"><input type="checkbox" name="delete-customer-payment"></input></td>
                            <td class="check"><input type="checkbox" name="verify-customer-payment"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td class="check"><input type="checkbox" name="preview-customer-payment"></input></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-customer-payment"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>

                        <tr>
                            <td class="child" colspan="23">
                                <div class="ml-4">Standard</div>
                            </td>
                        </tr>

                        <tr>
                            <td class="child">
                                <div class="ml-4">Quotation</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-quotation-barge"></input></td>
                            <td class="check"><input type="checkbox" name="create-quotation-barge"></input></td>
                            <td class="check"><input type="checkbox" name="update-quotation-barge"></input></td>
                            <td class="check"><input type="checkbox" name="throw-quotation-barge"></input></td>
                            <td class="check"><input type="checkbox" name="delete-quotation-barge"></input></td>
                            <td class="check"><input type="checkbox" name="verify-quotation-barge"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td class="check"><input type="checkbox" name="transfer-quotation-barge"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td class="check"><input type="checkbox" name="preview-quotation-barge"></input></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-quotation-barge"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>

                        <tr>
                            <td class="child">
                                <div class="ml-4">Booking</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-booking-reservation-barge"></input></td>
                            <td class="check"><input type="checkbox" name="create-booking-reservation-barge"></input></td>
                            <td class="check"><input type="checkbox" name="update-booking-reservation-barge"></input></td>
                            <td class="check"><input type="checkbox" name="throw-booking-reservation-barge"></input></td>
                            <td class="check"><input type="checkbox" name="delete-booking-reservation-barge"></input></td>
                            <td class="check"><input type="checkbox" name="verify-booking-reservation-barge"></input></td>
                            <td></td>
                            <td class="check"><input type="checkbox" name="confirm-booking-reservation-barge"></input></td>
                            <td class="check"><input type="checkbox" name="transferfrom-booking-reservation-barge"></input></td>
                            <td class="check"><input type="checkbox" name="transferto-booking-reservation-barge"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td class="check"><input type="checkbox" name="transfer-voyage-booking-reservation-barge"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td class="check"><input type="checkbox" name="preview-booking-reservation-barge"></input></td>

                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-booking-reservation-barge"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>

                        <tr>
                            <td class="child">
                                <div class="ml-4">Invoice</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-sales-invoice-barge"></input></td>
                            <td class="check"><input type="checkbox" name="create-sales-invoice-barge"></input></td>
                            <td class="check"><input type="checkbox" name="update-sales-invoice-barge"></input></td>
                            <td class="check"><input type="checkbox" name="throw-sales-invoice-barge"></input></td>
                            <td class="check"><input type="checkbox" name="delete-sales-invoice-barge"></input></td>
                            <td class="check"><input type="checkbox" name="verify-sales-invoice-barge"></input></td>
                            <td></td>
                            <td></td>
                            <td class="check"><input type="checkbox" name="transferfrom-sales-invoice-barge"></input></td>
                            <td class="check"><input type="checkbox" name="transferto-sales-invoice-barge"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td class="check"><input type="checkbox" name="preview-sales-invoice-barge"></input></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-sales-invoice-barge"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>

                        <tr>
                            <td class="child">
                                <div class="ml-4">Credit Note</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-sales-credit-note-barge"></input></td>
                            <td class="check"><input type="checkbox" name="create-sales-credit-note-barge"></input></td>
                            <td class="check"><input type="checkbox" name="update-sales-credit-note-barge"></input></td>
                            <td class="check"><input type="checkbox" name="throw-sales-credit-note-barge"></input></td>
                            <td class="check"><input type="checkbox" name="delete-sales-credit-note-barge"></input></td>
                            <td class="check"><input type="checkbox" name="verify-sales-credit-note-barge"></input></td>
                            <td></td>
                            <td></td>
                            <td class="check"><input type="checkbox" name="transfer-sales-credit-note-barge"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td class="check"><input type="checkbox" name="preview-sales-credit-note-barge"></input></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-sales-credit-note-barge"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>

                        <tr>
                            <td class="child">
                                <div class="ml-4">Debit Note</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-sales-debit-note-barge"></input></td>
                            <td class="check"><input type="checkbox" name="create-sales-debit-note-barge"></input></td>
                            <td class="check"><input type="checkbox" name="update-sales-debit-note-barge"></input></td>
                            <td class="check"><input type="checkbox" name="throw-sales-debit-note-barge"></input></td>
                            <td class="check"><input type="checkbox" name="delete-sales-debit-note-barge"></input></td>
                            <td class="check"><input type="checkbox" name="verify-sales-debit-note-barge"></input></td>
                            <td></td>
                            <td></td>
                            <td class="check"><input type="checkbox" name="transfer-sales-debit-note-barge"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td class="check"><input type="checkbox" name="preview-sales-debit-note-barge"></input></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-sales-debit-note-barge"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>

                    </tbody>

                    <tr>
                        <td> <button type="button" className="btn btn-xs ChildDisplay"><i className="fas fa-plus" data-toggle="tooltip"
                            title="Expand"></i> </button>Sales Report </td>
                    </tr>

                    <tbody className="salesreport-child d-none">
                        <tr>
                            <td className="child">
                                <div className="ml-4">Statement Of Account</div>
                            </td>
                            {/* <!-- action --> */}
                            <td className="check"><input type="checkbox" name="view-statement-of-account"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td className="check"><input type="checkbox" name="preview-statement-of-account"></input></td>
                            {/* <!-- table listing --> */}
                            <td></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>

                        <tr>
                            <td className="child">
                                <div className="ml-4">Customer Due Listing</div>
                            </td>
                            {/* <!-- action --> */}
                            <td className="check"><input type="checkbox" name="view-customer-statement"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td className="check"><input type="checkbox" name="preview-customer-statement"></input></td>
                            {/* <!-- table listing --> */}
                            <td></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>

                        <tr>
                            <td className="child">
                                <div className="ml-4">Document Matrix</div>
                            </td>
                            {/* <!-- action --> */}
                            <td className="check"><input type="checkbox" name="view-document-matrix"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>

                            {/* <!-- table listing --> */}
                            <td className="check"><input type="checkbox" name="export-document-matrix"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td className="child">
                                <div className="ml-4">Forecast</div>
                            </td>
                            {/* <!-- action --> */}
                            <td className="check"><input type="checkbox" name="view-forecast"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td className="check"><input type="checkbox" name="preview-forecast"></input></td>
                            {/* <!-- table listing --> */}
                            <td className="check"><input type="checkbox" name="export-forecast"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                    </tbody>



                    <tr>
                        <td> <button type="button" className="btn btn-xs ChildDisplay"><i className="fas fa-plus" data-toggle="tooltip"
                            title="Expand"></i> </button>Operation </td>
                    </tr>

                    <tbody className="operation-child d-none">
                        <tr>
                            <td class="child" colspan="23">
                                <div class="ml-4">Container</div>
                            </td>
                        </tr>
                        <tr>
                            <td className="child">
                                <div className="ml-4">Container Release Order</div>
                            </td>
                            {/* <!-- action --> */}
                            <td className="check"><input type="checkbox" name="view-container-release-order"></input></td>
                            <td className="check"><input type="checkbox" name="create-container-release-order"></input></td>
                            <td className="check"><input type="checkbox" name="update-container-release-order"></input></td>
                            <td className="check"><input type="checkbox" name="throw-container-release-order"></input></td>
                            <td className="check"><input type="checkbox" name="delete-container-release-order"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className="check"><input type="checkbox" name="transfer-container-release-order"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td className="check"><input type="checkbox" name="preview-container-release-order"></input></td>

                            {/* <!-- table listing --> */}
                            <td className="check"><input type="checkbox" name="export-container-release-order"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>

                        <tr>
                            <td className="child">
                                <div className="ml-4">Bill Of Lading</div>
                            </td>
                            {/* <!-- action --> */}
                            <td className="check"><input type="checkbox" name="view-bill-of-lading"></input></td>
                            <td className="check"><input type="checkbox" name="create-bill-of-lading"></input></td>
                            <td className="check"><input type="checkbox" name="update-bill-of-lading"></input></td>
                            <td className="check"><input type="checkbox" name="throw-bill-of-lading"></input></td>
                            <td className="check"><input type="checkbox" name="delete-bill-of-lading"></input></td>
                            <td className="check"><input type="checkbox" name="verify-bill-of-lading"></input></td>
                            <td></td>
                            <td></td>
                            <td className="check"><input type="checkbox" name="transfer-bill-of-lading"></input></td>
                            <td></td>
                            <td className="check"><input type="checkbox" name="merge-bill-of-lading"></input></td>
                            <td className="check"><input type="checkbox" name="split-bill-of-lading"></input></td>
                            <td className="check"><input type="checkbox" name="revert-bill-of-lading"></input></td>
                            <td></td>
                            <td className="check"><input type="checkbox" name="telex-release-bill-of-lading"></input></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td className="check"><input type="checkbox" name="preview-bill-of-lading"></input></td>

                            {/* <!-- table listing --> */}
                            <td className="check"><input type="checkbox" name="export-bill-of-lading"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>

                        <tr>
                            <td className="child">
                                <div className="ml-4">Delivery Order</div>
                            </td>
                            {/* <!-- action --> */}
                            <td className="check"><input type="checkbox" name="view-delivery-order"></input></td>
                            <td className="check"><input type="checkbox" name="create-delivery-order"></input></td>
                            <td className="check"><input type="checkbox" name="update-delivery-order"></input></td>
                            <td className="check"><input type="checkbox" name="throw-delivery-order"></input></td>
                            <td className="check"><input type="checkbox" name="delete-delivery-order"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className="check"><input type="checkbox" name="transfer-delivery-order"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td className="check"><input type="checkbox" name="preview-delivery-order"></input></td>

                            {/* <!-- table listing --> */}
                            <td className="check"><input type="checkbox" name="export-delivery-order"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child" colspan="23">
                                <div class="ml-4">Standard</div>
                            </td>
                        </tr>
                        <tr>
                            <td className="child">
                                <div className="ml-4">Bill Of Lading</div>
                            </td>
                            {/* <!-- action --> */}
                            <td className="check"><input type="checkbox" name="view-bill-of-lading-barge"></input></td>
                            <td className="check"><input type="checkbox" name="create-bill-of-lading-barge"></input></td>
                            <td className="check"><input type="checkbox" name="update-bill-of-lading-barge"></input></td>
                            <td className="check"><input type="checkbox" name="throw-bill-of-lading-barge"></input></td>
                            <td className="check"><input type="checkbox" name="delete-bill-of-lading-barge"></input></td>
                            <td className="check"><input type="checkbox" name="verify-bill-of-lading-barge"></input></td>
                            <td></td>
                            <td></td>
                            <td className="check"><input type="checkbox" name="transfer-bill-of-lading-barge"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className="check"><input type="checkbox" name="telex-release-bill-of-lading-barge"></input></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td className="check"><input type="checkbox" name="preview-bill-of-lading-barge"></input></td>

                            {/* <!-- table listing --> */}
                            <td className="check"><input type="checkbox" name="export-bill-of-lading-barge"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>

                        <tr>
                            <td className="child">
                                <div className="ml-4">Delivery Order</div>
                            </td>
                            {/* <!-- action --> */}
                            <td className="check"><input type="checkbox" name="view-delivery-order-barge"></input></td>
                            <td className="check"><input type="checkbox" name="create-delivery-order-barge"></input></td>
                            <td className="check"><input type="checkbox" name="update-delivery-order-barge"></input></td>
                            <td className="check"><input type="checkbox" name="throw-delivery-order-barge"></input></td>
                            <td className="check"><input type="checkbox" name="delete-delivery-order-barge"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className="check"><input type="checkbox" name="transfer-delivery-order-barge"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td className="check"><input type="checkbox" name="preview-delivery-order-barge"></input></td>

                            {/* <!-- table listing --> */}
                            <td className="check"><input type="checkbox" name="export-delivery-order-barge"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                    </tbody>

                    <tr>
                        <td> <button type="button" className="btn btn-xs ChildDisplay"><i className="fas fa-plus" data-toggle="tooltip"
                            title="Expand"></i> </button>Operation Report </td>
                    </tr>

                    <tbody className="operationreport-child d-none">
                        <tr>
                            <td className="child">
                                <div className="ml-4">Manifest Import</div>
                            </td>
                            {/* <!-- action --> */}
                            <td className="check"><input type="checkbox" name="view-manifest-import"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td className="check"><input type="checkbox" name="preview-manifest-import"></input></td>
                            {/* <!-- table listing --> */}
                            <td className="check"><input type="checkbox" name="export-manifest-import"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td className="check"><input type="checkbox" name="submission-manifest-import"></input></td>
                            <td className="check"><input type="checkbox" name="status-review-manifest-import"></input></td>
                            {/* <!-- Track Gateway --> */}
                            <td className="check"><input type="checkbox" name="download-manifest-import"></input></td>

                        </tr>

                        <tr>
                            <td className="child">
                                <div className="ml-4">Manifest Export</div>
                            </td>
                            {/* <!-- action --> */}
                            <td className="check"><input type="checkbox" name="view-manifest-export"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td className="check"><input type="checkbox" name="preview-manifest-export"></input></td>
                            {/* <!-- table listing --> */}
                            <td className="check"><input type="checkbox" name="export-manifest-export"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td className="check"><input type="checkbox" name="submission-manifest-export"></input></td>
                            <td className="check"><input type="checkbox" name="status-review-manifest-export"></input></td>
                            {/* <!-- Track Gateway --> */}
                            <td className="check"><input type="checkbox" name="download-manifest-export"></input></td>

                        </tr>
                        <tr>
                            <td className="child">
                                <div className="ml-4">Manifest Transhipment</div>
                            </td>
                            {/* <!-- action --> */}
                            <td className="check"><input type="checkbox" name="view-manifest-transhipment"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td className="check"><input type="checkbox" name="preview-manifest-transhipment"></input></td>

                            {/* <!-- table listing --> */}
                            <td className="check"><input type="checkbox" name="export-manifest-transhipment"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td className="check"><input type="checkbox" name="submission-manifest-transhipment"></input></td>
                            <td className="check"><input type="checkbox" name="status-review-manifest-transhipment"></input></td>
                            {/* <!-- Track Gateway --> */}
                            <td className="check"><input type="checkbox" name="download-manifest-transhipment"></input></td>

                        </tr>
                        <tr>
                            <td className="child">
                                <div className="ml-4">Loading List</div>
                            </td>
                            {/* <!-- action --> */}
                            <td className="check"><input type="checkbox" name="view-loading-list"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td className="check"><input type="checkbox" name="preview-loading-list"></input></td>
                            {/* <!-- table listing --> */}
                            <td className="check"><input type="checkbox" name="export-loading-list"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td className="child">
                                <div className="ml-4">Discharging List</div>
                            </td>
                            {/* <!-- action --> */}
                            <td className="check"><input type="checkbox" name="view-discharging-list"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td className="check"><input type="checkbox" name="preview-discharging-list"></input></td>
                            {/* <!-- table listing --> */}
                            <td className="check"><input type="checkbox" name="export-discharging-list"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>

                        </tr>
                        <tr>
                            <td className="child">
                                <div className="ml-4">D&D</div>
                            </td>
                            {/* <!-- action --> */}
                            <td className="check"><input type="checkbox" name="view-dnd"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td className="check"><input type="checkbox" name="export-dnd"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>

                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Voyage Suggestion</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-schedule"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">TDR Report</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-tdr-report"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td class="check"><input type="checkbox" name="preview-tdr-report"></input></td>
                            {/* <!-- table listing --> */}
                            <td></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Tracking List</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-trucking-list"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td class="check"><input type="checkbox" name="preview-trucking-list"></input></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-trucking-list"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Volume Lifting</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-lifting"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td class="check"><input type="checkbox" name="preview-lifting"></input></td>
                            {/* <!-- table listing --> */}
                            <td></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Volumn Lifting Summary</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-lifting-summary"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td class="check"><input type="checkbox" name="preview-lifting-summary"></input></td>
                            {/* <!-- table listing --> */}
                            <td></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Vessel Volume Lifting</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-vessel-voyage-lifting"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td class="check"><input type="checkbox" name="preview-vessel-voyage-lifting"></input></td>
                            {/* <!-- table listing --> */}
                            <td></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Vessel Volume Lifting Summary</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-vessel-voyage-lifting-summary"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td class="check"><input type="checkbox" name="preview-vessel-voyage-lifting-summary"></input></td>
                            {/* <!-- table listing --> */}
                            <td></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Client Lifting</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-customer-lifting"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td class="check"><input type="checkbox" name="preview-customer-lifting"></input></td>
                            {/* <!-- table listing --> */}
                            <td></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Client Lifting Summary</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-customer-lifting-summary"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td class="check"><input type="checkbox" name="preview-customer-lifting-summary"></input></td>
                            {/* <!-- table listing --> */}
                            <td></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                    </tbody>

                    <tr>
                        <td> <button type="button" className="btn btn-xs ChildDisplay"><i className="fas fa-plus" data-toggle="tooltip"
                            title="Expand"></i> </button>Movement </td>
                    </tr>

                    <tbody class="movement-child d-none">
                        <tr>
                            <td class="child">
                                <div class="ml-4">Release</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-container-release"></input></td>
                            <td class="check"><input type="checkbox" name="create-container-release"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td class="check"><input type="checkbox" name="view-all-container-release"></input></td>
                            <td class="check"><input type="checkbox" name="replace-container-release"></input></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-container-release"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>

                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Verified Gross Mass</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-container-verify-gross-mass"></input></td>
                            <td class="check"><input type="checkbox" name="create-container-verify-gross-mass"></input></td>
                            <td class="check"><input type="checkbox" name="update-container-verify-gross-mass"></input></td>
                            <td class="check"><input type="checkbox" name="throw-container-verify-gross-mass"></input></td>
                            <td class="check"><input type="checkbox" name="delete-container-verify-gross-mass"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td class="check"><input type="checkbox" name="preview-container-verify-gross-mass"></input></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-container-verify-gross-mass"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Gate In</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-container-gate-in"></input></td>
                            <td class="check"><input type="checkbox" name="create-container-gate-in"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td class="check"><input type="checkbox" name="view-all-container-gate-in"></input></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-container-gate-in"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Loading</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-container-loaded"></input></td>
                            <td class="check"><input type="checkbox" name="create-container-loaded"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td class="check"><input type="checkbox" name="view-all-container-loaded"></input></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-container-loaded"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>

                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Discharging</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-container-discharged"></input></td>
                            <td class="check"><input type="checkbox" name="create-container-discharged"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td class="check"><input type="checkbox" name="view-all-container-discharged"></input></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-container-discharged"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>

                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Gate Out</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-container-gate-out"></input></td>
                            <td class="check"><input type="checkbox" name="create-container-gate-out"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td class="check"><input type="checkbox" name="view-all-container-gate-out"></input></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-container-gate-out"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>

                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Empty Return</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-container-receive"></input></td>
                            <td class="check"><input type="checkbox" name="create-container-receive"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td class="check"><input type="checkbox" name="view-all-container-receive"></input></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-container-receive"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Special Movement</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-special-movement"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td class="check"><input type="checkbox" name="view-all-special-movement"></input></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-special-movement"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                    </tbody>


                    <tr>
                        <td> <button type="button" className="btn btn-xs ChildDisplay"><i className="fas fa-plus" data-toggle="tooltip"
                            title="Expand"></i> </button>Movement Report</td>
                    </tr>

                    <tbody class="movementreport-child d-none">
                        <tr>
                            <td class="child">
                                <div class="ml-4">Real Time Tracking</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-real-time-tracking"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>

                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">History Tracking</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-history-tracking"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-history-tracking"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>


                        </tr>
                    </tbody>

                    <tr>
                        <td> <button type="button" className="btn btn-xs ChildDisplay"><i className="fas fa-plus" data-toggle="tooltip"
                            title="Expand"></i> </button>Purchase</td>
                    </tr>

                    <tbody class="purchase-child d-none">
                        <tr>
                            <td class="child">
                                <div class="ml-4">Purchase Order</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-purchase-order"></input></td>
                            <td class="check"><input type="checkbox" name="create-purchase-order"></input></td>
                            <td class="check"><input type="checkbox" name="update-purchase-order"></input></td>
                            <td class="check"><input type="checkbox" name="throw-purchase-order"></input></td>
                            <td class="check"><input type="checkbox" name="delete-purchase-order"></input></td>
                            <td class="check"><input type="checkbox" name="verify-purchase-order"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-purchase-order"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                    </tbody>

                    <tr>
                        <td> <button type="button" className="btn btn-xs ChildDisplay"><i className="fas fa-plus" data-toggle="tooltip"
                            title="Expand"></i> </button>Third Party</td>
                    </tr>

                    <tbody class="thirdparty-child d-none">
                        <tr>
                            <td class="child" colspan="23">
                                <div class="ml-4">Container</div>
                            </td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Third Party Invoice</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-third-party-invoice"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td class="check"><input type="checkbox" name="preview-third-party-invoice"></input></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-third-party-invoice"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Third Party Debit Note</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-third-party-debit-note"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td class="check"><input type="checkbox" name="preview-third-party-debit-note"></input></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-third-party-debit-note"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Third Party Bill Of Lading</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-third-party-bill-of-lading"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td class="check"><input type="checkbox" name="preview-third-party-bill-of-lading"></input></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-third-party-bill-of-lading"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child" colspan="23">
                                <div class="ml-4">Standard</div>
                            </td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Third Party Invoice</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-third-party-invoice-barge"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td class="check"><input type="checkbox" name="preview-third-party-invoice-barge"></input></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-third-party-invoice-barge"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Third Party Debit Note</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-third-party-debit-note-barge"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td class="check"><input type="checkbox" name="preview-third-party-debit-note-barge"></input></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-third-party-debit-note-barge"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Third Party Bill Of Lading</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-third-party-bill-of-lading-barge"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td class="check"><input type="checkbox" name="preview-third-party-bill-of-lading-barge"></input></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-third-party-bill-of-lading-barge"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                    </tbody>

                    <tr>
                        <td> <button type="button" className="btn btn-xs ChildDisplay"><i className="fas fa-plus" data-toggle="tooltip"
                            title="Expand"></i> </button>Company</td>
                    </tr>

                    <tbody class="company-child d-none">
                        <tr>
                            <td class="child">
                                <div class="ml-4">Company</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-company"></input></td>
                            <td class="check"><input type="checkbox" name="create-company"></input></td>
                            <td class="check"><input type="checkbox" name="update-company"></input></td>
                            <td class="check"><input type="checkbox" name="throw-company"></input></td>
                            <td class="check"><input type="checkbox" name="delete-company"></input></td>
                            <td class="check"><input type="checkbox" name="verify-company"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-company"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Customer</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-customer"></input></td>
                            <td class="check"><input type="checkbox" name="create-customer"></input></td>
                            <td class="check"><input type="checkbox" name="update-customer"></input></td>
                            <td class="check"><input type="checkbox" name="throw-customer"></input></td>
                            <td class="check"><input type="checkbox" name="delete-customer"></input></td>
                            <td class="check"><input type="checkbox" name="verify-customer"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-customer"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Supplier</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-supplier"></input></td>
                            <td class="check"><input type="checkbox" name="create-supplier"></input></td>
                            <td class="check"><input type="checkbox" name="update-supplier"></input></td>
                            <td class="check"><input type="checkbox" name="throw-supplier"></input></td>
                            <td class="check"><input type="checkbox" name="delete-supplier"></input></td>
                            <td class="check"><input type="checkbox" name="verify-supplier"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-supplier"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Agent</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-agent"></input></td>
                            <td class="check"><input type="checkbox" name="create-agent"></input></td>
                            <td class="check"><input type="checkbox" name="update-agent"></input></td>
                            <td class="check"><input type="checkbox" name="throw-agent"></input></td>
                            <td class="check"><input type="checkbox" name="delete-agent"></input></td>
                            <td class="check"><input type="checkbox" name="verify-agent"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-agent"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Depot</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-depot"></input></td>
                            <td class="check"><input type="checkbox" name="create-depot"></input></td>
                            <td class="check"><input type="checkbox" name="update-depot"></input></td>
                            <td class="check"><input type="checkbox" name="throw-depot"></input></td>
                            <td class="check"><input type="checkbox" name="delete-depot"></input></td>
                            <td class="check"><input type="checkbox" name="verify-depot"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>

                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-depot"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Builder</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-builder"></input></td>
                            <td class="check"><input type="checkbox" name="create-builder"></input></td>
                            <td class="check"><input type="checkbox" name="update-builder"></input></td>
                            <td class="check"><input type="checkbox" name="throw-builder"></input></td>
                            <td class="check"><input type="checkbox" name="delete-builder"></input></td>
                            <td class="check"><input type="checkbox" name="verify-builder"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-builder"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Hauler</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-hauler"></input></td>
                            <td class="check"><input type="checkbox" name="create-hauler"></input></td>
                            <td class="check"><input type="checkbox" name="update-hauler"></input></td>
                            <td class="check"><input type="checkbox" name="throw-hauler"></input></td>
                            <td class="check"><input type="checkbox" name="delete-hauler"></input></td>
                            <td class="check"><input type="checkbox" name="verify-hauler"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-hauler"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>

                        <tr>
                            <td class="child">
                                <div class="ml-4">Box Operator</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-box-operator"></input></td>
                            <td class="check"><input type="checkbox" name="create-box-operator"></input></td>
                            <td class="check"><input type="checkbox" name="update-box-operator"></input></td>
                            <td class="check"><input type="checkbox" name="throw-box-operator"></input></td>
                            <td class="check"><input type="checkbox" name="delete-box-operator"></input></td>
                            <td class="check"><input type="checkbox" name="verify-box-operator"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-box-operator"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Ship Operator</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-ship-operator"></input></td>
                            <td class="check"><input type="checkbox" name="create-ship-operator"></input></td>
                            <td class="check"><input type="checkbox" name="update-ship-operator"></input></td>
                            <td class="check"><input type="checkbox" name="throw-ship-operator"></input></td>
                            <td class="check"><input type="checkbox" name="delete-ship-operator"></input></td>
                            <td class="check"><input type="checkbox" name="verify-ship-operator"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-ship-operator"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Terminal Handler</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-terminal-handler"></input></td>
                            <td class="check"><input type="checkbox" name="create-terminal-handler"></input></td>
                            <td class="check"><input type="checkbox" name="update-terminal-handler"></input></td>
                            <td class="check"><input type="checkbox" name="throw-terminal-handler"></input></td>
                            <td class="check"><input type="checkbox" name="delete-terminal-handler"></input></td>
                            <td class="check"><input type="checkbox" name="verify-terminal-handler"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-terminal-handler"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Terminal</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-port-details"></input></td>
                            <td class="check"><input type="checkbox" name="create-port-details"></input></td>
                            <td class="check"><input type="checkbox" name="update-port-details"></input></td>
                            <td class="check"><input type="checkbox" name="throw-port-details"></input></td>
                            <td class="check"><input type="checkbox" name="delete-port-details"></input></td>
                            <td class="check"><input type="checkbox" name="verify-port-details"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-port-details"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                    </tbody>

                    <tr>
                        <td> <button type="button" className="btn btn-xs ChildDisplay"><i className="fas fa-plus" data-toggle="tooltip"
                            title="Expand"></i> </button>Asset</td>
                    </tr>

                    <tbody class="asset-child d-none">
                        <tr>
                            <td class="child">
                                <div class="ml-4">Container</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-container"></input></td>
                            <td class="check"><input type="checkbox" name="create-container"></input></td>
                            <td class="check"><input type="checkbox" name="update-container"></input></td>
                            <td class="check"><input type="checkbox" name="throw-container"></input></td>
                            <td class="check"><input type="checkbox" name="delete-container"></input></td>
                            <td class="check"><input type="checkbox" name="verify-container"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-container"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Vessel</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-vessel"></input></td>
                            <td class="check"><input type="checkbox" name="create-vessel"></input></td>
                            <td class="check"><input type="checkbox" name="update-vessel"></input></td>
                            <td class="check"><input type="checkbox" name="throw-vessel"></input></td>
                            <td class="check"><input type="checkbox" name="delete-vessel"></input></td>
                            <td class="check"><input type="checkbox" name="verify-vessel"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-vessel"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                    </tbody>

                    <tr>
                        <td> <button type="button" className="btn btn-xs ChildDisplay"><i className="fas fa-plus" data-toggle="tooltip"
                            title="Expand"></i> </button>Schedule</td>
                    </tr>

                    <tbody class="schedule-child d-none">
                        <tr>
                            <td class="child">
                                <div class="ml-4">Route</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-route"></input></td>
                            <td class="check"><input type="checkbox" name="create-route"></input></td>
                            <td class="check"><input type="checkbox" name="update-route"></input></td>
                            <td class="check"><input type="checkbox" name="throw-route"></input></td>
                            <td class="check"><input type="checkbox" name="delete-route"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-route"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Voyage</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-voyage"></input></td>
                            <td class="check"><input type="checkbox" name="create-voyage"></input></td>
                            <td class="check"><input type="checkbox" name="update-voyage"></input></td>
                            <td class="check"><input type="checkbox" name="throw-voyage"></input></td>
                            <td class="check"><input type="checkbox" name="delete-voyage"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-voyage"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                    </tbody>

                    <tr>
                        <td> <button type="button" className="btn btn-xs ChildDisplay"><i className="fas fa-plus" data-toggle="tooltip"
                            title="Expand"></i> </button>Settings</td>
                    </tr>

                    <tbody class="settings-child d-none">
                        <tr>
                            <td class="child">
                                <div class="ml-4">Port</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-area"></input></td>
                            <td class="check"><input type="checkbox" name="create-area"></input></td>
                            <td class="check"><input type="checkbox" name="update-area"></input></td>
                            <td class="check"><input type="checkbox" name="throw-area"></input></td>
                            <td class="check"><input type="checkbox" name="delete-area"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-area"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Currency Type</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-currency-type"></input></td>
                            <td class="check"><input type="checkbox" name="create-currency-type"></input></td>
                            <td class="check"><input type="checkbox" name="update-currency-type"></input></td>
                            <td class="check"><input type="checkbox" name="throw-currency-type"></input></td>
                            <td class="check"><input type="checkbox" name="delete-currency-type"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-currency-type"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Currency Rate</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-currency-rate"></input></td>
                            <td class="check"><input type="checkbox" name="create-currency-rate"></input></td>
                            <td class="check"><input type="checkbox" name="update-currency-rate"></input></td>
                            <td class="check"><input type="checkbox" name="throw-currency-rate"></input></td>
                            <td class="check"><input type="checkbox" name="delete-currency-rate"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-currency-rate"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Freight Term</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-freight-term"></input></td>
                            <td class="check"><input type="checkbox" name="create-freight-term"></input></td>
                            <td class="check"><input type="checkbox" name="update-freight-term"></input></td>
                            <td class="check"><input type="checkbox" name="throw-freight-term"></input></td>
                            <td class="check"><input type="checkbox" name="delete-freight-term"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-freight-term"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Port Term</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-port-term"></input></td>
                            <td class="check"><input type="checkbox" name="create-port-term"></input></td>
                            <td class="check"><input type="checkbox" name="update-port-term"></input></td>
                            <td class="check"><input type="checkbox" name="throw-port-term"></input></td>
                            <td class="check"><input type="checkbox" name="delete-port-term"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-port-term"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Tax Code</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-tax-code"></input></td>
                            <td class="check"><input type="checkbox" name="create-tax-code"></input></td>
                            <td class="check"><input type="checkbox" name="update-tax-code"></input></td>
                            <td class="check"><input type="checkbox" name="throw-tax-code"></input></td>
                            <td class="check"><input type="checkbox" name="delete-tax-code"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-tax-code"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>

                        <tr>
                            <td class="child">
                                <div class="ml-4">Credit Term</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-credit-term"></input></td>
                            <td class="check"><input type="checkbox" name="create-credit-term"></input></td>
                            <td class="check"><input type="checkbox" name="update-credit-term"></input></td>
                            <td class="check"><input type="checkbox" name="throw-credit-term"></input></td>
                            <td class="check"><input type="checkbox" name="delete-credit-term"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-credit-term"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Business Nature</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-business-nature"></input></td>
                            <td class="check"><input type="checkbox" name="create-business-nature"></input></td>
                            <td class="check"><input type="checkbox" name="update-business-nature"></input></td>
                            <td class="check"><input type="checkbox" name="throw-business-nature"></input></td>
                            <td class="check"><input type="checkbox" name="delete-business-nature"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-business-nature"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Customer Type</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-customer-type"></input></td>
                            <td class="check"><input type="checkbox" name="create-customer-type"></input></td>
                            <td class="check"><input type="checkbox" name="update-customer-type"></input></td>
                            <td class="check"><input type="checkbox" name="throw-customer-type"></input></td>
                            <td class="check"><input type="checkbox" name="delete-customer-type"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-customer-type"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>

                        <tr>
                            <td class="child">
                                <div class="ml-4">Supplier Type</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-supplier-type"></input></td>
                            <td class="check"><input type="checkbox" name="create-supplier-type"></input></td>
                            <td class="check"><input type="checkbox" name="update-supplier-type"></input></td>
                            <td class="check"><input type="checkbox" name="throw-supplier-type"></input></td>
                            <td class="check"><input type="checkbox" name="delete-supplier-type"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-supplier-type"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Company Type</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-company-type"></input></td>
                            <td class="check"><input type="checkbox" name="create-company-type"></input></td>
                            <td class="check"><input type="checkbox" name="update-company-type"></input></td>
                            <td class="check"><input type="checkbox" name="throw-company-type"></input></td>
                            <td class="check"><input type="checkbox" name="delete-company-type"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-company-type"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>

                        <tr>
                            <td class="child">
                                <div class="ml-4">Container Type</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-container-type"></input></td>
                            <td class="check"><input type="checkbox" name="create-container-type"></input></td>
                            <td class="check"><input type="checkbox" name="update-container-type"></input></td>
                            <td class="check"><input type="checkbox" name="throw-container-type"></input></td>
                            <td class="check"><input type="checkbox" name="delete-container-type"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>

                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-container-type"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>

                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Cargo Type</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-cargo-type"></input></td>
                            <td class="check"><input type="checkbox" name="create-cargo-type"></input></td>
                            <td class="check"><input type="checkbox" name="update-cargo-type"></input></td>
                            <td class="check"><input type="checkbox" name="throw-cargo-type"></input></td>
                            <td class="check"><input type="checkbox" name="delete-cargo-type"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>

                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-cargo-type"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>

                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Vessel Type</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-vessel-type"></input></td>
                            <td class="check"><input type="checkbox" name="create-vessel-type"></input></td>
                            <td class="check"><input type="checkbox" name="update-vessel-type"></input></td>
                            <td class="check"><input type="checkbox" name="throw-vessel-type"></input></td>
                            <td class="check"><input type="checkbox" name="delete-vessel-type"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>

                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-vessel-type"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>

                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">UN Number</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-un-number"></input></td>
                            <td class="check"><input type="checkbox" name="create-un-number"></input></td>
                            <td class="check"><input type="checkbox" name="update-un-number"></input></td>
                            <td class="check"><input type="checkbox" name="throw-un-number"></input></td>
                            <td class="check"><input type="checkbox" name="delete-un-number"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>

                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-un-number"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">HS Code</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-hs-code"></input></td>
                            <td class="check"><input type="checkbox" name="create-hs-code"></input></td>
                            <td class="check"><input type="checkbox" name="update-hs-code"></input></td>
                            <td class="check"><input type="checkbox" name="throw-hs-code"></input></td>
                            <td class="check"><input type="checkbox" name="delete-hs-code"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>

                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-hs-code"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Charges Type</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-charges-type"></input></td>
                            <td class="check"><input type="checkbox" name="create-charges-type"></input></td>
                            <td class="check"><input type="checkbox" name="update-charges-type"></input></td>
                            <td class="check"><input type="checkbox" name="throw-charges-type"></input></td>
                            <td class="check"><input type="checkbox" name="delete-charges-type"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>

                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-charges-type"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Charges</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-charges"></input></td>
                            <td class="check"><input type="checkbox" name="create-charges"></input></td>
                            <td class="check"><input type="checkbox" name="update-charges"></input></td>
                            <td class="check"><input type="checkbox" name="throw-charges"></input></td>
                            <td class="check"><input type="checkbox" name="delete-charges"></input></td>
                            <td class="check"><input type="checkbox" name="verify-charges"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>

                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-charges"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Tariff</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-tariff"></input></td>
                            <td class="check"><input type="checkbox" name="create-tariff"></input></td>
                            <td class="check"><input type="checkbox" name="update-tariff"></input></td>
                            <td class="check"><input type="checkbox" name="throw-tariff"></input></td>
                            <td class="check"><input type="checkbox" name="delete-tariff"></input></td>
                            <td class="check"><input type="checkbox" name="verify-tariff"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>

                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-tariff"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Receivable Method</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-receivable-method"></input></td>
                            <td class="check"><input type="checkbox" name="create-receivable-method"></input></td>
                            <td class="check"><input type="checkbox" name="update-receivable-method"></input></td>
                            <td class="check"><input type="checkbox" name="throw-receivable-method"></input></td>
                            <td class="check"><input type="checkbox" name="delete-receivable-method"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>

                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-receivable-method"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">User Group</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-user-group"></input></td>
                            <td class="check"><input type="checkbox" name="create-user-group"></input></td>
                            <td class="check"><input type="checkbox" name="update-user-group"></input></td>
                            <td class="check"><input type="checkbox" name="throw-user-group"></input></td>
                            <td class="check"><input type="checkbox" name="delete-user-group"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>

                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-user-group"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">User</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-user"></input></td>
                            <td class="check"><input type="checkbox" name="create-user"></input></td>
                            <td class="check"><input type="checkbox" name="update-user"></input></td>
                            <td class="check"><input type="checkbox" name="throw-user"></input></td>
                            <td></td>
                            <td class="check"><input type="checkbox" name="verify-user"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>

                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-user"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Rule Set</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-rule-set"></input></td>
                            <td class="check"><input type="checkbox" name="create-rule-set"></input></td>
                            <td class="check"><input type="checkbox" name="update-rule-set"></input></td>
                            <td class="check"><input type="checkbox" name="throw-rule-set"></input></td>
                            <td class="check"><input type="checkbox" name="delete-rule-set"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>

                            {/* <!-- table listing --> */}
                            <td class="check"><input type="checkbox" name="export-rule-set"></input></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Change Password</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-site-change-password"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>

                            {/* <!-- table listing --> */}
                            <td></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">GP Export</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-gp-export"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>

                            {/* <!-- table listing --> */}
                            <td></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                        <tr>
                            <td class="child">
                                <div class="ml-4">Audit Trail</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-audit-trail"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>

                            {/* <!-- table listing --> */}
                            <td></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>


                    </tbody>


                    <tbody class="user-profile-child">
                        <tr>
                            <td class="child">
                                <div class="ml-4">Profile</div>
                            </td>
                            {/* <!-- action --> */}
                            <td class="check"><input type="checkbox" name="view-user-profile"></input></td>
                            <td></td>
                            <td class="check"><input type="checkbox" name="update-user-profile"></input></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <!-- report --> */}
                            <td></td>
                            {/* <!-- table listing --> */}
                            <td></td>
                            {/* <!-- dagangnet --> */}
                            <td></td>
                            <td></td>
                            {/* <!-- Track Gateway --> */}
                            <td></td>
                        </tr>
                    </tbody>





                </table>

            </div>





        </div>
    )
}

export default AccessControl


