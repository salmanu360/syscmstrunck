

import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery';


export async function GetUpdateData(id, auth, model) {
  var newModel = model == "port" ? "area" : model
  newModel = newModel == "terminal" ? "port-details" : newModel
  const response = await axios.get(auth.globalHost + auth.globalPathLink + newModel + "/get-update-data?id=" + id, {
    auth: {
      username: auth.authInfo.username,
      password: auth.authInfo.access_token,
    },
  })
  return response
}


export async function CreateData(auth, model, formData) {
  var newModel = model == "port" ? "area" : model
  newModel = newModel == "terminal" ? "port-details" : newModel
  const response = await axios.post(auth.globalHost + auth.globalPathLink + newModel + "/create-data", formData, {
    auth: {
      username: auth.authInfo.username,
      password: auth.authInfo.access_token,
    },
  })
  return response
}

export async function UpdateData(id, auth, model, formData) {
  var newModel = model == "port" ? "area" : model
  newModel = newModel == "terminal" ? "port-details" : newModel
  const response = await axios.post(auth.globalHost + auth.globalPathLink + newModel + "/update-data?id=" + id, formData, {
    auth: {
      username: auth.authInfo.username,
      password: auth.authInfo.access_token,
    },
  })
  return response
}

export async function ChangePassword(auth,formData) {
  const response = await axios.post(auth.globalHost + auth.globalPathLink+"site/change-password", formData, {
    auth: {
      username: auth.authInfo.username,
      password: auth.authInfo.access_token,
    },
  })
  return response
}

//use when pass = default pass
export async function ChangePasswordDefault(auth,info,formData) {
  const response = await axios.post(auth.globalHost + auth.globalPathLink+"site/change-password", formData, {
    auth: {
      username: info.username,
      password: info.access_token,
    },
  })
  return response
}

export function ToastNotify(type, message,autoCloseTime) {
  toast[type](message, {
    position: "bottom-right",
    autoClose: autoCloseTime?autoCloseTime:1000,
    hideProgressBar: true,
    closeOnClick: true,
    progress: undefined,
  });
}


export function ControlOverlay(value) {
  value === true ? $(".PageOverlay").removeClass("d-none") : $(".PageOverlay").addClass("d-none")
}

export async function GetAllDropDown(data, auth, async) {

  if (async == undefined) {
    async = true;
  }

  const response = await $.ajax({
    type: "POST",
    async: async,
    url: auth.globalHost + auth.globalPathLink + "universal/get-all-dropdown-data",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { Tables: data }

  });
  return response
}



//get companies and its branch data
export async function GetCompaniesData(data, auth) {

  var filters = {
    "CompanyUUID": data
  };

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "company/get-companies",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { filters: filters },

  });
  return response
}

//get companies and its branch data
export async function GetReceiptSalesINvoice(data, auth) {

  var filters = {
    "SalesInvoice.BranchCode": data
  };

  var orderBy = {
    "SalesInvoice.DocDate" : "SORT_ASC" 
};

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "sales-invoice/get-sales-invoice",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { filters: filters,orderBy:orderBy },

  });
  return response
}


export async function CreateBC(id, auth, model) {
  var newModel = model == "port" ? "area" : model
  newModel = newModel == "terminal" ? "port-details" : newModel

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + newModel + "/create-booking-confirmation",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data:{
      BookingReservationUUIDs:id
    }
  });
  return response
}

export async function GetCOCCompaniesData(data, auth) {

  var filters = {
    "CompanyName": data
  };

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "company/get-companies",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { filters: filters },

  });
  return response
}
//get branch data
export async function GetBranchData(value, auth) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "company-branch/get-company-branch-by-id?id=" + value,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
  });
  return response
}


export async function Throw(auth, model, data) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + model + "/throw2",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: data,
  });
  return response
}

export async function Remove(auth, model, data) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + model + "/remove2",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: data,
  });
  return response
}

export async function Approved(auth, model, data) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + model + "/approved",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: data,
  });
  return response
}

export async function RejectUser(auth, model, data) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + model + "/reject",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: data,
  });
  return response
}

export async function Suspend(auth, model, data) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + model + "/suspend",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: data,
  });
  return response
}

export async function Reset(auth, model, data) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + model + "/reset",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: data,
  });
  return response
}

export async function Verify(auth, model, data) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + model + "/verify?status=Verify",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: data,
  });
  return response
}

export async function cancelApprovedReject(auth, model, data) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + model + "/verify?status=Pending",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: data,
  });
  return response
}


export async function Reject(auth, model, data) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + model + "/verify?status=Reject",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: data,
  });
  return response
}

export async function RejectRecord(auth, model, data) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + model + "/reject-record",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: data,
  });
  return response
}



export async function GetCompanyByShipOrBox(data, auth) {


  const response = await $.ajax({
    type: "GET",
    url: auth.globalHost + auth.globalPathLink + "company/get-companies-by-ship-or-box-operator?Operator=" + data,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },

  });
  return response
}


export function createCookie(name, value, days) {
  var expires;
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toGMTString();

  } else {
    expires = "";
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

export function getCookie(c_name) {
  if (document.cookie.length > 0) {
    var c_start = document.cookie.indexOf(c_name + "=");
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1;
      var c_end = document.cookie.indexOf(";", c_start);
      if (c_end == -1) {
        c_end = document.cookie.length;
      }
      return unescape(document.cookie.substring(c_start, c_end));
    }
  }
  return "";
}

export async function GetChargesByAreaContainer(data, auth, async) {
 
  if (async == undefined) {
    async = true;
  }

  const response = await $.ajax({
    type: "POST",
    async: async,
    url: auth.globalHost + auth.globalPathLink + "charges/get-charges-by-area2?ContainerType=" + data.ContainerType,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { POL: data.POL, POD: data.POD, StartDate: data.StartDate, EndDate: data.EndDate,CurrencyType:data.CurrencyType },

  });
  return response
}

export async function GetGroupChargesByAreaContainer(data,containerType, auth, async) {
 
  if (async == undefined) {
    async = true;
  }

  const response = await $.ajax({
    type: "POST",
    async: async,
    url: auth.globalHost + auth.globalPathLink + "charges/get-charges-by-area3?ContainerType=" + containerType,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { POL: data.POL, POD: data.POD, StartDate: data.StartDate, EndDate: data.EndDate,CurrencyType:data.CurrencyType },

  });
  return response
}


export async function getPortDetails(data, auth) {

  var filters = {
    "PortCode": data
  };

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "port-details/get-port-details",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { filters: filters },

  });
  return response
}

export async function GetPortDetailsByFilters(filters, auth) {

  // var filters = {
  //   "PortCode": data
  // };

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "port-details/get-port-details",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { filters: filters },

  });
  return response
}


export async function getPortDetailsById(data, auth) {
  const response = await $.ajax({
    type: "GET",
    url: auth.globalHost + auth.globalPathLink + "port-details/get-port-details-by-id?id="+data,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },


  });
  return response
}

export async function GetChargesById(data, auth) {

  const response = await $.ajax({
    type: "GET",
    url: auth.globalHost + auth.globalPathLink + "charges/get-charges-by-id?id=" + data,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },

  });
  return response
}

export async function GetBCChargesDescrption(data,auth) {

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "credit-note/get-b-c-charges-description",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data:{ChargesData: data}

  });
  return response
}


export async function getCurrencyRate(filters, auth) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "currency-rate/get-currency-rate", 
    dataType: "json",
    data: { filters: filters },
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },

  });
  return response
}

export async function GetTaxCodeById(data, auth) {

  const response = await $.ajax({
    type: "GET",
    url: auth.globalHost + auth.globalPathLink + "tax-code/get-tax-code-by-id?id=" + data,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },

  });
  return response
}

export async function GetCreditTerm(data, auth) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "credit-term/get-credit-terms",
    dataType: "json",
    data: { filters: data },
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },

  });
  return response
}

export async function getCompanyBranches(data, auth) {
  var filters = {
    "Company": data
  };

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "company-branch/get-company-branches",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { filters: filters },

  });
  return response
}

export async function getAreas(data, auth) {
  var filters = {
    "AreaUUID": data
  };

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "area/get-areas",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { filters: filters },

  });
  return response
}

export async function getAreaById(data, auth) {
  var filters = {
    "Area.Valid": 1,
  };
  const response = await $.ajax({
    type: "GET",
    url: auth.globalHost + auth.globalPathLink + "area/get-area-by-id?id="+data,
    dataType: "json",
    data: { filters: filters },
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },

  });
  return response
}

export async function getUNNumberByID(data, auth) {
  const response = await $.ajax({
    type: "GET",
    url: auth.globalHost + auth.globalPathLink + "u-n-number/get-u-n-number-by-id?id="+data,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },

  });
  return response
}

export async function getHSCodeByID(data, auth) {
  const response = await $.ajax({
    type: "GET",
    url: auth.globalHost + auth.globalPathLink + "h-s-code/get-h-s-code-by-id?id="+data,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },

  });
  return response
}

export async function getTransferVoyageEffectedDocument(id, auth) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "booking-reservation/effected-documents?id="+id,
    dataType: "json",
    async: false,
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },

  });
  return response
}

export async function TransferVoyageBR(id,FromVoyageTranshipment,qtNo, auth) {

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "booking-reservation/transfer-voyage?id="+id,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { 
      FromVoyageTranshipment,
      Quotation: qtNo ,
    },

  });
  return response
}

export async function getCompanyDataByCompanyType(data, auth) {

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "company/get-company-data-by-company-type",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { CompanyType: data },

  });
  return response
}

export async function getCompanyDataByID(data, auth) {

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "company/get-company-by-id?id="+data,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { filters: {"CompanyUUID": data} },

  });
  return response
}

export async function getContainerByContainerTypeDepot(data, auth) {

  const response = await $.ajax({
    type: "GET",
    url: auth.globalHost + auth.globalPathLink + "container/get-container-by-container-type?Depot=" + data,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },

  });
  return response
}

export async function getBookingReservationContainerById(data, auth) {

  const response = await $.ajax({
    type: "GET",
    url: auth.globalHost + auth.globalPathLink + "booking-reservation/get-booking-reservation-containers?id=" + data,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },

  });
  return response
}

export async function getContainers(data, filters,auth) {

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "container/get-containers",
    dataType: "json",
    data: { filters: filters },
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },

  });
  return response
}

export async function getContainersWithModal(url,auth) {

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + url,
    dataType: "json",
    // data: { filters: filters },
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },

  });
  return response
}


export async function getContainerType(data, auth) {
  var filters = {
    "ContainerTypeUUID": data
  };

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "container-type/get-container-type",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { filters: filters },

  });
  return response
}


export async function GetRoutePointByRouteId(data, auth) {
 
  const response = await $.ajax({
    type: "GET",
    url: auth.globalHost + auth.globalPathLink + "route/get-route-points-by-route-id?id="+data,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },

  });
  return response
}



export async function getUserRules(data, auth) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "user/get-user-rules?id=" + data,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },

  });
  return response
}

export async function GetUserDetails(auth) {

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "user/get-users",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { "filters[id]": auth.authInfo.id },

  });
  return response
}

export async function GetCompanyDropdown(CompanyType,params,auth) {

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "company/get-company-dropdown",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { "CompanyType": CompanyType , "param": params},

  });
  return response
}

export async function GetCompanyBranchDropdown(params,auth) {

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "company-branch/get-company-branch-dropdown",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: {"param": params},

  });
  return response
}

export async function GetCompanyBranches(filters,auth) {

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "company-branch/get-company-branches",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: {"filters": filters},

  });
  return response
}

export async function releaseContainer(data,auth) {

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "container-release/release-container",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: {"BRContainerIDs": data},

  });
  return response
}


export async function releaseReplaceContainer(data,auth) {

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "container-release/replace-release-container",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: {"ContainerReplaced": data},

  });
  return response
}

export async function loadContainer(data,auth) {

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "container-loaded/loaded-container",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: {"BRContainerIDs": data},

  });
  return response
}

export async function dischargeContainer(data,auth) {

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "container-discharged/discharged-container",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: {"BRContainerIDs": data},

  });
  return response
}

export async function gateOutContainer(data,auth) {

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "container-gate-out/gate-out-container",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: {"BRContainerIDs": data},

  });
  return response
}

export async function receivedContainer(data,auth) {

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "container-receive/received-container",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: {"BRContainerIDs": data},

  });
  return response
}


export async function gateInContainer(data,auth) {

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "container-gate-in/gate-in-container",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: {"BRContainerIDs": data},

  });
  return response
}

export async function GetCompanyContacts(filters,auth) {

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "company-contact/get-company-contacts",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: {"filters": filters},

  });
  return response
}

export async function GetPortDetailsByUserPort(data,auth) {

  const response = await $.ajax({
    type: "GET",
    url: auth.globalHost + auth.globalPathLink + "port-details/get-port-details-by-user-port?UserPort="+data,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },

  });
  return response
}


export async function getFindContainerStatus(filters,auth) {

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "real-time-tracking/find-container-status",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { 
    ContainerCode: filters.ContainerCode,
    BL:filters.BL,
    BR:filters.BR
  },

  });
  return response
}

export async function getCheckCompany(filters,auth) {

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "company/check-company",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { filters:filters}
  

  });
  return response
}

export async function getCheckCharges(filters,auth) {

  const response = await $.ajax({
    type: "POST",
    async: false,
    url: auth.globalHost + auth.globalPathLink + "charges/check-charges",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { filters:filters}
  

  });
  return response
}

export async function getCheckTariff(filters,auth) {

  const response = await $.ajax({
    type: "POST",
    async: false,
    url: auth.globalHost + auth.globalPathLink + "tariff/check-tariff",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { filters:filters}
  

  });
  return response
}

export async function GetCompanyContactsByCompanyBranch(param,auth) {

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "company-contact/get-company-contacts-by-company-branch",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: {"param": param},

  });
  return response
}

export async function getEffectedDocuments(data,auth) {

  const response = await $.ajax({
    type: "POST",
    async:false,
    url: auth.globalHost + auth.globalPathLink + "charges/effected-documents",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { "arrayCharges" : JSON.stringify(data)},

  });
  return response
}

export async function getEffectedDocumentsConfirm(data,auth) {

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "charges/confirm",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { "arrayUUIDs" : data},

  });
  return response
}



export async function getContainerVerifyGrossMassListDataByPort(auth) {
 
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "container-verify-gross-mass/get-list-data-by-user-has-port",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },

  });
  return response
}

export async function FindVoyagesWithPolPod(data,auth) {
  const response = await $.ajax({
    type: "POST", 
    url: auth.globalHost + auth.globalPathLink + "voyage/find-voyages-with-pol-pod",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { 
      POL:data.POL,
      POD:data.POD,
      DocDate:data.DocDate,
      LastValidDate:data.LastValidDate,
      POTVoyageUUIDs:data.POTVoyageUUIDs,
      PrevVoyage:data.PrevVoyage? data.PrevVoyage:""
    }

  });
  return response
}
export async function FilterQuotations(data,auth) {
  var BRDocDate = data.DocDate
  var BRLastValidDate = data.LastValidDate
  var filters = {
    POLPortCode:data.filter.POLPortCode,
    PODPortCode:data.filter.PODPortCode,
    QuotationBillTo:data.filter.QuotationBillTo,
    QuotationType:data.filter.QuotationType,
    QuotationHasContainerType:data.QuotationHasContainerType,
    filtersTranshipment:data.filtersTranshipment,
    filtersAgent:data.filtersAgent.ROC,
    filtersShipper:data.filtersShipper.ROC,
    filtersConsignee:data.filtersConsignee.ROC,
  }
 
  const response = await $.ajax({
    type: "POST", 
    url: auth.globalHost + auth.globalPathLink + "quotation/filter-quotations",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { filters,BRDocDate,BRLastValidDate}

  });
  return response
}

export async function Preview(auth, model, id) {
  const response = await axios.get(auth.globalHost + auth.globalPathLink + model + "/preview?id=" + id, {
    method:"GET",
    responseType: 'arraybuffer',
    auth: {
      username: auth.authInfo.username,
      password: auth.authInfo.access_token,
    },
  })

  return response
}
export async function PreviewLetter(auth, model, id) {
  const response = await axios.get(auth.globalHost + auth.globalPathLink + model + "/preview-letter?id=" + id, {
    method:"GET",
    responseType: 'arraybuffer',
    auth: {
      username: auth.authInfo.username,
      password: auth.authInfo.access_token,
    },
  })

  return response
}

export async function PreviewBR(auth, model, id) {
  const response = await axios.get(auth.globalHost + auth.globalPathLink + model + "/preview?id=" + id, {
    method:"GET",
    responseType: 'arraybuffer',
    auth: {
      username: auth.authInfo.username,
      password: auth.authInfo.access_token,
    },
  })

  return response
}

export async function PreviewBC(auth, model, id) {
  const response = await axios.get(auth.globalHost + auth.globalPathLink + model + "/preview-confirmation?id=" + id, {
    method:"GET",
    responseType: 'arraybuffer',
    auth: {
      username: auth.authInfo.username,
      password: auth.authInfo.access_token,
    },
  })

  return response
}

export async function PreviewBillOfLading(auth, model, id,reportType) {
  const response = await axios.get(auth.globalHost + auth.globalPathLink + model + "/preview?id=" + id+"&ReportType="+reportType, {
    method:"GET",
    responseType: 'arraybuffer',
    auth: {
      username: auth.authInfo.username,
      password: auth.authInfo.access_token,
    },
  })

  return response
}

export async function PreviewINVCNDN(auth, model, id,reportType) {
  const response = await axios.get(auth.globalHost + auth.globalPathLink + model + "/preview?id=" + id+"&ReportType="+reportType, {
    method:"GET",
    responseType: 'arraybuffer',
    auth: {
      username: auth.authInfo.username,
      password: auth.authInfo.access_token,
    },
  })

  return response
}

export async function FindAllocation(data,auth) {

  const response = await $.ajax({
    type: "POST", 
    url: auth.globalHost + auth.globalPathLink + "booking-reservation/find-allocation",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { 
      VoyageUUID: data.allocateVoyage,
      POL: data.allocatePortCode,
      VoyageNo: data.StrvoyageNo,
      VoyageScheduleUUID: data.voyageScheduleUUID,
    }

  });
  return response
}


export async function getVoyageByIdSpecial(result, auth) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "voyage/get-voyage-by-id-special?id=" + result,
    dataType: "json",
    async: false,
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },

  });
  return response
}

export async function FindDepotCompany(data, auth) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "company/find-depot-company?UserPort=" + data,
    dataType: "json",
    async: false,
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },

  });
  return response
}

export async function FindDepotBranch(company,port, auth) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "company/find-depot-branch?UserPort=" + port+"&CompanyUUID="+company,
    dataType: "json",
    async: false,
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },

  });
  return response
}
export async function CheckVoyage(data, auth) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "voyage/check-voyage?id=" + data,
    dataType: "json",
    async: false,
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },

  });
  return response
}

export async function getVesselById(data, auth) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "vessel/get-vessel-by-id?id=" + data,
    dataType: "json",
    async: false,
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },

  });
  return response
}

export async function FindVoyages(result, auth) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "voyage/find-voyages",
    dataType: "json",
    async: false,
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data:{filters:result},
  });
  return response
}

export async function FindVoyageSuggestion(result, auth) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "voyage/find-voyage-suggestions",
    dataType: "json",
    async: false,
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data:{POD:result.POD,POL:result.POL,POLReqETA:result.POLReqETA,PODReqETA:result.PODReqETA},
  });
  return response
}


export async function FindRemainingBR(auth) {
  const response = await $.ajax({
    type: "GET",
    url: auth.globalHost + auth.globalPathLink + "container-release-order/find-remaining-b-r",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
  });
  return response
}

export async function FindRemainingBC(auth) {
  const response = await $.ajax({
    type: "GET",
    url: auth.globalHost + auth.globalPathLink + "booking-confirmation/get-remaining-booking-confirmation",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
  });
  return response
}

export async function FindBLRemainingBR(auth) {
  const response = await $.ajax({
    type: "GET",
    url: auth.globalHost + auth.globalPathLink + "bill-of-lading/find-remaining-b-r",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
  });
  return response
}

export async function getChargesByContainerTypeAndPortCode(ContainerType, UserPortCode, auth,voyageUUID,async) {
  if (async == undefined) {
    async = true;
  }
  const response = await $.ajax({
    type: "POST",
    async:async,
    url: auth.globalHost + auth.globalPathLink + "charges/get-charges-by-container-type-and-port-code?ContainerType=" + ContainerType + "&PortCode=" + UserPortCode +"&VoyageUUID="+voyageUUID,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
  });
  return response
}

export async function getContainerTypeById(id, auth) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "universal/get-container-type?id=" + id,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
  });
  return response
}

export async function getTransferFromQuotationData(id, auth) {
  const response = await axios.get(auth.globalHost + auth.globalPathLink +"booking-reservation/transfer-from-quotation-data?id=" + id, {
    auth: {
      username: auth.authInfo.username,
      password: auth.authInfo.access_token,
    },
  })
  return response
}

export async function getSplitDataBR(data, auth) {
  const response = await axios.get(auth.globalHost + auth.globalPathLink +"booking-reservation/get-split-data?SplitID=" + data.containerTypeID + "&id="+ data.id + "&ContainerID=" + data.splitID, {
    auth: {
      username: auth.authInfo.username,
      password: auth.authInfo.access_token,
    },
  })
  return response
}

export async function getCROTransferFromBooking(id, auth) {
  const response = await axios.get(auth.globalHost + auth.globalPathLink +"container-release-order/transfer-from-booking-reservation-data?id=" + id, {
    auth: {
      username: auth.authInfo.username,
      password: auth.authInfo.access_token,
    },
  })
  return response
}

export async function getINVTransferFromBooking(id,CustomerType,BillTo,ChargesID, auth) {
  var stringChargesID = ChargesID?ChargesID.join(","):""
  const response = await axios.get(auth.globalHost + auth.globalPathLink +"sales-invoice/transfer-from-booking-confirmation-data?id=" + id+"&BillTo="+BillTo+"&CustomerType="+CustomerType+"&ChargesID="+stringChargesID, {
    auth: {
      username: auth.authInfo.username,
      password: auth.authInfo.access_token,
    },
  })
  return response
}

export async function getBLTransferFromBooking(id, auth) {
  const response = await axios.get(auth.globalHost + auth.globalPathLink +"bill-of-lading/transfer-from-booking-reservation-data?id=" + id, {
    auth: {
      username: auth.authInfo.username,
      password: auth.authInfo.access_token,
    },
  })
  return response
}

export async function GetSplitBL(id, auth,shareID,splitID) {
  const response = await axios.get(auth.globalHost + auth.globalPathLink +"bill-of-lading/get-b-r-split-share-data?id=" + id+"&SplitID=" + splitID + "&ShareID=" + shareID, {
    auth: {
      username: auth.authInfo.username,
      password: auth.authInfo.access_token,
    },
  })
  return response
}

export async function GetMergeBL(id, auth,mergeIDs) {
  const response = await axios.get(auth.globalHost + auth.globalPathLink +"bill-of-lading/get-merge-bill-of-lading-containers-data?id=" + id+"&mergeIDs=" + mergeIDs, {
    auth: {
      username: auth.authInfo.username,
      password: auth.authInfo.access_token,
    },
  })
  return response
}

export async function GetMergeBR(id, auth,mergeIDs) {
  const response = await axios.get(auth.globalHost + auth.globalPathLink +"booking-reservation/get-merge-booking-reservation-data?id=" + id+"&mergeIDs=" + mergeIDs, {
    auth: {
      username: auth.authInfo.username,
      password: auth.authInfo.access_token,
    },
  })
  return response
}

export async function GetMergeBLList(id, auth,pOLPortCode,pODportCode,voyageNum) {
  const response = await axios.get(auth.globalHost + auth.globalPathLink +"bill-of-lading/get-merge-bill-of-lading-list?id=" + id+"&PODPortCode=" + pODportCode + "&POLPortCode=" + pOLPortCode+"&VoyageNum="+voyageNum, {
    auth: {
      username: auth.authInfo.username,
      password: auth.authInfo.access_token,
    },
  })
  return response
}

export async function GetMergeBRList(id, auth, POLCodeMerge, PODCodeMerge, VoyageNumMerge, qtNo) {
  const response = await axios.get(auth.globalHost + auth.globalPathLink +"booking-reservation/get-b-r-by-pol-pod-voyage?id=" + id + "&POL=" + POLCodeMerge + "&POD=" + PODCodeMerge + "&VoyageNum=" + VoyageNumMerge + "&QuotationUUID=" + qtNo, {
    auth: {
      username: auth.authInfo.username,
      password: auth.authInfo.access_token,
    },
  })
  return response
}

export async function SplitShareContainer(auth,formData,id,splitID,shareID) {
  const response = await axios.post(auth.globalHost + auth.globalPathLink +"bill-of-lading/split-share-containers?SplitID="+splitID+"&ShareID="+shareID+"&id="+id, formData, {
    auth: {
      username: auth.authInfo.username,
      password: auth.authInfo.access_token,
    },
  })
  return response
}

export async function SplitContainerBR(auth,formData,id,containerID) {
  const response = await axios.post(auth.globalHost + auth.globalPathLink +"booking-reservation/split-containers?id="+id+"&BRContainerID="+containerID , formData, {
    auth: {
      username: auth.authInfo.username,
      password: auth.authInfo.access_token,
    },
  })
  return response
}

export async function MergeBillOfLading(auth,formData,id,mergeIDs) {
  const response = await axios.post(auth.globalHost + auth.globalPathLink +"bill-of-lading/merge-bill-of-lading?id="+id+"&mergeIDs="+mergeIDs, formData, {
    auth: {
      username: auth.authInfo.username,
      password: auth.authInfo.access_token,
    },
  })
  return response
}

export async function MergeBookingReservation(auth,formData,id,mergeIDs) {
  const response = await axios.post(auth.globalHost + auth.globalPathLink +"booking-reservation/merge-booking-reservation-data?id="+id+"&mergeIDs="+mergeIDs, formData, {
    auth: {
      username: auth.authInfo.username,
      password: auth.authInfo.access_token,
    },
  })
  return response
}

export async function TelexRelease(auth, model, data) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + model + "/telex-release2",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: data,
  });
  return response
}

export async function RevertSplitBL(auth, model, data) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + model + "/revert-split?id="+data,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: data,
  });
  return response
}

export async function GetBillOfLadingContainers(auth, model, data) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + model + "/get-bill-of-lading-containers?id="+data,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
  });
  return response
}

export async function GetBookingReservationsContainers(auth, model, data) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + model + "/get-booking-reservation-containers?id="+data,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
  });
  return response
}

export async function CheckingMergeBookingReservation(auth,id,mergeIDs) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "booking-reservation/merge-booking-reservation?id="+id+"&mergeIDs="+mergeIDs,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
  });
  return response
}

export async function getBCChargesDescription(data,auth) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "sales-invoice/get-b-c-charges-description",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: {
      ContainerType:data
    },
  });
  return response
}

export async function GetUser(data, auth) {

  var filters = {
    "id": data
  };

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "user/get-users",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { filters: filters },

  });
  return response
}

export async function CheckBoxHandle(e) {
  var id = $(e.target).attr("id")
  if(e.target.checked){
    $(e.target).parent().find(":hidden").val("1")
    $(e.target).parent().find("input:text").val("1")
  }else{
    $(e.target).parent().find(":hidden").val("0")
    $(e.target).parent().find("input:text").val("0")
  }
}

export async function GetBookingReservationContainerQty(id,auth) {

  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "container-release-order/get-booking-reservation-container-qty",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { BookingReservation:id}
  
  });
  return response
}

export async function GetUpdateDND(data,model,auth) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + model+"/update-dnd",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { 
      QuotationUUIDs:data.QuotationUUID,
      ApplyDND:data.ApplyDND,
      DNDCombined:data.DNDCombined,
      DNDCombinedDay:data.DNDCombinedDay,
      Detention:data.Detention,
      Demurrage:data.Demurrage,
    }
  });
  return response
}

export async function CheckDOStatus(auth, model, data) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + model + "/generate-d-o",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: data,
  });
  return response
}

export async function GetVoyageDelay(auth, model, data) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + model + "/get-voyage-delay-data?id="+data,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
  });
  return response
}

export async function CheckVoyageDelay(auth, model, id,data) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + model + "/check-voyage-delay?id=" + id,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: data,
  });
  return response
}

export async function CheckVoyageEffectedDocument(auth, model,id,data) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + model + "/effected-documents?id=" + id,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: {VoyageSchedulesData:data},
  });
  return response
}

export async function ImportContainerCRO(auth,depot,data) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "container-release-order/read-excel?Depot=" + depot,
    dataType: "json",
    processData: false,  // tell jQuery not to process the data
    contentType: false,  // tell jQuery not to set contentType
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: data,
  });
  return response
}

export async function ImportContainer(auth,data) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "container/import-container-excel",
    dataType: "json",
    processData: false,  // tell jQuery not to process the data
    contentType: false,  // tell jQuery not to set contentType
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: data,
  });
  return response
}

export async function GetRemainingInvoice(auth, model,data) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + model + "/get-remaining-sales-invoices",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: {BranchCode:data},
  });
  return response
}

export async function CheckTransferPartialBillTo(data,auth) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink +"sales-invoice/check-transfer-partial-bill-to",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: {BCContainerTypes:data},  
  });
  return response
}

export async function LoadPartialBCById(id, auth) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "sales-invoice/load-partial-booking-confirmation?id=" + id,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
  });
  return response
}

export async function TransferToCreditNote(id, auth) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "sales-invoice/transfer-to-credit-note-get-remaining-charges-data?id=" + id,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
  });
  return response
}

export async function TransferToDebitNote(id, auth) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "sales-invoice/transfer-to-debit-note-get-remaining-charges-data?id=" + id,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
  });
  return response
}

export async function getRemainingBCbyID(id, auth) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "booking-confirmation/get-remaining-booking-confirmation-by-id?id=" + id,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
  });
  return response
}

export async function checkBCTransfer(id, auth) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "booking-confirmation/check-booking-confirmation-transfer?id=" + id,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
  });
  return response
}

export async function getBookingConfirmationHasContainerType(id, auth) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "booking-confirmation/get-booking-confirmation-has-container-type?id=" + id,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
  });
  return response
}

export async function GetCNDNTransferFromSalesInvoice(id,model, auth,array) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + model + "/get-transfer-from-sales-invoice-data?id=" + id,
    dataType: "json",
    data: {ChargesContainer:array},
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
  });
  return response
}


export async function GetRuleSetRule(id,model, auth,) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + model + "/get-rule-set-rules?id=" + id,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
  });
  return response
}

export async function GetRuleSetUers(id,model, auth,) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + model + "/get-rule-set-users?id=" + id,
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
  });
  return response
}

export async function GetUserRuleByRuleSet(id,model, auth,data) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + model + "/get-user-by-rule-set?id=" + id,
    dataType: "json",
    data:{  
      Scope: data.Scope,
      Port: data.Port,
      FreightTerm: data.FreightTerm,
      rules: data.rules},
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
  });
  return response
}

export async function UpdateUserRule(id,model, auth,data) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + model + "/update-user-rules?id=" + id,
    dataType: "json",
    data:{  
      Scope: data.Scope,
      Port: data.Port,
      FreightTerm: data.FreightTerm,
      AccessControl:data.AccessControl
    },
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
  });
  return response
}

export async function UpdateRuleSetUers(id,model, auth,data) {
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + model + "/update-rule-set-users?id=" + id,
    dataType: "json",
    data:{  
      users: data,
    },
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
  });
  return response
}

export async function UpdateUserRuleByRuleSet(id,model, auth,data) {
  if(data.users){
    const response = await $.ajax({
      type: "POST",
      url: auth.globalHost + auth.globalPathLink + model + "/update-rule-set-rules?id=" + id,
      dataType: "json",
      data:{  
        Scope: data.Scope,
        Port: data.Port,
        FreightTerm: data.FreightTerm,
        rules: data.rules,
        users:data.users
      },
      headers: {
        "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
      },
    });
    return response
  }else{
    const response = await $.ajax({
      type: "POST",
      url: auth.globalHost + auth.globalPathLink + model + "/update-rule-set-rules?id=" + id,
      dataType: "json",
      data:{  
        Scope: data.Scope,
        Port: data.Port,
        FreightTerm: data.FreightTerm,
        rules: data.rules},
      headers: {
        "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
      },
    });
    return response
  }

 
}

export async function GetAllPendingDocumentAll(auth,data) {
  var param = {
    limit: data.limit,
    offset: data.offset,
    type: data.type
}
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink+"site/get-pending-documents",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { param: param },
  });
  return response
}

export async function GetVoyageDelayDocuments(auth,data) {
  var param = {
    limit: data.limit,
    offset: data.offset,
    type: data.type
}
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink+"voyage/get-voyage-delay-documents",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: { param: param },
  });
  return response
}


export async function LoadTariff(data,auth) {
  var SingleLoadTariff = data.SingleLoadTariff
  var ContainerType = data.ContainerType
  var DocDate = data.DocDate
  var POLPortCode = data.POLPortCode
  var POLAreaName = data.POLAreaName
  var POLPortTerm = data.POLPortTerm
  var PODPortCode = data.PODPortCode
  var PODAreaName = data.PODAreaName
  var PODPortTerm = data.PODPortTerm
  var ContainerOwnershipType = data.ContainerOwnershipType
  var DGClass = data.DGClass
  var MinQty = data.MinQty
  var BoxOpCo = data.BoxOpCo
  var BoxOpBranch = data.BoxOpBranch
  var ShipOpCo = data.ShipOpCo
  var ShipOpBranch = data.ShipOpBranch
  var Empty = data.Empty
  var CurrencyType = data.CurrencyType
  var VoyageUUID = data.VoyageUUID
  const response = await $.ajax({
    type: "POST",
    url: auth.globalHost + auth.globalPathLink + "quotation/load-tariff",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(auth.authInfo.username + ":" + auth.authInfo.access_token)
    },
    data: {
      SingleLoadTariff,
      ContainerType,
      DocDate,
      POLPortCode,
      POLAreaName,
      POLPortTerm,
      PODPortCode,
      PODAreaName,
      PODPortTerm,
      ContainerOwnershipType,
      DGClass,
      MinQty,
      BoxOpCo,
      BoxOpBranch,
      ShipOpCo,
      ShipOpBranch,
      Empty,
      CurrencyType,
      VoyageUUID,
    }
  
  });
  return response
}

export function numberToWords(number) {
  var digit = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
  var elevenSeries = ['TEN', 'EVELEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SISTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
  var countingByTens = ['TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];
  var shortScale = ['', 'THOUSAND', 'MILLION', 'BILLION', ''];

  number = number.toString(); number = number.replace(/[\, ]/g, ''); if (number != parseFloat(number)) return 'not a number'; var x = number.indexOf('.'); if (x == -1) x = number.length; if (x > 15) return 'too big'; var n = number.split(''); var str = ''; var sk = 0; for (var i = 0; i < x; i++) { if ((x - i) % 3 == 2) { if (n[i] == '1') { str += elevenSeries[Number(n[i + 1])] + ' '; i++; sk = 1; } else if (n[i] != 0) { str += countingByTens[n[i] - 2] + ' '; sk = 1; } } else if (n[i] != 0) { str += digit[n[i]] + ' '; if ((x - i) % 3 == 0) str += 'hundred '; sk = 1; } if ((x - i) % 3 == 1) { if (sk) str += shortScale[(x - i - 1) / 3] + ' '; sk = 0; } } if (x != number.length) { var y = number.length; str += 'point '; for (var i = x + 1; i < y; i++) str += digit[n[i]] + ' '; } str = str.replace(/\number+/g, ' ');
  return str.trim();

}

export async function InitAttachment (data,id) {
  window.$('#'+id).filer({
    showThumbs: true,
    addMore: true,
    allowDuplicates: false,
    theme: 'default',
    templates: {
      itemAppendToEnd: true,
      box: '<ul class="jFiler-items-list jFiler-items-default"></ul>',
      item: '<li class="jFiler-item">\
              <div class="jFiler-item-container">\
                <div class="jFiler-item-inner">\
                  <div class="jFiler-item-icon pull-left"></div>\
                    <div class="jFiler-item-info pull-left">\
                      <span class="jFiler-item-title" title="{{fi-name}}">{{fi-name | limitTo:30}}</span>\
                      <span class="jFiler-item-others">\
                        <span>| size: {{fi-size2}} | </span><span>type: {{fi-extension}}</span><span class="jFiler-item-status">{{fi-progressBar}}</span>\
                      </span>\
                      <div class="jFiler-item-assets">\
                        <ul class="list-inline">\
                          <li><a class="icon-jfi-trash jFiler-item-trash-action"></a></li>\
                      </ul>\
                    </div>\
                    <div><input type="hidden" name="Unit[AttachmentsName][]" value="{{fi-name}}"></div>\
                  </div>\
                </div>\
              </div>\
            </li>',
      itemAppend: '<li class="jFiler-item">\
      <div class="jFiler-item-container">\
        <div class="jFiler-item-inner">\
          <div class="jFiler-item-icon pull-left"></div>\
            <div class="jFiler-item-info pull-left">\
              <span class="jFiler-item-title" title="{{fi-name}}">{{fi-name | limitTo:30}}</span>\
              <span class="jFiler-item-others">\
                <span>| size: {{fi-size2}} | </span><span>type: {{fi-extension}}</span><span class="jFiler-item-status">{{fi-progressBar}}</span>\
              </span>\
              <div class="jFiler-item-assets">\
                <ul class="list-inline">\
                  <li><a href="{{fi-url}}" class="text-secondary" target="_blank"><i class="fa fa-search-plus"></i></a></li>\
                  <li><a href="{{fi-url}}" class="text-secondary" download><i class="fa fa-download"></i></a></li>\
                  <li><a class="icon-jfi-trash jFiler-item-trash-action"></a></li>\
              </ul>\
            </div>\
            <div><input type="hidden" name="Unit[AttachmentsName][]" value="{{fi-name}}"></div>\
          </div>\
        </div>\
      </div>\
    </li>',
    },
    files: data,
  });
  ControlOverlay(false)
}



//init display title when hover select field
export function initHoverSelectDropownTitle(){
    $('.select__control').on("mouseover", function (event) {
    if($(this).children().find(".select__single-value").length>0){
        $(this).attr('title', $(this).find(".select__single-value").text());
    }
   
  });
}

export function toThreeDecimalPlaces(){
  $(".inputDecimalThreePlaces").on("blur", function () {
    if (this.value != "") {
        if (!this.value.match("^[a-zA-Z]*$")) {
            this.value = parseFloat(this.value).toFixed(3);
        }
        else {
            this.value = ""
        }

    }
})
}

export function toTwoDecimalPlaces(){
  $(".inputDecimalTwoPlaces").on("blur", function () {
    if (this.value != "") {
        if (!this.value.match("^[a-zA-Z]*$")) {
            this.value = parseFloat(this.value).toFixed(3);
        }
        else {
            this.value = ""
        }

    }
})
}

export function toFourDecimalPlaces(){
  $(".inputDecimalThreePlaces").on("blur", function () {
    if (this.value != "") {
        if (!this.value.match("^[a-zA-Z]*$")) {
            this.value = parseFloat(this.value).toFixed(4);
        }
        else {
            this.value = ""
        }

    }
})
}

export function checkOnlyNumber(){
  $(".inputDecimalThreePlaces").on("blur", function () {
    if (this.value != "") {
      if (this.value.match("^[a-zA-Z]*$")) {
          return false
      }

  }
  })

  $(".inputDecimalFourPlaces").on("blur", function () {
    if (this.value != "") {
      if (this.value.match("^[a-zA-Z]*$")) {
          return false
      }

  }
  })
}

export function BracketSplitter(text) {
  const pattern = /\(([^)]+)\)/g;
  const matches = text.match(pattern);
  const textInBrackets = matches ? matches.map(match => match.slice(1, -1)) : "";

  return textInBrackets
}


export function replaceNull(someObj, replaceValue = "***") {
  const replacer = (key, value) =>
      String(value) === "null" || String(value) === "undefined" ? replaceValue : value;
  return JSON.parse(JSON.stringify(someObj, replacer));
}
