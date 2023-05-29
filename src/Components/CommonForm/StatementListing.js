import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext"
import { GetUserDetails, ToastNotify, ControlOverlay, getCompanyBranches,getCookie, initHoverSelectDropownTitle, GetCreditTerm,sortArray } from '../../Components/Helper.js'
import Select from 'react-select'
import AsyncSelect from 'react-select/async';
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/flatpickr.min.css";
import moment from "moment";
import $, { each } from "jquery";
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useLocation,
    useParams,
    useNavigate
} from "react-router-dom";


function StatementListing(props) {
    const { state } = useLocation();
    const [formState, setFormState] = useState({ formType: "New" });
    const globalContext = useContext(GlobalContext);
    const params = useParams();
    const navigate = useNavigate();
    var arrayLatestColumn=[];

    const [defaultCompanyState, setDefaultCompanyState] = useState(null)
    const [branch, setBranch] = useState([])
    const [creditTerm, setCreditTerm] = useState([])
    const [previewAccess, setPreviewAccess] = useState([])

    const modelLinkTemp = props.data.modelLink


    function handleGenerateCustomerStatement() {
        var StartDate = getValues("DynamicModel[StartDate]")
        var EndDate = getValues("DynamicModel[EndDate]")

        var Company = $("input[name='DynamicModel[Company]").val()
        var Branch = getValues("DynamicModel[Branch]")
        if ($("#dueCheckbox").prop("checked")) {
            var Due1 = 1;
        }
        else {
            var Due1 = 0;
        }

        var defaultHide = [ // default field to hide in bootstrap table
        ];

        var columns = [ // data from controller (actionGetCompanyType) field and title to be included
            {
                field: 'DocDate',
                title: 'Doc Date.',
                filterControl: "input"
            },
            {
                field: 'DocNum',
                title: 'Doc Num',
                filterControl: "input"
            },
            {
                field: 'Type',
                title: 'Type',
                filterControl: "input"
            },
            {
                field: 'VoyageVessel',
                title: 'Vessel/Voyage',
                filterControl: "input"
            },
            {
                field: 'BLNo',
                title: 'BL No.',
                filterControl: "input"
            },
            {
                field: 'Debit',
                title: 'Debit',
                filterControl: "input"
            },
            {
                field: 'Credit',
                title: 'Credit',
                filterControl: "input"
            },
            {
                field: 'Balance',
                title: 'Balance',
                filterControl: "input"
            },
            {
                field: 'Due',
                title: 'Due(Days)',
                filterControl: "input"
            },
        ];

        $("#StatementOfAccountTable").empty();
        $("#StatementOfAccountTable").removeClass("d-none");
        // $("#StatementOfAccountTable").append(
        //     "<thead>\
        //       <tr id='head'>\
        //           <th>Doc Date</th>\
        //           <th>Doc No</th>\
        //           <th>Type</th>\
        //           <th>Vessel/Voyage</th>\
        //           <th>BL No.</th>\
        //           <th>Debit</th>\
        //           <th>Credit</th>\
        //           <th>Balance</th>\
        //           <th>Due(Days)</th>\
        //       </tr>\
        //   </thead>\
        //   <tbody id='body'>\
        //   </tbody>"
        // )


        $("#AgingAnalysisTable").empty();
        $("#AgingAnalysisTable").removeClass("d-none");
        $("#AgingAnalysisTable").append(
            "<thead>\
              <tr>\
                <th style='text-align: center;' colspan='7'>AGING ANALYSIS</th>\
              </tr>\
              <tr id='headAnalysis'>\
                  <th><1 MTHS</th>\
                  <th>1 MTHS/+ </th>\
                  <th>2 MTHS/+ </th>\
                  <th>3 MTHS/+ </th>\
                  <th>4 MTHS/+</th>\
                  <th>5 MTHS/+</th>\
                  <th>6 MTHS/+</th>\
              </tr>\
          </thead>\
          <tbody id='bodyAnalysis'>\
          </tbody>"
        )

        var TableDataList = []

        $.ajax({
            url: globalContext.globalHost + globalContext.globalPathLink + "statement-of-account/generate-report?StartDate=" + StartDate + "&EndDate=" + EndDate + "&Company=" + Company + "&Branch=" + Branch,
            type: "POST",
            dataType: "json",
            headers: {
                "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
            },
            success: function (data) {
                var AllDocuments = [];

                var CustomerPaymentDocuments = [];
                var SalesCreditNoteDocuments = [];
                var SalesInvoiceDocuments = [];
                var SalesInvoiceDocumentsBalance = [];
                var SalesDebitNoteDocuments = [];

                var TotalCustomerPayment = 0.0000
                var TotalCreditNote = 0.0000
                var TotalDebitNote = 0.0000
                var TotalInvoice = 0.0000
                var TotalMonth = 0.0000
                var TotalMonth1 = 0.0000
                var TotalMonth2 = 0.0000
                var TotalMonth3 = 0.0000
                var TotalMonth4 = 0.0000
                var TotalMonth5 = 0.0000
                var TotalMonth6 = 0.0000


                var BillOfLadings = data.data.BillOfLadings
                var CustomerPayment = data.data.CustomerPayment
                var SalesCreditNote = data.data.SalesCreditNote
                var SalesDebitNote = data.data.SalesDebitNote
                var SalesInvoice = data.data.SalesInvoice

                var PreviousSalesInvoiceAmount = data.data.PreviousSalesInvoiceAmount == null ? 0 : data.data.PreviousSalesInvoiceAmount
                var PreviousSalesDebitNote = data.data.PreviousSalesDebitNote == null ? 0 : data.data.PreviousSalesDebitNote
                var PreviousSalesCreditNote = data.data.PreviousSalesCreditNote == null ? 0 : data.data.PreviousSalesCreditNote
                var PreviousCustomerPayment = data.data.PreviousCustomerPayment == null ? 0 : data.data.PreviousCustomerPayment

                var PreviousBalance = (parseFloat(PreviousSalesInvoiceAmount) + parseFloat(PreviousSalesDebitNote)) - parseFloat(PreviousSalesCreditNote) - parseFloat(PreviousCustomerPayment)




                BillOfLadings.sort(function (a, b) {
                    var momentA = moment(a.DocDate, "DD/MM/YYYY");
                    var momentB = moment(b.DocDate, "DD/MM/YYYY");
                    return momentA - momentB
                });

                CustomerPayment.sort(function (a, b) {
                    var momentA = moment(a.DocDate, "DD/MM/YYYY");
                    var momentB = moment(b.DocDate, "DD/MM/YYYY");
                    return momentA - momentB
                });

                SalesCreditNote.sort(function (a, b) {
                    var momentA = moment(a.DocDate, "DD/MM/YYYY");
                    var momentB = moment(b.DocDate, "DD/MM/YYYY");
                    return momentA - momentB
                });

                SalesDebitNote.sort(function (a, b) {
                    var momentA = moment(a.DocDate, "DD/MM/YYYY");
                    var momentB = moment(b.DocDate, "DD/MM/YYYY");
                    return momentA - momentB
                });

                SalesInvoice.sort(function (a, b) {
                    var momentA = moment(a.DocDate, "DD/MM/YYYY");
                    var momentB = moment(b.DocDate, "DD/MM/YYYY");
                    return momentA - momentB
                });


                $.each(SalesInvoice, function (key1, value1) {
                    var foundInvoice = false;
                    if (value1.VerificationStatus == "Approved" && value1.Valid == "1") {
                        var CreditTermType = creditTerm.filter(function (element) {
                            return element.CreditTermUUID == value1.CreditTerm;
                        });

                        $.each(value1.salesInvoiceHasCharges, function (key2, value2) {

                            if (value2.BillOfLading == null && foundInvoice == false) {
                                foundInvoice = true;
                                var Debit = parseFloat(value1.TotalAmount).toFixed(4)

                                var Credit = 0.0000;

                                TotalInvoice = 0.0000;
                                TotalInvoice = (parseFloat(TotalInvoice) + parseFloat(Debit))






                                var Start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                var FinalDueDate = moment(Start, "DD-MM-YYYY").add((CreditTermType[0]["Day"]) - 1, 'days').format("DD-MM-YYYY");



                                var start = moment(new Date()).format("DD-MM-YYYY")
                                var end = FinalDueDate;

                                var start2 = moment(start, "DD-MM-YYYY");
                                var end2 = moment(end, "DD-MM-YYYY");

                                var Due = moment.duration(start2.diff(end2)).asDays();

                                var End2 = moment(moment($("#dynamicmodel-enddate").val(), "DD-MM-YYYY").format("DD-MM-YYYY"), "DD-MM-YYYY")
                                var Start2 = moment(moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), "DD-MM-YYYY")


                                var Due2 = moment.duration(End2.diff(Start2)).asDays() + 1;


                                if (CreditTermType[0]["CreditTerm"] == "CASH") {

                                    var start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                    var end = moment(new Date()).format("DD-MM-YYYY");
                                    var start2 = moment(start, "DD-MM-YYYY");
                                    var end2 = moment(end, "DD-MM-YYYY");


                                    Due = Due2

                                    if (Due1) {
                                        if (Due > 0) {
                                            AllDocuments.push(
                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: Credit, Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                            );

                                            SalesInvoiceDocuments.push(
                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: Credit, Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                            );
                                        }
                                        else {

                                        }
                                    }
                                    else {
                                        AllDocuments.push(
                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: Credit, Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                        );

                                        SalesInvoiceDocuments.push(
                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: Credit, Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                        );
                                    }


                                }
                                else {
                                    Due = Due2 - CreditTermType[0]["Day"]
                                    if (Due1) {

                                        if (Due > 0) {

                                            AllDocuments.push(
                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: Credit, Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                            );

                                            SalesInvoiceDocuments.push(
                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: Credit, Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                            );
                                        } else {

                                        }
                                    } else {

                                        AllDocuments.push(
                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: Credit, Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                        );

                                        SalesInvoiceDocuments.push(
                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: Credit, Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                        );
                                    }


                                }



                            } else {
                                $.each(BillOfLadings, function (key, value) {
                                    if (value.BillOfLadingUUID == value2.BillOfLading && foundInvoice == false) {
                                        foundInvoice = true;
                                        var Debit = parseFloat(value1.TotalAmount).toFixed(4)
                                        var Credit = 0.0000;
                                        TotalInvoice = 0.0000;
                                        TotalInvoice = (parseFloat(TotalInvoice) + parseFloat(Debit))
                                        var Start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                        var FinalDueDate = moment(Start, "DD-MM-YYYY").add((CreditTermType[0]["Day"]) - 1, 'days').format("DD-MM-YYYY");



                                        var start = moment(new Date()).format("DD-MM-YYYY")
                                        var end = FinalDueDate;

                                        var start2 = moment(start, "DD-MM-YYYY");
                                        var end2 = moment(end, "DD-MM-YYYY");

                                        var Due = moment.duration(start2.diff(end2)).asDays();

                                        var End2 = moment(moment($("#dynamicmodel-enddate").val(), "DD-MM-YYYY").format("DD-MM-YYYY"), "DD-MM-YYYY")
                                        var Start2 = moment(moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), "DD-MM-YYYY")


                                        var Due2 = moment.duration(End2.diff(Start2)).asDays() + 1

                                        if (CreditTermType[0]["CreditTerm"] == "CASH") {

                                            var start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                            var end = moment(new Date()).format("DD-MM-YYYY");
                                            var start2 = moment(start, "DD-MM-YYYY");
                                            var end2 = moment(end, "DD-MM-YYYY");



                                            var Due = Due2
                                            if (Due1) {
                                                if (Due > 0) {
                                                    AllDocuments.push(
                                                        { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: value.VesselName + "/" + value.VoyageName, BLNo: value.DocNum, Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: value.BillOfLadingUUID, CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                                    );

                                                    SalesInvoiceDocuments.push(
                                                        { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: value.VesselName + "/" + value.VoyageName, BLNo: value.DocNum, Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: value.BillOfLadingUUID, CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                                    );
                                                } else {

                                                }
                                            } else {
                                                AllDocuments.push(
                                                    { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: value.VesselName + "/" + value.VoyageName, BLNo: value.DocNum, Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: value.BillOfLadingUUID, CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                                );

                                                SalesInvoiceDocuments.push(
                                                    { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: value.VesselName + "/" + value.VoyageName, BLNo: value.DocNum, Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: value.BillOfLadingUUID, CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                                );
                                            }



                                        }
                                        else {
                                            Due = Due2 - CreditTermType[0]["Day"]
                                            if (Due1) {
                                                if (Due > 0) {
                                                    AllDocuments.push(
                                                        { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: value.VesselName + "/" + value.VoyageName, BLNo: value.DocNum, Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: value.BillOfLadingUUID, CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                                    );

                                                    SalesInvoiceDocuments.push(
                                                        { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: value.VesselName + "/" + value.VoyageName, BLNo: value.DocNum, Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: value.BillOfLadingUUID, CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                                    );
                                                } else {

                                                }
                                            } else {
                                                AllDocuments.push(
                                                    { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: value.VesselName + "/" + value.VoyageName, BLNo: value.DocNum, Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: value.BillOfLadingUUID, CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                                );

                                                SalesInvoiceDocuments.push(
                                                    { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: value.VesselName + "/" + value.VoyageName, BLNo: value.DocNum, Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: value.BillOfLadingUUID, CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                                );
                                            }
                                        }

                                    }
                                })
                            }

                        })
                    }

                })

                $.each(SalesCreditNote, function (key1, value1) {
                    var foundCreditNote = false;
                    if (value1.VerificationStatus == "Approved" && value1.Valid == "1") {
                        var CreditTermType = creditTerm.filter(function (element) {
                            return element.CreditTermUUID == value1.CreditTerm;
                        });
                        $.each(value1.salesCreditNoteHasItems, function (key2, value2) {

                            if (value2.BillOfLading == null && foundCreditNote == false) {
                                foundCreditNote = true;
                                var Debit = 0.0000
                                var Credit = parseFloat(value1.TotalAmount).toFixed(4)
                                TotalCreditNote = 0.0000;
                                TotalCreditNote = (parseFloat(TotalCreditNote) + parseFloat(Credit))




                                var Start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                var FinalDueDate = moment(Start, "DD-MM-YYYY").add((CreditTermType[0]["Day"]) - 1, 'days').format("DD-MM-YYYY");



                                var start = moment(new Date()).format("DD-MM-YYYY")
                                var end = FinalDueDate;

                                var start2 = moment(start, "DD-MM-YYYY");
                                var end2 = moment(end, "DD-MM-YYYY");

                                var Due = moment.duration(start2.diff(end2)).asDays();

                                var End2 = moment(moment($("#dynamicmodel-enddate").val(), "DD-MM-YYYY").format("DD-MM-YYYY"), "DD-MM-YYYY")
                                var Start2 = moment(moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), "DD-MM-YYYY")

                                var Due2 = moment.duration(End2.diff(Start2)).asDays() + 1;

                                if (CreditTermType[0]["CreditTerm"] == "CASH") {

                                    var start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                    var end = moment(new Date()).format("DD-MM-YYYY");
                                    var start2 = moment(start, "DD-MM-YYYY");
                                    var end2 = moment(end, "DD-MM-YYYY");

                                    Due = Due2


                                    if (Due1) {
                                        if (Due > 0) {
                                            AllDocuments.push(
                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );

                                            SalesCreditNoteDocuments.push(
                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );
                                        }
                                        else {

                                        }
                                    }
                                    else {
                                        AllDocuments.push(
                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                        );

                                        SalesCreditNoteDocuments.push(
                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                        );
                                    }


                                }
                                else {
                                    Due = Due2 - CreditTermType[0]["Day"]
                                    if (Due1) {

                                        if (Due > 0) {

                                            AllDocuments.push(
                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );

                                            SalesCreditNoteDocuments.push(
                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );
                                        } else {

                                        }
                                    } else {

                                        AllDocuments.push(
                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                        );

                                        SalesCreditNoteDocuments.push(
                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                        );
                                    }


                                }

                            }
                            else {
                                $.each(data.data.SalesInvoice, function (key3, value3) {
                                    foundCreditNote = true;
                                    var Debit = 0.0000
                                    TotalCreditNote = 0.0000;
                                    var Credit = parseFloat(value1.TotalAmount).toFixed(4)
                                    TotalCreditNote = (parseFloat(TotalCreditNote) + parseFloat(Credit))




                                    var Start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                    var FinalDueDate = moment(Start, "DD-MM-YYYY").add((CreditTermType[0]["Day"]) - 1, 'days').format("DD-MM-YYYY");



                                    var start = moment(new Date()).format("DD-MM-YYYY")
                                    var end = FinalDueDate;

                                    var start2 = moment(start, "DD-MM-YYYY");
                                    var end2 = moment(end, "DD-MM-YYYY");

                                    var Due = moment.duration(start2.diff(end2)).asDays();

                                    var End2 = moment(moment($("#dynamicmodel-enddate").val(), "DD-MM-YYYY").format("DD-MM-YYYY"), "DD-MM-YYYY")
                                    var Start2 = moment(moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), "DD-MM-YYYY")


                                    var Due2 = moment.duration(End2.diff(Start2)).asDays() + 1;

                                    if (CreditTermType[0]["CreditTerm"] == "CASH") {

                                        var start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                        var end = moment(new Date()).format("DD-MM-YYYY");
                                        var start2 = moment(start, "DD-MM-YYYY");
                                        var end2 = moment(end, "DD-MM-YYYY");

                                        Due = Due2


                                        if (Due1) {
                                            if (Due > 0) {
                                                AllDocuments.push(
                                                    { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                                );

                                                SalesCreditNoteDocuments.push(
                                                    { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                                );
                                            }
                                            else {

                                            }
                                        }
                                        else {
                                            AllDocuments.push(
                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );

                                            SalesCreditNoteDocuments.push(
                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );
                                        }


                                    }
                                    else {
                                        Due = Due2 - CreditTermType[0]["Day"]
                                        if (Due1) {

                                            if (Due > 0) {

                                                AllDocuments.push(
                                                    { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                                );

                                                SalesCreditNoteDocuments.push(
                                                    { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                                );
                                            } else {

                                            }
                                        } else {

                                            AllDocuments.push(
                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );

                                            SalesCreditNoteDocuments.push(
                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );
                                        }


                                    }
                                })
                            }

                        })
                    }
                })
                //remove duplicates documents;
                SalesCreditNoteDocuments = Array.from(SalesCreditNoteDocuments.reduce((a, o) => a.set(o.DocNum, o), new Map()).values());

                $.each(SalesDebitNote, function (key1, value1) {
                    var foundDebitNote = false;
                    if (value1.VerificationStatus == "Approved" && value1.Valid == "1") {
                        var CreditTermType = creditTerm.filter(function (element) {
                            return element.CreditTermUUID == value1.CreditTerm;
                        });
                        $.each(value1.salesDebitNoteHasItems, function (key2, value2) {

                            if (value2.BillOfLading == null && foundDebitNote == false) {

                                foundDebitNote = true;
                                var Debit = 0.0000
                                var Debit = parseFloat(value1.TotalAmount).toFixed(4)
                                TotalDebitNote = 0.0000
                                TotalDebitNote = (parseFloat(TotalDebitNote) + parseFloat(Debit))




                                var Start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                var FinalDueDate = moment(Start, "DD-MM-YYYY").add((CreditTermType[0]["Day"]) - 1, 'days').format("DD-MM-YYYY");



                                var start = moment(new Date()).format("DD-MM-YYYY")
                                var end = FinalDueDate;

                                var start2 = moment(start, "DD-MM-YYYY");
                                var end2 = moment(end, "DD-MM-YYYY");

                                var Due = moment.duration(start2.diff(end2)).asDays();

                                var End2 = moment(moment($("#dynamicmodel-enddate").val(), "DD-MM-YYYY").format("DD-MM-YYYY"), "DD-MM-YYYY")
                                var Start2 = moment(moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), "DD-MM-YYYY")


                                var Due2 = moment.duration(End2.diff(Start2)).asDays() + 1;

                                if (CreditTermType[0]["CreditTerm"] == "CASH") {

                                    var start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                    var end = moment(new Date()).format("DD-MM-YYYY");
                                    var start2 = moment(start, "DD-MM-YYYY");
                                    var end2 = moment(end, "DD-MM-YYYY");

                                    Due = Due2


                                    if (Due1) {
                                        if (Due > 0) {
                                            AllDocuments.push(
                                                { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );

                                            SalesDebitNoteDocuments.push(
                                                { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );
                                        }
                                        else {

                                        }
                                    }
                                    else {
                                        AllDocuments.push(
                                            { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                        );

                                        SalesDebitNoteDocuments.push(
                                            { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                        );
                                    }


                                }
                                else {
                                    Due = Due2 - CreditTermType[0]["Day"]
                                    if (Due1) {

                                        if (Due > 0) {

                                            AllDocuments.push(
                                                { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );

                                            SalesDebitNoteDocuments.push(
                                                { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );
                                        } else {

                                        }
                                    } else {

                                        AllDocuments.push(
                                            { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                        );

                                        SalesDebitNoteDocuments.push(
                                            { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                        );
                                    }


                                }

                            }
                            else {
                                $.each(data.data.SalesInvoice, function (key3, value3) {
                                    foundDebitNote = true;
                                    var Debit = 0.0000
                                    TotalDebitNote = 0.0000
                                    var Debit = parseFloat(value1.TotalAmount).toFixed(4)
                                    TotalDebitNote = (parseFloat(TotalDebitNote) + parseFloat(Debit))




                                    var Start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                    var FinalDueDate = moment(Start, "DD-MM-YYYY").add((CreditTermType[0]["Day"]) - 1, 'days').format("DD-MM-YYYY");



                                    var start = moment(new Date()).format("DD-MM-YYYY")
                                    var end = FinalDueDate;

                                    var start2 = moment(start, "DD-MM-YYYY");
                                    var end2 = moment(end, "DD-MM-YYYY");

                                    var Due = moment.duration(start2.diff(end2)).asDays();
                                    var End2 = moment(moment($("#dynamicmodel-enddate").val(), "DD-MM-YYYY").format("DD-MM-YYYY"), "DD-MM-YYYY")
                                    var Start2 = moment(moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), "DD-MM-YYYY")


                                    var Due2 = moment.duration(End2.diff(Start2)).asDays() + 1;

                                    if (CreditTermType[0]["CreditTerm"] == "CASH") {

                                        var start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                        var end = moment(new Date()).format("DD-MM-YYYY");
                                        var start2 = moment(start, "DD-MM-YYYY");
                                        var end2 = moment(end, "DD-MM-YYYY");

                                        Due = Due2


                                        if (Due1) {
                                            if (Due > 0) {
                                                AllDocuments.push(
                                                    { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                                );

                                                SalesDebitNoteDocuments.push(
                                                    { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                                );
                                            }
                                            else {

                                            }
                                        }
                                        else {
                                            AllDocuments.push(
                                                { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );

                                            SalesDebitNoteDocuments.push(
                                                { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );
                                        }


                                    }
                                    else {
                                        Due = Due2 - CreditTermType[0]["Day"]
                                        if (Due1) {

                                            if (Due > 0) {

                                                AllDocuments.push(
                                                    { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                                );

                                                SalesDebitNoteDocuments.push(
                                                    { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                                );
                                            } else {

                                            }
                                        } else {

                                            AllDocuments.push(
                                                { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );

                                            SalesDebitNoteDocuments.push(
                                                { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );
                                        }


                                    }
                                })
                            }

                        })
                    }
                })
                //remove duplicates documents
                SalesDebitNoteDocuments = Array.from(SalesDebitNoteDocuments.reduce((a, o) => a.set(o.DocNum, o), new Map()).values());

                $.each(CustomerPayment, function (key1, value1) {

                    var foundCustomerPayment = false;
                    if (value1.VerificationStatus == "Approved" && value1.Valid == "1") {

                        var CreditTermType = creditTerm.filter(function (element) {
                            return element.CreditTermUUID == value1.CreditTerm;
                        });


                        $.each(value1.customerPaymentHasInvoices, function (key, value) {
                            if (value.SalesInvoice == null) {
                                $.each(SalesDebitNoteDocuments, function (key2, value2) {

                                    if (value2.DebitNoteUUID == value.DebitNote) {

                                        if (value2.BLNo !== "") {
                                            var Start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                            var FinalDueDate = moment(Start, "DD-MM-YYYY").add((CreditTermType[0]["Day"]) - 1, 'days').format("DD-MM-YYYY");



                                            var start = moment(new Date()).format("DD-MM-YYYY")
                                            var end = FinalDueDate;

                                            var start2 = moment(start, "DD-MM-YYYY");
                                            var end2 = moment(end, "DD-MM-YYYY");

                                            var Due = moment.duration(start2.diff(end2)).asDays();

                                            var End2 = moment(moment($("#dynamicmodel-enddate").val(), "DD-MM-YYYY").format("DD-MM-YYYY"), "DD-MM-YYYY")
                                            var Start2 = moment(moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), "DD-MM-YYYY")


                                            var Due2 = moment.duration(End2.diff(Start2)).asDays() + 1;

                                            if (value.KnockOffAmount) {

                                                if (CreditTermType[0]["CreditTerm"] == "CASH") {


                                                    var start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                                    var end = moment(new Date()).format("DD-MM-YYYY");
                                                    var start2 = moment(start, "DD-MM-YYYY");
                                                    var end2 = moment(end, "DD-MM-YYYY");

                                                    Due = Due2

                                                    if (Due1) {
                                                        if (Due > 0) {
                                                            AllDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.BLNo, Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );

                                                            CustomerPaymentDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.BLNo, Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );
                                                        }
                                                        else {

                                                        }
                                                    }
                                                    else {
                                                        AllDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.BLNo, Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );

                                                        CustomerPaymentDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.BLNo, Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );
                                                    }

                                                    // AllDocuments.push(
                                                    //   { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.VoyageVessel, Debit: "", Credit: "", Balance: "", CustomerPaymentDocDate: value1.DocDate, INVUUID: value2.INVUUID,BLUUID:value2.BLUUID},
                                                    // );

                                                    // CustomerPaymentDocuments.push(
                                                    //   { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.VoyageVessel, Debit: "", Credit: "", Balance: "", CustomerPaymentDocDate: value1.DocDate, INVUUID: value2.INVUUID,BLUUID:value2.BLUUID },
                                                    // );
                                                }

                                                else {
                                                    Due = Due2 - CreditTermType[0]["Day"]
                                                    if (Due1) {
                                                        if (Due > 0) {
                                                            AllDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.BLNo, Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );

                                                            CustomerPaymentDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.BLNo, Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );
                                                        }
                                                        else {

                                                        }
                                                    }
                                                    else {
                                                        AllDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );

                                                        CustomerPaymentDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );
                                                    }
                                                }
                                            }

                                        } else {
                                            var Start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                            var FinalDueDate = moment(Start, "DD-MM-YYYY").add((CreditTermType[0]["Day"]) - 1, 'days').format("DD-MM-YYYY");



                                            var start = moment(new Date()).format("DD-MM-YYYY")
                                            var end = FinalDueDate;

                                            var start2 = moment(start, "DD-MM-YYYY");
                                            var end2 = moment(end, "DD-MM-YYYY");

                                            var Due = moment.duration(start2.diff(end2)).asDays();

                                            var End2 = moment(moment($("#dynamicmodel-enddate").val(), "DD-MM-YYYY").format("DD-MM-YYYY"), "DD-MM-YYYY")
                                            var Start2 = moment(moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), "DD-MM-YYYY")


                                            var Due2 = moment.duration(End2.diff(Start2)).asDays() + 1;

                                            if (value.KnockOffAmount) {

                                                if (CreditTermType[0]["CreditTerm"] == "CASH") {


                                                    var start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                                    var end = moment(new Date()).format("DD-MM-YYYY");
                                                    var start2 = moment(start, "DD-MM-YYYY");
                                                    var end2 = moment(end, "DD-MM-YYYY");

                                                    var Due = (moment.duration(end2.diff(start2)).asDays()) + 1;
                                                    Due = Due2
                                                    if (Due1) {
                                                        if (Due > 0) {
                                                            AllDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );

                                                            CustomerPaymentDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );
                                                        }
                                                        else {

                                                        }
                                                    }
                                                    else {
                                                        AllDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );

                                                        CustomerPaymentDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );
                                                    }

                                                    // AllDocuments.push(
                                                    //   { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.VoyageVessel, Debit: "", Credit: "", Balance: "", CustomerPaymentDocDate: value1.DocDate, INVUUID: value2.INVUUID,BLUUID:value2.BLUUID},
                                                    // );

                                                    // CustomerPaymentDocuments.push(
                                                    //   { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.VoyageVessel, Debit: "", Credit: "", Balance: "", CustomerPaymentDocDate: value1.DocDate, INVUUID: value2.INVUUID,BLUUID:value2.BLUUID },
                                                    // );
                                                }

                                                else {

                                                    Due = Due2 - CreditTermType[0]["Day"]
                                                    if (Due1) {
                                                        if (Due > 0) {
                                                            AllDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );

                                                            CustomerPaymentDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );
                                                        }
                                                        else {

                                                        }
                                                    }
                                                    else {
                                                        AllDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );

                                                        CustomerPaymentDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );
                                                    }
                                                }
                                            }
                                        }


                                    }

                                })
                            } else {
                                $.each(SalesInvoiceDocuments, function (key2, value2) {

                                    if (value2.INVUUID == value.SalesInvoice) {

                                        if (value2.BLNo !== "") {
                                            var Start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                            var FinalDueDate = moment(Start, "DD-MM-YYYY").add((CreditTermType[0]["Day"]) - 1, 'days').format("DD-MM-YYYY");



                                            var start = moment(new Date()).format("DD-MM-YYYY")
                                            var end = FinalDueDate;

                                            var start2 = moment(start, "DD-MM-YYYY");
                                            var end2 = moment(end, "DD-MM-YYYY");

                                            var Due = moment.duration(start2.diff(end2)).asDays();

                                            var End2 = moment(moment($("#dynamicmodel-enddate").val(), "DD-MM-YYYY").format("DD-MM-YYYY"), "DD-MM-YYYY")
                                            var Start2 = moment(moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), "DD-MM-YYYY")


                                            var Due2 = moment.duration(End2.diff(Start2)).asDays() + 1;

                                            if (value.KnockOffAmount) {

                                                if (CreditTermType[0]["CreditTerm"] == "CASH") {


                                                    var start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                                    var end = moment(new Date()).format("DD-MM-YYYY");
                                                    var start2 = moment(start, "DD-MM-YYYY");
                                                    var end2 = moment(end, "DD-MM-YYYY");

                                                    var Due = (moment.duration(end2.diff(start2)).asDays()) + 1;
                                                    Due = Due2
                                                    if (Due1) {
                                                        if (Due > 0) {
                                                            AllDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.BLNo, Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );

                                                            CustomerPaymentDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.BLNo, Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );
                                                        }
                                                        else {

                                                        }
                                                    }
                                                    else {
                                                        AllDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.BLNo, Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );

                                                        CustomerPaymentDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.BLNo, Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );
                                                    }

                                                    // AllDocuments.push(
                                                    //   { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.VoyageVessel, Debit: "", Credit: "", Balance: "", CustomerPaymentDocDate: value1.DocDate, INVUUID: value2.INVUUID,BLUUID:value2.BLUUID},
                                                    // );

                                                    // CustomerPaymentDocuments.push(
                                                    //   { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.VoyageVessel, Debit: "", Credit: "", Balance: "", CustomerPaymentDocDate: value1.DocDate, INVUUID: value2.INVUUID,BLUUID:value2.BLUUID },
                                                    // );
                                                }

                                                else {
                                                    Due = Due2 - CreditTermType[0]["Day"]
                                                    if (Due1) {
                                                        if (Due > 0) {
                                                            AllDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.BLNo, Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );

                                                            CustomerPaymentDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.BLNo, Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );
                                                        }
                                                        else {

                                                        }
                                                    }
                                                    else {
                                                        AllDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );

                                                        CustomerPaymentDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );
                                                    }
                                                }
                                            }

                                        } else {
                                            var Start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                            var FinalDueDate = moment(Start, "DD-MM-YYYY").add((CreditTermType[0]["Day"]) - 1, 'days').format("DD-MM-YYYY");



                                            var start = moment(new Date()).format("DD-MM-YYYY")
                                            var end = FinalDueDate;

                                            var start2 = moment(start, "DD-MM-YYYY");
                                            var end2 = moment(end, "DD-MM-YYYY");

                                            var Due = moment.duration(start2.diff(end2)).asDays();

                                            var End2 = moment(moment($("#dynamicmodel-enddate").val(), "DD-MM-YYYY").format("DD-MM-YYYY"), "DD-MM-YYYY")
                                            var Start2 = moment(moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), "DD-MM-YYYY")


                                            var Due2 = moment.duration(End2.diff(Start2)).asDays() + 1;

                                            if (value.KnockOffAmount) {

                                                if (CreditTermType[0]["CreditTerm"] == "CASH") {


                                                    var start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                                    var end = moment(new Date()).format("DD-MM-YYYY");
                                                    var start2 = moment(start, "DD-MM-YYYY");
                                                    var end2 = moment(end, "DD-MM-YYYY");

                                                    var Due = (moment.duration(end2.diff(start2)).asDays()) + 1;
                                                    Due = Due2


                                                    if (Due1) {
                                                        if (Due > 0) {
                                                            AllDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );

                                                            CustomerPaymentDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );
                                                        }
                                                        else {

                                                        }
                                                    }
                                                    else {
                                                        AllDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );

                                                        CustomerPaymentDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );
                                                    }

                                                    // AllDocuments.push(
                                                    //   { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.VoyageVessel, Debit: "", Credit: "", Balance: "", CustomerPaymentDocDate: value1.DocDate, INVUUID: value2.INVUUID,BLUUID:value2.BLUUID},
                                                    // );

                                                    // CustomerPaymentDocuments.push(
                                                    //   { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.VoyageVessel, Debit: "", Credit: "", Balance: "", CustomerPaymentDocDate: value1.DocDate, INVUUID: value2.INVUUID,BLUUID:value2.BLUUID },
                                                    // );
                                                }

                                                else {
                                                    Due = Due2 - CreditTermType[0]["Day"]
                                                    if (Due1) {
                                                        if (Due > 0) {
                                                            AllDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );

                                                            CustomerPaymentDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );
                                                        }
                                                        else {

                                                        }
                                                    }
                                                    else {
                                                        AllDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );

                                                        CustomerPaymentDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );
                                                    }
                                                }
                                            }
                                        }


                                    }

                                })
                            }

                        })

                    }
                })

                //remove duplicates documents
                //CustomerPaymentDocuments = Array.from(CustomerPaymentDocuments.reduce((a, o) => a.set(o.DocNum, o), new Map()).values());

                //remove duplicates documents
                AllDocuments = Array.from(AllDocuments.reduce((a, o) => a.set(o.DocNum, o), new Map()).values());


                var CheckEachINV = [];

                AllDocuments.sort(function (a, b) {
                    if (a.BLUUID > b.BLUUID) return 1;
                    if (a.BLUUID < b.BLUUID) return -1;
                    return 0;
                });


                $.each(SalesInvoiceDocuments, function (key, value) {

                    var newBalance = value.Balance;
                    value.Balance = value.Debit;

                    $.each(SalesCreditNoteDocuments, function (key1, value1) {

                        if (value1.INVUUID == value.INVUUID) {

                            newBalance = parseFloat(newBalance) - parseFloat(value1.Credit);


                            value.Balance = newBalance.toString();


                        }
                    })
                })

                $.each(SalesInvoiceDocuments, function (key, value) {

                    var newBalance = value.Balance;


                    $.each(CustomerPaymentDocuments, function (key1, value1) {

                        if (value1.INVUUID == value.INVUUID) {

                            newBalance = parseFloat(newBalance) - parseFloat(value1.Credit);


                            value.Balance = newBalance.toString();

                        }
                    })
                })

                $.each(AllDocuments, function (key, value) {


                    if (value.DocumentType == "INV") {
                        var newBalance = value.Balance;
                        value.Balance = value.Debit;
                        $.each(SalesCreditNoteDocuments, function (key1, value1) {

                            if (value1.INVUUID == value.INVUUID) {

                                newBalance = parseFloat(newBalance) - parseFloat(value1.Credit);


                                value.Balance = newBalance.toString();

                            }
                        })
                    }

                })

                $.each(AllDocuments, function (key, value) {


                    if (value.DocumentType == "INV") {
                        var newBalance = value.Balance;
                        // value.Balance = value.Debit;
                        $.each(SalesDebitNoteDocuments, function (key1, value1) {

                            if (value1.INVUUID == value.INVUUID) {

                                newBalance = parseFloat(newBalance) + parseFloat(value1.Debit);


                                value.Balance = newBalance.toString();

                            }
                        })
                    }

                })


                $.each(AllDocuments, function (key, value) {


                    if (value.DocumentType == "INV") {
                        var newBalance = value.Balance;

                        $.each(CustomerPaymentDocuments, function (key1, value1) {

                            if (value1.INVUUID == value.INVUUID) {

                                newBalance = parseFloat(newBalance) - parseFloat(value1.Credit);


                                value.Balance = newBalance.toString();

                            }
                        })
                    }

                })



                $.each(SalesInvoiceDocuments, function (keySalesInvoice, valueSalesInvoice) {

                    var checkEachBalance = 0.0000;
                    var TotalEachBalance = 0.0000;
                    checkEachBalance = parseFloat(checkEachBalance) + parseFloat(valueSalesInvoice.Debit)

                    TotalEachBalance = parseFloat(TotalEachBalance) + parseFloat(valueSalesInvoice.Balance)


                    if (valueSalesInvoice.BLUUID == "") {
                        CheckEachINV.push(
                            { DocDate: valueSalesInvoice.DocDate, DocNum: valueSalesInvoice.DocNum, DocumentType: "INV", VoyageVessel: "", BLNo: "", Debit: parseFloat(checkEachBalance).toFixed(4), Credit: valueSalesInvoice.Credit, Balance: parseFloat(TotalEachBalance).toFixed(4), InvoiceDocDate: valueSalesInvoice.DocDate, BLUUID: "", CreditTerm: valueSalesInvoice.CreditTerm, CreditDay: valueSalesInvoice.CreditDay, Date: valueSalesInvoice.Date, FinalDueDate: valueSalesInvoice.FinalDueDate, TodayDate: valueSalesInvoice.TodayDate, Due: valueSalesInvoice.Due },
                        );
                    }
                    else {
                        CheckEachINV.push(
                            { DocDate: valueSalesInvoice.DocDate, DocNum: valueSalesInvoice.DocNum, DocumentType: "INV", VoyageVessel: valueSalesInvoice.VoyageVessel, BLNo: valueSalesInvoice.BLNo, Debit: parseFloat(checkEachBalance).toFixed(4), Credit: valueSalesInvoice.Credit, Balance: parseFloat(TotalEachBalance).toFixed(4), InvoiceDocDate: valueSalesInvoice.DocDate, BLUUID: valueSalesInvoice.BLUUID, CreditTerm: valueSalesInvoice.CreditTerm, CreditDay: valueSalesInvoice.CreditDay, Date: valueSalesInvoice.Date, FinalDueDate: valueSalesInvoice.FinalDueDate, TodayDate: valueSalesInvoice.TodayDate, Due: valueSalesInvoice.Due },
                        );
                    }

                    $.each(SalesCreditNoteDocuments, function (keySalesCreditNote, valueSalesCreditNote) {
                        // checkEachBalanceCredit = parseFloat(checkEachBalanceCredit) - parseFloat(valueSalesCreditNote.Credit)
                        // TotalEachBalanceCredit = parseFloat(TotalEachBalanceCredit) - parseFloat(valueSalesCreditNote.Credit)

                        if (valueSalesInvoice.INVUUID == valueSalesCreditNote.INVUUID) {

                            if (valueSalesInvoice.BLUUID == "") {
                                CheckEachINV.push(
                                    { DocDate: valueSalesCreditNote.DocDate, DocNum: valueSalesCreditNote.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: "", Credit: valueSalesCreditNote.Credit, Balance: valueSalesCreditNote.Balance, InvoiceDocDate: valueSalesCreditNote.DocDate, BLUUID: "", CreditTerm: valueSalesCreditNote.CreditTerm, CreditDay: valueSalesCreditNote.CreditDay, Date: valueSalesCreditNote.Date, FinalDueDate: valueSalesCreditNote.FinalDueDate, TodayDate: valueSalesCreditNote.TodayDate, Due: valueSalesCreditNote.Due },
                                );
                            }

                            else {
                                CheckEachINV.push(
                                    { DocDate: valueSalesCreditNote.DocDate, DocNum: valueSalesCreditNote.DocNum, DocumentType: "CN", VoyageVessel: valueSalesInvoice.VoyageVessel, BLNo: valueSalesInvoice.BLNo, Debit: "", Credit: valueSalesCreditNote.Credit, Balance: valueSalesCreditNote.Balance, InvoiceDocDate: valueSalesCreditNote.DocDate, BLUUID: valueSalesCreditNote.BLUUID, CreditTerm: valueSalesCreditNote.CreditTerm, CreditDay: valueSalesCreditNote.CreditDay, Date: valueSalesCreditNote.Date, FinalDueDate: valueSalesCreditNote.FinalDueDate, TodayDate: valueSalesCreditNote.TodayDate, Due: valueSalesCreditNote.Due },
                                );
                            }
                        }



                    })

                    $.each(SalesDebitNoteDocuments, function (keySalesCreditNote, valueSalesDebitNote) {
                        // checkEachBalanceCredit = parseFloat(checkEachBalanceCredit) - parseFloat(valueSalesCreditNote.Credit)
                        // TotalEachBalanceCredit = parseFloat(TotalEachBalanceCredit) - parseFloat(valueSalesCreditNote.Credit)

                        if (valueSalesInvoice.INVUUID == valueSalesDebitNote.INVUUID) {

                            if (valueSalesInvoice.BLUUID == "") {
                                CheckEachINV.push(
                                    { DocDate: valueSalesDebitNote.DocDate, DocNum: valueSalesDebitNote.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: valueSalesDebitNote.Debit, Credit: "", Balance: valueSalesDebitNote.Balance, InvoiceDocDate: valueSalesDebitNote.DocDate, BLUUID: "", CreditTerm: valueSalesDebitNote.CreditTerm, CreditDay: valueSalesDebitNote.CreditDay, Date: valueSalesDebitNote.Date, FinalDueDate: valueSalesDebitNote.FinalDueDate, TodayDate: valueSalesDebitNote.TodayDate, Due: valueSalesDebitNote.Due },
                                );
                            }

                            else {
                                CheckEachINV.push(
                                    { DocDate: valueSalesDebitNote.DocDate, DocNum: valueSalesDebitNote.DocNum, DocumentType: "DN", VoyageVessel: valueSalesInvoice.VoyageVessel, BLNo: valueSalesInvoice.BLNo, Debit: valueSalesDebitNote.Debit, Credit: "", Balance: valueSalesDebitNote.Balance, InvoiceDocDate: valueSalesDebitNote.DocDate, BLUUID: valueSalesDebitNote.BLUUID, CreditTerm: valueSalesDebitNote.CreditTerm, CreditDay: valueSalesDebitNote.CreditDay, Date: valueSalesDebitNote.Date, FinalDueDate: valueSalesDebitNote.FinalDueDate, TodayDate: valueSalesDebitNote.TodayDate, Due: valueSalesDebitNote.Due },
                                );
                            }
                        }



                    })

                    $.each(CustomerPaymentDocuments, function (keyCustomerPayment, valueCustomerPayment) {

                        if (valueSalesInvoice.INVUUID == valueCustomerPayment.INVUUID) {
                            if (valueSalesInvoice.BLUUID == "") {
                                CheckEachINV.push(
                                    { DocDate: valueCustomerPayment.DocDate, DocNum: valueCustomerPayment.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: valueCustomerPayment.Credit, Balance: valueCustomerPayment.Balance, CustomerPaymentDocDate: valueCustomerPayment.DocDate, INVUUID: valueCustomerPayment.INVUUID, BLUUID: "", CreditTerm: valueCustomerPayment.CreditTerm, CreditDay: valueCustomerPayment.CreditDay, Date: valueCustomerPayment.Date, FinalDueDate: valueCustomerPayment.FinalDueDate, TodayDate: valueCustomerPayment.TodayDate, Due: valueCustomerPayment.Due },
                                );
                            }

                            else {
                                CheckEachINV.push(
                                    { DocDate: valueCustomerPayment.DocDate, DocNum: valueCustomerPayment.DocNum, DocumentType: "OR", VoyageVessel: valueSalesInvoice.VoyageVessel, BLNo: valueSalesInvoice.BLNo, Debit: "", Credit: valueCustomerPayment.Credit, Balance: valueCustomerPayment.Balance, CustomerPaymentDocDate: valueCustomerPayment.DocDate, INVUUID: valueCustomerPayment.INVUUID, CreditTerm: valueCustomerPayment.CreditTerm, CreditDay: valueCustomerPayment.CreditDay, Date: valueCustomerPayment.Date, FinalDueDate: valueCustomerPayment.FinalDueDate, TodayDate: valueCustomerPayment.TodayDate, Due: valueCustomerPayment.Due },
                                );
                            }

                        }

                    })




                })


                CheckEachINV = CheckEachINV.filter(function (element) {
                    return moment(moment(moment.unix(element.DocDate).toDate(), "YYYY-MM-DD").format('YYYY-MM-DD')).isSameOrAfter(moment($("#dynamicmodel-startdate").val(), 'DD-MM-YYYY').format('YYYY-MM-DD'))

                });

                AllDocuments = AllDocuments.filter(function (element) {
                    return moment(moment(moment.unix(element.DocDate).toDate(), "YYYY-MM-DD").format('YYYY-MM-DD')).isSameOrAfter(moment($("#dynamicmodel-startdate").val(), 'DD-MM-YYYY').format('YYYY-MM-DD'))

                });


                AllDocuments.sort(function (a, b) {
                    var momentA = moment(moment.unix(a.DocDate).toDate(), "DD-MM-YYYY")
                    var momentB = moment(moment.unix(b.DocDate).toDate(), "DD-MM-YYYY")

                    return moment(momentA).diff(momentB);
                });

                CheckEachINV.sort(function (a, b) {
                    var momentA = moment(moment.unix(a.DocDate).toDate(), "DD-MM-YYYY")
                    var momentB = moment(moment.unix(b.DocDate).toDate(), "DD-MM-YYYY")

                    return moment(momentA).diff(momentB);
                });

                if (PreviousBalance != 0) {
                    CheckEachINV.unshift({ "Balance": PreviousBalance, "DocumentType": "INV", "Debit": PreviousBalance, "Exclude": true })
                }


                var totalBalance = 0.0000

                $.each(CheckEachINV, function (key, value) {
                    var credit = value.Credit;

                    if (value.Credit <= 0) {
                        credit = "";
                    }


                    if (credit == "") {
                        var valueCredit = ""
                    }
                    else {
                        var valueCredit = parseFloat(credit).toFixed(2)
                    }




                    if (value.DocumentType == "INV" || value.DocumentType == "DN") {
                        if (value.Balance != 0.0000) {
                            var Debit = value.Balance;
                            totalBalance = parseFloat(totalBalance) + parseFloat(value.Balance)

                            if (Debit == "") {
                                var valueDebit = ""
                            } else {
                                var valueDebit = parseFloat(Debit).toFixed(2)
                            }

                            if (value.Exclude == false || value.Exclude == undefined) {
                                var html = "<tr>";
                                html += "<td>" + moment(moment.unix(value.DocDate).toDate()).format("DD/MM/YYYY") + "</td>";
                                html += "<td>" + value.DocNum + "</td>";
                                html += "<td>" + value.DocumentType + "</td>";
                                html += "<td>" + value.VoyageVessel + "</td>";
                                html += "<td>" + value.BLNo + "</td>";
                                html += "<td>" + valueDebit + "</td>";
                                html += "<td>" + valueCredit + "</td>";
                                html += "<td>" + totalBalance.toFixed(2) + "</td>";
                                html += "<td>" + value.Due + "</td>";
                                html += "</tr>";
                                // $("#body").append(html)
                                var data = {
                                    DocDate:moment(moment.unix(value.DocDate).toDate()).format("DD/MM/YYYY"),
                                    DocNum: value.DocNum,
                                    Type: value.DocumentType,
                                    VoyageVessel: value.VoyageVessel,
                                    BLNo: value.BLNo,
                                    Debit: valueDebit,
                                    Credit: valueCredit,
                                    Balance: totalBalance.toFixed(2),
                                    Due: value.Due,
                                }
                                TableDataList.push(data)
                            }
                        }

                    }
                })

                var GetGridviewData = function (params) {
                    var param = {
                        limit: params.data.limit,
                        offset: params.data.offset,
                        sort: params.data.sort,
                        filter: params.data.filter,
                        order: params.data.order,
                    }
                    var Tabledata = JSON.stringify(TableDataList)

                    $.ajax({
                        type: "POST",
                        url: globalContext.globalHost + globalContext.globalPathLink + "statement-of-account/generate-table",
                        data: {data: Tabledata, param: param,},
                        headers: {
                            "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
                        },
                        dataType: "json",
                        success: function (data) {
                            params.success({
                                "rows": data.rows,
                                "total": data.total
                            });
                        }
                    });
                };
                initTable({
                    tableSelector: '#StatementOfAccountTable', // #tableID
                    toolbarSelector: '#toolbar', // #toolbarID
                    columns: columns,
                    hideColumns: defaultHide, // hide default column. If there is no cookie
                    cookieID: 'StatementOfAccount', // define cookie id 
                    functionGrid: GetGridviewData,
                });


                if (PreviousBalance != 0) {
                    $("#body").prepend("<tr><td></td><td></td><td></td><td></td><td>Balance</td><td></td><td></td><td>" + parseFloat(CheckEachINV[0]["Balance"]).toFixed(2) + "</td><td></td></tr>")
                }

                var month = EndDate.substring(2)
                var splitDate = EndDate.split("/");
                var getMonth = splitDate[1]
                var getYear = splitDate[2]

                

                $.each(CheckEachINV, function (key, value) {

                    var valueCredit = value.Credit == "" ? 0 : value.Credit
                    var valueDebit = value.Balance == "" ? 0 : value.Balance
                    if (value.DocumentType == "INV" || value.DocumentType == "DN") {
                        if (value.Due < 31 && value.Due > 0) {

                            TotalMonth = parseFloat(TotalMonth) + (parseFloat(valueDebit) - parseFloat(valueCredit))

                        }

                        if (value.Due >= 31 && value.Due < 62) {
                            TotalMonth1 = parseFloat(TotalMonth1) + (parseFloat(valueDebit) - parseFloat(valueCredit))
                        }

                        if (value.Due >= 62 && value.Due < 93) {
                            TotalMonth2 = parseFloat(TotalMonth2) + (parseFloat(valueDebit) - parseFloat(valueCredit))
                        }

                        if (value.Due >= 93 && value.Due < 124) {
                            TotalMonth3 = parseFloat(TotalMonth3) + (parseFloat(valueDebit) - parseFloat(valueCredit))
                        }

                        if (value.Due >= 124 && value.Due < 155) {
                            TotalMonth4 = parseFloat(TotalMonth4) + (parseFloat(valueDebit) - parseFloat(valueCredit))
                        }

                        if (value.Due >= 155 && value.Due < 186) {
                            TotalMonth5 = parseFloat(TotalMonth5) + (parseFloat(valueDebit) - parseFloat(valueCredit))
                        }

                        if (value.Due >= 186) {
                            TotalMonth6 = parseFloat(TotalMonth6) + (parseFloat(valueDebit) - parseFloat(valueCredit))
                        }

                    }
                })

                TotalMonth = parseFloat(TotalMonth) > 0 ? TotalMonth : 0;
                TotalMonth1 = parseFloat(TotalMonth1) > 0 ? TotalMonth1 : 0;
                TotalMonth2 = parseFloat(TotalMonth2) > 0 ? TotalMonth2 : 0;
                TotalMonth3 = parseFloat(TotalMonth3) > 0 ? TotalMonth3 : 0;
                TotalMonth4 = parseFloat(TotalMonth4) > 0 ? TotalMonth4 : 0;
                TotalMonth5 = parseFloat(TotalMonth5) > 0 ? TotalMonth5 : 0;
                TotalMonth6 = parseFloat(TotalMonth6) > 0 ? TotalMonth6 : 0;

                var htmlAnalysis = "<tr>";
                htmlAnalysis += "<td>" + parseFloat(TotalMonth).toFixed(2) + "</td>";
                htmlAnalysis += "<td>" + parseFloat(TotalMonth1).toFixed(2) + "</td>";
                htmlAnalysis += "<td>" + parseFloat(TotalMonth2).toFixed(2) + "</td>";
                htmlAnalysis += "<td>" + parseFloat(TotalMonth3).toFixed(2) + "</td>";
                htmlAnalysis += "<td>" + parseFloat(TotalMonth4).toFixed(2) + "</td>";
                htmlAnalysis += "<td>" + parseFloat(TotalMonth5).toFixed(2) + "</td>";
                htmlAnalysis += "<td>" + parseFloat(TotalMonth6).toFixed(2) + "</td>";
                htmlAnalysis += "</tr>";
                $("#bodyAnalysis").append(htmlAnalysis)

            }
        })

    }


    function handleGenerate() {
        var StartDate = getValues("DynamicModel[StartDate]")
        var EndDate = getValues("DynamicModel[EndDate]")

        var Company = $("input[name='DynamicModel[Company]").val()
        var Branch = getValues("DynamicModel[Branch]")
        if ($("#dueCheckbox").prop("checked")) {
            var Due1 = 1;
        }
        else {
            var Due1 = 0;
        }

        var defaultHide = [ // default field to hide in bootstrap table
        ];

        var columns = [ // data from controller (actionGetCompanyType) field and title to be included
            {
                field: 'DocDate',
                title: 'Doc Date.',
                filterControl: "input",
            },
            {
                field: 'DocNum',
                title: 'Doc Num',
                filterControl: "input",
            },
            {
                field: 'Type',
                title: 'Type',
                filterControl: "input",
            },
            {
                field: 'VoyageVessel',
                title: 'Vessel/Voyage',
                filterControl: "input",
            },
            {
                field: 'BLNo',
                title: 'BL No.',
                filterControl: "input",
            },
            {
                field: 'Debit',
                title: 'Debit',
                filterControl: "input",
            },
            {
                field: 'Credit',
                title: 'Credit',
                filterControl: "input",
            },
            {
                field: 'Balance',
                title: 'Balance',
                filterControl: "input",
            },
            {
                field: 'Due',
                title: 'Due(Days)',
                filterControl: "input",
            },
        ];


        $("#StatementOfAccountTable").empty();
        $("#StatementOfAccountTable").removeClass("d-none");
        // $("#StatementOfAccountTable").append(
        //     "<thead>\
        //       <tr id='head'>\
        //           <th>Doc Date</th>\
        //           <th>Doc No</th>\
        //           <th>Type</th>\
        //           <th>Vessel/Voyage</th>\
        //           <th>BL No.</th>\
        //           <th>Debit</th>\
        //           <th>Credit</th>\
        //           <th>Balance</th>\
        //           <th>Due(Days)</th>\
        //       </tr>\
        //   </thead>\
        //   <tbody id='body'>\
        //   </tbody>"
        // )

        var TableDataList = []

        $.ajax({
            url: globalContext.globalHost + globalContext.globalPathLink + "statement-of-account/generate-report?StartDate=" + StartDate + "&EndDate=" + EndDate + "&Company=" + Company + "&Branch=" + Branch,
            type: "POST",
            dataType: "json",
            headers: {
                "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
            },
            success: function (data) {
                var AllDocuments = [];
                var CustomerPaymentDocuments = [];
                var SalesCreditNoteDocuments = [];
                var SalesInvoiceDocuments = [];
                var SalesInvoiceDocumentsBalance = [];
                var SalesDebitNoteDocuments = [];


                var TotalCustomerPayment = 0.0000
                var TotalCreditNote = 0.0000
                var TotalDebitNote = 0.0000
                var TotalInvoice = 0.0000
                var TotalMonth = 0.0000
                var TotalMonth1 = 0.0000
                var TotalMonth2 = 0.0000
                var TotalMonth3 = 0.0000
                var TotalMonth4 = 0.0000
                var TotalMonth5 = 0.0000
                var TotalMonth6 = 0.0000


                var BillOfLadings = data.data.BillOfLadings
                var CustomerPayment = data.data.CustomerPayment
                var SalesCreditNote = data.data.SalesCreditNote
                var SalesDebitNote = data.data.SalesDebitNote
                var SalesInvoice = data.data.SalesInvoice

                var PreviousSalesInvoiceAmount = data.data.PreviousSalesInvoiceAmount == null ? 0 : data.data.PreviousSalesInvoiceAmount
                var PreviousSalesDebitNote = data.data.PreviousSalesDebitNote == null ? 0 : data.data.PreviousSalesDebitNote
                var PreviousSalesCreditNote = data.data.PreviousSalesCreditNote == null ? 0 : data.data.PreviousSalesCreditNote
                var PreviousCustomerPayment = data.data.PreviousCustomerPayment == null ? 0 : data.data.PreviousCustomerPayment

                var PreviousBalance = (parseFloat(PreviousSalesInvoiceAmount) + parseFloat(PreviousSalesDebitNote)) - parseFloat(PreviousSalesCreditNote) - parseFloat(PreviousCustomerPayment)


                BillOfLadings.sort(function (a, b) {
                    var momentA = moment(a.DocDate, "DD/MM/YYYY");
                    var momentB = moment(b.DocDate, "DD/MM/YYYY");
                    return momentA - momentB
                });

                CustomerPayment.sort(function (a, b) {
                    var momentA = moment(a.DocDate, "DD/MM/YYYY");
                    var momentB = moment(b.DocDate, "DD/MM/YYYY");
                    return momentA - momentB
                });

                SalesCreditNote.sort(function (a, b) {
                    var momentA = moment(a.DocDate, "DD/MM/YYYY");
                    var momentB = moment(b.DocDate, "DD/MM/YYYY");
                    return momentA - momentB
                });

                SalesDebitNote.sort(function (a, b) {
                    var momentA = moment(a.DocDate, "DD/MM/YYYY");
                    var momentB = moment(b.DocDate, "DD/MM/YYYY");
                    return momentA - momentB
                });

                SalesInvoice.sort(function (a, b) {
                    var momentA = moment(a.DocDate, "DD/MM/YYYY");
                    var momentB = moment(b.DocDate, "DD/MM/YYYY");
                    return momentA - momentB
                });


                $.each(SalesInvoice, function (key1, value1) {
                    var foundInvoice = false;
                    if (value1.VerificationStatus == "Approved" && value1.Valid == "1") {
                        var CreditTermType = creditTerm.filter(function (element) {
                            return element.CreditTermUUID == value1.CreditTerm;
                        });


                        $.each(value1.salesInvoiceHasCharges, function (key2, value2) {

                            if (value2.BillOfLading == null && foundInvoice == false) {
                                foundInvoice = true;
                                var Debit = parseFloat(value1.TotalAmount).toFixed(4)

                                var Credit = 0.0000;

                                TotalInvoice = 0.0000;
                                TotalInvoice = (parseFloat(TotalInvoice) + parseFloat(Debit))

                                var Start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                var FinalDueDate = moment(Start, "DD-MM-YYYY").add((CreditTermType[0]["Day"]) - 1, 'days').format("DD-MM-YYYY");



                                var start = moment(new Date()).format("DD-MM-YYYY")
                                var end = FinalDueDate;

                                var start2 = moment(start, "DD-MM-YYYY");
                                var end2 = moment(end, "DD-MM-YYYY");

                                var Due = moment.duration(start2.diff(end2)).asDays();


                                var End2 = moment(moment($("#dynamicmodel-enddate").val(), "DD-MM-YYYY").format("DD-MM-YYYY"), "DD-MM-YYYY")
                                var Start2 = moment(moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), "DD-MM-YYYY")


                                var Due2 = moment.duration(End2.diff(Start2)).asDays() + 1;

                                if (CreditTermType[0]["CreditTerm"] == "CASH") {


                                    var start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                    var end = moment(new Date()).format("DD-MM-YYYY");
                                    var start2 = moment(start, "DD-MM-YYYY");
                                    var end2 = moment(end, "DD-MM-YYYY");

                                    Due = Due2

                                    if (Due1) {
                                        if (Due > 0) {
                                            AllDocuments.push(
                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: Credit, Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                            );

                                            SalesInvoiceDocuments.push(
                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: Credit, Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                            );
                                        }
                                        else {

                                        }
                                    }
                                    else {
                                        AllDocuments.push(
                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: Credit, Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                        );

                                        SalesInvoiceDocuments.push(
                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: Credit, Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                        );
                                    }


                                }
                                else {

                                    Due = Due2 - CreditTermType[0]["Day"]

                                    if (Due1) {

                                        if (Due > 0) {


                                            AllDocuments.push(
                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: Credit, Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                            );

                                            SalesInvoiceDocuments.push(
                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: Credit, Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                            );



                                        } else {

                                        }
                                    } else {

                                        AllDocuments.push(
                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: Credit, Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                        );

                                        SalesInvoiceDocuments.push(
                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: Credit, Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                        );

                                    }


                                }



                            } else {

                                $.each(BillOfLadings, function (key, value) {
                                    if (value.BillOfLadingUUID == value2.BillOfLading && foundInvoice == false) {

                                        foundInvoice = true;
                                        var Debit = parseFloat(value1.TotalAmount).toFixed(4)
                                        var Credit = 0.0000;
                                        TotalInvoice = 0.0000;
                                        TotalInvoice = (parseFloat(TotalInvoice) + parseFloat(Debit))
                                        var Start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                        var FinalDueDate = moment(Start, "DD-MM-YYYY").add((CreditTermType[0]["Day"]) - 1, 'days').format("DD-MM-YYYY");

                                        var start = moment(new Date()).format("DD-MM-YYYY")
                                        var end = FinalDueDate;

                                        var start2 = moment(start, "DD-MM-YYYY");
                                        var end2 = moment(end, "DD-MM-YYYY");

                                        var Due = moment.duration(start2.diff(end2)).asDays();

                                        var End2 = moment(moment($("#dynamicmodel-enddate").val(), "DD-MM-YYYY").format("DD-MM-YYYY"), "DD-MM-YYYY")
                                        var Start2 = moment(moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), "DD-MM-YYYY")


                                        var Due2 = moment.duration(End2.diff(Start2)).asDays() + 1;

                                        if (CreditTermType[0]["CreditTerm"] == "CASH") {

                                            var start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                            var end = moment(new Date()).format("DD-MM-YYYY");
                                            var start2 = moment(start, "DD-MM-YYYY");
                                            var end2 = moment(end, "DD-MM-YYYY");

                                            var Due = Due2


                                            if (Due1) {
                                                if (Due > 0) {
                                                    AllDocuments.push(
                                                        { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: value.VesselName + "/" + value.VoyageName, BLNo: value.DocNum, Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: value.BillOfLadingUUID, CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                                    );

                                                    SalesInvoiceDocuments.push(
                                                        { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: value.VesselName + "/" + value.VoyageName, BLNo: value.DocNum, Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: value.BillOfLadingUUID, CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                                    );
                                                } else {

                                                }
                                            } else {
                                                AllDocuments.push(
                                                    { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: value.VesselName + "/" + value.VoyageName, BLNo: value.DocNum, Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: value.BillOfLadingUUID, CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                                );

                                                SalesInvoiceDocuments.push(
                                                    { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: value.VesselName + "/" + value.VoyageName, BLNo: value.DocNum, Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: value.BillOfLadingUUID, CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                                );
                                            }



                                        }
                                        else {
                                            Due = Due2 - CreditTermType[0]["Day"]
                                            if (Due1) {
                                                if (Due > 0) {
                                                    AllDocuments.push(
                                                        { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: value.VesselName + "/" + value.VoyageName, BLNo: value.DocNum, Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: value.BillOfLadingUUID, CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                                    );

                                                    SalesInvoiceDocuments.push(
                                                        { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: value.VesselName + "/" + value.VoyageName, BLNo: value.DocNum, Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: value.BillOfLadingUUID, CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                                    );
                                                } else {

                                                }
                                            } else {
                                                AllDocuments.push(
                                                    { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: value.VesselName + "/" + value.VoyageName, BLNo: value.DocNum, Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: value.BillOfLadingUUID, CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                                );

                                                SalesInvoiceDocuments.push(
                                                    { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "INV", VoyageVessel: value.VesselName + "/" + value.VoyageName, BLNo: value.DocNum, Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: parseFloat(TotalInvoice).toFixed(4), InvoiceDocDate: value1.DocDate, BLUUID: value.BillOfLadingUUID, CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value1.SalesInvoiceUUID },
                                                );
                                            }
                                        }

                                    }
                                })
                            }

                        })
                    }


                })

                $.each(SalesCreditNote, function (key1, value1) {
                    var foundCreditNote = false;
                    if (value1.VerificationStatus == "Approved" && value1.Valid == "1") {
                        var CreditTermType = creditTerm.filter(function (element) {
                            return element.CreditTermUUID == value1.CreditTerm;
                        });
                        $.each(value1.salesCreditNoteHasItems, function (key2, value2) {

                            if (value2.BillOfLading == null && foundCreditNote == false) {
                                foundCreditNote = true;
                                var Debit = 0.0000
                                var Credit = parseFloat(value1.TotalAmount).toFixed(4)
                                TotalCreditNote = 0.0000;
                                TotalCreditNote = (parseFloat(TotalCreditNote) + parseFloat(Credit))




                                var Start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                var FinalDueDate = moment(Start, "DD-MM-YYYY").add((CreditTermType[0]["Day"]) - 1, 'days').format("DD-MM-YYYY");



                                var start = moment(new Date()).format("DD-MM-YYYY")
                                var end = FinalDueDate;

                                var start2 = moment(start, "DD-MM-YYYY");
                                var end2 = moment(end, "DD-MM-YYYY");

                                var Due = moment.duration(start2.diff(end2)).asDays();

                                var End2 = moment(moment($("#dynamicmodel-enddate").val(), "DD-MM-YYYY").format("DD-MM-YYYY"), "DD-MM-YYYY")
                                var Start2 = moment(moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), "DD-MM-YYYY")

                                var Due2 = moment.duration(End2.diff(Start2)).asDays() + 1;

                                if (CreditTermType[0]["CreditTerm"] == "CASH") {

                                    var start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                    var end = moment(new Date()).format("DD-MM-YYYY");
                                    var start2 = moment(start, "DD-MM-YYYY");
                                    var end2 = moment(end, "DD-MM-YYYY");

                                    var Due = (moment.duration(end2.diff(start2)).asDays()) + 1;
                                    Due = Due2

                                    if (Due1) {
                                        if (Due > 0) {
                                            AllDocuments.push(
                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );

                                            SalesCreditNoteDocuments.push(
                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );
                                        }
                                        else {

                                        }
                                    }
                                    else {
                                        AllDocuments.push(
                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                        );

                                        SalesCreditNoteDocuments.push(
                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                        );
                                    }


                                }
                                else {
                                    Due = Due2 - CreditTermType[0]["Day"]
                                    if (Due1) {

                                        if (Due > 0) {

                                            AllDocuments.push(
                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );

                                            SalesCreditNoteDocuments.push(
                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );
                                        } else {

                                        }
                                    } else {

                                        AllDocuments.push(
                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                        );

                                        SalesCreditNoteDocuments.push(
                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                        );
                                    }


                                }

                            }
                            else {
                                $.each(data.data.SalesInvoice, function (key3, value3) {
                                    foundCreditNote = true;
                                    var Debit = 0.0000
                                    TotalCreditNote = 0.0000;
                                    var Credit = parseFloat(value1.TotalAmount).toFixed(4)
                                    TotalCreditNote = (parseFloat(TotalCreditNote) + parseFloat(Credit))




                                    var Start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                    var FinalDueDate = moment(Start, "DD-MM-YYYY").add((CreditTermType[0]["Day"]) - 1, 'days').format("DD-MM-YYYY");



                                    var start = moment(new Date()).format("DD-MM-YYYY")
                                    var end = FinalDueDate;

                                    var start2 = moment(start, "DD-MM-YYYY");
                                    var end2 = moment(end, "DD-MM-YYYY");

                                    var Due = moment.duration(start2.diff(end2)).asDays();

                                    var End2 = moment(moment($("#dynamicmodel-enddate").val(), "DD-MM-YYYY").format("DD-MM-YYYY"), "DD-MM-YYYY")
                                    var Start2 = moment(moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), "DD-MM-YYYY")


                                    var Due2 = moment.duration(End2.diff(Start2)).asDays() + 1;

                                    if (CreditTermType[0]["CreditTerm"] == "CASH") {

                                        var start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                        var end = moment(new Date()).format("DD-MM-YYYY");
                                        var start2 = moment(start, "DD-MM-YYYY");
                                        var end2 = moment(end, "DD-MM-YYYY");

                                        var Due = (moment.duration(end2.diff(start2)).asDays()) + 1;
                                        Due = Due2

                                        if (Due1) {
                                            if (Due > 0) {
                                                AllDocuments.push(
                                                    { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                                );

                                                SalesCreditNoteDocuments.push(
                                                    { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                                );
                                            }
                                            else {

                                            }
                                        }
                                        else {
                                            AllDocuments.push(
                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );

                                            SalesCreditNoteDocuments.push(
                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );
                                        }


                                    }
                                    else {
                                        Due = Due2 - CreditTermType[0]["Day"]
                                        if (Due1) {

                                            if (Due > 0) {

                                                AllDocuments.push(
                                                    { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                                );

                                                SalesCreditNoteDocuments.push(
                                                    { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                                );
                                            } else {

                                            }
                                        } else {

                                            AllDocuments.push(
                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );

                                            SalesCreditNoteDocuments.push(
                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: parseFloat(Credit).toFixed(4), Balance: "-" + (parseFloat(TotalCreditNote).toFixed(4)), CreditNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );
                                        }


                                    }
                                })
                            }

                        })
                    }
                })
                //remove duplicates documents;
                SalesCreditNoteDocuments = Array.from(SalesCreditNoteDocuments.reduce((a, o) => a.set(o.DocNum, o), new Map()).values());

                $.each(SalesDebitNote, function (key1, value1) {
                    var foundDebitNote = false;
                    if (value1.VerificationStatus == "Approved" && value1.Valid == "1") {
                        var CreditTermType = creditTerm.filter(function (element) {
                            return element.CreditTermUUID == value1.CreditTerm;
                        });
                        $.each(value1.salesDebitNoteHasItems, function (key2, value2) {

                            if (value2.BillOfLading == null && foundDebitNote == false) {

                                foundDebitNote = true;
                                var Debit = 0.0000
                                var Debit = parseFloat(value1.TotalAmount).toFixed(4)
                                TotalDebitNote = 0.0000
                                TotalDebitNote = (parseFloat(TotalDebitNote) + parseFloat(Debit))




                                var Start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                var FinalDueDate = moment(Start, "DD-MM-YYYY").add((CreditTermType[0]["Day"]) - 1, 'days').format("DD-MM-YYYY");



                                var start = moment(new Date()).format("DD-MM-YYYY")
                                var end = FinalDueDate;

                                var start2 = moment(start, "DD-MM-YYYY");
                                var end2 = moment(end, "DD-MM-YYYY");

                                var Due = moment.duration(start2.diff(end2)).asDays();

                                var End2 = moment(moment($("#dynamicmodel-enddate").val(), "DD-MM-YYYY").format("DD-MM-YYYY"), "DD-MM-YYYY")
                                var Start2 = moment(moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), "DD-MM-YYYY")


                                var Due2 = moment.duration(End2.diff(Start2)).asDays() + 1;


                                if (CreditTermType[0]["CreditTerm"] == "CASH") {

                                    var start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                    var end = moment(new Date()).format("DD-MM-YYYY");
                                    var start2 = moment(start, "DD-MM-YYYY");
                                    var end2 = moment(end, "DD-MM-YYYY");

                                    var Due = (moment.duration(end2.diff(start2)).asDays()) + 1;
                                    Due = Due2

                                    if (Due1) {
                                        if (Due > 0) {
                                            AllDocuments.push(
                                                { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );

                                            SalesDebitNoteDocuments.push(
                                                { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );
                                        }
                                        else {

                                        }
                                    }
                                    else {
                                        AllDocuments.push(
                                            { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                        );

                                        SalesDebitNoteDocuments.push(
                                            { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                        );
                                    }


                                }
                                else {
                                    Due = Due2 - CreditTermType[0]["Day"]
                                    if (Due1) {

                                        if (Due > 0) {

                                            AllDocuments.push(
                                                { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );

                                            SalesDebitNoteDocuments.push(
                                                { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );
                                        } else {

                                        }
                                    } else {

                                        AllDocuments.push(
                                            { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                        );

                                        SalesDebitNoteDocuments.push(
                                            { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                        );
                                    }


                                }

                            }
                            else {
                                $.each(data.data.SalesDebitNote, function (key3, value3) {

                                    foundDebitNote = true;
                                    var Debit = 0.0000
                                    TotalDebitNote = 0.0000
                                    var Debit = parseFloat(value1.TotalAmount).toFixed(4)
                                    TotalDebitNote = (parseFloat(TotalDebitNote) + parseFloat(Debit))




                                    var Start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                    var FinalDueDate = moment(Start, "DD-MM-YYYY").add((CreditTermType[0]["Day"]) - 1, 'days').format("DD-MM-YYYY");



                                    var start = moment(new Date()).format("DD-MM-YYYY")
                                    var end = FinalDueDate;

                                    var start2 = moment(start, "DD-MM-YYYY");
                                    var end2 = moment(end, "DD-MM-YYYY");

                                    var Due = moment.duration(start2.diff(end2)).asDays();


                                    var End2 = moment(moment($("#dynamicmodel-enddate").val(), "DD-MM-YYYY").format("DD-MM-YYYY"), "DD-MM-YYYY")
                                    var Start2 = moment(moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), "DD-MM-YYYY")


                                    var Due2 = moment.duration(End2.diff(Start2)).asDays() + 1;


                                    if (CreditTermType[0]["CreditTerm"] == "CASH") {

                                        var start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                        var end = moment(new Date()).format("DD-MM-YYYY");
                                        var start2 = moment(start, "DD-MM-YYYY");
                                        var end2 = moment(end, "DD-MM-YYYY");

                                        var Due = (moment.duration(end2.diff(start2)).asDays()) + 1;
                                        Due = Due2

                                        if (Due1) {
                                            if (Due > 0) {
                                                AllDocuments.push(
                                                    { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                                );

                                                SalesDebitNoteDocuments.push(
                                                    { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                                );
                                            }
                                            else {

                                            }
                                        }
                                        else {
                                            AllDocuments.push(
                                                { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );

                                            SalesDebitNoteDocuments.push(
                                                { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );
                                        }


                                    }
                                    else {
                                        Due = Due2 - CreditTermType[0]["Day"]
                                        if (Due1) {

                                            if (Due > 0) {

                                                AllDocuments.push(
                                                    { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                                );

                                                SalesDebitNoteDocuments.push(
                                                    { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                                );
                                            } else {

                                            }
                                        } else {

                                            AllDocuments.push(
                                                { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );

                                            SalesDebitNoteDocuments.push(
                                                { DebitNoteUUID: value1.SalesDebitNoteUUID, DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: parseFloat(Debit).toFixed(4), Credit: "", Balance: (parseFloat(TotalDebitNote).toFixed(4)), DebitNoteDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.SalesInvoice },
                                            );
                                        }


                                    }
                                })
                            }

                        })
                    }
                })
                //remove duplicates documents
                SalesDebitNoteDocuments = Array.from(SalesDebitNoteDocuments.reduce((a, o) => a.set(o.DocNum, o), new Map()).values());
                $.each(CustomerPayment, function (key1, value1) {

                    var foundCustomerPayment = false;
                    if (value1.VerificationStatus == "Approved" && value1.Valid == "1") {

                        var CreditTermType = creditTerm.filter(function (element) {
                            return element.CreditTermUUID == value1.CreditTerm;
                        });


                        $.each(value1.customerPaymentHasInvoices, function (key, value) {
                            if (value.SalesInvoice == null) {

                                $.each(SalesDebitNoteDocuments, function (key2, value2) {

                                    if (value2.DebitNoteUUID == value.DebitNote) {

                                        if (value2.BLNo !== "") {
                                            var Start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                            var FinalDueDate = moment(Start, "DD-MM-YYYY").add((CreditTermType[0]["Day"]) - 1, 'days').format("DD-MM-YYYY");



                                            var start = moment(new Date()).format("DD-MM-YYYY")
                                            var end = FinalDueDate;

                                            var start2 = moment(start, "DD-MM-YYYY");
                                            var end2 = moment(end, "DD-MM-YYYY");

                                            var Due = moment.duration(start2.diff(end2)).asDays();

                                            var End2 = moment(moment($("#dynamicmodel-enddate").val(), "DD-MM-YYYY").format("DD-MM-YYYY"), "DD-MM-YYYY")
                                            var Start2 = moment(moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), "DD-MM-YYYY")


                                            var Due2 = moment.duration(End2.diff(Start2)).asDays() + 1;


                                            if (value.KnockOffAmount != null && value.KnockOffAmount !== "0.0000") {


                                                if (CreditTermType[0]["CreditTerm"] == "CASH") {

                                                    var start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                                    var end = moment(new Date()).format("DD-MM-YYYY");
                                                    var start2 = moment(start, "DD-MM-YYYY");
                                                    var end2 = moment(end, "DD-MM-YYYY");

                                                    var Due = (moment.duration(end2.diff(start2)).asDays()) + 1;
                                                    Due = Due2
                                                    if (Due1) {
                                                        if (Due > 0) {
                                                            AllDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.BLNo, Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );

                                                            CustomerPaymentDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.BLNo, Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );
                                                        }
                                                        else {

                                                        }
                                                    }
                                                    else {
                                                        AllDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.BLNo, Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );

                                                        CustomerPaymentDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.BLNo, Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );
                                                    }

                                                    // AllDocuments.push(
                                                    //   { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.VoyageVessel, Debit: "", Credit: "", Balance: "", CustomerPaymentDocDate: value1.DocDate, INVUUID: value2.INVUUID,BLUUID:value2.BLUUID},
                                                    // );

                                                    // CustomerPaymentDocuments.push(
                                                    //   { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.VoyageVessel, Debit: "", Credit: "", Balance: "", CustomerPaymentDocDate: value1.DocDate, INVUUID: value2.INVUUID,BLUUID:value2.BLUUID },
                                                    // );
                                                }

                                                else {
                                                    Due = Due2 - CreditTermType[0]["Day"]
                                                    if (Due1) {
                                                        if (Due > 0) {
                                                            AllDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.BLNo, Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );

                                                            CustomerPaymentDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.BLNo, Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );
                                                        }
                                                        else {

                                                        }
                                                    }
                                                    else {
                                                        AllDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );

                                                        CustomerPaymentDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );
                                                    }
                                                }
                                            }

                                        } else {
                                            var Start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                            var FinalDueDate = moment(Start, "DD-MM-YYYY").add((CreditTermType[0]["Day"]) - 1, 'days').format("DD-MM-YYYY");



                                            var start = moment(new Date()).format("DD-MM-YYYY")
                                            var end = FinalDueDate;

                                            var start2 = moment(start, "DD-MM-YYYY");
                                            var end2 = moment(end, "DD-MM-YYYY");

                                            var Due = moment.duration(start2.diff(end2)).asDays();

                                            var End2 = moment(moment($("#dynamicmodel-enddate").val(), "DD-MM-YYYY").format("DD-MM-YYYY"), "DD-MM-YYYY")
                                            var Start2 = moment(moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), "DD-MM-YYYY")


                                            var Due2 = moment.duration(End2.diff(Start2)).asDays() + 1;



                                            if (value.KnockOffAmount != null && value.KnockOffAmount !== "0.0000") {

                                                if (CreditTermType[0]["CreditTerm"] == "CASH") {


                                                    var start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                                    var end = moment(new Date()).format("DD-MM-YYYY");
                                                    var start2 = moment(start, "DD-MM-YYYY");
                                                    var end2 = moment(end, "DD-MM-YYYY");

                                                    var Due = (moment.duration(end2.diff(start2)).asDays()) + 1;
                                                    Due = Due2
                                                    if (Due1) {
                                                        if (Due > 0) {
                                                            AllDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );

                                                            CustomerPaymentDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );
                                                        }
                                                        else {

                                                        }
                                                    }
                                                    else {
                                                        AllDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );

                                                        CustomerPaymentDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );
                                                    }

                                                    // AllDocuments.push(
                                                    //   { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.VoyageVessel, Debit: "", Credit: "", Balance: "", CustomerPaymentDocDate: value1.DocDate, INVUUID: value2.INVUUID,BLUUID:value2.BLUUID},
                                                    // );

                                                    // CustomerPaymentDocuments.push(
                                                    //   { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.VoyageVessel, Debit: "", Credit: "", Balance: "", CustomerPaymentDocDate: value1.DocDate, INVUUID: value2.INVUUID,BLUUID:value2.BLUUID },
                                                    // );
                                                }

                                                else {
                                                    Due = Due2 - CreditTermType[0]["Day"]
                                                    if (Due1) {
                                                        if (Due > 0) {
                                                            AllDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );

                                                            CustomerPaymentDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );
                                                        }
                                                        else {

                                                        }
                                                    }
                                                    else {
                                                        AllDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );

                                                        CustomerPaymentDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );
                                                    }
                                                }
                                            }
                                        }


                                    }

                                })
                            } else {
                                $.each(SalesInvoiceDocuments, function (key2, value2) {

                                    if (value2.INVUUID == value.SalesInvoice) {

                                        if (value2.BLNo !== "") {
                                            var Start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                            var FinalDueDate = moment(Start, "DD-MM-YYYY").add((CreditTermType[0]["Day"]) - 1, 'days').format("DD-MM-YYYY");



                                            var start = moment(new Date()).format("DD-MM-YYYY")
                                            var end = FinalDueDate;

                                            var start2 = moment(start, "DD-MM-YYYY");
                                            var end2 = moment(end, "DD-MM-YYYY");

                                            var Due = moment.duration(start2.diff(end2)).asDays();

                                            var End2 = moment(moment($("#dynamicmodel-enddate").val(), "DD-MM-YYYY").format("DD-MM-YYYY"), "DD-MM-YYYY")
                                            var Start2 = moment(moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), "DD-MM-YYYY")


                                            var Due2 = moment.duration(End2.diff(Start2)).asDays() + 1;



                                            if (value.KnockOffAmount != null && value.KnockOffAmount !== "0.0000") {


                                                if (CreditTermType[0]["CreditTerm"] == "CASH") {

                                                    var start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                                    var end = moment(new Date()).format("DD-MM-YYYY");
                                                    var start2 = moment(start, "DD-MM-YYYY");
                                                    var end2 = moment(end, "DD-MM-YYYY");

                                                    var Due = (moment.duration(end2.diff(start2)).asDays()) + 1;
                                                    Due = Due2
                                                    if (Due1) {
                                                        if (Due > 0) {
                                                            AllDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.BLNo, Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );

                                                            CustomerPaymentDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.BLNo, Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );
                                                        }
                                                        else {

                                                        }
                                                    }
                                                    else {
                                                        AllDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.BLNo, Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );

                                                        CustomerPaymentDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.BLNo, Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );
                                                    }

                                                    // AllDocuments.push(
                                                    //   { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.VoyageVessel, Debit: "", Credit: "", Balance: "", CustomerPaymentDocDate: value1.DocDate, INVUUID: value2.INVUUID,BLUUID:value2.BLUUID},
                                                    // );

                                                    // CustomerPaymentDocuments.push(
                                                    //   { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.VoyageVessel, Debit: "", Credit: "", Balance: "", CustomerPaymentDocDate: value1.DocDate, INVUUID: value2.INVUUID,BLUUID:value2.BLUUID },
                                                    // );
                                                }

                                                else {
                                                    Due = Due2 - CreditTermType[0]["Day"]
                                                    if (Due1) {
                                                        if (Due > 0) {
                                                            AllDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.BLNo, Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );

                                                            CustomerPaymentDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.BLNo, Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );
                                                        }
                                                        else {

                                                        }
                                                    }
                                                    else {
                                                        AllDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );

                                                        CustomerPaymentDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );
                                                    }
                                                }
                                            }

                                        } else {
                                            var Start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                            var FinalDueDate = moment(Start, "DD-MM-YYYY").add((CreditTermType[0]["Day"]) - 1, 'days').format("DD-MM-YYYY");



                                            var start = moment(new Date()).format("DD-MM-YYYY")
                                            var end = FinalDueDate;

                                            var start2 = moment(start, "DD-MM-YYYY");
                                            var end2 = moment(end, "DD-MM-YYYY");

                                            var Due = moment.duration(start2.diff(end2)).asDays();

                                            var End2 = moment(moment($("#dynamicmodel-enddate").val(), "DD-MM-YYYY").format("DD-MM-YYYY"), "DD-MM-YYYY")
                                            var Start2 = moment(moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), "DD-MM-YYYY")


                                            var Due2 = moment.duration(End2.diff(Start2)).asDays() + 1;



                                            if (value.KnockOffAmount != null && value.KnockOffAmount !== "0.0000") {

                                                if (CreditTermType[0]["CreditTerm"] == "CASH") {


                                                    var start = moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY");
                                                    var end = moment(new Date()).format("DD-MM-YYYY");
                                                    var start2 = moment(start, "DD-MM-YYYY");
                                                    var end2 = moment(end, "DD-MM-YYYY");

                                                    var Due = (moment.duration(end2.diff(start2)).asDays()) + 1;
                                                    Due = Due2
                                                    if (Due1) {
                                                        if (Due > 0) {
                                                            AllDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );

                                                            CustomerPaymentDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );
                                                        }
                                                        else {

                                                        }
                                                    }
                                                    else {
                                                        AllDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );

                                                        CustomerPaymentDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );
                                                    }

                                                    // AllDocuments.push(
                                                    //   { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.VoyageVessel, Debit: "", Credit: "", Balance: "", CustomerPaymentDocDate: value1.DocDate, INVUUID: value2.INVUUID,BLUUID:value2.BLUUID},
                                                    // );

                                                    // CustomerPaymentDocuments.push(
                                                    //   { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: value2.VoyageVessel, BLNo: value2.VoyageVessel, Debit: "", Credit: "", Balance: "", CustomerPaymentDocDate: value1.DocDate, INVUUID: value2.INVUUID,BLUUID:value2.BLUUID },
                                                    // );
                                                }

                                                else {
                                                    Due = Due2 - CreditTermType[0]["Day"]
                                                    if (Due1) {
                                                        if (Due > 0) {
                                                            AllDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );

                                                            CustomerPaymentDocuments.push(
                                                                { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                            );
                                                        }
                                                        else {

                                                        }
                                                    }
                                                    else {
                                                        AllDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );

                                                        CustomerPaymentDocuments.push(
                                                            { DocDate: value1.DocDate, DocNum: value1.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: value.KnockOffAmount, Balance: "-" + value.KnockOffAmount, CustomerPaymentDocDate: value1.DocDate, BLUUID: "", CreditTerm: CreditTermType[0]["CreditTerm"], CreditDay: CreditTermType[0]["Day"], Date: moment(moment.unix(value1.DocDate).toDate()).format("DD-MM-YYYY"), FinalDueDate: FinalDueDate, TodayDate: moment(new Date()).format("DD-MM-YYYY"), Due: Due, INVUUID: value2.INVUUID },
                                                        );
                                                    }
                                                }
                                            }
                                        }


                                    }

                                })
                            }

                        })

                    }
                })
                // //remove duplicates documents
                // CustomerPaymentDocuments = Array.from(CustomerPaymentDocuments.reduce((a, o) => a.set(o.DocNum, o), new Map()).values());
                //remove duplicates documents
                AllDocuments = Array.from(AllDocuments.reduce((a, o) => a.set(o.DocNum, o), new Map()).values());


                AllDocuments.sort(function (a, b) {
                    if (a.BLUUID > b.BLUUID) return 1;
                    if (a.BLUUID < b.BLUUID) return -1;
                    return 0;
                });


                var TotalEachBalance = 0.0000;
                var CheckEachINV = [];



                $.each(AllDocuments, function (key, value) {


                    if (value.DocumentType == "INV") {
                        var newBalance = value.Balance;
                        value.Balance = value.Debit;
                        $.each(SalesCreditNoteDocuments, function (key1, value1) {

                            if (value1.INVUUID == value.INVUUID) {
                                newBalance = parseFloat(newBalance) - parseFloat(value1.Credit);

                                value.Balance = newBalance.toString();

                            }
                        })
                    }

                })


                $.each(AllDocuments, function (key, value) {


                    if (value.DocumentType == "INV") {
                        var newBalance = value.Balance;
                        // value.Balance = value.Debit;
                        $.each(SalesDebitNoteDocuments, function (key1, value1) {

                            if (value1.INVUUID == value.INVUUID) {

                                newBalance = parseFloat(newBalance) + parseFloat(value1.Debit);


                                value.Balance = newBalance.toString();

                            }
                        })
                    }

                })


                $.each(AllDocuments, function (key, value) {


                    if (value.DocumentType == "INV") {
                        var newBalance = value.Balance;

                        $.each(CustomerPaymentDocuments, function (key1, value1) {

                            if (value1.INVUUID == value.INVUUID) {

                                newBalance = parseFloat(newBalance) - parseFloat(value1.Credit);


                                value.Balance = newBalance.toString();

                            }
                        })
                    }

                })



                $.each(SalesInvoiceDocuments, function (keySalesInvoice, valueSalesInvoice) {
                    var checkEachBalance = 0.0000;
                    var TotalEachBalance = 0.0000;
                    checkEachBalance = parseFloat(checkEachBalance) + parseFloat(valueSalesInvoice.Debit)

                    TotalEachBalance = parseFloat(TotalEachBalance) + parseFloat(valueSalesInvoice.Balance)


                    if (valueSalesInvoice.BLUUID == "") {
                        CheckEachINV.push(
                            { DocDate: valueSalesInvoice.DocDate, DocNum: valueSalesInvoice.DocNum, DocumentType: "INV", VoyageVessel: "", BLNo: "", Debit: parseFloat(checkEachBalance).toFixed(4), Credit: valueSalesInvoice.Credit, Balance: parseFloat(TotalEachBalance).toFixed(4), InvoiceDocDate: valueSalesInvoice.DocDate, BLUUID: "", CreditTerm: valueSalesInvoice.CreditTerm, CreditDay: valueSalesInvoice.CreditDay, Date: valueSalesInvoice.Date, FinalDueDate: valueSalesInvoice.FinalDueDate, TodayDate: valueSalesInvoice.TodayDate, Due: valueSalesInvoice.Due },
                        );


                    }
                    else {

                        CheckEachINV.push(
                            { DocDate: valueSalesInvoice.DocDate, DocNum: valueSalesInvoice.DocNum, DocumentType: "INV", VoyageVessel: valueSalesInvoice.VoyageVessel, BLNo: valueSalesInvoice.BLNo, Debit: parseFloat(checkEachBalance).toFixed(4), Credit: valueSalesInvoice.Credit, Balance: parseFloat(TotalEachBalance).toFixed(4), InvoiceDocDate: valueSalesInvoice.DocDate, BLUUID: valueSalesInvoice.BLUUID, CreditTerm: valueSalesInvoice.CreditTerm, CreditDay: valueSalesInvoice.CreditDay, Date: valueSalesInvoice.Date, FinalDueDate: valueSalesInvoice.FinalDueDate, TodayDate: valueSalesInvoice.TodayDate, Due: valueSalesInvoice.Due },
                        );

                    }

                    $.each(SalesCreditNoteDocuments, function (keySalesCreditNote, valueSalesCreditNote) {
                        // checkEachBalanceCredit = parseFloat(checkEachBalanceCredit) - parseFloat(valueSalesCreditNote.Credit)
                        // TotalEachBalanceCredit = parseFloat(TotalEachBalanceCredit) - parseFloat(valueSalesCreditNote.Credit)

                        if (valueSalesInvoice.INVUUID == valueSalesCreditNote.INVUUID) {

                            if (valueSalesInvoice.BLUUID == "") {
                                CheckEachINV.push(
                                    { DocDate: valueSalesCreditNote.DocDate, DocNum: valueSalesCreditNote.DocNum, DocumentType: "CN", VoyageVessel: "", BLNo: "", Debit: "", Credit: valueSalesCreditNote.Credit, Balance: valueSalesCreditNote.Balance, InvoiceDocDate: valueSalesCreditNote.DocDate, BLUUID: "", CreditTerm: valueSalesCreditNote.CreditTerm, CreditDay: valueSalesCreditNote.CreditDay, Date: valueSalesCreditNote.Date, FinalDueDate: valueSalesCreditNote.FinalDueDate, TodayDate: valueSalesCreditNote.TodayDate, Due: valueSalesCreditNote.Due },
                                );
                            }

                            else {
                                CheckEachINV.push(
                                    { DocDate: valueSalesCreditNote.DocDate, DocNum: valueSalesCreditNote.DocNum, DocumentType: "CN", VoyageVessel: valueSalesInvoice.VoyageVessel, BLNo: valueSalesInvoice.BLNo, Debit: "", Credit: valueSalesCreditNote.Credit, Balance: valueSalesCreditNote.Balance, InvoiceDocDate: valueSalesCreditNote.DocDate, BLUUID: valueSalesCreditNote.BLUUID, CreditTerm: valueSalesCreditNote.CreditTerm, CreditDay: valueSalesCreditNote.CreditDay, Date: valueSalesCreditNote.Date, FinalDueDate: valueSalesCreditNote.FinalDueDate, TodayDate: valueSalesCreditNote.TodayDate, Due: valueSalesCreditNote.Due },
                                );
                            }
                        }



                    })

                    $.each(SalesDebitNoteDocuments, function (keySalesCreditNote, valueSalesDebitNote) {
                        // checkEachBalanceCredit = parseFloat(checkEachBalanceCredit) - parseFloat(valueSalesCreditNote.Credit)
                        // TotalEachBalanceCredit = parseFloat(TotalEachBalanceCredit) - parseFloat(valueSalesCreditNote.Credit)

                        if (valueSalesInvoice.INVUUID == valueSalesDebitNote.INVUUID) {

                            if (valueSalesInvoice.BLUUID == "") {
                                CheckEachINV.push(
                                    { DocDate: valueSalesDebitNote.DocDate, DocNum: valueSalesDebitNote.DocNum, DocumentType: "DN", VoyageVessel: "", BLNo: "", Debit: valueSalesDebitNote.Debit, Credit: "", Balance: valueSalesDebitNote.Balance, InvoiceDocDate: valueSalesDebitNote.DocDate, BLUUID: "", CreditTerm: valueSalesDebitNote.CreditTerm, CreditDay: valueSalesDebitNote.CreditDay, Date: valueSalesDebitNote.Date, FinalDueDate: valueSalesDebitNote.FinalDueDate, TodayDate: valueSalesDebitNote.TodayDate, Due: valueSalesDebitNote.Due },
                                );
                            }

                            else {
                                CheckEachINV.push(
                                    { DocDate: valueSalesDebitNote.DocDate, DocNum: valueSalesDebitNote.DocNum, DocumentType: "DN", VoyageVessel: valueSalesInvoice.VoyageVessel, BLNo: valueSalesInvoice.BLNo, Debit: valueSalesDebitNote.Debit, Credit: "", Balance: valueSalesDebitNote.Balance, InvoiceDocDate: valueSalesDebitNote.DocDate, BLUUID: valueSalesDebitNote.BLUUID, CreditTerm: valueSalesDebitNote.CreditTerm, CreditDay: valueSalesDebitNote.CreditDay, Date: valueSalesDebitNote.Date, FinalDueDate: valueSalesDebitNote.FinalDueDate, TodayDate: valueSalesDebitNote.TodayDate, Due: valueSalesDebitNote.Due },
                                );
                            }
                        }



                    })
                    $.each(CustomerPaymentDocuments, function (keyCustomerPayment, valueCustomerPayment) {

                        if (valueSalesInvoice.INVUUID == valueCustomerPayment.INVUUID) {
                            if (valueSalesInvoice.BLUUID == "") {
                                CheckEachINV.push(
                                    { DocDate: valueCustomerPayment.DocDate, DocNum: valueCustomerPayment.DocNum, DocumentType: "OR", VoyageVessel: "", BLNo: "", Debit: "", Credit: valueCustomerPayment.Credit, Balance: valueCustomerPayment.Balance, CustomerPaymentDocDate: valueCustomerPayment.DocDate, INVUUID: valueCustomerPayment.INVUUID, BLUUID: "", CreditTerm: valueCustomerPayment.CreditTerm, CreditDay: valueCustomerPayment.CreditDay, Date: valueCustomerPayment.Date, FinalDueDate: valueCustomerPayment.FinalDueDate, TodayDate: valueCustomerPayment.TodayDate, Due: valueCustomerPayment.Due },
                                );
                            }

                            else {
                                CheckEachINV.push(
                                    { DocDate: valueCustomerPayment.DocDate, DocNum: valueCustomerPayment.DocNum, DocumentType: "OR", VoyageVessel: valueSalesInvoice.VoyageVessel, BLNo: valueSalesInvoice.BLNo, Debit: "", Credit: valueCustomerPayment.Credit, Balance: valueCustomerPayment.Balance, CustomerPaymentDocDate: valueCustomerPayment.DocDate, INVUUID: valueCustomerPayment.INVUUID, CreditTerm: valueCustomerPayment.CreditTerm, CreditDay: valueCustomerPayment.CreditDay, Date: valueCustomerPayment.Date, FinalDueDate: valueCustomerPayment.FinalDueDate, TodayDate: valueCustomerPayment.TodayDate, Due: valueCustomerPayment.Due },
                                );
                            }

                        }

                    })




                })


                CheckEachINV = CheckEachINV.filter(function (element) {
                    return moment(moment(moment.unix(element.DocDate).toDate(), "YYYY-MM-DD").format('YYYY-MM-DD')).isSameOrAfter(moment($("#dynamicmodel-startdate").val(), 'DD-MM-YYYY').format('YYYY-MM-DD'))

                });

                AllDocuments = AllDocuments.filter(function (element) {
                    return moment(moment(moment.unix(element.DocDate).toDate(), "YYYY-MM-DD").format('YYYY-MM-DD')).isSameOrAfter(moment($("#dynamicmodel-startdate").val(), 'DD-MM-YYYY').format('YYYY-MM-DD'))

                });




                AllDocuments.sort(function (a, b) {
                    var momentA = moment(moment.unix(a.DocDate).toDate(), "DD-MM-YYYY")
                    var momentB = moment(moment.unix(b.DocDate).toDate(), "DD-MM-YYYY")

                    return moment(momentA).diff(momentB);
                });

                CheckEachINV.sort(function (a, b) {
                    var momentA = moment(moment.unix(a.DocDate).toDate(), "DD-MM-YYYY")
                    var momentB = moment(moment.unix(b.DocDate).toDate(), "DD-MM-YYYY")

                    return moment(momentA).diff(momentB);
                });
                if (PreviousBalance != 0) {
                    CheckEachINV.unshift({ "Balance": PreviousBalance, "DocumentType": "INV", "Debit": PreviousBalance, "Exclude": true })
                }

                var newBalance;
                $.each(CheckEachINV, function (key, value) {
                    if (key == 0) {
                        newBalance = value.Debit
                        value.Balance = parseFloat(newBalance).toFixed(4)
                    }
                    else {
                        if (value.DocumentType == "CN") {

                            newBalance = parseFloat(newBalance) - (parseFloat(value.Credit))

                            value.Balance = parseFloat(newBalance).toFixed(4)
                        }
                        else if (value.DocumentType == "DN") {

                            newBalance = parseFloat(newBalance) + parseFloat(value.Debit)

                            value.Balance = parseFloat(newBalance).toFixed(4)
                        }
                        else if (value.DocumentType == "OR") {

                            newBalance = parseFloat(newBalance) - (parseFloat(value.Credit))

                            value.Balance = parseFloat(newBalance).toFixed(4)
                        }
                        else if (value.DocumentType == "INV") {

                            newBalance = parseFloat(newBalance) + (parseFloat(value.Debit))

                            value.Balance = parseFloat(newBalance).toFixed(4)
                        }
                    }



                })

                var totalBalance = 0.0000
                $.each(CheckEachINV, function (key, value) {

                    var credit = value.Credit;
                    if (value.Exclude == false || value.Exclude == undefined) {
                        if (value.Credit <= 0) {
                            credit = "";
                        }


                        if (value.Debit == "") {
                            var valueDebit = ""
                        }
                        else {
                            var valueDebit = parseFloat(value.Debit).toFixed(2)
                        }

                        if (credit == "") {
                            var valueCredit = ""
                        }
                        else {
                            var valueCredit = parseFloat(credit).toFixed(2)
                        }

                        if (value.Balance == "") {
                            var valueBalance = ""
                        }
                        else {
                            var valueBalance = parseFloat(value.Balance).toFixed(2)
                        }

                        if (value.DocumentType == "OR" || value.DocumentType == "CN") {
                            var valueDue = ""
                        }
                        else {
                            var valueDue = value.Due
                        }



                        var html = "<tr>";
                        html += "<td>" + moment(moment.unix(value.DocDate).toDate()).format("DD/MM/YYYY") + "</td>";
                        html += "<td>" + value.DocNum + "</td>";
                        html += "<td>" + value.DocumentType + "</td>";
                        html += "<td>" + value.VoyageVessel + "</td>";
                        html += "<td>" + value.BLNo + "</td>";
                        html += "<td>" + valueDebit + "</td>";
                        html += "<td>" + valueCredit + "</td>";
                        html += "<td>" + valueBalance + "</td>";
                        html += "<td>" + valueDue + "</td>";
                        html += "</tr>";
                        // $("#body").append(html)
                        var data = {
                            DocDate:moment(moment.unix(value.DocDate).toDate()).format("DD/MM/YYYY"),
                            DocNum: value.DocNum,
                            Type: value.DocumentType,
                            VoyageVessel: value.VoyageVessel,
                            BLNo: value.BLNo,
                            Debit: valueDebit,
                            Credit: valueCredit,
                            Balance: valueBalance,
                            Due: valueDue,
                        }
                        TableDataList.push(data)
                    }
                })
                if (PreviousBalance != 0) {
                    $("#body").prepend("<tr><td></td><td></td><td></td><td></td><td>Balance</td><td></td><td></td><td>" + parseFloat(CheckEachINV[0]["Balance"]).toFixed(2) + "</td><td></td></tr>")
                }
                var month = EndDate.substring(2)
                var splitDate = EndDate.split("/");
                var getMonth = splitDate[1]
                var getYear = splitDate[2]

                $.each(CheckEachINV, function (key, value) {

                    var valueCredit = value.Credit == "" ? 0 : value.Credit
                    var valueDebit = value.Debit == "" ? 0 : value.Debit
                    if (value.Due < 31 && value.Due > 0) {

                        TotalMonth = parseFloat(TotalMonth) + (parseFloat(valueDebit) - parseFloat(valueCredit))

                    }

                    if (value.Due >= 31 && value.Due < 62) {
                        TotalMonth1 = parseFloat(TotalMonth1) + (parseFloat(valueDebit) - parseFloat(valueCredit))
                    }

                    if (value.Due >= 62 && value.Due < 93) {
                        TotalMonth2 = parseFloat(TotalMonth2) + (parseFloat(valueDebit) - parseFloat(valueCredit))
                    }

                    if (value.Due >= 93 && value.Due < 124) {
                        TotalMonth3 = parseFloat(TotalMonth3) + (parseFloat(valueDebit) - parseFloat(valueCredit))
                    }

                    if (value.Due >= 124 && value.Due < 155) {
                        TotalMonth4 = parseFloat(TotalMonth4) + (parseFloat(valueDebit) - parseFloat(valueCredit))
                    }

                    if (value.Due >= 155 && value.Due < 186) {
                        TotalMonth5 = parseFloat(TotalMonth5) + (parseFloat(valueDebit) - parseFloat(valueCredit))
                    }

                    if (value.Due >= 186) {
                        TotalMonth6 = parseFloat(TotalMonth6) + (parseFloat(valueDebit) - parseFloat(valueCredit))
                    }
                })

                TotalMonth = parseFloat(TotalMonth) > 0 ? TotalMonth : 0;
                TotalMonth1 = parseFloat(TotalMonth1) > 0 ? TotalMonth1 : 0;
                TotalMonth2 = parseFloat(TotalMonth2) > 0 ? TotalMonth2 : 0;
                TotalMonth3 = parseFloat(TotalMonth3) > 0 ? TotalMonth3 : 0;
                TotalMonth4 = parseFloat(TotalMonth4) > 0 ? TotalMonth4 : 0;
                TotalMonth5 = parseFloat(TotalMonth5) > 0 ? TotalMonth5 : 0;
                TotalMonth6 = parseFloat(TotalMonth6) > 0 ? TotalMonth6 : 0;

                var htmlAnalysis = "<tr>";
                htmlAnalysis += "<td>" + parseFloat(TotalMonth).toFixed(2) + "</td>";
                htmlAnalysis += "<td>" + parseFloat(TotalMonth1).toFixed(2) + "</td>";
                htmlAnalysis += "<td>" + parseFloat(TotalMonth2).toFixed(2) + "</td>";
                htmlAnalysis += "<td>" + parseFloat(TotalMonth3).toFixed(2) + "</td>";
                htmlAnalysis += "<td>" + parseFloat(TotalMonth4).toFixed(2) + "</td>";
                htmlAnalysis += "<td>" + parseFloat(TotalMonth5).toFixed(2) + "</td>";
                htmlAnalysis += "<td>" + parseFloat(TotalMonth6).toFixed(2) + "</td>";
                htmlAnalysis += "</tr>";
                //$("#bodyAnalysis").append(htmlAnalysis)

                var GetGridviewData = function (params) {
                    var param = {
                        limit: params.data.limit,
                        offset: params.data.offset,
                        sort: params.data.sort,
                        filter: params.data.filter,
                        order: params.data.order,
                    }

                    var Tabledata = JSON.stringify(TableDataList)
                    $.ajax({
                        type: "POST",
                        url: globalContext.globalHost + globalContext.globalPathLink + "statement-of-account/generate-table",
                        data: {data: Tabledata, param: param,},
                        headers: {
                            "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
                        },
                        dataType: "json",
                        success: function (data) {
                            console.log(data)
                            params.success({
                                "rows": data.rows,
                                "total": data.total
                            });
                        }
                    });
                };
                initTable({
                    tableSelector: '#StatementOfAccountTable', // #tableID
                    toolbarSelector: '#toolbar', // #toolbarID
                    columns: columns,
                    hideColumns: defaultHide, // hide default column. If there is no cookie
                    cookieID: 'StatementOfAccount', // define cookie id 
                    functionGrid: GetGridviewData,
                });
            }
        })
    }

    function columnSetup(columns) {
        var res = [
        ];

        if(columns){
            var NewColumn=columns.map(obj => ({ ...obj }));
            arrayLatestColumn=NewColumn
            //check for reorder column cookies
          
            if (getCookie(`StatementOfAccount.bs.table.reorderColumns`)) {
              var getCookieArray = getCookie(`StatementOfAccount.bs.table.reorderColumns`);
              getCookieArray = JSON.parse(getCookieArray);
        
              const newArray = Object.keys(getCookieArray).filter(key => key !=="state")
              .map(key => ({ field: key }));
        
              var tempNewArray=[]
                 window.$.each(newArray, function (key, value) {
                window.$.each(NewColumn, function (key2, value2) {
                    if(value.field==value2.field){
                      tempNewArray.push(value2)
                    }
        
                })
        
              })
              var Concatarray = tempNewArray.concat(NewColumn);
              const uniqueArray = Concatarray.filter((item, index, self) =>index === self.findIndex((t) => t.field === item.field));
              columns = uniqueArray
            }
          } 

        $.each(columns, function (i, column) {
            column.sortable = true;
            column.align = 'center';
            // column.switchable = false;
            column.valign = 'middle';
            res.push(column);
        })

        return res;
    }

    function initTable(args) {
        var paramsTable = args;

        window.$(`#StatementOfAccountTable`).bootstrapTable('destroy').bootstrapTable({

            // height: '630',
            toolbar: args.toolbarSelector,
            pagination: true,
            pageList: [10, 50, 100, 500],
            ajax: args.functionGrid,
            columns: columnSetup(args.columns),
            sidePagination: 'server',
            showRefresh: true,
            showColumns: true,
            showColumnsToggleAll: true,
            showExport: true,
            resizable: true,
            reorderableColumns: true,
            exportTypes: ['excel', 'xlsx'],
            filterControl: true,
            cookie: "true",
            cookieExpire: '10y',
            cookieIdTable: args.cookieID,
            onLoadSuccess: function () {
                // $table.bootstrapTable('filterBy', args.filterSelector); // default show valid data only
                // var exportAcess=filteredAp.find((item) => item == `export-${modelLinkTemp}`) !== undefined
                // if(!exportAcess){
                //  window.$(".fixed-table-toolbar").find(".export").find(".dropdown-toggle").attr("disabled",true)
                // }else{
                //  window.$(".fixed-table-toolbar").find(".export").find(".dropdown-toggle").attr("disabled",false)
                // }

                if (window.$(`#StatementOfAccountTable`).bootstrapTable("getCookies")['columns'] == null) {
                    $.each(args.hideColumns, function (key, value) {
                        window.$(`#StatementOfAccountTable`).bootstrapTable('hideColumn', value);
                    });
                }
            }
        });

        window.$("#StatementOfAccountTable").on('reorder-column.bs.table', function (e, args) {
            var newLatestColumn = []
            if (getCookie(`StatementOfAccount.bs.table.reorderColumns`)) {
        
              var getCookieArray = getCookie(`StatementOfAccount.bs.table.reorderColumns`);
              getCookieArray = JSON.parse(getCookieArray);
            }
            window.$.each(args, function (key, value) {
              window.$.each(arrayLatestColumn, function (key2, value2) {
                if (value == value2.field) {
        
                  if (value2.switchable == false) {
        
                  } else {
                    newLatestColumn.push(value2)
                  }
                }
              })
            })
            window.$(".fixed-table-toolbar").find(".dropdown-menu").first().children().find("input:checkbox").not(":eq(0)").each(function (key3) {
              var value = window.$(this)[0];
              window.$(value).prop("checked", false);
        
        
              window.$.each(newLatestColumn, function (key4, value4) {
                if (key3 == key4) {
        
                  window.$(value).attr("data-field", value4.field);
                  if (getCookieArray.hasOwnProperty(value4.field)) {
        
                    window.$(value).prop("checked", true);
                  }
        
                  window.$(value).next().text(value4.title)
                }
              })
        
              window.$.each(args, function (key6, value6) {
                if (value6 == window.$(value).attr("data-field")) {
                  window.$(value).val(key6)
                }
              });
            });
          })

        window.$(`#StatementOfAccountTable`).on('page-change.bs.table', function () {
            $('.fixed-table-body').css('overflow-y', 'hidden');
        })

        window.$(`#StatementOfAccountTable`).on('click-row.bs.table', function (e, row, $element) {
            $('.active').removeClass('active');
            $($element).addClass('active');
        })
    }


    function handleDue(event) {
        if ($(event.target).prop("checked")) {
            $(".dueField").val("1")
        } else {

            $(".dueField").val("0")

        }
    }

    function handlePreview() {

        var StartDate = getValues("DynamicModel[StartDate]")
        var EndDate = getValues("DynamicModel[EndDate]")

        var Company = $("input[name='DynamicModel[Company]").val()
        var Branch = getValues("DynamicModel[Branch]")
        if ($("#dueCheckbox").prop("checked")) {
            var Due = 1;
        }
        else {
            var Due = 0;
        }

        var UrlLink;

        props.data.modelLink == "statement-of-account" ?
            UrlLink = globalContext.globalHost + globalContext.globalPathLink + "statement-of-account/preview?StartDate=" + StartDate + "&EndDate=" + EndDate + "&Company=" + Company + "&Branch=" + Branch + "&Due=" + Due :
            UrlLink = globalContext.globalHost + globalContext.globalPathLink + "statement-of-account/preview?StartDate=" + StartDate + "&EndDate=" + EndDate + "&Company=" + Company + "&Branch=" + Branch + "&Due=" + Due + "&CDL=1"

        axios({
            url: UrlLink,
            method: "GET",
            responseType: 'arraybuffer',
            auth: {
                username: globalContext.authInfo.username,
                password: globalContext.authInfo.access_token
            }
        }).then((response) => {
            var file = new Blob([response.data], { type: 'application/pdf' });
            let url = window.URL.createObjectURL(file);

            $('#pdfFrame').attr('src', url);
            window.$("#PreviewPdfModal").modal("toggle");
        });
        // if(getPreviewPDFPermission == true){

        // var getContainerUUIDLink = ContainerUUIDLink
        // getContainerUUIDLink=getContainerUUIDLink.replace("./", "/")
        //     axios({
        //         url:  globalContext.globalHost + globalContext.globalPathLink + props.data.modelLink+getContainerUUIDLink,
        //         method: "GET",
        //         responseType: 'arraybuffer',
        //         auth: {
        //             username: globalContext.authInfo.username,
        //             password: globalContext.authInfo.access_token
        //         }
        //     }).then((response) => {
        //         var file = new Blob([response.data], { type: 'application/pdf' });
        //         let url = window.URL.createObjectURL(file);

        //         $('#pdfFrameList').attr('src', url);
        //         window.$("#PreviewPdfListModal").modal("toggle");
        //     });

        //}
        // else{
        //     alert("You are not allowed to Preview PDF, Please check your User Permission.")
        // }


    }

    async function handleChangeCompany(val) {
        if (val) {
            var arrayBranch = []
            await getCompanyBranches(val.CompanyUUID, globalContext).then(res => {

                $.each(res, function (key, value) {
                    arrayBranch.push({ value: value.CompanyBranchUUID, label: value.BranchCode })
                })
                setBranch(sortArray(arrayBranch))

            })

            if (val.targetBranch) {
                setValue("DynamicModel[Branch]", val.targetBranch)

            }
            else {
                setValue("DynamicModel[Branch]", arrayBranch[0].value)
            }


        }


    }
    const loadOptionsCompany = (inputValue) => {
        // company/get-company-by-company-name?search=shin&type=public&companyType=Depot&q=shin
        const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "company/get-company-by-company-name?search=" + inputValue + "&companyType=&q=" + inputValue, {

            auth: {
                username: globalContext.authInfo.username,
                password: globalContext.authInfo.access_token,
            },
        }).then(res => res.data.data)

        return response



    }



    useEffect(() => {
        var today = new Date();
        var yyyy = today.getFullYear();

        const startOfMonth = moment().clone().startOf('month').format('DD/MM/YYYY');
        const endOfMonth = moment().clone().endOf('month').format('DD/MM/YYYY');
        setValue("DynamicModel[StartDate]", startOfMonth)
        setValue("DynamicModel[EndDate]", endOfMonth)

        initHoverSelectDropownTitle()
        GetUserDetails(globalContext).then(res => {

            setDefaultCompanyState({ CompanyName: res[0].Company.CompanyName, CompanyUUID: res[0].Company.CompanyUUID })

            handleChangeCompany({ CompanyName: res[0].Company.CompanyName, CompanyUUID: res[0].Company.CompanyUUID, targetBranch: res[0].Branch.CompanyBranchUUID })
        })

        var filters = {
            "CreditTerm.Valid": 1,
        };

        if (globalContext.userRule !== "") {
            var modelLinkTemp = props.data.modelLink
            const objRule = JSON.parse(globalContext.userRule);
            var filteredAp = objRule.Rules.filter(function (item) {
                return item.includes(modelLinkTemp);
            });

            setPreviewAccess(filteredAp)
        }


        GetCreditTerm(filters, globalContext).then(res => {
            setCreditTerm(res)

        })
        if($("#StatementOfAccountTable").hasClass("d-none")){
        }else{
            window.$("#StatementOfAccountTable").bootstrapTable('destroy');
        }
        $("#AgingAnalysisTable").empty();
        $("#AgingAnalysisTable").addClass("d-none");

        return () => {

        }

    }, [props.data.model])


    const { register, handleSubmit, setValue, trigger, getValues, unregister, clearErrors, reset, control, watch, formState: { errors } } = useForm({

    });


    return (


        <div className="card card-primary">

            <div className="card-body">
                <div className="card lvl1">
                    <div className="card-body">
                        <div className="row">

                            <div className="col-xs-12 col-md-1 mt-2">
                                <div className="form-group mt-4 mb-1">
                                    <input type="checkbox" className="dueCheckbox" id="dueCheckbox" onChange={handleDue} />
                                    <input type="text" className="form-control d-none dueField" {...register('DynamicModel[Due]')} />
                                    <label className="control-label ml-2" htmlFor='dueCheckbox'>Due</label>
                                </div>
                            </div>
                            <div className="col-xs-12 col-md-2">

                                <div className="form-group">
                                    <label className="control-label">Start Date
                                    </label>
                                    <Controller
                                        name="DynamicModel[StartDate]"
                                        control={control}
                                        id="dynamicmodel-startdate"
                                        render={({ field: { onChange, value } }) => (
                                            <>
                                                <Flatpickr
                                                    value={value}
                                                    {...register('DynamicModel[StartDate]')}

                                                    onChange={val => {

                                                        onChange(moment(val[0]).format("DD/MM/YYYY"))
                                                    }}
                                                    className="form-control StartDate"
                                                    id="dynamicmodel-startdate"
                                                    options={{
                                                        dateFormat: "d/m/Y"
                                                    }}

                                                />
                                            </>
                                        )}
                                    />
                                </div>

                            </div>

                            <div className="col-xs-12 col-md-2">

                                <div className="form-group">
                                    <label className="control-label">End Date
                                    </label>
                                    <Controller
                                        name="DynamicModel[EndDate]"
                                        control={control}
                                        id="dynamicmodel-enddate"
                                        render={({ field: { onChange, value } }) => (
                                            <>
                                                <Flatpickr
                                                    value={value}
                                                    {...register('DynamicModel[EndDate]')}

                                                    onChange={val => {

                                                        onChange(moment(val[0]).format("DD/MM/YYYY"))
                                                    }}
                                                    className="form-control EndDate"
                                                    id="dynamicmodel-enddate"
                                                    options={{
                                                        dateFormat: "d/m/Y"
                                                    }}

                                                />
                                            </>
                                        )}
                                    />
                                </div>

                            </div>


                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label" >Company
                                    </label>
                                    <Controller
                                        name="DynamicModel[Company]"
                                        id="Company"
                                        control={control}

                                        render={({ field: { onChange, value } }) => (

                                            <AsyncSelect
                                                isClearable={true}
                                                {...register("DynamicModel[Company]")}
                                                value={defaultCompanyState}
                                                cacheOptions
                                                placeholder={globalContext.asyncSelectPlaceHolder}
                                                onChange={e => { e == null ? onChange(null) : onChange(e.id); setDefaultCompanyState(e); handleChangeCompany(e) }}
                                                getOptionLabel={e => e.CompanyName}
                                                getOptionValue={e => e.CompanyUUID}
                                                loadOptions={loadOptionsCompany}
                                                menuPortalTarget={document.body}
                                                className="form-control"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label" >Branch
                                    </label>
                                    <Controller
                                        name="DynamicModel[Branch]"
                                        id="Branch"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("DynamicModel[Branch]")}
                                                value={value ? branch.find(c => c.value === value) : null}
                                                onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                options={branch}
                                                className="form-control Branch"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-2">
                                <button type="button" id="PreviewLifting" className={`${previewAccess.find((item) => item == `preview-${modelLinkTemp}`) !== undefined ? "" : "disabledAccess"} btn btn-success mt-4 float-right`} onClick={() => handlePreview()}>Preview</button>
                                {props.data.modelLink == "statement-of-account" ?
                                    <button type="button" id="generateListing" className="btn btn-success mt-4  float-right mr-1" onClick={() => handleGenerate()}>Generate</button> :
                                    <button type="button" id="generateListing" className="btn btn-success mt-4  float-right mr-1" onClick={() => handleGenerateCustomerStatement()}>Generate</button>

                                }




                            </div>
                        </div>



                    </div>
                </div>


            </div>

            <div className="card-body" style={{ width: "90%", margin: "0 auto" }}>
                <div class="">
                    <div class="">
                        <table id="StatementOfAccountTable" style={{ width: "100%" }} className="table table-bordered commontable container-items d-none">

                        </table>
                    </div>
                </div>
                <br></br>
                <div class="table_wrap">
                    <div class="table_wrap_inner">
                        <table id="AgingAnalysisTable" style={{ width: "100%" }} className="table table-bordered commontable container-items d-none">

                        </table>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="PreviewPdfModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <iframe id="pdfFrame" src="preview?id=" width="100%" height="700"></iframe>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

        </div >






    )
}






export default StatementListing