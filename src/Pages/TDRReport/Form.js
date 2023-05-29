import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, UpdateData, ToastNotify, ControlOverlay, GetAllDropDown, getCookie, createCookie, initHoverSelectDropownTitle, GetUser, sortArray } from '../../Components/Helper.js'
import Select from 'react-select'
import AsyncSelect from 'react-select/async';
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




function Form(props) {
    const { state } = useLocation();
    const [formState, setFormState] = useState({ formType: "New" });
    const globalContext = useContext(GlobalContext);
    const params = useParams();
    const [voyage, setVoyage] = useState([])

    var modelLinkTemp;
   
    if (globalContext.userRule !== "") {
         modelLinkTemp=props.data.modelLink
        const objRule = JSON.parse(globalContext.userRule);
        var filteredAp = objRule.Rules.filter(function (item) {
          return item.includes(modelLinkTemp);
        });
        
    }


    function handleGenerate() {
        if ($("input[name='DynamicModel[Voyage]']").val() == "") {

            // on click generate validate from voyage uuid
            alert("Voyage No. cannot be empty!")

        } else if ($("input[name='DynamicModel[Voyage]']").val() !== "") {
            $("#discharging-table").empty();
            $("#loadinglist-table").empty();
            $("#discharging-table").removeClass("d-none");
            $("#discharging-table").append(
                "<thead>\
                    <tr id='head'>\
                        <th rowspan='2'>POL</th>\
                        <th rowspan='2'>POD</th>\
                        <th rowspan='2'>SOC/COC</th>\
                    </tr>\
                    <tr id='head1'>\
                    </tr>\
                </thead>\
                <tbody id='body'>\
                </tbody>"
            )

            $.ajax({
                url: globalContext.globalHost + globalContext.globalPathLink + "t-d-r/generate-report",
                data: { VoyageUUID: getValues("DynamicModel[Voyage]") },
                type: "POST",
                dataType: "json",
                headers: {
                    "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
                },
                success: function (data) {
                    var MyArray = [];
                    var ArrayTranshipment = [];
                    var MyLatestArray;
                    $.each(data.data.BookingReservations, function (key1, value1) {
                        $.each(value1.bookingReservationHasContainerTypes, function (key2, value2) {

                            if (value1.PODPortCode == data.data.UserBranch.PortCode) {

                                var counttt = 0;
                                $.each(value1.bookingReservationHasContainers, function (key55, value55) {

                                    if (value55.BookingReservationHasContainerType == value2.BookingReservationHasContainerTypeUUID) {
                                        $.each(data.data.ContainerDischarged, function (key66, value66) {

                                            if (value2.BookingReservation == value66.BookingReservation) {
                                                if (value1.PODPortCode == value66.PortCode) {
                                                    if (value66.ContainerCode == value55.ContainerCode) {

                                                        counttt++
                                                    }
                                                }

                                            }

                                        })
                                    }


                                })


                                var ArrData = { "POL": value1.POLPortCodeName, "POD": data.data.UserBranch.PortCodeName, "COC/SOC": value2.BoxOwnership, "ContainerType": value2.ContainerTypeName, "Counter": counttt, "Empty/Laden": value2.Empty, "BoxOpName": value2.BoxOperatorName, "ContainerSize": value2.ContainerSize };

                                var found = false;
                                $.each(MyArray, function (i, element) {
                                    if (element.POL == value1.POLPortCodeName && element.POD == data.data.UserBranch.PortCodeName && element.ContainerType == value2.ContainerTypeName && element["Empty/Laden"] == value2.Empty && element.BoxOpName == value2.BoxOperatorName) {

                                        MyArray[i].Counter = parseInt(element.Counter) + counttt;
                                        found = true;
                                        return;
                                    }
                                })

                                if (!found) {
                                    MyArray.push(ArrData)
                                }

                            }

                            //transhipment data
                            $.each(value1.bookingReservationHasTranshipments, function (key3, value3) {

                                if (value3.PortCode == data.data.UserBranch.PortCode) {

                                    var counttt = 0;

                                    $.each(data.data.ContainerDischarged, function (key44, value44) {

                                        if (value3.BookingReservation == value44.BookingReservation) {

                                            if (value3.PortCode == value44.PortCode) {

                                                counttt++
                                            }

                                        }
                                    })



                                    var ArrData1 = { "POL": value1.POLPortCodeName, "POD": value1.PODPortCodeName, "COC/SOC": "T/S", "ContainerType": value2.ContainerTypeName, "Counter": counttt, "Empty/Laden": value2.Empty, "BoxOpName": value2.BoxOperatorName, "ContainerSize": value2.ContainerSize };

                                    var found = false;
                                    $.each(ArrayTranshipment, function (i, element) {
                                        if (element.POL == value1.POLPortCodeName && element.POD == value1.PODPortCodeName && element["COC/SOC"] == "T/S" && element.ContainerType == value2.ContainerTypeName && element["Empty/Laden"] == value2.Empty && element.BoxOpName == value2.BoxOperatorName) {

                                            ArrayTranshipment[i].Counter = parseInt(element.Counter) + counttt;
                                            found = true;

                                        }
                                    })
                                    if (!found) {
                                        ArrayTranshipment.push(ArrData1)
                                    }
                                }

                            })
                        })
                    })


                    var FilterMyArrayDischarged = [];
                    var FilterArrayTranshipmentDischarged = [];

                    $.each(MyArray, function (i, element) {

                        if (element["Counter"] != "0") {

                            FilterMyArrayDischarged.push(element)
                        }


                    })

                    $.each(ArrayTranshipment, function (i, element) {

                        if (element["Counter"] != "0") {

                            FilterArrayTranshipmentDischarged.push(element)
                        }


                    })

                    MyArray = FilterMyArrayDischarged
                    ArrayTranshipment = FilterArrayTranshipmentDischarged

                    var ContainerTypeNormal = [];
                    var ContainerTypeTranshipment = [];
                    //push Container type normal and transhipment
                    $.each(MyArray, function (i, element) {

                        if (element["COC/SOC"] == "SOC" && element.BoxOpName !== null) {

                            var matches = element.BoxOpName.match(/\b(\w)/g);
                            var BoxOperatorNameacronym = matches.join('');

                            element["COC/SOC"] = "SOC/" + BoxOperatorNameacronym;
                        }

                        var data = { "ContainerType": element.ContainerType, "Counter": element.Counter, "Empty/Laden": element["Empty/Laden"], "ContainerSize": element["ContainerSize"] }
                        ContainerTypeNormal.push(data)
                    })




                    $.each(ArrayTranshipment, function (i, element) {
                        if (element["COC/SOC"] == "SOC" && element.BoxOpName !== null) {

                            var matches = element.BoxOpName.match(/\b(\w)/g);
                            var BoxOperatorNameacronym = matches.join('');

                            element["COC/SOC"] = "SOC/" + BoxOperatorNameacronym;
                        }
                        var data = { "ContainerType": element.ContainerType, "Counter": element.Counter, "Empty/Laden": element["Empty/Laden"], "ContainerSize": element["ContainerSize"] }
                        ContainerTypeTranshipment.push(data)
                    })



                    var ContainerType = ContainerTypeNormal.concat(ContainerTypeTranshipment)

                    // unique container type
                    var uniqueContainerType = [];
                    $.each(ContainerType, function (key, value) {
                        var newArrData = { "ContainerType": value.ContainerType, "Counter": value.Counter, "ContainerSize": value.ContainerSize }
                        var found = false;
                        $.each(uniqueContainerType, function (i, element) {
                            if (element.ContainerType == value.ContainerType) {
                                uniqueContainerType[i].Counter = element.Counter + value.Counter;
                                found = true;

                            }
                        })
                        if (!found) {
                            uniqueContainerType.push(newArrData)
                        }
                    })

                    function compareName(a, b) {

                        if (a.ContainerType < b.ContainerType) return -1;
                        if (a.ContainerType > b.ContainerType) return 1;
                        return 0;
                    }
                    uniqueContainerType.sort(compareName);

                    var htmlContainer1 = "";
                    var htmlContainer2 = "";
                    var htmlContainer3 = "";
                    var htmlContainer4 = "";
                    var htmlLaden1 = "";
                    var htmlEmpty1 = "";
                    var htmlLaden2 = "";
                    var htmlEmpty2 = "";

                    var Container20 = [];
                    var Container40 = [];
                    $.each(uniqueContainerType, function (key, value) {
                        if (value.ContainerSize == "C0084") {
                            Container20.push(value.ContainerType)
                        } else {
                            Container40.push(value.ContainerType)
                        }
                    })


                    //display container, laden & empty dynamically
                    $.each(Container20, function (key, value) {

                        htmlContainer1 += "<th>" + value + "</th>";
                        htmlContainer2 += "<th>" + value + "</th>";
                        htmlLaden1 += "<th>LDN</th>";
                        htmlEmpty1 += "<th>MT</th>";

                    })
                    $.each(Container40, function (key, value) {

                        htmlContainer3 += "<th>" + value + "</th>";
                        htmlContainer4 += "<th>" + value + "</th>";
                        htmlLaden2 += "<th>LDN</th>";
                        htmlEmpty2 += "<th>MT</th>";

                    })
                    $("#head").append(htmlContainer1)
                    $("#head").append(htmlContainer2)
                    $("#head").append(htmlContainer3)
                    $("#head").append(htmlContainer4)
                    $("#head1").append(htmlLaden1)
                    $("#head1").append(htmlEmpty1)
                    $("#head1").append(htmlLaden2)
                    $("#head1").append(htmlEmpty2)
                    //append total container type (20'/40')
                    $("#head1").append("<th>20'</th>")
                    $("#head1").append("<th>40'</th>")
                    $("#head").append("<th>TTL</th>")
                    $("#head").append("<th>TTL</th>")
                    $("#head").append("<th>TTL</th>")
                    $("#head").append("<th>TTL</th>")
                    $("#head1").append("<th>UNITS</th>")
                    $("#head1").append("<th>TEUS</th>")


                    //sorted data
                    var Array1 = [];
                    $.each(MyArray, function (key, value) {
                        var newArrData = { "COC/SOC": value["COC/SOC"], "POD": value.POD, "POL": value.POL, "Counter": value.Counter }
                        var found = false;
                        $.each(Array1, function (i, element) {
                            if (element.POL == value.POL && element.POD == value.POD && element["COC/SOC"] == value["COC/SOC"]) {
                                Array1[i].Counter = element.Counter + value.Counter;
                                found = true;

                            }
                        })
                        if (!found) {
                            Array1.push(newArrData)
                        }
                    })

                    var ArrayTranshipmentlatest = [];
                    $.each(ArrayTranshipment, function (key, value) {

                        var newArrData = { "COC/SOC": "T/S", "POD": value.POD, "POL": value.POL, "Counter": value.Counter }
                        var found = false;
                        $.each(ArrayTranshipmentlatest, function (i, element) {
                            if (element.POL == value.POL && element.POD == value.POD && element["COC/SOC"] == value["COC/SOC"]) {
                                ArrayTranshipmentlatest[i].Counter = element.Counter + value.Counter;
                                found = true;

                            }
                        })
                        if (!found) {
                            ArrayTranshipmentlatest.push(newArrData)
                        }
                    })
                    //combine array data without transhipment and data with transhipment
                    MyLatestArray = MyArray.concat(ArrayTranshipment)
                    //sorted array of data including transhipment
                    ArrayData = Array1.concat(ArrayTranshipmentlatest);
                    //display final sorted data into table
                    //container grand total
                    var grandtotal = { "40'": 0, "20'": 0 };
                    //append 1/0 on the main table
                    $.each(ArrayData, function (key, value) {

                        var total = { "40'": 0, "20'": 0 };
                        var html = "<tr>";
                        html += "<td>" + value.POL + "</td>";
                        html += "<td>" + value.POD + "</td>";
                        html += "<td>" + value["COC/SOC"] + "</td>";

                        //if it is container 20 and laden (Empty/Laden = 0)

                        $.each(Container20, function (i, element) {

                            var found = false;

                            $.each(MyLatestArray, function (key1, value1) {

                                if (value.POL == value1.POL && value.POD == value1.POD && value["COC/SOC"] == value1["COC/SOC"] && value1.ContainerType == element && value1["Empty/Laden"] == "0") {
                                    html += "<td>" + value1.Counter + "</td>";

                                    total["20'"] = total["20'"] + value1.Counter;
                                    grandtotal["20'"] = grandtotal["20'"] + value1.Counter;

                                    found = true;
                                    return false;
                                }


                            });

                            if (!found) {
                                html += "<td>0</td>";
                            }
                        })

                        //if it is container 20 and empty (Empty/Laden = 1)
                        $.each(Container20, function (i, element) {
                            var found = false;
                            $.each(MyLatestArray, function (key1, value1) {

                                if (value1.POL == value.POL && value1.POD == value.POD && value1["COC/SOC"] == value["COC/SOC"] && value1.ContainerType == element && value1["Empty/Laden"] == "1") {

                                    html += "<td>" + value1.Counter + "</td>";

                                    total["20'"] = total["20'"] + value1.Counter;
                                    grandtotal["20'"] = grandtotal["20'"] + value1.Counter;

                                    found = true;
                                    return false;

                                }


                            });

                            if (!found) {
                                html += "<td>0</td>";

                            }

                        })


                        //if it is container 40 and laden (Empty/Laden = 0)
                        $.each(Container40, function (i, element) {

                            var found = false;

                            $.each(MyLatestArray, function (key1, value1) {

                                if (value.POL == value1.POL && value.POD == value1.POD && value["COC/SOC"] == value1["COC/SOC"] && value1.ContainerType == element && value1["Empty/Laden"] == "0") {
                                    html += "<td>" + value1.Counter + "</td>";

                                    total["40'"] = total["40'"] + value1.Counter;
                                    grandtotal["40'"] = grandtotal["40'"] + value1.Counter;

                                    found = true;
                                    return false;
                                }


                            });

                            if (!found) {
                                html += "<td>0</td>";
                            }
                        })

                        //if it is container 40 and empty (Empty/Laden = 1)
                        $.each(Container40, function (i, element) {
                            var found = false;
                            $.each(MyLatestArray, function (key1, value1) {

                                if (value1.POL == value.POL && value1.POD == value.POD && value1["COC/SOC"] == value["COC/SOC"] && value1.ContainerType == element && value1["Empty/Laden"] == "1") {

                                    html += "<td>" + value1.Counter + "</td>";
                                    total["40'"] = total["40'"] + value1.Counter;
                                    grandtotal["40'"] = grandtotal["40'"] + value1.Counter;
                                    found = true;
                                    return false;

                                }


                            });

                            if (!found) {
                                html += "<td>0</td>";

                            }

                        })

                        html += "<td>" + total["20'"] + "</td>";
                        html += "<td>" + total["40'"] + "</td>";
                        var totalUnits = total["20'"] + total["40'"];
                        var totalTeus = total["40'"] + totalUnits;
                        html += "<td>" + totalUnits + "</td>";
                        html += "<td>" + totalTeus + "</td>";
                        html += "</tr>";

                        $("#body").append(html)
                    })


                    //append TTL on the last row
                    var Container20TTL = [];
                    $.each(MyLatestArray, function (key, value) {

                        if (value.ContainerType.includes("20")) {
                            var newArrData = { "ContainerType": value.ContainerType, "Counter": value.Counter, "Empty/Laden": value["Empty/Laden"] };
                            var found = false;

                            $.each(Container20TTL, function (i, element) {
                                if (element.ContainerType == value.ContainerType && element["Empty/Laden"] == value["Empty/Laden"]) {
                                    Container20TTL[i].Counter = element.Counter + value.Counter;
                                    found = true;

                                }
                            })
                            if (!found) {
                                Container20TTL.push(newArrData)
                            }

                        }

                    })



                    //sort containertype in container array
                    function compareName(a, b) {

                        if (a.ContainerType < b.ContainerType) return -1;
                        if (a.ContainerType > b.ContainerType) return 1;
                        return 0;
                    }
                    Container20TTL.sort(compareName);

                    var Container40TTL = [];

                    $.each(MyLatestArray, function (key, value) {
                        if (value.ContainerType.includes("40")) {

                            var newArrData = { "ContainerType": value.ContainerType, "Counter": value.Counter, "Empty/Laden": value["Empty/Laden"] }
                            var found = false;
                            $.each(Container40TTL, function (i, element) {
                                if (element.ContainerType == value.ContainerType && element["Empty/Laden"] == value["Empty/Laden"]) {

                                    Container40TTL[i].Counter = element.Counter + value.Counter;
                                    found = true;

                                }
                            })

                            if (!found) {
                                Container40TTL.push(newArrData)
                            }
                        }

                    })



                    Container40TTL.sort(compareName);



                    var htmlTTL = "<tr>";
                    htmlTTL += "<td></td>";
                    htmlTTL += "<td></td>";
                    htmlTTL += "<td>TTL</td>";

                    $.each(Container20, function (key, value) {

                        var found = false;
                        $.each(Container20TTL, function (key2, value2) {

                            if (value2.ContainerType == value && value2["Empty/Laden"] == "0") {
                                htmlTTL += "<td>" + value2.Counter + "</td>";
                                found = true;
                                return false;

                            }

                        })
                        if (!found) {
                            htmlTTL += "<td>0</td>";
                        }
                    })
                    $.each(Container20, function (key, value) {

                        var found = false;
                        $.each(Container20TTL, function (key2, value2) {

                            if (value2.ContainerType == value && value2["Empty/Laden"] == "1") {
                                htmlTTL += "<td>" + value2.Counter + "</td>";
                                found = true;
                                return false;

                            }

                        })
                        if (!found) {
                            htmlTTL += "<td>0</td>";
                        }
                    })
                    $.each(Container40, function (key, value) {

                        var found = false;
                        $.each(Container40TTL, function (key2, value2) {

                            if (value2.ContainerType == value && value2["Empty/Laden"] == "0") {
                                htmlTTL += "<td>" + value2.Counter + "</td>";
                                found = true;
                                return false;

                            }

                        })
                        if (!found) {
                            htmlTTL += "<td>0</td>";
                        }
                    })
                    $.each(Container40, function (key, value) {

                        var found = false;
                        $.each(Container40TTL, function (key2, value2) {

                            if (value2.ContainerType == value && value2["Empty/Laden"] == "1") {
                                htmlTTL += "<td>" + value2.Counter + "</td>";
                                found = true;
                                return false;

                            }

                        })
                        if (!found) {
                            htmlTTL += "<td>0</td>";
                        }
                    })

                    var grandtotalUnits = grandtotal["20'"] + grandtotal["40'"];
                    var grandtotalTeus = grandtotal["40'"] + grandtotalUnits;
                    htmlTTL += "<td>" + grandtotal["20'"] + "</td>";
                    htmlTTL += "<td>" + grandtotal["40'"] + "</td>";
                    htmlTTL += "<td>" + grandtotalUnits + "</td>";
                    htmlTTL += "<td>" + grandtotalTeus + "</td>";
                    setValue("DynamicModel[UnitsDischarge]", grandtotalUnits)
                    setValue("DynamicModel[TeusDischarge]", grandtotalTeus)
                    // $("#dynamicmodel-unitsdischarge").val(grandtotalUnits)
                    // $("#dynamicmodel-teusdischarge").val(grandtotalTeus)
                    htmlTTL += "</tr>";
                    $("#body").append(htmlTTL)

                    $("#loadinglist-table").append(
                        "<thead>\
                            <tr id='tr1'>\
                                <th>POL</th>\
                                <th rowspan='2'>POD</th>\
                            </tr>\
                            <tr id='tr2'>\
                                <th>"+ data.data.UserBranch.PortCodeName + "</th>\
                            </tr>\
                      </thead>\
                      <tbody id='loadingbody'>\
                      </tbody>"

                    )

                    // var uniqueContainerType = ["abc", "def"];


                    var htmlTOTAL = "";
                    var html1 = "";
                    var html2 = "";
                    var html3 = "";
                    var html4 = "";
                    var htmlLDN1 = "";
                    var htmlMT1 = "";
                    var htmlLDN2 = "";
                    var htmlMT2 = "";
                    htmlTOTAL += "<th>TOTAL</th>";
                    htmlTOTAL += "<th>TOTAL</th>";
                    htmlTOTAL += "<th>TOTAL</th>";
                    htmlTOTAL += "<th>TOTAL</th>";
                    var html20_40 = "";
                    html20_40 += "<th>20'</th>";
                    html20_40 += "<th>40'</th>";
                    html20_40 += "<th>UNITS</th>";
                    html20_40 += "<th>TEUS</th>";


                    var MyArray = [];


                    $.each(data.data.BookingReservations, function (key1, value1) {

                        $.each(value1.bookingReservationHasContainerTypes, function (key2, value2) {
                            // check if there is transhipment
                            if (value1.bookingReservationHasTranshipments.length !== 0) {

                                // if there is transhipment and user port code == POL port code, get the first transhipment port code 
                                if (value1.POLPortCode == data.data.UserBranch.PortCode) {


                                    $.each(value1.bookingReservationHasTranshipments, function (key3, value3) {
                                        var counttt = 0;

                                        $.each(data.data.ContainerLoaded, function (key44, value44) {
                                            if (value3.BookingReservation == value44.BookingReservation) {
                                                if (value3.PortCode == value44.PortCode) {

                                                    counttt++
                                                }

                                            }
                                        })

                                        // get the first transhipment port code 
                                        var Array = { "POL": value1.POLPortCodeName, "POD": value3.PortCodeName, "COC/SOC": "T/S", "ContainerType": value2.ContainerTypeName, "Counter": counttt, "Empty/Laden": value2.Empty, "BoxOpName": value2.BoxOperatorName, "ContainerSize": value2.ContainerSize };
                                        var found = false;
                                        $.each(MyArray, function (i, element) {

                                            if (element.POL == value1.POLPortCodeName && element.POD == value3.PortCodeName && element.ContainerType == value2.ContainerTypeName && element["Empty/Laden"] == value2.Empty && element.BoxOpName == value2.BoxOperatorName && element["COC/SOC"] == "T/S") {
                                                //MyArray[i].Counter = element.Counter + value1.bookingConfirmationHasTranshipments.length;
                                                MyArray[i].Counter = parseInt(element.Counter) + counttt;
                                                found = true;
                                            }
                                            //MyArray[i].Counter=counttt;
                                        })

                                        if (!found) {
                                            MyArray.push(Array)
                                        }
                                    })

                                } else {
                                    $.each(value1.bookingReservationHasTranshipments, function (key5, value5) {

                                        if (value5.PortCode == data.data.UserBranch.PortCode) {
                                            var counttt = 0;

                                            $.each(data.data.ContainerLoaded, function (key44, value44) {
                                                if (value5.BookingReservation == value44.BookingReservation) {
                                                    if (value5.PortCode == value44.PortCode) {

                                                        counttt++
                                                    }

                                                }
                                            })

                                            // get the first transhipment port code 
                                            var Array = { "POL": value1.POLPortCodeName, "POD": value1.PODPortCodeName, "COC/SOC": "T/S", "ContainerType": value2.ContainerTypeName, "Counter": counttt, "Empty/Laden": value2.Empty, "BoxOpName": value2.BoxOperatorName, "ContainerSize": value2.ContainerSize };
                                            var found = false;
                                            $.each(MyArray, function (i, element) {

                                                if (element.POL == value1.POLPortCodeName && element.POD == value1.PODPortCodeName && element.ContainerType == value2.ContainerTypeName && element["Empty/Laden"] == value2.Empty && element.BoxOpName == value2.BoxOperatorName && element["COC/SOC"] == "T/S") {
                                                    //MyArray[i].Counter = element.Counter + value1.bookingConfirmationHasTranshipments.length;
                                                    MyArray[i].Counter = parseInt(element.Counter) + counttt;
                                                    found = true;
                                                }
                                                //MyArray[i].Counter=counttt;
                                            })

                                            if (!found) {
                                                MyArray.push(Array)
                                            }
                                        }
                                    })

                                }
                            }
                            // if there is no transhipment
                            else {

                                if (value1.POLPortCode == data.data.UserBranch.PortCode) {

                                    var counttt = 0;

                                    $.each(value1.bookingReservationHasContainers, function (key55, value55) {

                                        if (value55.BookingReservationHasContainerType == value2.BookingReservationHasContainerTypeUUID) {
                                            $.each(data.data.ContainerLoaded, function (key66, value66) {

                                                if (value2.BookingReservation == value66.BookingReservation) {
                                                    if (value66.ContainerCode == value55.ContainerCode) {
                                                        counttt++
                                                    }
                                                }

                                            })
                                        }


                                    })


                                    var found = false;
                                    var Array = { "POL": data.data.UserBranch.PortCodeName, "POD": value1.PODPortCodeName, "COC/SOC": value2.BoxOwnership, "ContainerType": value2.ContainerTypeName, "Counter": counttt, "Empty/Laden": value2.Empty, "BoxOpName": value2.BoxOperatorName, "ContainerSize": value2.ContainerSize };
                                    $.each(MyArray, function (i, element) {

                                        if (element.POL == value1.POLPortCodeName && element.POD == value1.PODPortCodeName && element.ContainerType == value2.ContainerTypeName && element["Empty/Laden"] == value2.Empty && element.BoxOpName == value2.BoxOperatorName && element["COC/SOC"] == value2.BoxOwnership) {
                                            MyArray[i].Counter = parseInt(element.Counter) + counttt;
                                            found = true;
                                        }
                                    })
                                    if (!found) {
                                        MyArray.push(Array)
                                    }


                                }


                            }
                        })

                    })


                    var FilterMyArray = [];

                    $.each(MyArray, function (i, element) {

                        if (element["Counter"] != "0") {

                            FilterMyArray.push(element)
                        }


                    })
                    MyArray = FilterMyArray

                    var ContainerTypeLoading = [];
                    $.each(MyArray, function (i, element) {

                        if (element["COC/SOC"] == "SOC" && element.BoxOpName !== null) {

                            var matches = element.BoxOpName.match(/\b(\w)/g);
                            var BoxOperatorNameacronym = matches.join('');

                            element["COC/SOC"] = "SOC/" + BoxOperatorNameacronym;
                        }

                        var data = { "ContainerType": element.ContainerType, "Counter": element.Counter, "Empty/Laden": element["Empty/Laden"], "ContainerSize": element["ContainerSize"] }
                        ContainerTypeLoading.push(data)
                    })

                    // unique container type
                    var uniqueContainerTypeLoading = [];
                    $.each(ContainerTypeLoading, function (key, value) {

                        var newArrData = { "ContainerType": value.ContainerType, "Counter": value.Counter, "ContainerSize": value.ContainerSize }
                        var found = false;
                        $.each(uniqueContainerTypeLoading, function (i, element) {
                            if (element.ContainerType == value.ContainerType) {
                                uniqueContainerTypeLoading[i].Counter = element.Counter + value.Counter;
                                found = true;

                            }
                        })
                        if (!found) {
                            uniqueContainerTypeLoading.push(newArrData)
                        }
                    })

                    function compareName(a, b) {

                        if (a.ContainerType < b.ContainerType) return -1;
                        if (a.ContainerType > b.ContainerType) return 1;
                        return 0;
                    }
                    uniqueContainerTypeLoading.sort(compareName);

                    var Container20Loading = [];
                    var Container40Loading = [];
                    $.each(uniqueContainerTypeLoading, function (key, value) {
                        if (value.ContainerSize == "C0084") {
                            Container20Loading.push(value.ContainerType)
                        } else {
                            Container40Loading.push(value.ContainerType)
                        }
                    })


                    $.each(Container20Loading, function (key, value) {

                        html1 += "<th>" + value + "</th>";
                        html2 += "<th>" + value + "</th>";
                        htmlLDN1 += "<th>LDN</th>";
                        htmlMT1 += "<th>MT</th>";

                    })
                    $.each(Container40Loading, function (key, value) {

                        html3 += "<th>" + value + "</th>";
                        html4 += "<th>" + value + "</th>";
                        htmlLDN2 += "<th>LDN</th>";
                        htmlMT2 += "<th>MT</th>";

                    })


                    $("#tr1").append(html1)
                    $("#tr1").append(html2)
                    $("#tr1").append(html3)
                    $("#tr1").append(html4)
                    $("#tr2").append(htmlLDN1)
                    $("#tr2").append(htmlMT1)
                    $("#tr2").append(htmlLDN2)
                    $("#tr2").append(htmlMT2)
                    $("#tr1").append(htmlTOTAL)
                    $("#tr2").append(html20_40)

                    var ArrayData = [];
                    $.each(MyArray, function (key, value) {
                        var newArr = { "COC/SOC": value["COC/SOC"], "POD": value.POD, "POL": value.POL, "Counter": value.Counter }
                        var found = false;
                        $.each(ArrayData, function (key1, value1) {
                            if (value1["COC/SOC"] == value["COC/SOC"] && value1.POD == value.POD && value1.POL == value.POL) {
                                ArrayData[key1].Counter = value1.Counter + value.Counter;
                                found = true;
                                return;
                            }
                        })
                        if (!found) {
                            ArrayData.push(newArr)
                        }
                    })

                    var FinalTotalUnits = 0;
                    var FinalTotalTues = 0;

                    $.each(ArrayData, function (key, value) {
                        var total = { "20'": 0, "40'": 0 };
                        var html = "<tr>";
                        html += "<td>" + value["COC/SOC"] + "</td>";
                        html += "<td>" + value.POD + "</td>";
                        $.each(Container20Loading, function (i, element) {
                            var found = false;

                            $.each(MyArray, function (key1, value1) {
                                if (value.POL == value1.POL && value.POD == value1.POD && value["COC/SOC"] == value1["COC/SOC"] && value1.ContainerType == element && value1["Empty/Laden"] == "0") {
                                    html += "<td>" + value1.Counter + "</td>";

                                    total["20'"] = total["20'"] + value1.Counter;
                                    grandtotal["20'"] = grandtotal["20'"] + value1.Counter;

                                    found = true;
                                    return false;
                                }
                            })
                            if (!found) {
                                html += "<td>0</td>";
                            }
                        })

                        $.each(Container20Loading, function (i, element) {
                            var found = false;

                            $.each(MyArray, function (key1, value1) {
                                if (value.POL == value1.POL && value.POD == value1.POD && value["COC/SOC"] == value1["COC/SOC"] && value1.ContainerType == element && value1["Empty/Laden"] == "1") {
                                    html += "<td>" + value1.Counter + "</td>";
                                    total["20'"] = total["20'"] + value1.Counter;
                                    grandtotal["20'"] = grandtotal["20'"] + value1.Counter;
                                    found = true;
                                    return false;
                                }
                            })
                            if (!found) {
                                html += "<td>0</td>";
                            }
                        })

                        $.each(Container40Loading, function (i, element) {
                            var found = false;

                            $.each(MyArray, function (key1, value1) {
                                if (value.POL == value1.POL && value.POD == value1.POD && value["COC/SOC"] == value1["COC/SOC"] && value1.ContainerType == element && value1["Empty/Laden"] == "0") {
                                    html += "<td>" + value1.Counter + "</td>";


                                    total["40'"] = total["40'"] + value1.Counter;
                                    grandtotal["40'"] = grandtotal["40'"] + value1.Counter;

                                    found = true;
                                    return false;
                                }
                            })
                            if (!found) {
                                html += "<td>0</td>";
                            }
                        })




                        $.each(Container40Loading, function (i, element) {
                            var found = false;

                            $.each(MyArray, function (key1, value1) {
                                if (value.POL == value1.POL && value.POD == value1.POD && value["COC/SOC"] == value1["COC/SOC"] && value1.ContainerType == element && value1["Empty/Laden"] == "1") {
                                    html += "<td>" + value1.Counter + "</td>";

                                    total["40'"] = total["40'"] + value1.Counter;
                                    grandtotal["40'"] = grandtotal["40'"] + value1.Counter;

                                    found = true;
                                    return false;
                                }
                            })
                            if (!found) {
                                html += "<td>0</td>";
                            }
                        })

                        html += "<td>" + total["20'"] + "</td>";
                        html += "<td>" + total["40'"] + "</td>";
                        var totalUnits = total["20'"] + total["40'"];
                        FinalTotalUnits = FinalTotalUnits + totalUnits;

                        var totalTeus = total["40'"] + totalUnits;
                        FinalTotalTues = FinalTotalTues + totalTeus;
                        html += "<td>" + totalUnits + "</td>";
                        html += "<td>" + totalTeus + "</td>";
                        html += "</tr>";
                        $("#loadingbody").append(html)



                    })

                    setValue("DynamicModel[UnitsLoad]", FinalTotalUnits);
                    setValue("DynamicModel[TeusLoad]", FinalTotalTues);


                }
            })
            handleCreateCookie()
        }

    }
    function handleChangeVoyage(val) {
        if (val) {
            var regExp = /\(([^)]+)\)/;
            var VoyageUUID = val.value

            var insideBracketVessel;
            var vesselCode;
            var text = val.label
            var matches = regExp.exec(text);
            var result;

            if (VoyageUUID.includes("@", 1)) {
                result = VoyageUUID.slice(0, -2);
            } else {
                result = VoyageUUID
            }


            $.each(matches, function (key, value) {
                if (key == 0) {
                    insideBracketVessel = value;
                } else if (key == 1) {
                    vesselCode = value;
                }
            })


            var voyageNo = text.replace(insideBracketVessel, '');
            var lastCharVoyageNo = VoyageUUID.substr(VoyageUUID.length - 1); // get voyage no last character eg. A, B or W

            var repeatedVoyage = 0;
            var UserPortCode = "";
            if (lastCharVoyageNo == "A") {
                repeatedVoyage = 1
            } else if (lastCharVoyageNo == "B") {
                repeatedVoyage = 2
            } else if (lastCharVoyageNo == "W") {
                repeatedVoyage = 1
            }

            $.ajax({
                url: globalContext.globalHost + globalContext.globalPathLink + props.data.modelLink + "/generate-report",
                data: { VoyageUUID: result },
                type: "POST",
                async: false,
                headers: {
                    "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
                },
                dataType: "json",
                success: function (data) {
                    UserPortCode = data.data.UserBranch.PortCode;
                }

            });

            $.ajax({
                url: globalContext.globalHost + globalContext.globalPathLink + "voyage/get-voyage-by-id2?id=" + result + "",
                type: "POST",
                dataType: "json",
                headers: {
                    "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
                },
                success: function (data) {

                    // var VesselName = data.vessel.VesselName;
                    // $('#dynamicmodel-vesselcode').val(VesselName);

                    var VoyageSchedule = data.voyageSchedules;
                    var countPOL = 0;
                    var countKey = 0;
                    var foundPOL = false;
                    $.each(VoyageSchedule, function (key, value) {
                        if (value.PortCode == UserPortCode) {
                            if (countPOL == repeatedVoyage) {
                                countKey = key + 1;

                                foundPOL = true

                            }
                            countPOL++;
                        }
                    })
                    if (foundPOL == true) {

                        setValue("DynamicModel[EtaNextPort]", moment(moment.unix(VoyageSchedule[countKey]["ETA"]).toDate()).format("DD/MM/YYYY HH:mm"))

                    }
                    else {
                        setValue("DynamicModel[EtaNextPort]", "")
                    }


                    var Portcode = [];
                    $.each(data.voyageSchedules, function (key, value) {
                        Portcode.push(value.PortCodeName)
                    })
                    setValue("DynamicModel[PortRotation]", Portcode.toString().replace(/,/g, '-'))

                }
            })

        }

    }

    function handleClear() {
        reset()
        setValue("DynamicModel[PortRotation]", "")
        setValue("DynamicModel[UnitsDischarge]", "")
        setValue("DynamicModel[TeusDischarge]", "")
        setValue("DynamicModel[UnitsLoad]", "")
        setValue("DynamicModel[TuesLoad]", "")
        setValue("DynamicModel[DelaysLoading]", "")
        setValue("DynamicModel[TimeLost]", "")

        setValue('DynamicModel[ArrivalFuelOil]', "")
        setValue('DynamicModel[ArrivalDieselOil]', "")
        setValue('DynamicModel[ArrivalLubeOil]', "")
        setValue('DynamicModel[ArrivalFreshWater]', "")
        setValue('DynamicModel[ArrivalForward]', "")
        setValue('DynamicModel[ArrivalMean]', "")
        setValue('DynamicModel[ArrivalAfter]', "")

        setValue('DynamicModel[DeparturedFuelOil]', "")
        setValue('DynamicModel[DeparturedDieselOil]', "")
        setValue('DynamicModel[DeparturedLubeOil]', "")
        setValue('DynamicModel[DeparturedFreshWater]', "")
        setValue('DynamicModel[DeparturedForward]', "")
        setValue('DynamicModel[DeparturedMean]', "")
        setValue('DynamicModel[DeparturedAfter]', "")

        setValue('DynamicModel[WaterSupplied]', "")
        setValue('DynamicModel[BunkerSupplied]', "")
        setValue('DynamicModel[ShipStoresSupplied]', "")
        setValue('DynamicModel[ProvisionSupplied]', "")
        setValue('DynamicModel[CrewChanges]', "")
        setValue('DynamicModel[Remarks]', "")
        setValue('DynamicModel[Others]', "")
        setTimeout(()=>{
            handleCreateCookie()
        },100)
    }
    function handleCreateCookie() {
        // store cookie
        var tdrcookie = [];
        var voyage = "DynamicModel[Voyage]/" + $("input[name='DynamicModel[Voyage]']").val()
        var arrivalpilotstation = "DynamicModel[ArrivalPilotStation]/" + $("input[name='DynamicModel[ArrivalPilotStation]']").val()
        var pilotonboard = "DynamicModel[PilotOnBoard]/" + $("input[name='DynamicModel[PilotOnBoard]']").val()
        var dropanchor = "DynamicModel[DropAnchor]/" + $("input[name='DynamicModel[DropAnchor]']").val()
        var pilotonboardwhf = "DynamicModel[PilotOnBoardWHF]/" + $("input[name='DynamicModel[PilotOnBoardWHF]']").val()
        var makeallfast = "DynamicModel[MakeAllFast]/" + $("input[name='DynamicModel[MakeAllFast]']").val()

        var freepractiguegranted = "DynamicModel[FreePractigueGranted]/" + $("input[name='DynamicModel[FreePractigueGranted]']").val()
        var commenceddischarging = "DynamicModel[CommencedDischarging]/" + $("input[name='DynamicModel[CommencedDischarging]']").val()
        var completeddischarging = "DynamicModel[CompletedDischarging]/" + $("input[name='DynamicModel[CompletedDischarging]']").val()
        var commencedloading = "DynamicModel[CommencedLoading]/" + $("input[name='DynamicModel[CommencedLoading]']").val()
        var completedloading = "DynamicModel[CompletedLoading]/" + $("input[name='DynamicModel[CompletedLoading]']").val()
        var commencedlashing = "DynamicModel[CommenceLashing]/" + $("input[name='DynamicModel[CommenceLashing]']").val()
        var completedlashing = "DynamicModel[CompletedLashing]/" + $("input[name='DynamicModel[CompletedLashing]']").val()
        var pilotonboardsialing = "DynamicModel[PilotOnBoardSailing]/" + $("input[name='DynamicModel[PilotOnBoardSailing]']").val()
        var etanextport = "DynamicModel[EtaNextPort]/" + $("input[name='DynamicModel[EtaNextPort]']").val()
        var portrotation = "DynamicModel[PortRotation]/" + $("input[name='DynamicModel[PortRotation]']").val()

        var Delays = "DynamicModel[DelaysLoading]/" + $("input[name='DynamicModel[DelaysLoading]']").val()
        var TimeLost = "DynamicModel[TimeLost]/" + $("input[name='DynamicModel[TimeLost]']").val()

        var ArrivalFuelOil = "DynamicModel[ArrivalFuelOil]/" + $("input[name='DynamicModel[ArrivalFuelOil]']").val()
        var ArrivalDieselOil = "DynamicModel[ArrivalDieselOil]/" + $("input[name='DynamicModel[ArrivalDieselOil]']").val()
        var ArrivalLubeOil = "DynamicModel[ArrivalLubeOil]/" + $("input[name='DynamicModel[ArrivalLubeOil]']").val()
        var ArrivalFreshWater = "DynamicModel[ArrivalFreshWater]/" + $("input[name='DynamicModel[ArrivalFreshWater]']").val()
        var ArrivalForward = "DynamicModel[ArrivalForward]/" + $("input[name='DynamicModel[ArrivalForward]']").val()
        var ArrivalMean = "DynamicModel[ArrivalMean]/" + $("input[name='DynamicModel[ArrivalMean]']").val()
        var ArrivalAfter = "DynamicModel[ArrivalAfter]/" + $("input[name='DynamicModel[ArrivalAfter]']").val()

        var DeparturedFuelOil = "DynamicModel[DeparturedFuelOil]/" + $("input[name='DynamicModel[DeparturedFuelOil]']").val()
        var DeparturedDieselOil = "DynamicModel[DeparturedDieselOil]/" + $("input[name='DynamicModel[DeparturedDieselOil]']").val()
        var DeparturedLubeOil = "DynamicModel[DeparturedLubeOil]/" + $("input[name='DynamicModel[DeparturedLubeOil]']").val()
        var DeparturedFreshWater = "DynamicModel[DeparturedFreshWater]/" + $("input[name='DynamicModel[DeparturedFreshWater]']").val()
        var DeparturedForward = "DynamicModel[DeparturedForward]/" + $("input[name='DynamicModel[DeparturedForward]']").val()
        var DeparturedMean = "DynamicModel[DeparturedMean]/" + $("input[name='DynamicModel[DeparturedMean]']").val()
        var DeparturedAfter = "DynamicModel[DeparturedAfter]/" + $("input[name='DynamicModel[DeparturedAfter]']").val()

        var WaterSupplied = "DynamicModel[WaterSupplied]/" + $("input[name='DynamicModel[WaterSupplied]']").val()
        var BunkerSupplied = "DynamicModel[BunkerSupplied]/" + $("input[name='DynamicModel[BunkerSupplied]']").val()
        var StoresSupplied = "DynamicModel[ShipStoresSupplied]/" + $("input[name='DynamicModel[ShipStoresSupplied]']").val()
        var ProvisionSupplied = "DynamicModel[ProvisionSupplied]/" + $("input[name='DynamicModel[ProvisionSupplied]']").val()
        var CrewChanges = "DynamicModel[CrewChanges]/" + $("input[name='DynamicModel[CrewChanges]']").val()
        var Remarks = "DynamicModel[Remarks]/" + $("input[name='DynamicModel[Remarks]']").val()
        var Others = "DynamicModel[Others]/" + $("input[name='DynamicModel[Others]']").val()


        tdrcookie = [
            ...tdrcookie,
            voyage,
            arrivalpilotstation,
            pilotonboard,
            dropanchor,
            pilotonboardwhf,
            makeallfast,
            freepractiguegranted,
            commenceddischarging,
            completeddischarging,
            commencedloading,
            completedloading,
            commencedlashing,
            completedlashing,
            pilotonboardsialing,
            etanextport,
            portrotation,
            Delays,
            TimeLost,
            ArrivalFuelOil,
            ArrivalDieselOil,
            ArrivalLubeOil,
            ArrivalFreshWater,
            ArrivalForward,
            ArrivalMean,
            ArrivalAfter,
            DeparturedFuelOil,
            DeparturedDieselOil,
            DeparturedLubeOil,
            DeparturedFreshWater,
            DeparturedForward,
            DeparturedMean,
            DeparturedAfter,
            WaterSupplied,
            BunkerSupplied,
            StoresSupplied,
            ProvisionSupplied,
            CrewChanges,
            Remarks,
            Others
        ]


        var json_str = JSON.stringify(tdrcookie);

        createCookie('tdrreport', json_str, 3650)
    }
    function handlePreview() {

        // if(getPreviewPDFPermission == true){
        var DocNum = $("input[name='DynamicModel[DocDate]']").val()
        var VoyageNo = $("input[name='DynamicModel[Voyage]']").val()
        // var VesselCode = $("input[name='DynamicModel[Voyage]']").val()
        var ArrivalPilot = $("input[name='DynamicModel[ArrivalPilotStation]']").val()
        var PilotOnBoard = $("input[name='DynamicModel[PilotOnBoard]']").val()
        var DropAnchor = $("input[name='DynamicModel[DropAnchor]']").val()
        var PilotOnBoardWHF = $("input[name='DynamicModel[PilotOnBoardWHF]']").val()


        var MakeAllFast = $("input[name='DynamicModel[MakeAllFast]']").val()
        var PractigueGranted = $("input[name='DynamicModel[FreePractigueGranted]']").val()
        var CommencedDischarging = $("input[name='DynamicModel[CommencedDischarging]']").val()
        var CompletedDischarging = $("input[name='DynamicModel[CompletedDischarging]']").val()
        var CommencedLoading = $("input[name='DynamicModel[CommencedLoading]']").val()
        var CompletedLoading = $("input[name='DynamicModel[CompletedLoading]']").val()
        var CommencedLashing = $("input[name='DynamicModel[CommenceLashing]']").val()
        var CompletedLashing = $("input[name='DynamicModel[CompletedLashing]']").val()
        var PilotOnBoardSialing = $("input[name='DynamicModel[PilotOnBoardSailing]']").val()
        var EtaNextPort = $("input[name='DynamicModel[EtaNextPort]']").val()
        var PortRotation = $("input[name='DynamicModel[PortRotation]']").val()



        var UnitDischarge = $("input[name='DynamicModel[UnitsDischarge]']").val()
        var TeusDischarge = $("input[name='DynamicModel[TeusDischarge]']").val()
        var UnitLoaded = $("input[name='DynamicModel[UnitsLoad]']").val()
        var TeusLoaded = $("input[name='DynamicModel[TeusLoad]']").val()
        var Delays = $("input[name='DynamicModel[DelaysLoading]']").val()
        var TimeLost = $("input[name='DynamicModel[TimeLost]']").val()



        var ArrivalFuelOil = $("input[name='DynamicModel[ArrivalFuelOil]']").val()
        var ArrivalDieselOil = $("input[name='DynamicModel[ArrivalDieselOil]']").val()
        var ArrivalLubeOil = $("input[name='DynamicModel[ArrivalLubeOil]']").val()
        var ArrivalFreshWater = $("input[name='DynamicModel[ArrivalFreshWater]']").val()
        var ArrivalForward = $("input[name='DynamicModel[ArrivalForward]']").val()
        var ArrivalMean = $("input[name='DynamicModel[ArrivalMean]']").val()
        var ArrivalAfter = $("input[name='DynamicModel[ArrivalAfter]']").val()

        var DeparturedFuelOil = $("input[name='DynamicModel[DeparturedFuelOil]']").val()
        var DeparturedDieselOil = $("input[name='DynamicModel[DeparturedDieselOil]']").val()
        var DeparturedLubeOil = $("input[name='DynamicModel[DeparturedLubeOil]']").val()
        var DeparturedFreshWater = $("input[name='DynamicModel[DeparturedFreshWater]']").val()
        var DeparturedForward = $("input[name='DynamicModel[DeparturedForward]']").val()
        var DeparturedMean = $("input[name='DynamicModel[DeparturedMean]']").val()
        var DeparturedAfter = $("input[name='DynamicModel[DeparturedAfter]']").val()

        var WaterSupplied = $("input[name='DynamicModel[WaterSupplied]']").val()
        var BunkerSupplied = $("input[name='DynamicModel[BunkerSupplied]']").val()
        var StoresSupplied = $("input[name='DynamicModel[ShipStoresSupplied]']").val()
        var ProvisionSupplied = $("input[name='DynamicModel[ProvisionSupplied]']").val()
        var CrewChanges = $("input[name='DynamicModel[CrewChanges]']").val()
        var Remarks = $("input[name='DynamicModel[Remarks]']").val()
        var Others = $("input[name='DynamicModel[Others]']").val()


        var VoyageName = $("input[name='DynamicModel[Voyage]']").parent().find(".select__single-value").text()
        if (VoyageName !== "") {
            var VesselName = $("input[name='DynamicModel[Voyage]']").parent().find(".select__single-value").text().match(/\(([^)]+)\)/)[1];
        }


        // if(getPreviewPDFPermission == true){
        if (VoyageNo == "") {
            alert("Voyage No. cannot be blank.")
        }
        else {
            var AdditionalData = {
                DocNum, VoyageNo, ArrivalPilot, PilotOnBoard, DropAnchor, PilotOnBoardWHF, MakeAllFast, PractigueGranted, CommencedDischarging, CompletedDischarging, CommencedLoading,
                CompletedLoading, CommencedLashing, CompletedLashing, PilotOnBoardSialing, EtaNextPort, PortRotation, UnitDischarge, TeusDischarge,
                UnitLoaded, TeusLoaded, Delays, TimeLost, ArrivalFuelOil, ArrivalDieselOil, ArrivalLubeOil, ArrivalFreshWater, ArrivalForward, ArrivalMean,
                ArrivalAfter, DeparturedFuelOil, DeparturedDieselOil, DeparturedLubeOil, DeparturedFreshWater, DeparturedForward, DeparturedMean,
                DeparturedAfter, WaterSupplied, BunkerSupplied, StoresSupplied, ProvisionSupplied, CrewChanges, Remarks, Others, VoyageName, VesselName
            }

            var formData = new FormData();
            formData.append("VoyageUUID", $("input[name='DynamicModel[Voyage]']").val())
            formData.append("AdditionalData", JSON.stringify(AdditionalData))
            axios({
                url: globalContext.globalHost + globalContext.globalPathLink + "t-d-r/preview",
                method: "POST",
                responseType: 'text',
                data: formData,
                auth: {
                    username: globalContext.authInfo.username,
                    password: globalContext.authInfo.access_token
                }
            }).then((response) => {


                $('#pdfFrame').attr('src', 'data:application/pdf;base64,' + response.data);
            });

            window.$("#PreviewPdfModal").modal("toggle");
        }
        // }else{
        //     alert("You are not allowed to Preview PDF, Please check your User Permission.")
        // }
    }

    $(".onBlurSetCookies").off("blur").on("blur",function(){
        setTimeout(()=>{
            handleCreateCookie()
        },100)
    })

    useEffect(() => {

        var today = new Date();

        setValue("DynamicModel[DocDate]", moment(today).format("DD/MM/YYYY"))

        GetAllDropDown(['Voyage'], globalContext).then(res => {

            var arrayVoyage = []
            $.each(res.Voyage, function (key, value) {
                arrayVoyage.push({ value: value.VoyageUUID, label: `${value.VoyageNumber}(${value.vessel.VesselCode})` })
            })

            setVoyage(sortArray(arrayVoyage))


        })

        if (getCookie('tdrreport')) {
            var getCookieArray = getCookie('tdrreport');
            var getCookieArray = JSON.parse(getCookieArray);
            for (var i = 0; i < getCookieArray.length; i++) {
                var inputvalue = getCookieArray[i];
                var myString = inputvalue.substr(inputvalue.indexOf("/") + 1)
                var myString2 = inputvalue.split("/").shift();

                setValue(myString2, myString)
                //$("#" + myString2).val(myString);

            }
        }


        return () => {

        }
    }, [props.data.model])


    const { register, handleSubmit, setValue, getValues, unregister, reset, control, watch, formState: { errors } } = useForm({

    });

    return (

        <div className="card card-primary">

            <div className="card-body">


                <div className="ml-2 mb-2">
            
                    <button className={`${filteredAp.find((item) => item == `preview-${modelLinkTemp}`) !== undefined ? "" : "disabledAccess"} btn btn-success mr-2 PreviewTDRreport`} type="button" onClick={handlePreview}>Preview</button>
                    <button className="btn btn-success Clear" type="button" onClick={handleClear}>Clear</button>
                </div>

                <div className="card lvl1">
                    <div className="card-body">
                        <div className="container">
                            <div className="row">
                                <div className="col-4">
                                    <label htmlFor="formGroupExampleInput">Doc Date</label>
                                    <input defaultValue=''{...register("DynamicModel[DocDate]")} className={`form-control onBlurSetCookies`} />

                                </div>
                                <div className="col-4">
                                    <label htmlFor="formGroupExampleInput">Voyage No.</label>
                                    <Controller
                                        name="DynamicModel[Voyage]"
                                        id="Voyage"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("DynamicModel[Voyage]")}
                                                value={value ? voyage.find(c => c.value === value) : null}
                                                onChange={val => { val == null ? onChange(null) : onChange(val.value); handleChangeVoyage(val) }}
                                                options={voyage}
                                                className="basic-select Voyage onBlurSetCookies"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>

                            </div>
                            <div className="row">
                                <div className="col-8">
                                    <label htmlFor="formGroupExampleInput">ARRIVAL PILOT STATION(PINTU GEDUNG)</label>
                                </div>
                                <div className="col-4">
                                    <div className="form-group">
                                        <Controller
                                            name="DynamicModel[ArrivalPilotStation]"
                                            control={control}

                                            render={({ field: { onChange, value } }) => (
                                                <>
                                                    <Flatpickr
                                                        value={value}
                                                        {...register('DynamicModel[ArrivalPilotStation]')}

                                                        onChange={val => {

                                                            onChange(moment(val[0]).format("DD/MM/YYYY HH:mm"))
                                                        }}
                                                        className="form-control ArrivalPilotStation onBlurSetCookies"
                                                        options={{
                                                            enableTime: true,
                                                            time_24hr: true,
                                                            dateFormat: "d/m/Y H:i"
                                                        }}

                                                    />
                                                </>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="col-8">
                                    <label htmlFor="formGroupExampleInput">PILOT ON BOARD</label>
                                </div>
                                <div className="col-4">
                                    <div className="form-group">
                                        <Controller
                                            name="DynamicModel[PilotOnBoard]"
                                            control={control}

                                            render={({ field: { onChange, value } }) => (
                                                <>
                                                    <Flatpickr
                                                        value={value}
                                                        {...register('DynamicModel[PilotOnBoard]')}

                                                        onChange={val => {

                                                            onChange(moment(val[0]).format("DD/MM/YYYY HH:mm"))
                                                        }}
                                                        className="form-control PilotOnBoard onBlurSetCookies"
                                                        options={{
                                                            enableTime: true,
                                                            time_24hr: true,
                                                            dateFormat: "d/m/Y H:i"
                                                        }}

                                                    />
                                                </>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="col-8">
                                    <label htmlFor="formGroupExampleInput">DROP ANCHOR (QWP)</label>
                                </div>
                                <div className="col-4">
                                    <div className="form-group">
                                        <Controller
                                            name="DynamicModel[DropAnchor]"
                                            control={control}

                                            render={({ field: { onChange, value } }) => (
                                                <>
                                                    <Flatpickr
                                                        value={value}
                                                        {...register('DynamicModel[DropAnchor]')}

                                                        onChange={val => {

                                                            onChange(moment(val[0]).format("DD/MM/YYYY HH:mm"))
                                                        }}
                                                        className="form-control DropAnchor onBlurSetCookies"
                                                        options={{
                                                            enableTime: true,
                                                            time_24hr: true,
                                                            dateFormat: "d/m/Y H:i"
                                                        }}

                                                    />
                                                </>
                                            )}
                                        />
                                    </div>



                                </div>
                                <div className="col-8">
                                    <label htmlFor="formGroupExampleInput">PILOT ON BOARD TO "09" WHF (BERTH)</label>
                                </div>

                                <div className="col-4">
                                    <div className="form-group">
                                        <Controller
                                            name="DynamicModel[PilotOnBoardWHF]"
                                            control={control}

                                            render={({ field: { onChange, value } }) => (
                                                <>
                                                    <Flatpickr
                                                        value={value}
                                                        {...register('DynamicModel[PilotOnBoardWHF]')}

                                                        onChange={val => {

                                                            onChange(moment(val[0]).format("DD/MM/YYYY HH:mm"))
                                                        }}
                                                        className="form-control PilotOnBoardWHF onBlurSetCookies"
                                                        options={{
                                                            enableTime: true,
                                                            time_24hr: true,
                                                            dateFormat: "d/m/Y H:i"
                                                        }}

                                                    />
                                                </>
                                            )}
                                        />

                                    </div>
                                </div>

                                <div className="col-8">
                                    <label htmlFor="formGroupExampleInput">Make All Fast</label>
                                </div>
                                <div className="col-4">
                                    <div className="form-group">
                                        <Controller
                                            name="DynamicModel[MakeAllFast]"
                                            control={control}

                                            render={({ field: { onChange, value } }) => (
                                                <>
                                                    <Flatpickr
                                                        value={value}
                                                        {...register('DynamicModel[MakeAllFast]')}

                                                        onChange={val => {

                                                            onChange(moment(val[0]).format("DD/MM/YYYY HH:mm"))
                                                        }}
                                                        className="form-control MakeAllFast onBlurSetCookies"
                                                        options={{
                                                            enableTime: true,
                                                            time_24hr: true,
                                                            dateFormat: "d/m/Y H:i"
                                                        }}

                                                    />
                                                </>
                                            )}
                                        />

                                    </div>
                                </div>
                                <div className="col-8">
                                    <label htmlFor="formGroupExampleInput">FREE PRACTIGUE GRANTED</label>
                                </div>
                                <div className="col-4">
                                    <div className="form-group">
                                        <Controller
                                            name="DynamicModel[FreePractigueGranted]"
                                            control={control}

                                            render={({ field: { onChange, value } }) => (
                                                <>
                                                    <Flatpickr
                                                        value={value}
                                                        {...register('DynamicModel[FreePractigueGranted]')}

                                                        onChange={val => {

                                                            onChange(moment(val[0]).format("DD/MM/YYYY HH:mm"))
                                                        }}
                                                        className="form-control FreePractigueGranted onBlurSetCookies"
                                                        options={{
                                                            enableTime: true,
                                                            time_24hr: true,
                                                            dateFormat: "d/m/Y H:i"
                                                        }}

                                                    />
                                                </>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="col-8">
                                    <label htmlFor="formGroupExampleInput">COMMENCED DISCHARGING</label>
                                </div>
                                <div className="col-4">
                                    <div className="form-group">
                                        <Controller
                                            name="DynamicModel[CommencedDischarging]"
                                            control={control}

                                            render={({ field: { onChange, value } }) => (
                                                <>
                                                    <Flatpickr
                                                        value={value}
                                                        {...register('DynamicModel[CommencedDischarging]')}

                                                        onChange={val => {

                                                            onChange(moment(val[0]).format("DD/MM/YYYY HH:mm"))
                                                        }}
                                                        className="form-control CommencedDischarging onBlurSetCookies"
                                                        options={{
                                                            enableTime: true,
                                                            time_24hr: true,
                                                            dateFormat: "d/m/Y H:i"
                                                        }}

                                                    />
                                                </>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="col-8">
                                    <label htmlFor="formGroupExampleInput">COMPLETED DISCHARGING</label>
                                </div>
                                <div className="col-4">
                                    <div className="form-group">
                                        <Controller
                                            name="DynamicModel[CompletedDischarging]"
                                            control={control}

                                            render={({ field: { onChange, value } }) => (
                                                <>
                                                    <Flatpickr
                                                        value={value}
                                                        {...register('DynamicModel[CompletedDischarging]')}

                                                        onChange={val => {

                                                            onChange(moment(val[0]).format("DD/MM/YYYY HH:mm"))
                                                        }}
                                                        className="form-control CompletedDischarging onBlurSetCookies"
                                                        options={{
                                                            enableTime: true,
                                                            time_24hr: true,
                                                            dateFormat: "d/m/Y H:i"
                                                        }}

                                                    />
                                                </>
                                            )}
                                        />

                                    </div>
                                </div>
                                <div className="col-8">
                                    <label htmlFor="formGroupExampleInput">COMMENCED LOADING</label>
                                </div>
                                <div className="col-4">
                                    <div className="form-group">
                                        <Controller
                                            name="DynamicModel[CommencedLoading]"
                                            control={control}

                                            render={({ field: { onChange, value } }) => (
                                                <>
                                                    <Flatpickr
                                                        value={value}
                                                        {...register('DynamicModel[CommencedLoading]')}

                                                        onChange={val => {

                                                            onChange(moment(val[0]).format("DD/MM/YYYY HH:mm"))
                                                        }}
                                                        className="form-control CommencedLoading onBlurSetCookies"
                                                        options={{
                                                            enableTime: true,
                                                            time_24hr: true,
                                                            dateFormat: "d/m/Y H:i"
                                                        }}

                                                    />
                                                </>
                                            )}
                                        />

                                    </div>
                                </div>
                                <div className="col-8">
                                    <label htmlFor="formGroupExampleInput">COMPLETED LOADING</label>
                                </div>
                                <div className="col-4">
                                    <div className="form-group">
                                        <Controller
                                            name="DynamicModel[CompletedLoading]"
                                            control={control}

                                            render={({ field: { onChange, value } }) => (
                                                <>
                                                    <Flatpickr
                                                        value={value}
                                                        {...register('DynamicModel[CompletedLoading]')}

                                                        onChange={val => {

                                                            onChange(moment(val[0]).format("DD/MM/YYYY HH:mm"))
                                                        }}
                                                        className="form-control CompletedLoading onBlurSetCookies"
                                                        options={{
                                                            enableTime: true,
                                                            time_24hr: true,
                                                            dateFormat: "d/m/Y H:i"
                                                        }}

                                                    />
                                                </>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="col-8">
                                    <label htmlFor="formGroupExampleInput">COMMENCE LASHING</label>
                                </div>
                                <div className="col-4">
                                    <div className="form-group">
                                        <Controller
                                            name="DynamicModel[CommenceLashing]"
                                            control={control}

                                            render={({ field: { onChange, value } }) => (
                                                <>
                                                    <Flatpickr
                                                        value={value}
                                                        {...register('DynamicModel[CommenceLashing]')}

                                                        onChange={val => {

                                                            onChange(moment(val[0]).format("DD/MM/YYYY HH:mm"))
                                                        }}
                                                        className="form-control CommenceLashing onBlurSetCookies"
                                                        options={{
                                                            enableTime: true,
                                                            time_24hr: true,
                                                            dateFormat: "d/m/Y H:i"
                                                        }}

                                                    />
                                                </>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="col-8">
                                    <label htmlFor="formGroupExampleInput">COMPLETED LASHING</label>
                                </div>
                                <div className="col-4">
                                    <div className="form-group">
                                        <Controller
                                            name="DynamicModel[CompletedLashing]"
                                            control={control}

                                            render={({ field: { onChange, value } }) => (
                                                <>
                                                    <Flatpickr
                                                        value={value}
                                                        {...register('DynamicModel[CompletedLashing]')}

                                                        onChange={val => {

                                                            onChange(moment(val[0]).format("DD/MM/YYYY HH:mm"))
                                                        }}
                                                        className="form-control CompletedLashing onBlurSetCookies"
                                                        options={{
                                                            enableTime: true,
                                                            time_24hr: true,
                                                            dateFormat: "d/m/Y H:i"
                                                        }}

                                                    />
                                                </>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="col-8">
                                    <label htmlFor="formGroupExampleInput">PILOT ON BOARD FOR SAILING</label>
                                </div>
                                <div className="col-4">
                                    <div className="form-group">
                                        <Controller
                                            name="DynamicModel[PilotOnBoardSailing]"
                                            control={control}

                                            render={({ field: { onChange, value } }) => (
                                                <>
                                                    <Flatpickr
                                                        value={value}
                                                        {...register('DynamicModel[PilotOnBoardSailing]')}

                                                        onChange={val => {

                                                            onChange(moment(val[0]).format("DD/MM/YYYY HH:mm"))
                                                        }}
                                                        className="form-control PilotOnBoardSailing onBlurSetCookies"
                                                        options={{
                                                            enableTime: true,
                                                            time_24hr: true,
                                                            dateFormat: "d/m/Y H:i"
                                                        }}

                                                    />
                                                </>
                                            )}
                                        />
                                    </div>


                                </div>
                                <div className="col-8">
                                    <label htmlFor="formGroupExampleInput">ETA NEXT PORT</label>
                                </div>
                                <div className="col-4">
                                    <div className="form-group">
                                        <Controller
                                            name="DynamicModel[EtaNextPort]"
                                            control={control}

                                            render={({ field: { onChange, value } }) => (
                                                <>
                                                    <Flatpickr
                                                        value={value}
                                                        {...register('DynamicModel[EtaNextPort]')}

                                                        onChange={val => {

                                                            onChange(moment(val[0]).format("DD/MM/YYYY HH:mm"))
                                                        }}
                                                        className="form-control EtaNextPort onBlurSetCookies"
                                                        options={{
                                                            enableTime: true,
                                                            time_24hr: true,
                                                            dateFormat: "d/m/Y H:i"
                                                        }}

                                                    />
                                                </>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="col-4">
                                    <label htmlFor="formGroupExampleInput">PORT ROTATION</label>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <input defaultValue=''{...register("DynamicModel[PortRotation]")} className={`form-control onBlurSetCookies`} readOnly />
                                    </div>
                                </div>


                            </div>
                            <div className="float-right mb-4">

                                <div style={{ width: "12%", paddingBottom: "10px" }}>
                                    <button type="button" className="btn btn-success  mt-2" onClick={handleGenerate}>Generate</button>
                                </div>


                            </div>
                        </div>

                        <div className="container">
                          
                                    <div className="row">
                                        <div className="col-6">
                                            <label htmlFor="formGroupExampleInput">TOTAL CONTAINER DISCHARGED</label>
                                        </div>
                                        <div className="col-2">
                                            <div className="form-group">
                                                <input defaultValue=''{...register("DynamicModel[UnitsDischarge]")} className={`form-control onBlurSetCookies`} readOnly />
                                            </div></div>
                                        <div className="col-1">
                                            <label htmlFor="formGroupExampleInput">Units</label>
                                        </div>
                                        <div className="col-2">
                                            <div className="form-group">
                                                <input defaultValue=''{...register("DynamicModel[TeusDischarge]")} className={`form-control onBlurSetCookies`} readOnly />
                                            </div></div>
                                        <div className="col-1">
                                            <label htmlFor="formGroupExampleInput">Teus</label>
                                        </div>
                                    </div>

                                    <table id="discharging-table" style={{ width: "100%" }} className="table table-bordered  container-items d-none">

                                    </table>

                                    <div className="row">
                                        <div className="col-6">
                                            <label htmlFor="formGroupExampleInput">TOTAL CONTAINER LOAD</label>
                                        </div>
                                        <div className="col-2">
                                            <div className="form-group">
                                                <input defaultValue=''{...register("DynamicModel[UnitsLoad]")} className={`form-control onBlurSetCookies`} readOnly />
                                            </div>
                                        </div>
                                        <div className="col-1">
                                            <label htmlFor="formGroupExampleInput">Units</label>
                                        </div>
                                        <div className="col-2">
                                            <div className="form-group">
                                                <input defaultValue=''{...register("DynamicModel[TeusLoad]")} className={`form-control onBlurSetCookies`} readOnly />
                                            </div>
                                        </div>
                                        <div className="col-1">
                                            <label htmlFor="formGroupExampleInput">Teus</label>
                                        </div>
                                    </div>

                                    <table id="loadinglist-table" style={{ width: "100%" }} className="table table-bordered  container-items">

                                    </table>

                                    <div className="row">
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">DELAYS DURING LOADING</label>
                                        </div>
                                        <div className="col-10">
                                            <div className="form-group">
                                                <input defaultValue=''{...register("DynamicModel[DelaysLoading]")} className={`form-control onBlurSetCookies`} />
                                            </div>
                                        </div>
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">TIME LOST</label>
                                        </div>
                                        <div className="col-2">
                                            <div className="form-group">
                                                <input defaultValue=''{...register("DynamicModel[TimeLost]")} className={`form-control onBlurSetCookies`} />
                                            </div>
                                        </div>

                                    </div>
                                    <div className="row">
                                        <div className="col-6">
                                            <label htmlFor="formGroupExampleInput">ARRIVAL RO.B CONDITION</label>
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor="formGroupExampleInput">ARRIVAL DRAFT</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">FUEL OIL</label>
                                        </div>
                                        <div className="col-2">

                                            <div className="form-group">
                                                <input defaultValue=''{...register("DynamicModel[ArrivalFuelOil]")} className={`form-control onBlurSetCookies`} />
                                            </div>

                                        </div>
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">LTRS</label>
                                        </div>
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">FORWARD</label>
                                        </div>
                                        <div className="col-2">

                                            <div className="form-group">
                                                <input defaultValue=''{...register("DynamicModel[ArrivalForward]")} className={`form-control onBlurSetCookies`} />
                                            </div>

                                        </div>
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">m</label>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">DIESEL OIL</label>
                                        </div>
                                        <div className="col-2">

                                            <div className="form-group">
                                                <input defaultValue=''{...register("DynamicModel[ArrivalDieselOil]")} className={`form-control onBlurSetCookies`} />
                                            </div>
                                        </div>
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">MTS</label>
                                        </div>
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">MEAN</label>
                                        </div>
                                        <div className="col-2">

                                            <div className="form-group">
                                                <input defaultValue=''{...register("DynamicModel[ArrivalMean]")} className={`form-control onBlurSetCookies`} />
                                            </div>
                                        </div>
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">m</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">LUBE OIL</label>
                                        </div>
                                        <div className="col-2">

                                            <div className="form-group">
                                                <input defaultValue=''{...register("DynamicModel[ArrivalLubeOil]")} className={`form-control onBlurSetCookies`} />
                                            </div>
                                        </div>
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">MTS</label>
                                        </div>
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">AFTER</label>
                                        </div>
                                        <div className="col-2">

                                            <div className="form-group">
                                                <input defaultValue=''{...register("DynamicModel[ArrivalAfter]")} className={`form-control onBlurSetCookies`} />
                                            </div>
                                        </div>
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">m</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">FRESH WATER</label>
                                        </div>
                                        <div className="col-2">

                                            <div className="form-group">
                                                <input defaultValue=''{...register("DynamicModel[ArrivalFreshWater]")} className={`form-control onBlurSetCookies`} />
                                            </div>
                                        </div>
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">MTS</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-6">
                                            <label htmlFor="formGroupExampleInput">DEPARTURED RO.B CONDITION</label>
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor="formGroupExampleInput">DEPARTURED DRAFT</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">FUEL OIL</label>
                                        </div>
                                        <div className="col-2">

                                            <div className="form-group">
                                                <input defaultValue=''{...register("DynamicModel[DeparturedFuelOil]")} className={`form-control onBlurSetCookies`} />
                                            </div>
                                        </div>
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">LTRS</label>
                                        </div>
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">FORWARD</label>
                                        </div>
                                        <div className="col-2">

                                            <div className="form-group">
                                                <input defaultValue=''{...register("DynamicModel[DeparturedForward]")} className={`form-control onBlurSetCookies`} />
                                            </div>
                                        </div>
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">m</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">DIESEL OIL</label>
                                        </div>
                                        <div className="col-2">

                                            <div className="form-group">
                                                <input defaultValue=''{...register("DynamicModel[DeparturedDieselOil]")} className={`form-control onBlurSetCookies`} />
                                            </div>
                                        </div>
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">MTS</label>
                                        </div>
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">MEAN</label>
                                        </div>
                                        <div className="col-2">

                                            <div className="form-group">
                                                <input defaultValue=''{...register("DynamicModel[DeparturedMean]")} className={`form-control onBlurSetCookies`} />
                                            </div>
                                        </div>
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">m</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">LUBE OIL</label>
                                        </div>
                                        <div className="col-2">

                                            <div className="form-group"><input defaultValue=''{...register("DynamicModel[DeparturedLubeOil]")} className={`form-control onBlurSetCookies`} /></div>
                                        </div>
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">MTS</label>
                                        </div>
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">AFTER</label>
                                        </div>
                                        <div className="col-2">

                                            <div className="form-group"><input defaultValue=''{...register("DynamicModel[DeparturedAfter]")} className={`form-control onBlurSetCookies`} /></div>
                                        </div>
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">m</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">FRESH WATER</label>
                                        </div>
                                        <div className="col-2">

                                            <div className="form-group"><input defaultValue=''{...register("DynamicModel[DeparturedFreshWater]")} className={`form-control onBlurSetCookies`} /></div>
                                        </div>
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">MTS</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <label htmlFor="formGroupExampleInput">GENERAL SERVICE/SERVICE NOTE/OWNER EXPENSES:</label>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">WATER SUPPLIED</label>
                                        </div>
                                        <div className="col-10">

                                            <div className="form-group"><input defaultValue=''{...register("DynamicModel[WaterSupplied]")} className={`form-control onBlurSetCookies`} /></div>
                                        </div>
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">BUNKER SUPPLIED</label>
                                        </div>
                                        <div className="col-10">

                                            <div className="form-group"><input defaultValue=''{...register("DynamicModel[BunkerSupplied]")} className={`form-control onBlurSetCookies`} /></div>
                                        </div>
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">SHIP STORES SUPPLIED</label>
                                        </div>
                                        <div className="col-10">

                                            <div className="form-group"><input defaultValue=''{...register("DynamicModel[ShipStoresSupplied]")} className={`form-control onBlurSetCookies`} /></div>
                                        </div>
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">PROVISION SUPPLIED</label>
                                        </div>
                                        <div className="col-10">

                                            <div className="form-group"><input defaultValue=''{...register("DynamicModel[ProvisionSupplied]")} className={`form-control onBlurSetCookies`} /></div>
                                        </div>
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">CREW CHANGES</label>
                                        </div>
                                        <div className="col-10">

                                            <div className="form-group"><input defaultValue=''{...register("DynamicModel[CrewChanges]")} className={`form-control onBlurSetCookies`} /></div>
                                        </div>
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">REMARKS</label>
                                        </div>
                                        <div className="col-10">

                                            <div className="form-group"><input defaultValue=''{...register("DynamicModel[Remarks]")} className={`form-control onBlurSetCookies`} /></div>
                                        </div>
                                        <div className="col-2">
                                            <label htmlFor="formGroupExampleInput">OTHERS</label>
                                        </div>
                                        <div className="col-10">
                                            <div className="form-group"><input defaultValue=''{...register("DynamicModel[Others]")} className={`form-control onBlurSetCookies`} /></div>
                                        </div>
                                    </div>

                              
                        </div>

                    </div>
                </div>

            </div>
            <div className="ml-4 mb-4">
                <button className={`${filteredAp.find((item) => item == `preview-${modelLinkTemp}`) !== undefined ? "" : "disabledAccess"} btn btn-success mr-2 PreviewTDRreport`} type="button" onClick={handlePreview}>Preview</button>
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
                            <iframe id="pdfFrame" src="" width="100%" height="700"></iframe>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>




        </div>








    )
}






export default Form