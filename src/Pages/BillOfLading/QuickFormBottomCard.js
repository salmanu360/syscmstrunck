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

            <div className="card lvl1">
                <div className="card-header">
                    <div className="card-tools">
                        <button type="button" className="btn btn-tool" data-toggle="tooltip" title="Collapse" data-card-widget="collapse">
                            <i className="fas fa-minus"></i>
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="card">
                        <div style={{ "margin": "-1px-2px 0px 0px", "padding": "30px" }}>
                            <p style={{"text-align":"center","font-size":"15px"}}>Particulars furnished by the Merchant</p>
                            <table style={{"width": "100%","border-collapse":"collapse","font-size":"11px"}}>
                                <thead>
                                    <tr>
                                        <th style={{"text-align":"left","font-size":"15px" ,"border-top": "1px solid black","border-right":"1px solid black"}} className="units"><br></br>

                                        </th>
                                        <th style={{"border-top":"1px solid black", "font-size":"15px","border-bottom":"1px solid black","text-align":"left"}} className="pdfFL1"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{"border-top":"1px solid black","font-size":"15px","border-right":"1px solid black","width":"55%"}} className="pdfFL2">
                                        </td>
                                        <td></td>
                                    </tr>

                                </tbody>
                            </table>
                            <table style={{ "width": "100%", "border-collapse": "collapse", "font-size": "15px" }}>
                                <tbody>
                                    <tr>
                                        <td style={{ "width": "32%" }}></td>
                                        <td style={{ "border-bottom": "1px solid black", "border-right": "1px solid black", "border-top": "1px solid black", "width": "14%" }}></td>
                                        <td style={{ "border-bottom": "1px solid black", "font-size": "20px", "border-top": "1px solid black", "text-align": "center" }}>AS AGENT FOR THE CARRIER</td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td style={{ "width": "40%" }}></td>
                                        <td style={{ "width": "15%" }}></td>
                                        <td>
                                            <p style={{ "font-size": "13px" }}>The Merchant of the Goods shall be jointly and severally liable To Carrier for the payment of all freight, demurrage, General Average, salvage and
                                                other charges, including but not limited to court costs, expenses and reasonable attorney's fees incurred in collecting sums due Carrier, or its
                                                authorized agent, shall not be deemed payment to The Carrier and shall be made at payer's sole risk.
                                            </p>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>

                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}

export default QuickFormBottomCard