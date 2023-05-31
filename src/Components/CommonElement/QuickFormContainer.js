import React, { useState, useContext, useEffect, useRef } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import moment from "moment";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import {
  CheckBoxHandle,
  ControlOverlay,
  LoadTariff,
  GetUpdateData,
  CreateData,
  GetCOCCompaniesData,
  createCookie,
  getCookie,
  getAreaById,
  getPortDetails,
  GetCompaniesData,
  getCompanyDataByID,
  GetBranchData,
  getUNNumberByID,
  getHSCodeByID,
  getContainers,
  getChargesByContainerTypeAndPortCode,
  getContainerTypeById,
  getBCChargesDescription,
  sortArray,
} from "../../Components/Helper.js";
import FormContext from "./FormContext";
import GlobalContext from "../GlobalContext";
import $ from "jquery";
import axios from "axios";
import { ShareContainerModel } from "../BootstrapTableModal&Dropdown/ShareContainerModel";
import NestedTableCharges from "./NestedTableCharges.js";
import NestedTableChargesINV from "./NestedTableChargesINV.js";
import QuickFormTotalCard from "./QuickFormTotalCard.js";
import { BsPlus } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import ContainersModal from "../../Pages/Quotation/ContainersModal.js";
import "../../index.css";
import RemoveModal from "../../Pages/Quotation/RemoveModal.js";

function QuickFormContainer(props) {
  const ContainerRef = useRef(null);
  const formContext = useContext(FormContext);
  const globalContext = useContext(GlobalContext);
  var formName = props.ContainerItem.formName;
  var formNameLowerCase = props.ContainerItem.formName.toLowerCase();
  const [onChangeContainerTypeCharges, setOnChangeContainerTypeCharges] =
    useState([]);
  const [
    onChangeContainerTypeChargesVoyage,
    setOnChangeContainerTypeChargesVoyage,
  ] = useState([]);
  const [combinedChargesOptions, setCombinedChargesOptions] = useState([]); // save array of charges options
  const [containerChangeIndex, setContainerChangeIndex] = useState("");
  const [quantity, setQuantity] = useState([]);
  const [totalDiscount, setTotalDiscount] = useState([]);
  const [totalTax, setTotalTax] = useState([]);
  const [totalAmount, setTotalAmount] = useState([]);
  const [loadTariffState, setLoadTariffState] = useState([]);
  const [singleloadTariffState, setSingleLoadTariffState] = useState([]);
  const [updateContainerFillData, setUpdateContainerFillData] = useState([]);
  const [removeState, setRemoveState] = useState("");
  const [removeAllReleatedCharges, setRemoveAllReleatedCharges] = useState("");
  const [chargesDiscriptions, setChargesDiscriptions] = useState("");
  const [getErrorsFieldsUpdate, setGetErrorsFieldsUpdate] = useState("");
  const [removeStateRerender, setRemoveStateRerender] = useState("");
  const [removeCharges, setRemoveCharges] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedChosen, setSelectedChosen] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const [secondModal, setSecondModal] = useState({
    isShow: false,
    isRemove: "",
  });

  let removeItemId;

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

  function HighLightField() {
    $("#" + formNameLowerCase + "-polportcode")
      .find(".select__control")
      .addClass("HighLight");
    $("#dynamicmodel-polportcode")
      .find(".select__control")
      .addClass("HighLight");
    $("#" + formNameLowerCase + "-pollocationcode")
      .find(".select__control")
      .addClass("HighLight");
    $("#" + formNameLowerCase + "-polportterm")
      .find(".select__control")
      .addClass("HighLight");
    $("#dynamicmodel-polportterm")
      .find(".select__control")
      .addClass("HighLight");
    $("#" + formNameLowerCase + "-podportcode")
      .find(".select__control")
      .addClass("HighLight");
    $("#dynamicmodel-podportcode")
      .find(".select__control")
      .addClass("HighLight");
    $("#" + formNameLowerCase + "-podlocationcode")
      .find(".select__control")
      .addClass("HighLight");
    $("#" + formNameLowerCase + "-podportterm")
      .find(".select__control")
      .addClass("HighLight");
    $("#dynamicmodel-podportterm")
      .find(".select__control")
      .addClass("HighLight");
    $("#" + formNameLowerCase + "-currency")
      .find(".select__control")
      .addClass("HighLight");
    $("#CompanyROC-Voyage-Quickform").addClass("HighLight");
    $(".ShipOpROC").addClass("HighLight");
    $(".ShipOpBranchCode").addClass("HighLight");
    $(".ContainerCharges")
      .find(".Container_Type")
      .find(".select__control")
      .addClass("HighLight");
    $(".ContainerCharges")
      .find(".BoxOwnership")
      .find(".select__control")
      .addClass("HighLight");
    $(".ContainerCharges")
      .find(".Box_OpCompany")
      .find(".select__control")
      .addClass("HighLight");
    $(".ContainerCharges")
      .find(".BoxOpBranch")
      .find(".select__control")
      .addClass("HighLight");
    $(".ContainerCharges").find(".ParentQty").addClass("HighLight");
    $(".ContainerCharges")
      .find(".UN_Number")
      .find(".select__control")
      .addClass("HighLight");
    $(".ContainerCharges").find(".DG_Class").addClass("HighLight");
    $(".ContainerCharges").find(".Empty").parent().addClass("HighLight");
  }

  function handleKeydown(event) {
    var Closest = $(event.target).parent().parent().parent().parent();
    if (event.key !== "Tab") {
      if ($(Closest).hasClass("readOnlySelect")) {
        event.preventDefault();
      }
    }
  }

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

  if (props.transferPartial) {
    var ContainerColumn = [
      {
        columnName: "Container Type",
        inputType: "single-select",
        defaultChecked: true,
        name: "ContainerType",
        fieldClass:
          "ContainerType Container_Type onChangeContainerType liveData RequiredFieldAddClass Live_ContainerType readOnlySelect",
        options: props.containerType,
        class: "",
        onChange: getContainerCodeByContainerType,
        requiredField: true,
      },
      {
        columnName: "Ownership Type",
        inputType: "single-select",
        defaultChecked: true,
        name: "BoxOwnership",
        fieldClass:
          "BoxOwnership onChangeOwnership RequiredFieldAddClass readOnlySelect",
        options: OwnershipType,
        class: "",
        onChange: getCOCCompany,
        requiredField: true,
      },
      {
        columnName: "QTY",
        inputType: "number-withModal",
        defaultChecked: true,
        name: "Qty",
        fieldClass: "Qty cal ParentQty isOverflow",
        defaultValue: 1,
        min: "0",
        class: "",
        onBlur: onBlurQuantity,
        readOnly: true,
      },
      {
        columnName: "Empty",
        inputType: "checkbox",
        defaultChecked: true,
        defaultValue: "0",
        name: "Empty",
        fieldClass: "Empty",
        class: "",
        onChange: "",
        disabled: true,
      },
      {
        columnName: "Box Op Code",
        inputType: "single-asyncSelect",
        defaultChecked: false,
        name: "BoxOperator",
        fieldClass:
          "BoxOpCo Box_OpCompany remoteBoxOperatorCompany readOnlySelect onChangeBoxOperator",
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
        fieldClass: "BoxOPCoLoad OriReadOnlyClass",
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
        readOnly: true,
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
        readOnly: true,
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
        readOnly: true,
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
        readOnly: true,
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
        readOnly: true,
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
        readOnly: true,
      },
      {
        columnName: "Tues",
        inputType: "number",
        defaultChecked: true,
        name: "Tues",
        fieldClass: "cal Tues decimalDynamicForm",
        class: "",
        onChange: "",
        readOnly: true,
      },
      {
        columnName: "Temp(°C)",
        inputType: "input",
        defaultChecked: true,
        name: "Temperature",
        fieldClass:
          "inputDecimalTwoPlaces decimalDynamicForm ReadTemperature OriReadOnlyClass",
        class: "",
        onChange: "",
        readOnly: true,
      },
      {
        columnName: "UN Number",
        inputType: "single-asyncSelect",
        defaultChecked: true,
        name: "UNNumber",
        fieldClass: "UNNumber UN_Number readOnlySelect",
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
        readOnly: true,
      },
      {
        columnName: "HS Code",
        inputType: "single-asyncSelect",
        defaultChecked: false,
        name: "HSCode",
        fieldClass: "HS_Code readOnlySelect",
        class: "d-none",
        onChange: onChangeHSCode,
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
        readOnly: true,
      },
      {
        columnName: "Box Op Branch Code",
        inputType: "single-select",
        defaultChecked: false,
        name: "BoxOperatorBranch",
        fieldClass: "BoxOpBranch readOnlySelect",
        class: "d-none",
        onChange: getBoxOperatorBranchName,
      },
      {
        columnName: "Box Op Branch Name",
        inputType: "input",
        defaultChecked: false,
        name: "BoxOperatorBranchName",
        fieldClass: "BoxOperatorBranchName OriReadOnlyClass",
        class: "d-none",
        onChange: "",
        readOnly: true,
      },
      {
        columnName: "Mark",
        inputType: "input",
        defaultChecked: false,
        name: "Mark",
        fieldClass: "MarkReadonly",
        class: "d-none",
        modelClass: "TextMarks",
        readOnly: true,
      },
      {
        columnName: "Goods Description",
        inputType: "input",
        defaultChecked: false,
        name: "GoodsDescription",
        fieldClass: "GoodDescriptionReadonly",
        class: "d-none",
        modelClass: "TextGoods",
        readOnly: true,
      },
      {
        columnName: "Total Disc",
        inputType: "input",
        defaultChecked: false,
        name: "TotalDiscount",
        fieldClass:
          "inputDecimalTwoPlaces ContainerTotalDiscount OriReadOnlyClass",
        class: "d-none",
        readOnly: true,
      },
      {
        columnName: "Total Tax",
        inputType: "input",
        defaultChecked: false,
        name: "TotalTax",
        fieldClass: "inputDecimalTwoPlaces ContainerTotalTax OriReadOnlyClass",
        class: "d-none",
        readOnly: true,
      },
      {
        columnName: "Total Amount",
        inputType: "input",
        defaultChecked: false,
        name: "Total",
        fieldClass:
          "inputDecimalTwoPlaces ContainerTotalAmount OriReadOnlyClass",
        class: "d-none",
        readOnly: true,
      },
    ];
  } else {
    var ContainerColumn = [
      {
        columnName: "Container Type",
        inputType: "single-select",
        defaultChecked: true,
        name: "ContainerType",
        fieldClass:
          "ContainerType Container_Type onChangeContainerType liveData RequiredFieldAddClass Live_ContainerType",
        options: props.containerType,
        class: "",
        onChange: getContainerCodeByContainerType,
        requiredField: props.barge ? false : true,
      },
      {
        columnName: "Ownership Type",
        inputType: "single-select",
        defaultChecked: true,
        name: "BoxOwnership",
        fieldClass: "BoxOwnership onChangeOwnership RequiredFieldAddClass",
        options: OwnershipType,
        class: "",
        onChange: getCOCCompany,
        requiredField: props.barge ? false : true,
      },
      {
        columnName: "QTY",
        inputType: "number-withModal",
        defaultChecked: true,
        name: "Qty",
        fieldClass: "Qty cal ParentQty isOverflow",
        defaultValue: 1,
        min: "0",
        class: "",
        onBlur: onBlurQuantity,
      },
      {
        columnName: "Empty",
        inputType: "checkbox",
        defaultChecked: true,
        defaultValue: "0",
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
        fieldClass:
          "BoxOpCo Box_OpCompany remoteBoxOperatorCompany onChangeBoxOperator",
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
        fieldClass: "BoxOPCoLoad OriReadOnlyClass",
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
        fieldClass:
          "inputDecimalTwoPlaces decimalDynamicForm ReadTemperature OriReadOnlyClass",
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
        onChange: onChangeHSCode,
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
        fieldClass: "BoxOperatorBranchName OriReadOnlyClass",
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
        fieldClass:
          "inputDecimalTwoPlaces ContainerTotalDiscount OriReadOnlyClass",
        class: "d-none",
        readOnly: true,
      },
      {
        columnName: "Total Tax",
        inputType: "input",
        defaultChecked: false,
        name: "TotalTax",
        fieldClass: "inputDecimalTwoPlaces ContainerTotalTax OriReadOnlyClass",
        class: "d-none",
        readOnly: true,
      },
      {
        columnName: "Total Amount",
        inputType: "input",
        defaultChecked: false,
        name: "Total",
        fieldClass:
          "inputDecimalTwoPlaces ContainerTotalAmount OriReadOnlyClass",
        class: "d-none",
        readOnly: true,
      },
    ];
  }

  var ContainerCookies = "";
  if (props.transferPartial) {
    ContainerCookies = `${formNameLowerCase}transferpartialcontainercolumn`;
  } else {
    ContainerCookies = `${formNameLowerCase}containercolumn`;
  }

  if (getCookie(ContainerCookies)) {
    var getCookieArray = getCookie(ContainerCookies);
    var getCookieArray = JSON.parse(getCookieArray);

    $.each(ContainerColumn, function (key, value) {
      value.defaultChecked = false;
      value.class = "d-none";
    });
    $.each(getCookieArray, function (key, value) {
      $.each(ContainerColumn, function (key2, value2) {
        if (value == key2) {
          value2.defaultChecked = true;
          value2.class = "";
        }
      });
    });
  }

  var defaultValueObject;

  if (formName == "Quotation") {
    defaultValueObject = {
      QuotationHasContainerType: [
        {
          Name: `${formName}HasContainerType`,
          Qty: 1,
          ContainerItem: ContainerColumn,
          ContainerTypeOptions: props.containerType,
        },
      ],
    };
  } else if (formName == "BookingReservation") {
    defaultValueObject = {
      BookingReservationHasContainerType: [
        {
          Name: `${formName}HasContainerType`,
          Qty: 1,
          ContainerItem: ContainerColumn,
          ContainerTypeOptions: props.containerType,
        },
      ],
    };
  } else if (formName == "SalesInvoice") {
    defaultValueObject = {
      SalesInvoiceHasContainerType: [
        {
          Name: `${formName}HasContainerType`,
          Qty: 1,
          ContainerItem: ContainerColumn,
          ContainerTypeOptions: props.containerType,
        },
      ],
    };
  } else {
    defaultValueObject = {
      BookingConfirmationHasContainerType: [
        {
          Name: `${formName}HasContainerType`,
          Qty: 1,
          ContainerItem: ContainerColumn,
          ContainerTypeOptions: props.containerType,
        },
      ],
    };
  }
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: defaultValueObject,
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
    replace,
  } = useFieldArray({
    control,
    name: `${formName}HasContainerType`,
  });

  //set Default for First Came in
  // useEffect(() => {
  //   setValue(`${formName}HasContainerType[0]["ContainerTypeOptions"]`,props.containerType)
  //   update(fields)
  // }, [props])

  function appendContainerHandle() {
    append({
      Name: `${formName}HasContainerType`,
      Qty: 1,
      ContainerItem: ContainerColumn,
      ContainerTypeOptions: props.containerType,
    });
    if (formName == "BookingReservation") {
      formContext.QuotationRequiredFields();
    }
  }

  function resetHandle(e) {
    if (loadTariffState) {
      setLoadTariffState([]);
    }
    if (updateContainerFillData) {
      setUpdateContainerFillData([]);
    }
    remove();
    setRemoveState(fields);
    setTimeout(() => {
      append({
        Name: `${formName}HasContainerType`,
        Qty: 1,
        ContainerItem: ContainerColumn,
        ContainerTypeOptions: props.containerType,
      });
    }, 1);
  }

  function getAllDataFormContainerAndChargesTable() {
    const tableData = {};
    const regexForContainer = [
      { label: "boxOperator", regex: /\bBoxOperator\b/ },
      { label: "uNNumber", regex: /\bUNNumber\b/ },
      { label: "hSCode", regex: /\bHSCode\b/ },
      { label: "boxOperatorBranch", regex: /\bBoxOperatorBranch\b/ },
    ];
    const regexForCharges = [
      { label: "uOM", regex: /\bUOM\b/ },
      { label: "billTo", regex: /\bBillTo\b/ },
    ];

    $(ContainerRef.current)
      .find("input[name]")
      .each((index, element) => {
        if (element.name.includes("ContainerCode")) {
          var container = [];
          $.each($(`input[name='${element.name}']`), function (key, value) {
            if ($(value).val() != "") {
              const obj = { value: $(value).val(), label: $(value).val() };
              container.push(obj);
            }
          });
          tableData[element.name.replace("[]", "")] = container;
        } else {
          $.each(regexForContainer, function (key2, value2) {
            if (value2.regex.test(element.name)) {
              const label = $(`input[name='${element.name}']`)
                .parent()
                .find(".select__single-value")
                .text();
              var option = [];
              var frontName = element.name.slice(
                0,
                element.name.indexOf("[") + 3
              );
              if ($(element).val()) {
                option = [{ value: $(element).val(), label: label }];
              }
              tableData[frontName + "[" + value2.label + "]"] = option;
              tableData[element.name] = $(element).val();
            } else {
              tableData[element.name] = $(element).val();
            }
          });

          $.each(regexForCharges, function (key2, value2) {
            if (value2.regex.test(element.name)) {
              let options;
              if ($(`input[name='${element.name}']`).parent().next().val()) {
                options = JSON.parse(
                  $(`input[name='${element.name}']`).parent().next().val()
                );
              } else {
                options = [];
              }
              const newName = element.name.replace(
                value2.label.charAt(0).toUpperCase() + value2.label.slice(1),
                value2.label
              );

              tableData[newName] = options;
              tableData[element.name] = $(element).val();
            } else {
              tableData[element.name] = $(element).val();
            }
          });
        }
      });
    const arrayContainer = [];
    $.each(tableData, function (key, value) {
      var matches = key.match(
        /\[(\d+)\]\[(.*)\]\[(\d+)\]\[(.*)\]\[(\d+)\]\[(.*)\]/
      );
      if (!matches) {
        matches = key.match(/\[(\d+)\]\[(.*)\]\[(\d+)\]\[(.*)\]/);

        if (!matches) {
          matches = key.match(/\[(\d+)\]\[(.*)\](?:\[(\d+)\]\[(.*)\])?/);
        }
      }
      const containerIndex = matches["1"];
      const containerKey = matches["2"];
      const chargeIndex = matches["3"];
      const chargeKey = matches["4"];
      const nestedChargeIndex = matches["5"];
      const nestedChargeKey = matches["6"];

      if (!arrayContainer[containerIndex]) {
        var emptyObject = {};
        if (formName == "SalesInvoice") {
          emptyObject[`${formName}HasCharges`] = [{ NestedCharges: [] }];
        } else {
          emptyObject[`${formName}Charges`] = [{ NestedCharges: [] }];
        }
        arrayContainer[containerIndex] = emptyObject;
      }

      if (chargeIndex) {
        if (!arrayContainer[containerIndex][containerKey][chargeIndex]) {
          arrayContainer[containerIndex][containerKey][chargeIndex] = {
            NestedCharges: [],
          };
        }
      }

      if (chargeKey == "NestedCharges") {
        const keyToUse = nestedChargeKey;
        arrayContainer[containerIndex][containerKey][chargeIndex][chargeKey][
          nestedChargeIndex
        ] = {
          ...arrayContainer[containerIndex][containerKey][chargeIndex][
            chargeKey
          ][nestedChargeIndex],
          [keyToUse]: value,
        };
      } else if (
        containerKey == `${formName}Charges` ||
        containerKey == `${formName}HasCharges`
      ) {
        const keyToUse = chargeKey || containerKey; // use chargeKey if defined, otherwise containerKey
        arrayContainer[containerIndex][containerKey][chargeIndex] = {
          ...arrayContainer[containerIndex][containerKey][chargeIndex],
          [keyToUse]: value,
        };
      } else {
        arrayContainer[containerIndex][containerKey] = value;
      }
    });
    return arrayContainer;
  }

  function BasicRemoveHandle(index, ChargesIndex) {
    var removeData = getAllDataFormContainerAndChargesTable();
    if (ChargesIndex == undefined) {
      var newDataGenerate = [];
      $.each(removeData, function (key, value) {
        if (key != index) {
          newDataGenerate.push(value);
        }
      });

      var newChargesArray = [];
      $.each(combinedChargesOptions, function (key, value) {
        if (key != index) {
          newChargesArray.push(value);
        }
      });

      setCombinedChargesOptions(newChargesArray);
      setRemoveStateRerender(newDataGenerate);
      // remove(index)
      if (newChargesArray.length <= 0) {
        remove();
      }
    } else {
      var newDataGenerate = removeData;
      $.each(removeData, function (key, value) {
        if (key == index) {
          if (formName == "SalesInvoice") {
            $.each(value[formName + "HasCharges"], function (key2, value2) {
              if (key2 == ChargesIndex) {
                newDataGenerate[key][formName + "HasCharges"].splice(key2, 1);
              }
            });
          } else {
            $.each(value[formName + "Charges"], function (key2, value2) {
              if (key2 == ChargesIndex) {
                newDataGenerate[key][formName + "Charges"].splice(key2, 1);
              }
            });
          }
        }
      });
      setRemoveStateRerender(newDataGenerate);
      // remove(index)
      // if(newChargesArray.length <=0){
      //     remove()
      // }
    }
  }

  function handleCheckContainerType(e) {
    if ($(e.target).prop("checked")) {
      $(e.target)
        .closest(".container-itemTR")
        .next()
        .find(".checkboxCharges")
        .prop("checked", true);
    } else {
      $(e.target)
        .closest(".container-itemTR")
        .next()
        .find(".checkboxCharges")
        .prop("checked", false);
    }
  }

  function handleSelectAll(e) {
    if ($(e.target).prop("checked")) {
      $(e.target)
        .parent()
        .find(".commontable")
        .find(".checkboxContainerType")
        .prop("checked", true);
      $(e.target)
        .parent()
        .find(".commontable")
        .find(".checkboxCharges")
        .prop("checked", true);
    } else {
      $(e.target)
        .parent()
        .find(".commontable")
        .find(".checkboxContainerType")
        .prop("checked", false);
      $(e.target)
        .parent()
        .find(".commontable")
        .find(".checkboxCharges")
        .prop("checked", false);
    }
  }

  $(".columnChooserColumn").on("change", function (event) {
    var Cookies = [];
    $(this)
      .parent()
      .parent()
      .find(".columnChooserColumn:checked")
      .each(function () {
        Cookies.push($(this).parent().index());
      });

    var json_str = JSON.stringify(Cookies);
    if (props.transferPartial) {
      createCookie(
        `${formNameLowerCase}transferpartialcontainercolumn`,
        json_str,
        3650
      );
    } else {
      createCookie(`${formNameLowerCase}containercolumn`, json_str, 3650);
    }
    if (fields.length > 0) {
      if (fields[0].Name == `${formName}HasContainerType`) {
        $.each(fields, function (key, value) {
          if ($(event.target).prop("checked")) {
            value.ContainerItem[$(event.target).parent().index()].class = "";
            update(fields);
          } else {
            value.ContainerItem[$(event.target).parent().index()].class =
              "d-none";
            update(fields);
          }
        });
        //update(fields)
      }
    }
  });

  function loadTariff() {
    // get variables
    var valueBoxOwnership = [];
    var valueDGClass = [];
    var valueQty = [];
    var valueEmpty = [];
    var valueContainerType = [];

    var valueBoxOpCo = [];
    var valueBoxOpBranch = [];

    var BillToType = "Bill To";
    var billto = $("#" + formNameLowerCase + "billto-branchcode").val();

    // loop all values
    $.each($(".BoxOwnership"), function (key, value) {
      valueBoxOwnership.push($(value).find("input:hidden").val());
    });

    $.each($(".DGClass"), function (key, value) {
      valueDGClass.push(value.value);
    });

    $.each($(".BoxOpCo"), function (key, value) {
      valueBoxOpCo.push($(value).children().last().val());
    });

    $.each($(".BoxOpBranch"), function (key, value) {
      valueBoxOpBranch.push($(value).children().last().val());
    });

    $.each($(".Qty"), function (key, value) {
      valueQty.push(value.value);
    });
    $.each($(".Empty"), function (key, value) {
      if ($(value).prop("checked")) {
        valueEmpty.push(1);
      } else {
        valueEmpty.push(0);
      }
    });
    $.each($(".container-item").find(".ContainerType"), function (key, value) {
      valueContainerType.push($(value).find("input:hidden").val());
    });

    var type;
    props.barge ? (type = "barge") : (type = "normal");

    // validation alert
    if (type != "barge") {
      if (valueContainerType == "") {
        alert("Container Type cannot be empty");
        return false;
      } else if (valueBoxOwnership == "") {
        alert("Owner cannot be empty");
        return false;
      } else if (valueQty == "") {
        alert("QTY cannot be empty");
        return false;
      }
    }

    ControlOverlay(true);
    var voyageUUID =
      $(".transhipment-items").length <= 0
        ? $("input[name='DynamicModel[VoyageNum]']").val()
        : $(`input[name="${formName}HasTranshipment[0][FromVoyageNum]"]`).val();
    var filters = {
      SingleLoadTariff: 0,
      ContainerType: valueContainerType,
      DocDate: $(`input[name='DynamicModel[DocDate]']`).val(),
      POLPortCode: $(`input[name='${formName}[POLPortCode]']`).val(),
      POLAreaName: $(`input[name='${formName}[POLLocationCode]']`).val(),
      POLPortTerm: $(`input[name='${formName}[POLPortTerm]']`).val(),
      PODPortCode: $(`input[name='${formName}[PODPortCode]']`).val(),
      PODAreaName: $(`input[name='${formName}[PODLocationCode]']`).val(),
      PODPortTerm: $(`input[name='${formName}[PODPortTerm]']`).val(),
      ContainerOwnershipType: valueBoxOwnership,
      DGClass: valueDGClass,
      MinQty: valueQty,
      BoxOpCo: valueBoxOpCo,
      BoxOpBranch: valueBoxOpBranch,
      ShipOpCo: $(`input[name='${formName}[ShipOperator]']`).val(),
      ShipOpBranch: $(
        `input[name='${formName}[ShipOperatorBranchCode]']`
      ).val(),
      Empty: valueEmpty,
      CurrencyType: $(`input[name='${formName}[Currency]']`).val(),
      VoyageUUID: voyageUUID,
    };
    LoadTariff(filters, globalContext, type).then((data) => {
      if (data.data != null) {
        if (data.data.length != 0) {
          var PendingCharges = [];
          $.each(data.data, function (key, value) {
            if (value.ChargesPending) {
              $.each(value.ChargesPending, function (key2, value2) {
                PendingCharges.push(value2.ChargesCode);
              });
            }
          });

          if (PendingCharges.length > 0) {
            alert(
              PendingCharges.toString(",") +
                " is not verified. Please check the charges you loaded."
            );
          }
          setLoadTariffState(data.data);
        } else {
          alert(
            "No matching tariff found, please check your conditional fields again"
          );
          HighLightField();
          ControlOverlay(false);
        }
      } else {
        alert(
          "No matching tariff found, please check your conditional fields again"
        );
        HighLightField();
        ControlOverlay(false);
      }
    });
  }

  function singleLoadTariff(e) {
    // get variables
    var indexContainer = $(e.target).closest("tr").index() / 2;
    var row = $(e.target).closest("tr").index() + 1; // Find the row
    var targetrow = $(e.target).closest(".container-item");
    var BoxOwnership = targetrow.find(".BoxOwnership").children().last().val();
    var DGClass = targetrow.find(".DGClass").val();
    var Qty = targetrow.find(".Qty").val();
    var Empty = targetrow.find(".Empty").prop("checked");
    var BillToType = "Bill To";
    var billto = $("#" + formNameLowerCase + "billto-branchcode").val();

    var BoxOpCo = targetrow.find(".BoxOpCo").children().last().val();
    var BoxOpBranch = targetrow.find(".BoxOpBranch").children().last().val();

    var valueEmpty = "";
    if (Empty) {
      valueEmpty = 1;
    } else {
      valueEmpty = 0;
    }
    var valueContainerType = targetrow
      .find(".ContainerType")
      .children()
      .last()
      .val();

    // alert validations
    if (valueContainerType == "") {
      alert("Container Type cannot be empty");
    } else if (BoxOwnership == "") {
      alert("Owner cannot be empty");
    }
    // else if (DGClass == "") {
    //     alert("DG Class cannot be empty");
    // }
    else if (Qty == "") {
      alert("QTY cannot be empty");
    } else {
      ControlOverlay(true);
      var voyageUUID =
        $(".transhipment-items").length <= 0
          ? $("input[name='DynamicModel[VoyageNum]']").val()
          : $(
              `input[name="${formName}HasTranshipment[0][FromVoyageNum]"]`
            ).val();
      var filters = {
        SingleLoadTariff: 1,
        ContainerType: valueContainerType,
        DocDate: $(`input[name='DynamicModel[DocDate]']`).val(),
        POLPortCode: $(`input[name='${formName}[POLPortCode]']`).val(),
        POLAreaName: $(`input[name='${formName}[POLLocationCode]']`).val(),
        POLPortTerm: $(`input[name='${formName}[POLPortTerm]']`).val(),
        PODPortCode: $(`input[name='${formName}[PODPortCode]']`).val(),
        PODAreaName: $(`input[name='${formName}[PODLocationCode]']`).val(),
        PODPortTerm: $(`input[name='${formName}[PODPortTerm]']`).val(),
        ContainerOwnershipType: BoxOwnership,
        DGClass: DGClass,
        MinQty: Qty,
        Empty: valueEmpty,
        BoxOpCo: BoxOpCo,
        BoxOpBranch: BoxOpBranch,
        ShipOpCo: $(`input[name='${formName}[ShipOperator]']`).val(),
        ShipOpBranch: $(
          `input[name='${formName}[ShipOperatorBranchCode]']`
        ).val(),
        CurrencyType: $(`input[name='${formName}[Currency]']`).val(),
        VoyageUUID: voyageUUID,
      };
      LoadTariff(filters, globalContext).then((data) => {
        if (data.data != null) {
          if (data.data.length != 0) {
            ControlOverlay(false);
            data.data["indexContainer"] = indexContainer;
            setSingleLoadTariffState(data.data);
          } else {
            alert(
              "No matching tariff found, please check your conditional fields again"
            );
            HighLightField();
            ControlOverlay(false);
          }
        } else {
          alert(
            "No matching tariff found, please check your conditional fields again"
          );
          HighLightField();
          ControlOverlay(false);
        }
      });
    }
  }

  function getBCChargesData(ChargesDetail) {
    if (ChargesDetail) {
      getBCChargesDescription(ChargesDetail, globalContext).then((data) => {
        setChargesDiscriptions(data);
      });
    }
  }

  function onChangePortCode(value, positionId) {
    var closestArea = $("#" + positionId)
      .closest(".row")
      .find(".AreaName");

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
          formContext.setStateHandle(
            sortArray(tempOptions),
            "OptionPOLTerminal"
          );
          formContext.setStateHandle(
            sortArray(tempOptionsCompany),
            "OptionPOLAgentCompany"
          );
          formContext.setStateHandle(
            sortArray(tempOptionsCompanyBranch),
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
          formContext.setStateHandle(
            sortArray(tempOptions),
            "OptionPODTerminal"
          );
          formContext.setStateHandle(
            sortArray(tempOptionsCompany),
            "OptionPODAgentCompany"
          );
          formContext.setStateHandle(
            sortArray(tempOptionsCompanyBranch),
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

  function getContainerCodeByContainerType(val, index) {
    setContainerChangeIndex(index);
    $(`input[name='${formName}HasContainerType[${index}][ContainerType]']`)
      .parent()
      .trigger("change");
    setGetErrorsFieldsUpdate(val);
    if (val) {
      var arrayCharges = [];
      var ContainerType = val.value;
      var UserPortCode = "";
      var VoyageUUID = "";

      if ($(".TranshipmentCardRow").length > 0) {
        VoyageUUID =
          $(
            `input[name='${formName}HasTranshipment[0][FromVoyageNum]']`
          ).val() == undefined
            ? ""
            : $(
                `input[name='${formName}HasTranshipment[0][FromVoyageNum]']`
              ).val();
      } else {
        VoyageUUID =
          $(`input[name='${formName}[VoyageNum]']`).val() == undefined
            ? ""
            : $(`input[name='${formName}[VoyageNum]']`).val();
      }
      getChargesByContainerTypeAndPortCode(
        ContainerType,
        UserPortCode,
        globalContext,
        VoyageUUID
      ).then((data) => {
        try {
          $.each(data.data, function (key, value) {
            var PortCode = "";
            var Float = "";

            if (value.VerificationStatus == "Approved") {
              if (value.portCode != null) {
                PortCode = "(" + value["portCode"]["PortCode"] + ")";
              }
              if (value.Floating == "1") {
                Float = "*";
              }
              arrayCharges.push({
                value: value.ChargesUUID,
                label: value.ChargesCode + PortCode + Float,
              });
            }
          });
        } catch (err) {}

        setOnChangeContainerTypeCharges(sortArray(arrayCharges));
      });

      getContainerTypeById(val.value, globalContext).then((data) => {
        setValue(
          `${formName}HasContainerType[${index}][Length]`,
          data.data.Length
        );
        setValue(
          `${formName}HasContainerType[${index}][Width]`,
          data.data.Width
        );
        setValue(
          `${formName}HasContainerType[${index}][Height]`,
          data.data.Height
        );
        setValue(`${formName}HasContainerType[${index}][Tues]`, data.data.Tues);
      });
    }
  }

  function getContainerCodeByContainerTypeChangeVoyage() {
    //$(`input[name='${formName}HasContainerType[${index}][ContainerType]']`).parent().trigger("change")
    if (!props.transferPartial) {
      if (fields.length > 0) {
        var bigArrayCharges = [];

        var UserPortCode = "";
        var VoyageUUID = "";
        $.each(fields, function (key, value) {
          setContainerChangeIndex(key);
          if ($(".TranshipmentCardRow").length > 0) {
            VoyageUUID =
              $(
                `input[name='${formName}HasTranshipment[0][FromVoyageNum]`
              ).val() == undefined
                ? ""
                : $(
                    `input[name='${formName}HasTranshipment[0][FromVoyageNum]`
                  ).val();
          } else {
            VoyageUUID =
              $(`input[name='${formName}[VoyageNum]']`).val() == undefined
                ? ""
                : $(`input[name='${formName}[VoyageNum]']`).val();
          }
          getChargesByContainerTypeAndPortCode(
            $(
              `input[name='${formName}HasContainerType[${key}][ContainerType]']`
            ).val(),
            UserPortCode,
            globalContext,
            VoyageUUID,
            false
          ).then((data) => {
            var arrayCharges = [];
            try {
              $.each(data.data, function (key, value) {
                var PortCode = "";
                var Float = "";

                if (value.VerificationStatus == "Approved") {
                  if (value.portCode != null) {
                    PortCode = "(" + value["portCode"]["PortCode"] + ")";
                  }
                  if (value.Floating == "1") {
                    Float = "*";
                  }
                  arrayCharges.push({
                    value: value.ChargesUUID,
                    label: value.ChargesCode + PortCode + Float,
                  });
                }
              });
            } catch (err) {}
            bigArrayCharges.push({ ChargesData: sortArray(arrayCharges) });
          });
        });
        setTimeout(() => {
          setOnChangeContainerTypeChargesVoyage(bigArrayCharges);
        }, 1000);
      }
    }
  }

  $(".onChangeContainerType")
    .unbind()
    .on("change", function (e) {
      setTimeout(() => {
        var Findtrindex = $(this).closest("tr").index();
        var index = Findtrindex / 2;
        var value = $(this).find("input:hidden").val();
        var label = $(this).find(".select__single-value").text();
        if (label.includes("RF")) {
          $(
            `input[name='${formName}HasContainerType[${index}][Temperature]']`
          ).attr("readonly", false);
          $.each(fields[index]["ContainerItem"], function (key2, value2) {
            if (value2.name == "Temperature") {
              setValue(
                `${formName}HasContainerType[${index}][ContainerItem][${key2}][requiredField]`,
                true
              );
              update(fields);
            }
          });
        } else {
          $(
            `input[name='${formName}HasContainerType[${index}][Temperature]']`
          ).val("");
          $(
            `input[name='${formName}HasContainerType[${index}][Temperature]']`
          ).attr("readonly", true);
          $.each(fields[index]["ContainerItem"], function (key2, value2) {
            if (value2.name == "Temperature") {
              setValue(
                `${formName}HasContainerType[${index}][ContainerItem][${key2}][requiredField]`,
                false
              );
              update(fields);
            }
          });
        }
        var optionContainerList = [];
        var filters = {
          OwnershipType: getValues(
            `${formName}HasContainerType[${index}][OwnershipType]`
          ),
          "Container.ContainerType": value,
          "Container.Status": "Available",
        };
        getContainers(value, filters, globalContext).then((data) => {
          try {
            $.each(data, function (key, value) {
              optionContainerList.push({
                value: value.ContainerUUID,
                label: value.ContainerCode,
              });
            });
          } catch (err) {}
          setValue(
            `${formName}HasContainerType[${index}]["ContainerOptions"]`,
            sortArray(optionContainerList)
          );
          update(fields);
        });
      }, 100);
    });

  function getCOCCompany(val, index) {
    $(`input[name='${formName}HasContainerType[${index}][BoxOwnership]']`)
      .parent()
      .trigger("change");
    setGetErrorsFieldsUpdate(val);
  }

  $(".onChangeOwnership")
    .unbind()
    .on("change", function (e) {
      setTimeout(() => {
        var Findtrindex = $(this).closest("tr").index();
        var index = Findtrindex / 2;
        var value = $(this).find("input:hidden").val();
        var label = $(this).find(".select__single-value").text();
        if (value) {
          if (value == "COC") {
            var company = "SHIN YANG SHIPPING SDN BHD"; // shin yang Company UUID
            GetCOCCompaniesData(company, globalContext).then((data) => {
              $.each(data.data, function (key, value) {
                if (value.Valid != 0) {
                  var Box_OpCompany = [
                    {
                      CompanyUUID: value.CompanyUUID,
                      CompanyName: value.CompanyName + "(" + value.ROC + ")",
                    },
                  ];
                  var BoxOperatorName = value.CompanyName;
                  var BoxOperatorBranch = [];
                  var defaultBoxOperatorBranch;
                  var defaultBoxOperatorBranchName;

                  $.each(value.companyBranches, function (key3, value3) {
                    if (key3 == 0) {
                      defaultBoxOperatorBranch = value3.CompanyBranchUUID;
                      defaultBoxOperatorBranchName = value3.BranchName;
                    }
                    BoxOperatorBranch.push({
                      value: value3.CompanyBranchUUID,
                      label:
                        value3.BranchCode +
                        "(" +
                        value3.PortCode.PortCode +
                        ")",
                    });
                  });
                  //Add option into register for boxOPCompany and boxOPBranch
                  $.each(
                    fields[index]["ContainerItem"],
                    function (key2, value2) {
                      if (value2.columnName == "Box Op Code") {
                        setValue(
                          `${formName}HasContainerType[${index}][ContainerItem][${key2}][optionColumn]`,
                          Box_OpCompany
                        );
                        update(fields);
                      }
                      if (value2.columnName == "Box Op Branch Code") {
                        setValue(
                          `${formName}HasContainerType[${index}][ContainerItem][${key2}][optionColumn]`,
                          sortArray(BoxOperatorBranch)
                        );
                        update(fields);
                      }
                    }
                  );
                  setValue(
                    `${formName}HasContainerType[${index}][BoxOperatorName]`,
                    BoxOperatorName
                  );
                  setValue(
                    `${formName}HasContainerType[${index}][BoxOperatorBranch]`,
                    defaultBoxOperatorBranch
                  );
                  setValue(
                    `${formName}HasContainerType[${index}][BoxOperatorBranchName]`,
                    defaultBoxOperatorBranchName
                  );
                }
              });
            });
          }
          var optionContainerList = [];
          var filters = {
            OwnershipType: value,
            "Container.ContainerType": getValues(
              `${formName}HasContainerType[${index}][ContainerType]`
            ),
            "Container.Status": "Available",
          };
          getContainers(value, filters, globalContext).then((data) => {
            try {
              $.each(data, function (key, value) {
                optionContainerList.push({
                  value: value.ContainerUUID,
                  label: value.ContainerCode,
                });
              });
            } catch (err) {}
            setValue(
              `${formName}HasContainerType[${index}]["ContainerOptions"]`,
              sortArray(optionContainerList)
            );
            update(fields);
          });
        } else {
          $.each(fields[index]["ContainerItem"], function (key2, value2) {
            if (value2.columnName == "Box Op Code") {
              setValue(
                `${formName}HasContainerType[${index}][ContainerItem][${key2}][optionColumn]`,
                []
              );
              update(fields);
            }
            if (value2.columnName == "Box Op Branch Code") {
              setValue(
                `${formName}HasContainerType[${index}][ContainerItem][${key2}][optionColumn]`,
                []
              );
              update(fields);
            }
          });
          setValue(
            `${formName}HasContainerType[${index}][BoxOperatorName]`,
            ""
          );
          setValue(
            `${formName}HasContainerType[${index}][BoxOperatorBranch]`,
            ""
          );
          setValue(
            `${formName}HasContainerType[${index}][BoxOperatorBranchName]`,
            ""
          );
        }
      }, 100);
    });

  $(".onChangeBoxOperator")
    .off("change")
    .on("change", function () {
      setTimeout(() => {
        var Findtrindex = $(this).closest("tr").index();
        var index = Findtrindex / 2;
        var value = $(this).find("input:hidden").val();
        var label = $(this).find(".select__single-value").text();

        //remove optionColumn Data
        $.each(fields[index]["ContainerItem"], function (key2, value2) {
          if (value2.columnName == "Box Op Code") {
            setValue(
              `${formName}HasContainerType[${index}][ContainerItem][${key2}][optionColumn]`,
              ""
            );
            update(fields);
          }
        });

        if (value) {
          var companyID = value;
          getCompanyDataByID(companyID, globalContext).then((data) => {
            var BoxOperatorName;
            var BoxOperatorBranch = [];
            var defaultBoxOperatorBranch;
            var defaultBoxOperatorBranchName;

            $.each(data.data, function (key, value) {
              if (key == "CompanyName") {
                BoxOperatorName = value;
              }

              if (key == "companyBranches") {
                $.each(value, function (key3, value3) {
                  if (key3 == 0) {
                    defaultBoxOperatorBranch = value3.CompanyBranchUUID;
                    defaultBoxOperatorBranchName = value3.BranchName;
                  }
                  BoxOperatorBranch.push({
                    value: value3.CompanyBranchUUID,
                    label:
                      value3.BranchCode + "(" + value3.portCode.PortCode + ")",
                  });
                });
                $.each(fields[index]["ContainerItem"], function (key2, value2) {
                  if (value2.columnName == "Box Op Branch Code") {
                    setValue(
                      `${formName}HasContainerType[${index}][ContainerItem][${key2}][optionColumn]`,
                      sortArray(BoxOperatorBranch)
                    );
                    update(fields);
                  }
                });
              }
            });
            setValue(
              `${formName}HasContainerType[${index}][BoxOperatorName]`,
              BoxOperatorName
            );
            setValue(
              `${formName}HasContainerType[${index}][BoxOperatorBranch]`,
              defaultBoxOperatorBranch
            );
            setValue(
              `${formName}HasContainerType[${index}][BoxOperatorBranchName]`,
              defaultBoxOperatorBranchName
            );
          });
        }
      }, 100);
    });

  $(".ChargesDisplay")
    .unbind()
    .on("click", function () {
      var icon = $(this).find("i");

      if (props.ContainerItem.formName == "BookingReservation") {
        if (props.barge) {
          if (
            props.userRule
              ? props.userRule.find(
                  (item) => item == `view-charges-booking-reservation-barge`
                ) !== undefined
              : ""
          ) {
            if ($(this).closest("tr").next().hasClass("d-none")) {
              icon.addClass("fa fa-minus").removeClass("fas fa-plus");
              $(this).closest("tr").next().removeClass("d-none");
            } else {
              icon.addClass("fas fa-plus").removeClass("fa fa-minus");
              $(this).closest("tr").next().addClass("d-none");
            }
          } else {
            alert(
              "You are not allowed to View Charges, Please check your User Permission."
            );
          }
        } else {
          if (
            props.userRule
              ? props.userRule.find(
                  (item) => item == `view-charges-booking-reservation`
                ) !== undefined
              : ""
          ) {
            if ($(this).closest("tr").next().hasClass("d-none")) {
              icon.addClass("fa fa-minus").removeClass("fas fa-plus");
              $(this).closest("tr").next().removeClass("d-none");
            } else {
              icon.addClass("fas fa-plus").removeClass("fa fa-minus");
              $(this).closest("tr").next().addClass("d-none");
            }
          } else {
            alert(
              "You are not allowed to View Charges, Please check your User Permission."
            );
          }
        }
      } else {
        if ($(this).closest("tr").next().hasClass("d-none")) {
          icon.addClass("fa fa-minus").removeClass("fas fa-plus");
          $(this).closest("tr").next().removeClass("d-none");
        } else {
          icon.addClass("fas fa-plus").removeClass("fa fa-minus");
          $(this).closest("tr").next().addClass("d-none");
        }
      }
    });

  $(".cal")
    .unbind()
    .on("change", function (e) {
      setTimeout(() => {
        var TotalM3 = 0;
        var TotalNetWeight = 0;
        var GrossWeight = 0;

        $.each($(".M3"), function () {
          var Value = $(this).val();
          if (Value == "") {
            Value = 0;
          }
          var Closest = $(this).closest(".container-item");
          var Qty = Closest.find(".Qty").val();
          if (Qty == "") {
            Qty = 1;
          }
          TotalM3 = parseFloat(TotalM3) + parseFloat(Value) * Qty;
        });

        $.each($(".NetWeight"), function () {
          var Value = $(this).val();
          if (Value == "") {
            Value = 0;
          }
          var Closest = $(this).closest(".container-item");
          var Qty = Closest.find(".Qty").val();
          if (Qty == "") {
            Qty = 1;
          }
          TotalNetWeight = parseFloat(TotalNetWeight) + parseFloat(Value) * Qty;
        });

        $.each($(".GrossWeight"), function () {
          var Value = $(this).val();
          if (Value == "") {
            Value = 0;
          }
          var Closest = $(this).closest(".container-item");
          var Qty = Closest.find(".Qty").val();
          if (Qty == "") {
            Qty = 1;
          }
          GrossWeight = parseFloat(GrossWeight) + parseFloat(Value) * Qty;
        });
      }, 100);
    });

  function getBoxOperatorBranchByBoxOperatorCompany(val, index) {
    $(`input[name='${formName}HasContainerType[${index}][BoxOperator]']`)
      .parent()
      .trigger("change");
  }

  function onBlurQuantity(val, index) {
    setQuantity({ val, index });
  }

  function onChangeUNNumber(val, index) {
    var data = getValues(`${formName}HasContainerType[${index}]`);
    $.each(data["ContainerItem"], function (key2, value2) {
      if (value2.columnName == "UN Number") {
        setValue(
          `${formName}HasContainerType[${index}][ContainerItem][${key2}][optionColumn]`,
          val
        );
        update(fields);
      }
    });
    if (val) {
      var UNNumber = val.UNNumberUUID;
      getUNNumberByID(UNNumber, globalContext).then((data) => {
        setValue(
          `${formName}HasContainerType[${index}][DGClass]`,
          data.data.Class
        );
      });
    } else {
      setValue(`${formName}HasContainerType[${index}][DGClass]`, "");
    }
  }

  function onChangeHSCode(val, index) {
    var data = getValues(`${formName}HasContainerType[${index}]`);
    $.each(data["ContainerItem"], function (key2, value2) {
      if (value2.columnName == "HS Code") {
        setValue(
          `${formName}HasContainerType[${index}][ContainerItem][${key2}][optionColumn]`,
          val
        );
        update(fields);
      }
    });
    if (val) {
      var HSCode = val.HSCodeUUID;
      getHSCodeByID(HSCode, globalContext).then((data) => {
        setValue(
          `${formName}HasContainerType[${index}][Commodity]`,
          data.data.Description
        );
      });
    } else {
      setValue(`${formName}HasContainerType[${index}][Commodity]`, "");
    }
  }

  function getBoxOperatorBranchName(val, index) {
    if (val) {
      GetBranchData(val.value, globalContext).then((data) => {
        setValue(
          `${formName}HasContainerType[${index}][BoxOperatorBranchName]`,
          data.data.BranchName
        );
      });
    } else {
      setValue(
        `${formName}HasContainerType[${index}][BoxOperatorBranchName]`,
        ""
      );
    }
  }

  function openTextAreaModal(event) {
    window.$(event.target).next().modal("toggle");
  }

  useEffect(() => {
    setValue(
      `${formName}HasContainerType[${totalDiscount.containerIndex}][TotalDiscount]`,
      totalDiscount.TotalDiscountTwoDecimal
    );
    setValue(
      `${formName}HasContainerType[${totalTax.containerIndex}][TotalTax]`,
      totalTax.TotalTaxTwoDecimal
    );
    setValue(
      `${formName}HasContainerType[${totalAmount.containerIndex}][Total]`,
      totalAmount.TotalAmountTwoDecimal
    );
  }, [totalDiscount, totalTax, totalAmount]);

  useEffect(() => {
    if (props.containerTypeAndChargesData) {
      if (props.containerTypeAndChargesData.length > 0) {
        setUpdateContainerFillData(props.containerTypeAndChargesData);
      }
    }
  }, [props.containerTypeAndChargesData]);

  useEffect(() => {
    if (updateContainerFillData.length > 0) {
      remove();
      var newArray = combinedChargesOptions;

      $.each(updateContainerFillData, function (key, value) {
        value["Name"] = `${formName}HasContainerType`;
        value["ContainerTypeOptions"] = props.containerType;

        //get Charges options when update data loaded
        var arr = [];

        if (formName == "SalesInvoice") {
          if (combinedChargesOptions.length >= key) {
            $.each(
              value[`Select${formName}HasCharges`],
              function (key, value2) {
                if (value2.PortCode) {
                  arr.push({
                    value: value2.ChargesUUID,
                    label:
                      value2.ChargesCode + "(" + value2.portCode.PortCode + ")",
                  });
                } else {
                  arr.push({
                    value: value2.ChargesUUID,
                    label: value2.ChargesCode,
                  });
                }
              }
            );
            newArray[key] = sortArray(arr);
          } else {
            $.each(
              value[`Select${formName}HasCharges`],
              function (key, value2) {
                if (value2.PortCode) {
                  arr.push({
                    value: value2.ChargesUUID,
                    label:
                      value2.ChargesCode + "(" + value2.portCode.PortCode + ")",
                  });
                } else {
                  arr.push({
                    value: value2.ChargesUUID,
                    label: value2.ChargesCode,
                  });
                }
              }
            );
            newArray.push(sortArray(arr));
          }
        } else {
          if (combinedChargesOptions.length >= key) {
            $.each(value[`Select${formName}Charges`], function (key, value2) {
              if (value2.PortCode) {
                arr.push({
                  value: value2.ChargesUUID,
                  label:
                    value2.ChargesCode + "(" + value2.portCode.PortCode + ")",
                });
              } else {
                arr.push({
                  value: value2.ChargesUUID,
                  label: value2.ChargesCode,
                });
              }
            });
            newArray[key] = sortArray(arr);
          } else {
            $.each(value[`Select${formName}Charges`], function (key, value2) {
              if (value2.PortCode) {
                arr.push({
                  value: value2.ChargesUUID,
                  label:
                    value2.ChargesCode + "(" + value2.portCode.PortCode + ")",
                });
              } else {
                arr.push({
                  value: value2.ChargesUUID,
                  label: value2.ChargesCode,
                });
              }
            });
            newArray.push(sortArray(arr));
          }
        }

        var arrayDynamic = [];
        value.Name = `${formName}HasContainerType`;
        value.ContainerItem = ContainerColumn;
        value.ContainerTypeOptions = props.containerType;
        $.each(value.ContainerItem, function (key2, value2) {
          if (value2.columnName == "Box Op Code") {
            value.ContainerItem[key2].optionColumn = value.BoxOperator
              ? [
                  {
                    CompanyUUID: value.BoxOperator,
                    CompanyName:
                      value.boxOperator.CompanyName +
                      "(" +
                      value.boxOperator.ROC +
                      ")",
                  },
                ]
              : [];
          }
          if (value2.columnName == "Box Op Branch Code") {
            if (value.BoxOperatorBranch) {
              if (value.boxOperatorBranch.portCode) {
                value.ContainerItem[key2].options = value.BoxOperatorBranch
                  ? [
                      {
                        value: value.BoxOperatorBranch,
                        label:
                          value.boxOperatorBranch.BranchCode +
                          "(" +
                          value.boxOperatorBranch.portCode.PortCode +
                          ")",
                      },
                    ]
                  : [];
              } else {
                value.ContainerItem[key2].options = value.BoxOperatorBranch
                  ? [
                      {
                        value: value.BoxOperatorBranch,
                        label: value.boxOperatorBranch.BranchCode,
                      },
                    ]
                  : [];
              }
            }
          }
          if (value2.columnName == "UN Number") {
            value.ContainerItem[key2].optionColumn = value.UNNumber
              ? [
                  {
                    UNNumberUUID: value.UNNumber,
                    UNNumber: value.uNNumber.UNNumber,
                  },
                ]
              : [];
          }
          if (value2.columnName == "Empty") {
            if (value.Empty == 1) {
              value.ContainerItem[key2].defaultValue = 1;
            } else {
              value.ContainerItem[key2].defaultValue = 0;
            }
          }
          if (value2.columnName == "HS Code") {
            value.ContainerItem[key2].optionColumn = value.HSCode
              ? [{ HSCodeUUID: value.HSCode, Heading: value.hSCode.Heading }]
              : [];
          }
          if (value2.columnName == "Empty") {
            if (value.Empty == "1") {
              value.ContainerItem[key2].check = true;
            }
          }
          if (value2.columnName == "Mark") {
            if (value.Mark) {
              value.ContainerItem[key2].textValue = value.Mark;
            }
          }
          if (value2.columnName == "Goods Description") {
            if (value.GoodsDescription) {
              value.ContainerItem[key2].textValue = value.GoodsDescription;
            }
          }
        });

        if (value.ContainerCode) {
          var arrayContainerCode = [];
          $.each(value.ContainerCode, function (key, value) {
            arrayContainerCode.push({
              value: value.ContainerUUID,
              label: value.ContainerCode,
            });
          });
          value.ContainerOptions = arrayContainerCode;
        }

        var selectedContainer = [];
        if (value[`${formName}HasContainer`]) {
          var arrayContainerCode = [];
          $.each(value[`${formName}HasContainer`], function (key, value) {
            arrayContainerCode.push({
              value: value.ContainerCode,
              label: value.ContainerCode,
            });
            selectedContainer.push(value.ContainerCode);
          });
          value.ContainerOptions = arrayContainerCode;
        }
        value.ContainerCode = sortArray(arrayContainerCode);
        append(value);

        setTimeout(() => {
          // after append
          if (value.Empty == 1) {
            $(`input[name='${formName}HasContainerType[${key}][Empty]']`)
              .prev()
              .prop("checked", true);
          }
          setValue(
            `${formName}HasContainerType[${key}][ContainerCode][]`,
            selectedContainer
          );

          if (props.userRule) {
            var viewChargesAccess =
              props.userRule.find(
                (item) => item == `view-charges-booking-reservation`
              ) !== undefined;
          }

          $(
            `input[name='${formName}HasContainerType[${key}][${formName}HasContainerTypeUUID]']`
          )
            .closest("tr")
            .find(".MarkReadonly")
            .val(value.Mark);
          $(
            `input[name='${formName}HasContainerType[${key}][${formName}HasContainerTypeUUID]']`
          )
            .closest("tr")
            .find(".GoodDescriptionReadonly")
            .val(value.GoodsDescription);
          if (formName != "SalesInvoice") {
            if (value[`${formName}Charges`].length > 0) {
              if (formName == "BookingReservation") {
                if (viewChargesAccess) {
                  var charges = $(
                    `input[name='${formName}HasContainerType[${key}][${formName}HasContainerTypeUUID]']`
                  )
                    .closest(".container-itemTR")
                    .next();
                  var Icon = $(
                    `input[name='${formName}HasContainerType[${key}][${formName}HasContainerTypeUUID]']`
                  )
                    .closest(".container-itemTR")
                    .find(".ChargesDisplay")
                    .children()[0];
                  $(Icon).removeClass("fas fa-plus").addClass("fa fa-minus");
                  $(charges).removeClass("d-none");
                }
              } else {
                var charges = $(
                  `input[name='${formName}HasContainerType[${key}][${formName}HasContainerTypeUUID]']`
                )
                  .closest(".container-itemTR")
                  .next();
                var Icon = $(
                  `input[name='${formName}HasContainerType[${key}][${formName}HasContainerTypeUUID]']`
                )
                  .closest(".container-itemTR")
                  .find(".ChargesDisplay")
                  .children()[0];
                $(Icon).removeClass("fas fa-plus").addClass("fa fa-minus");
                $(charges).removeClass("d-none");
              }
            }
          } else {
            if (value[`${formName}HasCharges`].length > 0) {
              var charges = $(
                `input[name='${formName}HasContainerType[${key}][${formName}HasContainerTypeUUID]']`
              )
                .closest(".container-itemTR")
                .next();
              var Icon = $(
                `input[name='${formName}HasContainerType[${key}][${formName}HasContainerTypeUUID]']`
              )
                .closest(".container-itemTR")
                .find(".ChargesDisplay")
                .children()[0];
              $(Icon).removeClass("fas fa-plus").addClass("fa fa-minus");
              $(charges).removeClass("d-none");
            }
          }
        }, 50);
        if (formName == "Quotation" || formName == "SalesInvoice") {
          if (
            formContext.formState.formType == "Update" &&
            !props.transferPartial
          ) {
            if (formContext.verificationStatus == "Approved") {
              formContext.ApprovedStatusReadOnlyForAllFields();
            } else {
              formContext.RemoveAllReadOnlyFields();
            }
          }
        }
      });
      setCombinedChargesOptions(newArray);

      if (formName == "SalesInvoice") {
        var ContainerType = [];
        $.each(updateContainerFillData, function (key, value) {
          var charges = [];
          $.each(value.SalesInvoiceHasCharges, function (key2, value2) {
            var nestedcharges = [];

            $.each(value2.NestedCharges, function (key3, value3) {
              nestedcharges.push({
                ChargesCode: value3.ChargesCode,
                ChargesName: value3.ChargesName,
                PortCode: value3.PortCode,
                Area: value3.Area,
                UnitPrice: value3.UnitPrice,
                UOM: value3.UOM,
                Discount: value3.Discount,
                TaxRate: value3.TaxRate,
                TaxCode: value3.TaxCode,
                TaxAmount: value3.TaxAmount,
                BookingConfirmation: value3.BookingConfirmation,
              });
            });

            charges.push({
              ChargesCode: value2.ChargesCode,
              ChargesName: value2.ChargesName,
              PortCode: value2.PortCode,
              Area: value2.Area,
              UnitPrice: value2.UnitPrice,
              UOM: value2.UOM,
              Discount: value2.Discount,
              TaxRate: value2.TaxRate,
              TaxCode: value2.TaxCode,
              TaxAmount: value2.TaxAmount,
              BookingConfirmation: value2.BookingConfirmation,
              NestedCharges: nestedcharges,
            });
          });

          ContainerType.push({
            Charges: charges,
          });
        });
        getBCChargesData(ContainerType);
      }
    }
  }, [updateContainerFillData]);

  useEffect(() => {
    if (removeStateRerender.length > 0) {
      if (!props.barge) {
        remove();
        $.each(removeStateRerender, function (key, value) {
          value["Name"] = `${formName}HasContainerType`;
          value["ContainerTypeOptions"] = props.containerType;

          //get Charges options when update data loaded

          var arrayDynamic = [];
          value.Name = `${formName}HasContainerType`;
          value.ContainerItem = ContainerColumn;
          value.ContainerTypeOptions = props.containerType;
          $.each(value.ContainerItem, function (key2, value2) {
            if (value2.columnName == "Box Op Code") {
              value.ContainerItem[key2].optionColumn = value.BoxOperator
                ? [
                    {
                      CompanyUUID: value.BoxOperator,
                      CompanyName: value["boxOperator"][0]["label"],
                    },
                  ]
                : [];
            }
            if (value2.columnName == "Box Op Branch Code") {
              value.ContainerItem[key2].options = value.BoxOperatorBranch
                ? [
                    {
                      value: value.BoxOperatorBranch,
                      label: value["boxOperatorBranch"][0]["label"],
                    },
                  ]
                : [];
            }
            if (value2.columnName == "UN Number") {
              value.ContainerItem[key2].optionColumn = value.UNNumber
                ? [
                    {
                      UNNumberUUID: value.UNNumber,
                      UNNumber: value["uNNumber"][0]["label"],
                    },
                  ]
                : [];
            }
            if (value2.columnName == "Empty") {
              if (value.Empty == 1) {
                value.ContainerItem[key2].defaultValue = 1;
              } else {
                value.ContainerItem[key2].defaultValue = 0;
              }
            }
            if (value2.columnName == "HS Code") {
              value.ContainerItem[key2].optionColumn = value.HSCode
                ? [
                    {
                      HSCodeUUID: value.HSCode,
                      Heading: value["hSCode"][0]["label"],
                    },
                  ]
                : [];
            }
            if (value2.columnName == "Empty") {
              if (value.Empty == "1") {
                value.ContainerItem[key2].check = true;
              }
            }
            if (value2.columnName == "Mark") {
              if (value.Mark) {
                value.ContainerItem[key2].textValue = value.Mark;
              }
            }
            if (value2.columnName == "Goods Description") {
              if (value.GoodsDescription) {
                value.ContainerItem[key2].textValue = value.GoodsDescription;
              }
            }
          });

          if (value.ContainerCode) {
            var arrayContainerCode = [];
            $.each(value.ContainerCode, function (key, value) {
              arrayContainerCode.push({
                value: value.ContainerUUID,
                label: value.ContainerCode,
              });
            });
            value.ContainerOptions = arrayContainerCode;
          }

          var selectedContainer = [];
          if (value[`ContainerCode`].length > 0) {
            $.each(value[`ContainerCode`], function (key, value) {
              selectedContainer.push(value.value);
            });
          }
          value.ContainerOptions = value.ContainerCode;
          append(value);

          setTimeout(() => {
            // after append
            if (value.Empty == 1) {
              $(`input[name='${formName}HasContainerType[${key}][Empty]']`)
                .prev()
                .prop("checked", true);
            }
            setValue(
              `${formName}HasContainerType[${key}][ContainerCode][]`,
              selectedContainer
            );
            if (props.userRule) {
              var viewChargesAccess =
                props.userRule.find(
                  (item) => item == `view-charges-booking-reservation`
                ) !== undefined;
            }

            $(
              `input[name='${formName}HasContainerType[${key}][${formName}HasContainerTypeUUID]']`
            )
              .closest("tr")
              .find(".MarkReadonly")
              .val(value.Mark);
            $(
              `input[name='${formName}HasContainerType[${key}][${formName}HasContainerTypeUUID]']`
            )
              .closest("tr")
              .find(".GoodDescriptionReadonly")
              .val(value.GoodsDescription);
            if (formName != "SalesInvoice") {
              if (value[`${formName}Charges`].length > 0) {
                if (formName == "BookingReservation") {
                  if (viewChargesAccess) {
                    var charges = $(
                      `input[name='${formName}HasContainerType[${key}][${formName}HasContainerTypeUUID]']`
                    )
                      .closest(".container-itemTR")
                      .next();
                    var Icon = $(
                      `input[name='${formName}HasContainerType[${key}][${formName}HasContainerTypeUUID]']`
                    )
                      .closest(".container-itemTR")
                      .find(".ChargesDisplay")
                      .children()[0];
                    $(Icon).removeClass("fas fa-plus").addClass("fa fa-minus");
                    $(charges).removeClass("d-none");
                  }
                } else {
                  var charges = $(
                    `input[name='${formName}HasContainerType[${key}][${formName}HasContainerTypeUUID]']`
                  )
                    .closest(".container-itemTR")
                    .next();
                  var Icon = $(
                    `input[name='${formName}HasContainerType[${key}][${formName}HasContainerTypeUUID]']`
                  )
                    .closest(".container-itemTR")
                    .find(".ChargesDisplay")
                    .children()[0];
                  $(Icon).removeClass("fas fa-plus").addClass("fa fa-minus");
                  $(charges).removeClass("d-none");
                }
              }
            } else {
              if (value[`${formName}HasCharges`].length > 0) {
                var charges = $(
                  `input[name='${formName}HasContainerType[${key}][${formName}HasContainerTypeUUID]']`
                )
                  .closest(".container-itemTR")
                  .next();
                var Icon = $(
                  `input[name='${formName}HasContainerType[${key}][${formName}HasContainerTypeUUID]']`
                )
                  .closest(".container-itemTR")
                  .find(".ChargesDisplay")
                  .children()[0];
                $(Icon).removeClass("fas fa-plus").addClass("fa fa-minus");
                $(charges).removeClass("d-none");
              }
            }
          }, 50);
        });
      }
    }
  }, [removeStateRerender]);

  useEffect(() => {
    if (formContext.resetStateValue) {
      setRemoveState([]);
    }
  }, [formContext]);

  useEffect(() => {
    if (formContext.checkChangeVoyage) {
      // if(fields.length>0){
      //      $.each(fields, function(key,value){
      getContainerCodeByContainerTypeChangeVoyage();

      //      })
      // }
    }

    return () => {
      formContext.setStateHandle("", "checkChangeVoyage");
    };
  }, [formContext.checkChangeVoyage]);

  useEffect(() => {
    if (removeCharges.containerIndex != undefined) {
      BasicRemoveHandle(removeCharges.containerIndex, removeCharges.index);
    }
  }, [removeCharges]);

  useEffect(() => {
    if (formContext.setCheckErrorContainer) {
      formContext.setCheckErrorContainer("1");
      formContext.setCheckErrorContainer(errors);
    }
  }, [errors, getErrorsFieldsUpdate]);

  useEffect(() => {
    trigger();
  }, [fields]);

  useEffect(() => {
    if (props.containerType) {
      setValue(
        `${formName}HasContainerType[0]["ContainerTypeOptions"]`,
        props.containerType
      );
      update(fields);
    }
  }, [props.containerType]);

  useEffect(() => {
    if (
      formContext.formState.formType == "New" &&
      formContext.formState.formNewClicked == true
    ) {
      remove();
      setTimeout(() => {
        append({
          Name: `${formName}HasContainerType`,
          Qty: 1,
          ContainerItem: ContainerColumn,
          ContainerTypeOptions: props.containerType,
        });
      }, 50);
    }
  }, [formContext.formState]);

  const handleOpenSelectionModal = (e) => {
    e.preventDefault();
    setOpenModal(true);
  };

  const handleSecondModalOpen = (e, index) => {
    e.preventDefault();
    setSecondModal({
      isShow: true,
      isRemove: index,
    });
  };

  return (
    <>
      <div className={`${props.ContainerItem.cardLength}`}>
        <div className="card charges ContainerCharges lvl1">
          <div className="card-header">
            <h3 className="card-title">{props.ContainerItem.cardTitle}</h3>
            <div className="row">
              {formName === "Quotation" && (
                <div>
                  <button
                    id="mainLoadTariff"
                    type="button"
                    className="btn btn-success btn-xs mb-2 ml-2"
                    onClick={loadTariff}
                  >
                    Load Tariff
                  </button>
                </div>
              )}
              {!props.transferPartial && (
                <div>
                  <button
                    id="clearTableData"
                    type="button"
                    className="btn btn-success btn-xs mb-2 ml-2"
                    onClick={resetHandle}
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
            <div className="card-tools">
              <button
                type="button"
                className="btn btn-tool"
                data-card-widget="collapse"
              >
                <i
                  className="fas fa-minus"
                  data-toggle="tooltip"
                  title=""
                  data-placement="top"
                  data-original-title="Collapse"
                ></i>
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="d-flex">
              <div className="row pl-2">
                {selectedValue
                  ? selectedValue?.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="custom-bg d-flex align-items-center mr-3"
                        >
                          <p className="pl-1 pr-1 m-0">{item.label}</p>
                          <button
                            className="remove-btn btn btn-danger btn-md text-white p-1"
                            onClick={(e) => handleSecondModalOpen(e, index)}
                          >
                            <IoClose />
                          </button>
                        </div>
                      );
                    })
                  : null}
                <RemoveModal
                  open={secondModal}
                  setOpen={setSecondModal}
                  selectedValue={selectedValue}
                  setSelectedValue={setSelectedValue}
                />
              </div>
              <button
                className="btn btn-success p-1 ml-2"
                onClick={(e) => handleOpenSelectionModal(e)}
              >
                <BsPlus className="text-lg" />
              </button>
            </div>
            <ContainersModal
              port={props.port}
              openModal={openModal}
              setOpenModal={setOpenModal}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              register={props.register}
            />
            <div className="card">
              <div className="card-body">
                <div
                  className={`btn-group float-left mb-2 ${
                    props.barge ? "d-none" : ""
                  }`}
                  id="columnchooserdropdown"
                >
                  <button
                    type="button"
                    className="btn btn-secondary btn-xs dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i
                      className="fa fa-th-list"
                      data-toggle="tooltip"
                      title="Column Chooser"
                      data-placement="top"
                    ></i>
                  </button>
                  <div className="dropdown-menu dropdown-menu-left  scrollable-columnchooser">
                    {ContainerColumn.map((item, index) => {
                      return (
                        <label
                          key={index}
                          className="dropdown-item dropdown-item-marker"
                        >
                          {item.defaultChecked ? (
                            <input
                              type="checkbox"
                              className="columnChooserColumn keep-enabled"
                              defaultChecked
                            />
                          ) : (
                            <input
                              type="checkbox"
                              className="columnChooserColumn keep-enabled"
                            />
                          )}
                          {item.columnName}
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div className="table_wrap">
                  <div className="table_wrap_inner">
                    {props.transferPartial && (
                      <>
                        <input
                          type="checkbox"
                          id="selectAll"
                          className="mt-3 keep-enabled"
                          onClick={handleSelectAll}
                        ></input>
                        <label htmlFor="selectAll" className="mt-2">
                          Select All
                        </label>
                      </>
                    )}
                    <table
                      className="table table-bordered commontable ContainerTable"
                      style={{ width: "100%" }}
                      ref={ContainerRef}
                    >
                      <thead className={`${props.barge ? "d-none" : ""}`}>
                        <tr>
                          {fields.length > 0
                            ? fields[0].ContainerItem
                              ? fields[0].ContainerItem.map((item, index) => {
                                  return (
                                    <th key={item.id} className={item.class}>
                                      {item.columnName}
                                    </th>
                                  );
                                })
                              : ""
                            : props.ContainerItem.ContainerColumn.map(
                                (item, index) => {
                                  return (
                                    <th key={item.id} className={item.class}>
                                      {item.columnName}
                                    </th>
                                  );
                                }
                              )}
                        </tr>
                      </thead>
                      <tbody className="ContainerType container-item">
                        {fields.map((item, index) => {
                          return (
                            <>
                              <tr
                                key={item ? item.id : ""}
                                className={`container-itemTR ${
                                  props.barge ? "d-none" : ""
                                } ${
                                  formName == "BookingReservation"
                                    ? "container-itemTRForQT"
                                    : ""
                                }`}
                              >
                                {item.ContainerItem
                                  ? item.ContainerItem.map((item2, index2) => {
                                      if (item2.inputType == "input") {
                                        return (
                                          <td className={item2.class}>
                                            {item2.requiredField ? (
                                              <input
                                                defaultValue=""
                                                readOnly={
                                                  item2.readOnly
                                                    ? item2.readOnly
                                                    : false
                                                }
                                                {...register(
                                                  `${formName}HasContainerType` +
                                                    "[" +
                                                    index +
                                                    "]" +
                                                    "[" +
                                                    item2.name +
                                                    "]",
                                                  { required: "required" }
                                                )}
                                                className={`form-control ${
                                                  item2.fieldClass
                                                    ? item2.fieldClass
                                                    : ""
                                                } ${
                                                  errors[
                                                    `${formName}HasContainerType`
                                                  ]
                                                    ? errors[
                                                        `${formName}HasContainerType`
                                                      ][`${index}`]
                                                      ? errors[
                                                          `${formName}HasContainerType`
                                                        ][`${index}`][
                                                          `${item2.name}`
                                                        ]
                                                        ? "has-error"
                                                        : ""
                                                      : ""
                                                    : ""
                                                }`}
                                              />
                                            ) : (
                                              <input
                                                defaultValue=""
                                                readOnly={
                                                  item2.readOnly
                                                    ? item2.readOnly
                                                    : false
                                                }
                                                {...register(
                                                  `${formName}HasContainerType` +
                                                    "[" +
                                                    index +
                                                    "]" +
                                                    "[" +
                                                    item2.name +
                                                    "]"
                                                )}
                                                className={`form-control ${
                                                  item2.fieldClass
                                                    ? item2.fieldClass
                                                    : ""
                                                }`}
                                              />
                                            )}
                                          </td>
                                        );
                                      }
                                      if (item2.inputType == "number") {
                                        return (
                                          <td className={item2.class}>
                                            {item2.requiredField ? (
                                              <input
                                                type="number"
                                                defaultValue=""
                                                readOnly={
                                                  item2.readOnly
                                                    ? item2.readOnly
                                                    : false
                                                }
                                                {...register(
                                                  `${formName}HasContainerType` +
                                                    "[" +
                                                    index +
                                                    "]" +
                                                    "[" +
                                                    item2.name +
                                                    "]",
                                                  { required: "required" }
                                                )}
                                                className={`form-control ${
                                                  item2.fieldClass
                                                    ? item2.fieldClass
                                                    : ""
                                                } ${
                                                  errors[
                                                    `${formName}HasContainerType`
                                                  ]
                                                    ? errors[
                                                        `${formName}HasContainerType`
                                                      ][`${index}`]
                                                      ? errors[
                                                          `${formName}HasContainerType`
                                                        ][`${index}`][
                                                          `${item2.name}`
                                                        ]
                                                        ? "has-error"
                                                        : ""
                                                      : ""
                                                    : ""
                                                }`}
                                              />
                                            ) : (
                                              <input
                                                type="number"
                                                defaultValue=""
                                                readOnly={
                                                  item2.readOnly
                                                    ? item2.readOnly
                                                    : false
                                                }
                                                {...register(
                                                  `${formName}HasContainerType` +
                                                    "[" +
                                                    index +
                                                    "]" +
                                                    "[" +
                                                    item2.name +
                                                    "]"
                                                )}
                                                className={`form-control ${
                                                  item2.fieldClass
                                                    ? item2.fieldClass
                                                    : ""
                                                }`}
                                              />
                                            )}
                                          </td>
                                        );
                                      }
                                      if (
                                        item2.inputType == "number-withModal"
                                      ) {
                                        return (
                                          <td className={item2.class}>
                                            <div className="input-group">
                                              {props.transferPartial && (
                                                <input
                                                  defaultValue=""
                                                  readOnly={
                                                    item2.readOnly
                                                      ? item2.readOnly
                                                      : false
                                                  }
                                                  {...register(
                                                    `${formName}HasContainerType` +
                                                      "[" +
                                                      index +
                                                      "]" +
                                                      "[ContainerArray]"
                                                  )}
                                                  className={`form-control containerArrayList d-none ${
                                                    item2.fieldClass
                                                      ? item2.fieldClass
                                                      : ""
                                                  }`}
                                                />
                                              )}
                                              {item2.requiredField ? (
                                                <input
                                                  type="number"
                                                  defaultValue={
                                                    item2.defaultValue
                                                  }
                                                  readOnly={
                                                    item2.readOnly
                                                      ? item2.readOnly
                                                      : false
                                                  }
                                                  {...register(
                                                    `${formName}HasContainerType` +
                                                      "[" +
                                                      index +
                                                      "]" +
                                                      "[" +
                                                      item2.name +
                                                      "]",
                                                    { required: "required" }
                                                  )}
                                                  onBlur={(val) => {
                                                    val
                                                      ? item2.onBlur(val, index)
                                                      : item2.onBlur(
                                                          null,
                                                          index
                                                        );
                                                  }}
                                                  className={`form-control ${
                                                    item2.fieldClass
                                                      ? item2.fieldClass
                                                      : ""
                                                  } ${
                                                    errors[
                                                      `${formName}HasContainerType`
                                                    ]
                                                      ? errors[
                                                          `${formName}HasContainerType`
                                                        ][`${index}`]
                                                        ? errors[
                                                            `${formName}HasContainerType`
                                                          ][`${index}`][
                                                            `${item2.name}`
                                                          ]
                                                          ? "has-error"
                                                          : ""
                                                        : ""
                                                      : ""
                                                  }`}
                                                />
                                              ) : (
                                                <input
                                                  type="number"
                                                  defaultValue={
                                                    item2.defaultValue
                                                  }
                                                  readOnly={
                                                    item2.readOnly
                                                      ? item2.readOnly
                                                      : false
                                                  }
                                                  {...register(
                                                    `${formName}HasContainerType` +
                                                      "[" +
                                                      index +
                                                      "]" +
                                                      "[" +
                                                      item2.name +
                                                      "]"
                                                  )}
                                                  onBlur={(val) => {
                                                    val
                                                      ? item2.onBlur(val, index)
                                                      : item2.onBlur(
                                                          null,
                                                          index
                                                        );
                                                  }}
                                                  className={`form-control ${
                                                    item2.fieldClass
                                                      ? item2.fieldClass
                                                      : ""
                                                  }`}
                                                />
                                              )}
                                              <div
                                                className="input-group-append"
                                                style={{ cursor: "pointer" }}
                                                onClick={() =>
                                                  ShareContainerModel({
                                                    formName,
                                                    index,
                                                    fields,
                                                    getValues,
                                                    setValue,
                                                    update,
                                                    globalContext,
                                                  })
                                                }
                                              >
                                                <span className="input-group-text">
                                                  <i
                                                    className="fa fa-search"
                                                    aria-hidden="true"
                                                  ></i>
                                                </span>
                                              </div>
                                            </div>
                                            <div
                                              className={`SelectContainerCodeField d-none ${
                                                props.transferPartial &&
                                                "ForPartial"
                                              }`}
                                            >
                                              <Controller
                                                name={
                                                  `${formName}HasContainerType` +
                                                  "[" +
                                                  index +
                                                  "]" +
                                                  "[ContainerCode][]"
                                                }
                                                control={control}
                                                render={({
                                                  field: { onChange, value },
                                                }) => (
                                                  <Select
                                                    isClearable={true}
                                                    isMulti
                                                    onKeyDown={handleKeydown}
                                                    {...register(
                                                      `${formName}HasContainerType` +
                                                        "[" +
                                                        index +
                                                        "]" +
                                                        "[ContainerCode][]"
                                                    )}
                                                    value={
                                                      value
                                                        ? Array.isArray(value)
                                                          ? value.map((c) =>
                                                              item.ContainerOptions.find(
                                                                (z) =>
                                                                  z.value === c
                                                              )
                                                            )
                                                          : item.ContainerOptions.find(
                                                              (c) =>
                                                                c.value ===
                                                                value
                                                            )
                                                        : null
                                                    }
                                                    onChange={(val) =>
                                                      val == null
                                                        ? onChange(null)
                                                        : onChange(
                                                            val.map(
                                                              (c) => c.value
                                                            )
                                                          )
                                                    }
                                                    options={
                                                      item.ContainerOptions
                                                    }
                                                    menuPortalTarget={
                                                      document.body
                                                    }
                                                    className={`basic-multiple-select`}
                                                    classNamePrefix="select"
                                                    styles={
                                                      globalContext.customStyles
                                                    }
                                                  />
                                                )}
                                              />
                                            </div>
                                          </td>
                                        );
                                      }
                                      if (item2.inputType == "checkbox") {
                                        return (
                                          <td
                                            className={item2.class}
                                            style={{
                                              textAlign: "center",
                                              verticalAlign: "middle",
                                            }}
                                          >
                                            <input
                                              type={"checkbox"}
                                              disabled={item2.disabled}
                                              defaultValue={
                                                item2.defaultValue == 1
                                                  ? "1"
                                                  : "0"
                                              }
                                              className={`mt-2 ${
                                                item2.fieldClass
                                                  ? item2.fieldClass
                                                  : ""
                                              }`}
                                              onChange={CheckBoxHandle}
                                            ></input>
                                            <input
                                              type={"hidden"}
                                              defaultValue={
                                                item2.defaultValue == 1
                                                  ? "1"
                                                  : "0"
                                              }
                                              className=""
                                              {...register(
                                                `${formName}HasContainerType` +
                                                  "[" +
                                                  index +
                                                  "]" +
                                                  "[" +
                                                  item2.name +
                                                  "]"
                                              )}
                                            />
                                          </td>
                                        );
                                      }
                                      if (item2.inputType == "single-select") {
                                        if (index2 == 0) {
                                          return (
                                            <td className={item2.class}>
                                              <input
                                                type="hidden"
                                                {...register(
                                                  `${formName}HasContainerType[${index}][${formName}HasContainerTypeUUID]`
                                                )}
                                                className={`${formName}HasContainerTypeUUID`}
                                              />
                                              <div className="row">
                                                {props.transferPartial && (
                                                  <input
                                                    type="checkbox"
                                                    className="ml-3 mt-2 checkboxContainerType keep-enabled"
                                                    onClick={
                                                      handleCheckContainerType
                                                    }
                                                  ></input>
                                                )}
                                                <div className="col-md-2">
                                                  <button
                                                    type="button"
                                                    style={{
                                                      position: "relative",
                                                      left: "0px",
                                                      top: "2px",
                                                    }}
                                                    className="btn btn-xs ChargesDisplay"
                                                  >
                                                    <i
                                                      className="fas fa-plus"
                                                      data-toggle="tooltip"
                                                      title="Expand"
                                                    ></i>
                                                  </button>
                                                </div>
                                                {!props.transferPartial && (
                                                  <div className="dropdown float-left dropdownbar">
                                                    <button
                                                      style={{
                                                        position: "relative",
                                                        left: "0px",
                                                        top: "1px",
                                                      }}
                                                      className="btn btn-xs btn-secondary dropdown-toggle float-right"
                                                      type="button"
                                                      data-toggle="dropdown"
                                                      aria-haspopup="true"
                                                      aria-expanded="false"
                                                    >
                                                      <i
                                                        className="fa fa-ellipsis-v"
                                                        data-hover="tooltip"
                                                        data-placement="top"
                                                        title="Options"
                                                      ></i>
                                                    </button>
                                                    <div
                                                      className="dropdown-menu"
                                                      aria-labelledby="dropdownMenuButton"
                                                    >
                                                      <button
                                                        className="dropdown-item d-none"
                                                        type="button"
                                                      >
                                                        Duplicate
                                                      </button>
                                                      <button
                                                        className="dropdown-item loadTariff"
                                                        type="button"
                                                        onClick={
                                                          singleLoadTariff
                                                        }
                                                      >
                                                        Load Tariff
                                                      </button>
                                                      <button
                                                        data-repeater-delete
                                                        className="dropdown-item RemoveContainer"
                                                        type="button"
                                                        onClick={() =>
                                                          BasicRemoveHandle(
                                                            index
                                                          )
                                                        }
                                                      >
                                                        Remove
                                                      </button>
                                                    </div>
                                                  </div>
                                                )}

                                                <div
                                                  className="col-md-8"
                                                  style={{
                                                    paddingLeft: "0px",
                                                    paddingRight: "0px",
                                                  }}
                                                >
                                                  {item2.requiredField ? (
                                                    <Controller
                                                      name={
                                                        `${formName}HasContainerType` +
                                                        "[" +
                                                        index +
                                                        "]" +
                                                        "[" +
                                                        item2.name +
                                                        "]"
                                                      }
                                                      control={control}
                                                      render={({
                                                        field: {
                                                          onChange,
                                                          value,
                                                        },
                                                      }) => (
                                                        <Select
                                                          isClearable={true}
                                                          {...register(
                                                            `${formName}HasContainerType` +
                                                              "[" +
                                                              index +
                                                              "]" +
                                                              "[" +
                                                              item2.name +
                                                              "]",
                                                            {
                                                              required:
                                                                "P cannot be blank.",
                                                            }
                                                          )}
                                                          value={
                                                            value
                                                              ? item.ContainerTypeOptions.find(
                                                                  (c) =>
                                                                    c.value ===
                                                                    value
                                                                )
                                                              : null
                                                          }
                                                          onChange={(val) => {
                                                            val == null
                                                              ? onChange(null)
                                                              : onChange(
                                                                  val.value
                                                                );
                                                            item2.onChange(
                                                              val,
                                                              index
                                                            );
                                                            formName ==
                                                            "BookingReservation"
                                                              ? formContext.QuotationRequiredFields()
                                                              : val == null
                                                              ? onChange(null)
                                                              : onChange(
                                                                  val.value
                                                                );
                                                          }}
                                                          options={
                                                            item.ContainerTypeOptions
                                                          }
                                                          isOptionDisabled={(
                                                            selectedValue
                                                          ) =>
                                                            selectedValue.selected ==
                                                            true
                                                          }
                                                          menuPortalTarget={
                                                            document.body
                                                          }
                                                          className={`basic-single ${
                                                            item2.fieldClass
                                                              ? item2.fieldClass
                                                              : ""
                                                          }  ${
                                                            errors[
                                                              `${formName}HasContainerType`
                                                            ]
                                                              ? errors[
                                                                  `${formName}HasContainerType`
                                                                ][`${index}`]
                                                                ? errors[
                                                                    `${formName}HasContainerType`
                                                                  ][`${index}`][
                                                                    `${item2.name}`
                                                                  ]
                                                                  ? "has-error-select"
                                                                  : ""
                                                                : ""
                                                              : ""
                                                          }`}
                                                          classNamePrefix="select"
                                                          onKeyDown={
                                                            handleKeydown
                                                          }
                                                          styles={
                                                            globalContext.customStyles
                                                          }
                                                        />
                                                      )}
                                                    />
                                                  ) : (
                                                    <Controller
                                                      name={
                                                        `${formName}HasContainerType` +
                                                        "[" +
                                                        index +
                                                        "]" +
                                                        "[" +
                                                        item2.name +
                                                        "]"
                                                      }
                                                      control={control}
                                                      render={({
                                                        field: {
                                                          onChange,
                                                          value,
                                                        },
                                                      }) => (
                                                        <Select
                                                          isClearable={true}
                                                          {...register(
                                                            `${formName}HasContainerType` +
                                                              "[" +
                                                              index +
                                                              "]" +
                                                              "[" +
                                                              item2.name +
                                                              "]"
                                                          )}
                                                          value={
                                                            value
                                                              ? item.ContainerTypeOptions.find(
                                                                  (c) =>
                                                                    c.value ===
                                                                    value
                                                                )
                                                              : null
                                                          }
                                                          onChange={(val) => {
                                                            val == null
                                                              ? onChange(null)
                                                              : onChange(
                                                                  val.value
                                                                );
                                                            item2.onChange(
                                                              val,
                                                              index
                                                            );
                                                            formName ==
                                                            "BookingReservation"
                                                              ? formContext.QuotationRequiredFields()
                                                              : val == null
                                                              ? onChange(null)
                                                              : onChange(
                                                                  val.value
                                                                );
                                                          }}
                                                          options={
                                                            item.ContainerTypeOptions
                                                          }
                                                          isOptionDisabled={(
                                                            selectedValue
                                                          ) =>
                                                            selectedValue.selected ==
                                                            true
                                                          }
                                                          menuPortalTarget={
                                                            document.body
                                                          }
                                                          className={`basic-single ${
                                                            item2.fieldClass
                                                              ? item2.fieldClass
                                                              : ""
                                                          }`}
                                                          classNamePrefix="select"
                                                          onKeyDown={
                                                            handleKeydown
                                                          }
                                                          styles={
                                                            globalContext.customStyles
                                                          }
                                                        />
                                                      )}
                                                    />
                                                  )}
                                                </div>
                                              </div>
                                            </td>
                                          );
                                        } else {
                                          return (
                                            <td className={item2.class}>
                                              {item2.requiredField ? (
                                                <Controller
                                                  name={
                                                    `${formName}HasContainerType` +
                                                    "[" +
                                                    index +
                                                    "]" +
                                                    "[" +
                                                    item2.name +
                                                    "]"
                                                  }
                                                  control={control}
                                                  render={({
                                                    field: { onChange, value },
                                                  }) => (
                                                    <Select
                                                      isClearable={true}
                                                      {...register(
                                                        `${formName}HasContainerType` +
                                                          "[" +
                                                          index +
                                                          "]" +
                                                          "[" +
                                                          item2.name +
                                                          "]",
                                                        {
                                                          required:
                                                            "P cannot be blank.",
                                                        }
                                                      )}
                                                      value={
                                                        value
                                                          ? item2.optionColumn
                                                            ? item2.optionColumn.find(
                                                                (c) =>
                                                                  c.value ===
                                                                  value
                                                              )
                                                            : item2.options.find(
                                                                (c) =>
                                                                  c.value ===
                                                                  value
                                                              )
                                                          : null
                                                      }
                                                      onChange={(val) => {
                                                        val == null
                                                          ? onChange(null)
                                                          : onChange(val.value);
                                                        item2.onChange(
                                                          val,
                                                          index
                                                        );
                                                        formName ==
                                                        "BookingReservation"
                                                          ? formContext.QuotationRequiredFields()
                                                          : val == null
                                                          ? onChange(null)
                                                          : onChange(val.value);
                                                      }}
                                                      options={
                                                        item2.optionColumn
                                                          ? item2.optionColumn
                                                          : item2.options
                                                      }
                                                      menuPortalTarget={
                                                        document.body
                                                      }
                                                      isOptionDisabled={(
                                                        selectedValue
                                                      ) =>
                                                        selectedValue.selected ==
                                                        true
                                                      }
                                                      className={`basic-single ${
                                                        item2.fieldClass
                                                          ? item2.fieldClass
                                                          : ""
                                                      } ${
                                                        errors[
                                                          `${formName}HasContainerType`
                                                        ]
                                                          ? errors[
                                                              `${formName}HasContainerType`
                                                            ][`${index}`]
                                                            ? errors[
                                                                `${formName}HasContainerType`
                                                              ][`${index}`][
                                                                `${item2.name}`
                                                              ]
                                                              ? "has-error-select"
                                                              : ""
                                                            : ""
                                                          : ""
                                                      }`}
                                                      classNamePrefix="select"
                                                      onKeyDown={handleKeydown}
                                                      styles={
                                                        globalContext.customStyles
                                                      }
                                                    />
                                                  )}
                                                />
                                              ) : (
                                                <Controller
                                                  name={
                                                    `${formName}HasContainerType` +
                                                    "[" +
                                                    index +
                                                    "]" +
                                                    "[" +
                                                    item2.name +
                                                    "]"
                                                  }
                                                  control={control}
                                                  render={({
                                                    field: { onChange, value },
                                                  }) => (
                                                    <Select
                                                      isClearable={true}
                                                      {...register(
                                                        `${formName}HasContainerType` +
                                                          "[" +
                                                          index +
                                                          "]" +
                                                          "[" +
                                                          item2.name +
                                                          "]"
                                                      )}
                                                      value={
                                                        value
                                                          ? item2.optionColumn
                                                            ? item2.optionColumn.find(
                                                                (c) =>
                                                                  c.value ===
                                                                  value
                                                              )
                                                            : item2.options.find(
                                                                (c) =>
                                                                  c.value ===
                                                                  value
                                                              )
                                                          : null
                                                      }
                                                      onChange={(val) => {
                                                        val == null
                                                          ? onChange(null)
                                                          : onChange(val.value);
                                                        item2.onChange(
                                                          val,
                                                          index
                                                        );
                                                      }}
                                                      options={
                                                        item2.optionColumn
                                                          ? item2.optionColumn
                                                          : item2.options
                                                      }
                                                      menuPortalTarget={
                                                        document.body
                                                      }
                                                      isOptionDisabled={(
                                                        selectedValue
                                                      ) =>
                                                        selectedValue.selected ==
                                                        true
                                                      }
                                                      className={`basic-single ${
                                                        item2.fieldClass
                                                          ? item2.fieldClass
                                                          : ""
                                                      }`}
                                                      classNamePrefix="select"
                                                      onKeyDown={handleKeydown}
                                                      styles={
                                                        globalContext.customStyles
                                                      }
                                                    />
                                                  )}
                                                />
                                              )}
                                              {/* {item2.columnName == "UOM" ? <input type="hidden" className="ArrayUOM"></input> : ""} */}
                                            </td>
                                          );
                                        }
                                      }
                                      if (
                                        item2.inputType == "single-asyncSelect"
                                      ) {
                                        return (
                                          <td className={item2.class}>
                                            <Controller
                                              name={
                                                `${formName}HasContainerType` +
                                                "[" +
                                                index +
                                                "]" +
                                                "[" +
                                                item2.name +
                                                "]"
                                              }
                                              control={control}
                                              render={({
                                                field: { onChange, value },
                                              }) => (
                                                <AsyncSelect
                                                  isClearable={true}
                                                  {...register(
                                                    `${formName}HasContainerType` +
                                                      "[" +
                                                      index +
                                                      "]" +
                                                      "[" +
                                                      item2.name +
                                                      "]"
                                                  )}
                                                  value={
                                                    item2.optionColumn
                                                      ? item2.optionColumn
                                                      : value
                                                  }
                                                  placeholder={
                                                    globalContext.asyncSelectPlaceHolder
                                                  }
                                                  onChange={(val) => {
                                                    val == null
                                                      ? onChange(null)
                                                      : onChange(val.value);
                                                    item2.onChange &&
                                                      item2.onChange(
                                                        val,
                                                        index
                                                      );
                                                  }}
                                                  getOptionLabel={(val) =>
                                                    val[`${item2.optionLabel}`]
                                                  }
                                                  getOptionValue={(val) =>
                                                    val[`${item2.optionValue}`]
                                                  }
                                                  loadOptions={item2.loadOption}
                                                  menuPortalTarget={
                                                    document.body
                                                  }
                                                  className={`basic-single ${
                                                    item2.fieldClass
                                                      ? item2.fieldClass
                                                      : ""
                                                  }`}
                                                  classNamePrefix="select"
                                                  styles={
                                                    globalContext.customStyles
                                                  }
                                                />
                                              )}
                                            />
                                          </td>
                                        );
                                      }
                                      if (item2.inputType == "input-Modal") {
                                        return (
                                          <td className={item2.class}>
                                            <input
                                              type="text"
                                              className={`form-control ${
                                                item2.fieldClass
                                                  ? item2.fieldClass
                                                  : ""
                                              }`}
                                              onClick={openTextAreaModal}
                                              style={{ cursor: "pointer" }}
                                              readOnly={
                                                item2.readOnly
                                                  ? item2.readOnly
                                                  : false
                                              }
                                            />
                                            <div className="modal fade">
                                              <div className="modal-dialog">
                                                <div className="modal-content">
                                                  <div className="modal-header">
                                                    <h4 className="modal-title">
                                                      {item2.columnName}
                                                    </h4>
                                                    <button
                                                      type="button"
                                                      className="close"
                                                      data-dismiss="modal"
                                                    >
                                                      ×
                                                    </button>
                                                  </div>

                                                  <div className="modal-body">
                                                    <div className="form-group">
                                                      <textarea
                                                        id=""
                                                        className={`form-control ${item2.modelClass}`}
                                                        {...register(
                                                          `${formName}HasContainerType` +
                                                            "[" +
                                                            index +
                                                            "]" +
                                                            "[" +
                                                            item2.name +
                                                            "]"
                                                        )}
                                                        rows="5"
                                                        placeholder={`Enter ${item2.columnName}`}
                                                      ></textarea>
                                                    </div>
                                                  </div>

                                                  <div className="modal-footer">
                                                    <button
                                                      type="button"
                                                      className="btn btn-secondary"
                                                      data-dismiss="modal"
                                                    >
                                                      Close
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </td>
                                        );
                                      }
                                    })
                                  : ""}
                              </tr>
                              <tr
                                className={
                                  props.barge
                                    ? "ChargesTable"
                                    : " d-none ChargesTable"
                                }
                              >
                                {formName == "SalesInvoice" ? (
                                  <NestedTableChargesINV
                                    userRule={props.userRule}
                                    barge={props.barge ? true : false}
                                    transferPartial={props.transferPartial}
                                    formName={formName}
                                    containerIndex={index}
                                    globalContext={globalContext}
                                    openTextAreaModal={openTextAreaModal}
                                    onChangeContainerTypeChargesVoyage={
                                      onChangeContainerTypeChargesVoyage
                                    }
                                    onChangeContainerTypeCharges={
                                      onChangeContainerTypeCharges
                                    }
                                    containerChangeIndex={containerChangeIndex}
                                    quantity={quantity}
                                    combinedChargesOptions={
                                      combinedChargesOptions
                                    }
                                    setCombinedChargesOptions={
                                      setCombinedChargesOptions
                                    }
                                    port={props.port}
                                    freightTerm={props.freightTerm}
                                    setTotalDiscount={setTotalDiscount}
                                    setTotalTax={setTotalTax}
                                    setTotalAmount={setTotalAmount}
                                    taxCode={props.taxCode}
                                    currency={props.currency}
                                    cargoType={props.cargoType}
                                    loadTariffState={loadTariffState}
                                    singleloadTariffState={
                                      singleloadTariffState
                                    }
                                    containerTypeAndChargesData={
                                      props.containerTypeAndChargesData
                                    }
                                    removeState={removeState}
                                    chargesDiscriptions={chargesDiscriptions}
                                    removeAllReleatedCharges={
                                      removeAllReleatedCharges
                                    }
                                    setRemoveAllReleatedCharges={
                                      setRemoveAllReleatedCharges
                                    }
                                    removeStateRerender={removeStateRerender}
                                    setRemoveCharges={setRemoveCharges}
                                  />
                                ) : (
                                  <NestedTableCharges
                                    userRule={props.userRule}
                                    barge={props.barge ? true : false}
                                    transferPartial={props.transferPartial}
                                    formName={formName}
                                    containerIndex={index}
                                    globalContext={globalContext}
                                    openTextAreaModal={openTextAreaModal}
                                    onChangeContainerTypeChargesVoyage={
                                      onChangeContainerTypeChargesVoyage
                                    }
                                    onChangeContainerTypeCharges={
                                      onChangeContainerTypeCharges
                                    }
                                    containerChangeIndex={containerChangeIndex}
                                    quantity={quantity}
                                    combinedChargesOptions={
                                      combinedChargesOptions
                                    }
                                    setCombinedChargesOptions={
                                      setCombinedChargesOptions
                                    }
                                    port={props.port}
                                    freightTerm={props.freightTerm}
                                    setTotalDiscount={setTotalDiscount}
                                    setTotalTax={setTotalTax}
                                    setTotalAmount={setTotalAmount}
                                    taxCode={props.taxCode}
                                    currency={props.currency}
                                    cargoType={props.cargoType}
                                    loadTariffState={loadTariffState}
                                    singleloadTariffState={
                                      singleloadTariffState
                                    }
                                    containerTypeAndChargesData={
                                      props.containerTypeAndChargesData
                                    }
                                    removeState={removeState}
                                    removeAllReleatedCharges={
                                      removeAllReleatedCharges
                                    }
                                    setRemoveAllReleatedCharges={
                                      setRemoveAllReleatedCharges
                                    }
                                    removeStateRerender={removeStateRerender}
                                    setRemoveCharges={setRemoveCharges}
                                  />
                                )}
                              </tr>
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                    {!props.transferPartial && !props.barge && (
                      <button
                        className="btn add-container btn-success btn-xs"
                        type="button"
                        onClick={appendContainerHandle}
                      >
                        <i className="fa fa-plus"></i> Add Container
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {!props.transferPartial && (
        <QuickFormTotalCard
          props={props}
          totalDiscount={totalDiscount}
          totalTax={totalTax}
          totalAmount={totalAmount}
          documentData={props.documentData}
        />
      )}
    </>
  );
}

export default QuickFormContainer;
