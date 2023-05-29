import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, UpdateData, ToastNotify, ControlOverlay, GetAllDropDown, getFindContainerStatus } from '../../Components/Helper.js'
import Select from 'react-select'
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/flatpickr.min.css";
import moment from "moment";
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




function Index(props) {
    const { state } = useLocation();
    const [formState, setFormState] = useState({ formType: "New" });
    const globalContext = useContext(GlobalContext);
    const params = useParams();
    const navigate = useNavigate();

    function replaceNull(someObj, replaceValue = "***") {
        const replacer = (key, value) =>
            String(value) === "null" || String(value) === "undefined" ? replaceValue : value;
        return JSON.parse(JSON.stringify(someObj, replacer));
    }

    useEffect(() => {

        $(document).on("click", ".ContainerDetailsShow", function () {
            var icon = $(this).find("i");
    
            if ($(this).closest(".shipping-instructions").find(".ContainerDetails").hasClass("d-none")) {
                icon.addClass("fa fa-minus").removeClass("fa fa-plus");
                $(this).closest(".shipping-instructions").find(".ContainerDetails").removeClass('d-none');
                $(this).closest(".shipping-instructions").find(".container-fluid").removeClass('d-none');

            }
            else {
                icon.addClass("fa fa-plus").removeClass("fa fa-minus");
                $(this).closest(".shipping-instructions").find(".ContainerDetails").addClass('d-none');
                $(this).closest(".shipping-instructions").find(".container-fluid").addClass('d-none');
            }
        })

        $(".GenerateRealTimeTracking").click(function () {
            $('#RealTimeTrack').empty();

            if (
                $("#ContainerCodeTrack").val() != "" ||
                $("#BLNo").val() != "" ||
                $("#BRNo").val() != ""
            ) {


                var filter = {
                    ContainerCode: $("#ContainerCodeTrack").val(),
                    BL: $("#BLNo").val(),
                    BR: $("#BRNo").val(),
                }
                getFindContainerStatus(filter, globalContext).then(res => {
                    if (res.data == "Invalid BL") {
                        alert("Bill Of Lading DocNum Not Found.")
                    }
                    else if (res.data == "Invalid BR") {
                        alert("Booking Reservation DocNum Not Found.")
                    }
                    else if (res.data == "") {
                        alert("No Data Found.")
                    }
                    else {
                        var html = "";
                        $.each(res.data, function (key, value) {
                            var ContainerRelease = replaceNull(value.ContainerRelease, "");
                            var ContainerGateIn = replaceNull(value.ContainerGateIn, "");
                            var ContainerLoaded = replaceNull(value.ContainerLoaded, "");
                            var ContainerDischarged = replaceNull(value.ContainerDischarged, "");
                            var ContainerGateOut = replaceNull(value.ContainerGateOut, "");
                            var ContainerReceive = replaceNull(value.ContainerReceive, "");
                            var ContainerVerifyGrossMass = replaceNull(value.ContainerVerifyGrossMass, "");

                            if (value["BillOfLadingHasContainer"] !== null) {
                                var ContainerSealNum = replaceNull(value["BillOfLadingHasContainer"]["SealNum"], "");
                                var ContainerGrossWeight = replaceNull(value["BillOfLadingHasContainer"]["GrossWeight"], "");
                                var ContainerM3 = replaceNull(value["BillOfLadingHasContainer"]["M3"], "");
                            }
                            else {
                                var ContainerSealNum = "";
                                var ContainerGrossWeight = "";
                                var ContainerM3 = "";

                            }

                            var ContainerCommodity = replaceNull(value["BookingReservationHasContainerType"]["Commodity"], "");



                            if (ContainerRelease == "") {
                                html += ""
                            } else {
                                html += '<div class="card shipping-instructions lvl1">'

                                    + '<div class="card-header">'
                                    + '<h3 class="card-title"><button type="button" class="btn btn-tool ContainerDetailsShow"> <i class="fas fa-minus"></i></button>Container Code: ' + value.ContainerCode + '</h3>'
                                    // +          '<div class="card-tools">'
                                    // +              '<button type="button" class="btn btn-tool" data-card-widget="collapse">'
                                    // +                  '<i class="fas fa-minus"></i>'
                                    // +              '</button>'
                                    // +          '</div>'  
                                    + '</div>'

                                    + '<table class="ContainerDetails ml-4" style="width:50%;">'
                                    + '<tr>'
                                    + '<th style:"width:10%;"></th>'
                                    + '<th style:"width:90%;"></th>'
                                    + '</tr>'
                                    + '<tr>'
                                    + '<td style="width:10%;" >Seal No.:</td>'
                                    + '<td style="width:90%;">' + ContainerSealNum + '</td>'
                                    + '</tr>'
                                    + '<tr>'
                                    + '<td style="width:10%;" >Commodity:</td>'
                                    + '<td style="width:90%;" >' + ContainerCommodity + '</td>'
                                    + '</tr>'
                                    + '<td style="width:10%;">Gross Weight:</td>'
                                    + '<td style="width:90%;">' + ContainerGrossWeight + '</td>'
                                    + '</tr>'
                                    + '</tr>'
                                    + '<td style="width:10%;">M3:</td>'
                                    + '<td style="width:90%;">' + ContainerM3 + '</td>'
                                    + '</tr>'
                                    + '</table>'



                                    + '<div class="card-body">'
                                    + '<section class="content">'
                                    + '<div class="container-fluid">'
                                    + '<div class="row">'
                                    + '<div class="col-md-12">'
                                    + '<div class="timeline">'

                                if (value.ContainerReceive !== null) {
                                    html += '<div>'
                                        + '<i class="fas fa-circle bg-blue"></i>'
                                        + '<div class="timeline-item">'
                                        + '<h3 class="timeline-header">' + replaceNull(ContainerReceive.CreatedAt, "") + '</h3>'
                                        + '<div class="timeline-body">'
                                        + 'Container Received<br>'
                                        + replaceNull(ContainerReceive.Area, "")
                                        + '</div>'
                                        + '</div>'
                                        + '</div>'
                                }

                                if (value.ContainerGateOut !== null) {
                                    html += '<div>'
                                        + '<i class="fas fa-circle bg-blue"></i>'
                                        + '<div class="timeline-item">'
                                        + '<h3 class="timeline-header">' + replaceNull(ContainerGateOut.CreatedAt, "") + '</h3>'
                                        + '<div class="timeline-body">'
                                        + 'Container Gate Out<br>'
                                        + replaceNull(ContainerGateOut.Area, "")
                                        + '</div>'
                                        + '</div>'
                                        + '</div>'
                                }

                                if (value.ContainerDischarged[1] != null) {
                                    html += '<div>'
                                        + '<i class="fas fa-circle bg-blue"></i>'
                                        + '<div class="timeline-item">'
                                        + '<h3 class="timeline-header">' + replaceNull(value.ContainerDischarged[1].CreatedAt, "") + '</h3>'
                                        + '<div class="timeline-body">'
                                        + 'Container Discharged<br>'
                                        + replaceNull(value.ContainerDischarged[1].Area, "")
                                        + '</div>'
                                        + '</div>'
                                        + '</div>'
                                }

                                if (value.ContainerLoaded[1] != null) {
                                    html += '<div>'
                                        + '<i class="fas fa-circle bg-blue"></i>'
                                        + '<div class="timeline-item">'
                                        + '<h3 class="timeline-header">' + replaceNull(value.ContainerLoaded[1].CreatedAt, "") + '</h3>'
                                        + '<div class="timeline-body">'
                                        + 'Container Loaded<br>'
                                        + replaceNull(value.ContainerLoaded[1].Area, "")
                                        + '</div>'
                                        + '</div>'
                                        + '</div>'
                                }

                                if (value.ContainerDischarged[0] != null) {
                                    html += '<div>'
                                        + '<i class="fas fa-circle bg-blue"></i>'
                                        + '<div class="timeline-item">'
                                        + '<h3 class="timeline-header">' + replaceNull(value.ContainerDischarged[0].CreatedAt, "") + '</h3>'
                                        + '<div class="timeline-body">'
                                        + 'Container Discharged<br>'
                                        + replaceNull(value.ContainerDischarged[0].Area, "")
                                        + '</div>'
                                        + '</div>'
                                        + '</div>'
                                }

                                if (value.ContainerLoaded[0] != null) {
                                    html += '<div>'
                                        + '<i class="fas fa-circle bg-blue"></i>'
                                        + '<div class="timeline-item">'
                                        + '<h3 class="timeline-header">' + replaceNull(value.ContainerLoaded[0].CreatedAt, "") + '</h3>'
                                        + '<div class="timeline-body">'
                                        + 'Container Loaded<br>'
                                        + replaceNull(value.ContainerLoaded[0].Area, "")
                                        + '</div>'
                                        + '</div>'
                                        + '</div>'
                                }


                                if (value.ContainerGateIn !== null) {
                                    html += '<div>'
                                        + '<i class="fas fa-circle bg-blue"></i>'
                                        + '<div class="timeline-item">'
                                        + '<h3 class="timeline-header">' + replaceNull(ContainerGateIn.CreatedAt, "") + '</h3>'
                                        + '<div class="timeline-body">'
                                        + 'Container Gate In<br>'
                                        + replaceNull(ContainerGateIn.Area, "")
                                        + '</div>'
                                        + '</div>'
                                        + '</div>'
                                }

                                if (value.ContainerVerifyGrossMass !== null) {
                                    html += '<div>'
                                        + '<i class="fas fa-circle bg-blue"></i>'
                                        + '<div class="timeline-item">'
                                        + '<h3 class="timeline-header">' + replaceNull(ContainerVerifyGrossMass.CreatedAt, "") + '</h3>'
                                        + '<div class="timeline-body">'
                                        + 'Container Verified Gross Mass<br>'
                                        + replaceNull(ContainerVerifyGrossMass.Area, "")
                                        + '</div>'
                                        + '</div>'
                                        + '</div>'
                                }

                                html += '<div>'
                                    + '<i class="fas fa-circle bg-blue"></i>'
                                    + '<div class="timeline-item">'
                                    + '<h3 class="timeline-header">' + replaceNull(ContainerRelease.CreatedAt, "") + '</h3>'
                                    + '<div class="timeline-body">'
                                    + 'Container Released<br>'
                                    + replaceNull(ContainerRelease.Area, "")
                                    + '</div>'
                                    + '</div>'
                                    + '</div>'


                                html += '</div>'
                                    + '</div>'
                                    + '</div>'
                                    + '</div>'
                                    + '</section>'
                                    + '</div>'
                                    + '</div>'

                            }
                            $('#RealTimeTrack').append(html);

                        });
                    }
                })
            }
            else {
                alert("Please fill in some column.")
            }

        })

        return () => {

        }
    }, [])





    return (


        <div className="card card-primary">
            <div className="card-body">

                <div className="card lvl1">
                    <div className="row">
                    </div>   <table className="mt-2 mb-2">
                        <tbody><tr><td>
                            <div className="col">
                                <label htmlFor="ContainerCodeTrack" >Container Code: </label>
                            </div>
                        </td>
                            <td>
                                <div className="col">
                                    <input type="text" id="ContainerCodeTrack" className="form-control" ></input>
                                </div>
                            </td>
                            <td>
                                <div className="col">
                                    <label htmlFor="BRNo" >BR No.: </label>
                                </div>
                            </td>
                            <td>
                                <div className="col">
                                    <input type="text" id="BRNo" className="form-control" ></input>
                                </div>
                            </td>
                            <td>
                                <div className="col">
                                    <label htmlFor="BLNo" >BL No.: </label>
                                </div>
                            </td>
                            <td>
                                <div className="col">
                                    <input type="text" id="BLNo" className="form-control" ></input>
                                </div>
                            </td>
                            <td>
                                <div className="col">
                                    <button type="button" className="btn btn-success float-right GenerateRealTimeTracking">Track</button>
                                </div>
                            </td>

                        </tr></tbody></table>
                </div>

                <div id="RealTimeTrack">

                </div>


            </div>
        </div>




    )
}






export default Index