import React, {useState, useContext, useEffect} from 'react'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Controller } from "react-hook-form";
import moment from "moment";
import Select from 'react-select'
import FormContext from "./FormContext";
import {InitDropdownTable, checkCode} from "../BootstrapTableModal&Dropdown/InitDropdownTable";
import {InitModalTable} from "../BootstrapTableModal&Dropdown/InitModalTable";
import {InitVoyageModalTable} from "../BootstrapTableModal&Dropdown/InitVoyageModalTable";
import $ from "jquery";
import {GetCompaniesData, GetCompanyDropdown, GetCompanyBranchDropdown, GetCompanyBranches, GetCompanyContacts,initHoverSelectDropownTitle, getVoyageByIdSpecial} from "../Helper";

function ShareInitialize(props) {
    const formContext = useContext(FormContext)
    var currentDate = formContext.docDate
    
    initHoverSelectDropownTitle()



    function ChangePartyEXT(type) {
        var data = type.split("-");
        var data = data[1];
        var refer = $("#NotifyPartyCopyFrom").val();
        var refer2 = $("#AttentionPartyCopyFrom").val();
        var refer3 = $("#FreightPartyCopyFrom").val();
    
    
        if (data == refer) {
            $("select[data-target='NotifyPartyCode-NotifyParty']").val($("input[data-target='CompanyID-" + refer + "'").val());
            $("input[data-target='NotifyPartyName-NotifyParty']").val($("input[data-target='CompanyName-" + refer + "']").val());
            $("select[data-target='NotifyPartyBranchCode-NotifyParty']").val($("input[data-target='BranchID-" + refer + "']").val());
            $("input[data-target='NotifyPartyBranchName-NotifyParty']").val($("input[data-target='BranchName-" + refer + "']").val());
            $("input[data-target='NotifyPartyBranchTel-NotifyParty']").val($("input[data-target='BranchTel-" + refer + "']").val());
            $("input[data-target='NotifyPartyBranchFax-NotifyParty']").val($("input[data-target='BranchFax-" + refer + "']").val());
            $("input[data-target='NotifyPartyBranchEmail-NotifyParty']").val($("input[data-target='BranchEmail-" + refer + "']").val());
            $("input[data-target='NotifyPartyBranchAddressLine1-NotifyParty']").val($("input[data-target='BranchAddressLine1-" + refer + "']").val());
            $("input[data-target='NotifyPartyBranchAddressLine2-NotifyParty']").val($("input[data-target='BranchAddressLine2-" + refer + "']").val());
            $("input[data-target='NotifyPartyBranchAddressLine3-NotifyParty']").val($("input[data-target='BranchAddressLine3-" + refer + "']").val());
            $("input[data-target='NotifyPartyBranchPostcode-NotifyParty']").val($("input[data-target='BranchPostcode-" + refer + "']").val());
            $("input[data-target='NotifyPartyBranchCity-NotifyParty']").val($("input[data-target='BranchCity-" + refer + "']").val());
            $("input[data-target='NotifyPartyBranchCountry-NotifyParty']").val($("input[data-target='BranchCountry-" + refer + "']").val());
            $("input[data-target='NotifyPartyBranchCoordinates-NotifyParty']").val($("input[data-target='BranchCoordinates-" + refer + "']").val());
            $("input[data-target='AttentionName-NotifyParty']").val($("input[data-target='AttentionName-" + refer + "']").val());
            $("input[data-target='AttentionTel-NotifyParty']").val($("input[data-target='AttentionTel-" + refer + "']").val());
            $("input[data-target='AttentionEmail-NotifyParty']").val($("input[data-target='AttentionEmail-" + refer + "']").val());
        }
    
        if (data == refer2) {
            $("select[data-target='AttentionPartyCode-AttentionParty']").val($("input[data-target='CompanyID-" + refer2 + "'").val());
            $("input[data-target='AttentionPartyName-AttentionParty']").val($("input[data-target='CompanyName-" + refer2 + "']").val());
            $("select[data-target='AttentionPartyBranchCode-AttentionParty']").val($("input[data-target='BranchID-" + refer2 + "']").val());
            $("input[data-target='AttentionPartyBranchName-AttentionParty']").val($("input[data-target='BranchName-" + refer2 + "']").val());
            $("input[data-target='AttentionPartyBranchTel-AttentionParty']").val($("input[data-target='BranchTel-" + refer2 + "']").val());
            $("input[data-target='AttentionPartyBranchFax-AttentionParty']").val($("input[data-target='BranchFax-" + refer2 + "']").val());
            $("input[data-target='AttentionPartyBranchEmail-AttentionParty']").val($("input[data-target='BranchEmail-" + refer2 + "']").val());
            $("input[data-target='AttentionPartyBranchAddressLine1-AttentionParty']").val($("input[data-target='BranchAddressLine1-" + refer2 + "']").val());
            $("input[data-target='AttentionPartyBranchAddressLine2-AttentionParty']").val($("input[data-target='BranchAddressLine2-" + refer2 + "']").val());
            $("input[data-target='AttentionPartyBranchAddressLine3-AttentionParty']").val($("input[data-target='BranchAddressLine3-" + refer2 + "']").val());
            $("input[data-target='AttentionPartyBranchPostcode-AttentionParty']").val($("input[data-target='BranchPostcode-" + refer2 + "']").val());
            $("input[data-target='AttentionPartyBranchCity-AttentionParty']").val($("input[data-target='BranchCity-" + refer2 + "']").val());
            $("input[data-target='AttentionPartyBranchCountry-AttentionParty']").val($("input[data-target='BranchCountry-" + refer2 + "']").val());
            $("input[data-target='AttentionPartyBranchCoordinates-AttentionParty']").val($("input[data-target='BranchCoordinates-" + refer2 + "']").val());
            $("input[data-target='AttentionName-AttentionParty']").val($("input[data-target='AttentionName-" + refer2 + "']").val());
            $("input[data-target='AttentionTel-AttentionParty']").val($("input[data-target='AttentionTel-" + refer2 + "']").val());
            $("input[data-target='AttentionEmail-AttentionParty']").val($("input[data-target='AttentionEmail-" + refer2 + "']").val());
        }

        if (data == refer3) {
            $("select[data-target='FreightPartyCode-FreightParty']").val($("input[data-target='CompanyID-" + refer3 + "'").val());
            $("input[data-target='FreightPartyName-FreightParty']").val($("input[data-target='CompanyName-" + refer3 + "']").val());
            $("select[data-target='FreightPartyBranchCode-FreightParty']").val($("input[data-target='BranchID-" + refer3 + "']").val());
            $("input[data-target='FreightPartyBranchName-FreightParty']").val($("input[data-target='BranchName-" + refer3 + "']").val());
            $("input[data-target='FreightPartyBranchTel-FreightParty']").val($("input[data-target='BranchTel-" + refer3 + "']").val());
            $("input[data-target='FreightPartyBranchFax-FreightParty']").val($("input[data-target='BranchFax-" + refer3 + "']").val());
            $("input[data-target='FreightPartyBranchEmail-FreightParty']").val($("input[data-target='BranchEmail-" + refer3 + "']").val());
            $("input[data-target='FreightPartyBranchAddressLine1-FreightParty']").val($("input[data-target='BranchAddressLine1-" + refer3 + "']").val());
            $("input[data-target='FreightPartyBranchAddressLine2-FreightParty']").val($("input[data-target='BranchAddressLine2-" + refer3 + "']").val());
            $("input[data-target='FreightPartyBranchAddressLine3-FreightParty']").val($("input[data-target='BranchAddressLine3-" + refer3 + "']").val());
            $("input[data-target='FreightPartyBranchPostcode-FreightParty']").val($("input[data-target='BranchPostcode-" + refer3 + "']").val());
            $("input[data-target='FreightPartyBranchCity-FreightParty']").val($("input[data-target='BranchCity-" + refer3 + "']").val());
            $("input[data-target='FreightPartyBranchCountry-FreightParty']").val($("input[data-target='BranchCountry-" + refer3 + "']").val());
            $("input[data-target='FreightPartyBranchCoordinates-FreightParty']").val($("input[data-target='BranchCoordinates-" + refer3 + "']").val());
            $("input[data-target='AttentionName-FreightParty']").val($("input[data-target='AttentionName-" + refer3 + "']").val());
            $("input[data-target='AttentionTel-FreightParty']").val($("input[data-target='AttentionTel-" + refer3 + "']").val());
            $("input[data-target='AttentionEmail-FreightParty']").val($("input[data-target='AttentionEmail-" + refer3 + "']").val());
        }
    }
    
    useEffect(() => {        
        window.$("#CompanyROC-Agent-DetailForm").on("change", function () {
            var id = $(this).attr("id");
            var filters = {
                "CompanyUUID": $("#"+props.formNameLowerCase+"agent-roc").val(),
            };
            
            GetCompaniesData(filters,props.globalContext).then(data => {
                if($("#CompanyROC-Agent-DetailForm").val()!=""){
                    $("#"+props.formNameLowerCase+"agent-branchcode").val(data.data[0]["companyBranches"][0]["CompanyBranchUUID"])
                    $("#BranchCode-Agent-DetailForm").val(data.data[0]["companyBranches"][0]["BranchCode"]+"("+data.data[0]["companyBranches"][0]["PortCode"]["PortCode"]+")")
                    $("#"+props.formNameLowerCase+"agent-branchname").val(data.data[0]["companyBranches"][0]["BranchName"])
                    $("#"+props.formNameLowerCase+"agent-branchtel").val(data.data[0]["companyBranches"][0]["Tel"])
                    $("#"+props.formNameLowerCase+"agent-branchfax").val(data.data[0]["companyBranches"][0]["Fax"])
                    $("#"+props.formNameLowerCase+"agent-branchemail").val(data.data[0]["companyBranches"][0]["Email"])
                    $("#"+props.formNameLowerCase+"agent-branchaddressline1").val(data.data[0]["companyBranches"][0]["AddressLine1"])
                    $("#"+props.formNameLowerCase+"agent-branchaddressline2").val(data.data[0]["companyBranches"][0]["AddressLine2"])
                    $("#"+props.formNameLowerCase+"agent-branchaddressline3").val(data.data[0]["companyBranches"][0]["AddressLine3"])
                    $("#"+props.formNameLowerCase+"agent-branchpostcode").val(data.data[0]["companyBranches"][0]["Postcode"])
                    $("#"+props.formNameLowerCase+"agent-branchcity").val(data.data[0]["companyBranches"][0]["City"])
                    $("#"+props.formNameLowerCase+"agent-branchcountry").val(data.data[0]["companyBranches"][0]["Country"])
                    $("#"+props.formNameLowerCase+"agent-branchcoordinates").val(data.data[0]["companyBranches"][0]["Coordinates"])
        
                    var filters = {
                        "Branch": data.data[0]["companyBranches"][0]["CompanyBranchUUID"],
                    };
                    GetCompanyContacts(filters,props.globalContext).then(data => {
                            if (data.length != 0) {
                                $("#AttentionName-Agent-DetailForm").val(data[0]["FirstName"] + " " + data[0]["LastName"]);
                                $("#AttentionTel-Agent-DetailForm").val(data[0]["Tel"]);
                                $("#AttentionEmail-Agent-DetailForm").val(data[0]["Email"]);
                            } else {
                                $("#AttentionName-Agent-DetailForm").val("");
                                $("#AttentionTel-Agent-DetailForm").val("");
                                $("#AttentionEmail-Agent-DetailForm").val("");
                            }
                            ChangePartyEXT(id);
                    })
                }
            }) 
        });

        window.$("#CompanyROC-Supplier-DetailForm").on("change", function () {
            var id = $(this).attr("id");
            setTimeout(() => {
                var name = $("#CompanyName-Supplier-DetailForm").val();
                var roc = $("#CompanyROC-Supplier-DetailForm").val();
                window.$("#CompanyROC-Supplier-Quickform").val(name + '(' + roc + ')');
            }, 100);
            var filters = {
                "CompanyUUID": $("#"+props.formNameLowerCase+"supplier-roc").val(),
            };
            
            GetCompaniesData(filters,props.globalContext).then(data => {
                if($("#CompanyROC-Supplier-DetailForm").val()!=""){
                    $("#"+props.formNameLowerCase+"supplier-branchcode").val(data.data[0]["companyBranches"][0]["CompanyBranchUUID"])
                    $("#BranchCode-Supplier-DetailForm").val(data.data[0]["companyBranches"][0]["BranchCode"]+"("+data.data[0]["companyBranches"][0]["PortCode"]["PortCode"]+")")
                    $("#BranchCode-Supplier-Quickform").val(data.data[0]["companyBranches"][0]["BranchCode"]+"("+data.data[0]["companyBranches"][0]["PortCode"]["PortCode"]+")")
                    $("#"+props.formNameLowerCase+"supplier-branchname").val(data.data[0]["companyBranches"][0]["BranchName"])
                    $("#"+props.formNameLowerCase+"supplier-branchtel").val(data.data[0]["companyBranches"][0]["Tel"])
                    $("#"+props.formNameLowerCase+"supplier-quickform-branchtel").val(data.data[0]["companyBranches"][0]["Tel"])
                    $("#"+props.formNameLowerCase+"supplier-branchfax").val(data.data[0]["companyBranches"][0]["Fax"])
                    $("#"+props.formNameLowerCase+"supplier-branchemail").val(data.data[0]["companyBranches"][0]["Email"])
                    $("#"+props.formNameLowerCase+"supplier-quickform-branchemail").val(data.data[0]["companyBranches"][0]["Email"])
                    $("#"+props.formNameLowerCase+"supplier-branchaddressline1").val(data.data[0]["companyBranches"][0]["AddressLine1"])
                    $("#"+props.formNameLowerCase+"supplier-branchaddressline2").val(data.data[0]["companyBranches"][0]["AddressLine2"])
                    $("#"+props.formNameLowerCase+"supplier-branchaddressline3").val(data.data[0]["companyBranches"][0]["AddressLine3"])
                    $("#"+props.formNameLowerCase+"supplier-branchpostcode").val(data.data[0]["companyBranches"][0]["Postcode"])
                    $("#"+props.formNameLowerCase+"supplier-branchcity").val(data.data[0]["companyBranches"][0]["City"])
                    $("#"+props.formNameLowerCase+"supplier-branchcountry").val(data.data[0]["companyBranches"][0]["Country"])
                    $("#"+props.formNameLowerCase+"supplier-branchcoordinates").val(data.data[0]["companyBranches"][0]["Coordinates"])
        
                    var filters = {
                        "Branch": data.data[0]["companyBranches"][0]["CompanyBranchUUID"],
                    };
                    GetCompanyContacts(filters,props.globalContext).then(data => {
                            if (data.length != 0) {
                                $("#AttentionName-Supplier-DetailForm").val(data[0]["FirstName"] + " " + data[0]["LastName"]);
                                $("#AttentionTel-Supplier-DetailForm").val(data[0]["Tel"]);
                                $("#AttentionEmail-Supplier-DetailForm").val(data[0]["Email"]);
                                $("#AttentionName-Supplier-QuickForm").val(data[0]["FirstName"] + " " + data[0]["LastName"]);
                                $("#AttentionTel-Supplier-QuickForm").val(data[0]["Tel"]);
                                $("#AttentionEmail-Supplier-QuickForm").val(data[0]["Email"]);
                            } else {
                                $("#AttentionName-Supplier-DetailForm").val("");
                                $("#AttentionTel-Supplier-DetailForm").val("");
                                $("#AttentionEmail-Supplier-DetailForm").val("");
                                $("#AttentionName-Supplier-QuickForm").val("");
                                $("#AttentionTel-Supplier-QuickForm").val("");
                                $("#AttentionEmail-Supplier-QuickForm").val("");
                            }
                            ChangePartyEXT(id);
                    })
                }
            }) 
        });
    
        window.$("#CompanyROC-NotifyParty-DetailForm").on("change", function () {
            var id = $(this).attr("id");
            var filters = {
                "CompanyUUID": $("#"+props.formNameLowerCase+"notifyparty-roc").val(),
            };
    
            setTimeout(() => {
                var name = $("#CompanyName-NotifyParty-DetailForm").val();
                var roc = $("#CompanyROC-NotifyParty-DetailForm").val();
                window.$("#CompanyROC-NotifyParty-Quickform").val(name + '(' + roc + ')');
            }, 100);

            GetCompaniesData(filters,props.globalContext).then(data => {
                if($("#CompanyROC-NotifyParty-DetailForm").val()!=""){
                    $("#"+props.formNameLowerCase+"notifyparty-branchcode").val(data.data[0]["companyBranches"][0]["CompanyBranchUUID"])
                    if(data.data[0]["companyBranches"][0]["PortCode"]){
                        $("#BranchCode-NotifyParty-DetailForm").val(data.data[0]["companyBranches"][0]["BranchCode"]+"("+data.data[0]["companyBranches"][0]["PortCode"]["PortCode"]+")")
                    }else{
                        $("#BranchCode-NotifyParty-DetailForm").val(data.data[0]["companyBranches"][0]["BranchCode"]+"()")
                    }
                    $("#"+props.formNameLowerCase+"notifyparty-branchname").val(data.data[0]["companyBranches"][0]["BranchName"])
                    $("#"+props.formNameLowerCase+"notifyparty-branchtel").val(data.data[0]["companyBranches"][0]["Tel"])
                    $("#"+props.formNameLowerCase+"notifyparty-branchfax").val(data.data[0]["companyBranches"][0]["Fax"])
                    $("#"+props.formNameLowerCase+"notifyparty-branchemail").val(data.data[0]["companyBranches"][0]["Email"])
                    $("#"+props.formNameLowerCase+"notifyparty-branchaddressline1").val(data.data[0]["companyBranches"][0]["AddressLine1"])
                    $("#"+props.formNameLowerCase+"notifyparty-branchaddressline2").val(data.data[0]["companyBranches"][0]["AddressLine2"])
                    $("#"+props.formNameLowerCase+"notifyparty-branchaddressline3").val(data.data[0]["companyBranches"][0]["AddressLine3"])
                    $("#"+props.formNameLowerCase+"notifyparty-branchpostcode").val(data.data[0]["companyBranches"][0]["Postcode"])
                    $("#"+props.formNameLowerCase+"notifyparty-branchcity").val(data.data[0]["companyBranches"][0]["City"])
                    $("#"+props.formNameLowerCase+"notifyparty-branchcountry").val(data.data[0]["companyBranches"][0]["Country"])
                    $("#"+props.formNameLowerCase+"notifyparty-branchcoordinates").val(data.data[0]["companyBranches"][0]["Coordinates"])

                    
                     //fill in quickform address line
                     $("#BranchAddressLine1-NotifyParty-Quickform").val(data.data[0]["companyBranches"][0]["AddressLine1"])
                     $("#BranchAddressLine2-NotifyParty-Quickform").val(data.data[0]["companyBranches"][0]["AddressLine2"])
                     $("#BranchAddressLine3-NotifyParty-Quickform").val(data.data[0]["companyBranches"][0]["AddressLine3"])
        
                    var filters = {
                        "Branch": data.data[0]["companyBranches"][0]["CompanyBranchUUID"],
                    };
                    GetCompanyContacts(filters,props.globalContext).then(data => {
                            if (data.length != 0) {
                                $("#AttentionName-NotifyParty-DetailForm").val(data[0]["FirstName"] + " " + data[0]["LastName"]);
                                $("#AttentionTel-NotifyParty-DetailForm").val(data[0]["Tel"]);
                                $("#AttentionEmail-NotifyParty-DetailForm").val(data[0]["Email"]);
                            } else {
                                $("#AttentionName-NotifyParty-DetailForm").val("");
                                $("#AttentionTel-NotifyParty-DetailForm").val("");
                                $("#AttentionEmail-NotifyParty-DetailForm").val("");
                            }
                            ChangePartyEXT(id);
                    })
                }
            }) 
        });
    
        window.$("#CompanyROC-AttentionParty-DetailForm").on("change", function () {
            var id = $(this).attr("id");
            var filters = {
                "CompanyUUID": $("#"+props.formNameLowerCase+"attentionparty-roc").val(),
            };
    
            GetCompaniesData(filters,props.globalContext).then(data => {
                if($("#CompanyROC-AttentionParty-DetailForm").val()!=""){
                    $("#"+props.formNameLowerCase+"attentionparty-branchcode").val(data.data[0]["companyBranches"][0]["CompanyBranchUUID"])
                    $("#BranchCode-AttentionParty-DetailForm").val(data.data[0]["companyBranches"][0]["BranchCode"]+"("+data.data[0]["companyBranches"][0]["PortCode"]["PortCode"]+")")
                    $("#"+props.formNameLowerCase+"attentionparty-branchname").val(data.data[0]["companyBranches"][0]["BranchName"])
                    $("#"+props.formNameLowerCase+"attentionparty-branchtel").val(data.data[0]["companyBranches"][0]["Tel"])
                    $("#"+props.formNameLowerCase+"attentionparty-branchfax").val(data.data[0]["companyBranches"][0]["Fax"])
                    $("#"+props.formNameLowerCase+"attentionparty-branchemail").val(data.data[0]["companyBranches"][0]["Email"])
                    $("#"+props.formNameLowerCase+"attentionparty-branchaddressline1").val(data.data[0]["companyBranches"][0]["AddressLine1"])
                    $("#"+props.formNameLowerCase+"attentionparty-branchaddressline2").val(data.data[0]["companyBranches"][0]["AddressLine2"])
                    $("#"+props.formNameLowerCase+"attentionparty-branchaddressline3").val(data.data[0]["companyBranches"][0]["AddressLine3"])
                    $("#"+props.formNameLowerCase+"attentionparty-branchpostcode").val(data.data[0]["companyBranches"][0]["Postcode"])
                    $("#"+props.formNameLowerCase+"attentionparty-branchcity").val(data.data[0]["companyBranches"][0]["City"])
                    $("#"+props.formNameLowerCase+"attentionparty-branchcountry").val(data.data[0]["companyBranches"][0]["Country"])
                    $("#"+props.formNameLowerCase+"attentionparty-branchcoordinates").val(data.data[0]["companyBranches"][0]["Coordinates"])
        
                    var filters = {
                        "Branch": data.data[0]["companyBranches"][0]["CompanyBranchUUID"],
                    };
                    GetCompanyContacts(filters,props.globalContext).then(data => {
                            if (data.length != 0) {
                                $("#AttentionName-AttentionParty-DetailForm").val(data[0]["FirstName"] + " " + data[0]["LastName"]);
                                $("#AttentionTel-AttentionParty-DetailForm").val(data[0]["Tel"]);
                                $("#AttentionEmail-AttentionParty-DetailForm").val(data[0]["Email"]);
                            } else {
                                $("#AttentionName-AttentionParty-DetailForm").val("");
                                $("#AttentionTel-AttentionParty-DetailForm").val("");
                                $("#AttentionEmail-AttentionParty-DetailForm").val("");
                            }
                            ChangePartyEXT(id);
                    })
                }
            }) 
        });
        
        window.$("#CompanyROC-FreightParty-DetailForm").on("change", function () {
            var id = $(this).attr("id");
            var filters = {
                "CompanyUUID": $("#"+props.formNameLowerCase+"freightparty-roc").val(),
            };
            
            GetCompaniesData(filters,props.globalContext).then(data => {
                if($("#CompanyROC-FreightParty-DetailForm").val()!=""){
                    $("span[data-target='CompanyName-FreightParty']").text(data.data[0]["CompanyName"]);
                    $("span[data-target='BranchAddressLine1-FreightParty']").text(data.data[0]["companyBranches"][0]["AddressLine1"]);
                    $("span[data-target='BranchAddressLine2-FreightParty']").text(data.data[0]["companyBranches"][0]["AddressLine2"]);
                    $("span[data-target='BranchAddressLine3-FreightParty']").text(data.data[0]["companyBranches"][0]["AddressLine3"]);
                    $("span[data-target='BranchTel-FreightParty']").text(data.data[0]["companyBranches"][0]["Tel"]);
                    $("span[data-target='BranchFax-FreightParty']").text(data.data[0]["companyBranches"][0]["Fax"]);
                    $("#"+props.formNameLowerCase+"freightparty-branchcode").val(data.data[0]["companyBranches"][0]["CompanyBranchUUID"])
                    $("#BranchCode-FreightParty-DetailForm").val(data.data[0]["companyBranches"][0]["BranchCode"]+"("+data.data[0]["companyBranches"][0]["PortCode"]["PortCode"]+")")
                    $("#"+props.formNameLowerCase+"freightparty-branchname").val(data.data[0]["companyBranches"][0]["BranchName"])
                    $("#"+props.formNameLowerCase+"freightparty-branchtel").val(data.data[0]["companyBranches"][0]["Tel"])
                    $("#"+props.formNameLowerCase+"freightparty-branchfax").val(data.data[0]["companyBranches"][0]["Fax"])
                    $("#"+props.formNameLowerCase+"freightparty-branchemail").val(data.data[0]["companyBranches"][0]["Email"])
                    $("#"+props.formNameLowerCase+"freightparty-branchaddressline1").val(data.data[0]["companyBranches"][0]["AddressLine1"])
                    $("#"+props.formNameLowerCase+"freightparty-branchaddressline2").val(data.data[0]["companyBranches"][0]["AddressLine2"])
                    $("#"+props.formNameLowerCase+"freightparty-branchaddressline3").val(data.data[0]["companyBranches"][0]["AddressLine3"])
                    $("#"+props.formNameLowerCase+"freightparty-branchpostcode").val(data.data[0]["companyBranches"][0]["Postcode"])
                    $("#"+props.formNameLowerCase+"freightparty-branchcity").val(data.data[0]["companyBranches"][0]["City"])
                    $("#"+props.formNameLowerCase+"freightparty-branchcountry").val(data.data[0]["companyBranches"][0]["Country"])
                    $("#"+props.formNameLowerCase+"freightparty-branchcoordinates").val(data.data[0]["companyBranches"][0]["Coordinates"])
        
                    var filters = {
                        "Branch": data.data[0]["companyBranches"][0]["CompanyBranchUUID"],
                    };
                    GetCompanyContacts(filters,props.globalContext).then(data => {
                            if (data.length != 0) {
                                $("#AttentionName-FreightParty-DetailForm").val(data[0]["FirstName"] + " " + data[0]["LastName"]);
                                $("#AttentionTel-FreightParty-DetailForm").val(data[0]["Tel"]);
                                $("#AttentionEmail-FreightParty-DetailForm").val(data[0]["Email"]);
                            } else {
                                $("#AttentionName-FreightParty-DetailForm").val("");
                                $("#AttentionTel-FreightParty-DetailForm").val("");
                                $("#AttentionEmail-FreightParty-DetailForm").val("");
                            }
                            ChangePartyEXT(id);
                    })
                }
            }) 
        });
    
    
        window.$("#CompanyROC-BillTo-DetailForm").on("change", function () {
            var id = $(this).attr("id");
            setTimeout(() => {
                var name = $("#CompanyName-BillTo-DetailForm").val();
                var roc = $("#CompanyROC-BillTo-DetailForm").val();
                window.$("#CompanyROC-BillTo-Quickform").val(name + '(' + roc + ')');
                
            }, 100);
            
            if(props.formName == "BookingReservation"){
                formContext.QuotationRequiredFields()
            } 
            var filters = {
                "CompanyUUID": $("#"+props.formNameLowerCase+"billto-roc").val(),
            };

            GetCompaniesData(filters,props.globalContext).then(data => {
                if($("#CompanyROC-BillTo-DetailForm").val()!=""){
                  
                    if(props.formNameLowerCase=="customerpayment"){
                        $("#"+props.formNameLowerCase+"billto-branchcode").val(data.data[0]["companyBranches"][0]["CompanyBranchUUID"]).trigger("change")
                        $("#BranchCode-BillTo-Quickform").val(data.data[0]["companyBranches"][0]["BranchCode"])
                        $("#BranchName-BillTo-Quickform").val(data.data[0]["companyBranches"][0]["BranchName"])
                        $("#BranchTel-BillTo-Quickform").val(data.data[0]["companyBranches"][0]["Tel"])
                        $("#BranchEmail-BillTo-Quickform").val(data.data[0]["companyBranches"][0]["Email"])
                    }else{
                        $("#"+props.formNameLowerCase+"billto-branchcode").val(data.data[0]["companyBranches"][0]["CompanyBranchUUID"])
                    }
                    $("#BranchCode-BillTo-DetailForm").val(data.data[0]["companyBranches"][0]["BranchCode"]+"("+data.data[0]["companyBranches"][0]["PortCode"]["PortCode"]+")")
                    $("#"+props.formNameLowerCase+"billto-branchname").val(data.data[0]["companyBranches"][0]["BranchName"])
                    $("#"+props.formNameLowerCase+"billto-branchtel").val(data.data[0]["companyBranches"][0]["Tel"])
                    $("#"+props.formNameLowerCase+"billto-branchfax").val(data.data[0]["companyBranches"][0]["Fax"])
                    $("#"+props.formNameLowerCase+"billto-branchemail").val(data.data[0]["companyBranches"][0]["Email"])
                    $("#"+props.formNameLowerCase+"billto-branchaddressline1").val(data.data[0]["companyBranches"][0]["AddressLine1"])
                    $("#"+props.formNameLowerCase+"billto-branchaddressline2").val(data.data[0]["companyBranches"][0]["AddressLine2"])
                    $("#"+props.formNameLowerCase+"billto-branchaddressline3").val(data.data[0]["companyBranches"][0]["AddressLine3"])
                    $("#"+props.formNameLowerCase+"billto-branchpostcode").val(data.data[0]["companyBranches"][0]["Postcode"])
                    $("#"+props.formNameLowerCase+"billto-branchcity").val(data.data[0]["companyBranches"][0]["City"])
                    $("#"+props.formNameLowerCase+"billto-branchcountry").val(data.data[0]["companyBranches"][0]["Country"])
                    $("#"+props.formNameLowerCase+"billto-branchcoordinates").val(data.data[0]["companyBranches"][0]["Coordinates"])

                    if(props.formName=="SalesInvoice" || props.formName=="SalesCreditNote" ||  props.formName=="SalesDebitNote"){
                        $("#"+props.formNameLowerCase+"billto-branchcode").trigger("change")
                        $("#"+props.formNameLowerCase+"billto-quickform-branchtel").val(data.data[0]["companyBranches"][0]["Tel"])
                        $("#"+props.formNameLowerCase+"billto-quickform-branchemail").val(data.data[0]["companyBranches"][0]["Email"])
                    }
        
                    var filters = {
                        "Branch": data.data[0]["companyBranches"][0]["CompanyBranchUUID"],
                    };
                    GetCompanyContacts(filters,props.globalContext).then(data => {
                            if (data.length != 0) {
                                $("#AttentionName-BillTo-DetailForm").val(data[0]["FirstName"] + " " + data[0]["LastName"]);
                                $("#AttentionTel-BillTo-DetailForm").val(data[0]["Tel"]);
                                $("#AttentionEmail-BillTo-DetailForm").val(data[0]["Email"]);

                                $("#AttentionName-BillTo-QuickForm").val(data[0]["FirstName"] + " " + data[0]["LastName"]);
                                $("#AttentionTel-BillTo-QuickForm").val(data[0]["Tel"]);
                                $("#AttentionEmail-BillTo-QuickForm").val(data[0]["Email"]);
                            } else {
                                $("#AttentionName-BillTo-DetailForm").val("");
                                $("#AttentionTel-BillTo-DetailForm").val("");
                                $("#AttentionEmail-BillTo-DetailForm").val("");

                                $("#AttentionName-BillTo-QuickForm").val("");
                                $("#AttentionTel-BillTo-QuickForm").val("");
                                $("#AttentionEmail-BillTo-QuickForm").val("");
                            }
                            ChangePartyEXT(id);
                    })
                }
            }) 
        });
    
        window.$("#CompanyROC-Shipper-DetailForm").on("change", function () {
            var id = $(this).attr("id");
            setTimeout(() => {
                var name = $("#CompanyName-Shipper-DetailForm").val();
                var roc = $("#CompanyROC-Shipper-DetailForm").val();
                window.$("#CompanyROC-Shipper-Quickform").val(name + '(' + roc + ')');
    
            }, 100);
    
            var filters = {
                "CompanyUUID": $("#"+props.formNameLowerCase+"shipper-roc").val(),
            };
    
            GetCompaniesData(filters,props.globalContext).then(data => {
                if($("#CompanyROC-Shipper-DetailForm").val()!=""){
                    $("#"+props.formNameLowerCase+"shipper-branchcode").val(data.data[0]["companyBranches"][0]["CompanyBranchUUID"])
                    $("#BranchCode-Shipper-DetailForm").val(data.data[0]["companyBranches"][0]["BranchCode"]+"("+data.data[0]["companyBranches"][0]["PortCode"]["PortCode"]+")")
                    $("#"+props.formNameLowerCase+"shipper-branchname").val(data.data[0]["companyBranches"][0]["BranchName"])
                    $("#"+props.formNameLowerCase+"shipper-branchtel").val(data.data[0]["companyBranches"][0]["Tel"])
                    $("#"+props.formNameLowerCase+"shipper-branchfax").val(data.data[0]["companyBranches"][0]["Fax"])
                    $("#"+props.formNameLowerCase+"shipper-branchemail").val(data.data[0]["companyBranches"][0]["Email"])
                    $("#"+props.formNameLowerCase+"shipper-branchaddressline1").val(data.data[0]["companyBranches"][0]["AddressLine1"])
                    $("#"+props.formNameLowerCase+"shipper-branchaddressline2").val(data.data[0]["companyBranches"][0]["AddressLine2"])
                    $("#"+props.formNameLowerCase+"shipper-branchaddressline3").val(data.data[0]["companyBranches"][0]["AddressLine3"])
                    $("#"+props.formNameLowerCase+"shipper-branchpostcode").val(data.data[0]["companyBranches"][0]["Postcode"])
                    $("#"+props.formNameLowerCase+"shipper-branchcity").val(data.data[0]["companyBranches"][0]["City"])
                    $("#"+props.formNameLowerCase+"shipper-branchcountry").val(data.data[0]["companyBranches"][0]["Country"])
                    $("#"+props.formNameLowerCase+"shipper-branchcoordinates").val(data.data[0]["companyBranches"][0]["Coordinates"])
                    
                    //fill in quickform address line
                    $("#BranchAddressLine1-Shipper-Quickform").val(data.data[0]["companyBranches"][0]["AddressLine1"])
                    $("#BranchAddressLine2-Shipper-Quickform").val(data.data[0]["companyBranches"][0]["AddressLine2"])
                    $("#BranchAddressLine3-Shipper-Quickform").val(data.data[0]["companyBranches"][0]["AddressLine3"])
                    var filters = {
                        "Branch": data.data[0]["companyBranches"][0]["CompanyBranchUUID"],
                    };
                    GetCompanyContacts(filters,props.globalContext).then(data => {
                            if (data.length != 0) {
                                $("#AttentionName-Shipper-DetailForm").val(data[0]["FirstName"] + " " + data[0]["LastName"]);
                                $("#AttentionTel-Shipper-DetailForm").val(data[0]["Tel"]);
                                $("#AttentionEmail-Shipper-DetailForm").val(data[0]["Email"]);
                            } else {
                                $("#AttentionName-Shipper-DetailForm").val("");
                                $("#AttentionTel-Shipper-DetailForm").val("");
                                $("#AttentionEmail-Shipper-DetailForm").val("");
                            }
                            ChangePartyEXT(id);
                    })
                }
            }) 
        });
    
        window.$("#CompanyROC-Consignee-DetailForm").on("change", function () {
            var id = $(this).attr("id");
            var filters = {
                "CompanyUUID": $("#"+props.formNameLowerCase+"consignee-roc").val(),
            };

            setTimeout(() => {
                var name = $("#CompanyName-Consignee-DetailForm").val();
                var roc = $("#CompanyROC-Consignee-DetailForm").val();
                window.$("#CompanyROC-Consignee-Quickform").val(name + '(' + roc + ')');
            }, 100);
    
            GetCompaniesData(filters,props.globalContext).then(data => {
                if($("#CompanyROC-Consignee-DetailForm").val()!=""){
                    $("#"+props.formNameLowerCase+"consignee-branchcode").val(data.data[0]["companyBranches"][0]["CompanyBranchUUID"])
                    $("#BranchCode-Consignee-DetailForm").val(data.data[0]["companyBranches"][0]["BranchCode"]+"("+data.data[0]["companyBranches"][0]["PortCode"]["PortCode"]+")")
                    $("#"+props.formNameLowerCase+"consignee-branchname").val(data.data[0]["companyBranches"][0]["BranchName"])
                    $("#"+props.formNameLowerCase+"consignee-branchtel").val(data.data[0]["companyBranches"][0]["Tel"])
                    $("#"+props.formNameLowerCase+"consignee-branchfax").val(data.data[0]["companyBranches"][0]["Fax"])
                    $("#"+props.formNameLowerCase+"consignee-branchemail").val(data.data[0]["companyBranches"][0]["Email"])
                    $("#"+props.formNameLowerCase+"consignee-branchaddressline1").val(data.data[0]["companyBranches"][0]["AddressLine1"])
                    $("#"+props.formNameLowerCase+"consignee-branchaddressline2").val(data.data[0]["companyBranches"][0]["AddressLine2"])
                    $("#"+props.formNameLowerCase+"consignee-branchaddressline3").val(data.data[0]["companyBranches"][0]["AddressLine3"])
                    $("#"+props.formNameLowerCase+"consignee-branchpostcode").val(data.data[0]["companyBranches"][0]["Postcode"])
                    $("#"+props.formNameLowerCase+"consignee-branchcity").val(data.data[0]["companyBranches"][0]["City"])
                    $("#"+props.formNameLowerCase+"consignee-branchcountry").val(data.data[0]["companyBranches"][0]["Country"])
                    $("#"+props.formNameLowerCase+"consignee-branchcoordinates").val(data.data[0]["companyBranches"][0]["Coordinates"])

                     //fill in quickform address line
                     $("#BranchAddressLine1-Consignee-Quickform").val(data.data[0]["companyBranches"][0]["AddressLine1"])
                     $("#BranchAddressLine2-Consignee-Quickform").val(data.data[0]["companyBranches"][0]["AddressLine2"])
                     $("#BranchAddressLine3-Consignee-Quickform").val(data.data[0]["companyBranches"][0]["AddressLine3"])
        
                    var filters = {
                        "Branch": data.data[0]["companyBranches"][0]["CompanyBranchUUID"],
                    };
                    GetCompanyContacts(filters,props.globalContext).then(data => {
                            if (data.length != 0) {
                                $("#AttentionName-Consignee-DetailForm").val(data[0]["FirstName"] + " " + data[0]["LastName"]);
                                $("#AttentionTel-Consignee-DetailForm").val(data[0]["Tel"]);
                                $("#AttentionEmail-Consignee-DetailForm").val(data[0]["Email"]);
                            } else {
                                $("#AttentionName-Consignee-DetailForm").val("");
                                $("#AttentionTel-Consignee-DetailForm").val("");
                                $("#AttentionEmail-Consignee-DetailForm").val("");
                            }
                            ChangePartyEXT(id);
                    })
                }
            }) 
        });


        window.$("#CompanyROC-POLHauler-DetailForm").on("change", function () {
            var id = $(this).attr("id");
            var haulerBranch=[]
            var filters = {
                "CompanyUUID": $("#"+props.formNameLowerCase+"hauler-polhaulercode").val()
            };

            setTimeout(() => {
                var name = $("#containerreleaseorderhauler-polhaulercompanyname").val();
                var roc = $("#CompanyROC-POLHauler-DetailForm").val();
                window.$("#CompanyROC-POLHauler-Quickform").val(name + '(' + roc + ')');
            }, 100);
            GetCompanyBranches(filters,props.globalContext).then(data => {
                $.each(data, function (key, value) {
                    var found=false;
                    $.each(value.companyBranchHasCompanyTypes, function (key2, value2) {
                        if(found==false){
                            if(value2.CompanyType=="----hauler"){
                                found=true
                                haulerBranch.push(value)
                            }
                        }
                
                        //html += "<option value='" + value.CompanyBranchUUID + "'>" + value.BranchCode + "</option>";
                    });

                })
                if(haulerBranch.length>0){
                    $("#"+props.formNameLowerCase+"hauler-polhaulerbranchcode").val(haulerBranch[0]["CompanyBranchUUID"])
                    $("#BranchCode-POLHauler-DetailForm").val(haulerBranch[0]["BranchCode"]+"("+haulerBranch[0]["portCode"]["PortCode"]+")")
                    $("#"+props.formNameLowerCase+"hauler-polhaulerbranchname").val(haulerBranch[0]["BranchName"])
                    $("#"+props.formNameLowerCase+"hauler-polhaulerbranchtel").val(haulerBranch[0]["Tel"])
                    $("#"+props.formNameLowerCase+"hauler-polhaulerbranchfax").val(haulerBranch[0]["Fax"])
                    $("#"+props.formNameLowerCase+"hauler-polhaulerbranchemail").val(haulerBranch[0]["Email"])
                    $("#"+props.formNameLowerCase+"hauler-polhaulerbranchaddressline1").val(haulerBranch[0]["AddressLine1"])
                    $("#"+props.formNameLowerCase+"hauler-polhaulerbranchaddressline2").val(haulerBranch[0]["AddressLine2"])
                    $("#"+props.formNameLowerCase+"hauler-polhaulerbranchaddressline3").val(haulerBranch[0]["AddressLine3"])
                    $("#"+props.formNameLowerCase+"hauler-polhaulerbranchpostcode").val(haulerBranch[0]["Postcode"])
                    $("#"+props.formNameLowerCase+"hauler-polhaulerbranchcity").val(haulerBranch[0]["City"])
                    $("#"+props.formNameLowerCase+"hauler-polhaulerbranchcountry").val(haulerBranch[0]["Country"])
                    $("#"+props.formNameLowerCase+"hauler-polhaulerbranchcoordinates").val(haulerBranch[0]["Coordinates"])

                    var filters = {
                        "Branch": haulerBranch[0]["CompanyBranchUUID"],
                    };
                    GetCompanyContacts(filters,props.globalContext).then(data => {
                        if (data.length != 0) {
                            $("#AttentionName-POLHauler-DetailForm").val(data[0]["FirstName"] + " " + data[0]["LastName"]);
                            $("#"+props.formNameLowerCase+"hauler-polhaulerattentiontel").val(data[0]["Tel"]);
                            $("#"+props.formNameLowerCase+"hauler-polhaulerattentionemail").val(data[0]["Email"]);
                        } else {
                            $("#AttentionName-POLHauler-DetailForm").val("");
                            $("#"+props.formNameLowerCase+"hauler-polhaulerattentiontel").val("");
                            $("#"+props.formNameLowerCase+"hauler-polhaulerattentionemail").val("");
                        }
                    })
                }
            })
        });

        window.$("#CompanyROC-Depot-DetailForm").on("change", function () {
            var id = $(this).attr("id");
            var depotBranch=[]
            var filters = {
                "CompanyUUID": $("#"+props.formNameLowerCase+"depot-roc").val()
            };

            setTimeout(() => {
                var name = $("#CompanyName-Depot-DetailForm").val();
                var roc = $("#CompanyROC-Depot-DetailForm").val();
                window.$("#CompanyROC-Depot-Quickform").val(name + '(' + roc + ')');
            }, 100);
            GetCompanyBranches(filters,props.globalContext).then(data => {
                $.each(data, function (key, value) {
                    var found=false;
                    $.each(value.companyBranchHasCompanyTypes, function (key2, value2) {
                        if(found==false){
                            if(value2.CompanyType=="----depot"){
                                found=true
                                depotBranch.push(value)
                            }
                        }
                
                        //html += "<option value='" + value.CompanyBranchUUID + "'>" + value.BranchCode + "</option>";
                    });

                })
                if(depotBranch.length>0){
                    $("#"+props.formNameLowerCase+"depot-branchcode").val(depotBranch[0]["CompanyBranchUUID"])
                    $("#BranchCode-Depot-DetailForm").val(depotBranch[0]["BranchCode"]+"("+depotBranch[0]["portCode"]["PortCode"]+")")
                    $("#"+props.formNameLowerCase+"depot-branchname").val(depotBranch[0]["BranchName"])
                 

               
                }
            })
        });

        window.$("#CompanyROC-PODHauler-DetailForm").on("change", function () {
            var id = $(this).attr("id");
            var haulerBranch=[]
            var filters = {
                "CompanyUUID": $("#"+props.formNameLowerCase+"hauler-podhaulercode").val()
            };
            GetCompanyBranches(filters,props.globalContext).then(data => {
                $.each(data, function (key, value) {
                    var found=false;
                    $.each(value.companyBranchHasCompanyTypes, function (key2, value2) {
                        if(found==false){
                            if(value2.CompanyType=="----hauler"){
                                found=true
                                haulerBranch.push(value)
                            }
                        }
                
                        //html += "<option value='" + value.CompanyBranchUUID + "'>" + value.BranchCode + "</option>";
                    });

                })
                if(haulerBranch.length>0){
                    $("#"+props.formNameLowerCase+"hauler-podhaulerbranchcode").val(haulerBranch[0]["CompanyBranchUUID"])
                    $("#BranchCode-PODHauler-DetailForm").val(haulerBranch[0]["BranchCode"]+"("+haulerBranch[0]["portCode"]["PortCode"]+")")
                    $("#"+props.formNameLowerCase+"hauler-podhaulerbranchname").val(haulerBranch[0]["BranchName"])
                    $("#"+props.formNameLowerCase+"hauler-podhaulerbranchtel").val(haulerBranch[0]["Tel"])
                    $("#"+props.formNameLowerCase+"hauler-podhaulerbranchfax").val(haulerBranch[0]["Fax"])
                    $("#"+props.formNameLowerCase+"hauler-podhaulerbranchemail").val(haulerBranch[0]["Email"])
                    $("#"+props.formNameLowerCase+"hauler-podhaulerbranchaddressline1").val(haulerBranch[0]["AddressLine1"])
                    $("#"+props.formNameLowerCase+"hauler-podhaulerbranchaddressline2").val(haulerBranch[0]["AddressLine2"])
                    $("#"+props.formNameLowerCase+"hauler-podhaulerbranchaddressline3").val(haulerBranch[0]["AddressLine3"])
                    $("#"+props.formNameLowerCase+"hauler-podhaulerbranchpostcode").val(haulerBranch[0]["Postcode"])
                    $("#"+props.formNameLowerCase+"hauler-podhaulerbranchcity").val(haulerBranch[0]["City"])
                    $("#"+props.formNameLowerCase+"hauler-podhaulerbranchcountry").val(haulerBranch[0]["Country"])
                    $("#"+props.formNameLowerCase+"hauler-podhaulerbranchcoordinates").val(haulerBranch[0]["Coordinates"])

                    var filters = {
                        "Branch": haulerBranch[0]["CompanyBranchUUID"],
                    };
                    GetCompanyContacts(filters,props.globalContext).then(data => {
                        if (data.length != 0) {
                            $("#AttentionName-PODHauler-DetailForm").val(data[0]["FirstName"] + " " + data[0]["LastName"]);
                            $("#"+props.formNameLowerCase+"hauler-podhaulerattentiontel").val(data[0]["Tel"]);
                            $("#"+props.formNameLowerCase+"hauler-podhaulerattentionemail").val(data[0]["Email"]);
                        } else {
                            $("#AttentionName-PODHauler-DetailForm").val("");
                            $("#"+props.formNameLowerCase+"hauler-podhaulerattentiontel").val("");
                            $("#"+props.formNameLowerCase+"hauler-podhaulerattentionemail").val("");
                        }
                    })
                }
            })
        });

        window.$("#CompanyROC-Voyage-DetailForm").on("change", function () {
            setTimeout(() => {
                var name = $("#"+props.formNameLowerCase+"-shipoperatorcompany").val();
                var roc = $("#CompanyROC-Voyage-DetailForm").val();
                window.$("#CompanyROC-Voyage-Quickform").val(name + '(' + roc + ')');
            }, 100);
                var id = $(this).attr("id");
            var shipOperatorBranch=[]
            var filters = {
                "CompanyUUID": $("#"+props.formNameLowerCase+"-shipoperator").val()
            };
            GetCompanyBranches(filters,props.globalContext).then(data => {
                $.each(data, function (key, value) {
                    var found=false;
                    $.each(value.companyBranchHasCompanyTypes, function (key2, value2) {
                        if(found==false){
                            if(value2.CompanyType=="----shipoperator"){
                                found=true
                                shipOperatorBranch.push(value)
                            }
                        }
                
                    });

                })
                if(shipOperatorBranch.length>0){
                    $("#"+props.formNameLowerCase+"-shipoperatorbranchcode").val(shipOperatorBranch[0]["CompanyBranchUUID"])
                    $("#BranchCode-Voyage-DetailForm").val(shipOperatorBranch[0]["BranchCode"]+"("+shipOperatorBranch[0]["portCode"]["PortCode"]+")")
                    $("#"+props.formNameLowerCase+"-shipoperatorbranchname").val(shipOperatorBranch[0]["BranchName"])                    
                }
            })
        });

        
        var NotifyPartyHistory = "";
        var AttentionPartyHistory = "";
        var FreightPartyHistory = "";
        
        $(".copy-notify-party").click(function () {
            // require 2 attributes to function : data-refer + data-transfer
            var refer = $(this).attr("data-refer");
            if (refer == "None") {
                $(this).parent().parent().parent().parent().next().find("input[type=text]").val("")
            }
            $("#NotifyPartyCopyFrom").val(refer);
            var transfer = $(this).attr("data-transfer");
            $("input[data-target='CompanyID-NotifyParty']").val($("input[data-target='CompanyID-" + refer + "'").val());
            $("input[data-target='CompanyROC-NotifyParty']").val($("#CompanyROC-" + refer + "-DetailForm").val());
            $("input[data-target='CompanyName-NotifyParty']").val($("input[data-target='CompanyName-" + refer + "']").val());
            $("input[data-target='BranchID-NotifyParty']").val($("input[data-target='BranchID-" + refer + "']").val());
            $("input[data-target='BranchCode-NotifyParty']").val($("input[data-target='BranchCode-" + refer + "']").val());
            $("input[data-target='BranchName-NotifyParty']").val($("input[data-target='BranchName-" + refer + "']").val());
            $("input[data-target='BranchTel-NotifyParty']").val($("input[data-target='BranchTel-" + refer + "']").val());
            $("input[data-target='BranchFax-NotifyParty']").val($("input[data-target='BranchFax-" + refer + "']").val());
            $("input[data-target='BranchEmail-NotifyParty']").val($("input[data-target='BranchEmail-" + refer + "']").val());
            $("input[data-target='BranchAddressLine1-NotifyParty']").val($("input[data-target='BranchAddressLine1-" + refer + "']").val());
            $("input[data-target='BranchAddressLine2-NotifyParty']").val($("input[data-target='BranchAddressLine2-" + refer + "']").val());
            $("input[data-target='BranchAddressLine3-NotifyParty']").val($("input[data-target='BranchAddressLine3-" + refer + "']").val());
            $("input[data-target='BranchPostcode-NotifyParty']").val($("input[data-target='BranchPostcode-" + refer + "']").val());
            $("input[data-target='BranchCity-NotifyParty']").val($("input[data-target='BranchCity-" + refer + "']").val());
            $("input[data-target='BranchCountry-NotifyParty']").val($("input[data-target='BranchCountry-" + refer + "']").val());
            $("input[data-target='BranchCoordinates-NotifyParty']").val($("input[data-target='BranchCoordinates-" + refer + "']").val());
            $("input[data-target='AttentionName-NotifyParty']").val($("input[data-target='AttentionName-" + refer + "']").val());
            $("input[data-target='AttentionTel-NotifyParty']").val($("input[data-target='AttentionTel-" + refer + "']").val());
            $("input[data-target='AttentionEmail-NotifyParty']").val($("input[data-target='AttentionEmail-" + refer + "']").val());
            NotifyPartyHistory = refer;
            if (NotifyPartyHistory == "Agent") {
                $("#notifypartybillto").removeClass("bg-warning");
                $("#notifypartyshipper").removeClass("bg-warning");
                $("#notifypartyconsignee").removeClass("bg-warning");
                $("#notifypartynone").removeClass("bg-warning");
                $("#notifypartyagent").addClass("bg-warning");
            } else if (NotifyPartyHistory == "BillTo") {
                $("#notifypartyshipper").removeClass("bg-warning");
                $("#notifypartyconsignee").removeClass("bg-warning");
                $("#notifypartynone").removeClass("bg-warning");
                $("#notifypartyagent").removeClass("bg-warning");
                $("#notifypartybillto").addClass("bg-warning");
            } else if (NotifyPartyHistory == "Shipper") {
                $("#notifypartyconsignee").removeClass("bg-warning");
                $("#notifypartynone").removeClass("bg-warning");
                $("#notifypartyagent").removeClass("bg-warning");
                $("#notifypartybillto").removeClass("bg-warning");
                $("#notifypartyshipper").addClass("bg-warning");
            } else if (NotifyPartyHistory == "Consignee") {
                $("#notifypartynone").removeClass("bg-warning");
                $("#notifypartyagent").removeClass("bg-warning");
                $("#notifypartybillto").removeClass("bg-warning");
                $("#notifypartyshipper").removeClass("bg-warning");
                $("#notifypartyconsignee").addClass("bg-warning");
            } else {
                $("#notifypartynone").removeClass("bg-warning");
                $("#notifypartyagent").removeClass("bg-warning");
                $("#notifypartybillto").removeClass("bg-warning");
                $("#notifypartyshipper").removeClass("bg-warning");
                $("#notifypartyconsignee").removeClass("bg-warning");
            }
        });

        $(".copy-attention-party").click(function () {
            // require 2 attributes to function : data-refer + data-transfer
            var refer2 = $(this).attr("data-refer");
            if (refer2 == "None") {
                $(this).parent().parent().parent().parent().next().find("input[type=text]").val("")
            }
            $("#NotifyPartyCopyFrom").val(refer2);
            var transfer = $(this).attr("data-transfer");
            $("input[data-target='CompanyID-AttentionParty']").val($("input[data-target='CompanyID-" + refer2 + "'").val());
            $("input[data-target='CompanyROC-AttentionParty']").val($("#CompanyROC-" + refer2 + "-DetailForm").val());
            $("input[data-target='CompanyName-AttentionParty']").val($("input[data-target='CompanyName-" + refer2 + "']").val());
            $("input[data-target='BranchID-AttentionParty']").val($("input[data-target='BranchID-" + refer2 + "']").val());
            $("input[data-target='BranchCode-AttentionParty']").val($("input[data-target='BranchCode-" + refer2 + "']").val());
            $("input[data-target='BranchName-AttentionParty']").val($("input[data-target='BranchName-" + refer2 + "']").val());
            $("input[data-target='BranchTel-AttentionParty']").val($("input[data-target='BranchTel-" + refer2 + "']").val());
            $("input[data-target='BranchFax-AttentionParty']").val($("input[data-target='BranchFax-" + refer2 + "']").val());
            $("input[data-target='BranchEmail-AttentionParty']").val($("input[data-target='BranchEmail-" + refer2 + "']").val());
            $("input[data-target='BranchAddressLine1-AttentionParty']").val($("input[data-target='BranchAddressLine1-" + refer2 + "']").val());
            $("input[data-target='BranchAddressLine2-AttentionParty']").val($("input[data-target='BranchAddressLine2-" + refer2 + "']").val());
            $("input[data-target='BranchAddressLine3-AttentionParty']").val($("input[data-target='BranchAddressLine3-" + refer2 + "']").val());
            $("input[data-target='BranchPostcode-AttentionParty']").val($("input[data-target='BranchPostcode-" + refer2 + "']").val());
            $("input[data-target='BranchCity-AttentionParty']").val($("input[data-target='BranchCity-" + refer2 + "']").val());
            $("input[data-target='BranchCountry-AttentionParty']").val($("input[data-target='BranchCountry-" + refer2 + "']").val());
            $("input[data-target='BranchCoordinates-AttentionParty']").val($("input[data-target='BranchCoordinates-" + refer2 + "']").val());
            $("input[data-target='AttentionName-AttentionParty']").val($("input[data-target='AttentionName-" + refer2 + "']").val());
            $("input[data-target='AttentionTel-AttentionParty']").val($("input[data-target='AttentionTel-" + refer2 + "']").val());
            $("input[data-target='AttentionEmail-AttentionParty']").val($("input[data-target='AttentionEmail-" + refer2 + "']").val());
            AttentionPartyHistory = refer2;
            if (AttentionPartyHistory == "Agent") {
                $("#attentionpartybillto").removeClass("bg-warning");
                $("#attentionpartyshipper").removeClass("bg-warning");
                $("#attentionpartyconsignee").removeClass("bg-warning");
                $("#attentionpartynone").removeClass("bg-warning");
                $("#attentionpartyagent").addClass("bg-warning");
            } else if (AttentionPartyHistory == "BillTo") {
                $("#attentionpartyagent").removeClass("bg-warning");
                $("#attentionpartyshipper").removeClass("bg-warning");
                $("#attentionpartyconsignee").removeClass("bg-warning");
                $("#attentionpartynone").removeClass("bg-warning");
                $("#attentionpartybillto").addClass("bg-warning");
            } else if (AttentionPartyHistory == "Shipper") {
                $("#attentionpartyagent").removeClass("bg-warning");
                $("#attentionpartynone").removeClass("bg-warning");
                $("#attentionpartybillto").removeClass("bg-warning");
                $("#attentionpartyconsignee").removeClass("bg-warning");
                $("#attentionpartyshipper").addClass("bg-warning");
            } else if (AttentionPartyHistory == "Consignee") {
                $("#attentionpartyagent").removeClass("bg-warning");
                $("#attentionpartynone").removeClass("bg-warning");
                $("#attentionpartybillto").removeClass("bg-warning");
                $("#attentionpartyshipper").removeClass("bg-warning");
                $("#attentionpartyconsignee").addClass("bg-warning");
            } else {
                $("#attentionpartyagent").removeClass("bg-warning");
                $("#attentionpartynone").removeClass("bg-warning");
                $("#attentionpartybillto").removeClass("bg-warning");
                $("#attentionpartyshipper").removeClass("bg-warning");
                $("#attentionpartyconsignee").removeClass("bg-warning");
            }
        });
        
        $(".copy-freight-party").click(function () {
            // require 2 attributes to function : data-refer + data-transfer
            var refer3 = $(this).attr("data-refer");
            if (refer3 == "None") {
                $(this).parent().parent().parent().parent().next().find("input[type=text]").val("")
            }
            $("#NotifyPartyCopyFrom").val(refer3);
            var transfer = $(this).attr("data-transfer");
            $("input[data-target='CompanyID-FreightParty']").val($("input[data-target='CompanyID-" + refer3 + "'").val());
            $("input[data-target='CompanyROC-FreightParty']").val($("#CompanyROC-" + refer3 + "-DetailForm").val());
            $("input[data-target='CompanyName-FreightParty']").val($("input[data-target='CompanyName-" + refer3 + "']").val());

            $("span[data-target='CompanyName-FreightParty']").text($("input[data-target='CompanyName-" + refer3 + "']").val());
            $("span[data-target='BranchAddressLine1-FreightParty']").text($("input[data-target='BranchAddressLine1-" + refer3 + "']").val());
            $("span[data-target='BranchAddressLine2-FreightParty']").text($("input[data-target='BranchAddressLine2-" + refer3 + "']").val());
            $("span[data-target='BranchAddressLine3-FreightParty']").text($("input[data-target='BranchAddressLine3-" + refer3 + "']").val());
            $("span[data-target='BranchTel-FreightParty']").text($("input[data-target='BranchTel-" + refer3 + "']").val());
            $("span[data-target='BranchFax-FreightParty']").text($("input[data-target='BranchFax-" + refer3 + "']").val());
            props.setValue(`${props.formName}FreightParty[CreditTerm]`,$(`input[name='${props.formName}${refer3}[CreditTerm]']`).val())
            $("input[data-target='CreditLimit-FreightParty']").val($("input[data-target='CreditLimit-" + refer3 + "']").val());

            $("input[data-target='BranchID-FreightParty']").val($("input[data-target='BranchID-" + refer3 + "']").val());
            $("input[data-target='BranchCode-FreightParty']").val($("input[data-target='BranchCode-" + refer3 + "']").val());
            $("input[data-target='BranchName-FreightParty']").val($("input[data-target='BranchName-" + refer3 + "']").val());
            $("input[data-target='BranchTel-FreightParty']").val($("input[data-target='BranchTel-" + refer3 + "']").val());
            $("input[data-target='BranchFax-FreightParty']").val($("input[data-target='BranchFax-" + refer3 + "']").val());
            $("input[data-target='BranchEmail-FreightParty']").val($("input[data-target='BranchEmail-" + refer3 + "']").val());
            $("input[data-target='BranchAddressLine1-FreightParty']").val($("input[data-target='BranchAddressLine1-" + refer3 + "']").val());
            $("input[data-target='BranchAddressLine2-FreightParty']").val($("input[data-target='BranchAddressLine2-" + refer3 + "']").val());
            $("input[data-target='BranchAddressLine3-FreightParty']").val($("input[data-target='BranchAddressLine3-" + refer3 + "']").val());
            $("input[data-target='BranchPostcode-FreightParty']").val($("input[data-target='BranchPostcode-" + refer3 + "']").val());
            $("input[data-target='BranchCity-FreightParty']").val($("input[data-target='BranchCity-" + refer3 + "']").val());
            $("input[data-target='BranchCountry-FreightParty']").val($("input[data-target='BranchCountry-" + refer3 + "']").val());
            $("input[data-target='BranchCoordinates-FreightParty']").val($("input[data-target='BranchCoordinates-" + refer3 + "']").val());
            $("input[data-target='AttentionName-FreightParty']").val($("input[data-target='AttentionName-" + refer3 + "']").val());
            $("input[data-target='AttentionTel-FreightParty']").val($("input[data-target='AttentionTel-" + refer3 + "']").val());
            $("input[data-target='AttentionEmail-FreightParty']").val($("input[data-target='AttentionEmail-" + refer3 + "']").val());
            FreightPartyHistory = refer3;
            if (FreightPartyHistory == "Agent") {
                $("#freightpartybillto").removeClass("bg-warning");
                $("#freightpartyshipper").removeClass("bg-warning");
                $("#freightpartyconsignee").removeClass("bg-warning");
                $("#freightpartynone").removeClass("bg-warning");
                $("#freightpartyagent").addClass("bg-warning");
            } else if (FreightPartyHistory == "BillTo") {
                $("#freightpartyagent").removeClass("bg-warning");
                $("#freightpartyshipper").removeClass("bg-warning");
                $("#freightpartyconsignee").removeClass("bg-warning");
                $("#freightpartynone").removeClass("bg-warning");
                $("#freightpartybillto").addClass("bg-warning");
            } else if (FreightPartyHistory == "Shipper") {
                $("#freightpartyagent").removeClass("bg-warning");
                $("#freightpartynone").removeClass("bg-warning");
                $("#freightpartybillto").removeClass("bg-warning");
                $("#freightpartyconsignee").removeClass("bg-warning");
                $("#freightpartyshipper").addClass("bg-warning");
            } else if (FreightPartyHistory == "Consignee") {
                $("#freightpartyagent").removeClass("bg-warning");
                $("#freightpartynone").removeClass("bg-warning");
                $("#freightpartybillto").removeClass("bg-warning");
                $("#freightpartyshipper").removeClass("bg-warning");
                $("#freightpartyconsignee").addClass("bg-warning");
            } else {
                $("#freightpartyagent").removeClass("bg-warning");
                $("#freightpartynone").removeClass("bg-warning");
                $("#freightpartybillto").removeClass("bg-warning");
                $("#freightpartyshipper").removeClass("bg-warning");
                $("#freightpartyconsignee").removeClass("bg-warning");
            }
        });
    
        //
        var input;
        var inputType;
        var inputType2;
        window.$(".openAttentionModal").click(function () {
            window.$("#modal").modal("toggle");
            input = $(this).parent().find("input").attr("id");
            inputType = input.split("-")[1] + "-" + input.split("-")[2];
            inputType2 = input.split("-")[1];
        // start : Initialize Attention Table (In the modal)
        InitModalTable({
            tableSelector: "#Attention-Table",
            url: "../company-contact/get-company-contacts-by-company-branch",
            paramData:$("input[data-target='BranchID-" + inputType2 + "']").val(),
            globalContext:props.globalContext,
            csrf: $('meta[name="csrf-token"]').attr('content'),
            columns: [
                { field: 'Name', title: 'Attention Name' },
                { field: 'Tel', title: 'Attention Tel' },
                { field: 'Email', title: 'Attention Email' },
                { field: 'Fax', title: 'Attention Fax' },
            ],
        })
        // end : Initialize Attention Table (In the modal)
            
        })
        // end : Open Attention Modal


        // start : Click Button "Add" in Attention Modal
        window.$(".getAttentionSelections").click(function () {
            var selections = window.$("#Attention-Table").bootstrapTable('getSelections');
            $("input[data-target='AttentionName-" + inputType2 + "']").val("");
            $("input[data-target='AttentionTel-" + inputType2 + "']").val("");
            $("input[data-target='AttentionEmail-" + inputType2 + "']").val("");
            $("input[data-target='AttentionFax-" + inputType2 + "']").val("");
            var AttentionName = $("input[data-target='AttentionName-" + inputType2 + "']").val();
            var AttentionTel = $("input[data-target='AttentionTel-" + inputType2 + "']").val();
            var AttentionEmail = $("input[data-target='AttentionEmail-" + inputType2 + "']").val();
            var AttentionFax = $("input[data-target='AttentionFax-" + inputType2 + "']").val();

            // Append the string that already exist in the input
            $.each(selections, function (key, value) {
                if (AttentionName == "") {
                    AttentionName += " " + value.Name;
                } else {
                    AttentionName += ", " + value.Name;
                }

                if (AttentionTel == "") {
                    AttentionTel += " " + value.Tel;
                } else {
                    AttentionTel += ", " + value.Tel;
                }

                if (AttentionEmail == "") {
                    AttentionEmail += " " + value.Email;
                } else {
                    AttentionEmail += ", " + value.Email;
                }

                if (AttentionFax == "") {
                    AttentionFax += " " + value.Email;
                } else {
                    AttentionFax += ", " + value.Email;
                }
            });

            // The appended string is given to the respective inputs
            $("input[data-target='AttentionName-" + inputType2 + "']").val(AttentionName);
            $("input[data-target='AttentionTel-" + inputType2 + "']").val(AttentionTel);
            $("input[data-target='AttentionEmail-" + inputType2 + "']").val(AttentionEmail);
            $("input[data-target='AttentionFax-" + inputType2 + "']").val(AttentionFax);
            window.$("#Attention-Table").bootstrapTable('uncheckAll');
            window.$("#modal").modal("toggle");
        })
        // end : Click Button "Add" in Attention Modal


        window.$(".dropdownInputCompany").focusin(function(key, value){
            var CheckCompType=$(this).attr('data-target');
            inputID = $(this).attr("id");
            // var tableID = ""
            var tableID = $(this).next().find("table").attr("id");
            tableID?tableID=tableID:tableID=$(this).next().find("table").eq(1).attr("id");
            var companyType=""
            var type = inputID.split("-")[1]; // Agent / Shipper / Consignee
            var form = inputID.split("-")[2]; // detail form / quick form
            var AttentionFormName = props.formName+type; // QuotationAgent
            var lowerType = type.toLowerCase(); // agent / shipper / consignee
            if(CheckCompType=="CompanyROC-Voyage"){
                companyType="Ship Operator"
            }
            if(CheckCompType=="CompanyROC-Depot"){
                companyType="Depot"
            }
            if(CheckCompType=="CompanyROC-PODHauler" || CheckCompType=="CompanyROC-POLHauler"){
                companyType="Hauler"
            }
         
            const GetGridviewData = function (params) {     
               
                var param={
                    limit:params.data.limit,
                    offset:params.data.offset,
                    sort:params.data.sort,
                    search:params.data.search,
                    order:params.data.order,
                    valid:"1",
                    companyType:companyType
                   
                }
              
                    GetCompanyDropdown(companyType,param,props.globalContext).then(res => {
                        params.success({
                            "rows": res.rows,
                            "total": res.total
                        })
                        
                    })
             
               
            }

         
            InitDropdownTable({
                
                searchSelector: "#" + inputID, // #id
                tableSelector: "#" + tableID,  // #id
                toolbarSelector: "", // #toolbarID
                csrf: $('meta[name="csrf-token"]').attr('content'),
                columns: [ //columns to be displayed - data from controller (actionGetcompany)
                    { field: 'ROC', title: 'ROC' },
                    { field: 'CompanyName', title: 'Company Name' },
                    { field: 'CreditTermCreditTerm', title: 'Credit Term' },
                    { field: 'CreditLimit', title: 'Credit Limit' },
                ],
                functionGrid: GetGridviewData,
                setValue:props.setValue,
                getValues:props.getValues,
                trigger:props.trigger,
                specialFormName: AttentionFormName,
                inputSelector: [ // input to be filled when table row onclick
                    { input: 'input[data-target="CompanyID-' + type + '"]', name: 'CompanyUUID' },
                    { input: 'input[data-target="CompanyROC-' + type + '"]', name: 'ROC' },
                    { input: 'input[data-target="CompanyName-' + type + '"]', name: 'CompanyName' },
                    { input: 'select[data-target="CreditTerm-' + type + '"]', name: 'CreditTerm' },
                    { input: 'input[data-target="CreditLimit-' + type + '"]', name: 'CreditLimit' },
                ],
                clearMatch: "#"+props.formNameLowerCase+"" + lowerType + "-roc", // hidden input to store old selected value
                clearSelector: [ // input to be cleared if different row in dropdown table is selected.
                    { input: 'input[data-target="CompanyID-' + type + '"]' },
                    { input: 'input[data-target="CompanyROC-' + type + '"]' },
                    { input: 'input[data-target="CompanyName-' + type + '"]' },
                    { input: 'select[data-target="CreditTerm-' + type + '"]' },
                    { input: 'input[data-target="CreditLimit-' + type + '"]' },
                    { input: 'input[data-target="BranchCode-' + type + '"]' },
                    { input: 'input[data-target="BranchName-' + type + '"]' },
                    { input: 'input[data-target="BranchTel-' + type + '"]' },
                    { input: 'input[data-target="BranchEmail-' + type + '"]' },
                    { input: 'input[data-target="BranchFax-' + type + '"]' },
                    { input: 'input[data-target="BranchAddressLine1-' + type + '"]' },
                    { input: 'input[data-target="BranchAddressLine2-' + type + '"]' },
                    { input: 'input[data-target="BranchAddressLine3-' + type + '"]' },
                    { input: 'input[data-target="BranchPostcode-' + type + '"]' },
                    { input: 'input[data-target="BranchCity-' + type + '"]' },
                    { input: 'input[data-target="BranchCountry-' + type + '"]' },
                    { input: 'input[data-target="BranchCoordinates-' + type + '"]' },
                    { input: 'input[data-target="AttentionName-' + type + '"]' },
                    { input: 'input[data-target="AttentionTel-' + type + '"]' },
                    { input: 'input[data-target="AttentionEmail-' + type + '"]' },
                ],
            });
    
        })


         // start : Initialize all dropdown bootstrap table of company
        var inputID;

        // start : show dropdown bootstrap table when input is focused
        // important note : uses dom selector, arrange of dom is important to follow
        window.$(".dropdownInputCompany").on("focusin",function () {
            inputID = $(this).attr("id");
            $(".dropdownTable").addClass("d-none");
            $(this).next().removeClass("d-none");
            $(".fixed-table-body").scrollTop(0);

            var targetTable = $(this).next().find("table")
            if(targetTable.length==1){
            
                var tableID=$(targetTable[0]).attr("id")
                // var tableID= 
            }
            if(targetTable.length>1){
                var tableID = targetTable[1];
                tableID=$(tableID).attr("id")
            }
            var splitTableID = tableID.split("-");
            
            var table = $("#" + tableID);
           
            window.$(".dropdownInputCompany").off('keydown').on('keydown',function (event) {

                var radio = $("input[name='btSelectItem']:checked")
                var lastIndex = window.$(table).find("tr").last().index();
                var selectedIndex = radio.parent().parent().parent().index()
                if (event.which == 38) {
                    if (selectedIndex != 0)
                        window.$(table).bootstrapTable('check', selectedIndex - 1)
                    // $('.dropdownInputCompany').scrollTo(100);
                    var target = $('.fixed-table-body');
                } else if (event.which == 40) {
                    if (selectedIndex != lastIndex)
                        window.$(table).bootstrapTable('check', selectedIndex + 1)
                    var target = $('.fixed-table-body');
                } else if (event.which == 13) {
                    var data = window.$(table).bootstrapTable("getSelections");
                    var res = inputID.split("-");
                    
                    //check it is on detail form or quicform
                    if (res[2] == "DetailForm") {
                        $("input[data-target='CompanyID-" + res[1] + "']").val(data[0].CompanyUUID);
                        $("input[data-target='CompanyName-" + res[1] + "']").val(data[0].CompanyName);
                        $("input[data-target='CompanyROC-" + res[1] + "']").val(data[0].ROC);
                        $("select[data-target='CreditTerm-" + res[1] + "']").val(data[0].CreditTerm).trigger("change.select2");
                        $("input[data-target='CreditLimit-" + res[1] + "']").val(data[0].CreditLimit);


                        inputID = "CompanyROC-" + res[1] + "-Quickform";

                        $("#" + inputID).val((data[0].CompanyName) + "(" + (data[0].ROC) + ")");
                        if(res[1] == "BillTo"){
                            props.setValue("DynamicModel[BillToCompany]",(data[0].CompanyName) + "(" + (data[0].ROC) + ")")
                        }
                    }
                    else {
                        $("input[data-target='CompanyID-" + res[1] + "']").val(data[0].CompanyUUID);
                        $("input[data-target='CompanyName-" + res[1] + "']").val(data[0].CompanyName);
                        $("input[data-target='CompanyROC-" + res[1] + "']").val(data[0].ROC);
                        $("select[data-target='CreditTerm-" + res[1] + "']").val(data[0].CreditTerm).trigger("change.select2");
                        $("input[data-target='CreditLimit-" + res[1] + "']").val(data[0].CreditLimit);
                        
                        $("#" + inputID).val((data[0].CompanyName) + "(" + (data[0].ROC) + ")");
                        if(res[1] == "BillTo"){
                            props.setValue("DynamicModel[BillToCompany]",(data[0].CompanyName) + "(" + (data[0].ROC) + ")")
                        }                    
                    }
                    if(inputID=="CompanyROC-BillTo-Quickform"){
                        if($("#" + inputID).val()!==""){
                            $("#" + inputID).parent().removeClass("has-error");
                            $("#" + inputID).removeClass("has-error");
                            $("#" + inputID).parent().find(".control-label").removeClass("has-error-label");
                            $("#" + inputID).parent().children().find(".errorMessage").text("")
                            $("#" + inputID).parent().find(".help-block").text("")
                        }
                    }

                    //ajax get company branch data
                    if (inputID == "CompanyROC-Voyage-Detailform" || inputID == "CompanyROC-Voyage-Quickform") {
                        var branchCompanyType= "----shipoperator"
                    } else if (inputID == "CompanyROC-POLHauler-DetailForm" || inputID == "CompanyROC-PODHauler-DetailForm" ) {
                        var branchCompanyType= "----hauler"
                    } 
                    else {
                        var branchCompanyType= "All"
                    }
                    var result=[]
                    var filters = {
                        "CompanyUUID": data[0].CompanyUUID,
                    };

                    GetCompanyBranches(filters,props.globalContext).then(data => {
                        if(branchCompanyType!=="All"){
                            $.each(data, function (key, value) {
                                var found=false;
                                $.each(value.companyBranchHasCompanyTypes, function (key2, value2) {
                                    if(found==false){
                                        if(value2.CompanyType==branchCompanyType){
                                            found=true
                                            result.push(value)
                                        }
                                    }
                                });
                            })
                        }
                        else{
                            result=data
                        }
                        $("input[data-target='BranchID-" + res[1] + "']").val(result[0]["CompanyBranchUUID"]);
                        $("input[data-target='BranchCode-" + res[1] + "']").val(result[0]["BranchCode"]);
                        $("input[data-target='BranchName-" + res[1] + "']").val(result[0]["BranchName"]);
                        $("input[data-target='BranchTel-" + res[1] + "']").val(result[0]["Tel"]);
                        $("input[data-target='BranchFax-" + res[1] + "']").val(result[0]["Fax"]);
                        $("input[data-target='BranchEmail-" + res[1] + "']").val(result[0]["Email"]);
                        $("input[data-target='BranchAddressLine1-" + res[1] + "']").val(result[0]["AddressLine1"]);
                        $("input[data-target='BranchAddressLine2-" + res[1] + "']").val(result[0]["AddressLine2"]);
                        $("input[data-target='BranchAddressLine3-" + res[1] + "']").val(result[0]["AddressLine3"]);
                        $("input[data-target='BranchPostcode-" + res[1] + "']").val(result[0]["Postcode"]);
                        $("input[data-target='BranchCity-" + res[1] + "']").val(result[0]["City"]);
                        $("input[data-target='BranchCountry-" + res[1] + "']").val(result[0]["Country"]);
                        $("input[data-target='BranchCoordinates-" + res[1] + "']").val(result[0]["Coordinates"]);
                    
                        //ajax get company contact data
                        var filters = {
                            "Branch": result[0]["CompanyBranchUUID"],
                        };
                        GetCompanyContacts(filters,props.globalContext).then(data => {
                            if (data != "") {
                                $("input[data-target='AttentionName-" + res[1] + "']").val(data[0]["FirstName"] + " " + data[0]["LastName"]);
                                $("input[data-target='AttentionTel-" + res[1] + "']").val(data[0]["Tel"]);
                                $("input[data-target='AttentionEmail-" + res[1] + "']").val(data[0]["Email"]);
                            }
                        })
                    })

                
                    $(':focus').blur()
                    $(".dropdownTable").addClass("d-none");
                }
            
                if($("#" + tableID).find('tbody .selected').length!==0){
                    var checkss = ($("#" + tableID).find('tbody .selected').offset().top) - $(".fixed-table-container").height();
                    if (splitTableID[2] == "Quickform") {
                        $(".fixed-table-body").scrollTop(checkss + $("#" + tableID).parent().scrollTop() - 300);
                    }
                    else {
                        $(".fixed-table-body").scrollTop(checkss + $("#" + tableID).parent().scrollTop() - 200);
                    }
                }
            

            });

        });
        // end : show dropdown bootstrap table when input is focused

        window.$(".dropdownInputCompany").focusout(function () {
            $(document).unbind("keydown");
        });

        // start : Initialize all dropdown bootstrap table of branch
        window.$(".dropdownInputBranch").focusin(function(key, value){
            var CheckCompType=$(this).attr('data-target');
            inputID = $(this).attr("id");
            var companyType=""
            var tableID = $(this).next().find("table").attr("id");
            var type = inputID.split("-")[1]; // Agent / Shipper / Consignee
            var form = inputID.split("-")[2]; // detail form / quick form
        //$("#"+tableID).bootstrapTable('destroy')
            var lowerType = type.toLowerCase(); // agent / shipper / consignee

            if(CheckCompType=="BranchCode-Voyage"){
                companyType="Ship Operator"
            }  
            if(CheckCompType=="BranchCode-POLHauler"){
                companyType="Hauler"
            } 
            if(CheckCompType=="BranchCode-PODHauler"){
                companyType="Hauler"
            }   
            var GetGridviewData = function (params) {
               if(inputID=="BranchCode-BillTo-Quickform"){
                var closestCompanyTableId=$("#BranchCode-BillTo-DetailForm").parent().parent().parent().find(".dropdownInputCompany").prev().val()
               }else if(inputID=="BranchCode-Supplier-Quickform"){
                var closestCompanyTableId=$("#purchaseordersupplier-roc").val()
               }else{
                var closestCompanyTableId=$("#"+inputID).parent().parent().parent().find(".dropdownInputCompany").prev().val()
               }
               
            
                
                var param={
                    limit:params.data.limit,
                    offset:params.data.offset,
                    sort:params.data.sort,
                    search:params.data.search,
                    order:params.data.order,
                    CompanyUUID:closestCompanyTableId,
                    companyType:companyType
                
                }

                GetCompanyBranchDropdown(param,props.globalContext).then(res => {
                    params.success({
                        "rows": res.rows,
                        "total": res.total
                    })
                    
                })
            } 

            InitDropdownTable({
                searchSelector: "#" + inputID, // #id
                tableSelector: "#" + tableID,  // #id
                toolbarSelector: "", // #toolbarID
                csrf: $('meta[name="csrf-token"]').attr('content'),
                columns: [ //columns to be displayed - data from controller (actionGetbranch)
                    { field: 'BranchCode', title: 'BranchCode' },
                    { field: 'BranchName', title: 'Branch Name' },
                    { field: 'Tel', title: 'Tel' },
                    { field: 'Email', title: 'Email' }
                ],
                functionGrid: GetGridviewData,
                inputSelector: [ // input to be filled when table row onclick
                    { input: 'input[data-target="BranchID-' + type + '"]', name: 'CompanyBranchUUID' },
                    { input: 'input[data-target="BranchCode-' + type + '"]', name: 'BranchCode'},
                    { input: 'input[data-target="BranchName-' + type + '"]', name: 'BranchName' },
                    { input: 'input[data-target="BranchTel-' + type + '"]', name: 'Tel' },
                    { input: 'input[data-target="BranchEmail-' + type + '"]', name: 'Email' },
                    { input: 'input[data-target="BranchFax-' + type + '"]', name: 'Fax' },
                    { input: 'input[data-target="BranchAddressLine1-' + type + '"]', name: 'AddressLine1' },
                    { input: 'input[data-target="BranchAddressLine2-' + type + '"]', name: 'AddressLine2' },
                    { input: 'input[data-target="BranchAddressLine3-' + type + '"]', name: 'AddressLine3' },
                    { input: 'input[data-target="BranchPostcode-' + type + '"]', name: 'Postcode' },
                    { input: 'input[data-target="BranchCity-' + type + '"]', name: 'City' },
                    { input: 'input[data-target="BranchCountry-' + type + '"]', name: 'Country' },
                    { input: 'input[data-target="BranchCoordinates-' + type + '"]', name: 'Coordinates' },
                ],
                clearMatch: "#"+props.formNameLowerCase+"" + lowerType + "-branchcode", //place to refer to decide if old/new record is being clicked
                clearSelector: [ // input to be effected if old/new record is being clicked
                    { input: 'input[data-target="AttentionName-' + type + '"]' },
                    { input: 'input[data-target="AttentionTel-' + type + '"]' },
                    { input: 'input[data-target="AttentionEmail-' + type + '"]' },
                ],
            });
        })
        // end : Initialize all dropdown bootstrap table of branch


        // start : show dropdown bootstrap table when input is focused
        // important note : uses dom selector, arrange of dom is important to follow
        window.$(".dropdownInputBranch").focusin(function () {
            inputID = $(this).attr("id");
            $(".dropdownTable").addClass("d-none");
            $(this).next().removeClass("d-none");
            $(".fixed-table-body").scrollTop(0);

            var referID = $(this).attr("data-refer");
            var targetTable = $(this).next().find(".bootstrap-table").find(".fixed-table-body").find("table").attr("id");

            var referValue = $("#" + referID).val();
            if (inputID == "BranchCode-Voyage-Detailform" || inputID == "BranchCode-Voyage-Quickform") {
                window.$("#" + targetTable).bootstrapTable("filterBy", { Company: [referValue], Company_TypeShipoperator: ['----shipoperator'] })
            }
            else if (inputID == "BranchCode-POLHauler-DetailForm" || inputID == "BranchCode-PODHauler-DetailForm") {
                window.$("#" + targetTable).bootstrapTable("filterBy", { Company: [referValue], Company_TypeHauler: ['----hauler'] })
            }
            else {
                window.$("#" + targetTable).bootstrapTable("filterBy", { Company: [referValue] })
            }

            var targetTable = $(this).next().find("table")
            if(targetTable.length==1){
        
                var tableID=$(targetTable[0]).attr("id")
                // var tableID= 
            }
            if(targetTable.length>1){
                var tableID = targetTable[1];
                tableID=$(tableID).attr("id")
            }
            var splitTableID = tableID.split("-");
            var table = $("#" + tableID);
            // window.$(table).bootstrapTable('check', 0)
            window.$(".dropdownInputBranch").off('keydown').on('keydown',function (event) {
                var radio = $("input[name='btSelectItem']:checked")
                var lastIndex = window.$(table).find("tr").last().index();
                var selectedIndex = radio.parent().parent().parent().index()
                if (event.which == 38) {
                    if (selectedIndex != 0)
                        window.$(table).bootstrapTable('check', selectedIndex - 1)
                    // $('.dropdownInputCompany').scrollTo(100);
                    var target = $('.fixed-table-body');
                } else if (event.which == 40) {
                    if (selectedIndex != lastIndex)
                        window.$(table).bootstrapTable('check', selectedIndex + 1)
                    var target = $('.fixed-table-body');
                } else if (event.which == 13) {
                    var data = window.$(table).bootstrapTable("getSelections");
                    var res = inputID.split("-");

                    //check it is on detail form or quicform
                    // if(res[2]=="DetailForm"){
                    $("input[data-target='BranchID-" + res[1] + "']").val(data[0].CompanyBranchUUID);
                    $("input[data-target='BranchName-" + res[1] + "']").val(data[0].BranchName);
                    $("input[data-target='BranchCode-" + res[1] + "']").val(data[0].BranchCode);
                    //ajax get company branch data
                    var filters = {
                        "CompanyBranchUUID": data[0].CompanyBranchUUID,
                    };

                
                    GetCompanyBranches(filters,props.globalContext).then(data => {
                        $("input[data-target='BranchID-" + res[1] + "']").val(data[0]["CompanyBranchUUID"]);
                        $("input[data-target='BranchCode-" + res[1] + "']").val(data[0]["BranchCode"]+"("+data[0]["portCode"]["PortCode"]+")");
                        $("input[data-target='BranchName-" + res[1] + "']").val(data[0]["BranchName"]);
                        $("input[data-target='BranchTel-" + res[1] + "']").val(data[0]["Tel"]);
                        $("input[data-target='BranchFax-" + res[1] + "']").val(data[0]["Fax"]);
                        $("input[data-target='BranchEmail-" + res[1] + "']").val(data[0]["Email"]);
                        $("input[data-target='BranchAddressLine1-" + res[1] + "']").val(data[0]["AddressLine1"]);
                        $("input[data-target='BranchAddressLine2-" + res[1] + "']").val(data[0]["AddressLine2"]);
                        $("input[data-target='BranchAddressLine3-" + res[1] + "']").val(data[0]["AddressLine3"]);
                        $("input[data-target='BranchPostcode-" + res[1] + "']").val(data[0]["Postcode"]);
                        $("input[data-target='BranchCity-" + res[1] + "']").val(data[0]["City"]);
                        $("input[data-target='BranchCountry-" + res[1] + "']").val(data[0]["Country"]);
                        $("input[data-target='BranchCoordinates-" + res[1] + "']").val(data[0]["Coordinates"]);

                        //ajax get company contact data
                        var filters = {
                            "Branch": data[0]["CompanyBranchUUID"],
                        };
                        GetCompanyContacts(filters,props.globalContext).then(data => {
                            if(data.length>0){
                                $("input[data-target='AttentionName-" + res[1] + "']").val(data[0]["FirstName"] + " " + data[0]["LastName"]);
                                $("input[data-target='AttentionTel-" + res[1] + "']").val(data[0]["Tel"]);
                                $("input[data-target='AttentionEmail-" + res[1] + "']").val(data[0]["Email"]);
                            }
                        })
                    })
                    $(':focus').blur()
                    $(".dropdownTable").addClass("d-none");
                }
                
                if($("#" + tableID).find('tbody .selected').length!==0){
                    var checkss = ($("#" + tableID).find('tbody .selected').offset().top) - $(".fixed-table-container").height();
            
                    if (splitTableID[2] == "Quickform") {
                        $(".fixed-table-body").scrollTop(checkss + $("#" + tableID).parent().scrollTop() - 300);
                    }
                    else {
                        $(".fixed-table-body").scrollTop(checkss + $("#" + tableID).parent().scrollTop() - 200);
                    }
                }
            
            });
        });

        // end : show dropdown bootstrap table when input is focused

        window.$(".dropdownBillToInputBranch").focusin(function () {
            inputID = $(this).attr("id");
            $(".dropdownTable").addClass("d-none");
            $(this).next().removeClass("d-none");

        });


        // start : check if input for dropdown table is focused or not, to make dropdown bootstrap table behave properly (show / hide)
        window.$("body").off('click').on('click',function (e) {
            var targetTag = e.target;
            var lastParent = $(targetTag).parentsUntil(".dropdownTable").last();

            if ($(targetTag).attr("id") != inputID) {
                if (!($(lastParent[0]).hasClass("bootstrap-table"))) {
                    if (!($("#" + inputID).is(":focus"))) {
                        if(!$(targetTag).hasClass("page-link") && !$(targetTag).hasClass("dropdown-item")){
                            $(".dropdownTable").addClass("d-none");
                        }
                        if(inputID){
                            var search = $("#" + inputID).val();
                            var inputType = $("#" + inputID).attr("id");
                            var type = inputID.split("-")[1];
                            if ($("#" + inputID).hasClass("dropdownInputCompany")) {
                                if (search == "") { checkCode("#" + inputID, type, "Company"); }
        
                            } else if ($("#" + inputID).hasClass("dropdownInputBranch")) {
                                if (search == "") { checkCode("#" + inputID, type, "Branch"); }
                            }
                        }
                    }
                }
            }


            // if ($(e.target).data('toggle') !== 'popover'
            //     && $(e.target).parents('.popover.in').length === 0) {
            //     $('[data-toggle="popover"]').popover('dispose')

            // }
        });
        // end : check if input for dropdown table is focused or not, to make dropdown bootstrap table behave properly (show / hide)

        window.$('.dropdownInputCompany').on('keydown', function (e) {
            if (e.which == 9) {
                $(".dropdownTable").addClass("d-none");
                // var inputID = $(this).attr("id");
                // var type = inputID.split("-")[1];
                // if ($(this).val() == "") { checkCode("#" + inputID, type, "Company"); }
            }
            if (e.which == 27) {
                $(".dropdownTable").addClass("d-none");
            }
        });

        window.$('.dropdownInputBranch').on('keydown', function (e) {
            if (e.which == 9) {
                $(".dropdownTable").addClass("d-none");
            }
            if (e.which == 27) {
                $(".dropdownTable").addClass("d-none");
            }
        });

        //column chooser dropdown remain open after clicked
        window.$(document).on("click", "#columnchooserdropdown .dropdown-menu", function (e) {
            e.stopPropagation();
        })

        window.$('body').on('click', function (e) {
            //did not click a popover toggle or popover
            if ($(e.target).data('toggle') !== 'popover'
                && $(e.target).parents('.popover.in').length === 0) { 
                window.$('[data-toggle="popover"]').popover('hide');
            }
        });


        //calculate the last valid date according to validity day
        window.$(".validityDay").on("change", function () {
            window.$("input[data-target='ValidityDay']").val($(this).val())

            var days = parseInt($(this).val()) - 1;
            var docdate = $("input[name='DynamicModel[DocDate]']").val()

            var dateParts = docdate.split("/");
            var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
            dateObject.setDate(dateObject.getDate() + days);
            var dd = dateObject.getDate();

            var mm = dateObject.getMonth() + 1;
            var yyyy = dateObject.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            dateObject = dd + '/' + mm + '/' + yyyy;
 
            formContext.setStateHandle(dateObject,"LastValidDate")

            var TodayDate = moment().format("DD/MM/YYYY");
            var dateParts = TodayDate.split("/");
            var todaydate = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);

            var dateParts1 = dateObject.split("/");
            var lastValidDate = new Date(+dateParts1[2], dateParts1[1] - 1, +dateParts1[0]);

            //last valid date cant early then today
            // if (validStatus != "0") {

            //     if (lastValidDate < todaydate) {
            //         $(".CheckValidStatus").addClass("disabled")
            //     } else {
            //         $(".CheckValidStatus").removeClass("disabled")
            //     }
            // } else {
            //     $(".CheckValidStatus").addClass("disabled")
            // }
            
            $("#"+props.formNameLowerCase+"-voyagenum").val("").trigger("change")
            $("#dynamicmodel-voyagenum").parent().find(".select2-container--default").addClass('InvalidField')
            $("#dynamicmodel-voyagenum").parent().parent().find('.help-block').text($("#dynamicmodel-voyagenum").parent().parent().find("label").text()+" cannot be blank")
        })

        window.$(".lastValidDate").on("change", function () {
            formContext.setStateHandle($(this).val(),"LastValidDate")
            var TodayDate = moment().format("DD/MM/YYYY");
            var dateParts = TodayDate.split("/");
            var todaydate = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    
            var docdate = $("input[data-target='DocDate']").val();
            var LastValidDate = $(this).val();
            var dateParts1 = docdate.split("/");
            var dateParts2 = LastValidDate.split("/");
            var DateObjectDocDate = new Date(+dateParts1[2], dateParts1[1] - 1, +dateParts1[0]);
            var DateObjectLastValidDate = new Date(+dateParts2[2], dateParts2[1] - 1, +dateParts2[0]);
    
            var days = Math.abs(DateObjectLastValidDate - DateObjectDocDate) / (1000 * 3600 * 24)
    
            $(".validityDay").val(days + 1);
    
            //Checking for validationStatus 
            // if (validStatus != "0") {
            //     if (validationStatus != "Approved") {
            //         $(".CheckValidStatus").addClass("disabled")
            //     } else {
                    //last valid date cant early then today
                    if (DateObjectLastValidDate < todaydate) {
                        $(".CheckValidStatus").addClass("disabled")
                    } else {
                        //check last valid date to enable transfer to booking 
                        if ($("#"+props.formNameLowerCase+"-quotationtype").val() == "Advance Booking") {
                            var start = $("#"+props.formNameLowerCase+"-advancebookingstartdate-quickform").val()
                            var end = $("#"+props.formNameLowerCase+"-advancebookinglastvaliddate-quickform").val()
                            var dateParts1 = start.split("/");
                            var dateParts2 = end.split("/");
                            var DateObjectDocDate = new Date(+dateParts1[2], dateParts1[1] - 1, +dateParts1[0]);
                            var DateObjectLastValidDate = new Date(+dateParts2[2], dateParts2[1] - 1, +dateParts2[0]);
    
                            if (DateObjectLastValidDate < todaydate || DateObjectLastValidDate < DateObjectDocDate) {
                                $(".CheckValidStatus").addClass("disabled")
                            } else {
                                $(".CheckValidStatus").removeClass("disabled")
                            }
                        }
                        else {
                            if (DateObjectLastValidDate < DateObjectDocDate) {
                                $(".CheckValidStatus").addClass("disabled")
                            } else {
                                $(".CheckValidStatus").removeClass("disabled")
                            }
                        }
                    }
            //     }
            // } else {
            //     $(".CheckValidStatus").addClass("disabled")
            // }
    
            $("#"+props.formNameLowerCase+"-voyagenum").val("").trigger("change")
            $("#dynamicmodel-voyagenum").parent().find(".select2-container--default").addClass('InvalidField')
            $("#dynamicmodel-voyagenum").parent().parent().find('.help-block').text($("#dynamicmodel-voyagenum").parent().parent().find("label").text()+" cannot be blank")
        })

        //Last Valid Date equal to Advance Booking Last Valid Date if the quotation type = Advance Booking
        window.$("input[data-target='AdvanceBookingLastValidDate']").on("change", function () {
            $("input[data-target='LastValidDate']").val($(this).val());
        });

        //Advance Booking Start Date default equal to doc date
        window.$("input[data-target='DocDate']").on("change", function () {
            $("input[data-target='AdvanceBookingStartDate']").val($(this).val());
        });

        window.$("input[data-target='AdvanceBookingStartDate']").on("change", function () {
            $("input[data-target='DocDate']").val($(this).val());
        });

         //check DnD value and check checkbox accordingly
        window.$("#"+props.formNameLowerCase+"-dndcombinedday").on("change", function () {
            if ($(this).val() == 10) {
                $(".CombineDayCheckBox").prop("checked", true);
            }
            else {
                $(".CombineDayCheckBox").prop("checked", false);
            }
        });

        window.$("#"+props.formNameLowerCase+"-detention").on("change", function () {
            if ($(this).val() == 5) {
                $(".DetentionCheckBox").prop("checked", true);
            }
            else {
                $(".DetentionCheckBox").prop("checked", false);
            }
        });

        window.$("#"+props.formNameLowerCase+"-demurrage").on("change", function () {
            if ($(this).val() == 5) {
                $(".DemurrageCheckBox").prop("checked", true);
            }
            else {
                $(".DemurrageCheckBox").prop("checked", false);
            }
        });

        window.$(".DND").on("change", function () {
            var ApplyDND = $("#"+props.formNameLowerCase+"-applydnd").prop("checked");
            var DNDCombined = $("#"+props.formNameLowerCase+"-dndcombined").prop("checked");
            var DNDCombinedCheck = $("#currentDndCombinedCheck").val();
            if (ApplyDND == true && DNDCombined == true) {
                $(".dndapply").val("1")
                $(".dndcombined").val("1")
                $("#"+props.formNameLowerCase+"-quickform-dndcombined").prop("checked", true);
                $(".DNDCombined").removeClass('d-none')
                $(".DNDCombineDay").removeClass('d-none')
                $(".Detention").addClass('d-none')
                $(".Demurrage").addClass('d-none')
                if (DNDCombinedCheck == 0) {
                    $("#"+props.formNameLowerCase+"-dndcombinedday").val(10);
    
                }
            }
            else if (ApplyDND == true && DNDCombined == false) {
                $(".dndapply").val("1")
                $(".dndcombined").val("0")
                $("#"+props.formNameLowerCase+"-quickform-dndcombined").prop("checked", false);
                $(".DNDCombined").removeClass('d-none')
                $(".DNDCombineDay").addClass('d-none')
                $(".Detention").removeClass('d-none')
                $(".Demurrage").removeClass('d-none')
                if (DNDCombinedCheck == 0) {
                    $("#"+props.formNameLowerCase+"-quickform-detention").val(5);
                    $("#"+props.formNameLowerCase+"-quickform-demurrage").val(5);
                    $("#"+props.formNameLowerCase+"-detention").val(5);
                    $("#"+props.formNameLowerCase+"-demurrage").val(5);
                }
            }
            else if (ApplyDND == false) {
                $(".dndapply").val("0")
                $(".dndcombined").val("0")
                $("#"+props.formNameLowerCase+"-dndcombined").prop("checked", false);
                $(".DNDCombined").addClass('d-none')
                $(".DNDCombineDay").addClass('d-none')
                $(".Detention").addClass('d-none')
                $(".Demurrage").addClass('d-none')
    
            }
            else if (ApplyDND == true) {
                $(".dndapply").val("1")
                $(".DNDCombined").removeClass('d-none')
                $(".DNDCombineDay").removeClass('d-none')
                $(".Detention").removeClass('d-none')
                $(".Demurrage").removeClass('d-none')
    
            }
        });

        window.$(".DNDQuickForm").on("change", function () {
            var ApplyDND = $("#"+props.formNameLowerCase+"-quickform-applydnd").prop("checked");
            var DNDCombined = $("#"+props.formNameLowerCase+"-quickform-dndcombined").prop("checked");
            var DNDCombinedCheck = $("#currentDndCombinedCheck").val();
    
            if (ApplyDND == true && DNDCombined == true) {
                $(".dndapply").val("1")
                $(".dndcombined").val("1")
                $("#"+props.formNameLowerCase+"-applydnd").prop("checked", true);
                $("#"+props.formNameLowerCase+"-dndcombined").prop("checked", true);
                $(".DNDCombined").removeClass('d-none')
                $(".DNDCombineDay").removeClass('d-none')
                $(".Detention").addClass('d-none')
                $(".Demurrage").addClass('d-none')
                if (DNDCombinedCheck == 0) {
                    $("#"+props.formNameLowerCase+"-quickform-dndcombinedday").val(10);
                    $("#"+props.formNameLowerCase+"-dndcombinedday").val(10);
    
                }
            }
            else if (ApplyDND == true && DNDCombined == false) {
                $("#"+props.formNameLowerCase+"-applydnd").prop("checked", true);
                $("#"+props.formNameLowerCase+"-dndcombined").prop("checked", false);
                $(".dndapply").val("1")
                $(".dndcombined").val("0")
                $(".DNDCombined").removeClass('d-none')
                $(".DNDCombineDay").addClass('d-none')
                $(".Detention").removeClass('d-none')
                $(".Demurrage").removeClass('d-none')
                if (DNDCombinedCheck == 1) {
                    $("#"+props.formNameLowerCase+"-quickform-detention").val(5);
                    $("#"+props.formNameLowerCase+"-quickform-demurrage").val(5);
                    $("#"+props.formNameLowerCase+"-detention").val(5);
                    $("#"+props.formNameLowerCase+"-demurrage").val(5);
                }
            }
            else if (ApplyDND == false) {
                $(".dndapply").val("0")
                $(".dndcombined").val("0")
                $("#"+props.formNameLowerCase+"-applydnd").prop("checked", false);
                $("#"+props.formNameLowerCase+"-quickform-dndcombined").prop("checked", false);
                $(".DNDCombined").addClass('d-none')
                $(".DNDCombineDay").addClass('d-none')
                $(".Detention").addClass('d-none')
                $(".Demurrage").addClass('d-none')
    
            }
            else if (ApplyDND == true) {
                $(".dndapply").val("1")
                $("#"+props.formNameLowerCase+"-applydnd").prop("checked", true);
                $(".DNDCombined").removeClass('d-none')
                $(".DNDCombineDay").removeClass('d-none')
                $(".Detention").removeClass('d-none')
                $(".Demurrage").removeClass('d-none')
    
            }
        });

        window.$(document).on('show.bs.modal', '#DNDModal', function () {
            var DNDCombined = $("#"+props.formNameLowerCase+"-dndcombined").prop("checked");
            if (DNDCombined == true) {
                $("#currentDndCombinedCheck").val(1)
            }
            else {
                $("#currentDndCombinedCheck").val(0)
            }
        })


        window.$(".openModalVoyage").click(function () {
          
            var filters = {
                "POL": props.getValues(`${props.formName}[POLPortCode]`),
                "POD": props.getValues(`${props.formName}[PODPortCode]`),
                "POLReqETA": $(`input[name='${props.formName}[POLReqETA]']`).val(),
                "PODReqETA": $(`input[name='${props.formName}[PODReqETA]']`).val(),
                "DocDate": $(`input[name='${props.formName}[DocDate]']`).val(),
                "LastValidDate": $(`input[name='${props.formName}[LastValidDate]']`).val(),
            }
                
            InitVoyageModalTable({
                tableSelector: "#voyage-table",
                url: "../voyage/find-voyages",
                filter: filters,
                globalContext:props.globalContext,
                columns: [
                    { field: 'VoyageUUIDString', title: 'Voyage UUID' },
                    { field: 'VoyageNumbers', title: 'Voyage Num' },
                    { field: 'VesselCode', title: 'Vessel Code' },
                    { field: 'POLScnCode', title: 'POL SCN Code' },
                    { field: 'VesselName', title: 'Vessel' },
                    { field: 'POLet', title: 'POL ETA<br>POL ETD' },
                    { field: 'PODet', title: 'POD ETA<br>POD ETD' },
                    { field: 'POTc', title: 'POT' },
                    { field: 'POTPortCode', title: 'POT Port Code' },
                    { field: 'POTVessel', title: 'POT Vessel' },
                    { field: 'POTet', title: 'POT ETA<br>POT ETD' },
                ],
            })
            window.$("#VoyageModal").modal("toggle");
    
        });

        window.$(".voyagemodalfield").on("change", function () {
            var filters = {
                "POL": props.getValues(`${props.formName}[POLPortCode]`),
                "POD": props.getValues(`${props.formName}[PODPortCode]`),
                "POLReqETA": $(`input[name='DynamicVoyageModel[POLReqETA]']`).val(),
                "PODReqETA": $(`input[name='DynamicVoyageModel[PODReqETA]']`).val(),
                "DocDate": props.getValues(`${props.formName}[DocDate]`),
                "LastValidDate": $(`input[name='${props.formName}[LastValidDate]']`).val(),
            }
            InitVoyageModalTable({
                tableSelector: "#voyage-table",
                url: "../voyage/find-voyages",
                filter: filters,
                globalContext:props.globalContext,
                columns: [
                    { field: 'VoyageUUIDString', title: 'Voyage UUID' },
                    { field: 'VoyageNumbers', title: 'Voyage Num' },
                    { field: 'VesselCode', title: 'Vessel Code' },
                    { field: 'POLScnCode', title: 'POL SCN Code' },
                    { field: 'VesselName', title: 'Vessel' },
                    { field: 'POLet', title: 'POL ETA<br>POL ETD' },
                    { field: 'PODet', title: 'POD ETA<br>POD ETD' },
                    { field: 'POTc', title: 'POT' },
                    { field: 'POTPortCode', title: 'POT Port Code' },
                    { field: 'POTVessel', title: 'POT Vessel' },
                    { field: 'POTet', title: 'POT ETA<br>POT ETD' },
                ],
            })
    
        })

        window.$(".getVoyageSelections").click(function () {
            var selections = window.$("#voyage-table").bootstrapTable('getSelections');
            var POLSCNCode = selections[0]["POLScnCode"];
            if (POLSCNCode == null) {
                POLSCNCode = "";
            }
           
    
            var VesselCode = selections[0]["VesselCode"];
            var VesselName = selections[0]["VesselName"];
            var VoyageUUID = selections[0]["VoyageUUIDString"][0];
            var VoyageUUID = VoyageUUID.toString();
            var VoyageNumbers = selections[0]["VoyageNumbers"][0];
            var POLETA = (selections[0]["POLet"]).split("<br>");
            var PODETA = (selections[0]["PODet"]).split("<br>");
    
       
            var value0=(selections[0]["VoyageNumbers"][0]).toString();
            var lastCharVoyageNo = value0.substr(value0.length - 1); // get voyage no last character eg. A, B or W
    
            if (lastCharVoyageNo == "A") {
                VoyageUUID=VoyageUUID+"@A"
            } else if (lastCharVoyageNo == "B") {
                VoyageUUID=VoyageUUID+"@B"
            } else if (lastCharVoyageNo == "W") {
                VoyageUUID=VoyageUUID+"@W"
            }
            
            // $("#quotation-voyagenum-input").val(selections[0]["VoyageNumbers"][0] + "(" + VesselCode + ")").trigger('change.select2');
            // $(".TranshipmentCardRow").remove();
            props.remove()
            $(".transhipmentQuickForm").empty();
            if (selections[0]["VoyageUUIDString"].length > 1) {
                var TranshipmentVoyageUUID = selections[0]["VoyageUUIDString"][1];
                var TranshipmentVoyageUUID = TranshipmentVoyageUUID.toString();
                var TranshipmentPortCode = selections[0]["POT"]["PortCode"];
                var TranshipmentPortCode = TranshipmentPortCode.toString();
    
                var value1=(selections[0]["VoyageNumbers"][1]).toString();
                var lastCharVoyageNoTranshipment = value1.substr(value1.length - 1); // get voyage no last character eg. A, B or W
    
                if (lastCharVoyageNoTranshipment == "A") {
                    TranshipmentVoyageUUID=TranshipmentVoyageUUID+"@A"
                } else if (lastCharVoyageNoTranshipment == "B") {
                    TranshipmentVoyageUUID=TranshipmentVoyageUUID+"@B"
                } else if (lastCharVoyageNoTranshipment == "W") {
                    TranshipmentVoyageUUID=TranshipmentVoyageUUID+"@W"
                }
              
                var POTET = selections[0]["POTet"].split("<br>")
                var POTETA = POTET[0]
                var POTETD = POTET[1]
                if(selections[0]["POT"]['POTTerminal']){
                    var tempArray = {
                        optionFromVoyage:[{value:selections[0]["Voyage"]["VoyageUUIDs"][0],label:selections[0]["Voyage"]["VoyageNumbers"][0]+"("+selections[0]["VesselCode"]+")"}],
                        optionToVoyage:[{value:selections[0]["Voyage"]["VoyageUUIDs"][1],label:selections[0]["Voyage"]["VoyageNumbers"][1]+"("+selections[0]["POT"]["POTVesselName"]+")"}],
                        optionAgentBranchCode:[{value:selections[0]["POT"]['POTTerminal']['handlingCompanyBranch']['CompanyBranchUUID'],label:selections[0]["POT"]['POTTerminal']['handlingCompanyBranch']['BranchCode']+"("+selections[0]["POT"]['POTTerminal']['PortName']+")"}],
                        optionAgentCompany:[{value:selections[0]["POT"]['POTTerminal']['handlingCompany']['CompanyUUID'],label:selections[0]["POT"]['POTTerminal']['handlingCompany']['CompanyName']}],
                        optionTerminal:[{value:selections[0]["POT"]['POTTerminal']["PortDetailsUUID"],label:selections[0]["POT"]['POTTerminal']["PortName"]}],
                        Area:selections[0]["POT"]["POTAreaName"],
                        DischargingDate: POTETA,
                        FromVesselCode:selections[0]["VesselCode"],
                        FromVesselName:selections[0]["VesselName"],
                        FromVoyageName:selections[0]["Voyage"]["VoyageNumbers"][0],
                        FromVoyageNum:selections[0]["Voyage"]["VoyageUUIDs"][0],
                        FromVoyagePOT:selections[0]["Voyage"]["VoyageScheduleUUIDs"][0],
                        LoadingDate:POTETD,
                        LocationCode:selections[0]["POT"]['POTTerminal']['PortDetailsUUID'],
                        LocationName:selections[0]["POT"]['POTTerminal']['LocationCode'],
                        POTHandlingCompanyCode:selections[0]["POT"]['POTTerminal']['handlingCompany']['CompanyUUID'],
                        POTHandlingCompanyROC:selections[0]["POT"]['POTTerminal']['handlingCompany']['AgentCode'],
                        POTHandlingOfficeCode:selections[0]["POT"]['POTTerminal']['handlingCompanyBranch']['CompanyBranchUUID'],
                        POTHandlingOfficeName:selections[0]["POT"]['POTTerminal']['handlingCompanyBranch']['BranchName'],
                        PortCode:selections[0]["POTPortCode"],
                        QuickFormPOTVoyage:selections[0]["Voyage"]["VoyageScheduleUUIDs"][0],
                        QuickFormPortCode:selections[0]["POTPortCode"],
                        QuotationHasTranshipmentUUID:"",
                        ToVesselCode:selections[0]["POT"]["POTVesselName"],
                        ToVesselName:selections[0]["POT"]["POTVesselName"],
                        ToVoyageName:selections[0]["Voyage"]["VoyageNumbers"][1],
                        ToVoyageNum:selections[0]["Voyage"]["VoyageUUIDs"][1],
                        ToVoyagePOT:selections[0]["Voyage"]["VoyageScheduleUUIDs"][1],
                    }
                }else{
                    var tempArray = {
                        optionFromVoyage:[{value:selections[0]["Voyage"]["VoyageUUIDs"][0],label:selections[0]["Voyage"]["VoyageNumbers"][0]+"("+selections[0]["VesselCode"]+")"}],
                        optionToVoyage:[{value:selections[0]["Voyage"]["VoyageUUIDs"][1],label:selections[0]["Voyage"]["VoyageNumbers"][1]+"("+selections[0]["POT"]["POTVesselName"]+")"}],
                        optionAgentBranchCode:[],
                        optionAgentCompany:[],
                        optionTerminal:[],
                        Area:selections[0]["POT"]["POTAreaName"],
                        DischargingDate: POTETA,
                        FromVesselCode:selections[0]["VesselCode"],
                        FromVesselName:selections[0]["VesselName"],
                        FromVoyageName:selections[0]["Voyage"]["VoyageNumbers"][0],
                        FromVoyageNum:selections[0]["Voyage"]["VoyageUUIDs"][0],
                        FromVoyagePOT:selections[0]["Voyage"]["VoyageScheduleUUIDs"][0],
                        LoadingDate:POTETD,
                        LocationCode:"",
                        LocationName:"",
                        POTHandlingCompanyCode:"",
                        POTHandlingCompanyROC:"",
                        POTHandlingOfficeCode:"",
                        POTHandlingOfficeName:"",
                        PortCode:selections[0]["POTPortCode"],
                        QuickFormPOTVoyage:selections[0]["Voyage"]["VoyageScheduleUUIDs"][0],
                        QuickFormPortCode:selections[0]["POTPortCode"],
                        QuotationHasTranshipmentUUID:"",
                        ToVesselCode:selections[0]["POT"]["POTVesselName"],
                        ToVesselName:selections[0]["POT"]["POTVesselName"],
                        ToVoyageName:selections[0]["Voyage"]["VoyageNumbers"][1],
                        ToVoyageNum:selections[0]["Voyage"]["VoyageUUIDs"][1],
                        ToVoyagePOT:selections[0]["Voyage"]["VoyageScheduleUUIDs"][1],
                    }
                }
                formContext.FieldArrayHandle("append",tempArray)        
                
            } else {
                const tempVoyage = [{value:VoyageUUID, label:VoyageNumbers+" ("+selections[0]["VesselCode"]+")"}]
                formContext.setStateHandle(tempVoyage,"VoyageNum")
                formContext.setStateHandle(tempVoyage,"QuickFormVoyageNum")
                props.setValue("DynamicModel[VoyageNum]",VoyageUUID)
                props.setValue(`${props.formName}[VoyageNum]`,VoyageUUID)
                $(`#${props.formNameLowerCase}-insisttranshipment`).prop("checked", false);
                $(`#${props.formNameLowerCase}-insisttranshipment`).val(0);
                $(`input[name='${props.formName}[InsistTranshipment]'`).val(0);
                FindVoyageNumberDetail(tempVoyage)
            }
    
        
            window.$("#VoyageModal").modal("toggle");
        })

        function FindVoyageNumberDetail(val) {
            var regExp = /\(([^)]+)\)/;
        
        
            if ($(".transhipment-item").length < 1) {
                var value = val[0].value
                var result;
                var insideBracketVessel;
                var vesselCode;
                var text = val[0].label
                var matches = regExp.exec(text);

                if (value.includes("@", 1)) {
                    result = value.slice(0, -2);
                } else {
                    result = value
                }
             
                $.each(matches, function (key, value) {
                    if (key == 0) {
                        insideBracketVessel = value;
                    } else if (key == 1) {
                        vesselCode = value;
                    }
                })
                
                var voyageNo = text.replace(insideBracketVessel, '');
                var StrvoyageNo = voyageNo.replace(/\s/g, '');
                var lastCharVoyageNo = value.substr(value.length - 1); // get voyage no last character eg. A, B or W
                var getPolPortcode = props.getValues(`${props.formName}[POLPortCode]`)
                var getPodPortcode = props.getValues(`${props.formName}[PODPortCode]`)
                var repeatedVoyage = 0;
        
                if (lastCharVoyageNo == "A") {
                    repeatedVoyage = 1
                } else if (lastCharVoyageNo == "B") {
                    repeatedVoyage = 2
                } else if (lastCharVoyageNo == "W") {
                    repeatedVoyage = 1
                }
                $("input[data-target=\'VoyageName-Voyage\']").val(StrvoyageNo);
        
                getVoyageByIdSpecial(result,props.globalContext).then(data => {
      
                        var foundPOL = false;
                        var foundPOD = false;
        
                        if (value !== "") {
                            props.setValue("DynamicModel[VoyageNum]",value)
    
                            $.each(data, function (key, value) {
                                if (value.VoyageNumber == StrvoyageNo) {
                                    var countPOL = 0;
                                    var countPOD = 0;
                                    var countLocation = 0;
                                    $.each(value.voyageSchedules, function (key2, value2) {
                                        if (getPolPortcode == value2.PortCode) {
        
                                            if (countPOL == repeatedVoyage) {
                                                $("input[data-target=\'closingDateTime\']").val(value2.ClosingDateTime)
                                                $("input[data-target=\'POLSCNCode-Voyage\']").val(value2.SCNCode);
                                                $("input[data-target=\'poleta\']").val(value2.ETA);
                                                $("input[data-target=\'poletd\']").val(value2.ETD);
                                                $(`#${props.formNameLowerCase}-pollocationcode`).val(value2.LocationCode).trigger("change");
                                                $(`#${props.formNameLowerCase}-voyage-pol`).val(value2.VoyageScheduleUUID)
                                                foundPOL = true;
        
                                            }
                                            countPOL++;
        
                                        }
        
                                        if (getPodPortcode == value2.PortCode && foundPOL && foundPOD == false) {
      
                                            $("input[data-target=\'PODSCNCode-Voyage\']").val(value2.SCNCode);
                                            $("input[data-target=\'podeta\']").val(value2.ETA);
                                            $("input[data-target=\'podetd\']").val(value2.ETD);
                                            $(`#${props.formNameLowerCase}-podlocationcode`).val(value2.LocationCode).trigger("change")
                                            $(`#${props.formNameLowerCase}-voyage-pod`).val(value2.VoyageScheduleUUID)
        
                                            countPOD++;
                                            foundPOD = true;
                                        }
        
                                        countLocation++;
                                    })
                                    $("input[data-target=\'VesselName-Voyage\']").val(value.vessel.VesselName);
                                    $("input[data-target=\'VesselCode-Voyage\']").val(value.vessel.VesselCode);
                                }
                            })
                        } else {
                            props.setValue("DynamicModel[VoyageNum]","")
                            $("input[data-target=\'VesselCode-Voyage\']").val("");
                            $("input[data-target=\'VesselName-Voyage\']").val("");
                            $("input[data-target=\'VoyageName-Voyage\']").val("");
                            $("input[data-target=\'POLSCNCode-Voyage\']").val("");
                            $("input[data-target=\'PODSCNCode-Voyage\']").val("");
                            $("input[data-target=\'poleta\']").val("");
                            $("input[data-target=\'poletd\']").val("");
                            $("input[data-target=\'podeta\']").val("");
                            $("input[data-target=\'podetd\']").val("");
                            $("input[data-target=\'closingDateTime\']").val("");
                        }
        
        
                        if (foundPOL == false) {
                            $("input[data-target=\'POLSCNCode-Voyage\']").val("");
                            $("input[data-target=\'poleta\']").val("");
                            $("input[data-target=\'poletd\']").val("");
                            $("input[data-target=\'closingDateTime\']").val("");
                        }
                        if (foundPOD == false) {
        
                            // alert("POD Port Code Not Available for Selected Voyage")
                            $("input[data-target=\'PODSCNCode-Voyage\']").val("");
                            $("input[data-target=\'podeta\']").val("");
                            $("input[data-target=\'podetd\']").val("");
                        }
        
                        if($("#dynamicmodel-voyagenum").val()!=""){
                            $("#dynamicmodel-voyagenum").parent().find(".select2-container--default").removeClass('InvalidField')
                            $("#dynamicmodel-voyagenum").parent().parent().find('.help-block').text("")
                        }
        
                    
                })
        
            }
        }

        // window.$(document).on("click", ".ChargesDisplay", function () {

        //     var icon = $(this).find("i");
    
        //     if ($(this).closest("tr").next().hasClass("d-none")) {
        //         icon.addClass("fa fa-minus").removeClass("fa fa-plus");
        //         $(this).closest("tr").next().removeClass('d-none');
        //     }
        //     else {
        //         icon.addClass("fa fa-plus").removeClass("fa fa-minus");
        //         $(this).closest("tr").next().addClass('d-none');
        //     }
        // })

        window.$(document).on("change", ".TextMarks", function () {

            $(this).closest("td").find(".MarkReadonly").val($(this).val())
        })
    
        window.$(document).on("change", ".TextGoods", function () {
    
            $(this).closest("td").find(".GoodDescriptionReadonly").val($(this).val())
        })

        window.$(document).on("change", ".ParentChargesText", function () {

            $(this).closest("td").find(".ParentChargesDescriptionReadonly").val($(this).val())
        })

        window.$('.columnchooserdropdown .dropdown-menu').click(function (event) {
            event.stopPropagation();
        });

        window.$(document).on("blur", ".inputDecimalTwoPlaces", function () {
            if (this.value != "") {
                this.value = parseFloat(this.value).toFixed(2);
            }
        });

        window.$(document).on("blur", ".inputDecimalFourPlaces", function () {
            if (this.value != "") {
                this.value = parseFloat(this.value).toFixed(4);
            }
        });

        window.$(document).on("blur", ".inputDecimalThreePlaces", function () {
            if (this.value != "") {
                this.value = parseFloat(this.value).toFixed(3);
            }
        });

        return () => {
        }
    }, [])
    
}

export default ShareInitialize
