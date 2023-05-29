
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext";
import { createCookie, getCookie, getAreaById,getPortDetails,getRemainingBCbyID,GetCompaniesData,LoadPartialBCById } from '../../Components/Helper.js'
import Select from 'react-select';
import $ from "jquery";
import axios from "axios"
import QuickFormDocument from "../../Components/CommonElement/QuickFormDocument";
import QuickFormShippingInstruction from "../../Components/CommonElement/QuickFormShippingInstruction";
import QuickFormMiddleCard from '../../Components/CommonElement/QuickFormMiddleCard';
import FormContext from '../../Components/CommonElement/FormContext';
import QuickFormContainer from '../../Components/CommonElement/QuickFormContainer';

function QuickForm(props) {
  const formContext = useContext(FormContext)
  const globalContext = useContext(GlobalContext)
  const [Date, setDate] = useState("")
  const [BCDate, setBCDate] = useState("")
  const [containerTypeAndChargesDataPartial, setContainerTypeAndChargesDataPartial] = useState([])

  
  if (globalContext.userRule !== "") {
    const objRule = JSON.parse(globalContext.userRule);
    var tempModel;
    props.barge?tempModel="booking-reservation-barge":tempModel="booking-reservation"
    var filteredAp = objRule.Rules.filter(function (item) {
      return item.includes(tempModel) ||  item.includes(props.barge?"sales-invoice-barge":"sales-invoice");
    });
  
  }


  function getContainerCodeByContainerType(val){
  }
  function getCOCCompany(val, index) {
  }
  function getBoxOperatorBranchByBoxOperatorCompany(val){
  }
  function onChangeUNNumber(val){
  }
  function getBoxOperatorBranchName(val){
  }

  function confirmTransferTo(type){
    
    var array = [];
    var arrayCheckingBillTo = []
    $(".checkboxCharges:checked").each(function () {
      if(props.barge){
        var chargesIndex=$(this).parent().parent().parent().index()
      }else{
        var chargesIndex=$(this).parent().parent().parent().parent().index()     
      }
      var ContainerIndex=$(this).parent().parent().parent().parent().closest(".ChargesTable").prev().index()
 
       chargesIndex=chargesIndex==0?chargesIndex:(chargesIndex/2)
       ContainerIndex=ContainerIndex==0?ContainerIndex:(ContainerIndex/2)
 
       var closestContainerArrayList=$(this).parent().parent().parent().parent().closest(".ChargesTable").prev().find(".containerArrayList").val()
        if(closestContainerArrayList!==""){
          $.each(closestContainerArrayList.split(','), function (key, value) {
            var ChargesCode = $(`input[name='BookingConfirmationHasContainerType[${ContainerIndex}][BookingConfirmationCharges][${chargesIndex}][BookingConfirmationChargesUUID]']`).val()
            var Charges = {
             CustomerType: $(`input[name='BookingConfirmationHasContainerType[${ContainerIndex}][BookingConfirmationCharges][${chargesIndex}][CustomerType]']`).val(),
             BillTo: $(`input[name='BookingConfirmationHasContainerType[${ContainerIndex}][BookingConfirmationCharges][${chargesIndex}][BillTo]']`).val()
            }
            array.push(ChargesCode);
            arrayCheckingBillTo.push(Charges)
         })
        }
     
 
       
    });
    var uniqueArray = arrayCheckingBillTo.filter((obj, index, self) => {
      return index === self.findIndex(t => (
          t.CustomerType === obj.CustomerType && t.BillTo === obj.BillTo
      ));
    });
    
    if(uniqueArray.length >1){
      alert("Selected Charges must correspond with All the Bill To Type and the Branch of the Bill To Company")
    }else{
      if(type == "BookingConfirmation"){
        window.$("#TransferToCROINVModal").modal("toggle")
        window.$("#TransferToSalesInvoiceModal").modal("toggle")
        if(props.barge){
          props.navigate("/sales/standard/sales-invoice-barge/transfer-from-booking-reservation-data/id=" + props.bookingComfirmationData.BookingConfirmationUUID, { state: { formType: "TransferFromBooking", id: props.bookingComfirmationData.BookingConfirmationUUID, CustomerType:uniqueArray[0]["CustomerType"], BranchCode:uniqueArray[0]["BillTo"],ChargesID:array,transferFromModel:"booking-confirmation"} })
        }else{
          props.navigate("/sales/container/sales-invoice/transfer-from-booking-reservation-data/id=" + props.bookingComfirmationData.BookingConfirmationUUID, { state: { formType: "TransferFromBooking", id: props.bookingComfirmationData.BookingConfirmationUUID, CustomerType:uniqueArray[0]["CustomerType"], BranchCode:uniqueArray[0]["BillTo"],ChargesID:array,transferFromModel:"booking-confirmation"} })
        }
       
      }
    }


  }


  function loadCompanyOptions(inputValue){
    const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "company/get-company-by-company-name?search=" + inputValue + "&companyType=Box Operator&q=" + inputValue, {
    auth: {
        username: globalContext.authInfo.username,
        password: globalContext.authInfo.access_token,
    },
    }).then(res => res.data.data)
    return response
  }

  const loadUNNumberOptions = (inputValue) => {

    const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "u-n-number/get-u-n-number-by-u-n-number?term=" + inputValue +"&_type=query&q="+inputValue, {

        auth: {
            username: globalContext.authInfo.username,
            password: globalContext.authInfo.access_token,
        },
    }).then(res => res.data.data)

    return response

  }

  const loadHSCodeOptions = (inputValue) => {

    const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "h-s-code/get-h-s-code-by-heading?q=" + inputValue, {

        auth: {
            username: globalContext.authInfo.username,
            password: globalContext.authInfo.access_token,
        },
    }).then(res => res.data.data)

    return response

  }
  $(".FormTransferPartialToInvoice").off("click").on("click", function(){
    var val;
    var type;
    props.barge?val="create-sales-invoice-barge":val="create-sales-invoice";
    if(filteredAp.includes(`transferto-${tempModel}`) && filteredAp.includes(val)){
      
      if($(".VerificationStatusField").text()==""){
        props.barge?type='barge':type="normal"

        getRemainingBCbyID(props.bookingComfirmationData.BookingConfirmationUUID, globalContext,type).then(res => {
          if (res) {
            window.$("#TransferToSalesInvoiceModal").modal("toggle")
            LoadPartialBCById(props.bookingComfirmationData.BookingConfirmationUUID, globalContext,type).then(res => {
              var tempData=res.data.BookingConfirmationHasContainerType
              $.each(tempData,function(key,value){
                var ArrayContainer=[]
                var ArrayContainer2=[]  
                if(value.bookingConfirmationContainer.length>0){
                  $.each(value.bookingConfirmationContainer,function(key2,value2){
                      ArrayContainer.push({ContainerUUID:value2.containerCode.ContainerUUID,ContainerCode:value2.containerCode.ContainerCode,SealNum:""})
                      ArrayContainer2.push(value2.containerCode.ContainerUUID)
                  })
                }
                value.ContainerCode=ArrayContainer
                value.ContainerArray=ArrayContainer2.join(',')
              })
        
              setContainerTypeAndChargesDataPartial(tempData)
            })
          }else{
            alert("This booking has been fully transferred")
          }

        })
  
      }else{
        alert("You are not allow to transfer to Sales Invoice, Please Verify Booking before Transfer.");
      }
    
    }else{
      alert("You are not allowed to transfer to Sales Invoice, Please check your Permission.")
    }
 
    
  })

  // useEffect(() => {
  //   if (props.containerTypeAndChargesData) {
  //     console.log(props.containerTypeAndChargesData)
  //   }
  //   return () => {
  //   }
  // }, [props.containerTypeAndChargesData])

  useEffect(() => {
    if(props.bookingComfirmationData){
      props.setValue(`DynamicModel[BKDocNum]`,props.bookingComfirmationData.DocNum)
      setBCDate(props.bookingComfirmationData.DocDate)
    }
    return () => {
    }
  }, [props.bookingComfirmationData])

  useEffect(() => {
    if(formContext.formState.formNewClicked || formContext.formState.formType == "SplitBR"){
      setBCDate("")
    }
    return () => {
    }
  }, [formContext.formState])
  


  useEffect(() => {
    if (props.shippingInstructionData) {
      if(props.shippingInstructionData.InsistTranshipment == 0){
        if (props.shippingInstructionData.VoyageNum) {
          if ($(".transhipment-item").length < 1) {
            formContext.setStateHandle([{ label: props.shippingInstructionData.VoyageName + "(" + props.shippingInstructionData.VesselCode + ")", value: props.shippingInstructionData.VoyageNum }], "QuickFormVoyageNum")
          }
        }
      }
      $.each(props.shippingInstructionData, function (key2, value2) {
        if(key2 == "VoyageNum"){
          if(value2){
            $(".OneOff").removeClass("d-none")
          }
        }
        if(key2 != "VesselCode"){
          if(key2 == "DocDate" && formContext.formState.formType == "Transfer"){
            props.setValue('DynamicModel[' + key2 + ']', formContext.formState.date);
          }else if(key2 == "VoyageNum"){
            if ($(".transhipment-item").length < 1) {
              props.setValue('DynamicModel[' + key2 + ']', value2);
            }
          }
          else{
            props.setValue('DynamicModel[' + key2 + ']', value2);
          }
        }
        
        if (key2 == "VesselCode") {
          if(props.shippingInstructionData.InsistTranshipment == 0){
            if ($(".transhipment-item").length < 1) {
              $("input[name='DynamicModel[VesselCode]']").val(value2)
            }
          }
        }
      
      })
      props.trigger()
    }
    return () => {
    }
    
  }, [props.shippingInstructionData])

  useEffect(() => {
    if (props.middleCardData) {
      if (props.middleCardData.Attention) {
        if(props.middleCardData.Attention.BookingReservationBillTo){
          if (props.middleCardData.Attention.BookingReservationBillTo.CompanyName) {
            props.setValue("DynamicModel[BillToCompany]",props.middleCardData.Attention.BookingReservationBillTo.CompanyName + "(" + props.middleCardData.Attention.BookingReservationBillTo.rOC.ROC + ")")
          }
        }
        if(props.middleCardData.Attention.BookingReservationShipper){
          if (props.middleCardData.Attention.BookingReservationShipper.CompanyName) {
            $("#CompanyROC-Shipper-Quickform").val(props.middleCardData.Attention.BookingReservationShipper.CompanyName + "(" + props.middleCardData.Attention.BookingReservationShipper.rOC.ROC + ")")
          }
        }
        if(props.middleCardData.Attention.BookingReservationShipOp){
          if (props.middleCardData.Attention.BookingReservationShipOp.CompanyName) {
            $("#CompanyROC-Voyage-Quickform").val(props.middleCardData.Attention.BookingReservationShipOp.CompanyName + "(" + props.middleCardData.Attention.BookingReservationShipOp.ROC + ")")
          }
        }
      }
      props.trigger()
    }
    return () => {
    }
  }, [props.middleCardData])

  useEffect(() => {
    setDate(formContext.docDate)
    return () => {
    }
  }, [formContext.docDate])

  const quotaitonTypeOptions = [
    {
      value : 'Advance Booking',
      label : 'Advance Booking',
    },
    {
      value : 'Empty',
      label : 'Empty',
    },
    {
      value : 'Feeder',
      label : 'Feeder',
    },
    {
      value : 'Joint Service',
      label : 'Joint Service',
    },
    {
      value : 'Normal',
      label : 'Normal',
    },
    {
      value : 'One-Off',
      label : 'One-Off',
    },
    {
      value : 'Purchase Slot',
      label : 'Purchase Slot',
    }] 

    const OwnershipType = [
      {
        value : 'COC',
        label : 'COC',
      },
      {
        value : 'SOC',
        label : 'SOC',
      }
    ]


  var DocumentItem ={
    formName:"BookingReservation",
    cardLength:"col-md-4",
    element : [
      {title:"BR No.", id:"dynamicmodel-docnum", className:"BookingLink OriReadOnlyClass", name:"DynamicModel[DocNum]", dataTarget:"DocNum", gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:["readonly"]},
      {title:"BR Doc Date", id:"dynamicmodel-docdate", className:"docDate flatpickr-input", name:"DynamicModel[DocDate]", dataTarget:"DocDate", value:Date, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input", onChange:"", specialFeature:['required']},
      {title:"BC No.", id:"dynamicmodel-bkdocnum", className:"text-primary BookingLink OriReadOnlyClass", name:"DynamicModel[BKDocNum]", dataTarget:"BKDocNum", gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:['readonly']},
      {title:"BC Doc Date", id:"dynamicmodel-bkdocdate", className:"pointerEventsStyle flatpickr-input OriReadOnlyClass", name:"DynamicModel[BKDocDate]", value:BCDate, dataTarget:"BKDocDate", gridSize:"col-xs-12 col-md-6", type:"flatpickr-input", specialFeature:['readonly']},
      {title:"QT No.", id:"dynamicmodel-quotation", className:"QuotationFilter getTransferFromQT readOnlySelect", name:"DynamicModel[Quotation]", dataTarget:"Quotation-Document", gridSize:"col-xs-12 col-md-6", type:"dropdown-WithModal", option:props.QTOption, onChange:props.transferFromQT, specialFeature:['']},
      {title:"Quotation Type ", id:"bookingreservation-quotationtype-quickform", className:"quotation_type", name:"BookingReservation[QuotationType]", dataTarget:"QuotationType", gridSize:"col-xs-12 col-md-6", type:"dropdown", option:quotaitonTypeOptions, onChange:props.changeQuotationType, specialFeature:['required']},
    ]
  }
  var ShippingInstructionItem ={
    formName:"BookingReservation",
    cardLength:"col-md-8",
  }

  var MiddleCardItem ={
    formName:"BookingReservation",
    cardLength:"col-md-12",
    cardTitle: "Customer",
    element : [
      {title:"Bill To", id:"CompanyROC-BillTo-Quickform", className:"dropdownInputCompany quotationRequired", name:"DynamicModel[BillToCompany]", dataTarget:"CompanyROC-BillTo", gridSize:"col-xs-12 col-md-4", type:"input-dropdownInputCompany", onChange:"", specialFeature:["required"]},
      {title:"Shipper", id:"CompanyROC-Shipper-Quickform", className:"dropdownInputCompany", name:"DynamicModel[ShipperCompany]", dataTarget:"CompanyROC-Shipper", gridSize:"col-xs-12 col-md-4", type:"input-dropdownInputCompany", onChange:"", specialFeature:[]},
      {title:"Ship Op", id:"CompanyROC-Voyage-Quickform", className:"dropdownInputCompany", name:"DynamicModel[VoyageCompany]", dataTarget:"CompanyROC-Voyage", gridSize:"col-xs-12 col-md-4", type:"input-dropdownInputCompany", onChange:"", specialFeature:[]},
    ]
  }

  var ContainerItem = {
    formName:"BookingReservation",
    cardLength:"col-md-12",
    cardTitle: "Containers & Charges",
    ContainerColumn: [
      { columnName: "Container Type", inputType: "single-select", defaultChecked: true, name: "ContainerType", fieldClass: "ContainerType Container_Type liveData RequiredFieldAddClass Live_ContainerType", options:props.containerType, class: "", onChange: getContainerCodeByContainerType, requiredField: true },
      { columnName: "Ownership Type", inputType: "single-select", defaultChecked: true, name: "BoxOwnership", fieldClass: "BoxOwnership RequiredFieldAddClass", options: OwnershipType, class: "", onChange: getCOCCompany, requiredField: true },
      { columnName: "QTY", inputType: "number", defaultChecked: true, name: "Qty", fieldClass: "Qty cal ParentQty isOverflow", min:"0", class: "", onChange:""},
      { columnName: "Empty", inputType: "checkbox", defaultChecked: true, name: "Empty", fieldClass: "Empty", class: "", onChange:""},
      { columnName: "Box Op Code", inputType: "single-asyncSelect", defaultChecked: false, name: "BoxOperator", fieldClass: "BoxOpCo Box_OpCompany remoteBoxOperatorCompany", class: "d-none", onChange:getBoxOperatorBranchByBoxOperatorCompany, loadOption:loadCompanyOptions, optionLabel:"CompanyName", optionValue:"CompanyUUID"},
      { columnName: "Box Op Co", inputType: "input", defaultChecked: true, name: "BoxOperatorName", fieldClass: "BoxOPCoLoad OriReadOnlyClass", class: "", onChange:"", readOnly: true},
      { columnName: "M3(m)", inputType: "input", defaultChecked: true, name: "M3", fieldClass: "cal M3 inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "N.KG", inputType: "input", defaultChecked: true, name: "NetWeight", fieldClass: "cal NetWeight inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "G.KG", inputType: "input", defaultChecked: true, name: "GrossWeight", fieldClass: "cal GrossWeight inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Length", inputType: "input", defaultChecked: true, name: "Length", fieldClass: "cal Length inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Width", inputType: "input", defaultChecked: true, name: "Width", fieldClass: "cal Width inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Height", inputType: "input", defaultChecked: true, name: "Height", fieldClass: "cal Height inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Tues", inputType: "number", defaultChecked: true, name: "Tues", fieldClass: "cal Tues decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Temp(°C)", inputType: "input", defaultChecked: true, name: "Temperature", fieldClass: "inputDecimalTwoPlaces decimalDynamicForm ReadTemperature OriReadOnlyClass", class: "", onChange:"", readOnly: true },
      { columnName: "UN Number", inputType: "single-asyncSelect", defaultChecked: true, name: "UNNumber", fieldClass: "UNNumber UN_Number", class: "", onChange:onChangeUNNumber, loadOption:loadUNNumberOptions, optionLabel:"UNNumber", optionValue:"UNNumberUUID"},
      { columnName: "DG Class", inputType: "input", defaultChecked: true, name: "DGClass", fieldClass: "DGClass DG_Class", class: "", onChange:""},
      { columnName: "HS Code", inputType: "single-asyncSelect", defaultChecked: false, name: "HSCode", fieldClass: "HS_Code", class:"d-none", onChange:"", loadOption:loadHSCodeOptions, optionLabel:"Heading", optionValue:"HSCodeUUID"},
      { columnName: "Commodity", inputType: "input", defaultChecked: false, name: "Commodity", fieldClass: "Commodity", class:"d-none", onChange:""},
      { columnName: "Box Op Branch Code", inputType: "single-select", defaultChecked: false, name: "BoxOperatorBranch", fieldClass: "BoxOpBranch", class:"d-none", onChange:getBoxOperatorBranchName},
      { columnName: "Box Op Branch Name", inputType: "input", defaultChecked: false, name: "BoxOperatorBranchName", fieldClass: "BoxOperatorBranchName OriReadOnlyClass", class:"d-none", onChange:"", readOnly: true},
      { columnName: "Mark", inputType: "input-Modal", defaultChecked: false, name: "Mark", fieldClass: "MarkReadonly", class:"d-none", modelClass:"TextMarks"},
      { columnName: "Goods Description", inputType: "input-Modal", defaultChecked: false, name: "GoodsDescription", fieldClass: "GoodDescriptionReadonly", class:"d-none", modelClass:"TextGoods"},
      { columnName: "Total Disc", inputType: "input", defaultChecked: false, name: "TotalDiscount", fieldClass: "inputDecimalTwoPlaces ContainerTotalDiscount OriReadOnlyClass", class:"d-none", readOnly: true},
      { columnName: "Total Tax", inputType: "input", defaultChecked: false, name: "TotalTax", fieldClass: "inputDecimalTwoPlaces ContainerTotalTax OriReadOnlyClass", class:"d-none", readOnly: true},
      { columnName: "Total Amount", inputType: "input", defaultChecked: false, name: "Total", fieldClass: "inputDecimalTwoPlaces ContainerTotalAmount OriReadOnlyClass", class:"d-none", readOnly: true},
    ]
  }

  var ContainerItemTransferPartial = {
    formName:"BookingConfirmation",
    cardLength:"col-md-12",
    cardTitle: "Containers & Charges",
    ContainerColumn: [
      { columnName: "Container Type", inputType: "single-select", defaultChecked: true, name: "ContainerType", fieldClass: "ContainerType Container_Type liveData RequiredFieldAddClass Live_ContainerType", options:props.containerType, class: "", onChange: getContainerCodeByContainerType, requiredField: true },
      { columnName: "Ownership Type", inputType: "single-select", defaultChecked: true, name: "BoxOwnership", fieldClass: "BoxOwnership RequiredFieldAddClass", options: OwnershipType, class: "", onChange: getCOCCompany, requiredField: true },
      { columnName: "QTY", inputType: "number", defaultChecked: true, name: "Qty", fieldClass: "Qty cal ParentQty isOverflow", min:"0", class: "", onChange:""},
      { columnName: "Empty", inputType: "checkbox", defaultChecked: true, name: "Empty", fieldClass: "Empty", class: "", onChange:""},
      { columnName: "Box Op Code", inputType: "single-asyncSelect", defaultChecked: false, name: "BoxOperator", fieldClass: "BoxOpCo Box_OpCompany remoteBoxOperatorCompany", class: "d-none", onChange:getBoxOperatorBranchByBoxOperatorCompany, loadOption:loadCompanyOptions, optionLabel:"CompanyName", optionValue:"CompanyUUID"},
      { columnName: "Box Op Co", inputType: "input", defaultChecked: true, name: "BoxOperatorName", fieldClass: "BoxOPCoLoad OriReadOnlyClass", class: "", onChange:"", readOnly: true},
      { columnName: "M3(m)", inputType: "input", defaultChecked: true, name: "M3", fieldClass: "cal M3 inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "N.KG", inputType: "input", defaultChecked: true, name: "NetWeight", fieldClass: "cal NetWeight inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "G.KG", inputType: "input", defaultChecked: true, name: "GrossWeight", fieldClass: "cal GrossWeight inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Length", inputType: "input", defaultChecked: true, name: "Length", fieldClass: "cal Length inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Width", inputType: "input", defaultChecked: true, name: "Width", fieldClass: "cal Width inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Height", inputType: "input", defaultChecked: true, name: "Height", fieldClass: "cal Height inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Tues", inputType: "number", defaultChecked: true, name: "Tues", fieldClass: "cal Tues decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Temp(°C)", inputType: "input", defaultChecked: true, name: "Temperature", fieldClass: "inputDecimalTwoPlaces decimalDynamicForm ReadTemperature OriReadOnlyClass", class: "", onChange:"", readOnly: true },
      { columnName: "UN Number", inputType: "single-asyncSelect", defaultChecked: true, name: "UNNumber", fieldClass: "UNNumber UN_Number", class: "", onChange:onChangeUNNumber, loadOption:loadUNNumberOptions, optionLabel:"UNNumber", optionValue:"UNNumberUUID"},
      { columnName: "DG Class", inputType: "input", defaultChecked: true, name: "DGClass", fieldClass: "DGClass DG_Class", class: "", onChange:""},
      { columnName: "HS Code", inputType: "single-asyncSelect", defaultChecked: false, name: "HSCode", fieldClass: "HS_Code", class:"d-none", onChange:"", loadOption:loadHSCodeOptions, optionLabel:"Heading", optionValue:"HSCodeUUID"},
      { columnName: "Commodity", inputType: "input", defaultChecked: false, name: "Commodity", fieldClass: "Commodity", class:"d-none", onChange:""},
      { columnName: "Box Op Branch Code", inputType: "single-select", defaultChecked: false, name: "BoxOperatorBranch", fieldClass: "BoxOpBranch", class:"d-none", onChange:getBoxOperatorBranchName},
      { columnName: "Box Op Branch Name", inputType: "input", defaultChecked: false, name: "BoxOperatorBranchName", fieldClass: "BoxOperatorBranchName OriReadOnlyClass", class:"d-none", onChange:"", readOnly: true},
      { columnName: "Mark", inputType: "input-Modal", defaultChecked: false, name: "Mark", fieldClass: "MarkReadonly", class:"d-none", modelClass:"TextMarks"},
      { columnName: "Goods Description", inputType: "input-Modal", defaultChecked: false, name: "GoodsDescription", fieldClass: "GoodDescriptionReadonly", class:"d-none", modelClass:"TextGoods"},
      { columnName: "Total Disc", inputType: "input", defaultChecked: false, name: "TotalDiscount", fieldClass: "inputDecimalTwoPlaces ContainerTotalDiscount OriReadOnlyClass", class:"d-none", readOnly: true},
      { columnName: "Total Tax", inputType: "input", defaultChecked: false, name: "TotalTax", fieldClass: "inputDecimalTwoPlaces ContainerTotalTax OriReadOnlyClass", class:"d-none", readOnly: true},
      { columnName: "Total Amount", inputType: "input", defaultChecked: false, name: "Total", fieldClass: "inputDecimalTwoPlaces ContainerTotalAmount OriReadOnlyClass", class:"d-none", readOnly: true},
    ]
  }

  return (
    <>
      <div className="QuickForm">
          <div className="row">
              <QuickFormDocument  barge={props.barge}  userRule={props.userRule} register={props.register} control={props.control} errors={props.errors} setValue={props.setValue} getValues={props.getValues} DocumentItem={DocumentItem}/>
              <QuickFormShippingInstruction barge={props.barge} bargeCode={props.bargeCode}  register={props.register} control={props.control} errors={props.errors} setValue={props.setValue} getValues={props.getValues} ShippingInstructionItem={ShippingInstructionItem} port={props.port} trigger={props.trigger}/>
              <QuickFormMiddleCard register={props.register} control={props.control} errors={props.errors} setValue={props.setValue} trigger={props.trigger} MiddleCardItem={MiddleCardItem}/>
              <QuickFormContainer userRule={props.userRule} barge={props.barge} register={props.register} control={props.control} errors={props.errors} setValue={props.setValue} getValues={props.getValues} ContainerItem={ContainerItem} containerType={props.containerType} port={props.port} freightTerm={props.freightTerm} taxCode={props.taxCode} currency={props.currency} cargoType={props.cargoType} containerTypeAndChargesData={props.containerTypeAndChargesData} documentData={props.documentData} setContainerTypeAndChargesData={props.setContainerTypeAndChargesData}/>
          </div>
      </div>

       {/* modalTransferPartial */}
       <div className="modal fade" id="TransferToSalesInvoiceModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Transfer To Sales Invoice</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">  
              <QuickFormContainer userRule={props.userRule} barge={props.barge}  transferPartial={"BookingConfirmation"} register={props.register} control={props.control} errors={props.errors} setValue={props.setValue} getValues={props.getValues} ContainerItem={ContainerItemTransferPartial} ownershipType={OwnershipType} containerType={props.containerType} port={props.port} freightTerm={props.freightTerm} taxCode={props.taxCode} currency={props.currency} cargoType={props.cargoType} containerTypeAndChargesData={containerTypeAndChargesDataPartial} documentData={props.documentData} />
            </div> 
            <div className="modal-footer">
             <button type="button" class="btn btn-primary mb-1" id="comfirmTransferTO" onClick={()=> confirmTransferTo("BookingConfirmation")}>Confirm</button>
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default QuickForm