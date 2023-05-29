import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, UpdateData, ToastNotify, ControlOverlay, GetAllDropDown, FindVoyageSuggestion,sortArray } from '../../Components/Helper.js'
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

    const [port, setPort] = useState([])

    function replaceNull(someObj, replaceValue = "***") {
        const replacer = (key, value) =>
            String(value) === "null" || String(value) === "undefined" ? replaceValue : value;
        return JSON.parse(JSON.stringify(someObj, replacer));
    }
    const { register, handleSubmit, setValue, getValues, reset, trigger, control, watch, formState: { errors } } = useForm({});
    var modelLinkTemp;
    if (globalContext.userRule !== "") {
         modelLinkTemp=props.data.modelLink
        const objRule = JSON.parse(globalContext.userRule);
        var filteredAp = objRule.Rules.filter(function (item) {
          return item.includes(modelLinkTemp);
        });
        
    }

    var count = 0;
    var CheckClass = "";
    function rowStyle(row, index) {
        var classes = 'my-class'
        var classes2 = 'my-class2'
        if (row.Grouping == 1) {
            count = row.Grouping
            CheckClass = "classes2"
            // return {
            //     classes: classes
            // }
        }
        else {
            if (row.Grouping == count) {
                if (CheckClass == "classes2") {
                    count = row.Grouping
                    CheckClass = "classes2"
                    return {
                        classes: classes2
                    }
                } else {
                    count = row.Grouping
                    CheckClass = "classes"
                    return {
                        classes: classes
                    }
                }

            } else {
                if (CheckClass == "classes2") {
                    count = row.Grouping
                    CheckClass = "classes"
                    return {
                        classes: classes
                    }
                } else {
                    count = row.Grouping
                    CheckClass = "classes2"
                    return {
                        classes: classes2
                    }
                }
            }

        }
        return {
            css: {
                color: 'black'
            }
        }
    }

    function handleFindVoyage() {
        var filters = {
            POL: getValues("DynamicModal[POL]"),
            POD: getValues("DynamicModal[POD]"),
            POLReqETA: getValues("DynamicModal[POLETA]") ? getValues("DynamicModal[POLETA]") : "",
            PODReqETA: getValues("DynamicModal[PODETA]") ? getValues("DynamicModal[PODETA]") : "",
        }
        FindVoyageSuggestion(filters, globalContext).then(res => {
            var NewData = [];
            var PresetTitle = [{ title: "Vessel", field: "Vessel", rowspan: 2, align: "center", valign: "middle",filterControl:"input", sortable:true }, { title: "Voyage", field: "Voyage", rowspan: 2, align: "center", valign: "middle", filterControl:"input", sortable :true }]
            NewData.push(PresetTitle)
            var FieldData = []

            $.each(res.columnsTable, function (key, value) {
                var value1 = { "title": value.Area + "(" + value.PortCode + ")", "colspan": 2, "align": "center" }
                NewData[0].push(value1)
                FieldData.push({ "align": "center", "field": value.AreaUUID + "/ETA", "title": "ETA", "filterControl":"input", "sortable":true});
                FieldData.push({ "align": "center", "field": value.AreaUUID + "/ETD", "title": "ETD", "filterControl":"input", "sortable":true});
            })

            NewData.push(FieldData);

           window.$('#voyage-suggestion-table').bootstrapTable('destroy').bootstrapTable({
                rowStyle: rowStyle,
                toolbarSelector: "#toolbar",
                filterControl: true,
                pagination: true,
                pageList: [10, 50, 100, 500],
                showRefresh: true,
                showColumns: true,
                // sidePagination: 'server',
                showColumnsToggleAll: true,
                showExport: true,
                columns: NewData,
                data: res.dataTable,
            })
        })
    }
    useEffect(() => {

        GetAllDropDown(['Area'], globalContext).then(res => {
            var ArrayPortCode = []
            $.each(res.Area, function (key, value) {
                ArrayPortCode.push({ value: value.AreaUUID, label: value.PortCode })
            })
            setPort(sortArray(ArrayPortCode))
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
                        <tbody><tr>

                            <td>
                                <div className="col">
                                    POL ETA:
                                </div>
                            </td>
                            <td>
                                <div className="col">
                                    <Controller

                                        control={control}
                                        name={"DynamicModal[POLETA]"}
                                        render={({ field: { onChange, value } }) => (
                                            <>
                                                <Flatpickr
                                            
                                                    value={value ? value : ""}
                                                    {...register(`DynamicModal[POLETA]`)}
                                                    onChange={val => {
                                                     
                                                        onChange(moment(val[0]).format("DD/MM/YYYY HH:mm"))
                                                    }}
                                                    className={`form-control POLETA flatpickr-input`}
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
                            </td>
                            <td>
                                <div className="col">
                                    POD ETA:
                                </div>
                            </td>
                            <td>
                                <div className="col">
                                    <Controller

                                        control={control}
                                        name={"DynamicModal[PODETA]"}
                                        render={({ field: { onChange, value } }) => (
                                            <>
                                                <Flatpickr
                                                    value={value ? value : ""}
                                                    {...register(`DynamicModal[PODETA]`)}
                                                    onChange={val => {

                                                        onChange(moment(val[0]).format("DD/MM/YYYY HH:mm"))
                                                    }}
                                                    className={`form-control PODETA flatpickr-input`}
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
                            </td>
                            <td>
                                <div className="col">
                                    POL:
                                </div>
                            </td>
                            <td>
                                <div className="col">

                                    <Controller
                                        name="DynamicModal[POL]"
                                        id="POL"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("DynamicModal[POL]")}
                                                value={value ? port.find(c => c.value === value) : null}
                                                onChange={val => { val == null ? onChange(null) : onChange(val.value) }}
                                                options={port}
                                                className="POL"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>

                            </td>

                            <td>
                                <div className="col">
                                    POD:
                                </div>
                            </td>
                            <td>
                                <div className="col">

                                    <Controller
                                        name="DynamicModal[POD]"
                                        id="POD"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("DynamicModal[POD]")}
                                                value={value ? port.find(c => c.value === value) : null}
                                                onChange={val => { val == null ? onChange(null) : onChange(val.value) }}
                                                options={port}
                                                className="POD"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>
                            </td>

                            <td>
                                <div className="col">
                                    <button type="button" className="btn btn-success float-right" onClick={handleFindVoyage}>Find</button>
                                </div>
                            </td>

                        </tr></tbody></table>
                </div>

                <div class="indexTableCard">
                    <table id="voyage-suggestion-table">

                    </table>
                </div>


            </div>
        </div>




    )
}






export default Index