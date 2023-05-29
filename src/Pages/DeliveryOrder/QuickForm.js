
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext";
import { createCookie, getCookie, getAreaById, getPortDetails,sortArray, GetCompaniesData, numberToWords } from '../../Components/Helper.js'
import Select from 'react-select';
import $ from "jquery";
import axios from "axios"
import QuickFormDocument from "../../Components/CommonElement/QuickFormDocument";
import QuickFormShippingInstruction from "../../Components/CommonElement/QuickFormShippingInstruction";
import QuickFormMiddleCard from './QuickFormMiddleCard';
import QuickFormBottomCard from './QuickFormBottomCard';
import FormContext from '../../Components/CommonElement/FormContext';
import QuickFormContainer from './QuickFormContainer';

function QuickForm(props) {

  const formContext = useContext(FormContext)
  const globalContext = useContext(GlobalContext)
  const [Date, setDate] = useState("")
  function onChangePortCode(value, positionId) {
    var closestArea = $("#" + positionId).closest(".row").find(".AreaName")

    if (value) {
      var id = value.value
      var portCode = value.label
      var DefaultValue;
      var DefaultPortName;
      var DefaultAgentCompanyROC;
      var DefaultAgentCompany;
      var DefaultAgentCompanyBranch;
      var DefaultAgentCompanyBranchName;

      //get area
      getAreaById(id, globalContext).then(data => {
        $(closestArea).val(data["Area"]);
      });

      //get terminal options
      getPortDetails(id, globalContext).then(data => {
        var tempOptions = []
        var tempOptionsCompany = []
        var tempOptionsCompanyBranch = []
        if (data.length > 0) {
          $.each(data, function (key, value1) {
            if (value1.VerificationStatus == "Approved") {
              if (value1.Default == 1) {
                DefaultValue = value1.PortDetailsUUID;
                DefaultPortName = value1.PortName;
                DefaultAgentCompanyROC = value1.handlingCompany.ROC
                DefaultAgentCompany = value1.HandlingCompany
                DefaultAgentCompanyBranch = value1.HandlingCompanyBranch
                DefaultAgentCompanyBranchName = value1.handlingCompanyBranch.BranchName
                tempOptionsCompany.push({ value: value1.handlingCompany.CompanyUUID, label: value1.handlingCompany.CompanyName })
                tempOptionsCompanyBranch.push({ value: value1.handlingCompanyBranch.CompanyBranchUUID, label: value1.handlingCompanyBranch.BranchCode })
              }

              tempOptions.push({ value: value1.PortDetailsUUID, label: value1.LocationCode })
            }
          })
        }

        // set Option Terminal
        if (positionId.includes("pol")) {
          formContext.setStateHandle(sortArray(tempOptions), "OptionPOLTerminal")
          formContext.setStateHandle(sortArray(tempOptionsCompany), "OptionPOLAgentCompany")
          formContext.setStateHandle(sortArray(tempOptionsCompanyBranch), "OptionPOLAgentCompanyBranch")
          props.setValue(`${props.InstructionItem.formName}[POLLocationCode]`, DefaultValue)
          props.setValue(`${props.InstructionItem.formName}[POLLocationName]`, DefaultPortName)
          props.setValue(`${props.InstructionItem.formName}[POLAgentROC]`, DefaultAgentCompanyROC)
          props.setValue(`${props.InstructionItem.formName}[POLAgentName]`, DefaultAgentCompany)
          props.setValue(`${props.InstructionItem.formName}[POLHandlingOfficeCode]`, DefaultAgentCompanyBranch)
          props.setValue(`${props.InstructionItem.formName}[POLHandlingOfficeName]`, DefaultAgentCompanyBranchName)
        } else {
          formContext.setStateHandle(sortArray(tempOptions), "OptionPODTerminal")
          formContext.setStateHandle(sortArray(tempOptionsCompany), "OptionPODAgentCompany")
          formContext.setStateHandle(sortArray(tempOptionsCompanyBranch), "OptionPODAgentCompanyBranch")
          props.setValue(`${props.InstructionItem.formName}[PODLocationCode]`, DefaultValue)
          props.setValue(`${props.InstructionItem.formName}[PODLocationName]`, DefaultPortName)
          props.setValue(`${props.InstructionItem.formName}[PODAgentROC]`, DefaultAgentCompanyROC)
          props.setValue(`${props.InstructionItem.formName}[PODAgentName]`, DefaultAgentCompany)
          props.setValue(`${props.InstructionItem.formName}[PODHandlingOfficeCode]`, DefaultAgentCompanyBranch)
          props.setValue(`${props.InstructionItem.formName}[PODHandlingOfficeName]`, DefaultAgentCompanyBranchName)
        }
      });


    } else {
      if (positionId.includes("pol")) {
        $(closestArea).val("");
        formContext.setStateHandle([], "OptionPOLTerminal")
        formContext.setStateHandle([], "OptionPOLAgentCompany")
        formContext.setStateHandle([], "OptionPOLAgentCompanyBranch")
        props.setValue(`${props.InstructionItem.formName}[POLLocationCode]`, "")
        props.setValue(`${props.InstructionItem.formName}[POLLocationName]`, "")
        props.setValue(`${props.InstructionItem.formName}[POLAgentROC]`, "")
        props.setValue(`${props.InstructionItem.formName}[POLAgentName]`, "")
        props.setValue(`${props.InstructionItem.formName}[POLHandlingOfficeCode]`, "")
        props.setValue(`${props.InstructionItem.formName}[POLHandlingOfficeName]`, "")
      } else {
        $(closestArea).val("");
        formContext.setStateHandle([], "OptionPODTerminal")
        formContext.setStateHandle([], "OptionPODAgentCompany")
        formContext.setStateHandle([], "OptionPODAgentCompanyBranch")
        props.setValue(`${props.InstructionItem.formName}[PODLocationCode]`, "")
        props.setValue(`${props.InstructionItem.formName}[PODLocationName]`, "")
        props.setValue(`${props.InstructionItem.formName}[PODAgentROC]`, "")
        props.setValue(`${props.InstructionItem.formName}[PODAgentName]`, "")
        props.setValue(`${props.InstructionItem.formName}[PODHandlingOfficeCode]`, "")
        props.setValue(`${props.InstructionItem.formName}[PODHandlingOfficeName]`, "")
      }
    }
  }
  function getContainerCodeByContainerType(val) {
  }
  function getCOCCompany(val, index) {
    if (val.value == "COC") {
      var company = "90d19715-dcf3-411c-85b1-2b21f889866e" // shin yang Comopany UUID
      var html = "<option value=''>Select...</option>";
      GetCompaniesData(company, globalContext).then(data => {

      })

    } else if ((val.value() == "")) {
     
    }
   
  }
  function getBoxOperatorBranchByBoxOperatorCompany(val) {
  }
  function onChangeUNNumber(val) {
  }
  function getBoxOperatorBranchName(val) {
  }

  function loadCompanyOptions(inputValue) {
    const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "company/get-company-by-company-name?search=" + inputValue + "&companyType=Box Operator&q=" + inputValue, {
      auth: {
        username: globalContext.authInfo.username,
        password: globalContext.authInfo.access_token,
      },
    }).then(res => res.data.data)
    return response
  }

  const loadUNNumberOptions = (inputValue) => {

    const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "u-n-number/get-u-n-number-by-u-n-number?term=" + inputValue + "&_type=query&q=" + inputValue, {

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

  useEffect(() => {
    setDate(formContext.docDate)

    return () => {
    }
  }, [formContext.docDate])


  useEffect(() => {
    if (props.shippingInstructionData) {
      if (props.shippingInstructionData.VoyageNum) {
        formContext.setStateHandle([{ label: props.shippingInstructionData.VoyageName + "(" + props.shippingInstructionData.VesselCode + ")", value: props.shippingInstructionData.VoyageNum }], "QuickFormVoyageNum")
      }

      if (props.shippingInstructionData.BookingReservation) {
        if (props.shippingInstructionData.bookingReservation) {
          setBookingSelectionQuickForm([{ label: props.shippingInstructionData.bookingReservation.DocNum, value: props.shippingInstructionData.BookingReservation }])
        }

      }


      $.each(props.shippingInstructionData, function (key2, value2) {
        props.setValue('DynamicModel[' + key2 + ']', value2);
        if (key2 == "VesselCode") {
          $("input[name='DynamicModel[VesselCode]']").val(value2)
        }
        if (key2 == "DocDate") {
          setDate(value2)
        }

      })

      if (props.shippingInstructionData.pOLHandlingOfficeCodeCompanyBranch) {

        if(props.shippingInstructionData.pOLHandlingOfficeCodeCompanyBranch.BranchName=="----"||props.shippingInstructionData.pOLHandlingOfficeCodeCompanyBranch.BranchName=="---" ){
          var CompanyName=props.shippingInstructionData.pOLHandlingOfficeCodeCompany.CompanyName
        }else if(props.shippingInstructionData.pOLHandlingOfficeCodeCompanyBranch.BranchName==""){
          var CompanyName=""
        }else{
          var CompanyName=props.shippingInstructionData.pOLHandlingOfficeCodeCompanyBranch.BranchName
        }

        if(props.shippingInstructionData.pOLHandlingOfficeCodeCompanyBranch.AddressLine1){
          var BranchAddressLine1=props.shippingInstructionData.pOLHandlingOfficeCodeCompanyBranch.AddressLine1
        }
        else{
          var BranchAddressLine1=""
        }
       
        if(props.shippingInstructionData.pOLHandlingOfficeCodeCompanyBranch.AddressLine2){
          var BranchAddressLine2=props.shippingInstructionData.pOLHandlingOfficeCodeCompanyBranch.AddressLine2
        }
        else{
          var BranchAddressLine2=""
        }
       
        if(props.shippingInstructionData.pOLHandlingOfficeCodeCompanyBranch.AddressLine3){
          var BranchAddressLine3=props.shippingInstructionData.pOLHandlingOfficeCodeCompanyBranch.AddressLine3
        }
        else{
          var BranchAddressLine3=""
        }

        if(props.shippingInstructionData.pOLHandlingOfficeCodeCompanyBranch.Tel){
          var BranchTel=props.shippingInstructionData.pOLHandlingOfficeCodeCompanyBranch.Tel
        }
        else{
          var BranchTel=""
        }

        if(props.shippingInstructionData.pOLHandlingOfficeCodeCompanyBranch.Fax){
          var BranchFax=props.shippingInstructionData.pOLHandlingOfficeCodeCompanyBranch.Fax
        }
        else{
          var BranchFax=""
        }


      
      }

      $("#dynamicmodel-vesselname-document").val(props.shippingInstructionData.VesselName)
      $("#deliveryorder-podeta-document").val(props.shippingInstructionData.POLETA)
      $("#deliveryorder-polareaname-document").val(props.shippingInstructionData.POLAreaName)
      $("#DONo").val(props.shippingInstructionData.DocNum)
      $(".bLQuickFormDocNum").val(props.shippingInstructionData.billOfLading.DocNum)
     
      $("#dynamicmodel-vesselname-document-footer").val(props.shippingInstructionData.VesselName)
      $("#deliveryorder-polareaname-document-footer").val(props.shippingInstructionData.POLAreaName)
      

      if (props.containerData.length > 0) {
        if (props.containerData.length == 1) {

          $("#TotalContainer").text("Total : " + props.containerData.length + "unit")
        } else {

          $("#TotalContainer").text("Total : " + props.containerData.length + "units")
        }
      } else {
 
        $("#TotalContainer").text("Total : " + props.containerData.length + "units")
      }
    }

    return () => {

    }
  }, [props.shippingInstructionData])

  useEffect(() => {
    if (props.middleCardData) {
      if (props.middleCardData.Attention) {
        if (props.middleCardData.Attention.DeliveryOrderBillTo.CompanyName) {
          $("#CompanyROC-BillTo-Quickform").val(props.middleCardData.Attention.DeliveryOrderBillTo.CompanyName + "(" + props.middleCardData.Attention.DeliveryOrderBillTo.rOC.ROC + ")")
        }
        if (props.middleCardData.Attention.DeliveryOrderShipper.CompanyName) {
          $("#CompanyROC-Shipper-Quickform").val(props.middleCardData.Attention.DeliveryOrderShipper.CompanyName + "(" + props.middleCardData.Attention.DeliveryOrderShipper.rOC.ROC + ")")
          $("#BranchAddressLine1-Shipper-Quickform").val(props.middleCardData.Attention.DeliveryOrderShipper.BranchAddressLine1)
          $("#BranchAddressLine2-Shipper-Quickform").val(props.middleCardData.Attention.DeliveryOrderShipper.BranchAddressLine2)
          $("#BranchAddressLine3-Shipper-Quickform").val(props.middleCardData.Attention.DeliveryOrderShipper.BranchAddressLine3)
        }
        if (props.middleCardData.Attention.DeliveryOrderConsignee.CompanyName) {
          $("#CompanyROC-Consignee-Quickform").val(props.middleCardData.Attention.DeliveryOrderConsignee.CompanyName + "(" + props.middleCardData.Attention.DeliveryOrderConsignee.rOC.ROC + ")")
          $("#BranchAddressLine1-Consignee-Quickform").val(props.middleCardData.Attention.DeliveryOrderConsignee.BranchAddressLine1)
          $("#BranchAddressLine2-Consignee-Quickform").val(props.middleCardData.Attention.DeliveryOrderConsignee.BranchAddressLine2)
          $("#BranchAddressLine3-Consignee-Quickform").val(props.middleCardData.Attention.DeliveryOrderConsignee.BranchAddressLine3)
        }
        if (props.middleCardData.Attention.DeliveryOrderDepot) {
          $("#CompanyROC-Depot-Quickform").val(props.middleCardData.Attention.DeliveryOrderDepot.Depot.CompanyName + "(" + props.middleCardData.Attention.DeliveryOrderDepot.Depot.ROC + ")")
        }

        if (props.middleCardData.Attention.DeliveryOrderPartyExt) {
          if (props.middleCardData.Attention.DeliveryOrderPartyExt.NotifyPartyCode) {
            $("#CompanyROC-NotifyParty-Quickform").val(props.middleCardData.Attention.DeliveryOrderPartyExt.NotifyPartyName + "(" + props.middleCardData.Attention.DeliveryOrderPartyExt.notifyPartyCode.ROC + ")")
            $("#BranchAddressLine1-NotifyParty-Quickform").val(props.middleCardData.Attention.DeliveryOrderPartyExt.NotifyPartyBranchAddressLine1)
            $("#BranchAddressLine2-NotifyParty-Quickform").val(props.middleCardData.Attention.DeliveryOrderPartyExt.NotifyPartyBranchAddressLine2)
            $("#BranchAddressLine3-NotifyParty-Quickform").val(props.middleCardData.Attention.DeliveryOrderPartyExt.NotifyPartyBranchAddressLine3)
          }

        }

        if (props.middleCardData.Hauler.POLHaulerCode) {
          $("#CompanyROC-POLHauler-Quickform").val(props.middleCardData.Hauler.pOLHaulerCode.CompanyName + "(" + props.middleCardData.Hauler.pOLHaulerCode.ROC + ")")
        }

      }


    }

    return () => {

    }
  }, [props.middleCardData])

  const [bookingSelectionQuickForm, setBookingSelectionQuickForm] = useState([])
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


  var ShippingInstructionItem = {
    formName: "DeliveryOrder",
    cardLength: "col-md-8",
  }

  var MiddleCardItem = {
    formName: "DeliveryOrder",
    cardLength: "col-md-12",
    cardTitle: "",
    element: [
      { title: "Bill To", id: "CompanyROC-BillTo-Quickform", className: "dropdownInputCompany", name: "", dataTarget: "CompanyROC-BillTo", gridSize: "col-xs-12 col-md-3", type: "input-dropdownInputCompany", onChange: "", specialFeature: ["required"] },
      { title: "Shipper", id: "CompanyROC-Shipper-Quickform", className: "dropdownInputCompany", name: "", dataTarget: "CompanyROC-Shipper", gridSize: "col-xs-12 col-md-3", name: "DynamicModel[BillToCompany]", type: "input-dropdownInputCompany", onChange: "", specialFeature: [] },
      { title: "Hauler", id: "CompanyROC-POLHauler-Quickform", className: "dropdownInputCompany", name: "", dataTarget: "CompanyROC-POLHauler", gridSize: "col-xs-12 col-md-3", type: "input-dropdownInputCompany", onChange: "", specialFeature: [] },
      { title: "Depot", id: "CompanyROC-Depot-Quickform", className: "dropdownInputCompany", name: "", dataTarget: "CompanyROC-Depot", gridSize: "col-xs-12 col-md-3", type: "input-dropdownInputCompany", onChange: "", specialFeature: ["required"] },
    ]
  }

  var ContainerItem = {
    formName: "DeliveryOrder",
    cardLength: "col-md-12",
    cardTitle: "Containers",
    ContainerColumn: [

      // { columnName: "Ownership Type", inputType: "single-select", defaultChecked: true, name: "OwnershipType", fieldClass: "BoxOwnership onChangeOwnership RequiredFieldAddClass", options: OwnershipType, class: "", onChange: getCOCCompany, requiredField: true },
      // { columnName: "B.Qty", inputType: "input", defaultChecked: true, name: "BQty", fieldClass: "BQty form-control", class: "", onChange: "" },
      // { columnName: "A.Qty", inputType: "input", defaultChecked: true, name: "AQty", fieldClass: "AQty form-control", class: "", onChange: "" },
      // { columnName: "QTY", inputType: "number-withModal", defaultChecked: true, name: "Qty", fieldClass: "Qty cal ParentQty isOverflow", defaultValue: 1, min: "0", class: "", onChange: "" },
      // { columnName: "Empty", inputType: "checkbox", defaultChecked: true, name: "Empty", fieldClass: "Empty", class: "", onChange: "" },
      // { columnName: "Box Op Code", inputType: "single-asyncSelect", defaultChecked: false, name: "BoxOperator", fieldClass: "BoxOpCo Box_OpCompany remoteBoxOperatorCompany", class: "d-none", onChange: getBoxOperatorBranchByBoxOperatorCompany, loadOption: loadCompanyOptions, optionLabel: "CompanyName", optionValue: "CompanyUUID" },
      // { columnName: "Box Op Co", inputType: "input", defaultChecked: true, name: "BoxOperatorName", fieldClass: "BoxOPCoLoad", class: "", onChange: "", readOnly: true },
      // { columnName: "Box Op Branch Code", inputType: "single-select", defaultChecked: false, name: "BoxOperatorBranch", fieldClass: "BoxOpBranch", class: "d-none", onChange: getBoxOperatorBranchName },
      // { columnName: "Box Op Branch Name", inputType: "input", defaultChecked: false, name: "BoxOperatorBranchName", fieldClass: "BoxOperatorBranchName", class: "d-none", onChange: "", readOnly: true },
      // { columnName: "M3(m)", inputType: "input", defaultChecked: true, name: "M3", fieldClass: "cal M3 inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange: "" },
      // { columnName: "N.KG", inputType: "input", defaultChecked: true, name: "NetWeight", fieldClass: "cal NetWeight inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange: "" },

      { columnName: "Container Code", inputType: "single-select", defaultChecked: true, name: "ContainerCode", fieldClass: "ContainerCode", class: "", options: [] },
      { columnName: "Seal No.", inputType: "input", defaultChecked: true, name: "SealNum", fieldClass: "", class: "", onChange: "" },
      { columnName: "Container Type", inputType: "single-select", defaultChecked: true, name: "ContainerType", fieldClass: "ContainerType Container_Type onChangeContainerType", options: props.containerType, class: "", onChange: getContainerCodeByContainerType },
      { columnName: "Qty", inputType: "input", defaultChecked: true, name: "Qty", fieldClass: "Qty", min: "0", class: "", onChange: "", readOnly: true },
      { columnName: "Mark", inputType: "input-Modal", defaultChecked: true, name: "Mark", fieldClass: "MarkReadonly", class: "", modelClass: "TextMarks" },
      { columnName: "Goods Description", inputType: "input-Modal", defaultChecked: true, name: "GoodsDescription", fieldClass: "GoodDescriptionReadonly", class: "", modelClass: "TextGoods" },
      { columnName: "Package Type", inputType: "input", defaultChecked: true, name: "PackageType", fieldClass: "form-control", class: "", onChange: "" },
      { columnName: "No. of Package", inputType: "input", defaultChecked: true, name: "NoOfPackage", fieldClass: "NoOfPackageInput form-control", class: "", onChange: "" },
      { columnName: "Gross Weight", inputType: "input", defaultChecked: true, name: "GrossWeight", fieldClass: "cal GrossWeight inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange: "" },
      { columnName: "M3", inputType: "input", defaultChecked: true, name: "M3", fieldClass: "cal M3 inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange: "" },
    ]
  }

  var ContainerItemBarge = {
    formName: "DeliveryOrder",
    cardLength: "col-md-12",
    cardTitle: "Containers",
    ContainerColumn: [

      { columnName: "Container Code", inputType: "single-select", defaultChecked: true, name: "ContainerCode", fieldClass: "ContainerCode", class: "", options: [] },    
      { columnName: "Cargo Type", inputType: "input", defaultChecked: true, name: "CargoType", fieldClass: "form-control", class: "", onChange: "" },
      { columnName: "Cargo Rate", inputType: "input", defaultChecked: true, name: "CargoRate", fieldClass: "form-control", class: "", onChange: "" }, 
      { columnName: "NetWeight", inputType: "input", defaultChecked: true, name: "NetWeight", fieldClass: "form-control", class: "", onChange: "" },
      { columnName: "Gross Weight", inputType: "input", defaultChecked: true, name: "GrossWeight", fieldClass: "form-control", class: "", onChange: "" },
      { columnName: "M3", inputType: "input", defaultChecked: true, name: "M3", fieldClass: "form-control", class: "", onChange: "" },
    
    ]
  }

  return (
    <div className="QuickForm">
      <div className="row">


        <QuickFormMiddleCard register={props.register} control={props.control} errors={props.errors} setValue={props.setValue} MiddleCardItem={MiddleCardItem} />
        <QuickFormContainer barge={props.barge} containerInnerData={props.containerInnerData} containerData={props.containerData} register={props.register} control={props.control} errors={props.errors} setValue={props.setValue} ContainerItem={props.barge?ContainerItemBarge:ContainerItem} containerType={props.containerType} port={props.port} freightTerm={props.freightTerm} taxCode={props.taxCode} currency={props.currency} cargoType={props.cargoType} />
        <QuickFormBottomCard register={props.register} control={props.control} errors={props.errors} setValue={props.setValue} />
      </div>
    </div>
  )
}

export default QuickForm