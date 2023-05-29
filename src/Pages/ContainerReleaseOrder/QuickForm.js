
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext";
import { createCookie, getCookie, getAreaById,sortArray, getPortDetails, GetCompaniesData,initHoverSelectDropownTitle } from '../../Components/Helper.js'
import Select from 'react-select';
import $ from "jquery";
import axios from "axios"
import QuickFormDocument from "../../Components/CommonElement/QuickFormDocument";
import QuickFormShippingInstruction from "../../Components/CommonElement/QuickFormShippingInstruction";
import QuickFormMiddleCard from '../../Components/CommonElement/QuickFormMiddleCard';
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
    initHoverSelectDropownTitle()
    setDate(formContext.docDate)

    return () => {
    }
  }, [formContext.docDate])


  useEffect(() => {
    initHoverSelectDropownTitle()
    if (props.shippingInstructionData) {
      if(props.transhipmentData.length>0){
        if(props.transhipmentData[props.transhipmentData.length-1]["ToVoyageNum"]){
          formContext.setStateHandle([{ label: props.transhipmentData[props.transhipmentData.length-1]["toVoyage"]["VoyageNumber"] + "(" + props.transhipmentData[props.transhipmentData.length-1]["ToVesselCode"] + ")", value: props.transhipmentData[props.transhipmentData.length-1]["ToVoyageNum"] }], "QuickFormVoyageNum")
          setTimeout(() => {
            props.setValue("DynamicModel[VoyageNum]", props.transhipmentData[props.transhipmentData.length-1]["ToVoyageNum"])
          }, 500);
         
        }

      }else{
        if (props.shippingInstructionData.VoyageNum) {
          formContext.setStateHandle([{ label: props.shippingInstructionData.VoyageName + "(" + props.shippingInstructionData.VesselCode + ")", value: props.shippingInstructionData.VoyageNum }], "QuickFormVoyageNum")
        }
      }
     

      if (props.shippingInstructionData.BookingReservation) {
        if(props.shippingInstructionData.bookingReservation){
          setBookingSelectionQuickForm([{ label: props.shippingInstructionData.bookingReservation.DocNum, value: props.shippingInstructionData.BookingReservation }])
        }
       
      }


      $.each(props.shippingInstructionData, function (key2, value2) {
        props.setValue('DynamicModel[' + key2 + ']', value2);
        if (key2 == "VesselCode") {
          $("input[name='DynamicModel[VesselCode]']").val(value2)
        }
        if(props.formType!=="TransferFromBooking"){
          if (key2 == "DocDate") {
            setDate(value2)
          }
        }
   

      })
      if(props.transhipmentData.length>0){
        $("input[name='DynamicModel[VesselCode]']").val(props.transhipmentData[props.transhipmentData.length-1]["ToVesselCode"])
      }
      props.trigger()
    }

    return () => {

    }
  }, [props.shippingInstructionData])

  useEffect(() => {
    initHoverSelectDropownTitle()
    if (props.middleCardData) {
      if (props.middleCardData.Attention) {
        if (props.middleCardData.Attention.ContainerReleaseOrderBillTo.CompanyName) {
          props.setValue("DynamicModel[BillToCompany]",props.middleCardData.Attention.ContainerReleaseOrderBillTo.CompanyName + "(" + props.middleCardData.Attention.ContainerReleaseOrderBillTo.rOC.ROC + ")")
          
        }
        if (props.middleCardData.Attention.ContainerReleaseOrderShipper.CompanyName) {
          $("#CompanyROC-Shipper-Quickform").val(props.middleCardData.Attention.ContainerReleaseOrderShipper.CompanyName + "(" + props.middleCardData.Attention.ContainerReleaseOrderShipper.rOC.ROC + ")")
        }
        if (props.middleCardData.Attention.ContainerReleaseOrderDepot) {
          props.setValue("DynamicModel[DepotCompany]",props.middleCardData.Attention.ContainerReleaseOrderDepot.Depot.CompanyName + "(" + props.middleCardData.Attention.ContainerReleaseOrderDepot.Depot.ROC + ")")
         
        }

        if (props.middleCardData.Hauler.POLHaulerCode) {
          $("#CompanyROC-POLHauler-Quickform").val(props.middleCardData.Hauler.pOLHaulerCode.CompanyName + "(" + props.middleCardData.Hauler.pOLHaulerCode.ROC + ")")
        }

      }

      //props.trigger()


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

  var DocumentItem = {
    formName: "ContainerReleaseOrder",
    cardLength: "col-md-4",
    element: [
      { title: "CRO No.", id: "dynamicmodel-docnum", className: "", name: "DynamicModel[DocNum]", dataTarget: "DocNum", gridSize: "col-xs-12 col-md-6", type: "input-text", onChange: "", specialFeature: ["readonly"] },
      { title: "Document Date", id: "dynamicmodel-docdate", className: "docDate flatpickr-input", name: "DynamicModel[DocDate]", dataTarget: "DocDate", value: Date, gridSize: "col-xs-12 col-md-6", type: "flatpickr-input", onChange: "", specialFeature: ['required'] },
      { title: "BR No.", id: "dynamicmodel-bookingreservation", className: "bookingreservation_no readOnlySelect", name: "DynamicModel[BookingReservation]", dataTarget: "BookingReservation", gridSize: "col-xs-12 col-md-6", type: "dropdown", option: bookingSelectionQuickForm, onChange: "", specialFeature: ['required'] },
      { title: "Sales Person", id: "containerreleaseorder-salesperson", className: "sales_person readOnlySelect", name: "ContainerReleaseOrder[SalesPerson]", dataTarget: "SalesPerson", gridSize: "col-xs-12 col-md-6", type: "dropdown", option: props.user, onChange: "", specialFeature: ['required'] },


    ]
  }
  var ShippingInstructionItem = {
    formName: "ContainerReleaseOrder",
    cardLength: "col-md-8",
  }

  var MiddleCardItem = {
    formName: "ContainerReleaseOrder",
    cardLength: "col-md-12",
    cardTitle: "Customer",
    element: [
      { title: "Bill To", id: "CompanyROC-BillTo-Quickform", className: "dropdownInputCompany", name: "DynamicModel[BillToCompany]", dataTarget: "CompanyROC-BillTo", gridSize: "col-xs-12 col-md-3", type: "input-dropdownInputCompany", onChange: "", specialFeature: ["required"] },
      { title: "Shipper", id: "CompanyROC-Shipper-Quickform", className: "dropdownInputCompany", name: "DynamicModel[ShipperCompany]", dataTarget: "CompanyROC-Shipper", gridSize: "col-xs-12 col-md-3", type: "input-dropdownInputCompany", onChange: "", specialFeature: [] },
      { title: "Hauler", id: "CompanyROC-POLHauler-Quickform", className: "dropdownInputCompany", name: "DynamicModel[HaulerCompany]", dataTarget: "CompanyROC-POLHauler", gridSize: "col-xs-12 col-md-3", type: "input-dropdownInputCompany", onChange: "", specialFeature: [] },
      { title: "Depot", id: "CompanyROC-Depot-Quickform", className: "dropdownInputCompany", name: "DynamicModel[DepotCompany]", dataTarget: "CompanyROC-Depot", gridSize: "col-xs-12 col-md-3", type: "input-dropdownInputCompany", onChange: "", specialFeature: ["required"] },
    ]
  }

  var ContainerItem = {
    formName: "ContainerReleaseOrder",
    cardLength: "col-md-12",
    cardTitle: "Containers & Charges",
    ContainerColumn: [
      { columnName: "Container Type", inputType: "single-select", defaultChecked: true, name: "ContainerType", fieldClass: "ContainerType Container_Type onChangeContainerType", options: props.containerType, class: "", onChange: getContainerCodeByContainerType },
      { columnName: "Ownership Type", inputType: "single-select", defaultChecked: true, name: "OwnershipType", fieldClass: "BoxOwnership onChangeOwnership RequiredFieldAddClass", options: OwnershipType, class: "", onChange: getCOCCompany, requiredField: true },

      { columnName: "B.Qty", inputType: "input", defaultChecked: true, name: "BQty", fieldClass: "BQty form-control", class: "", onChange: "" },
      { columnName: "A.Qty", inputType: "input", defaultChecked: true, name: "AQty", fieldClass: "AQty form-control", class: "", onChange: "" },
      { columnName: "QTY", inputType: "number-withModal", defaultChecked: true, name: "Qty", fieldClass: "Qty cal ParentQty isOverflow", defaultValue: 1, min: "0", class: "", onChange: "" },
      { columnName: "Empty", inputType: "checkbox", defaultChecked: true, name: "Empty", fieldClass: "Empty", class: "", onChange: "" },
      { columnName: "Box Op Code", inputType: "single-asyncSelect", defaultChecked: false, name: "BoxOperator", fieldClass: "BoxOpCo Box_OpCompany remoteBoxOperatorCompany", class: "d-none", onChange: getBoxOperatorBranchByBoxOperatorCompany, loadOption: loadCompanyOptions, optionLabel: "CompanyName", optionValue: "CompanyUUID" },
      { columnName: "Box Op Co", inputType: "input", defaultChecked: true, name: "BoxOperatorName", fieldClass: "BoxOPCoLoad", class: "", onChange: "", readOnly: true },
      { columnName: "Box Op Branch Code", inputType: "single-select", defaultChecked: false, name: "BoxOperatorBranch", fieldClass: "BoxOpBranch", class: "d-none", onChange: getBoxOperatorBranchName },
      { columnName: "Box Op Branch Name", inputType: "input", defaultChecked: false, name: "BoxOperatorBranchName", fieldClass: "BoxOperatorBranchName", class: "d-none", onChange: "", readOnly: true },
      { columnName: "M3(m)", inputType: "input", defaultChecked: true, name: "M3", fieldClass: "cal M3 inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange: "" },
      { columnName: "N.KG", inputType: "input", defaultChecked: true, name: "NetWeight", fieldClass: "cal NetWeight inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange: "" },
      { columnName: "G.KG", inputType: "input", defaultChecked: true, name: "GrossWeight", fieldClass: "cal GrossWeight inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange: "" },
      { columnName: "Temp(°C)", inputType: "input", defaultChecked: true, name: "Temperature", fieldClass: "inputDecimalTwoPlaces decimalDynamicForm ReadTemperature", class: "", onChange: "", readOnly: true },
      { columnName: "HS Code", inputType: "single-asyncSelect", defaultChecked: false, name: "HSCode", fieldClass: "HS_Code", class: "d-none", onChange: "", loadOption: loadHSCodeOptions, optionLabel: "Heading", optionValue: "HSCodeUUID" },
      { columnName: "Commodity", inputType: "input", defaultChecked: false, name: "Commodity", fieldClass: "Commodity", class: "d-none", onChange: "" },
      { columnName: "UN Number", inputType: "single-asyncSelect", defaultChecked: true, name: "UNNumber", fieldClass: "UNNumber UN_Number", class: "", onChange: "", loadOption: loadUNNumberOptions, optionLabel: "UNNumber", optionValue: "UNNumberUUID" },
      { columnName: "DG Class", inputType: "input", defaultChecked: true, name: "DGClass", fieldClass: "DGClass DG_Class", class: "", onChange: "" },
      { columnName: "Mark", inputType: "input-Modal", defaultChecked: false, name: "Mark", fieldClass: "MarkReadonly", class: "d-none", modelClass: "TextMarks" },
      { columnName: "Goods Description", inputType: "input-Modal", defaultChecked: false, name: "GoodsDescription", fieldClass: "GoodDescriptionReadonly", class: "d-none", modelClass: "TextGoods" },

      { columnName: "Package Type", inputType: "input", defaultChecked: true, name: "PackageTypeInput", fieldClass: "BQty form-control", class: "", onChange: "" },
      { columnName: "No. of Package", inputType: "input", defaultChecked: true, name: "NoOfPackage", fieldClass: "NoOfPackageInput form-control", class: "", onChange: "" },
      { columnName: "Container Code", inputType: "multiple-select", defaultChecked: false, name: "ContainerCode", fieldClass: "ContainerCode multipleContainerCode", class: "", options: OwnershipType },
    ]
  }

  return (
    <div className="QuickForm">
      <div className="row">
        <QuickFormDocument register={props.register} control={props.control} errors={props.errors} setValue={props.setValue} DocumentItem={DocumentItem} />
        <QuickFormShippingInstruction trigger={props.trigger} register={props.register} control={props.control} errors={props.errors} setValue={props.setValue} getValues={props.getValues} ShippingInstructionItem={ShippingInstructionItem} port={props.port} />
        <QuickFormMiddleCard register={props.register} trigger={props.trigger} control={props.control} errors={props.errors} setValue={props.setValue} MiddleCardItem={MiddleCardItem} />
        <QuickFormContainer containerInnerData={props.containerInnerData} containerData={props.containerData} register={props.register} control={props.control} errors={props.errors} setValue={props.setValue} ContainerItem={ContainerItem} containerType={props.containerType} port={props.port} freightTerm={props.freightTerm} taxCode={props.taxCode} currency={props.currency} cargoType={props.cargoType} />
      </div>
    </div>
  )
}

export default QuickForm