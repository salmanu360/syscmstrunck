
import React, { useContext, useEffect, useState } from 'react'
import $ from "jquery";
import axios from "axios"
import moment from "moment";
import GlobalContext from "../../Components/GlobalContext"
import { GetAllPendingDocumentAll, GetVoyageDelayDocuments } from '../../Components/Helper.js'


function Home(props) {

    const [pendingDocumentData, setPendingDocumentData] = useState([])
    const [loadPendingData, setLoadPendingData] = useState(false)
    const [loadVoyageDelayData, setLoadVoyageDelayData] = useState(false)
    const [voygeDelayDocumentData, setVoygeDelayDocumentData] = useState([])
    const globalContext = useContext(GlobalContext)
    const [userRuleSet, setUserRuleSet] = useState([])
    var param = {
        limit: 20,
        offset: 0,
        type: "All"

    }
    var partUrl;

    useEffect(() => {
        if (globalContext.userRule !== "") {
            const objRule = JSON.parse(globalContext.userRule);
            var filteredAp = objRule.Rules.filter(function (item) {
                return item.includes("view") || item.includes("verify");
            });

            setUserRuleSet(filteredAp)
        }


        return () => {

        }
    }, [globalContext.userRule])





    function Date(time) {
        var DocCreatedDate = moment(moment.unix(time).toDate()).format("DD-MM-YYYY");
        var TodayDate = moment().format("DD-MM-YYYY");
        var start = moment(DocCreatedDate, "DD-MM-YYYY");
        var end = moment(TodayDate, "DD-MM-YYYY");

        var Days = moment.duration(end.diff(start)).asDays();
        if (Days == 0) {
            return "Today";
        }
        else {
            return Days + " days ago";
        }
    }

    function PendingDocumentCard() {
        return (
            <div className="col-sm-6">
                <div className="card card collapsed-card ">
                    <div className="card-header" data-card-widget="collapse">
                        <h3 className="card-title">Pending approval</h3>
                        <div className="card-tools">
                            <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                <i className="fas fa-plus" data-toggle="tooltip" title="Collapse" data-placement="top"></i>
                            </button>
                        </div>
                    </div>
                    <div className="card-body">
                        {pendingDocumentData.map((item, index) => {
                            return (

                                <div className="card collapsed-card lvl1">
                                    <div className="card-header" data-card-widget="collapse">
                                        <h3 className="card-title">{item.name}</h3>
                                        <div className="card-tools">
                                            <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                                <i className="fas fa-plus" data-toggle="tooltip" title="Collapse"
                                                    data-placement="top"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="card-body">
                                        <div className="row">
                                            {item.data.map((item2, index2) => {
                                                var tempname = item2.modelName

                                                if (userRuleSet.includes(`view-${tempname}`) && userRuleSet.includes(`verify-${tempname}`)) {
                                                    var A = item2.data.total
                                                    var B = item2.data.rows.length
                                                    return (


                                                        <section className="col-xl-6 col-md-12">
                                                            <div className="card collapsed-card ">
                                                                <div className="card-header" data-card-widget="collapse">
                                                                    <h3 className="card-title">{`${item2.name}(${item2.data.total})`}</h3>
                                                                    <div className="card-tools">
                                                                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                                                            <i className="fas fa-plus" data-toggle="tooltip" title="Collapse"
                                                                                data-placement="top"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <div className={`card-body ${(item2.name).replaceAll(" ", "")}Body ApplyAllDocument`}>
                                                                    <table id={`${(item2.name).replaceAll(" ", "")}List`} style={{ "width": "100%" }}>


                                                                        {item2.data.rows.map((item3, index3) => {

                                                                            var timestamp = item3.CreatedAt
                                                                            var days = Date(timestamp);
                                                                            var link = item2.name.replaceAll(" ", "")

                                                                            if (link == "Quotation" || link == "Booking" || link == "Invoice" || link == "Receipt" || link == "CreditNote" || link == "DebitNote" || link == "BillOfLading") {

                                                                                if (link == "Booking") {
                                                                                    link = "BookingReservation"
                                                                                }
                                                                                if (link == "Invoice") {
                                                                                    link = "SalesInvoice"
                                                                                }
                                                                                if (link == "Receipt") {
                                                                                    link = "CustomerPayment"
                                                                                }
                                                                                if (link == "CreditNote" || link == "DebitNote") {
                                                                                    var Id = `${item3[`Sales${link}UUID`]}`
                                                                                } else {
                                                                                    var Id = `${item3[`${link}UUID`]}`
                                                                                }

                                                                                if (item3.IsBarge == "1") {
                                                                                    var NewLink = `standard/${link.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}-barge`
                                                                                } else {
                                                                                    var NewLink = `container/${link.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}`
                                                                                }


                                                                                var FinalLink = `./${item.name.toLowerCase()}/${NewLink.replace("-", "")}/update/id=${Id}`


                                                                            } else {
                                                                                var Id;
                                                                                if (link == "Terminal") {
                                                                                    Id = `${item3[`PortDetailsUUID`]}`
                                                                                    var FinalLink = `./${item.name.toLowerCase()}/${link.toLowerCase()}/update/id=${Id}`
                                                                                } else if (link == "Charges" || link == "Tariff") {
                                                                                    Id = `${item3[`${link}UUID`]}`
                                                                                    var FinalLink = `./${item.name.toLowerCase()}/sales-settings/${link.toLowerCase()}/update/id=${Id}`

                                                                                } else {
                                                                                    Id = `${item3[`${link}UUID`]}`
                                                                                    link="PurchaseOrder"?link="purchase-order":link=link;
                                                                                    var FinalLink = `./${item.name.toLowerCase()}/${link.toLowerCase()}/update/id=${Id}`
                                                                                }

                                                                            }



                                                                            if (item2.name == "Company") {
                                                                                var DocNum = item3.CompanyName
                                                                            } else if (item2.name == "Container") {
                                                                                var DocNum = item3.ContainerCode
                                                                            } else if (item2.name == "Vessel") {
                                                                                var DocNum = item3.VesselCode
                                                                            } else if (item2.name == "Charges") {
                                                                                var DocNum = item3.ChargesCode
                                                                            } else if (item2.name == "Tariff") {
                                                                                var DocNum = item3["pOLPortCode"]["PortCode"] + "-" + item3["pODPortCode"]["PortCode"]
                                                                            } else if (item2.name == "Terminal") {
                                                                                var DocNum = item3.LocationCode
                                                                            }
                                                                            else {
                                                                                var DocNum = item3.DocNum
                                                                            }


                                                                            return (
                                                                                <tr>

                                                                                    <td><a href={FinalLink} target="_blank">{DocNum}</a></td><td style={{ "textAlign": "right" }}>{days}</td>
                                                                                </tr>
                                                                            )

                                                                        })}


                                                                    </table>

                                                                    {A == B ? "" : <button className="float-right btn btn-sm MoreDetail" onClick={handleMoreDetailDocument} type="button">More...</button>}

                                                                </div>

                                                            </div>
                                                        </section>
                                                    )


                                                }





                                            })}
                                        </div>
                                    </div>



                                </div>



                            )


                        })}
                    </div>

                </div>
            </div>

        )
    }

    function VoyageDelayDocument() {

        return (

            <div className="col-sm-6">
                <div className="card card collapsed-card">
                    <div className="card-header" data-card-widget="collapse">
                        <h3 className="card-title">Voyage Delay</h3>

                        <div className="card-tools">
                            <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                <i className="fas fa-plus" data-toggle="tooltip" title="Collapse" data-placement="top"></i>
                            </button>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            {voygeDelayDocumentData.map((item, index) => {

                                var tempname = item.modelName
                                if (userRuleSet.includes(`view-${tempname}`)) {
                                    var A = item.data.total
                                    var B = item.data.rows.length
                                    return (

                                        <section className={`lvl1 col-md-6 col-sm-12 ${(item.name).replaceAll(" ", "")}VoyageDelayCard`}>
                                            <div className="card collapsed-card lvl1">
                                                <div className="card-header" data-card-widget="collapse">
                                                    <h3 className="card-title">{`${item.name}(${item.data.total})`}</h3>
                                                    <div className="card-tools">
                                                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                                            <i className="fas fa-plus" data-toggle="tooltip" title="Collapse"
                                                                data-placement="top"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className={`card-body ${(item.name).replaceAll(" ", "")}Body ApplyAllDocument`}>
                                                    <table id={`${(item.name).replaceAll(" ", "")}VoyageList`} style={{ "width": "100%" }}>
                                                        {item.data.rows.map((item2, index2) => {

                                                            var timestamp = item2.CreatedAt
                                                            var days = Date(timestamp);

                                                            var groupName
                                                            var link = item.name.replaceAll(" ", "")
                                                            var NewLink
                                                            if (link == "Booking") {
                                                                link = "BookingReservation"
                                                            }

                                                            var Id = `${item2[`${link}UUID`]}`

                                                            if (link == "Quotation" || link == "BookingReservation") {
                                                                groupName = "sales"
                                                                if (item2.IsBarge == "1") {
                                                                    NewLink = `standard/${link.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}-barge`
                                                                } else {
                                                                    NewLink = `container/${link.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}`
                                                                }
                                                            } else if (link == "BillOfLading") {
                                                                groupName = "operation"
                                                                if (item2.IsBarge == "1") {
                                                                    NewLink = `standard/${link.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}-barge`
                                                                } else {
                                                                    NewLink = `container/${link.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}`
                                                                }

                                                            } else {
                                                                groupName = "operation"
                                                                NewLink = `container/${link.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}`

                                                            }

                                                            var FinalLink = `./${groupName}/${NewLink.replace("-", "")}/update/id=${Id}&D=1`
                                                            return (
                                                                <tr>
                                                                    <td><a href={FinalLink} target="_blank">{item2.DocNum}</a></td><td style={{ "textAlign": "right" }}>{days}</td>
                                                                </tr>

                                                            )

                                                        })}

                                                    </table>
                                                    {A == B ? "" : <button className="float-right btn btn-sm MoreDetailDelay" onClick={handleMoreDetailVoyageDelayDocument} type="button">More...</button>}

                                                </div>
                                            </div>
                                        </section>


                                    )

                                }


                            })}
                        </div>



                    </div>
                </div>
            </div>

        )
    }

    function handleMoreDetailVoyageDelayDocument(event) {

        var oriId = $(event.target).parent().find("table").attr("id")
        var Id = $(event.target).parent().find("table").attr("id").replaceAll('VoyageList', '')
        var offset = $(event.target).parent().find("table").children().length

        if (Id == "Quotation") {
            Id = "Quotation"
        }
        if (Id == "Booking") {
            Id = "BookingReservation"
        }
        if (Id == "ContainerReleaseOrder") {
            Id = "ContainerReleaseOrder"
        }
        if (Id == "BillOfLading") {
            Id = "BillOfLading"
        }
        var passData = {
            limit: 20,
            offset: offset,
            type: Id,
            oriId: oriId

        }
        GetVoyageDelayDocuments(globalContext, passData).then(res => {
            var partUrl = "./";
            $.each(res.data[`${passData.type}`]["rows"], function (key, value) {
                var modelLink = ((passData.type).split(/(?=[A-Z])/)).join('-')
                modelLink = modelLink.toLowerCase()
                var UUID = value[`${passData.type}UUID`]
                var timestamp = value.VoyageUpdatedAt
                var days = Date(timestamp);

                if (modelLink == "quotation" || modelLink == "booking-reservation") {
                    if (value.IsBarge == "1") {
                        $("#" + passData.oriId).append("<tr><td><a href=" + partUrl + "sales/standard/" + modelLink + "-barge/update/id=" + UUID + "&D=1 target='_blank'>" + value.DocNum + "</a></td><td  style='text-align:right'>" + days + "</td></tr>");
                    } else {
                        $("#" + passData.oriId).append("<tr><td><a href=" + partUrl + "sales/container/" + modelLink + "/update/id=" + UUID + "&D=1 target='_blank'>" + value.DocNum + "</a></td><td  style='text-align:right'>" + days + "</td></tr>");
                    }

                } else if (modelLink == "bill-of-lading") {
                    if (value.IsBarge == "1") {
                        $("#" + passData.oriId).append("<tr><td><a href=" + partUrl + "operation/standard/" + modelLink + "-barge/update/id=" + UUID + "&D=1 target='_blank'>" + value.DocNum + "</a></td><td  style='text-align:right'>" + days + "</td></tr>");
                    } else {
                        $("#" + passData.oriId).append("<tr><td><a href=" + partUrl + "operation/container/" + modelLink + "/update/id=" + UUID + "&D=1 target='_blank'>" + value.DocNum + "</a></td><td  style='text-align:right'>" + days + "</td></tr>");
                    }
                } else {
                    $("#" + passData.oriId).append("<tr><td><a href=" + partUrl + "operation/container/" + modelLink + "/update/id=" + UUID + "&D=1 target='_blank'>" + value.DocNum + "</a></td><td  style='text-align:right'>" + days + "</td></tr>");
                }


            })

            if (parseInt(res.data[`${passData.type}`]["total"]) == $("#" + passData.oriId).find("tr").length) {

                $("#" + passData.oriId).parent().find(".MoreDetailDelay").addClass("d-none")
            }
        })

    }

    function handleMoreDetailDocument(event) {


        var oriId = $(event.target).parent().find("table").attr("id")
        var Id = $(event.target).parent().find("table").attr("id").replaceAll('List', '')
        var offset = $(event.target).parent().find("table").children().length

        var groupName = $(event.target).closest(".card-body").parent().closest('.card-body').prev().find(".card-title").text()
        if (Id == "Booking") {
            Id = "BookingReservation"
        }
        if (Id == "Invoice") {
            Id = "SalesInvoice"
        }
        if (Id == "Terminal") {
            Id = "PortDetails"
        }
        if (Id == "Receipt") {
            Id = "CustomerPayment"
        }
        if (Id == "CreditNote") {
            Id = "SalesCreditNote"
        }
        if (Id == "DebitNote") {
            Id = "SalesDebitNote"
        }
        var passData = {
            limit: 20,
            offset: offset,
            type: Id,
            oriId: oriId

        }
        GetAllPendingDocumentAll(globalContext, passData).then(res => {
            var partUrl = "./";
            $.each(res.data[`${passData.type}`]["rows"], function (key, value) {
                var timestamp = value.CreatedAt
                var days = Date(timestamp);
                var UUID = value[`${passData.type}UUID`]
                var updateString = "/update"
                var labelString = value.DocNum
                if (passData.type == "Quotation" || passData.type == "BookingReservation" || passData.type == "SalesInvoice" || passData.type == "SalesCreditNote" || passData.type == "SalesDebitNote" || passData.type == "BillOfLading"
                    || passData.type == "ContainerReleaseOrder" || passData.type == "DeliveryOrder") {
                    updateString = "/update"
                }


                var modelLink = ((passData.type).split(/(?=[A-Z])/)).join('-')
                modelLink = modelLink.toLowerCase()

                if (passData.type == "Quotation" || passData.type == "BookingReservation" || passData.type == "SalesInvoice" || passData.type == "SalesCreditNote" || passData.type == "SalesDebitNote" || passData.type == "BillOfLading"
                    || passData.type == "ContainerReleaseOrder") {

                    if (passData.type == "SalesCreditNote") {
                        modelLink = "credit-note"
                    }
                    if (passData.type == "SalesDebitNote") {
                        modelLink = "debit-note"
                    }

                    if (value.IsBarge == "1") {
                        modelLink = `${groupName.toLocaleLowerCase()}/standard/${modelLink}`
                    } else {
                        modelLink = `${groupName.toLocaleLowerCase()}/container/${modelLink}`
                    }

                } else {
                    if (modelLink == "port-details") {

                        modelLink = `${groupName.toLocaleLowerCase()}/terminal`
                    } else if (modelLink == "charges" || modelLink == "tariff") {
                        modelLink = `${groupName.toLocaleLowerCase()}/sales-settings/${modelLink}`
                    } else {
                        modelLink = `${groupName.toLocaleLowerCase()}/${modelLink}`
                    }


                }

                if (passData.type == "Company") {
                    labelString = value.CompanyName
                }
                if (passData.type == "PortDetails") {
                    labelString = value.LocationCode
                }

                if (passData.type == "Container") {
                    labelString = value.ContainerCode
                }

                if (passData.type == "Vessel") {
                    labelString = value.VesselCode
                }

                if (passData.type == "Charges") {
                    labelString = value.ChargesCode
                }

                if (passData.type == "Tariff") {
                    labelString = value["pOLPortCode"]["PortCode"] + "-" + value["pODPortCode"]["PortCode"]
                }
                $("#" + passData.oriId).append("<tr><td><a href=" + partUrl + modelLink + updateString + "/id=" + UUID
                    + " target='_blank'>" + labelString +
                    "</a></td><td  style='text-align:right'>" + days + "</td></tr>");
            })

            if (parseInt(res.data[`${passData.type}`]["total"]) == $("#" + passData.oriId).find("tr").length) {
                $("#" + passData.oriId).parent().find(".MoreDetail").addClass("d-none")
            }
        })
    }



    useEffect(() => {


        GetVoyageDelayDocuments(globalContext, param).then(res => {

            var VoyageDelayDocument = []

            res.data.Quotation.rows.sort(function (a, b) {
                var momentA = moment(moment.unix(a.VoyageUpdatedAt).toDate(), "DD-MM-YYYY")
                var momentB = moment(moment.unix(b.VoyageUpdatedAt).toDate(), "DD-MM-YYYY")

                return moment(momentA).diff(momentB);
            });

            res.data.BookingReservation.rows.sort(function (a, b) {
                var momentA = moment(moment.unix(a.VoyageUpdatedAt).toDate(), "DD-MM-YYYY")
                var momentB = moment(moment.unix(b.VoyageUpdatedAt).toDate(), "DD-MM-YYYY")

                return moment(momentA).diff(momentB);
            });


            res.data.ContainerReleaseOrder.rows.sort(function (a, b) {
                var momentA = moment(moment.unix(a.VoyageUpdatedAt).toDate(), "DD-MM-YYYY")
                var momentB = moment(moment.unix(b.VoyageUpdatedAt).toDate(), "DD-MM-YYYY")

                return moment(momentA).diff(momentB);
            });


            res.data.BillOfLading.rows.sort(function (a, b) {
                var momentA = moment(moment.unix(a.VoyageUpdatedAt).toDate(), "DD-MM-YYYY")
                var momentB = moment(moment.unix(b.VoyageUpdatedAt).toDate(), "DD-MM-YYYY")

                return moment(momentA).diff(momentB);
            });


            var objQuotation = { name: "Quotation", data: res.data.Quotation, modelName: "quotation" }
            var objBooking = { name: "Booking", data: res.data.BookingReservation, modelName: "booking-reservation" }
            var objContainerReleaseOrder = { name: "Container Release Order", data: res.data.ContainerReleaseOrder, modelName: "container-release-order" }
            var objBillOfLading = { name: "Bill Of Lading", data: res.data.BillOfLading, modelName: "bill-of-lading" }


            VoyageDelayDocument.push(...VoyageDelayDocument, objQuotation, objBooking, objContainerReleaseOrder, objBillOfLading)
            setVoygeDelayDocumentData(VoyageDelayDocument)
        })

        GetAllPendingDocumentAll(globalContext, param).then(res => {
            var PendingDocument = []
            var SalesData = []
            var OperationData = []
            var PurchaseData = []
            var CompanyData = []
            var AssetData = []
            var SettingsData = []


            SalesData.push(...SalesData, { data: res.data.Quotation, name: "Quotation", modelName: "quotation" }, { data: res.data.BookingReservation, name: "Booking", modelName: "booking-reservation" }, { data: res.data.SalesInvoice, name: "Invoice", modelName: "sales-invoice" }, { data: res.data.SalesCreditNote, name: "Credit Note", modelName: "sales-credit-note" }, { data: res.data.SalesDebitNote, name: "Debit Note", modelName: "sales-debit-note" }, { data: res.data.CustomerPayment, name: "Receipt", modelName: "customer-payment" })
            OperationData.push(...OperationData, { data: res.data.BillOfLading, name: "Bill Of Lading", modelName: "bill-of-lading" })
            PurchaseData.push(...PurchaseData, { data: res.data.PurchaseOrder, name: "Purchase Order", modelName: "purchase-order" })
            CompanyData.push(...CompanyData, { data: res.data.Company, name: "Company", modelName: "company" }, { data: res.data.PortDetails, name: "Terminal", modelName: "port-details" })
            AssetData.push(...AssetData, { data: res.data.Container, name: "Container", modelName: "container" }, { data: res.data.Vessel, name: "Vessel", modelName: "vessel" })
            SettingsData.push(...SettingsData, { data: res.data.Charges, name: "Charges", modelName: "charges" }, { data: res.data.Tariff, name: "Tariff", modelName: "tariff" })


            var objSales = { name: "Sales", data: SalesData }
            var objOperation = { name: "Operation", data: OperationData }
            var objPurchase = { name: "Purchase", data: PurchaseData }
            var objCompany = { name: "Company", data: CompanyData }
            var objAsset = { name: "Asset", data: AssetData }
            var objSettingsData = { name: "Setting", data: SettingsData }


            PendingDocument.push(...PendingDocument, objSales, objOperation, objPurchase, objCompany, objAsset, objSettingsData)


            setPendingDocumentData(PendingDocument)
        })

        return () => {

        }
    }, [])




    function DocumentCard() {

        return (
            <>
                <div>
                    Welcome to Shinyang Shipping Cargo Management System!

                </div>
                <div className="site-index">

                    <div className="row">
                        {userRuleSet.length > 0 ? <PendingDocumentCard /> : ""}
                        {userRuleSet.length > 0 ? <VoyageDelayDocument /> : ""}





                    </div>
                </div>
            </>
        )
    }


    return (

        // <section className="content">
        <DocumentCard />
        // </section>


    )
}

export default Home