import React, { useState, useEffect, useContext } from "react";
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext";
import {
  createCookie,
  getCookie,
  getAreaById,
  getPortDetails,
  GetCompaniesData,
} from "../../Components/Helper.js";
import Select from "react-select";
import $ from "jquery";
import axios from "axios";
import QuickFormDocument from "../../Components/CommonElement/QuickFormDocument";
import QuickFormShippingInstruction from "../../Components/CommonElement/QuickFormShippingInstruction";
import QuickFormMiddleCard from "../../Components/CommonElement/QuickFormMiddleCard";
import FormContext from "../../Components/CommonElement/FormContext";
import QuickFormContainer from "../../Components/CommonElement/QuickFormContainer";

function QuickForm(props) {
  const formContext = useContext(FormContext);
  const globalContext = useContext(GlobalContext);
  const [Date, setDate] = useState("");

  function onChangePortCode(value, positionId) {
    var closestArea = $("#" + positionId)
      .closest(".row")
      .find(".AreaName");
    console.log("closestArea", closestArea);

    if (value) {
      var id = value.value;
      var portCode = value.label;
      var DefaultValue;
      var DefaultPortName;
      var DefaultAgentCompanyROC;
      var DefaultAgentCompany;
      var DefaultAgentCompanyBranch;
      var DefaultAgentCompanyBranchName;

      //get area
      getAreaById(id, globalContext).then((data) => {
        $(closestArea).val(data["Area"]);
      });

      //get terminal options
      getPortDetails(id, globalContext).then((data) => {
        var tempOptions = [];
        var tempOptionsCompany = [];
        var tempOptionsCompanyBranch = [];
        if (data.length > 0) {
          $.each(data, function (key, value1) {
            if (value1.VerificationStatus == "Approved") {
              if (value1.Default == 1) {
                DefaultValue = value1.PortDetailsUUID;
                DefaultPortName = value1.PortName;
                DefaultAgentCompanyROC = value1.handlingCompany.ROC;
                DefaultAgentCompany = value1.HandlingCompany;
                DefaultAgentCompanyBranch = value1.HandlingCompanyBranch;
                DefaultAgentCompanyBranchName =
                  value1.handlingCompanyBranch.BranchName;
                tempOptionsCompany.push({
                  value: value1.handlingCompany.CompanyUUID,
                  label: value1.handlingCompany.CompanyName,
                });
                tempOptionsCompanyBranch.push({
                  value: value1.handlingCompanyBranch.CompanyBranchUUID,
                  label: value1.handlingCompanyBranch.BranchCode,
                });
              }

              tempOptions.push({
                value: value1.PortDetailsUUID,
                label: value1.LocationCode,
              });
            }
          });
        }

        // set Option Terminal
        if (positionId.includes("pol")) {
          formContext.setStateHandle(tempOptions, "OptionPOLTerminal");
          formContext.setStateHandle(
            tempOptionsCompany,
            "OptionPOLAgentCompany"
          );
          formContext.setStateHandle(
            tempOptionsCompanyBranch,
            "OptionPOLAgentCompanyBranch"
          );
          props.setValue(
            `${props.InstructionItem.formName}[POLLocationCode]`,
            DefaultValue
          );
          props.setValue(
            `${props.InstructionItem.formName}[POLLocationName]`,
            DefaultPortName
          );
          props.setValue(
            `${props.InstructionItem.formName}[POLAgentROC]`,
            DefaultAgentCompanyROC
          );
          props.setValue(
            `${props.InstructionItem.formName}[POLAgentName]`,
            DefaultAgentCompany
          );
          props.setValue(
            `${props.InstructionItem.formName}[POLHandlingOfficeCode]`,
            DefaultAgentCompanyBranch
          );
          props.setValue(
            `${props.InstructionItem.formName}[POLHandlingOfficeName]`,
            DefaultAgentCompanyBranchName
          );
        } else {
          formContext.setStateHandle(tempOptions, "OptionPODTerminal");
          formContext.setStateHandle(
            tempOptionsCompany,
            "OptionPODAgentCompany"
          );
          formContext.setStateHandle(
            tempOptionsCompanyBranch,
            "OptionPODAgentCompanyBranch"
          );
          props.setValue(
            `${props.InstructionItem.formName}[PODLocationCode]`,
            DefaultValue
          );
          props.setValue(
            `${props.InstructionItem.formName}[PODLocationName]`,
            DefaultPortName
          );
          props.setValue(
            `${props.InstructionItem.formName}[PODAgentROC]`,
            DefaultAgentCompanyROC
          );
          props.setValue(
            `${props.InstructionItem.formName}[PODAgentName]`,
            DefaultAgentCompany
          );
          props.setValue(
            `${props.InstructionItem.formName}[PODHandlingOfficeCode]`,
            DefaultAgentCompanyBranch
          );
          props.setValue(
            `${props.InstructionItem.formName}[PODHandlingOfficeName]`,
            DefaultAgentCompanyBranchName
          );
        }
      });
    } else {
      if (positionId.includes("pol")) {
        $(closestArea).val("");
        formContext.setStateHandle([], "OptionPOLTerminal");
        formContext.setStateHandle([], "OptionPOLAgentCompany");
        formContext.setStateHandle([], "OptionPOLAgentCompanyBranch");
        props.setValue(
          `${props.InstructionItem.formName}[POLLocationCode]`,
          ""
        );
        props.setValue(
          `${props.InstructionItem.formName}[POLLocationName]`,
          ""
        );
        props.setValue(`${props.InstructionItem.formName}[POLAgentROC]`, "");
        props.setValue(`${props.InstructionItem.formName}[POLAgentName]`, "");
        props.setValue(
          `${props.InstructionItem.formName}[POLHandlingOfficeCode]`,
          ""
        );
        props.setValue(
          `${props.InstructionItem.formName}[POLHandlingOfficeName]`,
          ""
        );
      } else {
        $(closestArea).val("");
        formContext.setStateHandle([], "OptionPODTerminal");
        formContext.setStateHandle([], "OptionPODAgentCompany");
        formContext.setStateHandle([], "OptionPODAgentCompanyBranch");
        props.setValue(
          `${props.InstructionItem.formName}[PODLocationCode]`,
          ""
        );
        props.setValue(
          `${props.InstructionItem.formName}[PODLocationName]`,
          ""
        );
        props.setValue(`${props.InstructionItem.formName}[PODAgentROC]`, "");
        props.setValue(`${props.InstructionItem.formName}[PODAgentName]`, "");
        props.setValue(
          `${props.InstructionItem.formName}[PODHandlingOfficeCode]`,
          ""
        );
        props.setValue(
          `${props.InstructionItem.formName}[PODHandlingOfficeName]`,
          ""
        );
      }
    }
  }
  function getContainerCodeByContainerType(val) {}
  function getCOCCompany(val, index) {}
  function getBoxOperatorBranchByBoxOperatorCompany(val) {}
  function onChangeUNNumber(val) {}
  function getBoxOperatorBranchName(val) {}

  function loadCompanyOptions(inputValue) {
    const response = axios
      .get(
        globalContext.globalHost +
          globalContext.globalPathLink +
          "company/get-company-by-company-name?search=" +
          inputValue +
          "&companyType=Box Operator&q=" +
          inputValue,
        {
          auth: {
            username: globalContext.authInfo.username,
            password: globalContext.authInfo.access_token,
          },
        }
      )
      .then((res) => res.data.data);
    return response;
  }

  const loadUNNumberOptions = (inputValue) => {
    const response = axios
      .get(
        globalContext.globalHost +
          globalContext.globalPathLink +
          "u-n-number/get-u-n-number-by-u-n-number?term=" +
          inputValue +
          "&_type=query&q=" +
          inputValue,
        {
          auth: {
            username: globalContext.authInfo.username,
            password: globalContext.authInfo.access_token,
          },
        }
      )
      .then((res) => res.data.data);

    return response;
  };

  const loadHSCodeOptions = (inputValue) => {
    const response = axios
      .get(
        globalContext.globalHost +
          globalContext.globalPathLink +
          "h-s-code/get-h-s-code-by-heading?q=" +
          inputValue,
        {
          auth: {
            username: globalContext.authInfo.username,
            password: globalContext.authInfo.access_token,
          },
        }
      )
      .then((res) => res.data.data);

    return response;
  };

  // useEffect(() => {
  //   if (props.documentData) {
  //     console.log(props.documentData)
  //     $.each(props.documentData, function (key2, value2) {
  //       if(key2 != "VoyageNum"){
  //         props.setValue('DynamicModel[' + key2 + ']', value2);
  //       }
  //     })
  //   }
  //   return () => {
  //   }
  // }, [props.documentData])

  useEffect(() => {
    if (props.shippingInstructionData) {
      if (props.shippingInstructionData.InsistTranshipment == 0) {
        if (props.shippingInstructionData.VoyageNum) {
          formContext.setStateHandle(
            [
              {
                label:
                  props.shippingInstructionData.VoyageName +
                  "(" +
                  props.shippingInstructionData.VesselCode +
                  ")",
                value: props.shippingInstructionData.VoyageNum,
              },
            ],
            "QuickFormVoyageNum"
          );
        }
      }
      $.each(props.shippingInstructionData, function (key2, value2) {
        if (key2 == "VoyageNum") {
          if (value2) {
            $(".OneOff").removeClass("d-none");
          }
        }
        if (key2 != "VesselCode") {
          props.setValue("DynamicModel[" + key2 + "]", value2);
        }

        if (key2 == "VesselCode") {
          if (props.shippingInstructionData.InsistTranshipment == 0) {
            $("input[name='DynamicModel[VesselCode]']").val(value2);
          }
        }

        if (props.formType !== "TransferFromBooking") {
          if (key2 == "DocDate") {
            setDate(value2);
          }
        }
      });
      props.trigger();
    }
    return () => {};
  }, [props.shippingInstructionData]);

  useEffect(() => {
    if (props.middleCardData) {
      if (props.middleCardData.Attention) {
        if (props.middleCardData.Attention.QuotationBillTo) {
          if (props.middleCardData.Attention.QuotationBillTo.CompanyName) {
            props.setValue(
              "DynamicModel[BillToCompany]",
              props.middleCardData.Attention.QuotationBillTo.CompanyName +
                "(" +
                props.middleCardData.Attention.QuotationBillTo.rOC.ROC +
                ")"
            );
          }
        }
        if (props.middleCardData.Attention.QuotationShipper) {
          if (props.middleCardData.Attention.QuotationShipper.CompanyName) {
            $("#CompanyROC-Shipper-Quickform").val(
              props.middleCardData.Attention.QuotationShipper.CompanyName +
                "(" +
                props.middleCardData.Attention.QuotationShipper.rOC.ROC +
                ")"
            );
          }
        }
        if (props.middleCardData.Attention.QuotationShipOp) {
          if (props.middleCardData.Attention.QuotationShipOp.CompanyName) {
            $("#CompanyROC-Voyage-Quickform").val(
              props.middleCardData.Attention.QuotationShipOp.CompanyName +
                "(" +
                props.middleCardData.Attention.QuotationShipOp.ROC +
                ")"
            );
          }
        }
      }
      props.trigger();
    }
    return () => {};
  }, [props.middleCardData]);

  useEffect(() => {
    setDate(formContext.docDate);

    return () => {};
  }, [formContext.docDate]);

  const quotaitonTypeOptions = [
    {
      value: "Advance Booking",
      label: "Advance Booking",
    },
    {
      value: "Empty",
      label: "Empty",
    },
    {
      value: "Feeder",
      label: "Feeder",
    },
    {
      value: "Joint Service",
      label: "Joint Service",
    },
    {
      value: "Normal",
      label: "Normal",
    },
    {
      value: "One-Off",
      label: "One-Off",
    },
    {
      value: "Purchase Slot",
      label: "Purchase Slot",
    },
  ];

  const OwnershipType = [
    {
      value: "COC",
      label: "COC",
    },
    {
      value: "SOC",
      label: "SOC",
    },
  ];

  var DocumentItem = {
    formName: "Quotation",
    cardLength: "col-md-4",
    element: [
      {
        title: "QT No.",
        id: "dynamicmodel-docnum",
        className: "",
        name: "DynamicModel[DocNum]",
        dataTarget: "DocNum",
        gridSize: "col-xs-12 col-md-6",
        type: "input-text",
        onChange: "",
        specialFeature: ["readonly"],
      },
      {
        title: "QT Effective Date",
        id: "dynamicmodel-docdate",
        className: "docDate flatpickr-input",
        name: "DynamicModel[DocDate]",
        dataTarget: "DocDate",
        value: Date,
        gridSize: "col-xs-12 col-md-6",
        type: "flatpickr-input",
        onChange: "",
        specialFeature: ["required"],
      },
      {
        title: "Sales Person",
        id: "quotation-salesperson-quickform",
        className: "sales_person",
        name: "DynamicModel[SalesPerson]",
        dataTarget: "SalesPerson",
        gridSize: "col-xs-12 col-md-6",
        type: "dropdown",
        option: props.user,
        onChange: "",
        specialFeature: ["required"],
      },
      {
        title: "Quotation Type ",
        id: "quotation-quotationtype-quickform",
        className: "quotation_type",
        name: "DynamicModel[QuotationType]",
        dataTarget: "QuotationType",
        gridSize: "col-xs-12 col-md-6",
        type: "dropdown",
        option: quotaitonTypeOptions,
        onChange: props.changeQuotationType,
        specialFeature: ["required"],
      },
      {
        title: "Validity Days",
        id: "quotation-validityday-quickform",
        className: "validityDay",
        name: "DynamicModel[ValidityDay]",
        dataTarget: "ValidityDay",
        gridSize: "col-xs-12 col-md-6 NormalBooking",
        type: "input-number",
        defaultValue: "7",
        onChange: "",
        specialFeature: ["required"],
      },
      {
        title: "Last Valid Date",
        id: "quotation-lastvaliddate-quickform",
        className: "lastValidDate flatpickr-input active",
        name: "DynamicModel[LastValidDate]",
        dataTarget: "LastValidDate",
        value: formContext.lastValidDate,
        gridSize: "col-xs-12 col-md-6 NormalBooking",
        type: "flatpickr-input",
        onChange: "",
        specialFeature: ["required"],
      },
      {
        title: "Advance Booking Start Date",
        id: "quotation-advancebookingstartdate-quickform",
        className: "flatpickr-input docDate active",
        name: "DynamicModel[AdvanceBookingStartDate]",
        dataTarget: "AdvanceBookingStartDate",
        value: Date,
        gridSize: "col-xs-12 col-md-6 AdvanceBooking",
        type: "flatpickr-input",
        onChange: "",
        specialFeature: ["hidden"],
      },
      {
        title: "Advance Booking Last Valid Date",
        id: "quotation-advancebookinglastvaliddate-quickform",
        className: "flatpickr-input lastValidDate active",
        name: "DynamicModel[AdvanceBookingLastValidDate]",
        dataTarget: "AdvanceBookingLastValidDate",
        value: formContext.lastValidDate,
        gridSize: "col-xs-12 col-md-6 AdvanceBooking",
        type: "flatpickr-input",
        onChange: "",
        specialFeature: ["hidden"],
      },
    ],
  };

  var ShippingInstructionItem = {
    formName: "Quotation",
    cardLength: "col-md-8",
  };

  var MiddleCardItem = {
    formName: "Quotation",
    cardLength: "col-md-12",
    cardTitle: "Customer",
    element: [
      {
        title: "Bill To",
        id: "CompanyROC-BillTo-Quickform",
        className: "dropdownInputCompany",
        name: "DynamicModel[BillToCompany]",
        dataTarget: "CompanyROC-BillTo",
        gridSize: "col-xs-12 col-md-4",
        type: "input-dropdownInputCompany",
        onChange: "",
        specialFeature: ["required"],
      },
      {
        title: "Shipper",
        id: "CompanyROC-Shipper-Quickform",
        className: "dropdownInputCompany",
        name: "DynamicModel[ShipperCompany]",
        dataTarget: "CompanyROC-Shipper",
        gridSize: "col-xs-12 col-md-4",
        type: "input-dropdownInputCompany",
        onChange: "",
        specialFeature: [],
      },
      {
        title: "Ship Op",
        id: "CompanyROC-Voyage-Quickform",
        className: "dropdownInputCompany",
        name: "DynamicModel[VoyageCompany]",
        dataTarget: "CompanyROC-Voyage",
        gridSize: "col-xs-12 col-md-4",
        type: "input-dropdownInputCompany",
        onChange: "",
        specialFeature: [],
      },
    ],
  };

  var ContainerItem = {
    formName: "Quotation",
    cardLength: "col-md-12",
    cardTitle: "Containers & Charges",
    ContainerColumn: [
      {
        columnName: "Container Type",
        inputType: "single-select",
        defaultChecked: true,
        name: "ContainerType",
        fieldClass:
          "ContainerType Container_Type liveData RequiredFieldAddClass Live_ContainerType",
        options: props.containerType,
        class: "",
        onChange: getContainerCodeByContainerType,
        requiredField: true,
      },
      {
        columnName: "Ownership Type",
        inputType: "single-select",
        defaultChecked: true,
        name: "OwnershipType",
        fieldClass: "BoxOwnership RequiredFieldAddClass",
        options: OwnershipType,
        class: "",
        onChange: getCOCCompany,
        requiredField: true,
      },
      {
        columnName: "QTY",
        inputType: "number",
        defaultChecked: true,
        name: "Qty",
        fieldClass: "Qty cal ParentQty isOverflow",
        min: "0",
        class: "",
        onChange: "",
      },
      {
        columnName: "Empty",
        inputType: "checkbox",
        defaultChecked: true,
        name: "Empty",
        fieldClass: "Empty",
        class: "",
        onChange: "",
      },
      {
        columnName: "Box Op Code",
        inputType: "single-asyncSelect",
        defaultChecked: false,
        name: "BoxOperator",
        fieldClass: "BoxOpCo Box_OpCompany remoteBoxOperatorCompany",
        class: "d-none",
        onChange: getBoxOperatorBranchByBoxOperatorCompany,
        loadOption: loadCompanyOptions,
        optionLabel: "CompanyName",
        optionValue: "CompanyUUID",
      },
      {
        columnName: "Box Op Co",
        inputType: "input",
        defaultChecked: true,
        name: "BoxOperatorName",
        fieldClass: "BoxOPCoLoad",
        class: "",
        onChange: "",
        readOnly: true,
      },
      {
        columnName: "M3(m)",
        inputType: "input",
        defaultChecked: true,
        name: "M3",
        fieldClass:
          "cal M3 inputDecimalId inputDecimalThreePlaces decimalDynamicForm",
        class: "",
        onChange: "",
      },
      {
        columnName: "N.KG",
        inputType: "input",
        defaultChecked: true,
        name: "NetWeight",
        fieldClass:
          "cal NetWeight inputDecimalId inputDecimalThreePlaces decimalDynamicForm",
        class: "",
        onChange: "",
      },
      {
        columnName: "G.KG",
        inputType: "input",
        defaultChecked: true,
        name: "GrossWeight",
        fieldClass:
          "cal GrossWeight inputDecimalId inputDecimalThreePlaces decimalDynamicForm",
        class: "",
        onChange: "",
      },
      {
        columnName: "Length",
        inputType: "input",
        defaultChecked: true,
        name: "Length",
        fieldClass:
          "cal Length inputDecimalId inputDecimalThreePlaces decimalDynamicForm",
        class: "",
        onChange: "",
      },
      {
        columnName: "Width",
        inputType: "input",
        defaultChecked: true,
        name: "Width",
        fieldClass:
          "cal Width inputDecimalId inputDecimalThreePlaces decimalDynamicForm",
        class: "",
        onChange: "",
      },
      {
        columnName: "Height",
        inputType: "input",
        defaultChecked: true,
        name: "Height",
        fieldClass:
          "cal Height inputDecimalId inputDecimalThreePlaces decimalDynamicForm",
        class: "",
        onChange: "",
      },
      {
        columnName: "Tues",
        inputType: "number",
        defaultChecked: true,
        name: "Tues",
        fieldClass: "cal Tues decimalDynamicForm",
        class: "",
        onChange: "",
      },
      {
        columnName: "Temp(°C)",
        inputType: "input",
        defaultChecked: true,
        name: "Temperature",
        fieldClass: "inputDecimalTwoPlaces decimalDynamicForm ReadTemperature",
        class: "",
        onChange: "",
        readOnly: true,
      },
      {
        columnName: "UN Number",
        inputType: "single-asyncSelect",
        defaultChecked: true,
        name: "UNNumber",
        fieldClass: "UNNumber UN_Number",
        class: "",
        onChange: onChangeUNNumber,
        loadOption: loadUNNumberOptions,
        optionLabel: "UNNumber",
        optionValue: "UNNumberUUID",
      },
      {
        columnName: "DG Class",
        inputType: "input",
        defaultChecked: true,
        name: "DGClass",
        fieldClass: "DGClass DG_Class",
        class: "",
        onChange: "",
      },
      {
        columnName: "HS Code",
        inputType: "single-asyncSelect",
        defaultChecked: false,
        name: "HSCode",
        fieldClass: "HS_Code",
        class: "d-none",
        onChange: "",
        loadOption: loadHSCodeOptions,
        optionLabel: "Heading",
        optionValue: "HSCodeUUID",
      },
      {
        columnName: "Commodity",
        inputType: "input",
        defaultChecked: false,
        name: "Commodity",
        fieldClass: "Commodity",
        class: "d-none",
        onChange: "",
      },
      {
        columnName: "Box Op Branch Code",
        inputType: "single-select",
        defaultChecked: false,
        name: "BoxOperatorBranch",
        fieldClass: "BoxOpBranch",
        class: "d-none",
        onChange: getBoxOperatorBranchName,
      },
      {
        columnName: "Box Op Branch Name",
        inputType: "input",
        defaultChecked: false,
        name: "BoxOperatorBranchName",
        fieldClass: "BoxOperatorBranchName",
        class: "d-none",
        onChange: "",
        readOnly: true,
      },
      {
        columnName: "Mark",
        inputType: "input-Modal",
        defaultChecked: false,
        name: "Mark",
        fieldClass: "MarkReadonly",
        class: "d-none",
        modelClass: "TextMarks",
      },
      {
        columnName: "Goods Description",
        inputType: "input-Modal",
        defaultChecked: false,
        name: "GoodsDescription",
        fieldClass: "GoodDescriptionReadonly",
        class: "d-none",
        modelClass: "TextGoods",
      },
      {
        columnName: "Total Disc",
        inputType: "input",
        defaultChecked: false,
        name: "TotalDiscount",
        fieldClass: "inputDecimalTwoPlaces ContainerTotalDiscount",
        class: "d-none",
        readOnly: true,
      },
      {
        columnName: "Total Tax",
        inputType: "input",
        defaultChecked: false,
        name: "TotalTax",
        fieldClass: "inputDecimalTwoPlaces ContainerTotalTax",
        class: "d-none",
        readOnly: true,
      },
      {
        columnName: "Total Amount",
        inputType: "input",
        defaultChecked: false,
        name: "Total",
        fieldClass: "inputDecimalTwoPlaces ContainerTotalAmount",
        class: "d-none",
        readOnly: true,
      },
    ],
  };

  return (
    <div className="QuickForm">
      <div className="row">
        <QuickFormDocument
          register={props.register}
          control={props.control}
          errors={props.errors}
          setValue={props.setValue}
          DocumentItem={DocumentItem}
        />
        <QuickFormShippingInstruction
          barge={props.barge}
          bargeCode={props.bargeCode}
          register={props.register}
          control={props.control}
          errors={props.errors}
          setValue={props.setValue}
          getValues={props.getValues}
          ShippingInstructionItem={ShippingInstructionItem}
          port={props.port}
          trigger={props.trigger}
        />
        <QuickFormMiddleCard
          register={props.register}
          control={props.control}
          errors={props.errors}
          setValue={props.setValue}
          trigger={props.trigger}
          MiddleCardItem={MiddleCardItem}
        />
        <QuickFormContainer
          port={props.port}
          barge={props.barge}
          register={props.register}
          control={props.control}
          errors={props.errors}
          setValue={props.setValue}
          getValues={props.getValues}
          ContainerItem={ContainerItem}
          containerType={props.containerType}
          freightTerm={props.freightTerm}
          taxCode={props.taxCode}
          currency={props.currency}
          cargoType={props.cargoType}
          containerTypeAndChargesData={props.containerTypeAndChargesData}
          documentData={props.documentData}
          setContainerTypeAndChargesData={props.setContainerTypeAndChargesData}
        />
      </div>
    </div>
  );
}

export default QuickForm;
