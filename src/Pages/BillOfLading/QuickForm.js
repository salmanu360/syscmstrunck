
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

      $(".pdfFL1").html("Place and date of issue:<br>&emsp;" + props.shippingInstructionData.POLAreaName + "&nbsp;" + props.shippingInstructionData.DocDate)
    }


    return () => {

    }
  }, [props.shippingInstructionData])

  useEffect(() => {
    if(props.containerData){
      if(props.containerData.length>0){
        $(".units").html("Total Number of Packages (in words):<br> &emsp; " + numberToWords(props.containerData.length) + " UNIT(S) ONLY")
      }
      
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
  }, [props.containerData])

  useEffect(() => {

    var CompanyName = ""
    var BranchAddressLine1 = ""
    var BranchAddressLine2 = ""
    var BranchAddressLine3 = ""
    var BranchTel = ""
    var BranchFax = ""
    if(props.freightChargesData!="" && props.freightChargesData!=undefined){
      if(props.freightChargesData.rOC.CompanyName){
        CompanyName=props.freightChargesData.rOC.CompanyName
      }else{
        CompanyName=""
      }

      if(props.freightChargesData.BranchAddressLine1){
        BranchAddressLine1=props.freightChargesData.BranchAddressLine1
      }
      else{
        BranchAddressLine1=""
      }

      if(props.freightChargesData.BranchAddressLine2){
        BranchAddressLine2=props.freightChargesData.BranchAddressLine2
      }
      else{
        BranchAddressLine2=""
      }
      
      if(props.freightChargesData.BranchAddressLine3){
        BranchAddressLine3=props.freightChargesData.BranchAddressLine3
      }
      else{
        BranchAddressLine3=""
      }
      
      if(props.freightChargesData.BranchTel){
        BranchTel=props.freightChargesData.BranchTel
      }
      else{
        BranchTel=""
      }

      if(props.freightChargesData.BranchFax){
        BranchFax=props.freightChargesData.BranchFax
      }
      else{
        BranchFax=""
      }
    }
    $(".pdfFL2").html("Freight and charges:<br>&emsp;<span data-target='CompanyName-FreightParty'>" + CompanyName + "</span><br>&emsp;<span data-target='BranchAddressLine1-FreightParty'>" + BranchAddressLine1 + "</span><br>&emsp;<span data-target='BranchAddressLine2-FreightParty'>" + BranchAddressLine2 + "</span><br>&emsp;<span data-target='BranchAddressLine3-FreightParty'>" + BranchAddressLine3 + "</span><br> &emsp;TEL:<span data-target='BranchTel-FreightParty'>" + BranchTel + "</span><br> &emsp;FAX:<span data-target='BranchFax-FreightParty'>" + BranchFax + "</span>")

    return () => {
    }
  }, [props.freightChargesData])
  
  

  useEffect(() => {
    if (props.middleCardData) {
      if (props.middleCardData.Attention) {
        if (props.middleCardData.Attention.BillOfLadingBillTo.CompanyName) {
          $("#CompanyROC-BillTo-Quickform").val(props.middleCardData.Attention.BillOfLadingBillTo.CompanyName + "(" + props.middleCardData.Attention.BillOfLadingBillTo.rOC.ROC + ")")
        }
        if (props.middleCardData.Attention.BillOfLadingShipper.CompanyName) {
          $("#CompanyROC-Shipper-Quickform").val(props.middleCardData.Attention.BillOfLadingShipper.CompanyName + "(" + props.middleCardData.Attention.BillOfLadingShipper.rOC.ROC + ")")
          $("#BranchAddressLine1-Shipper-Quickform").val(props.middleCardData.Attention.BillOfLadingShipper.BranchAddressLine1)
          $("#BranchAddressLine2-Shipper-Quickform").val(props.middleCardData.Attention.BillOfLadingShipper.BranchAddressLine2)
          $("#BranchAddressLine3-Shipper-Quickform").val(props.middleCardData.Attention.BillOfLadingShipper.BranchAddressLine3)
        }
        if (props.middleCardData.Attention.BillOfLadingConsignee.CompanyName) {
          $("#CompanyROC-Consignee-Quickform").val(props.middleCardData.Attention.BillOfLadingConsignee.CompanyName + "(" + props.middleCardData.Attention.BillOfLadingConsignee.rOC.ROC + ")")
          $("#BranchAddressLine1-Consignee-Quickform").val(props.middleCardData.Attention.BillOfLadingConsignee.BranchAddressLine1)
          $("#BranchAddressLine2-Consignee-Quickform").val(props.middleCardData.Attention.BillOfLadingConsignee.BranchAddressLine2)
          $("#BranchAddressLine3-Consignee-Quickform").val(props.middleCardData.Attention.BillOfLadingConsignee.BranchAddressLine3)
        }
        if (props.middleCardData.Attention.BillOfLadingDepot) {
          $("#CompanyROC-Depot-Quickform").val(props.middleCardData.Attention.BillOfLadingDepot.Depot.CompanyName + "(" + props.middleCardData.Attention.BillOfLadingDepot.Depot.ROC + ")")
        }

        if (props.middleCardData.Attention.BillOfLadingPartyExt) {
          if (props.middleCardData.Attention.BillOfLadingPartyExt.NotifyPartyCode) {
            $("#CompanyROC-NotifyParty-Quickform").val(props.middleCardData.Attention.BillOfLadingPartyExt.notifyPartyCode.CompanyName + "(" + props.middleCardData.Attention.BillOfLadingPartyExt.notifyPartyCode.ROC + ")")
            $("#BranchAddressLine1-NotifyParty-Quickform").val(props.middleCardData.Attention.BillOfLadingPartyExt.NotifyPartyBranchAddressLine1)
            $("#BranchAddressLine2-NotifyParty-Quickform").val(props.middleCardData.Attention.BillOfLadingPartyExt.NotifyPartyBranchAddressLine2)
            $("#BranchAddressLine3-NotifyParty-Quickform").val(props.middleCardData.Attention.BillOfLadingPartyExt.NotifyPartyBranchAddressLine3)
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
    formName: "BillOfLading",
    cardLength: "col-md-8",
  }

  var MiddleCardItem = {
    formName: "BillOfLading",
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
    formName: "BillOfLading",
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
    formName: "BillOfLading",
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