import React, { useContext } from 'react'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Controller } from "react-hook-form";
import moment from "moment";
import Select from 'react-select'
import FormContext from '../../Components/CommonElement/FormContext';
import GlobalContext from "../../Components/GlobalContext"
import $ from "jquery";


function QuickFormBottomCard(props) {
    const formContext = useContext(FormContext)
    const globalContext = useContext(GlobalContext)

    return (
        <>

            <div className="card lvl1 col-md-12">
                <div className="card-header">
                    <div className="card-tools">
                        <button type="button" className="btn btn-tool" data-toggle="tooltip" title="Collapse" data-card-widget="collapse">
                            <i className="fas fa-minus"></i>
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="card">
                        <table style={{ "width": "95%", "borderCollapse": "collapse", "fontSize": "12px", "border": "1px solid black", "margin": "0 auto" }}>
                            <thead>
                                <tr>
                                    <th style={{ "fontSize": "14px" }}>ABOVE PARTICULARS DECLARE BY SHIPPERS</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ "fontSize": "14px" }}>-No claim in respect of this cargo can be entertained unless lodged with us within one month from the date of the steamer's arrival at this point.</td>
                                </tr>
                                <tr>
                                    <td style={{ "fontSize": "14px" }}>-No survey will be help after seven days from date of steamer's completion of discharges.</td>
                                </tr>
                                <tr>
                                    <td style={{ "fontSize": "14px" }}>-Any cargo survey carried out by the consignee without the presence of the ship's agent at the discharging port or its authorised representative will not be entertained as valid survey</td>
                                </tr>

                            </tbody>
                        </table>
                        <table style={{ "width": "95%", "borderCollapse": "collapse", "fontSize": "12px", "border": "1px solid black", "margin": "0 auto" }}>
                            <tbody>
                                <tr>
                                    <td style={{ "fontSize": "14px" }}>To <strong><label className="getPODCompanyOrBranchName" readonly></label></strong></td>
                                </tr>
                                <tr>
                                    <td style={{ "fontSize": "14px" }}>Please deliver to <strong>
                                    </strong>
                                        <div className="col-6">
                                            <strong>
                                                <div className="form-group field-deliveryorderconsignee-companyname-document has-success">
                                                    <input type="text" id="deliveryorderconsignee-companyname-document" className="form-control onchangeconsignee reflect-field"  readOnly  data-target="CompanyName-Consignee" ></input>
                                                    <div className="help-block"></div>
                                                </div>
                                            </strong>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ "fontSize": "14px" }}>The above noted goods Ex <strong>
                                        <div className="col-6">
                                            <div className="form-group field-dynamicmodel-vesselname-document-footer">
                                                <input type="text" id="dynamicmodel-vesselname-document-footer" className="form-control"  readonly="" data-target="VesselName-Voyage"></input>
                                                <div className="help-block"></div>
                                            </div>
                                        </div>
                                    </strong> from <strong>
                                            <div className="col-6">
                                                <div className="form-group field-deliveryorder-polareaname-document-footer">
                                                    <input type="text" id="deliveryorder-polareaname-document-footer" className="form-control reflect-field"  readonly="" maxlength="255" data-target="POLAreaName-ShippingInstructions"></input>
                                                    <div className="help-block"></div>
                                                </div>
                                            </div>
                                        </strong> subject to the vessel's safe arrival and all the terms conditions contained in the Bill Of Lading in use for these vessels and the relative mate's receipt.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table style={{ "width": "95%", "borderCollapse": "collapse", "fontSize": "12px", "border": "1px solid black", "margin": "0 auto" }}>
                            <thead>
                                <tr>
                                    <th style={{"fontSize": "15px","textAlign": "center","borderTop": "1px solid black", "borderLeft": "1px solid black", "borderRight":" 1px solid black", "width":"50%", "height": "30px"}}>Customer Permit Numbers</th>
                                    <th style={{"fontSize": "15px","textAlign": "center","borderTop": "1px solid black", "borderRight": "1px solid black"}}>As Carrier</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{"borderTop": "1px solid black", "borderBottom":" 1px solid black", "borderLeft": "1px solid black", "borderRight": "1px solid black", "height": "200px"}}>

                                    </td>
                                    <td style={{"borderBottom": "1px solid black", "borderRight": "1px solid black", "borderTop": "1px solid black"}}></td>
                                </tr>
                                <tr>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


        </>
    )
}

export default QuickFormBottomCard