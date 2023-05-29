import React, { useState, useContext, useEffect } from 'react'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import moment from "moment";
import Select from 'react-select'
import AsyncSelect from 'react-select/async';
import { CheckBoxHandle, GetUpdateData, CreateData, createCookie, GetReceiptSalesINvoice, GetChargesById, getCookie, GetTaxCodeById, GetBCChargesDescrption, GetBookingReservationContainerQty, ImportContainerCRO, GetCompaniesData, getCompanyDataByID, GetBranchData, getUNNumberByID, getHSCodeByID, getContainers, getChargesByContainerTypeAndPortCode, getContainerTypeById } from '../../Components/Helper.js'
import FormContext from '../../Components/CommonElement/FormContext';
import GlobalContext from "../../Components/GlobalContext"
import QuickFormInnerContainer from "./QuickFormInnerContainer"
import $ from "jquery";
import axios from "axios"
import { ShareContainerModel } from "../../Components/BootstrapTableModal&Dropdown/ShareContainerModel";
import QuickFormTotalCard from '../../Components/CommonElement/QuickFormTotalCard.js';
// import NestedTableCharges from './NestedTableCharges.js';

function QuickFormContainer(props) {



    const formContext = useContext(FormContext)
    const globalContext = useContext(GlobalContext)
    var formName = props.ContainerItem.formName
    var formNameLowerCase = props.ContainerItem.formName.toLowerCase()
    const [calculateIndex, setCalculateIndex] = useState("")
    const [totalTax, setTotalTax] = useState("")
    const [totalAmount, setTotalAmount] = useState("")
    const [outstandingList, setOutstandingList] = useState([])
    const [removeState, setRemoveState] = useState(false)

  

    const gradeOption = []


    const OwnershipType = [
        {
            value: 'COC',
            label: 'COC',
        },
        {
            value: 'SOC',
            label: 'SOC',
        }
    ]


    function handleCalChargesGetIndexAndSetState(val, index) {
        setCalculateIndex(index)
        $(val.target).val(parseFloat($(val.target).val()).toFixed(2))
       
    }
    function handleKeydown(event){
        var Closest=$(event.target).parent().parent().parent().parent()
        if (event.key !== "Tab") {
            if($(Closest).hasClass("readOnlySelect")){
                event.preventDefault()
            }
        }
       
    }

    function handleCheckBox(index) {

        var tr = $($(".container-items")[index])

        var unappliedamount = $("input[name='CustomerPayment[UnappliedAmount]']").val();
        if (unappliedamount == "") {
            alert("Please fill in amount");
            tr.find(".knofkoffchooser").prop("checked",false)
        } else {

            if (tr.find(".knofkoffchooser").prop("checked")) {

                tr.find(".knockoffamount").prop("readonly", false);
                var oustanding = tr.find(".Outstanding").val();
                var amount = tr.find(".salesinvoiceamount").val();

            
                var check = parseFloat(unappliedamount) - parseFloat(oustanding);

              
                if (check >= 0) {

                    var knockoffamount = oustanding;

                    tr.find(".knockoffamount").val(knockoffamount);
                    var newunappliedamount = (parseFloat(unappliedamount) - parseFloat(knockoffamount)).toFixed(2);

                    $("input[name='CustomerPayment[UnappliedAmount]']").val(parseFloat(newunappliedamount).toFixed(2));
                    var newoutstanding = parseFloat(oustanding) - parseFloat(knockoffamount);

                    tr.find(".Outstanding").val(newoutstanding.toFixed(2));
                }
                else if (check < 0) {

                    var unappliedamount = $("input[name='CustomerPayment[UnappliedAmount]']").val();

                    tr.find(".knockoffamount").val((parseFloat(unappliedamount)).toFixed(2));
                    var newknockoffamount = tr.find(".knockoffamount").val();
                    var newunappliedamount = parseFloat(newknockoffamount) - parseFloat(newknockoffamount);

                    $("input[name='CustomerPayment[UnappliedAmount]']").val(parseFloat(newunappliedamount).toFixed(2));

                    var newoutstanding = parseFloat(oustanding) - parseFloat(unappliedamount);
                    tr.find(".Outstanding").val(newoutstanding.toFixed(2));

                }

            }

            else {

                tr.find(".knockoffamount").prop("readonly", true);
                var unappliedamount = $("input[name='CustomerPayment[UnappliedAmount]']").val();
                var knockoffamount = tr.find(".knockoffamount").val();
                if (knockoffamount == "") {
                    knockoffamount = 0.00;
                }
                var outstanding = tr.find(".Outstanding").val();

                tr.find(".knockoffamount").val("0.00");
                var newunappliedamount = (parseFloat(knockoffamount) + parseFloat(unappliedamount)).toFixed(2);
                $("input[name='CustomerPayment[UnappliedAmount]']").val(parseFloat(newunappliedamount).toFixed(2));
                var newoustanding = (parseFloat(knockoffamount) + parseFloat(outstanding)).toFixed(2);
                tr.find(".Outstanding").val(newoustanding);

            }

        }

    }



    var ContainerColumn = [

        { columnName: "Date", inputType: "input", defaultChecked: true, name: "DocDate", fieldClass: "", class: "", onChange: "", readOnly: true },
        { columnName: "Doc Type", inputType: "input", defaultChecked: true, name: "DocType", fieldClass: "", class: "", onChange: "", readOnly: true },
        { columnName: "Doc No.", inputType: "input", defaultChecked: true, name: "DocNum", fieldClass: "", class: "", onChange: "", readOnly: true },
        { columnName: "Amount", inputType: "input", defaultChecked: true, name: "SalesInvoiceAmount", fieldClass: "salesinvoiceamount inputDecimalFourPlaces", class: "", onChange: "", readOnly: true },
        { columnName: "Outstanding", inputType: "input", defaultChecked: true, name: "Outstanding", fieldClass: "Outstanding inputDecimalFourPlaces", class: "", onChange: "", readOnly: true },
        { columnName: "KnockOff Amount", inputType: "input", defaultChecked: true, name: "KnockOffAmount", fieldClass: "knockoffamount inputDecimalFourPlaces", class: "", onChange: "", readOnly: true,onBlur: handleCalChargesGetIndexAndSetState },
        { columnName: "", inputType: "checkbox", defaultChecked: true, name: "chooser", fieldClass: "knofkoffchooser", class: "", check: "",onChange: "", disabled: true },
        { columnName: "Gain/Loss", inputType: "input", defaultChecked: true, name: "gain", fieldClass: "", class: "", onChange: "", readOnly: true },
        { columnName: "Status", inputType: "input", defaultChecked: true, name: "Status", fieldClass: "", class: "", onChange: "", readOnly: true },

    ]


    if (getCookie('salescreditnotecolumn')) {
        var getCookieArray = getCookie('salescreditnotecolumn');
        var getCookieArray = JSON.parse(getCookieArray);

        $.each(ContainerColumn, function (key, value) {
            value.defaultChecked = false
            value.class = "d-none"
        })

        $.each(getCookieArray, function (key, value) {
            $.each(ContainerColumn, function (key2, value2) {

                if (value == key2) {
                    value2.defaultChecked = true
                    value2.class = ""
                }
            })
        })
    }





    function handleCalculate(index) {
        var arrayknockoff=[];
        var totalknockoff=0.00;
        var tr = $($(".container-items")[index]) 
        var receiveamount=$("input[name='CustomerPayment[ReceiveAmount]']").val();
        var knockoffamount = tr.find(".knockoffamount").val();   
        var invuuid = tr.find(".salesinvoiceuuid").val();
        var dnuuid = tr.find(".debitnoteuuid").val();
        var docnum = (invuuid != "") ? invuuid : dnuuid;

        if(knockoffamount==""){ 
            var knockoffamount="0.00";
        }
        var outstanding=outstandingList[docnum]
        
        var newoutstanding=(outstanding-parseFloat(knockoffamount)).toFixed(2);
        tr.find(".Outstanding").val(newoutstanding);
        $("input[name='CustomerPayment[UnappliedAmount]']").val((parseFloat(receiveamount)-parseFloat(knockoffamount)).toFixed(2));
      

            $(".commontable").find("tr").each(function () {
                        
                $(this).find(".knockoffamount ").each(function () {
                    var tds = $(this).val();
                    if(tds==""){
                       tds="0.00";
                    }
                   
                    if(tds!==" "|| tds!=="0.00"){
                        arrayknockoff.push(tds);
                    }
        
                });   
                // $("#salesinvoice-totalamount").val(totalamount.toFixed(2));
                
              
            });
           
            for (var i = 0; i < arrayknockoff.length; i++) {
               
                totalknockoff = parseFloat(totalknockoff)+parseFloat(arrayknockoff[i]);
            }

            $("input[name='CustomerPayment[UnappliedAmount]']").val((parseFloat(receiveamount)-parseFloat(totalknockoff)).toFixed(2));
    }


    // useEffect(() => {
    //     if (formContext.formState.formNewClicked) {
    //         remove()
    //         appendContainerHandle()
    //     }
    //     // appendContainerHandle() 

    // }, [formContext.formState])


    useEffect(() => {
        if (calculateIndex !== "") {
            handleCalculate(calculateIndex)
            setCalculateIndex("")
        }
    }, [calculateIndex])

    useEffect(() => {

        if (props.containerData) {
         

            setValue("CustomerPayment[CheckNum]",props.containerData.CustomerPayment.CheckNum)
            setValue("CustomerPayment[ReceivableMethod]",props.containerData.CustomerPayment.ReceivableMethod)
            setValue("CustomerPayment[UnappliedAmount]",props.containerData.CustomerPayment.UnappliedAmount)
            setValue("CustomerPayment[ReceiveAmount]",props.containerData.CustomerPayment.ReceiveAmount)

            remove()
            var newData=props.containerData.CustomerPaymentHasInvoice
            var arrayOutstanding=[]
            $.each(newData, function (key, value) {

                var arrayDynamic = []
                var tempObject = {}
                var docType = ""
                var DocDate = ""
                var INVDocNum=""
                var DNDocNum=""
                var INVDocUUID = ""
                var DNDocUUID = ""
                var TotalAmount = ""
                var Outstanding = ""
                var Status = ""
                
                if (value.SalesInvoice) {
                    if(value.salesInvoice){
                        DocDate = moment(moment.unix(value.salesInvoice.DocDate).toDate()).format("DD/MM/YYYY")
                        INVDocNum = value.salesInvoice.DocNum
                        INVDocUUID=value.salesInvoice.SalesInvoiceUUID
                        docType = "INV"
                        TotalAmount = parseFloat(value.salesInvoice.TotalAmount).toFixed(2)
                        Outstanding = parseFloat(value.salesInvoice.OutstandingAmount).toFixed(2)
                        Status = value.salesInvoice.VerificationStatus
    
                    }
                
                } else if (value.DebitNote) {
                    if(value.debitNote){
                        DocDate = moment(moment.unix(value.debitNote.DocDate).toDate()).format("DD/MM/YYYY")
                        DNDocNum = value.debitNote.DocNum
                        DNDocUUID=value.debitNote.SalesDebitNoteUUID
                        docType = "DN"
                        TotalAmount = parseFloat(value.debitNote.TotalAmount).toFixed(2)
                        Outstanding = parseFloat(value.debitNote.OutstandingAmount).toFixed(2)
                        Status = value.debitNote.VerificationStatus
                    }
              
                }
                // tempObject.Name = `${formName}HasItem`;
                value.ContainerItem = ContainerColumn
                value.DocDate = DocDate
                value.ContainerItem[6].check = false
                //value.SalesInvoiceUUID = value.SalesInvoice
                value.DocumentNumber =docType=="INV"?INVDocNum:DNDocNum
                value.SalesInvoiceAmount = TotalAmount
                value.Outstanding = Outstanding
                value.KnockOffAmount = value.KnockOffAmount?parseFloat(value.KnockOffAmount).toFixed(2):value.KnockOffAmount
                value.CustomerPaymentHasInvoiceUUID=value.CustomerPaymentHasInvoiceUUID


                if (docType=="INV"){
                     
                    arrayOutstanding[INVDocUUID] = Outstanding

                }else{
                  
                    arrayOutstanding[DNDocUUID] = Outstanding
               
                }
                if (Status != "Approved") {
                    value.Status = "Pending"
                    value.ContainerItem[6].disabled = true
                    value.ContainerItem[6].fieldClass = "readonlyCheckbox"
                    // $(".container-item").last().find(".knofkoffchooser").prop("disabled",true);
                } else {
                    value.Status = "Approved"
                    value.ContainerItem[6].disabled = false
                    value.ContainerItem[6].fieldClass = "knofkoffchooser"
                    // $(".container-item").last().find(".knofkoffchooser").prop("disabled",false);
                }

                if (value.KnockOffAmount != null && value.KnockOffAmount > 0){
                  
                    value.ContainerItem[6].check = true
                }

            
                arrayDynamic.push(value);

                append(arrayDynamic)
                setValue(`data[${key}][DocDate]`, DocDate)
                setValue(`data[${key}][DocumentNumber]`, docType=="INV"?INVDocNum:DNDocNum)
                setValue(`data[${key}][SalesInvoice]`, INVDocUUID)
                setValue(`data[${key}][DebitNote]`, DNDocUUID)
                setValue(`data[${key}][Outstanding]`, Outstanding)
                setValue(`data[${key}][DocType]`, docType)



            })

            setOutstandingList(arrayOutstanding)



        }
        return () => {
            update(fields)
        }
    }, [props.containerData])




    if (getCookie(`${formNameLowerCase}containercolumn`)) {
        var getCookieArray = getCookie(`${formNameLowerCase}containercolumn`);
        var getCookieArray = JSON.parse(getCookieArray);

        $.each(ContainerColumn, function (key, value) {
            value.defaultChecked = false
            value.class = "d-none"
        })

        $.each(getCookieArray, function (key, value) {
            $.each(ContainerColumn, function (key2, value2) {

                if (value == key2) {
                    value2.defaultChecked = true
                    value2.class = ""
                }
            })
        })
    }

    const { register, handleSubmit, setValue, trigger, getValues, reset, control, watch, formState: { errors } } = useForm({
        mode: "onChange",

    });
    const {
        fields,
        append,
        prepend,
        remove,
        swap,
        update,
        move,
        insert,
        replace
    } = useFieldArray({
        control,
        name: `${formName}HasInvoice`
    });







    //set Default for First Came in
    useEffect(() => {

    
        if(formContext.formState.formType=="New"){
            remove()
        }
        $("#customerpaymentbillto-branchcode").unbind().on("change", function () {

            GetReceiptSalesINvoice($(this).val(), globalContext).then(res => {

                remove()
                var tempArray = []
                var arrayOutstanding=[]
                $.each(res.data, function (key, value) {
                    if (value.Valid == "1" && value.OutstandingAmount > 0) {

                        tempArray.push(value)
                    }
                    $.each(value.salesDebitNotes, function (key1, value1) {
                        if (value1.Valid == "1" && value1.OutstandingAmount > 0) {
                            tempArray.push(value1)
                        }
                    })

                })




                $.each(tempArray, function (key, value) {

                    var arrayDynamic = []
                    var tempObject = {} 
               
                    var docType = ""
                    // tempObject.Name = `${formName}HasItem`;
                    tempObject.ContainerItem = ContainerColumn
                    tempObject.DocDate = moment(moment.unix(value.DocDate).toDate()).format("DD/MM/YYYY")

                    tempObject.SalesInvoiceUUID = value.SalesInvoiceUUID
                    tempObject.DocNum = value.DocNum
                    tempObject.SalesInvoiceAmount = value.TotalAmount
                    tempObject.Outstanding = value.OutstandingAmount

                    if (value.SalesInvoiceUUID) {
                        tempObject.DocType = "INV"
                        docType = "INV"
                    } else {
                        tempObject.DocType = "DN"
                        docType = "DN"
                    }

                    if (value.VerificationStatus != "Approved") {
                        tempObject.Status = "Pending"
                        tempObject.ContainerItem[6].disabled = true
                        // $(".container-item").last().find(".knofkoffchooser").prop("disabled",true);
                    } else {
                        tempObject.Status = "Approved"
                        tempObject.ContainerItem[6].disabled = false
                        // $(".container-item").last().find(".knofkoffchooser").prop("disabled",false);
                    }

                    if (docType=="INV"){
                     
                        arrayOutstanding[value.SalesInvoiceUUID] = value.OutstandingAmount

                    }else{
                      
                        arrayOutstanding[value.SalesDebitNoteUUID] = value.OutstandingAmount
                   
                    }
           
                    arrayDynamic.push(tempObject);

                    append(arrayDynamic)
                    setValue(`data[${key}][DocDate]`, moment(moment.unix(value.DocDate).toDate()).format("DD/MM/YYYY"))
                    setValue(`data[${key}][DocNum]`, value.DocNum)
                    setValue(`data[${key}][DocumentNumber]`, value.DocNum)
                    setValue(`data[${key}][SalesInvoice]`, docType=="INV"? value.SalesInvoiceUUID:"")
                    setValue(`data[${key}][DebitNote]`, docType=="DN"? value.SalesDebitNoteUUID:"")
                    setValue(`data[${key}][Outstanding]`, value.OutstandingAmount)
                    setValue(`data[${key}][DocType]`, docType)
                })
                setOutstandingList(arrayOutstanding)
             

            })
        })


        $("input[name='CustomerPayment[ReceiveAmount]']").on("change", function () {

            if ($(this).val() !== "") {
                $(this).val(parseFloat($(this).val()).toFixed(2))
                $("input[name='CustomerPayment[UnappliedAmount]']").val(parseFloat($(this).val()).toFixed(2));
            }

            // var branchcode=$("#customerpayment-branchcode").val();
            $.each($(".knofkoffchooser"), function () {
                $(this).prop('checked', false);
            });



            $(".commontable").find("tr").each(function () {
                var tr = $(this).closest("tr");
                var knockoffamount = tr.find(".knockoffamount").val();
                if (knockoffamount == "") {
                    knockoffamount = 0;
                }
                var oustanding = tr.find(".Outstanding").val();
                var newoustanding = parseFloat(oustanding) + parseFloat(knockoffamount);

           
                tr.find(".Outstanding").val(newoustanding.toFixed(2));

                var knockoffamount = tr.find(".knockoffamount").val("");


            });

        });



        update(fields)
    }, [props])

    function appendContainerHandle() {
        append({ "ContainerItem": ContainerColumn })
    }

    function removeContainerHandle(index) {
        remove(index)
        update(fields)
        setRemoveState(true)
    }
    $(document).unbind().on("change", ".columnChooserColumn", function (event) {

        // var index = ($(this).parent().parent().attr('id')).split("-")[1]

        var Cookies = []

        $(this).parent().parent().find(".columnChooserColumn:checked").each(function () {

            Cookies.push($(this).parent().index())

        });

        var json_str = JSON.stringify(Cookies);
     
        createCookie(`${formNameLowerCase}column`, json_str, 3650);


        if (fields.length > 0) {

            if (fields[0].Name == `${formName}HasItem`) {

                $.each(fields, function (key, value) {
                    if ($(event.target).prop("checked")) {
                        value.ContainerItem[$(event.target).parent().index()].class = ""
                    } else {
                        value.ContainerItem[$(event.target).parent().index()].class = "d-none"
                    }

                })
                update(fields)
            }

        }

    })

    function openTextAreaModal(event) {
        window.$(event.target).next().modal("toggle");
    }


    useEffect(() => {
        trigger()
        return () => {
        }
    }, [fields])


    return (
        <>
            <div className={`${props.ContainerItem.cardLength}`}>
                <div className="card charges ContainerCharges lvl1">
                    <div className="card-header">
                        <h3 className="card-title">{props.ContainerItem.cardTitle}</h3>
                        <div className="card-tools">
                            <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                <i className="fas fa-minus" data-toggle="tooltip" title="" data-placement="top" data-original-title="Collapse"></i>
                            </button>
                        </div>
                    </div>
                    <div className="card-body">


                        <div className="row">
                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label" >Receivable Method
                                    </label>
                                    <Controller
                                        name="CustomerPayment[ReceivableMethod]"
                                        id="Grade"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("CustomerPayment[ReceivableMethod]")}
                                                value={value ? props.receivableMethod.find(c => c.value === value) : null}
                                                onChange={val => { val == null ? onChange(null) : onChange(val.value) }}
                                                options={props.receivableMethod}
                                                onKeyDown={handleKeydown}
                                                className="form-control receivableMethod"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Check No.</label>

                                    <input defaultValue='' {...register("CustomerPayment[CheckNum]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Amount</label>

                                    <input defaultValue='' {...register("CustomerPayment[ReceiveAmount]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Unapplied Amount</label>

                                    <input defaultValue='' {...register("CustomerPayment[UnappliedAmount]")} className={`form-control`} readOnly />
                                </div>
                            </div>

                        </div>

                        <div className="card">
                            <div className='card-body'>



                                <div className="btn-group float-right mb-2" id="columnchooserdropdown">
                                    <button type="button" className="btn btn-secondary btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i className="fa fa-th-list" data-toggle="tooltip" title="Column Chooser" data-placement="top"></i>
                                    </button>
                                    <div className="dropdown-menu dropdown-menu-left  scrollable-columnchooser">
                                        {ContainerColumn.map((item, index) => {
                                            return (
                                                <label key={index} className="dropdown-item dropdown-item-marker">
                                                    {item.defaultChecked ? <input type="checkbox" className="columnChooserColumn" defaultChecked /> : <input type="checkbox" className="columnChooserColumn" />}
                                                    {item.columnName}
                                                </label>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="table_wrap">
                                    <div className="table_wrap_inner">

                                        <table className="table table-bordered commontable" style={{ width: "100%" }}>
                                            <thead>
                                                <tr>


                                                    {fields.length > 0 ?
                                                        fields[0].ContainerItem ?
                                                            fields[0].ContainerItem.map((item, index) => {
                                                                return (
                                                                    <th key={item.id} className={item.class}>{item.columnName}</th>
                                                                )
                                                            })
                                                            : ContainerColumn.map((item, index) => {
                                                                return (
                                                                    <th key={item.id} className={item.class}>{item.columnName}</th>
                                                                )
                                                            })
                                                        : ContainerColumn.map((item, index) => {
                                                            return (
                                                                <th key={item.id} className={item.class}>{item.columnName}</th>
                                                            )
                                                        })
                                                    }
                                                </tr>
                                            </thead>
                                            <tbody className="ContainerType container-item">

                                                {fields.map((item, index) => {
                                                    return (
                                                        <>
                                                            <tr key={item.id} className="container-items">

                                                                {
                                                                    item.ContainerItem ?
                                                                        item.ContainerItem.map((item2, index2) => {
                                                                            if (item2.inputType == "input") {

                                                                                if (item2.name == "DocType" || item2.name == "DocNum" || item2.name == "Outstanding") {
                                                                                    var tempName = "data"

                                                                                } else {
                                                                                    var tempName = `${formName}HasInvoice`
                                                                                }

                                                                                if (index2 == 0) {


                                                                                    return (

                                                                                        <td className={item2.class}>

                                                                                            <input defaultValue='' {...register( "CustomerPaymentHasInvoice"+'[' + index + ']' + '[CustomerPaymentHasInvoiceUUID]')} className={`form-control d-none`} />

                                                                                            {item2.requiredField ?
                                                                                                <input defaultValue={item2.defaultValue ? item2.defaultValue : ""} readOnly={item2.readOnly ? item2.readOnly : false} {...register(tempName + '[' + index + ']' + '[' + item2.name + ']', { required: "required" })}
                                                                                                    className={`form-control ${item2.fieldClass ? item2.fieldClass : ""} ${errors[tempName] ? errors[tempName][`${index}`] ? errors[tempName][`${index}`][`${item2.name}`] ? "has-error" : "" : "" : ""}`} onBlur={(val) => { val ? item2.onBlur(val, index) : item2.onBlur(null, index) }} />
                                                                                                :
                                                                                                <input defaultValue={item2.defaultValue ? item2.defaultValue : ""} readOnly={item2.readOnly ? item2.readOnly : false} {...register(tempName + '[' + index + ']' + '[' + item2.name + ']')} className={`form-control ${item2.fieldClass ? item2.fieldClass : ""}`} onBlur={(val) => { val ? item2.onBlur(val, index) : item2.onBlur(null, index) }} />
                                                                                            }

                                                                                        </td>

                                                                                    )
                                                                                } else {

                                                                                    if(item2.name=="DocNum"){
                                                                                        return (

                                                                                            <td className={item2.class}>
                                                                                                 <input defaultValue='' {...register( "data"+'[' + index + ']' + '[SalesInvoice]')} className={`form-control d-none salesinvoiceuuid`} readOnly />
                                                                                                 <input defaultValue='' {...register( "data"+'[' + index + ']' + '[DebitNote]')} className={`form-control d-none debitnoteuuid`} readOnly/>
                                                                                                 
                                                                                                 <input defaultValue='' {...register( "data"+'[' + index + ']' + '[DocumentNumber]')} className={`form-control`} readOnly/>
                                                                                             
                                                                                            </td>
    
                                                                                        )

                                                                                    }else{
                                                                                        return (

                                                                                            <td className={item2.class}>
    
                                                                                                {item2.requiredField ?
                                                                                                    <input defaultValue={item2.defaultValue ? item2.defaultValue : ""} readOnly={item2.readOnly ? item2.readOnly : false} {...register(tempName + '[' + index + ']' + '[' + item2.name + ']', { required: "required" })}
                                                                                                        className={`form-control ${item2.fieldClass ? item2.fieldClass : ""} ${errors[tempName] ? errors[tempName][`${index}`] ? errors[tempName][`${index}`][`${item2.name}`] ? "has-error" : "" : "" : ""}`} onBlur={(val) => { val ? item2.onBlur(val, index) : item2.onBlur(null, index) }} />
                                                                                                    :
                                                                                                    <input defaultValue={item2.defaultValue ? item2.defaultValue : ""} readOnly={item2.readOnly ? item2.readOnly : false} {...register(tempName + '[' + index + ']' + '[' + item2.name + ']')} className={`form-control ${item2.fieldClass ? item2.fieldClass : ""}`} onBlur={(val) => { val ? item2.onBlur(val, index) : item2.onBlur(null, index) }} />
                                                                                                }
    
                                                                                            </td>
    
                                                                                        )
                                                                                    }

                                                              
                                                                                }



                                                                            } else if (item2.inputType == "checkbox") {
                                                                           
                                                                                return (
                                                                                    <td className={item2.class} style={{ textAlign: "center", verticalAlign: "middle" }}>
                                                                                        <input type={"checkbox"} disabled={item2.disabled}   defaultChecked={item2.check} className={`mt-2 ${item2.fieldClass ? item2.fieldClass : ""}`}  onChange={() => handleCheckBox(index)}></input>

                                                                                    </td>
                                                                                )
                                                                            }





                                                                        })
                                                                        : ""

                                                                }
                                                            </tr>


                                                        </>
                                                    )
                                                })}

                                            </tbody>

                                        </table>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default QuickFormContainer