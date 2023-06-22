import React, {useContext, useEffect, useState} from 'react'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Controller } from "react-hook-form";
import moment from "moment";
import Select from 'react-select'
import FormContext from "./FormContext";
import GlobalContext from "../GlobalContext"
import $ from "jquery";
import { ControlOverlay, FilterQuotations} from '../../Components/Helper.js'
import {InitModalRadioTable} from "../BootstrapTableModal&Dropdown/InitModalRadioTable";
import { useNavigate } from "react-router-dom";

function QuickFormDocument(props) {
    const formContext = useContext(FormContext)
    const globalContext = useContext(GlobalContext)
    const navigate = useNavigate();
    const [formType, setFormType] = useState("")
    const formName = props.DocumentItem.formName
    const formNameLowerCase = formName.toLowerCase()
    const defaultCurrencyInvoice="----942c4cf1-d709-11eb-91d3-b42e998d11ff"

    var defaultHideFilterQuotationModal = [ // default field to hide in bootstrap table
    "QuotationUUID",
    ]

    function handleKeydown(event){
        var Closest=$(event.target).parent().parent().parent().parent()
        if (event.key !== "Tab") {
            if($(Closest).hasClass("readOnlySelect")){
                event.preventDefault()
            }
        }
       
    }

    var columnsFilterQuotationModal = [                                     // data from controller (actionGetBookingConfirmation) field and title to be included
        { field: 'QuotationUUID', title: 'Quotation  UUID' },
        { field: 'DocNum', title: 'QT No.' },
        { field: 'DocDate', title: 'QT Doc Date' },
        { field: 'quotationAgent.CompanyName', title: 'Agent' },
        { field: 'quotationShipper.CompanyName', title: 'Shipper' },
        { field: 'quotationConsignee.CompanyName', title: 'Consignee' },
        { field: 'DocDesc', title: 'DocDesc' },
        { field: 'salesPerson.username', title: 'Sales Person' },
        { field: 'QuotationType', title: 'Quotation Type' },
        { field: 'ValidityDay', title: 'Validity Day' },
        { field: 'LastValidDate', title: 'Last Valid Date' },
        { field: 'AdvanceBookingStartDate', title: 'Advance Booking Start Date' },
        { field: 'AdvanceBookingLastValidDate', title: 'Advance Booking Last Valid Date' },
        { field: 'currency.CurrencyName', title: 'Currency Name' },
        { field: 'CurrencyExchangeRate', title: 'Currency Exchange Rate' },

        { field: 'pOLPortCode.PortCode', title: 'POL Port Code' },
        { field: 'POLAreaName', title: 'POL Area Name' },
        { field: 'pOLLocationCode.LocationCode', title: 'POL Location Code' },
        { field: 'POLLocationName', title: 'POL Locatio nName' },
        { field: 'pOLPortTerm.PortTerm', title: 'POL Port Term' },
        { field: 'pOLFreightTerm.FreightTerm', title: 'POL Freight Term' },
        { field: 'pOLHandlingOfficeCode.BranchCode', title: 'POL Handling Office Code' },
        { field: 'POLHandlingOfficeName', title: 'POL Handling Office Name' },
        { field: 'POLReqETA', title: 'POL Req ETA' },

        { field: 'pODPortCode.PortCode', title: 'POD Port Code' },
        { field: 'PODAreaName', title: 'POD Area Name' },
        { field: 'pODLocationCode.LocationCode', title: 'POD Location Code' },
        { field: 'PODLocationName', title: 'POD Location Name' },
        { field: 'pODPortTerm.PortTerm', title: 'POD Port Term' },
        { field: 'pODFreightTerm.FreightTerm', title: 'POD Freight Term' },
        { field: 'pODHandlingOfficeCode.BranchCode', title: 'POD Handling Office Code' },
        { field: 'PODHandlingOfficeName', title: 'POD Handling Office Name' },
        { field: 'PODReqETA', title: 'POD Req ETA' },

        { field: 'finalDestination.PortCode', title: 'Final Destination' },
        { field: 'FinalDestinationArea', title: 'Final Destination Area' },
        { field: 'finalDestinationHandler.ROC', title: 'Final Destination Handler' },

        { field: 'voyageNum.VoyageNumber', title: 'Voyage Num' },
        { field: 'VesselCode', title: 'Vessel Code' },
        { field: 'VesselName', title: 'Vessel Name' },
        { field: 'POLETA', title: 'POL ETA' },
        { field: 'POLSCNCode', title: 'POL SCN Code' },
        { field: 'PODETA', title: 'POD ETA' },
        { field: 'PODSCNCode', title: 'POD SCN Code' },
        { field: 'ClosingDateTime', title: 'Closing Date Time' },

        { field: 'shipOperator.ROC', title: 'Ship Operator' },
        { field: 'ShipOperatorCompany', title: 'Ship Operator Company' },
        { field: 'shipOperatorBranchCode.BranchCode', title: 'Ship Operator Branch Code' },
        { field: 'ShipOperatorBranchName', title: 'Ship Operator Branch Name' },

        { field: 'InsistTranshipment', title: 'Insist Transhipment' },
        { field: 'ApplyDND', title: 'Apply DND' },
        { field: 'DNDCombined', title: 'DND Combined' },
        { field: 'DNDCombinedDay', title: 'DND Combined Day' },
        { field: 'Detention', title: 'Detention' },
        { field: 'Demurrage', title: 'Demurrage' },

        { field: 'AutoBilling', title: 'Auto Billing' },
        { field: 'TotalM3', title: 'Total M3' },
        { field: 'TotalNetWeight', title: 'Total Net Weight' },
        { field: 'TotalGrossWeight', title: 'Total Gross Weight' },
        { field: 'TotalTues', title: 'Total Tues' },
        { field: 'TotalDiscount', title: 'Total Discount' },
        { field: 'TotalTax', title: 'Total Tax' },
        { field: 'TotalAmount', title: 'Total Amount' },

        { field: 'CreatedAt', title: 'Created At' },
        { field: 'CreatedBy', title: 'Created By' },
        { field: 'UpdatedAt', title: 'Updated At' },
        { field: 'UpdatedBy', title: 'Updated By' },
        { field: 'Valid', title: 'Valid' },
    ];

    function HighLightField() {
        $("#"+formNameLowerCase+"-polportcode").find(".select__control").addClass("HighLight")
        $("#dynamicmodel-polportcode").find(".select__control").addClass("HighLight")
        $("#"+formNameLowerCase+"-podportcode").find(".select__control").addClass("HighLight")
        $("#dynamicmodel-podportcode").find(".select__control").addClass("HighLight")
        $("#dynamicmodel-voyagenum").find(".select__control").addClass("HighLight")
        $(".quotation_type").find(".select__control").addClass("HighLight")
        $("#CompanyROC-BillTo-Quickform").addClass("HighLight")
        $(".Container_Type").find(".select__control").addClass("HighLight")
        $(".BoxOwnership").find(".select__control").addClass("HighLight")
        $(".ReadTemperature").addClass("HighLight")
        $(".DGClass").addClass("HighLight")
    }

    function FindQuotation(val) {
        var quotationType = props.getValues(`${props.DocumentItem.formName}[QuotationType]`)
        var DocDate = props.getValues(`${props.DocumentItem.formName}[DocDate]`)
        var LastValidDate = $(`input[name='${props.DocumentItem.formName}[LastValidDate]']`).val()
        var filters = []
        var filter
        var QuotationHasContainerType = [];

        $('.container-itemTRForQT').each(function (key, value) {
            if ($(this).find(".ContainerType").val() != null) {
                var arrayList = {
                    "ContainerType": $(this).find(".ContainerType").children().last().val(),
                    "BoxOwnership": $(this).find(".BoxOwnership").children().last().val(),
                    "Temperature": $(this).find(".ReadTemperature").val(),
                    "DGClass": $(this).find(".DGClass").val(),
                    "Qty": $(this).find(".Qty").val(), 
                }
                QuotationHasContainerType.push(arrayList)
            }
        });
        
        var filtersTranshipment =[]
        if(quotationType == "One-Off"){
            filter = {
                POLPortCode:props.getValues(`${props.DocumentItem.formName}[POLPortCode]`),
                PODPortCode:props.getValues(`${props.DocumentItem.formName}[PODPortCode]`),
                VoyageNum:$("#dynamicmodel-voyagenum").children().last().val(),
                QuotationBillTo:$("#bookingreservationbillto-roc").val(),
                QuotationType:quotationType,
            }

            $(".PortCodeDetailForm").each(function () {
                var arrayList = {
                    POTPortCode: $(this).children().last().val(),
                    POTVoyageNum: $(this).closest(".transhipment-body").find(".FromVoyageNumDetailForm").children().last().val(),
                }
                filtersTranshipment.push(arrayList)
            });
           

        }else{
            filter = {
                POLPortCode:props.getValues(`${props.DocumentItem.formName}[POLPortCode]`),
                PODPortCode:props.getValues(`${props.DocumentItem.formName}[PODPortCode]`),
                QuotationBillTo:$("#bookingreservationbillto-roc").val(),
                QuotationType:quotationType,
                
            }
            $(".PortCodeDetailForm").each(function () {
                var arrayList = {
                    POTPortCode: $(this).children().last().val(),
                }
                filtersTranshipment.push(arrayList)
            });
        }
        
        var filtersAgent = {
            "ROC": $("#bookingreservationagent-roc").val()
        };

        var filtersShipper = {
            "ROC": $("#bookingreservationshipper-roc").val()
        };

        var filtersConsignee = {
            "ROC": $("#bookingreservationconsignee-roc").val()
        };  
        filters = {QuotationHasContainerType,filter,filtersAgent,filtersTranshipment,filtersShipper,filtersConsignee,DocDate,LastValidDate}
        var type;
        props.barge?type="barge":type="normal"

        FilterQuotations(filters,globalContext,type).then(data => {
            var QuotationArray = []
            try {
                $.each(data.data, function (key, value) {
                    QuotationArray.push({ value: value.QuotationUUID, label: value.DocNum })
                });
            }
            catch (err) {
            }

            if(QuotationArray.length<=0){
                HighLightField()
            }
            formContext.setStateHandle(QuotationArray, "QTOption")
            
            // if (data.data == null) {
            //     console.log("3213")
            // }
        })

    }
    if(formContext.formState){
        if(formContext.formState.formNewClicked){
            setTimeout(() => {
                if(props.DocumentItem.formName=="SalesInvoice"){
                    props.setValue("SalesInvoice[SalesPerson]",(globalContext.authInfo.id).toString())
                    props.setValue("DynamicModel[SalesPerson]",(globalContext.authInfo.id).toString())
                    props.setValue("SalesInvoice[Currency]",defaultCurrencyInvoice)
    
                    
                    props.setValue("SalesInvoice[DocDate]",formContext.docDate)
                }
          
            }, 100);
        }
    }
 

    useEffect(() => { //for quotation
        setTimeout(() => {
            if(props.DocumentItem.formName=="Quotation"){
                props.setValue("DynamicModel[SalesPerson]",formContext.salesPerson)
            }
            if(props.DocumentItem.formName=="SalesInvoice"){
                props.setValue("SalesInvoice[SalesPerson]",formContext.salesPerson)
                props.setValue("DynamicModel[SalesPerson]",formContext.salesPerson)
            }
            if(props.DocumentItem.formName=="SalesCreditNote"){
                props.setValue("SalesCreditNote[SalesPerson]",formContext.salesPerson)
            }
            if(props.DocumentItem.formName=="SalesDebitNote"){
                props.setValue("SalesDebitNote[SalesPerson]",formContext.salesPerson)
            }
            if(props.DocumentItem.formName=="CustomerPayment"){
                props.setValue("CustomerPayment[SalesPerson]",formContext.salesPerson)
            }
            props.setValue("DynamicModel[QuotationType]",formContext.quotationType)
        }, 100);
    }, [formContext.salesPerson,formContext.quotationType])

    

    useEffect(() => {
        if (props.DocumentItem.formName == "BookingReservation"){
            setTimeout(() => {
                $.each(props.DocumentItem.element, function (key, value) {
                    if(value.id == "dynamicmodel-bkdocnum"){
                        $("input[name='DynamicModel[BKDocNum]']").parent().addClass(value.className)
                    }
                    if(value.id == "dynamicmodel-bkdocdate"){
                        $("input[name='DynamicModel[BKDocDate]']").addClass(value.className)
                    }
                    // if(value.id == "dynamicmodel-quotation"){
                    //     $(".getTransferFromQT ").addClass("readOnlySelect")
                    // }
                })
            }, 100);
        }
      return () => {
      }
    }, [props])
    
    useEffect(() => {
        window.$(".openModalQuotation").on("click", function () {
            var pol = $("input[name='DynamicModel[POLPortCode]']").val()
            var pod = $("input[name='DynamicModel[PODPortCode]']").val()
            var billto = $("#bookingreservationbillto-roc").val()
            var containerType = []
            var ownershipType = []
            $('.container-itemTRForQT').each(function (key, value) {
                containerType.push($(this).find(".ContainerType").children().last().val())
                ownershipType.push($(this).find(".BoxOwnership").children().last().val()) 
            });
            
            window.$("#BR-QuotationModal").modal("toggle");

            var quotationType = props.getValues(`${props.DocumentItem.formName}[QuotationType]`)
            var DocDate = props.getValues(`${props.DocumentItem.formName}[DocDate]`)
            var LastValidDate = $(`input[name='${props.DocumentItem.formName}[LastValidDate]']`).val()
            var filters = []
            var filter
            var QuotationHasContainerType = [];


            $('.container-itemTRForQT').each(function (key, value) {
                if ($(this).find(".ContainerType").val() != null) {
                    var arrayList = {
                        "ContainerType": $(this).find(".ContainerType").children().last().val(),
                        "BoxOwnership": $(this).find(".BoxOwnership").children().last().val(),
                        "Temperature": $(this).find(".ReadTemperature").val(),
                        "DGClass": $(this).find(".DGClass").val(), 
                        "Qty": $(this).find(".Qty").val(), 
                    }
                    QuotationHasContainerType.push(arrayList)
                }
            });
            
            var filtersTranshipment =[]
            if(quotationType == "One-Off"){
                filter = {
                    POLPortCode:props.getValues(`${props.DocumentItem.formName}[POLPortCode]`),
                    PODPortCode:props.getValues(`${props.DocumentItem.formName}[PODPortCode]`),
                    VoyageNum:$("#dynamicmodel-voyagenum").children().last().val(),
                    QuotationBillTo:$("#bookingreservationbillto-roc").val(),
                    QuotationType:quotationType,
                }

                $(".PortCodeDetailForm").each(function () {
                    var arrayList = {
                        POTPortCode: $(this).children().last().val(),
                        POTVoyageNum: $(this).closest(".transhipment-body").find(".FromVoyageNumDetailForm").children().last().val(),
                    }
                    filtersTranshipment.push(arrayList)
                });
            

            }else{
                filter = {
                    POLPortCode:props.getValues(`${props.DocumentItem.formName}[POLPortCode]`),
                    PODPortCode:props.getValues(`${props.DocumentItem.formName}[PODPortCode]`),
                    QuotationBillTo:$("#bookingreservationbillto-roc").val(),
                    QuotationType:quotationType,
                    
                }
                $(".PortCodeDetailForm").each(function () {
                    var arrayList = {
                        POTPortCode: $(this).children().last().val(),
                    }
                    filtersTranshipment.push(arrayList)
                });
            }
            
            var filtersAgent = {
                "ROC": $("#bookingreservationagent-roc").val()
            };

            var filtersShipper = {
                "ROC": $("#bookingreservationshipper-roc").val()
            };

            var filtersConsignee = {
                "ROC": $("#bookingreservationconsignee-roc").val()
            };

            filters = {QuotationHasContainerType,filter,filtersAgent,filtersTranshipment,filtersShipper,filtersConsignee,DocDate,LastValidDate}
            var type;
            props.barge?type="barge":type="normal"
            var GetGridviewData = function (params) {
                FilterQuotations(filters,globalContext,type).then(data => {
                    
                    if (data.data.length <= 0) {
                        formContext.setStateHandle([], "QTOption")
                        HighLightField();
                    }
                    params.success({
                        "rows": data.data,
                        "total": data.data.length
                    })
                })                                                                                                                                                                                                                                              
            }
            InitModalRadioTable({
                tableSelector: '#quotation-table',  // #tableID
                toolbarSelector: '#toolbar',        // #toolbarID
                columns: columnsFilterQuotationModal,
                hideColumns: defaultHideFilterQuotationModal, // hide default column. If there is no cookie
                cookieID: 'quotation-modal',               // define cookie id 
                functionGrid: GetGridviewData,
            });
        })

      return () => {
      }
    }, [])

useEffect(() => {
    if(formContext.formState){
        setFormType(formContext.formState.formType)

        $(document).unbind().on("click", ".transferBR", function (e) {
            var tempRule;
            var brdocdate = props.getValues(`${props.DocumentItem.formName}[DocDate]`)
            props.barge?tempRule="booking-reservation-barge":tempRule="booking-reservation"
            if( props.userRule.includes(`transferfrom-${tempRule}`) && props.userRule.includes(`create-${tempRule}`)){
                if (window.$("#quotation-table").bootstrapTable("getSelections").length) {
                    var quotationUUID = window.$("#quotation-table").bootstrapTable('getSelections')[0].QuotationUUID;
                    var docNum = window.$("#quotation-table").bootstrapTable('getSelections')[0].DocNum;
             
                    if (formContext.formState.formType=="Update"){
                        ControlOverlay(true)
                        window.$("#BR-QuotationModal").modal("toggle");
                        // formContext.setStateHandle([{value:quotationUUID,label:docNum}], "QTOption");
                        formContext.getTransferFormQTData(quotationUUID,formContext.updateDataForTransfer,docNum)
                        window.$("#clearTableData").click()
                    
                        ControlOverlay(false)
                    }else{
                        ControlOverlay(true)
                        // console.log(formContext.voyageandTranshipmentState)
                        window.$("#BR-QuotationModal").modal("toggle");
                        navigate("/sales/container/booking-reservation/transfer-from-quotation/id=" + quotationUUID, { state: { formType: "Transfer", id: quotationUUID, docNum:docNum, date:brdocdate, voyageTranshipment:formContext.voyageandTranshipmentState} })
                    
                    }
                }

            }else{
                alert("You are not allowed to Transfer from Quotation, Please check your Permission.")
            }
            
        
            // if (getPermissionTransferFrom == true) {
            //     if (lastsegment.match("update2")) {
                    // $(".PageOverlay").show();
               
                        
                        // window.location.href = baseUrl + "/booking-reservation/transfer-from-quotation2?id=" + quotationUUID+"&BRDocDate="+brdocdate;
                    //     $("#dynamic-form-container").find("input[type=text], textarea").not(".docDate").not(".brNum").val("");
                    //     $(".transhipmentQuickForm").find(".transhipment").remove();
                    //     $(".TranshipmentCard").find(".TranshipmentCardRow").remove();
                    //     $("#dynamic-form-container").find(".select2js").not(".QuotationFilter").val("").trigger("change.select2");
                    //     $("#clearTableData").click()
                    //     getQuotationData(quotationUUID)
                    //     getTransferFromQTContainerAndCharges(quotationUUID)
                    // }
            // } 
            // else {
            //         var baseUrl = $(this).attr("data-baseUrl");
            //         if ($("#quotation-table").bootstrapTable("getSelections").length) {
            //             var quotationUUID = $("#quotation-table").bootstrapTable('getSelections')[0].QuotationUUID;
            //             window.location.href = baseUrl + "/booking-reservation/transfer-from-quotation2?id=" + quotationUUID + "&BRDocDate=" + brdocdate;
            //         }
            //     }
            // } else {
            //     alert("You are not allowed to Transfer from Quotation, Please check your Permission.")
            //     return false;
            // }
        });
    }

  return () => {
  }
}, [formContext.formState, formContext.updateDataForTransfer,formContext.voyageandTranshipmentState])
    
  return (
    <div className={`${props.DocumentItem.cardLength}`}>
        <div className="card document lvl1">
            <div className="card-header">
                <input type="hidden" id="UserUUID" />
                <h3 className="card-title">Document <input type="hidden" id={`${props.DocumentItem.formName}UUID`} />
                    <input type="hidden" id="UserPortCode" />
                </h3>
                <div className="card-tools">
                    <button type="button" className="btn btn-tool" data-card-widget="collapse">
                        <i className="fas fa-minus" data-toggle="tooltip" title="" data-placement="top" data-original-title="Collapse"></i>
                    </button>
                </div>
            </div>
            <div className="card-body">
                <div className="row">
                    {props.DocumentItem.element.map((res, index) => {
                        var name = res.name
                        return res.type === "input-text" ? (
													<div key={index} className={res.gridSize}>
														<div className='form-group'>
															<label className='control-label'>
																{res.title}
															</label>
															{res.specialFeature.includes("required") ? (
																<input
																	{...props.register(name, {
																		required: `${res.title} cannot be blank.`,
																	})}
																	className={`form-control ${res.className}`}
																	defaultValue={
																		res.defaultValue ? res.defaultValue : ""
																	}
																	data-target={res.dataTarget}
																	readOnly={
																		res.specialFeature.includes("readonly")
																			? true
																			: false
																	}
																/>
															) : (
																<input
																	{...props.register(name)}
																	className={`form-control ${res.className}`}
																	data-target={res.dataTarget}
																	defaultValue={
																		res.defaultValue ? res.defaultValue : ""
																	}
																	readOnly={
																		res.specialFeature.includes("readonly")
																			? true
																			: false
																	}
																/>
															)}
														</div>
													</div>
												) : res.type === "input-number" ? (
													<div key={index} className={res.gridSize}>
														<div className='form-group'>
															<label className='control-label'>
																{res.title}
															</label>
															{res.specialFeature.includes("required") ? (
																<input
																	type={"number"}
																	{...props.register(name, {
																		required: `${res.title} cannot be blank.`,
																	})}
																	className={`form-control ${res.className}`}
																	defaultValue={
																		res.defaultValue ? res.defaultValue : ""
																	}
																	data-target={res.dataTarget}
																/>
															) : (
																<input
																	type={"number"}
																	{...props.register(name)}
																	className={`form-control ${res.className}`}
																	defaultValue={
																		res.defaultValue ? res.defaultValue : ""
																	}
																	data-target={res.dataTarget}
																/>
															)}
															{/* {console.log(props.errors)} */}
														</div>
													</div>
												) : res.type === "flatpickr-input" ? (
													<div
														key={index}
														className={`${res.gridSize} ${
															res.specialFeature.includes("hidden")
																? "d-none"
																: ""
														}`}>
														<div className='form-group'>
															<label className={`control-label`}>
																{res.title}
															</label>
															<Controller
																name={name}
																id={res.id}
																control={props.control}
																render={({field: {onChange, value}}) => (
																	<>
																		<Flatpickr
																			{...props.register(name)}
																			data-target={res.dataTarget}
																			style={{backgroundColor: "white"}}
																			value={res.value ? res.value : ""}
																			onChange={(val) => {
																				val == null
																					? onChange(null)
																					: onChange(
																							moment(val[0]).format(
																								"DD/MM/YYYY"
																							),
																							res.dataTarget
																					  );
																				val == null
																					? formContext.setStateHandle(
																							null,
																							res.dataTarget
																					  )
																					: formContext.setStateHandle(
																							moment(val[0]).format(
																								"DD/MM/YYYY"
																							),
																							res.dataTarget
																					  );
																			}}
																			className={`form-control c-date-picker ${res.className}`}
																			options={{
																				dateFormat: "d/m/Y",
																			}}
																		/>
																	</>
																)}
															/>
														</div>
													</div>
												) : res.type === "dropdown-WithModal" ? (
													<div key={index} className={res.gridSize}>
														<div className='form-group'>
															<label className='control-label'>
																{res.title}
															</label>
															{props.DocumentItem.formName ==
															"ContainerReleaseOrder" ? (
																res.title == "BR No." ? (
																	<button
																		type='button'
																		className='BookingLink'
																		style={{padding: "0px 2px"}}>
																		<i className='fa fa-link'></i>
																	</button>
																) : (
																	""
																)
															) : (
																""
															)}
															{props.DocumentItem.formName ==
															"BookingReservation" ? (
																res.title == "QT No." ? (
																	<button
																		type='button'
																		className='QuotationLink'
																		style={{padding: "0px 2px"}}>
																		<i className='fa fa-link'></i>
																	</button>
																) : (
																	""
																)
															) : (
																""
															)}
															<div className={"input-group-append"}>
																<Controller
																	name={name}
																	control={props.control}
																	defaultValue={
																		res.defaultValue ? res.defaultValue : ""
																	}
																	render={({field: {onChange, value}}) => (
																		<Select
																			{...props.register(name)}
																			isClearable={true}
																			value={
																				value
																					? formContext.QTOption
																						? formContext.QTOption.find(
																								(c) => c.value === value
																						  )
																						: null
																					: null
																			}
																			onChange={(val) => {
																				val == null
																					? onChange(null)
																					: onChange(val.value);
																				val == null
																					? formContext.setStateHandle(
																							null,
																							res.dataTarget
																					  )
																					: formContext.setStateHandle(
																							val.value,
																							res.dataTarget
																					  );
																				res.onChange && res.onChange(val);
																			}}
																			options={
																				formContext.QTOption
																					? formContext.QTOption
																					: ""
																			}
																			className={`form-control ${res.className}`}
																			onKeyDown={handleKeydown}
																			classNamePrefix='select'
																			menuPortalTarget={document.body}
																			onMenuOpen={(val) => FindQuotation(val)}
																			styles={
																				props.verificationStatus
																					? globalContext.customStylesReadonly
																					: globalContext.customStyles
																			}
																		/>
																	)}
																/>
																<div
																	className={`input-group-append`}
																	style={{cursor: "pointer"}}>
																	<button
																		type='button'
																		className='btn btn-outline-secondary openModalQuotation'>
																		<i className='fa fa-search'></i>
																	</button>
																</div>
															</div>
														</div>
													</div>
												) : res.type === "textarea" ? (
													<div key={index} className={res.gridSize}>
														<div className='form-group'>
															<label className='control-label'>
																{res.title}
															</label>
															{res.specialFeature.includes("required") ? (
																<textarea
																	{...props.register(name, {
																		required: `${res.title} cannot be blank.`,
																	})}
																	className={`form-control ${res.className}`}
																	readOnly={
																		res.specialFeature.includes("readonly")
																			? true
																			: false
																	}
																/>
															) : (
																<textarea
																	{...props.register(name)}
																	className={`form-control ${res.className}`}
																	readOnly={
																		res.specialFeature.includes("readonly")
																			? true
																			: false
																	}
																/>
															)}
														</div>
													</div>
												) : (
													<div key={index} className={res.gridSize}>
														<div className='form-group'>
															<label className='control-label'>
																{res.title}
															</label>
															{props.DocumentItem.formName ==
															"ContainerReleaseOrder" ? (
																res.title == "BR No." ? (
																	<button
																		type='button'
																		className='BookingLink'
																		style={{padding: "0px 2px"}}>
																		<i className='fa fa-link'></i>
																	</button>
																) : (
																	""
																)
															) : (
																""
															)}
															{props.DocumentItem.formName ==
															"BookingReservation" ? (
																res.title == "QT No." ? (
																	<button
																		type='button'
																		className='QuotationLink'
																		style={{padding: "0px 2px"}}>
																		<i className='fa fa-link'></i>
																	</button>
																) : (
																	""
																)
															) : (
																""
															)}
															<Controller
																name={name}
																control={props.control}
																defaultValue={
																	res.defaultValue ? res.defaultValue : ""
																}
																render={({field: {onChange, value}}) => (
																	<Select
																		{...props.register(name)}
																		isClearable={true}
																		value={
																			value
																				? res.option
																					? res.option.find(
																							(c) => c.value === value
																					  )
																					: null
																				: null
																		}
																		onChange={(val) => {
																			val == null
																				? onChange(null)
																				: onChange(val.value);
																			val == null
																				? formContext.setStateHandle(
																						null,
																						res.dataTarget
																				  )
																				: formContext.setStateHandle(
																						val.value,
																						res.dataTarget
																				  );
																			res.onChange && res.onChange(val);
																		}}
																		onKeyDown={handleKeydown}
																		options={res.option ? res.option : ""}
																		className={`form-control ${res.className}`}
																		classNamePrefix='select'
																		menuPortalTarget={document.body}
																		styles={
																			props.verificationStatus
																				? globalContext.customStylesReadonly
																				: globalContext.customStyles
																		}
																	/>
																)}
															/>
														</div>
													</div>
												);
                    })}
                </div>
            </div>
        </div>
    </div>
  )
}

export default QuickFormDocument