import React, { useContext } from 'react'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Controller } from "react-hook-form";
import moment from "moment";
import Select from 'react-select'
import FormContext from '../../Components/CommonElement/FormContext';
import GlobalContext from "../../Components/GlobalContext"
import $ from "jquery";


function QuickFormMiddleCard(props) {
    const formContext = useContext(FormContext)
    const globalContext = useContext(GlobalContext)

    const formName = props.MiddleCardItem.formName
    const lowercaseFormName = props.MiddleCardItem.formName.toLowerCase()
    const dropdownInputStyle = {
        maxHeight: "800px",
        overflowY: "auto",
        maxWidth: "1500px"
    };


    $(".branchAddressConsignee").unbind().on('input', function (event) {
        var tempDataTarget = $(event.target).attr('data-target')
        $(`input[data-target='${tempDataTarget}']`).val($(event.target).val());
    });

    $(".branchAddressDetailConsignee").unbind().on('input', function (event) {
        var tempDataTarget = $(event.target).attr('data-target')
        $(`input[data-target='${tempDataTarget}']`).val($(event.target).val());
    });

    $(".branchAddressShipper").unbind().on('input', function (event) {
        var tempDataTarget = $(event.target).attr('data-target')
        $(`input[data-target='${tempDataTarget}']`).val($(event.target).val());
    });

    $(".branchAddressDetailShipper").unbind().on('input', function (event) {
        var tempDataTarget = $(event.target).attr('data-target')
        $(`input[data-target='${tempDataTarget}']`).val($(event.target).val());
    });


    $(".branchAddressNotifyParty").unbind().on('input', function (event) {
        var tempDataTarget = $(event.target).attr('data-target')
        $(`input[data-target='${tempDataTarget}']`).val($(event.target).val());
    });

    $(".branchAddressDetailNotifyParty").unbind().on('input', function (event) {
        var tempDataTarget = $(event.target).attr('data-target')
        $(`input[data-target='${tempDataTarget}']`).val($(event.target).val());
    });




    return (
        <>
            <div className={`${props.MiddleCardItem.cardLength}`}>
                <div className="card document lvl1">
                    <div className="card-header">
                        <h3 className="card-title">{props.MiddleCardItem.cardTitle}
                        </h3>
                        <div className="card-tools">
                            <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                <i className="fas fa-minus" data-toggle="tooltip" title="" data-placement="top" data-original-title="Collapse"></i>
                            </button>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="card">

                            <p style={{ "text-align": "center", "font-size": "20px" }}><strong><u>Delivery Order</u></strong></p>
                            <table>
                                <td>
                                    <div className="row">
                                        <div className="col-md-6">

                                            <div className="DeliveryOrder-shipper-form">
                                                <label>Shipper</label>
                                                <input type="text" id="CompanyROC-Shipper-Quickform" className="form-control dropdownInputCompany mb-3" data-target="CompanyROC-Shipper"></input>
                                                <div className="dropdownTable DeliveryOrderagent-dropdown d-none">
                                                    <table id="CompanyROC-Shipper-Quickform-Table"></table>
                                                </div>
                                                <div className="form-group">  <input type="text" id="BranchAddressLine1-Shipper-Quickform" className="form-control branchAddressShipper" data-target="BranchAddressLine1-Shipper"></input></div>
                                                <div className="form-group">  <input type="text" id="BranchAddressLine2-Shipper-Quickform" className="form-control branchAddressShipper" data-target="BranchAddressLine2-Shipper"></input></div>
                                                <div className="form-group">  <input type="text" id="BranchAddressLine3-Shipper-Quickform" className="form-control branchAddressShipper" data-target="BranchAddressLine3-Shipper"></input></div>
                                            </div>

                                            <div className="DeliveryOrder-consignee-form">
                                                <label>Consignee</label>
                                                <input type="text" id="CompanyROC-Consignee-Quickform" className="form-control dropdownInputCompany mb-3" data-target="CompanyROC-Consignee"></input>
                                                <div className="dropdownTable DeliveryOrderagent-dropdown d-none">
                                                    <table id="CompanyROC-Consignee-Quickform-Table"></table>
                                                </div>
                                                <div className="form-group">  <input type="text" id="BranchAddressLine1-Consignee-Quickform" className="form-control branchAddressConsignee" data-target="BranchAddressLine1-Consignee"></input></div>
                                                <div className="form-group">  <input type="text" id="BranchAddressLine2-Consignee-Quickform" className="form-control branchAddressConsignee" data-target="BranchAddressLine2-Consignee"></input></div>
                                                <div className="form-group">  <input type="text" id="BranchAddressLine3-Consignee-Quickform" className="form-control branchAddressConsignee" data-target="BranchAddressLine3-Consignee"></input></div>
                                            </div>

                                            <div className="DeliveryOrder-NotifyParty-form">
                                                <label>Notify Party</label>
                                                <input type="text" id="CompanyROC-NotifyParty-Quickform" className="form-control dropdownInputCompany mb-3" data-target="CompanyROC-NotifyParty" readOnly></input>
                                              
                                                <div className="form-group">  <input type="text" id="BranchAddressLine1-NotifyParty-Quickform" className="form-control branchAddressNotifyParty" data-target="BranchAddressLine1-NotifyParty" readOnly></input></div>
                                                <div className="form-group">  <input type="text" id="BranchAddressLine2-NotifyParty-Quickform" className="form-control branchAddressNotifyParty" data-target="BranchAddressLine2-NotifyParty" readOnly></input></div>
                                                <div className="form-group">  <input type="text" id="BranchAddressLine3-NotifyParty-Quickform" className="form-control branchAddressNotifyParty" data-target="BranchAddressLine3-NotifyParty" readOnly></input></div>
                                            </div>
                                            <table style={{ width: '101%', border: '1px solid black' }}>
                                                <tbody>
                                                    <tr>

                                                        <td style={{ fontSize: "10px", width: '31.53%', borderLeft: '1px solid black', paddingRight: "5px", paddingLeft: "5px" }}><strong>Vessel:</strong><br></br>&nbsp;<div class="form-group field-dynamicmodel-vesselname-document"><input type="text" id="dynamicmodel-vesselname-document" class="form-control" readOnly data-target="VesselName-Voyage"></input><div class="help-block"></div></div></td>
                                                        <td style={{ fontSize: "10px", width: '31.53%', borderLeft: '1px solid black', paddingRight: "5px", paddingLeft: "5px" }} ><strong>Date of Arrival:</strong><br></br>&nbsp;
                                                            <input type="text" id="deliveryorder-podeta-document" class="form-control" data-target="podeta"  readOnly></input>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </div>
                                        <div class="col-md-6">
                                            <p style={{ fontSize: "30px", textAlign: 'center' }}><strong>SHIN YANG SHIPPING SDN. BHD.</strong></p>
                                            <p style={{ textAlign: 'center' }}>(No. Syarikat 195874-H)</p>

                                            <div class="holder mb-6">
                                                <label style={{ fontSize: "16px" }}>Agent</label>
                                                <input type="text" id="CompanyROC-Agent-Quickform" class="form-control dropdownInputCompany" readOnly></input>

                                            </div>
                                            <div class="DeliveryOrder-agent-form">
                                                <div class="form-group field-CompanyName-Agent-Quickform">
                                                    <input type="hidden" id="CompanyName-Agent-Quickform" class="form-control" data-target="CompanyName-Agent"></input>
                                                    <div class="help-block"></div>
                                                </div>
                                                <div class="form-group field-OnchangeAgentAddress1">
                                                    <input type="text" id="BranchAddressLine1-Agent-Quickform" class="form-control"  readOnly data-target="BranchAddressLine1-Agent"></input>
                                                    <div class="help-block"></div>
                                                </div>
                                                <div class="form-group field-OnchangeAgentAddress2">
                                                    <input type="text" id="BranchAddressLine2-Agent-Quickform" class="form-control" readOnly data-target="BranchAddressLine2-Agent"></input>
                                                    <div class="help-block"></div>
                                                </div>
                                                <div class="form-group field-OnchangeAgentAddress3">
                                                    <input type="text" id="BranchAddressLine3-Agent-Quickform" class="form-control"  readOnly data-target="BranchAddressLine3-Agent"></input>
                                                    <div class="help-block"></div>
                                                </div>
                                            </div>
                                            <div style={{ "lineHeight": "41px" }}>
                                                <br></br>
                                            </div>
                                            <p style={{ "textAlign": "center" }}>THIS DOCUMENT IS NOT VALID UNLESS PROPERLY<br></br>
                                                COMPLETED, DATED AND SIGNED BY THE UNDERSIGNED<br></br>
                                                SHIPPING AGENT AT THE PORT OF DELIVERY.<br></br>
                                            </p>
                                            <div style={{ width: '102%', fontSize: "14px", float: 'right' }}>

                                                <p style={{ textAlign: 'center' }}>I here by acknowledge receipt of the Delivery Order</p>

                                                <div class="col">
                                                    Name: <div class="form-group field-deliveryorderhauler-poldrivername-document">
                                                        <input type="text" id="deliveryorderhauler-poldrivername-document" class="form-control" readOnly></input>
                                                        <div class="help-block"></div>
                                                    </div>
                                                    I/C:
                                                    <div class="form-group field-deliveryorderhauler-poldriverid-document">
                                                        <input type="text" id="deliveryorderhauler-poldriverid-document" class="form-control"  readOnly></input>
                                                        <div class="help-block"></div>
                                                    </div>
                                                    Date:
                                                </div>
                                                <br></br>
                                                <div style={{ lineHeight: "9px" }}>
                                                    <br></br>
                                                </div>
                                                &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                                                &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                                                _________________________
                                                <br></br>
                                                &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                                                &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                                                Chop &amp; Signature
                                                <p></p>
                                                <div style={{ lineHeight: "1px" }}>
                                                    <br></br>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>





                            </table>
                            <table style={{ width: '99%', border: '2px solid black', margin: '0 auto' }}>

                                <tbody>
                                    <tr>


                                        <td style={{margin: '0px 0px 0px 0px', fontSize: "10px", width: '22.2%', paddingRight: "5px", paddingLeft: "5px"}}><strong>B/L No.:</strong><br></br>&nbsp;
                                         <input type="text" data-target="BL-Document" class="form-control reflect-field bLQuickFormDocNum"  readOnly></input>
                                            
                                        </td>

                                        <td style={{margin: '10px 0px -5px 0px', fontSize: "10px", width: '22.3%', borderLeft: '1px solid black', paddingRight: "5px", paddingLeft: "5px"}}><strong>Port Of Loading:</strong><br></br>&nbsp;
                                            <input type="text" name="POLAreaName" data-target="POLAreaName-ShippingInstructions" class="form-control reflect-field" id="deliveryorder-polareaname-document" readOnly></input>
                                        </td>

                                        <td style={{margin: '10px 0px -5px 0px', fontSize: "10px", width: '22.9%', borderLeft: '1px solid black', paddingRight: "5px", paddingLeft: "5px"}}><strong>DO No.:</strong><br></br>&nbsp;
                                            <input type="text" id="DONo" name="'DocNum" data-target="DocNum" class="form-control reflect-field text-primary" readOnly></input>
                                        </td>
                                        <td style={{margin: '10px 0px -5px 0px', fontSize: "10px", width: '23%', borderLeft: '1px solid black', paddingRight: "5px", paddingLeft: "5px"}}></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default QuickFormMiddleCard