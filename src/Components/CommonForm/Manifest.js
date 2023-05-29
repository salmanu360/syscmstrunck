import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, UpdateData, ToastNotify, ControlOverlay, GetAllDropDown,getCookie, initHoverSelectDropownTitle, replaceNull, sortArray, manifestCollectAttachment } from '../../Components/Helper.js'
import Select from 'react-select'
import AsyncSelect from 'react-select/async';
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/flatpickr.min.css";
import moment from "moment";
import NoticeOfArrival from './NoticeOfArrival';
import {MyVoyageModal, ManifestEmailModal} from '../ModelsHelper';
import $ from "jquery";
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


function Manifest(props) {
    var ContainerUUIDLink;
    var BLuuid = [];
    var containerUUID = [];
    var BLidlink;
    var arrayLatestColumn=[];
    var ExportManifestType;
    if (props.data.modelLink == "manifest-import") {
        ExportManifestType = "IMPORT"
    } else if (props.data.modelLink == "manifest-export") {
        ExportManifestType = "EXPORT"
    } else {
        ExportManifestType = "TRANSHIPMENT"
    }

    var selections = [];
    var selectedRow = [];
    var orderBy = { "DocNum": "SORT_ASC" }
    const { state } = useLocation();
    const [formState, setFormState] = useState({ formType: "New" });
    const globalContext = useContext(GlobalContext);
    const params = useParams();
    const navigate = useNavigate();

    const [voyage, setVoyage] = useState([])
    const [containerType, setContainerType] = useState([])
    const [port, setPort] = useState([])
    const [disabledState, setDisabledState] = useState(true)
    const [makeChangesState, setMakeChangesState] = useState()
    const [customerTypeData, setCustomerTypeData] = useState("")
    const [selectedState, setSelectedState] = useState()
    
 
    var modelLinkTemp;
    if (globalContext.userRule !== "") {
         modelLinkTemp=props.data.modelLink
        const objRule = JSON.parse(globalContext.userRule);
        var filteredAp = objRule.Rules.filter(function (item) {
          return item.includes(modelLinkTemp);
        });
        
    }

    function handleFindList() {


        if ($("input[name='DynamicModel[Agent]']").val() == "") {
            alert("Agent cannot be empty!");
        } else if ($("input[name='DynamicModel[VoyageNumber]']").val() == "") {
            alert("Voyage No cannot be empty!");
        } else if ($("input[name='DynamicModel[POL]']").val() == "") {
            alert("POL cannot be empty!");
        } else if (props.data.modelLink == "manifest-transhipment") {
            if ($("input[name='DynamicModel[POT]']").val() == "") {
                alert("POT cannot be empty!");
            }
            else {
                GenerateTableList()
            }
        }
        else {

            GenerateTableList()
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

    function handlePreviewCustomManifest() {
        var getData = selectedState;
        var getBLIdsLink = [];

        $.each(getData, function (key, value) {
            getBLIdsLink.push(value.BillOfLadingUUID)
        });

        getBLIdsLink = getBLIdsLink.join();
        axios({
            url: globalContext.globalHost + globalContext.globalPathLink + props.data.modelLink + "/preview-custom-manifest?BLIDs=" + getBLIdsLink,
            method: "GET",
            responseType: 'arraybuffer',
            auth: {
                username: globalContext.authInfo.username,
                password: globalContext.authInfo.access_token
            }
        }).then((response) => {
            window.$("#PreviewPdfModal").modal("toggle");
            var file = new Blob([response.data], { type: 'application/pdf' });
            let url = window.URL.createObjectURL(file);
            //  window.open(url);

            $('#pdfFrame2').attr("src", url);
        });
    }

    function handlePreviewPortManifest() {
        // if (getPreviewPermission == true){
        var getData = selectedState;
        var getBLIdsLink = [];

        $.each(getData, function (key, value) {
            getBLIdsLink.push(value.BillOfLadingUUID)
        });

        getBLIdsLink = getBLIdsLink.join();

        axios({
            url: globalContext.globalHost + globalContext.globalPathLink + props.data.modelLink + "/preview-port-manifest?BLIDs=" + getBLIdsLink,
            method: "GET",
            responseType: 'arraybuffer',
            auth: {
                username: globalContext.authInfo.username,
                password: globalContext.authInfo.access_token
            }
        }).then((response) => {
            window.$("#PreviewPdfModal").modal("toggle");
            var file = new Blob([response.data], { type: 'application/pdf' });
            let url = window.URL.createObjectURL(file);
            //  window.open(url);

            $('#pdfFrame').attr("src", url);
        });

        // var NewBLLink="./preview-port-manifest?BLIDs="+getBLIdsLink;


        // $('#pdfFrame').attr("src", NewBLLink);

        // $('#PreviewPdfModal').modal('show');
        //   }else{
        //     alert("You are not allowed to Preview Manifest PDF, Please check your User Permission.")
        //     return false;
        //   }
    }

    function GenerateTableList() {

        selectedRow = [];
        selections = [];

        var defaultHide = [ // default field to hide in bootstrap table
            'VoyageNum',
            'DocDate',
            'VesselCode',
            'VesselName',
            'Agent',
            'POLETA',
            'PODETA',
            'POLAreaName',
            'PODAreaName',
        ];
        var orderBy = { "DocNum": "SORT_ASC" }
        var columns = [                                     // data from controller (actionGetBillOfLading) field and title to be included

            { field: 'DocNum', title: 'BL No', switchable: false },
            { field: 'DocDate', title: 'Date' },
            { field: 'billOfLadingShipper.CompanyName', title: 'Shipper' },
            { field: 'billOfLadingConsignee.CompanyName', title: 'Consignee' },
            { field: 'ContainerNo', title: 'Container No' },
            { field: 'SealNo', title: 'Seal No' },
            { field: 'QtyPkgs', title: 'Qty Pkgs' },
            { field: 'GoodsDescription', title: 'Description' },
            { field: 'TotalKgs', title: 'Kgs' },
            { field: 'TotalM3', title: 'M3' },
            { field: 'VoyageName', title: 'Voyage Num' },
            { field: 'VesselCode', title: 'Vessel ID' },
            { field: 'VesselName', title: 'Vessel Name' },
            { field: 'billOfLadingAgent.CompanyName', title: 'Agent' },
            { field: 'POLETA', title: 'Date of Arival' },
            { field: 'PODETA', title: 'Date of Departure' },
            { field: 'pOLPortCode.PortCode', title: 'POL' },
            { field: 'pODPortCode.PortCode', title: 'POD' },
            { field: 'POT', title: 'POT' },
            { field: 'VerificationStatus', title: 'BL Status' },

        ];
        var GetGridviewData = function (params) {
            var param = {
                limit: params.data.limit,
                offset: params.data.offset,
                sort: params.data.sort,
                filter: params.data.filter,
                order: params.data.order,
            }

            $.ajax({
                type: "POST",
                url: globalContext.globalHost + globalContext.globalPathLink + "bill-of-lading/find-bill-of-lading",
                data: {
                    orderBy: orderBy,
                    param: param,
                    DateFrom: getValues("DynamicModel[DateFrom]") ? getValues("DynamicModel[DateFrom]") : "",
                    DateTo: getValues("DynamicModel[DateTo]") ? getValues("DynamicModel[DateTo]") : "",
                    Agent: $("input[name='DynamicModel[Agent]']").val(),
                    Shipper: $("input[name='DynamicModel[Shipper]']").val(),
                    Consignee: $("input[name='DynamicModel[Consignee]']").val(),
                    VoyageNum: getValues("DynamicModel[VoyageNumber]") ? getValues("DynamicModel[VoyageNumber]") : "",
                    // VesselCode: $("#dynamicmodel-vesselid").val(),
                    QtyPkgs: getValues("DynamicModel[ContainerType]") ? getValues("DynamicModel[ContainerType]") : "",
                    POL: getValues("DynamicModel[POL]") ? getValues("DynamicModel[POL]") : "",
                    POT: getValues("DynamicModel[POT]") ? getValues("DynamicModel[POT]") : "",
                    POD: getValues("DynamicModel[POD]") ? getValues("DynamicModel[POD]") : "",
                },
                dataType: "json",
                headers: {
                    "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
                },
                success: function (data) {
                    // console.log(data)
                    BLuuid = [];

                    $.each(data.rows, function (key, value) {
                        // console.log(value[1])
                        var ContainerCode = "";
                        var SealCode = "";
                        var GoodsDescription = "";
                        var QtyPkgs = "";
                        var TotalKgs = 0.000;
                        var TotalM3 = 0.000;
                        //replace the null object to empty string
                        var replacedAgent = replaceNull(value.Agent, "");
                        var replacedShipper = replaceNull(value.Shipper, "");
                        var replacedConsignee = replaceNull(value.Consignee, "");
                        var replacedVoyageName = replaceNull(value.VoyageName, "");
                        var replacedBillofLading = replaceNull(value.BillOfLading, "");
                        var replacedBillofLadingHasContainers = replaceNull(value.billOfLadingHasContainers, "");
                        var replacedContainerCodes = replaceNull(value.ContainerCodes, "");
                        var replacedContainerTypes = replaceNull(value.ContainerTypes, "");

                        var Agent = replacedAgent.CompanyName;
                        var Shipper = replacedShipper.CompanyName;
                        var Consignee = replacedConsignee.CompanyName;
                        var VoyageName = replacedVoyageName;
                        // console.log(Shipper)

                        $.each(replacedBillofLadingHasContainers, function (key1, value1) {
                            if (key1 == 0) {
                                if (value1.GoodsDescription !== "") {
                                    GoodsDescription += value1.GoodsDescription;
                                }

                            }
                            else {
                                if (value1.GoodsDescription !== "") {
                                    GoodsDescription += ", " + value1.GoodsDescription;
                                }

                            }
                        });

                        $.each(replacedContainerCodes, function (key1, value1) {
                            if (key1 == 0) {
                                if (value1.ContainerCode !== undefined) {
                                    ContainerCode += value1.ContainerCode;
                                }
                            }
                            else {
                                if (value1.ContainerCode !== undefined) {
                                    ContainerCode += ", " + value1.ContainerCode;
                                }
                            }
                        });

                        $.each(replacedBillofLadingHasContainers, function (key1, value1) {
                            if (key1 == 0) {
                                if (value1.SealNum !== undefined) {
                                    SealCode += value1.SealNum;
                                }

                            }
                            else {
                                if (value1.SealNum !== undefined) {
                                    SealCode += ", " + value1.SealNum;
                                }

                            }
                        });

                        $.each(replacedBillofLadingHasContainers, function (key1, value1) {
                            var kgs = value1.GrossWeight.replace(",", "");
                            var M3 = value1.M3.replace(",", "");
                            if (kgs == "") {
                                var kgs = 0.00;
                                TotalKgs = TotalKgs + parseFloat(kgs);
                            }
                            else {
                                TotalKgs = TotalKgs + parseFloat(kgs);
                            }
                            if (M3 == "") {
                                var M3 = 0.00;
                                TotalM3 = TotalM3 + parseFloat(M3);
                            }
                            else {
                                TotalM3 = TotalM3 + parseFloat(M3);
                            }
                        });

                        var CountPkgs = [];
                        $.each(replacedContainerTypes, function (key1, value1) {
                            if (value1.ContainerType !== undefined) {
                                CountPkgs.push(value1.ContainerType);
                            }

                        });
                        var count = {};
                        CountPkgs.forEach(function (i) { count[i] = (count[i] || 0) + 1; });
                        var ValuesCount = Object.values(count);
                        var KeysCount = Object.keys(count);

                        for (var i = 0; i < Object.values(count).length; i++) {
                            QtyPkgs += ValuesCount[i] + "X" + KeysCount[i] + ",";
                        }
                        QtyPkgs = QtyPkgs.replace(/,\s*$/, "");


                        data["rows"][key].ContainerNo = ContainerCode;
                        data["rows"][key].SealNo = SealCode;
                        data["rows"][key].GoodsDescription = GoodsDescription;
                        data["rows"][key].TotalKgs = TotalKgs.toFixed(4);
                        data["rows"][key].TotalM3 = TotalM3.toFixed(4);
                        data["rows"][key].QtyPkgs = QtyPkgs;
                        data["rows"][key].Agent = Agent;
                        data["rows"][key].Shipper = Shipper;
                        data["rows"][key].Consignee = Consignee;
                        data["rows"][key].VoyageName = VoyageName;
                        BLuuid.push(data["rows"][key].BillOfLadingUUID);
                        // PODeta.push(data[key].PODETA);
                        // PODetd.push(data[key])
                        // console.log(value1.BillOfLadingUUID)

                    });
                    BLidlink = "./preview?BLIDs=" + BLuuid + ""

                    // console.log(BLuuid);

                    params.success({
                        "rows": data.rows,
                        "total": data.total
                    })
                }
            });

        }
        initTable({
            tableSelector: `#${props.data.modelLink}-table`,  // #tableID
            toolbarSelector: '#toolbar',                   // #toolbarID
            columns: columns,
            hideColumns: defaultHide, // hide default column. If there is no cookie
            cookieID: `${props.data.modelLink}-table`,               // define cookie id 
            functionGrid: GetGridviewData,
        });
    }

    function handlePreview() {

    }


    function responseHandler(res) {
        $.each(res.rows, function (i, row) {
            row.state = $.inArray(row.id, selections) !== -1
        })
        return res
    }

    function columnSetup(columns) {
        //check for dnd page and remove checkbox
        if ((window.location.href).includes("dnd")) {
            var res = [];
        } else {
            var res = [
                {
                    field: 'state',
                    checkbox: true,
                    rowspan: 1,
                    align: 'center',
                    valign: 'middle'
                }
            ];
        }
      
        if(columns){
            var NewColumn=columns.map(obj => ({ ...obj }));
            arrayLatestColumn=NewColumn
            //check for reorder column cookies
            if (getCookie(`${props.data.modelLink}-table.bs.table.reorderColumns`)) {
              var getCookieArray = getCookie(`${props.data.modelLink}-table.bs.table.reorderColumns`);
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

        // res.push({
        //   field: 'operate',
        //   title: 'Item Action',
        //   align: 'center',
        //   switchable: false,
        //   clickToSelect: false,
        //   formatter: operateFormatter
        // })



        return res;
    }
    
    function handleSubmitManifest(type) {
        var getData = selectedState;
        var AllObj = [];
        var typeNo;

        if (type == "manifest-import") {
            typeNo = 3
        } else if (type == "manifest-export") {
            typeNo = 2
        } else {
            typeNo = 6
        }

        $.each(getData, function (key, value) {
            AllObj.push(value.BillOfLadingUUID)
        });
        
        if (AllObj.length == 0) {
            alert("No data selected");
        } else {
            $.ajax({
                type: "POST",
                url: globalContext.globalHost + globalContext.globalPathLink + "manifest/submitxml",
                dataType: "json",
                data: { BLUUID: AllObj, ManifestType: typeNo },
                headers: {
                    "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
                },
                success: function (data) {
                    console.log(data)
                    if(data.message == "Please check all your Bill Of Lading! Make sure all are approved!"){
                        alert("Please check all your Bill Of Lading! Make sure all are approved!")
                    }
                    else if (data.failed.length < 1) {
                        var SuccessDocNum = (data.success).join(",");
                        alert(SuccessDocNum + " Manifest successfully submitted.")
                    }
                    else {
                        var FailedDocNUm = (data.failed).join(",");
                        if (data.success.length > 0) {
                            var SuccessDocNum = (data.success).join(",");
                            alert(SuccessDocNum + " Manifest successfully submitted\n\n" + FailedDocNUm + " Manifest has been submitted, please proceed to review status.\n")
                        }
                        else {
                            alert(FailedDocNUm + " Manifest has been submitted, please proceed to review status.")
                        }

                    }
                }
            })
        }
    }

    function handleMyVoyageSelect(){
        var BLUUIDs = []
        $.each(selectedState, function(key,value){
            BLUUIDs.push(value.BillOfLadingUUID)
        })
        if(BLUUIDs.length<=0){
            alert("No data selected");
        }else{
            $("#selectedBLUUIDs").val(BLUUIDs.toString())
            setValue("PreviousVoyage", selectedState[0]["VoyageNum"])
            window.$("#MyVoyageModal").modal('toggle')
        }
    }

    function previewPDFNOAWithoutEdit(type){
        var getData = selectedState;

        var today = new Date();
        // set date format
        var dateFormat = " DD, dd MM, yy";
        // format the date using jQuery
        var formattedDate = window.$.datepicker.formatDate(dateFormat, today);

        if(type=="single"){
            var ConsigneeAttentionName =getData[0]["billOfLadingConsignee"]["AttentionName"]
            var ConsigneeCompanyFax =getData[0]["billOfLadingConsignee"]["BranchFax"]
            var ConsigneeCompanyName=getData[0]["billOfLadingConsignee"]['CompanyName']
            var LoginUser=globalContext["authInfo"]["username"]
            var VesselCode=getData[0]["VesselCode"]
            var VesselName=getData[0]["VesselName"]
            var VoyageNum=getData[0]["VoyageName"]
            var PODETA=getData[0]["PODETA"]
            var BLDocNum=getData[0]["DocNum"]
            var QtyPkgs=getData[0]["QtyPkgs"]
            var POL=getData[0]["POLAreaName"]
            var POD=getData[0]["PODAreaName"]
            var PODETA=getData[0]["PODETA"]
            var ContainerNo=getData[0]["ContainerNo"]
            var PODSCNCode=getData[0]["PODSCNCode"]
            var PODLocationCode=getData[0]["pODLocationCode"]?getData[0]["pODLocationCode"]['LocationCode'] :""
            var ManifestNo=getData[0]["billOfLadingHasManifests"]?getData[0]["billOfLadingHasManifests"]['DocNum'] :""
            var AgentCode=getData[0]["billOfLadingAgent"]?getData[0]["billOfLadingAgent"]['rOC']?getData[0]["billOfLadingAgent"]['rOC']["AgentCode"]:"" :""
            // var PODETAMultiple=customerTypeData.PODETA
    
            var defaultTopDetailSingle =`<p><span style="font-size: 16px; font-weight: bolder;">Date ${formattedDate}</span><br></p>
            <p><span style="font-weight: bolder; font-size: 0.875rem;">
            <table style="margin: 0 auto; text-align: center; width: 100%"><tbody>
            <tr><td style="font-size: 16px; text-align: left;"><b>Attn &nbsp;&nbsp;: ${ConsigneeAttentionName} </b></td><td style="font-size: 16px; text-align: left; "><b>Fax  &nbsp;&nbsp;&nbsp;: ${ConsigneeCompanyFax}</b><br></td></tr>
            <tr><td colspan="2" style="font-size: 16px; text-align: left;"><b>To   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ${ConsigneeCompanyName} </b></td></tr>
            <tr><td colspan="2" style="font-size: 16px; text-align: left;"><b>From : ${LoginUser} </b></td></tr>
            </tbody></table>
            <table style="margin: 0 auto; text-align: center;"><tbody>
            <tr><td style="font-size: 16px;"><b>Vessel&nbsp; :</b><br></td><td style="font-size: 16px; text-align: left; ">${VesselName} ${VoyageNum}<br></td></tr>
            <tr><td style="font-size: 16px;"><b>ETA&nbsp; &nbsp; &nbsp; :</b><br></td><td style="text-align: left; font-size: 16px;">${PODETA}<br></td></tr>
            <tr><td style="font-size: 16px;"><b>B/L No&nbsp; :</b></td><td style="text-align: left; font-size: 16px;">${BLDocNum}<br></td></tr></tbody></table>
            <div style="text-align: center;"><span style="font-size: 16px;">${QtyPkgs} CONTR STC : ${ContainerNo}</span></div>
            <div style="text-align: left;"><span style="font-size: 16px;"><br></span></div><div style="text-align: center;"><span style="font-size: 16px;"><u><b>Shipment From ${POL} to ${POD}</b></u></span></div>
            <div style="text-align: center;"><span style="font-size: 16px;"><u><b><br></b></u></span></div>
            <table style="margin: 0 auto; text-align: center; width: 100%"><tbody>
            <tr><td style="font-size: 16px; text-align: left;"><b>CONSIGNEE &nbsp;: ${ConsigneeCompanyName} </b></td><td style="font-size: 16px; text-align: right; "><b>READY ON ${PODETA}</b><br></td></tr>
            </tbody></table>
            <div style="text-align: justify;"><span style="font-size: 14px;"><span style="font-size: 16px;">The about vessel is a arrive at <b>${POD}</b> on <u style="font-weight: bold;">${PODETA}</u>&nbsp;and according to the cargo manifest there is cargo on board consigned to you.</span></span></div>
            <div style="text-align: justify;"><span style="font-size: 14px;"><span style="font-size: 16px;"><br></span></span></div><div style="text-align: justify;"><span style="font-size: 14px;"><span style="font-size: 16px;">You are advised to present us your endorsed Bill Of Lading / Banker's Guarantee Duly Endorsed through your Forwarding Agent, as soon as possible in exchange for which we will issue our Delivery Order to enable you to effect for clearance.</span></span></div>
            <div style="text-align: justify;"><span style="font-size: 14px;"><span style="font-size: 16px;"><br></span></span></div><div style="text-align: justify;"><span style="font-size: 14px;"><span style="font-size: 16px;">Your prompt action is necessary for any storage demurrage or detention charges that mat incur on your</span></span><br>
            <br><br>
            <table style="margin: 0px auto; text-align: center;"><tbody>
            <tr><td style="font-size: 16px;"><b>SHIP ID&nbsp; &nbsp; &nbsp; &nbsp;:<br></b></td><td style="font-size: 16px; text-align: left;">${VesselCode}<br></td></tr>
            <tr><td style="font-size: 16px;"><b>S/AGENT&nbsp; &nbsp; &nbsp;:<br></b></td><td style="text-align: left; font-size: 16px;">${AgentCode}<br></td></tr>
            <tr><td style="font-size: 16px;"><b>SCN No&nbsp; &nbsp; &nbsp; &nbsp; :</b></td><td style="text-align: left; font-size: 16px;">${PODSCNCode}<br></td></tr>
            <tr><td style="font-size: 16px;"><b>TERMINAL :</b></td><td style="text-align: left; font-size: 16px;">${PODLocationCode}</td></tr>
            <tr><td style="font-size: 16px;"><b>M/FEST NO :&nbsp;</b></td><td style="text-align: left; font-size: 16px;">${ManifestNo}</td></tr></tbody></table></div>`
    
            HandlePreviewNOA(type, defaultTopDetailSingle)
        }else{
            var VesselNameMultiple=getData[0]["VesselName"]
            var VoyageNumMultiple=getData[0]["VoyageName"]
            var POLMultiple=getData[0]["POLAreaName"]
            var PODMultiple=getData[0]["PODAreaName"]
            var PODETAMultiple=getData[0]["PODETA"]

            var defaultTopDetailMultiple =`<p>Our Ref:SYS/<strong>${VesselNameMultiple} ${VoyageNumMultiple}</strong></p>
            <p><strong>${formattedDate}</strong></p>
            <p>To Our Valued Customer,</p>
            <p><strong><u>RE : VESSEL ARRIVAL NOTICE</u></strong></p>
            <p>We are pleased to inform that <strong>${VesselNameMultiple} ${VoyageNumMultiple}</strong> from ${POLMultiple} to ${PODMultiple} E.T.A on <strong>${PODETAMultiple}</strong></p> 
             <p><strong>Free period start calculate on the following date after date of container discharge/delivery exceeding the period will be charged as per below listed:</strong></p>

            <table className="NOAMultiple table" style="fontWeight:bold;border:1px solid black;border-collapse:collapse"> <thead> <tr> <th style="border:1px solid black;border-collapse:collapse">Description</th> <th style="border:1px solid black;border-collapse:collapse">No.Days</th> <th colSpan="2" style="border:1px solid black;border-collapse:collapse;">(RM)/day 20'/40' GP</th> <th colSpan="2" style="border:1px solid black;border-collapse:collapse;">(RM)/day 20'/40' RF</th> <th style="border:1px solid black;border-collapse:collapse;">Description</th> <th style="border:1px solid black;border-collapse:collapse;">No.Weeks</th> <th style="border:1px solid black;border-collapse:collapse;">(RM)/week 20'GP</th> <th style="border:1px solid black;border-collapse:collapse;">(RM)/week 40'GP</th> <th style="border:1px solid black;border-collapse:collapse;">(RM)/week 40'HC</th> </tr> </thead> <tbody> <tr> <td rowSpan="6" style="border:1px solid black;border-collapse:collapse">Detention&<br/>Demurage(D&D)</td> </tr> <tr> <td style="border:1px solid black;border-collapse:collapse">Free Days</td> <td style="border:1px solid black;border-collapse:collapse">20'</td> <td style="border:1px solid black;border-collapse:collapse">40'</td> <td style="border:1px solid black;border-collapse:collapse">20'</td> <td style="border:1px solid black;border-collapse:collapse">40'</td> <td rowSpan="6" style="border:1px solid black;border-collapse:collapse">Miri Port Storage & SY Wharf Storage(Exclusive weekends)</td> <td style="border:1px solid black;border-collapse:collapse">7 Days</td> <td style="border:1px solid black;border-collapse:collapse">FOC</td> <td style="border:1px solid black;border-collapse:collapse">FOC</td> <td style="border:1px solid black;border-collapse:collapse">FOC</td> </tr> <tr> <td style="border:1px solid black;border-collapse:collapse">1-3 days</td> <td style="border:1px solid black;border-collapse:collapse">50</td> <td style="border:1px solid black;border-collapse:collapse">75</td> <td style="border:1px solid black;border-collapse:collapse">150</td> <td style="border:1px solid black;border-collapse:collapse">180</td> <td style="border:1px solid black;border-collapse:collapse">1st</td> <td style="border:1px solid black;border-collapse:collapse">50</td> <td style="border:1px solid black;border-collapse:collapse">100</td>
            <td style="border:1px solid black;border-collapse:collapse">150</td> </tr> <tr> <td style="border:1px solid black;border-collapse:collapse;">4-7 days</td> <td style="border:1px solid black;border-collapse:collapse;">75</td> <td style="border:1px solid black;border-collapse:collapse;">112.50</td> <td style="border:1px solid black;border-collapse:collapse;">200</td> <td style="border:1px solid black;border-collapse:collapse;">240</td> <td style="border:1px solid black;border-collapse:collapse;">2nd</td> <td style="border:1px solid black;border-collapse:collapse;">90</td> <td style="border:1px solid black;border-collapse:collapse;">180</td> <td style="border:1px solid black;border-collapse:collapse;">210</td> </tr> <tr> <td rowSpan="2" style="border:1px solid black;border-collapse:collapse;">After 8days</td> <td rowSpan="2" style="border:1px solid black;border-collapse:collapse;">100</td> <td rowSpan="2" style="border:1px solid black;border-collapse:collapse;">150</td> <td rowSpan="2" style="border:1px solid black;border-collapse:collapse;">250</td> <td rowSpan="2" style="border:1px solid black;border-collapse:collapse;">300</td> <td style="border:1px solid black;border-collapse:collapse;" >3rd</td> <td style="border:1px solid black;border-collapse:collapse;">140</td> <td style="border:1px solid black;border-collapse:collapse;">280</td> <td style="border:1px solid black;border-collapse:collapse;">320</td> </tr> <tr> <td style="border:1px solid black;border-collapse:collapse;">4th</td> <td style="border:1px solid black;border-collapse:collapse;" >200</td> <td style="border:1px solid black;border-collapse:collapse;">400</td> <td style="border:1px solid black;border-collapse:collapse;">450</td> </tr> </tbody> </table>
            
            <br><p>We will arrange for cargo clearance upon receiving your customs document. However, please to inform that any destination T.H.C <strong><u>RM 295.00/20' & RM 440.00/40'</u></strong> and D/O fee <strong><u>RM 195.00</u></strong> must payable by your Company <strong>before releasing</strong> the above containers.</p>
             <p><strong><u>Empty return place : Krokop 5 Shin Yang Wharf (K5 Wharf)</u></strong></p>
             <p style="margin:0px">Should you have any problem on your shipping documents you can contact our Customer Services team at 085-428399:</p>
             <br/>
             <p style="text-indent:30px;margin:0px"><strong>C.S: EXT.329 - Ms. Mei</strong></p>
             <p style="text-indent:30px;margin:0px"><strong>C.S: EXT.342 - Ms. Stepfonila</strong></p>
             <p style="text-indent:30px;margin:0px"><strong>C.S: EXT.330 - Ms. Awell</strong></p>
             <p style="text-indent:30px;margin:0px"><strong>(Import Leader: Charles Sii Ext.347)</strong></p>
             <br/>
             <p style="margin:0px">All documents must be deliver or email to us at least <strong>2 WORKING DAY/EARLIER</strong> before your containers could be released.</p>
             <p style="margin:0px">All documents <strong>MUST</strong> be in <strong>PROPER</strong> seal and <strong>RECORD/ATTN: MS MEI/IMPORT TEAM</strong> before pass to us to avoid missing documents.</p>
             <p style="margin:0px">Your Kind attention will be highly appreciated. Thank you</p>`

             HandlePreviewNOA(type,defaultTopDetailMultiple)

          
        }



    }

    function handleEmail(type){
        var getData = selectedState;
        var AllObj = [];

        $.each(getData, function (key, value) {
            AllObj.push(value.BillOfLadingUUID)
        });

        if (AllObj.length == 0) {
            alert("No data selected");
        } else {
            manifestCollectAttachment(AllObj, globalContext).then(res => {
                $("#ManifestEmailModal").find(".zipFilePath").val(JSON.stringify(res))

                var BLIDs = []
                $.each(getData,function(index,value){
                    BLIDs.push(value.BillOfLadingUUID)
                })
                
                $("#ManifestEmailModal").find(".manifestType").val(type)
                $("#ManifestEmailModal").find(".voyageUUIDs").val(getData[0]["VoyageName"])
                $("#ManifestEmailModal").find(".selectedBLUUIDs").val(BLIDs.toString())
    
                window.$("#ManifestEmailModal").modal("toggle")
            })
        }
    
    }

    function handleNOA(type){
        var getData = selectedState;
        var AllObj = [];

        $.each(getData, function (key, value) {
            AllObj.push(value.BillOfLadingUUID)
        });
        
        if (AllObj.length == 0) {
            alert("No data selected");
        } else {
            window.$("#NOAModal").modal('toggle')
            $("#NOAModal").find(".manifestType").val(type)
        }
    
    }

    function handleCustomer(customerType){
        var getData = selectedState;
        $(".customerModalType").val(customerType)
        if(customerType=="single"){
            $("#CustomerModal").find(".modal-title").text("Single Customer")
            if(customerType=="single" && getData.length>=2){
                alert("Single Customer can only choose single Bill Of Lading")
            }else{
                window.$("#CustomerModal").modal('toggle')
            }
        }else{
            var isSamePort = getData.every(function(obj, index, array) {
                return obj.PODPortCode === array[0].PODPortCode;
              });
              var isSameETA = getData.every(function(obj, index, array) {
                return obj.PODETA === array[0].PODETA;
              });
              if(isSamePort && isSameETA){
                $("#CustomerModal").find(".modal-title").text("Multiple Customer")
                window.$("#CustomerModal").modal('toggle')
              }else{
                alert("Document choosen must have the same POD and POD ETA.")
              }
         
          
        }

        
        
    }

    function handleMakeChanges(customerModalType){
        var getData = selectedState;
        setMakeChangesState(customerModalType)

        if(customerModalType=="single"){
            setCustomerTypeData({
                ConsigneeAttentionName :getData[0]["billOfLadingConsignee"]["AttentionName"],
                ConsigneeCompanyFax :getData[0]["billOfLadingConsignee"]["BranchFax"],
                ConsigneeCompanyName:getData[0]["billOfLadingConsignee"]['CompanyName'],
                LoginUser:globalContext["authInfo"]["username"],
                VesselCode:getData[0]["VesselCode"],
                VesselName:getData[0]["VesselName"],
                VoyageNum:getData[0]["VoyageName"],
                PODETA:getData[0]["PODETA"],
                DocNum:getData[0]["DocNum"],
                QtyPkgs:getData[0]["QtyPkgs"],
                POL:getData[0]["POLAreaName"],
                POD:getData[0]["PODAreaName"],
                PODETA:getData[0]["PODETA"],
                ContainerNo:getData[0]["ContainerNo"],
                PODSCNCode:getData[0]["PODSCNCode"],
                PODLocationCode:getData[0]["pODLocationCode"]?getData[0]["pODLocationCode"]['LocationCode'] :"",
                ManifestNo:getData[0]["billOfLadingHasManifests"]?getData[0]["billOfLadingHasManifests"]['DocNum'] :"",
                AgentCode:getData[0]["billOfLadingAgent"]?getData[0]["billOfLadingAgent"]['rOC']?getData[0]["billOfLadingAgent"]['rOC']["AgentCode"]:"" :"",
            })
        }else{
            setCustomerTypeData({VesselName:getData[0]["VesselName"],VoyageNum:getData[0]["VoyageName"],POL:getData[0]["POLAreaName"],POD:getData[0]["PODAreaName"],PODETA:getData[0]["PODETA"]})
        }
        window.$("#MakeChangesModal").modal("toggle")
    }
    
    function handleReviewStatus(type) {
        // if (getReviewStatusPermission == true) {

        var getData = selectedState;
        var AllObj = [];
        var manifestType;

        if (type == "manifest-import") {
            manifestType = "IMPORT"
        } else if (type == "manifest-export") {
            manifestType = "EXPORT"
        } else {
            manifestType = "TRANSHIPMENT"
        }

        $.each(getData, function (key, value) {
            AllObj.push(value.BillOfLadingUUID)
        });



        if (AllObj.length == 0) {
            alert("No data selected");
        } else {
            $.ajax({
                type: "POST",
                url: globalContext.globalHost + globalContext.globalPathLink + "manifest/retrieve-ftp",
                data: { Obj: AllObj, Type: manifestType },
                dataType: "json",
                headers: {
                    "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
                },
                success: function (data) {
                    var Reference;
                    var Status;
                    $("#BLStatustableBody").empty()
                    $.each(data.data, function (key, value) {
                        var BLDocNum = value["billOfLading"]["DocNum"]
                        if (value.Status == "APPROVED") {
                            Reference = value.ManifestNum;
                            Status = value.Status
                        } else if (value.Status == "ERROR") {
                            Reference = value.Message
                            Status = value.Status
                        }
                        else {
                            Reference = ""
                            Status = "PENDING"
                        }
                        $("#BLStatustableBody").append("<tr><td>" + BLDocNum + "</td><td>" + Status + "</td><td>" + Reference + "</td></tr>");
                    });
                    window.$("#ReviewStatusModal").modal('toggle')
                }
            })
        }
        // } else {
        //     alert("You are not allowed to Review Status,Please check your User Permission.")
        // }
    }

    function HandlePreviewNOA(type, defaultPreview){
        var getData = selectedState;
        var urlLink
        if(type=="single"){
            var HTMLPDF =window.$('.topDetail').summernote('code')
            if(defaultPreview){
                HTMLPDF = defaultPreview
            }
            var formData = new FormData();
            formData.append("data",HTMLPDF)
        
            urlLink = globalContext.globalHost + globalContext.globalPathLink + "manifest/preview-notice-of-arrival-single"
            
        }else{
            var HTMLPDF =window.$('.topDetail').summernote('code')

            if(defaultPreview){
                HTMLPDF = defaultPreview
            }
            var formData = new FormData();
            formData.append("data",HTMLPDF)

            urlLink = globalContext.globalHost + globalContext.globalPathLink + "manifest/preview-notice-of-arrival-multiple"
        }
      
        // .post(globalContext.globalHost + globalContext.globalPathLink + "site/login", formData)

        const authInfo = JSON.parse(localStorage.getItem('authorizeInfos'));
        axios({
          url: urlLink,
          method: "POST",
          responseType: 'arraybuffer',
          auth: {
              username: authInfo.username,
              password: authInfo.access_token
          },
          data:formData,
        }).then((response) => {
            var file = new Blob([response.data], { type: 'application/pdf' });
            let url = window.URL.createObjectURL(file);

            window.$('#pdfFrameNOAList').attr('src', url);
            window.$("#PreviewPdfModalNOA").modal("toggle");
        })
    }

    function handlePDFPreview(){
        var getData = selectedState;
        var AllObj = [];

        $.each(getData, function (key, value) {
            AllObj.push(value.BillOfLadingUUID);
        })

        if (AllObj.length == 0) {
            alert("No data selected");
        } else {
            window.$("#PreviewPdfModal").modal('toggle')
        }
    }

    function handleExport(type) {
        var getData = selectedState;
        var AllObj = [];

        $.each(getData, function (key, value) {
            var ContainersArray = []
            $.each(value.ContainerCodes, function (key2, value) {
                ContainersArray.push(value.ContainerUUID)

            });

            var obj = {
                'BillOfLadingUUID': value.BillOfLadingUUID,
                'ContainerUUID': ContainersArray,
            }

            AllObj.push(obj);

        });
        // if (getDownloadPermission == true) {
        if (AllObj.length == 0) {
            alert("No data selected");
        } else {

            var today = new Date();
            var date = today.getDate() + '_' + (today.getMonth() + 1) + '_' + today.getFullYear();
            $.ajax({
                type: "POST",
                url: globalContext.globalHost + globalContext.globalPathLink + "manifest/tradeexport",
                data: {
                    Obj: AllObj,
                    ManifestType: ExportManifestType
                },
                headers: {
                    "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
                },
                success: function (data) {
                    var downloadLink = document.createElement("a");
                    var fileData = [data];

                    var blobObject = new Blob(fileData, {
                        type: "text/csv;charset=utf-8;"
                    });

                    var url = URL.createObjectURL(blobObject);
                    downloadLink.href = url;
                    downloadLink.download = "Manifest_" + date + ".csv";

                    /*
                    * Actually download CSV
                    */
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                }
            })
        }
        // } else {
        //     alert("You are not allowed to Export the Data, Please check your Permission.")
        // }



    }



    function initTable(args) {


        window.$(`#${props.data.modelLink}-table`).bootstrapTable('destroy').bootstrapTable({

            // height: '630',
            toolbar: args.toolbarSelector,
            minimumCountColumns: 0,
            pagination: true,
            pageList: [10, 50, 100, 500],
            idField: 'id',
            ajax: args.functionGrid,
            columns: columnSetup(args.columns),
            showRefresh: true,
            sidePagination: 'server',
            showColumns: true,
            showColumnsToggleAll: true,
            showExport: true,
            clickToSelect: true,
            resizable: true,
            reorderableColumns: true,
            exportTypes: ['excel', 'xlsx', 'pdf'],
            filterControl: true,
            cookie: "true",
            cookieExpire: '10y',
            cookieIdTable: args.cookieID,
            responseHandler: function (res) {
                $.each(res.rows, function (i, row) {
                    row.state = $.inArray(row.id, selections) !== -1
                })
                return res
            },
            onLoadSuccess: function () {
                var exportAcess=filteredAp.find((item) => item == `export-${modelLinkTemp}`) !== undefined
                if(!exportAcess){
                 window.$(".fixed-table-toolbar").find(".export").find(".dropdown-toggle").attr("disabled",true)
                }else{
                 window.$(".fixed-table-toolbar").find(".export").find(".dropdown-toggle").attr("disabled",false)
                }
                // $table.bootstrapTable('filterBy', args.filterSelector); // default show valid data only

                // if($table.bootstrapTable("getCookies")['columns'] == null){
                //   $.each(args.hideColumns, function(key, value){
                //     $table.bootstrapTable('hideColumn', value);
                //   });
                // }

            }


        });

        window.$(`#${props.data.modelLink}-table`).off('reorder-column.bs.table').on('reorder-column.bs.table', function (e, args) {
            var newLatestColumn = []
            if (getCookie(`${props.data.modelLink}-table.bs.table.reorderColumns`)) {
        
              var getCookieArray = getCookie(`${props.data.modelLink}-table.bs.table.reorderColumns`);
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

        window.$(`#${props.data.modelLink}-table`).off('check.bs.table uncheck.bs.table ' +
            'check-all.bs.table uncheck-all.bs.table').on('check.bs.table uncheck.bs.table ' +
            'check-all.bs.table uncheck-all.bs.table',
            function () {   
            
                // if (getPreviewPermission == true){
                   
                //   }
                //   if(getSubmissionPermission == true){
                //     $submit.prop('disabled', !$table.bootstrapTable('getSelections').length)
                //     $submitExport.prop('disabled', !$table.bootstrapTable('getSelections').length)
                //     $submitTranshipment.prop('disabled', !$table.bootstrapTable('getSelections').length)
                //   }
                //   if(getReviewStatusPermission == true){
                //     $reviewStatusImport.prop('disabled', !$table.bootstrapTable('getSelections').length)
                //     $reviewStatusExport.prop('disabled', !$table.bootstrapTable('getSelections').length)
                //     $reviewStatusTranshipment.prop('disabled', !$table.bootstrapTable('getSelections').length)
                //   }

                // save your data, here just save the current page
                // selections = getIdSelections()
                // push or splice the selections if you want to save all data selections
        })


        window.$(`#${props.data.modelLink}-table`).off('check.bs.table check-all.bs.table uncheck.bs.table uncheck-all.bs.table').on('check.bs.table check-all.bs.table uncheck.bs.table uncheck-all.bs.table',
            function (e, rowsAfter, rowsBefore) {
                // window.$("#previewpdf").prop('disabled', !window.$(`#${props.data.modelLink}-table`).bootstrapTable('getSelections').length)
                // window.$("#submit").prop('disabled', !window.$(`#${props.data.modelLink}-table`).bootstrapTable('getSelections').length)
                // window.$("#MyVoyage").prop('disabled', !window.$(`#${props.data.modelLink}-table`).bootstrapTable('getSelections').length)
                // window.$("#ReviewStatus").prop('disabled', !window.$(`#${props.data.modelLink}-table`).bootstrapTable('getSelections').length)                
                
                var rows = rowsAfter

                if (e.type === 'uncheck-all') {
                    rows = rowsBefore
                }
                var ids = $.map(!$.isArray(rows) ? [rows] : rows, function (row) {

                    return row.id
                })
                var rowSelected = $.map(!$.isArray(rows) ? [rows] : rows, function (row) {

                    return row

                })

                var func = $.inArray(e.type, ['check', 'check-all']) > -1 ? "union" : "difference"

                var func1 = $.inArray(e.type, ['check', 'check-all']) > -1 ? "union" : "difference"

                selectedRow = window._[func](selectedRow, rowSelected)
                selections = window._[func1](selections, ids)

                var CheckSelectedRow = [];

                $.each(selectedRow, function (key, value) {
                    $.each(selections, function (key2, value2) {
                        if (value.BillOfLadingUUID == value2) {
                            CheckSelectedRow.push(value)
                        }
                    });
                });
                selectedRow = CheckSelectedRow;
                setSelectedState(selectedRow)
                
            }
        )
    }
    
    useEffect(() => {


        setValue("DynamicModel[DateFrom]", "")
        setValue("DynamicModel[DateTo]", "")
        setValue("DynamicModel[Agent]", "")
        setValue("DynamicModel[Shipper]", "")
        setValue("DynamicModel[Consignee]", "")
        setValue("DynamicModel[VoyageNumber]", "")
        setValue("DynamicModel[ContainerType]", "")
        setValue("DynamicModel[POL]", "")
        setValue("DynamicModel[POT]", "")
        setValue("DynamicModel[POD]", "")
        // window.$("#submit").prop('disabled',true)

        GetAllDropDown(['Voyage', 'ContainerType', "Area"], globalContext).then(res => {

            var arrayVoyage = []
            var arrayContainerType = []
            var arrayPortCode = []

            $.each(res.Voyage, function (key, value) {
                arrayVoyage.push({ value: value.VoyageUUID, label: `${value.VoyageNumber}(${value.vessel.VesselCode})` })
            })

            $.each(res.ContainerType, function (key, value) {
                arrayContainerType.push({ value: value.ContainerTypeUUID, label: value.ContainerType })
            })

            $.each(res.Area, function (key, value) {
                arrayPortCode.push({ value: value.AreaUUID, label: value.PortCode })
            })


            setVoyage(sortArray(arrayVoyage))
            setContainerType(sortArray(arrayContainerType))
            setPort(sortArray(arrayPortCode))

        })

        var defaultHide = [ // default field to hide in bootstrap table
            'VoyageNum',
            'DocDate',
            'VesselCode',
            'VesselName',
            'Agent',
            'POLETA',
            'PODETA',
            'POLAreaName',
            'PODAreaName',
        ];
        var orderBy = { "DocNum": "SORT_ASC" }
        var columns = [                                     // data from controller (actionGetBillOfLading) field and title to be included

            { field: 'DocNum', title: 'BL No', switchable: false },
            { field: 'DocDate', title: 'Date' },
            { field: 'billOfLadingShipper.CompanyName', title: 'Shipper' },
            { field: 'billOfLadingConsignee.CompanyName', title: 'Consignee' },
            { field: 'ContainerNo', title: 'Container No' },
            { field: 'SealNo', title: 'Seal No' },
            { field: 'QtyPkgs', title: 'Qty Pkgs' },
            { field: 'GoodsDescription', title: 'Description' },
            { field: 'TotalKgs', title: 'Kgs' },
            { field: 'TotalM3', title: 'M3' },
            { field: 'VoyageName', title: 'Voyage Num' },
            { field: 'VesselCode', title: 'Vessel ID' },
            { field: 'VesselName', title: 'Vessel Name' },
            { field: 'billOfLadingAgent.CompanyName', title: 'Agent' },
            { field: 'POLETA', title: 'Date of Arival' },
            { field: 'PODETA', title: 'Date of Departure' },
            { field: 'pOLPortCode.PortCode', title: 'POL' },
            { field: 'pODPortCode.PortCode', title: 'POD' },
            { field: 'POT', title: 'POT' },


        ];
        initTable({
            tableSelector: `#${props.data.modelLink}-table`,  // #tableID
            toolbarSelector: '#toolbar',                   // #toolbarID
            columns: columns,
            hideColumns: defaultHide, // hide default column. If there is no cookie
            cookieID: `${props.data.modelLink}-table`,               // define cookie id 
            // functionGrid: GetGridviewData,
        });

        return () => {

        }
    }, [props.data.model])


    const { register, handleSubmit, setValue, trigger, getValues, unregister, clearErrors, reset, control, watch, formState: { errors } } = useForm({
        mode: "onChange",
        defaultValues:"",
    });

    return (

        <>
            <div className="card card-primary">
                <div className="card-body">

                    <div className="card lvl1">

                        {/* <div class="row">
                            <div class="col">
                        
                                    <label for="DocDate" class="ml-4">Date:</label>
                            </div>
                            <div class="col-2">
                                <div class="form-group">
                                    <input type="text" class="form-control DateFrom flatDatePicker mx-sm-3" id="DateFrom"></input>
                                </div>
                            </div>
                            <div class="col-md-1">
                                <div class="form-group">
                                    <input type="text" class="form-control mx-sm-3 borderless" value='To' readonly></input>
                                </div>
                            </div>
                            <div class="col-2">
                                <div class="form-group">
                                    <input type="text" class="form-control DateTo flatDatePicker mx-sm-3" id="DateTo"></input>
                                </div>
                            </div>
                            <div class="col-3"></div>
                            <div class="col-3"></div>
                            <div class="col-3"></div>
                        </div> */}


                        <table className="mt-2 mb-2 ml-2">
                            <thead>
                                <tr>
                                    <th style={{ width: "10%" }}></th>
                                    <th style={{ width: "20%" }}></th>
                                    <th style={{ width: "10%" }}></th>
                                    <th style={{ width: "20%" }}></th>
                                    <th style={{ width: "10%" }}></th>
                                    <th style={{ width: "20%" }}></th>
                                </tr>

                            </thead>

                            <tbody>
                                <tr>
                                    <td>
                                        <div className="col mb-1">
                                            <label> Date:</label>

                                        </div>
                                    </td>

                                    <td>
                                        <div className="col mb-1">
                                            <div className="form-group">
                                                <Controller

                                                    control={control}
                                                    name={"DynamicModel[DateFrom]"}
                                                    render={({ field: { onChange, value } }) => (
                                                        <>
                                                            <Flatpickr

                                                                value={value ? value : ""}
                                                                {...register(`DynamicModel[DateFrom]`)}
                                                                onChange={val => {

                                                                    onChange(moment(val[0]).format("DD/MM/YYYY"))
                                                                }}
                                                                className={`form-control flatpickr-input`}
                                                                options={{

                                                                    dateFormat: "d/m/Y"
                                                                }}

                                                            />
                                                        </>
                                                    )}
                                                />
                                            </div>

                                        </div>
                                    </td>

                                    <td>
                                        <div className="col mb-1">
                                            To

                                        </div>
                                    </td>

                                    <td>
                                        <div className="col mb-1">
                                            <div className="form-group">
                                                <Controller

                                                    control={control}
                                                    name={"DynamicModel[DateTo]"}
                                                    render={({ field: { onChange, value } }) => (
                                                        <>
                                                            <Flatpickr

                                                                value={value ? value : ""}
                                                                {...register(`DynamicModel[DateTo]`)}
                                                                onChange={val => {

                                                                    onChange(moment(val[0]).format("DD/MM/YYYY"))
                                                                }}
                                                                className={`form-control flatpickr-input`}
                                                                options={{

                                                                    dateFormat: "d/m/Y"
                                                                }}

                                                            />
                                                        </>
                                                    )}
                                                />
                                            </div>

                                        </div>
                                    </td>



                                </tr>
                                <tr>


                                    {/* <td>
                                        <div className="col mb-1">
                                            <label> Date:</label>

                                        </div>
                                    </td> */}



                                    <td>
                                        <div className="col mb-1">
                                            <label> Agent:</label>

                                        </div>
                                    </td>
                                    <td>
                                        <div className="col-xs-12 col-md-12 mt-2">
                                            <div className="form-group">
                                                <Controller
                                                    name="DynamicModel[Agent]"
                                                    id="Agent"
                                                    control={control}

                                                    render={({ field: { onChange, value } }) => (

                                                        <AsyncSelect
                                                            isClearable={true}
                                                            value={(value)}
                                                            {...register("DynamicModel[Agent]")}
                                                            cacheOptions
                                                            placeholder={globalContext.asyncSelectPlaceHolder}
                                                            onChange={e => { e == null ? onChange(null) : onChange(e.id); }}
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
                                    </td>
                                    <td>
                                        <div className="col mb-1">
                                            <label>Shipper:</label>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="col-xs-12 col-md-12 mt-2 ">
                                            <div className="form-group">
                                                <Controller
                                                    name="DynamicModel[Shipper]"
                                                    id="Shipper"
                                                    control={control}

                                                    render={({ field: { onChange, value } }) => (

                                                        <AsyncSelect
                                                            isClearable={true}
                                                            value={(value)}
                                                            {...register("DynamicModel[Shipper]")}
                                                            cacheOptions
                                                            placeholder={globalContext.asyncSelectPlaceHolder}
                                                            onChange={e => { e == null ? onChange(null) : onChange(e.id); }}
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
                                    </td>
                                    <td>
                                        <div className="col mb-1">
                                            <label>Consignee:</label>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="col-xs-12 col-md-12 mt-2">
                                            <div className="form-group">

                                                <Controller
                                                    name="DynamicModel[Consignee]"
                                                    id="Consignee"
                                                    control={control}

                                                    render={({ field: { onChange, value } }) => (

                                                        <AsyncSelect
                                                            isClearable={true}
                                                            value={value}
                                                            {...register("DynamicModel[Consignee]")}
                                                            cacheOptions
                                                            placeholder={globalContext.asyncSelectPlaceHolder}
                                                            onChange={e => { e == null ? onChange(null) : onChange(e.id); }}
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

                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="col mb-1">
                                            <label>Voyage No:</label>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="col-xs-12 col-md-12 mt-2">
                                            <div className="form-group">
                                                <Controller
                                                    name={"DynamicModel[VoyageNumber]"}

                                                    control={control}

                                                    render={({ field: { onChange, value } }) => (
                                                        <Select
                                                            isClearable={true}
                                                            {...register("DynamicModel[VoyageNumber]")}
                                                            value={value ? voyage.find(c => c.value === value) : null}
                                                            onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                            options={voyage}
                                                            menuPortalTarget={document.body}
                                                            className="basic-single voyageNumber"
                                                            classNamePrefix="select"
                                                            styles={globalContext.customStyles}

                                                        />
                                                    )}
                                                />

                                            </div>

                                        </div>

                                    </td>

                                    <td>
                                        <div className="col mb-1">
                                            <label>Container Type:</label>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="col-xs-12 col-md-12 mt-2">
                                            <div className="form-group">
                                                <Controller
                                                    name={"DynamicModel[ContainerType]"}

                                                    control={control}

                                                    render={({ field: { onChange, value } }) => (
                                                        <Select
                                                            isClearable={true}
                                                            {...register("DynamicModel[ContainerType]")}
                                                            value={value ? containerType.find(c => c.value === value) : null}
                                                            onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                            options={containerType}
                                                            menuPortalTarget={document.body}
                                                            className="basic-single containerType"
                                                            classNamePrefix="select"
                                                            styles={globalContext.customStyles}

                                                        />
                                                    )}
                                                />

                                            </div>

                                        </div>

                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="col mb-1">
                                            <label>POL:</label>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="col-xs-12 col-md-12 mt-2">
                                            <div className="form-group">
                                                <Controller
                                                    name={"DynamicModel[POL]"}

                                                    control={control}

                                                    render={({ field: { onChange, value } }) => (
                                                        <Select
                                                            isClearable={true}
                                                            {...register("DynamicModel[POL]")}
                                                            value={value ? port.find(c => c.value === value) : null}
                                                            onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                            options={port}
                                                            menuPortalTarget={document.body}
                                                            className="basic-single POL"
                                                            classNamePrefix="select"
                                                            styles={globalContext.customStyles}

                                                        />
                                                    )}
                                                />

                                            </div>

                                        </div>

                                    </td>


                                    <td>
                                        <div className="col mb-1">
                                            <label>POT:</label>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="col-xs-12 col-md-12 mt-2">
                                            <div className="form-group">
                                                <Controller
                                                    name={"DynamicModel[POT]"}

                                                    control={control}

                                                    render={({ field: { onChange, value } }) => (
                                                        <Select
                                                            isClearable={true}
                                                            {...register("DynamicModel[POT]")}
                                                            value={value ? port.find(c => c.value === value) : null}
                                                            onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                            options={port}
                                                            menuPortalTarget={document.body}
                                                            className="basic-single POT"
                                                            classNamePrefix="select"
                                                            styles={globalContext.customStyles}

                                                        />
                                                    )}
                                                />

                                            </div>

                                        </div>

                                    </td>

                                    <td>
                                        <div className="col mb-1">
                                            <label>POD:</label>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="col-xs-12 col-md-12 mt-2">
                                            <div className="form-group">
                                                <Controller
                                                    name={"DynamicModel[POD]"}

                                                    control={control}

                                                    render={({ field: { onChange, value } }) => (
                                                        <Select
                                                            isClearable={true}
                                                            {...register("DynamicModel[POD]")}
                                                            value={value ? port.find(c => c.value === value) : null}
                                                            onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                            options={port}
                                                            menuPortalTarget={document.body}
                                                            className="basic-single POD"
                                                            classNamePrefix="select"
                                                            styles={globalContext.customStyles}

                                                        />
                                                    )}
                                                />

                                            </div>

                                        </div>

                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="col">
                            <button type="button" className="btn btn-success float-right mb-3 mr-1" onClick={() => handleFindList(props.data.modelLink)}>Generate</button>
                        </div>
                    </div>

                    <div id="toolbar">
                        <button id="submit" type="button" className={`${filteredAp.find((item) => item == `submission-${modelLinkTemp}`) !== undefined ? "" : "disabledAccess"} btn btn-success  mr-1`} onClick={() =>handleSubmitManifest(props.data.modelLink)}>
                            <i className="fa fa-send"></i> Submit
                        </button>
                        <button type="button" id="previewpdf" className={`${filteredAp.find((item) => item == `preview-${modelLinkTemp}`) !== undefined ? "" : "disabledAccess"} btn btn-success  mr-1`} onClick={() =>handlePDFPreview(props.data.modelLink)}>
                            <i className="fa fa-send"></i> Preview PDF
                        </button>
                        <button type="button" id="Export" className={`${filteredAp.find((item) => item == `export-${modelLinkTemp}`) !== undefined ? "" : "disabledAccess"} btn btn-success  mr-1`} onClick={() => handleExport(props.data.modelLink)}>
                            <i className="fa fa-send"></i> Export
                        </button>
                        <button type="button" id="ReviewStatus" className={`${filteredAp.find((item) => item == `status-review-${modelLinkTemp}`) !== undefined ? "" : "disabledAccess"} btn btn-success mr-1`} onClick={() => handleReviewStatus(props.data.modelLink)}>
                            <i className="fa fa-send"></i> Review Status
                        </button>
                        {props.data.modelLink =="manifest-import"? 
                            <button type="button" id="MyVoyage" className={`btn btn-success mr-1`} onClick={() => handleMyVoyageSelect()}>
                                <i className="fa fa-send"></i> My Voyage
                            </button>
                        :""}
                        <button type="button" id="Email" title="Email" className={`${filteredAp.find((item) => item == `status-review-${modelLinkTemp}`) !== undefined ? "" : "disabledAccess"} btn btn-success mr-1`} onClick={() => handleEmail(props.data.modelLink)}>
                            <i className="fa fa-send"></i> Email
                        </button>
                        <button type="button" id="NOA" title="Notice Of Arrival" className={`${filteredAp.find((item) => item == `status-review-${modelLinkTemp}`) !== undefined ? "" : "disabledAccess"} btn btn-success`} onClick={() => handleNOA(props.data.modelLink)}>
                            <i className="fa fa-send"></i> NOA
                        </button>
                    </div>

                    <div className="indexTableCard">
                        <table id={`${props.data.modelLink}-table`} class="bootstrap_table">

                        </table>
                    </div>


                </div>

                <div className="modal fade" id="PreviewPdfModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Preview</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <button type="button" className="btn btn-primary mr-2" href="/syscms/backend/manifest-export/#" id="PDFPort" data-toggle="modal" data-target="#PreviewPdfModalPortManifest" onClick={handlePreviewPortManifest}>Port Manifest</button>
                                <button type="button" className="btn btn-primary mr-2" href="/syscms/backend/manifest-export/#" id="PDFCustom" data-toggle="modal" data-target="#PreviewPdfModalCustomManifest" onClick={handlePreviewCustomManifest}>Custom Manifest</button>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="modal fade" id="PreviewPdfModalPortManifest" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xl" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <iframe id="pdfFrame" src="" width="100%" height="700"></iframe>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="modal fade" id="PreviewPdfModalCustomManifest" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xl" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <iframe id="pdfFrame2" src="" width="100%" height="700"></iframe>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="ReviewStatusModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Review Status</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <table style={{ width: "100%" }} className="BLStatustable table-bordered">
                                    <thead>
                                        <tr>
                                            <th width="20%">BL</th>
                                            <th width="20%">Status</th>
                                            <th width="60%">Reference</th>
                                        </tr>
                                    </thead>
                                    <tbody id="BLStatustableBody">

                                    </tbody>
                                </table>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="NOAModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Notice of Arrival</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body"> 
                            <input type="hidden" className="manifestType"></input>          
                            <button type="button" className="btn btn-primary mr-2"  onClick={()=>handleCustomer("single")}>Single Customer</button>
                            <button type="button" className="btn btn-primary mr-2" onClick={()=>handleCustomer("multiple")}>Multiple Customer</button>                    
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="CustomerModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Notice of Arrival</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                            <input type="hidden" class="customerModalType"></input>
                            <button type="button" className="btn btn-primary mr-2" onClick={()=>previewPDFNOAWithoutEdit($(".customerModalType").val())}>Preview </button>
                            <button type="button" className="btn btn-primary mr-2" onClick={()=>handleMakeChanges($(".customerModalType").val())}>Make Changes</button>                    
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="MakeChangesModal" tabIndex="-1" role="dialog" aria-
                labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Notice of Arrival</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <NoticeOfArrival modelLink={props.data.modelLink} selectedState={selectedState} customerType={makeChangesState} customerTypeData={customerTypeData}/>
                                    
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-success" onClick={()=>HandlePreviewNOA($(".customerModalType").val())}>Preview</button>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="PreviewPdfModalNOA" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xl" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        </div>
                        <div className="modal-body">
                        <iframe id="pdfFrameNOAList" src="" width="100%" height="700"></iframe>

                        </div>
                        <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            
            <MyVoyageModal voyage={voyage} register={register} setValue={setValue} control={control}/>
            <ManifestEmailModal register={register} setValue={setValue} control={control} reset={reset} getValues={getValues} />
        </>


    )
}






export default Manifest