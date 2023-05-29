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
        var tempDataTarget=$(event.target).attr('data-target')
        $(`input[data-target='${tempDataTarget}']`).val($(event.target).val());
    });

    $(".branchAddressDetailConsignee").unbind().on('input', function (event) {
        var tempDataTarget=$(event.target).attr('data-target')
        $(`input[data-target='${tempDataTarget}']`).val($(event.target).val());
    });

    $(".branchAddressShipper").unbind().on('input', function (event) {
        var tempDataTarget=$(event.target).attr('data-target')
        $(`input[data-target='${tempDataTarget}']`).val($(event.target).val());
    });

    $(".branchAddressDetailShipper").unbind().on('input', function (event) {
        var tempDataTarget=$(event.target).attr('data-target')
        $(`input[data-target='${tempDataTarget}']`).val($(event.target).val());
    });
    

    $(".branchAddressNotifyParty").unbind().on('input', function (event) {
        var tempDataTarget=$(event.target).attr('data-target')
        $(`input[data-target='${tempDataTarget}']`).val($(event.target).val());
    });

    $(".branchAddressDetailNotifyParty").unbind().on('input', function (event) {
        var tempDataTarget=$(event.target).attr('data-target')
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

                            <p style={{ "text-align": "left", "font-size": "20px" }}><strong><u>BILL OF LADING</u></strong></p>
                            <p>For Combined Transport Shipment or Port to Port Shipment</p>
                            <table>
                                <td>
                                    <div className="row">
                                        <div className="col-md-6">

                                            <div className="BillOfLading-shipper-form">
                                                <label>Shipper</label>
                                                <input type="text" id="CompanyROC-Shipper-Quickform" className="form-control dropdownInputCompany mb-3" data-target="CompanyROC-Shipper"></input>
                                                <div className="dropdownTable BillOfLadingagent-dropdown d-none">
                                                    <table id="CompanyROC-Shipper-Quickform-Table"></table>
                                                </div>
                                                <div className="form-group">  <input type="text" id="BranchAddressLine1-Shipper-Quickform" className="form-control branchAddressShipper" data-target="BranchAddressLine1-Shipper"></input></div>
                                                <div className="form-group">  <input type="text" id="BranchAddressLine2-Shipper-Quickform" className="form-control branchAddressShipper" data-target="BranchAddressLine2-Shipper"></input></div>
                                                <div className="form-group">  <input type="text" id="BranchAddressLine3-Shipper-Quickform" className="form-control branchAddressShipper" data-target="BranchAddressLine3-Shipper"></input></div>                                                                                     
                                            </div>

                                            <div className="BillOfLading-consignee-form">
                                                <label>Consignee</label>
                                                <input type="text" id="CompanyROC-Consignee-Quickform" className="form-control dropdownInputCompany mb-3" data-target="CompanyROC-Consignee"></input>
                                                <div className="dropdownTable BillOfLadingagent-dropdown d-none">
                                                    <table id="CompanyROC-Consignee-Quickform-Table"></table>
                                                </div>
                                                <div className="form-group">  <input type="text" id="BranchAddressLine1-Consignee-Quickform" className="form-control branchAddressConsignee" data-target="BranchAddressLine1-Consignee"></input></div>
                                                <div className="form-group">  <input type="text" id="BranchAddressLine2-Consignee-Quickform" className="form-control branchAddressConsignee" data-target="BranchAddressLine2-Consignee"></input></div>
                                                <div className="form-group">  <input type="text" id="BranchAddressLine3-Consignee-Quickform" className="form-control branchAddressConsignee" data-target="BranchAddressLine3-Consignee"></input></div>
                                            </div>

                                            <div className="BillOfLading-NotifyParty-form">
                                                <label>Notify Party</label>
                                                <input type="text" id="CompanyROC-NotifyParty-Quickform" className="form-control dropdownInputCompany mb-3" data-target="CompanyROC-NotifyParty"></input>
                                                <div className="dropdownTable BillOfLadingagent-dropdown d-none">
                                                    <table id="CompanyROC-NotifyParty-Quickform-Table"></table>
                                                </div>
                                                <div className="form-group">  <input type="text" id="BranchAddressLine1-NotifyParty-Quickform" className="form-control branchAddressNotifyParty" data-target="BranchAddressLine1-NotifyParty"></input></div>
                                                <div className="form-group">  <input type="text" id="BranchAddressLine2-NotifyParty-Quickform" className="form-control branchAddressNotifyParty" data-target="BranchAddressLine2-NotifyParty"></input></div>
                                                <div className="form-group">  <input type="text" id="BranchAddressLine3-NotifyParty-Quickform" className="form-control branchAddressNotifyParty" data-target="BranchAddressLine3-NotifyParty"></input></div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <p><strong style={{ "text-align": "right", "font-size": "17px", "padding": "40px" }}>SHIN YANG SHIPPING SDN BHD</strong><strong>195874-H</strong></p>
                                            <br></br>
                                            <p style={{ "text-align": "right", "padding": "40px" }}>Sublot 153 (Parent Lot 70), Jalan Kuala Baram,
                                                <br></br>
                                                Kuala Baram, 98100 Miri, Sarawak, East Malaysia.
                                                <br></br>
                                                TEL: 085-428399 FAX: 085-421428 Email:mkty.myy@shinyang.com.my
                                            </p>
                                            <p style={{ "font-size": "15px", "padding": "40px" }}>RECEIVED by the Carrier the Goods as specified above in apparent good order
                                                and condition unless otherwise stated, to be transported to such place as agreed
                                                authorised or permitted herein and subject to all the terms and conditions appearing
                                                on the front and reverse of this Bill of Lading to which the Merchant agrees by
                                                accepting this Bill of Lading, any local privileges and customs notwithstanding.
                                                <br></br><br></br>
                                                The particulars given above as stated by the shipper and the weight, measure
                                                quantity condition, contents and value of the Goods are unknown to the Carrier
                                                “loaded on deck at Shipper's risk.”
                                                <br></br><br></br>
                                                In WITNESS whereof one (1) original Bill of Lading has been signed it not
                                                otherwise stated above, the same being accomplished the other(s), if any to be
                                                avoid, if required by the Carrier one (1) original Bill of Lading must be
                                                surrendered duty endorsed in exchange for the Goods or delivery order.
                                                <br></br><br></br>
                                                The parties name above are jointly and/or severally liable for the charges stated in.
                                            </p>

                                        </div>
                                    </div>
                                </td>





                            </table>
                            <table>
                                <tr>

                                    <div className="row" style={{ "width": "100%", "border": "2px solid black", "margin": "-1px -2px 0px 0px" }}>

                                        <div className="col-xs-12 col-md-6" style={{ "border-right": "2px solid black" }}>
                                            <label>Vessel</label>
                                            <input type="text" className="onchangeshipper form-control vesselQuickForm" id="VesselQuickForm" data-target="VesselName-Voyage" readOnly></input>
                                            <div className="help-block"></div>
                                        </div>

                                        <div className="col-xs-12 col-md-3" style={{ "border-right": "2px solid black" }}>
                                            <label>Voy No</label>
                                            <input type="text" readonly="readonly" className="form-control" id="VoyNo" readOnly></input>
                                            <div className="help-block"></div>
                                        </div>

                                        <div className="col-xs-12 col-md-3">
                                            <label>B/L No</label>
                                            <input readOnly type="text" className="onchangeshipper form-control" id="BLNo" data-target="DocNum"></input>
                                        </div>
                                        <div className="help-block"></div>
                                    </div>

                                </tr>
                                <tr>
                                    <div className="row" style={{ "width": "100%", "border": "2px solid black", "margin": "-1px -2px 0px 0px" }}>
                                        <div className="col-md-3" style={{ "border-right": "2px solid black" }}>
                                            <label>Port of lading</label>
                                            <input type="text" className="onchangeshipper form-control" data-target="POLAreaName-ShippingInstructions" id="portOfLoading"></input>
                                        </div>

                                        <div className="col-md-3" style={{ "border-right": "2px solid black" }}>
                                            <label>Port of discharge</label>
                                            <input type="text" className="form-control" data-target="PODAreaName-ShippingInstructions" id="portOfDischarge"></input>
                                        </div>

                                        <div className="col-md-3" style={{ "border-right": "2px solid black" }}>
                                            <label>Freight payable at</label>
                                            <input type="text" className="form-control" data-target="POLAreaName-ShippingInstructions" id="freightPayable"></input>
                                        </div>

                                        <div className="col-md-3">
                                            <label>Number of original Bs/L</label>
                                            <p>THREE(3)</p>
                                        </div>
                                    </div>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default QuickFormMiddleCard