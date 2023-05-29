import React, { useState, useEffect, useContext } from 'react'
import Home from "../Pages/Dashboard/Home"
import Login from "../Pages/Login/Login"
import axios from "axios"
import GlobalContext from "./GlobalContext"
import Content from "./Content"
import UserPng from '../Assets/logo/user.png';
import Logo from '../Assets/logo/ship.png';

// import '../../index.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useNavigate
} from "react-router-dom";

export default function Navbar(props) {
    const navigate = useNavigate();
    var formData = new FormData();

    var profileInfo = JSON.parse(localStorage.getItem('authorizeInfos'));
    const globalContext = useContext(GlobalContext);
    const [rule, setRule] = useState([])

    useEffect(() => {
        if (globalContext.userRule !== "") {
            const objRule = JSON.parse(globalContext.userRule);
            var filteredAp = objRule.Rules.filter(function (item) {
              return item.includes("view");
            });
            setRule(filteredAp)

        }
        return () => {
    
        }
      }, [globalContext.userRule])
   
    function handleLogOut() {
        var info = JSON.parse(localStorage.getItem('authorizeInfos'));

        axios.post(
            globalContext.globalHost + globalContext.globalPathLink+"site/logout",
            { formData },
            {
                auth: {
                    username: info.username,
                    password: info.access_token,
                },
            }
        );
        localStorage.removeItem('authorizeInfos')
        props.setToken(null)


    }

    function handleProfile() {
        navigate('/setting/user-settings/user/profile/id=' + profileInfo.id, { state: { id: profileInfo.id, formType: "Update",profile:true } })
    }
        

    const ArrayNav = [

        {
            Title: "Sales",
            icon: "nav-icon fas fa-file-invoice-dollar mr-1",
            className: "nav-link dropdown-toggle",
            link: "",
            viewAccess:rule.find((item)=>item==`view-quotation`|| item==`view-quotation-barge`||item==`view-booking-reservation`|| item==`view-booking-reservation-barge`|| item==`view-sales-invoice`|| item==`view-sales-invoice-barge`||item==`view-sales-credit-note`||item==`view-sales-credit-note-barge`||item==`view-sales-debit-note`|| item==`view-sales-debit-note-barge`||item==`view-customer-payment`||item==`view-statement-of-account`||item==`view-customer-statement`||item==`view-document-matrix` || item==`view-forecast`)!== undefined,
            level2: [       
                {
                    title: "Container", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "",
                    viewAccess:rule.find((item)=>item==`view-quotation`|| item==`view-booking-reservation`|| item==`view-sales-invoice`||item==`view-sales-credit-note`||item==`view-sales-debit-note`||item==`view-customer-payment`)!== undefined,
                    level3: [
                        { title: "Quotation", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "sales/container/quotation/index", level4: [], viewAccess: rule.find((item)=>item==`view-quotation`)!== undefined},
                        { title: "Booking", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "sales/container/booking-reservation/index", level4: [], viewAccess:rule.find((item)=>item==`view-booking-reservation`)!== undefined },
                        { title: "Invoice", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "sales/container/sales-invoice/index", level4: [], viewAccess:rule.find((item)=>item==`view-sales-invoice`)!== undefined},
                        { title: "Credit Note", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "sales/container/credit-note/index", level4: [], viewAccess:rule.find((item)=>item==`view-sales-credit-note`)!== undefined},
                        { title: "Debit Note", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "sales/container/debit-note/index", level4: [], viewAccess:rule.find((item)=>item==`view-sales-debit-note`)!== undefined},
                        { title: "Receipt", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "sales/container/customer-payment/index", level4: [], viewAccess:rule.find((item)=>item==`view-customer-payment`)!== undefined}
                    ]
                },
                {
                    title: "Standard", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "",viewAccess:true,
                    viewAccess:rule.find((item)=>item==`view-quotation-barge`|| item==`view-booking-reservation-barge`|| item==`view-sales-invoice-barge`||item==`view-sales-credit-note-barge`||item==`view-sales-debit-note-barge`)!== undefined,
                    level3: [
                        { title: "Quotation", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "sales/standard/quotation-barge/index", level4: [],viewAccess: rule.find((item)=>item==`view-quotation-barge`)!== undefined},
                        { title: "Booking", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "sales/standard/booking-reservation-barge/index", level4: [],viewAccess:rule.find((item)=>item==`view-booking-reservation-barge`)!== undefined },
                        { title: "Invoice", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "sales/standard/sales-invoice-barge/index", level4: [],viewAccess:rule.find((item)=>item==`view-sales-invoice-barge`)!== undefined},
                        { title: "Credit Note", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "sales/standard/credit-note-barge/index", level4: [],viewAccess:rule.find((item)=>item==`view-sales-credit-note-barge`)!== undefined},
                        { title: "Debit Note", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "sales/standard/debit-note-barge/index", level4: [],viewAccess:rule.find((item)=>item==`view-sales-debit-note-barge`)!== undefined},
                    ]
                },  
                {
                    title: "Report", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "",
                    viewAccess:rule.find((item)=>item==`view-statement-of-account`|| item==`view-customer-statement`|| item==`view-document-matrix`||item==`view-forecast`)!== undefined,
                    level3: [
                        { title: "Statement of Account", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "sales/report/statement-of-account/index", level4: [],viewAccess: rule.find((item)=>item==`view-statement-of-account`)!== undefined },
                        { title: "Customer Due Listing", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "sales/report/customer-statement/index", level4: [],viewAccess: rule.find((item)=>item==`view-customer-statement`)!== undefined },
                        { title: "Sales Operation Document Matrix", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "sales/report/document-matrix/index", level4: [],viewAccess: rule.find((item)=>item==`view-document-matrix`)!== undefined },
                        { title: "Forecast", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "sales/report/forecast/index", level4: [],viewAccess: rule.find((item)=>item==`view-forecast`)!== undefined },
                    ]
                },
            
            ],

        },
        {
            Title: "Operation",
            icon: "nav-icon fas fa-wrench mr-1",
            className: "nav-link dropdown-toggle",
            link: "",
            viewAccess:rule.find((item)=>item==`view-container-release-order`|| item==`view-bill-of-lading-barge`  || item==`view-bill-of-lading`|| item==`view-delivery-order` 
                               ||  item==`view-delivery-order-barge` || item==`view-manifest-import`  || item==`view-manifest-export` || item==`view-manifest-transhipment` ||  item==`view-loading-list` || item==`view-discharging-list` || item==`view-dnd`|| item==`view-schedule`|| item==`view-tdr-report`
                               || item==`view-trucking-list`|| item==`view-lifting`|| item==`view-lifting-summary`|| item==`view-vessel-voyage-lifting`|| item==`view-customer-lifting`)!== undefined,
                                
            level2: [    
                {
                    title: "Container", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "",
                    viewAccess:rule.find((item)=>item==`view-container-release-order`|| item==`view-bill-of-lading`|| item==`view-delivery-order`)!== undefined,
                    level3: [
                        { title: "Container Release Order", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "operation/container/container-release-order/index", level4: [],viewAccess: rule.find((item)=>item==`view-container-release-order`||item==`view-manifest-import`|| item==`view-manifest-export`|| item==`view-manifest-transhipment`|| item==`view-loading-list`|| item==`view-discharging-list` || item==`view-dnd` || item==`view-schedule`| item==`view-tdr-report`| item==`view-trucking-list`| item==`view-lifting`| item==`view-lifting-summary`| item==`view-vessel-voyage-lifting`| item==`view-customer-lifting`)!== undefined },
                        { title: "Bill Of Lading", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "operation/container/bill-of-lading/index", level4: [],viewAccess: rule.find((item)=>item==`view-bill-of-lading`)!== undefined },
                        { title: "Delivery Order", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "operation/container/delivery-order/index", level4: [],viewAccess: rule.find((item)=>item==`view-delivery-order`)!== undefined },
                       
                    ]
                },   
                {
                    title: "Standard", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "",viewAccess:true,
                    viewAccess:rule.find((item)=>item==`view-bill-of-lading-barge`|| item==`view-delivery-order-barge`)!== undefined,
                    level3: [
                        { title: "Bill Of Lading", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "operation/standard/bill-of-lading-barge/index", level4: [],viewAccess: rule.find((item)=>item==`view-bill-of-lading-barge`)!== undefined },
                        { title: "Delivery Order", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "operation/standard/delivery-order-barge/index", level4: [],viewAccess: rule.find((item)=>item==`view-delivery-order-barge`)!== undefined },
                       
                       
                    ]
                },  
                {
                    title: "Report", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "",
                    viewAccess:rule.find((item)=>item==`view-manifest-import`|| item==`view-manifest-export`|| item==`view-manifest-transhipment`|| item==`view-loading-list`|| item==`view-discharging-list` || item==`view-dnd` || item==`view-schedule`| item==`view-tdr-report`|| item==`view-trucking-list`|| item==`view-lifting`|| item==`view-lifting-summary`|| item==`view-vessel-voyage-lifting`|| item==`view-vessel-voyage-lifting-summary`|| item==`view-customer-lifting-summary`|| item==`view-customer-lifting`)!== undefined,
                    level3: [
                        { title: "Manifest - Import", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "operation/report/manifest-import/index", level4: [],viewAccess: rule.find((item)=>item==`view-manifest-import`)!== undefined },
                        { title: "Manifest - Export", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "operation/report/manifest-export/index", level4: [],viewAccess: rule.find((item)=>item==`view-manifest-export`)!== undefined },
                        { title: "Manifest - Transhipment", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "operation/report/manifest-transhipment/index", level4: [],viewAccess: rule.find((item)=>item==`view-manifest-transhipment`)!== undefined },
                        { title: "Loading List", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "operation/report/loading-list/index", level4: [],viewAccess: rule.find((item)=>item==`view-loading-list`)!== undefined },
                        { title: "Discharging List", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "operation/report/discharging-list/index", level4: [],viewAccess: rule.find((item)=>item==`view-discharging-list`)!== undefined },
                        { title: "D&D", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "operation/report/dnd/index", level4: [],viewAccess: rule.find((item)=>item==`view-dnd`)!== undefined },
                        { title: "Voyage Suggestion", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "operation/report/schedule/index", level4: [],viewAccess: rule.find((item)=>item==`view-schedule`)!== undefined },
                        { title: "TDR Report", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "operation/report/t-d-r/index", level4: [],viewAccess: rule.find((item)=>item==`view-tdr-report`)!== undefined },
                        { title: "Trucking List", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "operation/report/trucking-list/index", level4: [],viewAccess: rule.find((item)=>item==`view-trucking-list`)!== undefined },
                        { title: "Volume Lifting", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "operation/report/lifting/index", level4: [],viewAccess: rule.find((item)=>item==`view-lifting`)!== undefined },
                        { title: "Volume Lifting Summary", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "operation/report/lifting-summary/index", level4: [],viewAccess: rule.find((item)=>item==`view-lifting-summary`)!== undefined },
                        { title: "Vessel Volume Lifting", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "operation/report/vessel-voyage-lifting/index", level4: [],viewAccess: rule.find((item)=>item==`view-vessel-voyage-lifting`)!== undefined },
                        { title: "Vessel Volume Lifting Summary", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "operation/report/vessel-voyage-lifting-summary/index", level4: [],viewAccess: rule.find((item)=>item==`view-vessel-voyage-lifting-summary`)!== undefined },
                        { title: "Client Lifting", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "operation/report/customer-lifting/index", level4: [],viewAccess: rule.find((item)=>item==`view-customer-lifting`)!== undefined },
                        { title: "Client Lifting Summary", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "operation/report/customer-lifting-summary/index", level4: [],viewAccess: rule.find((item)=>item==`view-customer-lifting-summary`)!== undefined },
                    ]
                },
            
            ],

        },

        {
            Title: "Movement",
            icon: "nav-icon fas fa-map-marker-alt mr-1",
            className: "nav-link dropdown-toggle",
            link: "",
            viewAccess:rule.find((item)=>item==`view-container-release`|| item==`view-container-gate-in`|| item==`view-container-gate-out`|| item==`view-container-gate-loaded`|| item==`view-container-gate-discharged`|| item==`view-container-receive`|| item==`view-container-verify-gross-mass`|| item==`view-real-time-tracking`|| item==`view-history-tracking` || item==`view-special-movement`)!== undefined,
            level2: [       
                {
                    title: "Container", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "",
                    viewAccess:rule.find((item)=>item==`view-container-release`|| item==`view-container-gate-in`|| item==`view-container-gate-out`|| item==`view-container-gate-loaded`|| item==`view-container-gate-discharged`|| item==`view-container-receive`|| item==`view-container-verify-gross-mass` || item==`view-special-movement`)!== undefined,
                    level3: [
                        { title: "Export", icon: "", className: "dropdown-item disabledLink", link: "", level4: [],viewAccess: rule.find((item)=>item==`view-container-release` || item==`view-container-verify-gross-mass` || item==`view-container-gate-in` || item==`view-container-loaded`)!== undefined },
                        { title: "Release", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "movement/container/container-release/index", level4: [],viewAccess: rule.find((item)=>item==`view-container-release`)!== undefined },
                        { title: "Verified Gross Mass", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "movement/container/container-verify-gross-mass/index", level4: [],viewAccess: rule.find((item)=>item==`view-container-verify-gross-mass`)!== undefined },
                        { title: "Gate In", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "movement/container/container-gate-in/index", level4: [],viewAccess: rule.find((item)=>item==`view-container-gate-in`)!== undefined },
                        { title: "Loading", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "movement/container/container-loaded/index", level4: [],viewAccess: rule.find((item)=>item==`view-container-loaded`)!== undefined },
                        { title: "Import", icon: "", className: "dropdown-item disabledLink", link: "", level4: [],viewAccess: rule.find((item)=>item==`view-container-discharged` || item==`view-container-gate-out` || item==`view-container-receive`)!== undefined },
                        { title: "Discharging", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "movement/container/container-discharged/index", level4: [],viewAccess: rule.find((item)=>item==`view-container-discharged`)!== undefined },
                        { title: "Gate Out", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "movement/container/container-gate-out/index", level4: [],viewAccess: rule.find((item)=>item==`view-container-gate-out`)!== undefined },
                        { title: "Empty Return", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "movement/container/container-receive/index", level4: [],viewAccess: rule.find((item)=>item==`view-container-receive`)!== undefined },
                        { title: "Special", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "movement/container/special-movement/index", level4: [], viewAccess: rule.find((item)=>item==`view-special-movement`)!== undefined },
                        { title: "Report", icon: "", className: "dropdown-item", link: "",
                         viewAccess:rule.find((item)=>item==`view-real-time-tracking`|| item==`view-history-tracking`)!== undefined,
                         level4: [
                            {title: "Real Time Tracking", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "movement/container/report/real-time-tracking/index",level5: [],viewAccess: rule.find((item)=>item==`view-real-time-tracking`)!== undefined },
                            {title: "History Tracking", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "movement/container/report/history-tracking/index",level5:[],viewAccess: rule.find((item)=>item==`view-history-tracking`)!== undefined }    
                        ] },
                      
                    ]
                },
            ],

        },
        
        {
            Title: "Purchase",
            icon: "nav-icon fa fa-cash-register",
            className: "nav-link dropdown-toggle",
            link: "",
            viewAccess:rule.find((item)=>item==`view-purchase-order`)!== undefined,
            level2: [    
                {
                    title: "Purchase Order", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "purchase/purchase-order/index", level3: [],viewAccess: rule.find((item)=>item==`view-purchase-order`)!== undefined
                },   
                // {
                //     title: "Standard", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "",
                //     level3: [
                     
                //         { title: "Third Party Invoice", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "sales/container/sales-invoice/index", level4: [] },
                //         { title: "Third Party Debit Note", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "sales/container/debit-note/index", level4: [] },
                //         { title: "Third Party Bill Of Lading", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "operation/container/bill-of-lading/index", level4: [] },
                       
                //     ]
                // },   
          
            
            ],

        },

        {
            Title: "Third Party",
            icon: "nav-icon fas fa-print",
            className: "nav-link dropdown-toggle",
            link: "",
            viewAccess:rule.find((item)=>item==`view-third-party-invoice` || item==`view-third-party-sales-debit-note`|| item==`view-third-party-bill-of-lading` || item==`view-third-party-invoice-barge` || item==`view-third-party-sales-debit-note-barge`|| item==`view-third-party-bill-of-lading-barge`)!== undefined,
            level2: [    
                {
                    title: "Container", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "",
                    viewAccess:rule.find((item)=>item==`view-third-party-invoice` || item==`view-third-party-sales-debit-note`|| item==`view-third-party-bill-of-lading`)!== undefined,
                    level3: [
                     
                        { title: "Third Party Invoice", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "sales/container/sales-invoice/index/third-party", level4: [],viewAccess: rule.find((item)=>item==`view-third-party-invoice`)!== undefined },
                        { title: "Third Party Debit Note", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "sales/container/debit-note/index/third-party", level4: [],viewAccess: rule.find((item)=>item==`view-third-party-debit-note`)!== undefined },
                        { title: "Third Party Bill Of Lading", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "operation/container/bill-of-lading/index/third-party", level4: [] ,viewAccess: rule.find((item)=>item==`view-third-party-bill-of-lading`)!== undefined},
                       
                    ]
                },   
                {
                    title: "Standard", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "",
                    viewAccess:rule.find((item)=>item==`view-third-party-invoice-barge` || item==`view-third-party-sales-debit-note-barge`|| item==`view-third-party-bill-of-lading-barge`)!== undefined,
                    level3: [
                     
                        { title: "Third Party Invoice", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "sales/standard/sales-invoice-barge/index/third-party", level4: [],viewAccess: rule.find((item)=>item==`view-third-party-invoice-barge`)!== undefined  },
                        { title: "Third Party Debit Note", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "sales/standard/debit-note-barge/index/third-party", level4: [],viewAccess: rule.find((item)=>item==`view-third-party-debit-note-barge`)!== undefined },
                        { title: "Third Party Bill Of Lading", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "operation/standard/bill-of-lading-barge/index/third-party", level4: [],viewAccess: rule.find((item)=>item==`view-third-party-bill-of-lading-barge`)!== undefined  },
                       
                    ]
                },   
          
            
            ],

        },
        

        {
            Title: "Company",
            icon: "nav-icon far fa-building mr-1",
            className: "nav-link dropdown-toggle",
            link: "",
            viewAccess:rule.find((item)=>item==`view-company` || item==`view-customer`|| item==`view-supplier` || item==`view-agent`|| item==`view-depot`|| item==`view-builder`|| item==`view-hauler`|| item==`view-box-operator`|| item==`view-ship-operator` || item==`view-port-details`)!== undefined,
            level2: [       
                {
                    title: "Company", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item",
                    viewAccess:rule.find((item)=>item==`view-company` || item==`view-customer`|| item==`view-supplier` || item==`view-agent`|| item==`view-depot`|| item==`view-builder`|| item==`view-hauler`|| item==`view-box-operator`|| item==`view-ship-operator`)!== undefined,
                    level3: [
                        { title: "Miscellaneous", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/company/company/index", level4: [],viewAccess: rule.find((item)=>item==`view-company`)!== undefined },
                        { title: "Customer", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/company/company/index/CompanyType=Customer", level4: [],viewAccess: rule.find((item)=>item==`view-customer`)!== undefined },
                        { title: "Supplier", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/company/company/index/CompanyType=Supplier", level4: [],viewAccess: rule.find((item)=>item==`view-supplier`)!== undefined },
                        { title: "Agent", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/company/company/index/CompanyType=Agent", level4: [],viewAccess: rule.find((item)=>item==`view-agent`)!== undefined },
                        { title: "Depot", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/company/company/index/CompanyType=Depot", level4: [],viewAccess: rule.find((item)=>item==`view-depot`)!== undefined },
                        { title: "Builder", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/company/company/index/CompanyType=Builder", level4: [],viewAccess: rule.find((item)=>item==`view-builder`)!== undefined },
                        { title: "Hauler", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/company/company/index/CompanyType=Hauler", level4: [],viewAccess: rule.find((item)=>item==`view-hauler`)!== undefined },
                        { title: "Box Operator", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/company/company/index/CompanyType=Box Operator", level4: [],viewAccess: rule.find((item)=>item==`view-box-operator`)!== undefined },
                        { title: "Ship Operator", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/company/company/index/CompanyType=Ship Operator", level4: [],viewAccess: rule.find((item)=>item==`view-ship-operator`)!== undefined },
                        { title: "Terminal Handler", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/company/company/index/CompanyType=Terminal Handler", level4: [],viewAccess: rule.find((item)=>item==`view-terminal-handler`)!== undefined },
                    ]
                },
                {
                    title: "Terminal", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "/company/terminal/index",
                    level3:[],viewAccess: rule.find((item)=>item==`view-port-details`)!== undefined
                }
            ],

        },

        {
            Title: "Asset",
            icon: "nav-icon fas fa-gem mr-1",
            className: "nav-link dropdown-toggle",
            link: "",
            viewAccess:rule.find((item)=>item==`view-container` || item==`view-vessel`)!== undefined,
            level2: [       
                {
                    title: "Container", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "/asset/container/index",
                    level3:[],viewAccess: rule.find((item)=>item==`view-container`)!== undefined
                },
                {
                    title: "Vessel", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "/asset/vessel/index",
                    level3:[],viewAccess: rule.find((item)=>item==`view-vessel`)!== undefined
                }
            ],

        },


        {
            Title: "Schedule",
            icon: "nav-icon fas fa-route mr-1",
            className: "nav-link dropdown-toggle",
            link: "",
            viewAccess:rule.find((item)=>item==`view-route` || item==`view-voyage`)!== undefined,
            level2: [
                {
                    title: "Route", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "/schedule/route/index",
                    level3:[],viewAccess: rule.find((item)=>item==`view-route`)!== undefined
                },
                {
                    title: "Voyage", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "/schedule/voyage/index",
                    level3:[],viewAccess: rule.find((item)=>item==`view-voyage`)!== undefined
                }
            ],

        },
        {
            Title: "Settings",
            icon: "nav-icon fas fa-cog mr-1",
            className: "nav-link dropdown-toggle",
            link: "",
            viewAccess:rule.find((item)=>item==`view-area` || item==`view-currency-type`|| item==`view-currency-rate`|| item==`view-freight-term`|| item==`view-port-term`|| item==`view-tax-code`|| item==`view-credit-term`
                                ||item==`view-business-nature` || item==`view-customer-type`|| item==`view-supplier-type`|| item==`view-company-type` || item==`view-container-type` || item==`view-cargo-type`|| item==`view-vessel-type`
                                ||item==`view-un-number` || item==`view-hs-code`|| item==`view-charges-type`|| item==`view-charges`|| item==`view-tariff`|| item==`view-receivable-method`||item==`view-user-group` || item==`view-user`|| item==`view-rule-set`|| item==`view-site-change-password`
                                ||item==`view-g-p-export`||item==`view-audit-trail`)!== undefined,
            level2: [

                {
                    title: "General Settings", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "/UserGroup/GridView",
                    viewAccess:rule.find((item)=>item==`view-area` || item==`view-currency-type`|| item==`view-currency-rate`|| item==`view-freight-term`|| item==`view-port-term`|| item==`view-tax-code`|| item==`view-credit-term`)!== undefined,
                    level3: [
                        { title: "Port", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/setting/general-settings/port/index", level4: [],viewAccess: rule.find((item)=>item==`view-area`)!== undefined},
                        {
                            title: "Currency", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/setting/general-settings/currency",
                            viewAccess:rule.find((item)=>item==`view-currency-type` || item==`view-currency-rate`)!== undefined,
                             level4: [
                                { title: "Currency Type", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "/setting/general-settings/currency/currency-type/index",viewAccess: rule.find((item)=>item==`view-currency-type`)!== undefined },
                                { title: "Currency Rate", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "/setting/general-settings/currency/currency-rate/index",viewAccess: rule.find((item)=>item==`view-currency-rate`)!== undefined}

                            ]
                        },
                        { title: "Freight Term", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/setting/general-settings/freight-term/index", level4: [],viewAccess: rule.find((item)=>item==`view-freight-term`)!== undefined },
                        { title: "Port Term", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/setting/general-settings/port-term/index", level4: [],viewAccess: rule.find((item)=>item==`view-port-term`)!== undefined },
                        { title: "Tax Code", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/setting/general-settings/tax-code/index", level4: [],viewAccess: rule.find((item)=>item==`view-tax-code`)!== undefined },
                        { title: "Credit Term", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/setting/general-settings/credit-term/index", level4: [],viewAccess: rule.find((item)=>item==`view-credit-term`)!== undefined },
                    ]
                },
                {
                    title: "Company Settings", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "/UserGroup/GridView",
                    viewAccess:rule.find((item)=>item==`view-business-nature` || item==`view-customer-type`|| item==`view-supplier-type`|| item==`view-company-type`)!== undefined,
                    level3: [
                        { title: "Business Nature", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/setting/company-settings/business-nature/index", level4: [],viewAccess: rule.find((item)=>item==`view-business-nature`)!== undefined },
                        { title: "Customer Type", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/setting/company-settings/customer-type/index", level4: [],viewAccess: rule.find((item)=>item==`view-customer-type`)!== undefined },
                        { title: "Supplier Type", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/setting/company-settings/supplier-type/index", level4: [],viewAccess: rule.find((item)=>item==`view-supplier-type`)!== undefined },
                        { title: "Company Type", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/setting/company-settings/company-type/index", level4: [],viewAccess: rule.find((item)=>item==`view-company-type`)!== undefined },

                    ]
                },
                {
                    title: "Asset Settings", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "/UserGroup/GridView",
                    viewAccess:rule.find((item)=>item==`view-container-type` || item==`view-cargo-type`|| item==`view-vessel-type`)!== undefined,
                    level3: [
                        { title: "Container Type", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/setting/asset-settings/container-type/index", level4: [],viewAccess: rule.find((item)=>item==`view-container-type`)!== undefined },
                        { title: "Cargo Type", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/setting/asset-settings/cargo-type/index", level4: [],viewAccess: rule.find((item)=>item==`view-cargo-type`)!== undefined },
                        { title: "Vessel Type", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/setting/asset-settings/vessel-type/index", level4: [],viewAccess: rule.find((item)=>item==`view-vessel-type`)!== undefined },


                    ]
                },
                {
                    title: "Sales Settings", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "/UserGroup/GridView",
                    viewAccess:rule.find((item)=>item==`view-un-number` || item==`view-hs-code`|| item==`view-charges-type`|| item==`view-charges`|| item==`view-tariff`|| item==`view-receivable-method`)!== undefined,
                    level3: [
                        { title: "UN Number", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/setting/sales-settings/u-n-number/index", level4: [],viewAccess: rule.find((item)=>item==`view-un-number`)!== undefined },
                        { title: "HS Code", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/setting/sales-settings/h-s-code/index", level4: [],viewAccess: rule.find((item)=>item==`view-hs-code`)!== undefined },
                        { title: "Charges Type", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/setting/sales-settings/charges-type/index", level4: [],viewAccess: rule.find((item)=>item==`view-charges-type`)!== undefined },
                        { title: "Charges", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/setting/sales-settings/charges/index", level4: [],viewAccess: rule.find((item)=>item==`view-charges`)!== undefined },
                        { title: "Tariff", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/setting/sales-settings/tariff/index", level4: [],viewAccess: rule.find((item)=>item==`view-tariff`)!== undefined },
                        { title: "Receivable Method", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/setting/sales-settings/receivable-method/index", level4: [],viewAccess: rule.find((item)=>item==`view-receivable-method`)!== undefined },


                    ]
                },
                {
                    title: "User Settings", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "/UserGroup/GridView",
                    viewAccess:rule.find((item)=>item==`view-user-group` || item==`view-user`|| item==`view-rule-set`|| item==`view-site-change-password`)!== undefined,
                    level3: [
                        { title: "User Group", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/setting/user-settings/user-group/index", level4: [],viewAccess: rule.find((item)=>item==`view-user-group`)!== undefined },
                        { title: "User", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/setting/user-settings/user/index", level4: [],viewAccess: rule.find((item)=>item==`view-user`)!== undefined },
                        { title: "Rule Set", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/setting/user-settings/rule-set/index", level4: [],viewAccess: rule.find((item)=>item==`view-rule-set`)!== undefined },
                        { title: "Change Password", icon: "fas fa-angle-double-right nav-icon mr-2", className: "dropdown-item", link: "/setting/user-settings/change-password/Form", level4: [],viewAccess: rule.find((item)=>item==`view-site-change-password`)!== undefined },



                    ]
                },
                {
                    title: "GP Export", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "/setting/g-p-export/index",
                    level3:[],viewAccess: rule.find((item)=>item==`view-gp-export`)!== undefined
                },
                {
                    title: "Audit Trail", icon: "fas fa-angle-right nav-icon mr-2", className: "dropdown-item", link: "/setting/audit-trail/index",
                    level3:[],viewAccess: rule.find((item)=>item==`view-audit-trail`)!== undefined
                }
                
              

            ],

        },
      

    ]

    return (

        <div>
            <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                {/* Left navbar links */}
                <ul className="navbar-nav">

                    <div className="user-panel d-flex">
                        <div className="image">
                       
                            <img id="logo" className="img-circle elevation-2" style={{ width: "35px",opacity:"0.8" }} src={Logo} />
                        </div>
                        <div className="info">
                            <Link to="/" className="d-block">
                                SYSCMS</Link>
                        </div>
                    </div>

                    <li className="nav-item dashboard">
                        <Link to="/Dashboard" className="nav-link dropdown-toggle">
                            <i className="nav-icon fas fa-chart-line mr-1"></i>Dashboard</Link>

                    </li>
                    {ArrayNav.map((item, index) => {

                        {

                            return (item.level2.length > 0) ? (
                                <li className="nav-item dropdown" key={index}>
                                     {item.viewAccess?<a id="dropdownSubMenu1" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" className={item.className}><i className={item.icon} />{item.Title}</a>:""}
                                    <ul className="dropdown-menu">

                                        {item.level2.map((item2, index2) => {

                                            if (item2.level3.length > 0) {

                                                return <li className="dropdown-submenu dropdown-hover" key={index2}>
                                                     {item2.title=="Company"?item2.viewAccess?<Link to={item2.link} className="dropdown-item dropdown-toggle"><i className="fas fa-angle-right nav-icon mr-2" />{item2.title}</Link>:"":
                                                     
                                                     item2.viewAccess?<a className="dropdown-item dropdown-toggle"><i className="fas fa-angle-right nav-icon mr-2" />{item2.title}</a>:""}
                                                    
                                                    <ul className="dropdown-menu">

                                                        {item2.level3.map((item3, index3) => {

                                                            if (item3.level4.length > 0) {
                                                                return (

                                                                    <li className="dropdown-submenu dropdown-hover" key={index3}>
                                                                       
                                                                    {item3.viewAccess?<a id="dropdownSubMenu2" href="#" role="button" className="dropdown-item dropdown-toggle"><i className={item3.icon}></i>{item3.title}</a>:""}
                                                                        <ul className="dropdown-menu">
                                                                            {item3.level4.map((item4, index4) => {
                                                                                return (
                                                                                    item4.viewAccess?
                                                                                    <li key={index4}>
                                                                                        <Link to={item4.link} className="dropdown-item"> <i className="fas fa-caret-right nav-icon mr-2"></i>{item4.title}</Link>
                                                                                    </li>:""
                                                                                )
                                                                            })}
                                                                        </ul>

                                                                    </li>

                                                                )

                                                            }
                                                            else {
                                                                return item3.viewAccess?<li key={index3}><Link to={item3.link} className={item3.className}><i className={item3.icon}></i>{item3.title}</Link></li>:""
                                                            }
                                                        })}

                                                    </ul>
                                                </li>
                                            }
                                            else {
                                                return  item2.viewAccess?<li key={index2}><Link to={item2.link} className={item2.className}><i className={item2.icon}></i>{item2.title}</Link></li>:""
                                            }

                                        })}
                                    </ul>
                                </li>) : (
                                <li className="nav-item" key={index}>
                                    <Link to={item.link} className="nav-link dropdown-toggle">
                                        <i className={item.icon}></i>{item.Title}</Link>

                                </li>)
                        }


                    })}

                </ul>

                <ul className="order-1 order-md-3 navbar-nav navbar-no-expand ml-auto">
                
 
                   <div className="user-panel d-flex ml-2">
                        <div className="image">
                            <img id="img" className="img-circle elevation-2 mt-1" src={globalContext.profileImage ? globalContext.profileImage : UserPng} />

                        </div>
                        <div className="info">
                            <a href="" onClick={handleProfile} >{profileInfo ? profileInfo.username : ""}</a>
                        </div>
                    </div>

                    <li className="nav-item">
                        <button type="button" className="nav-link logOut" style={{ border: 'none', background: 'white' }}><i style={{ color: '#007BFF' }} className="fas fa-power-off" onClick={handleLogOut} /></button>
                    </li>
                </ul>


            </nav>


            <Routes>

              

				<Route path="/Dashboard" element={<Content Title="Dashboard" ContentLink="Pages/Dashboard/Home" />} />
               
                {/* Sales form view*/}
                <Route path="/sales/container/quotation/create" element={<Content Title="Quotation" modelLink='quotation' ContentLink='Pages/Quotation/Form' groupLink="/sales/container/" />} />
                <Route path="/sales/container/quotation/update/id=:id" element={<Content Title="Quotation" modelLink='quotation' ContentLink='Pages/Quotation/Form' groupLink="/sales/container/" />} />
                <Route path="/sales/container/quotation/update/id=:id&D=:D/" element={<Content Title="Quotation" modelLink='quotation' ContentLink='Pages/Quotation/Form' groupLink="/sales/container/" />} />
                <Route path="/sales/container/booking-reservation/create" element={<Content Title="Booking Reservation" modelLink='booking-reservation' ContentLink='Pages/BookingReservation/Form' groupLink="/sales/container/" />} />
                <Route path="/sales/container/booking-reservation/update/id=:id" element={<Content Title="Booking Reservation" modelLink='booking-reservation' ContentLink='Pages/BookingReservation/Form' groupLink="/sales/container/" />} />
                <Route path="/sales/container/booking-reservation/update/id=:id&D=:D/" element={<Content Title="Booking Reservation" modelLink='booking-reservation' ContentLink='Pages/BookingReservation/Form' groupLink="/sales/container/" />} />
                <Route path="/sales/container/booking-reservation/transfer-from-quotation/id=:id" element={<Content Title="Booking Reservation" modelLink='booking-reservation' ContentLink='Pages/BookingReservation/Form' groupLink="/sales/container/" />} />
                <Route path="/sales/container/booking-reservation/split/splitid=:splitid&id=:id&containerid=:containerid" element={<Content Title="Booking Reservation" modelLink='booking-reservation' ContentLink='Pages/BookingReservation/Form' groupLink="/sales/container/" />} />
                <Route path="/sales/container/booking-reservation/merge/id=:id&mergeid=:mergeid/" element={<Content Title="Booking Reservation" modelLink='booking-reservation' ContentLink='Pages/BookingReservation/Form' groupLink="/sales/container/" />} />
                <Route path="/sales/container/sales-invoice/create" element={<Content Title="Sales Invoice" modelLink='sales-invoice' ContentLink='Pages/SalesInvoice/Form' groupLink="/sales/container/" />} />
                <Route path="/sales/container/sales-invoice/update/id=:id" element={<Content Title="Sales Invoice" modelLink='sales-invoice' ContentLink='Pages/SalesInvoice/Form' groupLink="/sales/container/" />} />
                <Route path="/sales/container/sales-invoice/update/id=:id&thirdparty=:thirdparty/" element={<Content Title="Sales Invoice" modelLink='sales-invoice' ContentLink='Pages/SalesInvoice/Form' groupLink="/sales/container/" />} />
                <Route path="/sales/container/sales-invoice/transfer-from-booking-reservation-data/id=:id" element={<Content Title="Sales Invoice" modelLink='sales-invoice' ContentLink='Pages/SalesInvoice/Form' groupLink="/sales/container/" />} />
                <Route path="/sales/container/credit-note/create" element={<Content Title="Credit Note" modelLink='credit-note' ContentLink='Pages/CreditNote/Form' groupLink="/sales/container/" />} />
                <Route path="/sales/container/credit-note/update/id=:id" element={<Content Title="Credit Note" modelLink='credit-note' ContentLink='Pages/CreditNote/Form' groupLink="/sales/container/" />} />
                <Route path="/sales/container/credit-note/update/id=:id&thirdparty=:thirdparty/" element={<Content Title="Credit Note" modelLink='credit-note' ContentLink='Pages/CreditNote/Form' groupLink="/sales/container/" />} />
                <Route path="/sales/container/credit-note/transfer-from-sales-invoice/id=:id" element={<Content Title="Credit Note" modelLink='credit-note' ContentLink='Pages/CreditNote/Form' groupLink="/sales/container/" />} />
                <Route path="/sales/container/debit-note/create" element={<Content Title="Debit Note" modelLink='debit-note' ContentLink='Pages/DebitNote/Form' groupLink="/sales/container/" />} />
                <Route path="/sales/container/debit-note/update/id=:id" element={<Content Title="Debit Note" modelLink='debit-note' ContentLink='Pages/DebitNote/Form' groupLink="/sales/container/" />} />
                <Route path="/sales/container/debit-note/update/id=:id&thirdparty=:thirdparty/" element={<Content Title="Debit Note" modelLink='debit-note' ContentLink='Pages/DebitNote/Form' groupLink="/sales/container/" />} />
                <Route path="/sales/container/debit-note/transfer-from-sales-invoice/id=:id" element={<Content Title="Debit Note" modelLink='debit-note' ContentLink='Pages/DebitNote/Form' groupLink="/sales/container/" />} />
                <Route path="/sales/container/customer-payment/create" element={<Content Title="Receipt" modelLink='customer-payment' ContentLink='Pages/Receipt/Form' groupLink="/sales/container/" />} />
                <Route path="/sales/container/customer-payment/update/id=:id" element={<Content Title="Receipt" modelLink='customer-payment' ContentLink='Pages/Receipt/Form' groupLink="/sales/container/" />} />
                
                {/* Sales barge form view*/}

                <Route path="/sales/standard/quotation-barge/create" element={<Content Title="Quotation" modelLink='quotation-barge' ContentLink='Pages/Quotation/Form' groupLink="/sales/standard/" />} />
                <Route path="/sales/standard/quotation-barge/update/id=:id" element={<Content Title="Quotation" modelLink='quotation-barge' ContentLink='Pages/Quotation/Form' groupLink="/sales/standard/" />} />
                <Route path="/sales/standard/quotation-barge/update/id=:id&D=:D/" element={<Content Title="Quotation" modelLink='quotation-barge' ContentLink='Pages/Quotation/Form' groupLink="/sales/standard/" />} />
                
                <Route path="/sales/standard/booking-reservation-barge/create" element={<Content Title="Booking Reservation" modelLink='booking-reservation-barge' ContentLink='Pages/BookingReservation/Form' groupLink="/sales/standard/" />} />
                <Route path="/sales/standard/booking-reservation-barge/update/id=:id" element={<Content Title="Booking Reservation" modelLink='booking-reservation-barge' ContentLink='Pages/BookingReservation/Form' groupLink="/sales/standard/" />} />
                <Route path="/sales/standard/booking-reservation-barge/update/id=:id&D=:D/" element={<Content Title="Booking Reservation" modelLink='booking-reservation-barge' ContentLink='Pages/BookingReservation/Form' groupLink="/sales/standard/" />} />
                <Route path="/sales/standard/booking-reservation-barge/transfer-from-quotation/id=:id" element={<Content Title="Booking Reservation" modelLink='booking-reservation-barge' ContentLink='Pages/BookingReservation/Form' groupLink="/sales/standard/" />} />

                <Route path="/sales/standard/sales-invoice-barge/create" element={<Content Title="Sales Invoice" modelLink='sales-invoice-barge' ContentLink='Pages/SalesInvoice/Form' groupLink="/sales/standard/" />} />
                <Route path="/sales/standard/sales-invoice-barge/update/id=:id" element={<Content Title="Sales Invoice" modelLink='sales-invoice-barge' ContentLink='Pages/SalesInvoice/Form' groupLink="/sales/standard/" />} />
                <Route path="/sales/standard/sales-invoice-barge/update/id=:id&thirdparty=:thirdparty/" element={<Content Title="Sales Invoice" modelLink='sales-invoice-barge' ContentLink='Pages/SalesInvoice/Form' groupLink="/sales/standard/" />} />
                <Route path="/sales/standard/sales-invoice-barge/transfer-from-booking-reservation-data/id=:id" element={<Content Title="Sales Invoice" modelLink='sales-invoice-barge' ContentLink='Pages/SalesInvoice/Form' groupLink="/sales/standard/" />} />

                <Route path="/sales/standard/credit-note-barge/create" element={<Content Title="Credit Note" modelLink='credit-note-barge' ContentLink='Pages/CreditNote/Form' groupLink="/sales/standard/" />} />
                <Route path="/sales/standard/credit-note-barge/update/id=:id" element={<Content Title="Credit Note" modelLink='credit-note-barge' ContentLink='Pages/CreditNote/Form' groupLink="/sales/standard/" />} />
                <Route path="/sales/standard/credit-note-barge/update/id=:id&thirdparty=:thirdparty/" element={<Content Title="Credit Note" modelLink='credit-note-barge' ContentLink='Pages/CreditNote/Form' groupLink="/sales/standard/" />} />
                <Route path="/sales/standard/credit-note-barge/transfer-from-sales-invoice/id=:id" element={<Content Title="Credit Note" modelLink='credit-note-barge' ContentLink='Pages/CreditNote/Form' groupLink="/sales/standard/" />} />

                
                <Route path="/sales/standard/debit-note-barge/create" element={<Content Title="Debit Note" modelLink='debit-note-barge' ContentLink='Pages/DebitNote/Form' groupLink="/sales/standard/" />} />
                <Route path="/sales/standard/debit-note-barge/update/id=:id" element={<Content Title="Debit Note" modelLink='debit-note-barge' ContentLink='Pages/DebitNote/Form' groupLink="/sales/standard/" />} />
                <Route path="/sales/standard/debit-note-barge/update/id=:id&thirdparty=:thirdparty/" element={<Content Title="Debit Note" modelLink='debit-note-barge' ContentLink='Pages/DebitNote/Form' groupLink="/sales/standard/" />} />
                <Route path="/sales/standard/debit-note-barge/transfer-from-sales-invoice/id=:id" element={<Content Title="Debit Note" modelLink='debit-note-barge' ContentLink='Pages/DebitNote/Form' groupLink="/sales/standard/" />} />

               
                {/* Operation form view */}
                <Route path="/operation/container/container-release-order/create" element={<Content Title="Container Release Order" modelLink='container-release-order' ContentLink='Pages/ContainerReleaseOrder/Form' groupLink="/operation/container/" />} />
                <Route path="/operation/container/container-release-order/update/id=:id" element={<Content Title="Container Release Order" modelLink='container-release-order' ContentLink='Pages/ContainerReleaseOrder/Form' groupLink="/operation/container/" />} />
                <Route path="/operation/container/container-release-order/transfer-from-booking-reservation-data/id=:id" element={<Content Title="Container Release Order" modelLink='container-release-order' ContentLink='Pages/ContainerReleaseOrder/Form' groupLink="/operation/container/" />} />
                <Route path="/operation/container/container-release-order/update/id=:id&D=:D/" element={<Content Title="Container Release Order" modelLink='container-release-order' ContentLink='Pages/ContainerReleaseOrder/Form' groupLink="/operation/container/" />} />  
                <Route path="/operation/container/bill-of-lading/create" element={<Content Title="Bill Of Lading" modelLink='bill-of-lading' ContentLink='Pages/BillOfLading/Form' groupLink="/operation/container/" />} />
                <Route path="/operation/container/bill-of-lading/transfer-from-booking-reservation-data/id=:id/" element={<Content Title="Bill Of Lading" modelLink='bill-of-lading' ContentLink='Pages/BillOfLading/Form' groupLink="/operation/container/" />} />
                <Route path="/operation/container/bill-of-lading/update/id=:id" element={<Content Title="Bill Of Lading" modelLink='bill-of-lading' ContentLink='Pages/BillOfLading/Form' groupLink="/operation/container/" />} />
                <Route path="/operation/container/bill-of-lading/merge/id=:id&mergeid=:mergeid/" element={<Content Title="Bill Of Lading" modelLink='bill-of-lading' ContentLink='Pages/BillOfLading/Form' groupLink="/operation/container/" />} />
                <Route path="/operation/container/bill-of-lading/update/id=:id&thirdparty=:thirdparty/" element={<Content Title="Bill Of Lading" modelLink='bill-of-lading' ContentLink='Pages/BillOfLading/Form' groupLink="/operation/container/" />} />
                <Route path="/operation/container/bill-of-lading/split/splitid=:splitid&shareid=:shareid&id=:id" element={<Content Title="Bill Of Lading" modelLink='bill-of-lading' ContentLink='Pages/BillOfLading/Form' groupLink="/operation/container/" />} />
                <Route path="/operation/container/bill-of-lading/split/splitid=:splitid&id=:id" element={<Content Title="Bill Of Lading" modelLink='bill-of-lading' ContentLink='Pages/BillOfLading/Form' groupLink="/operation/container/" />} />
                <Route path="/operation/container/bill-of-lading/split/shareid=:shareid&id=:id" element={<Content Title="Bill Of Lading" modelLink='bill-of-lading' ContentLink='Pages/BillOfLading/Form' groupLink="/operation/container/" />} />
                <Route path="/operation/container/delivery-order/update/id=:id" element={<Content Title="Delivery Order" modelLink='delivery-order' ContentLink='Pages/DeliveryOrder/Form' groupLink="/operation/container/" />} />
                <Route path="/movement/container/container-verify-gross-mass/create" element={<Content Title="Container Verify Gross Mass" modelLink='container-verify-gross-mass' ContentLink='Pages/ContainerVerifyGrossMass/Form' groupLink="/movement/container/" />} />
                <Route path="/movement/container/container-verify-gross-mass/update/id=:id" element={<Content Title="Container Verify Gross Mass" modelLink='container-verify-gross-mass' ContentLink='Pages/ContainerVerifyGrossMass/Form' groupLink="/movement/container/" />} />
                    
                 {/* Operation barge form view */}

                <Route path="/operation/standard/bill-of-lading-barge/create" element={<Content Title="Bill Of Lading" modelLink='bill-of-lading-barge' ContentLink='Pages/BillOfLading/Form' groupLink="/operation/standard/" />} />
                <Route path="/operation/standard/bill-of-lading-barge/transfer-from-booking-reservation-data/id=:id/" element={<Content Title="Bill Of Lading" modelLink='bill-of-lading-barge' ContentLink='Pages/BillOfLading/Form' groupLink="/operation/standard/" />} />
                <Route path="/operation/standard/bill-of-lading-barge/update/id=:id" element={<Content Title="Bill Of Lading" modelLink='bill-of-lading-barge' ContentLink='Pages/BillOfLading/Form' groupLink="/operation/standard/" />} />
                <Route path="/operation/standard/bill-of-lading-barge/update/id=:id&thirdparty=:thirdparty/" element={<Content Title="Bill Of Lading" modelLink='bill-of-lading-barge' ContentLink='Pages/BillOfLading/Form' groupLink="/operation/standard/" />} />        
                <Route path="/operation/standard/bill-of-lading-barge/update/id=:id&D=:D/" element={<Content Title="Bill Of Lading" modelLink='bill-of-lading-barge' ContentLink='Pages/BillOfLading/Form' groupLink="/operation/standard/" />} />

                 <Route path="/operation/standard/delivery-order-barge/update/id=:id" element={<Content Title="Delivery Order" modelLink='delivery-order-barge' ContentLink='Pages/DeliveryOrder/Form' groupLink="/operation/standard/" />} />


                {/* Purchase form view*/}
                <Route path="/purchase/purchase-order/create" element={<Content Title="Purchase Order" modelLink='purchase-order' ContentLink='Pages/PurchaseOrder/Form' groupLink="/purchase/" />} />
                <Route path="/purchase/purchase-order/update/id=:id" element={<Content Title="Purchase Order" modelLink='purchase-order' ContentLink='Pages/PurchaseOrder/Form' groupLink="/purchase/" />} />
                
                 {/* Company form view */}
                <Route path="/company/company/create" element={<Content Title="Company" modelLink='company' ContentLink='Pages/Company/Form' groupLink="/company/" />} />
                <Route path="/company/company/create/type=:type" element={<Content Title="Company" modelLink='company' ContentLink='Pages/Company/Form' groupLink="/company/"/>} />
                <Route path="/company/company/update/id=:id" element={<Content Title="Company" modelLink='company' ContentLink='Pages/Company/Form' groupLink="/company/" />} /> 
                <Route path="/company/company/update/id=:id/type=:type" element={<Content Title="Company" modelLink='company' ContentLink='Pages/Company/Form' groupLink="/company/" />} />     
                <Route path="/company/terminal/create" element={<Content Title="Terminal" modelLink='terminal' ContentLink='Pages/Terminal/Form' groupLink="/company/" />} />
                <Route path="/company/terminal/update/id=:id" element={<Content Title="Terminal" modelLink='terminal' ContentLink='Pages/Terminal/Form' groupLink="/company/" />} />

                {/* Asset form view */}
                <Route path="/asset/container/create" element={<Content Title="Container" modelLink='container' ContentLink='Pages/Container/Form' groupLink="/asset/" />} />
                <Route path="/asset/container/update/id=:id" element={<Content Title="Container" modelLink='container' ContentLink='Pages/Container/Form' groupLink="/asset/" />} />
                <Route path="/asset/vessel/create" element={<Content Title="Vessel" modelLink='vessel' ContentLink='Pages/Vessel/Form' groupLink="/asset/" />} />
                <Route path="/asset/vessel/update/id=:id" element={<Content Title="Vessel" modelLink='vessel' ContentLink='Pages/Vessel/Form' groupLink="/asset/" />} />

                             
                {/* Schedule form view */}
                <Route path="/schedule/route/create" element={<Content Title="Route" modelLink='route' ContentLink='Pages/Route/Form' groupLink="/schedule/" />} />
                <Route path="/schedule/route/update/id=:id" element={<Content Title="Route" modelLink='route' ContentLink='Pages/Route/Form' groupLink="/schedule/" />} />
                <Route path="/schedule/voyage/create" element={<Content Title="Voyage" modelLink='voyage' ContentLink='Pages/Voyage/Form' groupLink="/schedule/" />} />
                <Route path="/schedule/voyage/update/id=:id" element={<Content Title="Voyage" modelLink='voyage' ContentLink='Pages/Voyage/Form' groupLink="/schedule/" />} />

                {/* Setting form view */}
                <Route path="/setting/general-settings/port/create" element={<Content Title="Port" modelLink='port' ContentLink='Pages/Port/Form' groupLink="/setting/general-settings/" />} />
                <Route path="/setting/general-settings/port/update/id=:id" element={<Content Title="Port" modelLink='port' ContentLink='Pages/Port/Form' groupLink="/setting/general-settings/" />} />
                <Route path="/setting/general-settings/currency/currency-type/create" element={<Content Title="Currency Type" modelLink='currency-type' ContentLink='Pages/CurrencyType/Form' groupLink="/setting/general-settings/currency/" />} />
                <Route path="/setting/general-settings/currency/currency-type/update/id=:id" element={<Content Title="Currency Type" modelLink='currency-type' ContentLink='Pages/CurrencyType/Form' groupLink="/setting/general-settings/currency/" />} />
                <Route path="/setting/general-settings/currency/currency-rate/create" element={<Content Title="Currency Rate" modelLink='currency-rate' ContentLink='Pages/CurrencyRate/Form' groupLink="/setting/general-settings/currency/" />} />
                <Route path="/setting/general-settings/currency/currency-rate/update/id=:id" element={<Content Title="Currency Rate" modelLink='currency-rate' ContentLink='Pages/CurrencyRate/Form' groupLink="/setting/general-settings/currency/" />} />
                <Route path="/setting/general-settings/tax-code/create" element={<Content Title="Tax Code" ContentLink='Pages/TaxCode/Form' modelLink="tax-code" groupLink="/setting/general-settings/" />} />
                <Route path="/setting/general-settings/tax-code/update/id=:id" element={<Content Title="Tax Code" ContentLink='Pages/TaxCode/Form' modelLink="tax-code" groupLink="/setting/general-settings/" />} />
                <Route path="/setting/general-settings/credit-term/create" element={<Content Title="Credit Term" ContentLink='Pages/CreditTerm/Form' modelLink="credit-term" groupLink="/setting/general-settings/" />} />
                <Route path="/setting/general-settings/credit-term/update/id=:id" element={<Content Title="Credit Term" ContentLink='Pages/CreditTerm/Form' modelLink="credit-term" groupLink="/setting/general-settings/" />} />
                <Route path="/setting/asset-settings/container-type/create" element={<Content Title="Container Type" ContentLink='Pages/ContainerType/Form' modelLink="container-type" groupLink="/setting/asset-settings/" />} />
                <Route path="/setting/asset-settings/container-type/update/id=:id" element={<Content Title="Container Type" ContentLink='Pages/ContainerType/Form' modelLink="container-type" groupLink="/setting/asset-settings/" />} />
                <Route path="/setting/asset-settings/vessel-type/create" element={<Content Title="Vessel Type" ContentLink='Pages/VesselType/Form' modelLink="vessel-type" groupLink="/setting/asset-settings/" />} />
                <Route path="/setting/asset-settings/vessel-type/update/id=:id" element={<Content Title="Vessel Type" ContentLink='Pages/VesselType/Form' modelLink="vessel-type" groupLink="/setting/asset-settings/" />} />
                <Route path="/setting/sales-settings/u-n-number/create" element={<Content Title="UN Number" ContentLink='Pages/UNNumber/Form' modelLink="u-n-number" groupLink="/setting/sales-settings/" />} />
                <Route path="/setting/sales-settings/u-n-number/update/id=:id" element={<Content Title="UN Number" ContentLink='Pages/UNNumber/Form' modelLink="u-n-number" groupLink="/setting/sales-settings/" />} />
                <Route path="/setting/sales-settings/h-s-code/create" element={<Content Title="HS Code" ContentLink='Pages/HSCode/Form' modelLink="h-s-code" groupLink="/setting/sales-settings/" />} />
                <Route path="/setting/sales-settings/h-s-code/update/id=:id" element={<Content Title="HS Code" ContentLink='Pages/HSCode/Form' modelLink="h-s-code" groupLink="/setting/sales-settings/" />} />
                <Route path="/setting/sales-settings/charges/create" element={<Content Title="Charges" ContentLink='Pages/Charges/Form' modelLink="charges" groupLink="/setting/sales-settings/" />} />
                <Route path="/setting/sales-settings/charges/update/id=:id" element={<Content Title="Charges" ContentLink='Pages/Charges/Form' modelLink="charges" groupLink="/setting/sales-settings/" />} />
                <Route path="/setting/sales-settings/tariff/create" element={<Content Title="Tariff" ContentLink='Pages/Tariff/Form' modelLink="tariff" groupLink="/setting/sales-settings/" />} />
                <Route path="/setting/sales-settings/tariff/update/id=:id" element={<Content Title="Tariff" ContentLink='Pages/Tariff/Form' modelLink="tariff" groupLink="/setting/sales-settings/" />} />
                <Route path="/setting/sales-settings/receivable-method/create" element={<Content Title="Receivable Method" ContentLink='Pages/ReceivableMethod/Form' modelLink="receivable-method" groupLink="/setting/sales-settings/" />} />
                <Route path="/setting/sales-settings/receivable-method/update/id=:id" element={<Content Title="Receivable Method" ContentLink='Pages/ReceivableMethod/Form' modelLink="receivable-method" groupLink="/setting/sales-settings/" />} />             
                <Route path="/setting/user-settings/user/create" element={<Content Title="User" ContentLink='Pages/User/Form' modelLink="user" groupLink="/setting/user-settings/" />} />      
                <Route path="/setting/user-settings/user/update/id=:id" element={<Content Title="User" ContentLink='Pages/User/Form' modelLink="user" groupLink="/setting/user-settings/" />} />
                <Route path="/setting/user-settings/user/profile/id=:id" element={<Content Title="User" ContentLink='Pages/User/Form' modelLink="user" groupLink="/setting/user-settings/"  profile={true}/>} />
                <Route path="/setting/user-settings/user/create" element={<Content Title="User" ContentLink='Pages/User/Form' modelLink="user" groupLink="/setting/user-settings/" />} />      
                <Route path="/setting/user-settings/user/update/id=:id" element={<Content Title="User" ContentLink='Pages/User/Form' modelLink="user" groupLink="/setting/sales-settings/" />} />     
                <Route path="/setting/user-settings/change-password/Form" element={<Content Title="Change Password" ContentLink='Pages/ChangePassword/Form' header="ChangePassword" model="ChangePassword" modelLink="change-password" groupLink="/setting/user-settings/" />} />
                <Route path="/setting/user-settings/change-password" element={<Content Title="Change Password" ContentLink='Pages/ChangePassword/Form' header="ChangePassword" model="ChangePassword" modelLink="change-password" groupLink="/setting/user-settings/" />} />    

                {/* share  "ShareForm1"  form view*/}
                <Route path="/setting/general-settings/freight-term/create" element={<Content Title="Freight Term" ContentLink='CommonForm/ShareForm1' directory="same" header="Freight Term Form" model="FreightTerm" modelLink="freight-term" groupLink="/setting/general-settings/" />} />
                <Route path="/setting/general-settings/freight-term/update/id=:id" element={<Content Title="Freight Term" ContentLink='CommonForm/ShareForm1' directory="same" header="Freight Term Form" model="FreightTerm" modelLink="freight-term" groupLink="/setting/general-settings/" />} />
                <Route path="/setting/general-settings/port-term/create" element={<Content Title="Port Term" ContentLink='CommonForm/ShareForm1' directory="same" header="Port Term Form" model="PortTerm" modelLink="port-term" groupLink="/setting/general-settings/" />} />
                <Route path="/setting/general-settings/port-term/update/id=:id" element={<Content Title="Port Term" ContentLink='CommonForm/ShareForm1' directory="same" header="Port Term Form" model="PortTerm" modelLink="port-term" groupLink="/setting/general-settings/" />} />
                <Route path="/setting/company-settings/business-nature/create" element={<Content Title="Business Nature" ContentLink='CommonForm/ShareForm1' directory="same" header="Business Nature Form" model="BusinessNature" modelLink="business-nature" groupLink="/setting/company-settings/" />} />
                <Route path="/setting/company-settings/business-nature/update/id=:id" element={<Content Title="Business Nature" ContentLink='CommonForm/ShareForm1' directory="same" header="Business Nature Form" model="BusinessNature" modelLink="business-nature" groupLink="/setting/company-settings/" />} />
                <Route path="/setting/company-settings/customer-type/create" element={<Content Title="Customer Type" ContentLink='CommonForm/ShareForm1' directory="same" header="Customer Type Form" model="CustomerType" modelLink="customer-type" groupLink="/setting/company-settings/" />} />
                <Route path="/setting/company-settings/customer-type/update/id=:id" element={<Content Title="Customer Type" ContentLink='CommonForm/ShareForm1' directory="same" header="Customer Type Form" model="CustomerType" modelLink="customer-type" groupLink="/setting/company-settings/" />} />
                <Route path="/setting/company-settings/supplier-type/create" element={<Content Title="Supplier Type" ContentLink='CommonForm/ShareForm1' directory="same" header="Freight Term Form" model="SupplierType" modelLink="supplier-type" groupLink="/setting/company-settings/" />} />
                <Route path="/setting/company-settings/supplier-type/update/id=:id" element={<Content Title="Supplier Type" ContentLink='CommonForm/ShareForm1' directory="same" header="Freight Term Form" model="SupplierType" modelLink="supplier-type" groupLink="/setting/company-settings/" />} />
                <Route path="/setting/company-settings/company-type/create" element={<Content Title="Company Type" ContentLink='CommonForm/ShareForm1' directory="same" header="Company Type Form" model="CompanyType" modelLink="company-type" groupLink="/setting/company-settings/" />} />
                <Route path="/setting/company-settings/company-type/update/id=:id" element={<Content Title="Company Type" ContentLink='CommonForm/ShareForm1' directory="same" header="Company Type Form" model="CompanyType" modelLink="company-type" groupLink="/setting/company-settings/" />} />
                <Route path="/setting/sales-settings/charges-type/create" element={<Content Title="Charges Type" ContentLink='CommonForm/ShareForm1' directory="same" header="Charges Type Form" model="ChargesType" modelLink="charges-type" groupLink="/setting/sales-settings/" />} />
                <Route path="/setting/sales-settings/charges-type/update/id=:id" element={<Content Title="Charges Type" ContentLink='CommonForm/ShareForm1' directory="same" header="Charges Type Form" model="ChargesType" modelLink="charges-type" groupLink="/setting/sales-settings/" />} />
                <Route path="/setting/asset-settings/cargo-type/create" element={<Content Title="Cargo Type" ContentLink='CommonForm/ShareForm1' directory="same" header="Cargo Type Form" model="CargoType" modelLink="cargo-type" groupLink="/setting/asset-settings/" />} />
                <Route path="/setting/asset-settings/cargo-type/update/id=:id" element={<Content Title="Cargo Type" ContentLink='CommonForm/ShareForm1' directory="same" header="Cargo Type Form" model="CargoType" modelLink="cargo-type" groupLink="/setting/asset-settings/" />} />


              
                 {/* Movement  form view*/}
                <Route path="/movement/container/report/real-time-tracking/index" element={<Content Title="Real Time Tracking" ContentLink='Pages/RealTimeTracking/Index' modelLink="real-time-tracking" groupLink="/movement/container/report/" />} />
                <Route path="/movement/container/report/history-tracking/index" element={<Content Title="History Tracking" ContentLink='Pages/HistoryTracking/Index' modelLink="history-tracking" groupLink="/movement/container/report/" />} />

               
                {/* share  "UserGroupRuleSetForm"  form view*/}
                <Route path="/setting/user-settings/user-group/create" element={<Content Title="User Group" ContentLink='CommonForm/UserGroupRuleSetForm' directory="same" header="User Group Form" model="UserGroup" modelLink="user-group" groupLink="/setting/user-settings/" />} />
                <Route path="/setting/user-settings/user-group/update/id=:id" element={<Content Title="User Group" ContentLink='CommonForm/UserGroupRuleSetForm' directory="same" header="User Group Form" model="UserGroup" modelLink="user-group" groupLink="/setting/user-settings/" />} />
                <Route path="/setting/user-settings/rule-set/create" element={<Content Title="Rule Set" ContentLink='CommonForm/UserGroupRuleSetForm' directory="same" header="Rule Set Form" model="RuleSet" modelLink="rule-set" groupLink="/setting/user-settings/" />} />
                <Route path="/setting/user-settings/rule-set/update/id=:id" element={<Content Title="Rule Set" ContentLink='CommonForm/UserGroupRuleSetForm' directory="same" header="Rule Set Form" model="RuleSet" modelLink="rule-set" groupLink="/setting/user-settings/" />} />
                <Route path="/setting/user-settings/rule/create" element={<Content Title="Rule" ContentLink='Pages/Rule/Form' header="Rule Form" model="Rule" modelLink="rule" groupLink="/setting/user-settings/" />} />
                <Route path="/setting/user-settings/rule/update/id=:id" element={<Content Title="Rule" ContentLink='Pages/Rule/Form' header="Rule Form" model="Rule" modelLink="rule" groupLink="/setting/user-settings/" />} />
            

                {/* Sales index view */}
                <Route path="/sales/container/quotation/index" element={<Content Title="Quotation" model="Quotation" directory="same" ContentLink='CommonGridView/GridView' tableId="quotation" columnSetting="quotation" groupLink="/sales/container/" />} />  
                <Route path="/sales/container/quotation" element={<Content Title="Quotation" model="Quotation" directory="same" ContentLink='CommonGridView/GridView' tableId="quotation" columnSetting="quotation" groupLink="/sales/container/" />} />      
                <Route path="/sales/container/booking-reservation/index" element={<Content Title="Booking Reservation" model="BookingReservation" directory="same" ContentLink='CommonGridView/GridView' tableId="booking-reservation" columnSetting="booking-reservation" groupLink="/sales/container/" />} />
                <Route path="/sales/container/booking-reservation" element={<Content Title="Booking Reservation" model="BookingReservation" directory="same" ContentLink='CommonGridView/GridView' tableId="booking-reservation" columnSetting="booking-reservation" groupLink="/sales/container/" />} />  
                <Route path="/sales/container/sales-invoice/index" element={<Content Title="Sales Invoice" model="SalesInvoice" directory="same" ContentLink='CommonGridView/GridView' tableId="sales-invoice" columnSetting="sales-invoice" groupLink="/sales/container/" />} /> 
                <Route path="/sales/container/sales-invoice" element={<Content Title="Sales Invoice" model="SalesInvoice" directory="same" ContentLink='CommonGridView/GridView' tableId="sales-invoice" columnSetting="sales-invoice" groupLink="/sales/container/" />} /> 
                <Route path="/sales/container/credit-note/index" element={<Content Title="Credit Note" model="CreditNote" directory="same" ContentLink='CommonGridView/GridView' tableId="credit-note" columnSetting="credit-note" groupLink="/sales/container/" />} /> 
                <Route path="/sales/container/credit-note" element={<Content Title="Credit Note" model="CreditNote" directory="same" ContentLink='CommonGridView/GridView' tableId="credit-note" columnSetting="credit-note" groupLink="/sales/container/" />} />             
                <Route path="/sales/container/debit-note/index" element={<Content Title="Debit Note" model="DebitNote" directory="same" ContentLink='CommonGridView/GridView' tableId="debit-note" columnSetting="debit-note" groupLink="/sales/container/" />} />     
                <Route path="/sales/container/debit-note" element={<Content Title="Debit Note" model="DebitNote" directory="same" ContentLink='CommonGridView/GridView' tableId="debit-note" columnSetting="debit-note" groupLink="/sales/container/" />} />   
                <Route path="/sales/container/customer-payment/index" element={<Content Title="Receipt" model="CustomerPayment" directory="same" ContentLink='CommonGridView/GridView' tableId="customer-payment" columnSetting="customer-payment" groupLink="/sales/container/" />} />   
                <Route path="/sales/container/customer-payment" element={<Content Title="Receipt" model="CustomerPayment" directory="same" ContentLink='CommonGridView/GridView' tableId="customer-payment" columnSetting="customer-payment" groupLink="/sales/container/" />} />           
                
                 {/* Sales barge index view */}
                 <Route path="/sales/standard/quotation-barge/index" element={<Content Title="Quotation" model="Quotation" directory="same" ContentLink='CommonGridView/GridView' tableId="quotation-barge" columnSetting="quotation-barge" groupLink="/sales/standard/" />} />  
                 <Route path="/sales/standard/quotation-barge" element={<Content Title="Quotation" model="Quotation" directory="same" ContentLink='CommonGridView/GridView' tableId="quotation-barge" columnSetting="quotation-barge" groupLink="/sales/standard/" />} />      
                 <Route path="/sales/standard/booking-reservation-barge/index" element={<Content Title="Booking Reservation" model="BookingReservation" directory="same" ContentLink='CommonGridView/GridView' tableId="booking-reservation-barge" columnSetting="booking-reservation-barge" groupLink="/sales/standard/" barge={true} />} />
                 <Route path="/sales/standard/booking-reservation-barge" element={<Content Title="Booking Reservation" model="BookingReservation" directory="same" ContentLink='CommonGridView/GridView' tableId="booking-reservation-barge" columnSetting="booking-reservation-barge" groupLink="/sales/standard/" barge={true} />} />  
                
                 <Route path="/sales/standard/sales-invoice-barge/index" element={<Content Title="Sales Invoice" model="SalesInvoice" directory="same" ContentLink='CommonGridView/GridView' tableId="sales-invoice-barge" columnSetting="sales-invoice-barge" groupLink="/sales/standard/" />} /> 
                 <Route path="/sales/standard/sales-invoice-barge" element={<Content Title="Sales Invoice" model="SalesInvoice" directory="same" ContentLink='CommonGridView/GridView' tableId="sales-invoice-barge" columnSetting="sales-invoice-barge" groupLink="/sales/standard/" />} /> 

                 <Route path="/sales/standard/credit-note-barge/index" element={<Content Title="Credit Note" model="CreditNote" directory="same" ContentLink='CommonGridView/GridView' tableId="credit-note-barge" columnSetting="credit-note-barge" groupLink="/sales/standard/" />} /> 
                 <Route path="/sales/standard/credit-note-barge" element={<Content Title="Credit Note" model="CreditNote" directory="same" ContentLink='CommonGridView/GridView' tableId="credit-note-barge" columnSetting="credit-note-barge" groupLink="/sales/standard/" />} />     
                 <Route path="/sales/standard/debit-note-barge/index" element={<Content Title="Debit Note" model="DebitNote" directory="same" ContentLink='CommonGridView/GridView' tableId="debit-note-barge" columnSetting="debit-note-barge" groupLink="/sales/standard/" />} /> 
                 <Route path="/sales/standard/debit-note-barge" element={<Content Title="Debit Note" model="DebitNote" directory="same" ContentLink='CommonGridView/GridView' tableId="debit-note-barge" columnSetting="debit-note-barge" groupLink="/sales/standard/" />} />                     
               
                {/* Operation index view */}
                <Route path="/operation/container/container-release-order/index" element={<Content Title="Container Release Order" model="ContainerReleaseOrder" directory="same" ContentLink='CommonGridView/GridView' tableId="container-release-order" columnSetting="container-release-order" groupLink="/operation/container/" />} />
                <Route path="/operation/container/container-release-order" element={<Content Title="Container Release Order" model="ContainerReleaseOrder" directory="same" ContentLink='CommonGridView/GridView' tableId="container-release-order" columnSetting="container-release-order" groupLink="/operation/container/" />} />    
                <Route path="/operation/container/bill-of-lading/index" element={<Content Title="Bill Of Lading" model="BillOfLading" directory="same" ContentLink='CommonGridView/GridView' tableId="bill-of-lading" columnSetting="bill-of-lading" groupLink="/operation/container/" />} /> 
                <Route path="/operation/container/bill-of-lading" element={<Content Title="Bill Of Lading" model="BillOfLading" directory="same" ContentLink='CommonGridView/GridView' tableId="bill-of-lading" columnSetting="bill-of-lading" groupLink="/operation/container/" />} /> 
               
                <Route path="/operation/container/delivery-order/index" element={<Content Title="Delivery Order" model="DeliveryOrder" directory="same" ContentLink='CommonGridView/GridView' tableId="delivery-order" columnSetting="delivery-order" groupLink="/operation/container/" />} /> 
                <Route path="/operation/container/delivery-order" element={<Content Title="Delivery Order" model="DeliveryOrder" directory="same" ContentLink='CommonGridView/GridView' tableId="delivery-order" columnSetting="delivery-order" groupLink="/operation/container/" />} /> 
                

                 {/* Operation barge index view */}

                 <Route path="/operation/standard/bill-of-lading-barge/index" element={<Content Title="Bill Of Lading" model="BillOfLading" directory="same" ContentLink='CommonGridView/GridView' tableId="bill-of-lading-barge" columnSetting="bill-of-lading-barge" groupLink="/operation/standard/" barge={true} />} />  
                 <Route path="/operation/standard/bill-of-lading-barge" element={<Content Title="Bill Of Lading" model="BillOfLading" directory="same" ContentLink='CommonGridView/GridView' tableId="bill-of-lading-barge" columnSetting="bill-of-lading-barge" groupLink="/operation/standard/" barge={true} />} />            

                <Route path="/operation/standard/delivery-order-barge/index" element={<Content Title="Delivery Order" model="DeliveryOrder" directory="same" ContentLink='CommonGridView/GridView' tableId="delivery-order-barge" columnSetting="delivery-order-barge" groupLink="/operation/standard/" />} /> 
                <Route path="/operation/standard/delivery-order-barge" element={<Content Title="Delivery Order" model="DeliveryOrder" directory="same" ContentLink='CommonGridView/GridView' tableId="delivery-order-barge" columnSetting="delivery-order-barge" groupLink="/operation/standard/" />} /> 
                 


                {/* third-party index view */}
                <Route path="/sales/container/sales-invoice/index/third-party"  element={<Content  thirdParty="1" Title="Sales Invoice" model="SalesInvoice" directory="same" ContentLink='CommonGridView/GridView' tableId="sales-invoice" columnSetting="sales-invoice" groupLink="/sales/container/" />} />  
                <Route path="/sales/container/debit-note/index/third-party"  element={<Content  thirdParty="1" Title="Debit Note" model="DebitNote" directory="same" ContentLink='CommonGridView/GridView' tableId="debit-note" columnSetting="debit-note" groupLink="/sales/container/" />} />  
                <Route path="/operation/container/bill-of-lading/index/third-party" element={<Content thirdParty="1" Title="Bill Of Lading" model="BillOfLading" directory="same" ContentLink='CommonGridView/GridView' tableId="bill-of-lading" columnSetting="bill-of-lading" groupLink="/operation/container/" />} />      
             
               {/* third-party barge index view */}
                <Route path="/sales/standard/sales-invoice-barge/index/third-party"  element={<Content  thirdParty="1" Title="Sales Invoice" model="SalesInvoice" directory="same" ContentLink='CommonGridView/GridView' tableId="sales-invoice-barge" columnSetting="sales-invoice-barge" groupLink="/sales/standard/" />} />  
                <Route path="/sales/standard/debit-note-barge/index/third-party"  element={<Content  thirdParty="1" Title="Debit Note" model="DebitNote" directory="same" ContentLink='CommonGridView/GridView' tableId="debit-note-barge" columnSetting="debit-note-barge" groupLink="/sales/standard/" />} />  
                <Route path="/operation/standard/bill-of-lading-barge/index/third-party" element={<Content thirdParty="1" Title="Bill Of Lading" model="BillOfLading" directory="same" ContentLink='CommonGridView/GridView' tableId="bill-of-lading-barge" columnSetting="bill-of-lading-barge" groupLink="/operation/standard/" />} />      
                
                 {/* Report index view */}
                <Route path="/sales/report/statement-of-account/index" element={<Content Title="Statement Of Account" ContentLink='CommonForm/StatementListing' directory="same" header="Statement Of Account" model="StatementOfAccount" modelLink="statement-of-account" groupLink="/sales/report/" />} />       
                <Route path="/sales/report/statement-of-account" element={<Content Title="Statement Of Account" ContentLink='CommonForm/StatementListing' directory="same" header="Statement Of Account" model="StatementOfAccount" modelLink="statement-of-account" groupLink="/sales/report/" />} />       


                <Route path="/sales/report/forecast/index" element={<Content Title="Forecast" ContentLink='Pages/Forecast/Form' header="Forecast" model="Forecast" modelLink="forecast" groupLink="/sales/report/" />} />                        
                <Route path="/sales/report/forecast" element={<Content Title="Forecast" ContentLink='Pages/Forecast/Form' header="Forecast" model="Forecast" modelLink="forecast" groupLink="/sales/report/" />} />                             

                <Route path="/sales/report/customer-statement/index" element={<Content Title="Customer Statement" ContentLink='CommonForm/StatementListing' directory="same" header="CustomerStatement" model="CustomerStatement" modelLink="customer-statement" groupLink="/sales/report/" />} />   
                <Route path="/sales/report/customer-statement" element={<Content Title="Customer Statement" ContentLink='CommonForm/StatementListing' directory="same" header="CustomerStatement" model="CustomerStatement" modelLink="customer-statement" groupLink="/sales/report/" />} />   
                <Route path="/sales/report/document-matrix/index" element={<Content Title="Sales Operation Document Matrix" ContentLink='Pages/DocumentMatrix/Form' header="DocumentMatrix" model="DocumentMatrix" modelLink="document-matrix" groupLink="/sales/report/" />} />        
                <Route path="/sales/report/document-matrix" element={<Content Title="Sales Operation Document Matrix" ContentLink='Pages/DocumentMatrix/Form' header="DocumentMatrix" model="DocumentMatrix" modelLink="document-matrix" groupLink="/sales/report/" />} />        
                <Route path="/operation/report/manifest-import/index" element={<Content Title="Manifest - Import" ContentLink='CommonForm/Manifest' directory="same" header="Manifest Import" model="ManifestImport" modelLink="manifest-import" groupLink="/operation/report/" />} />
                <Route path="/operation/report/manifest-import" element={<Content Title="Manifest - Import" ContentLink='CommonForm/Manifest' directory="same" header="Manifest Import" model="ManifestImport" modelLink="manifest-import" groupLink="/operation/report/" />} />
                <Route path="/operation/report/manifest-export/index" element={<Content Title="Manifest - Export" ContentLink='CommonForm/Manifest' directory="same" header="Manifest Export" model="ManifestExport" modelLink="manifest-export" groupLink="/operation/report/" />} />
                <Route path="/operation/report/manifest-export" element={<Content Title="Manifest - Export" ContentLink='CommonForm/Manifest' directory="same" header="Manifest Export" model="ManifestExport" modelLink="manifest-export" groupLink="/operation/report/" />} />
                <Route path="/operation/report/manifest-transhipment/index" element={<Content Title="Manifest - Transhipment" ContentLink='CommonForm/Manifest' directory="same" header="Manifest Transhipment" model="ManifestTranshipment" modelLink="manifest-transhipment" groupLink="/operation/report/" />} />
                <Route path="/operation/report/manifest-transhipment" element={<Content Title="Manifest - Transhipment" ContentLink='CommonForm/Manifest' directory="same" header="Manifest Transhipment" model="ManifestTranshipment" modelLink="manifest-transhipment" groupLink="/operation/report/" />} />
                <Route path="/operation/report/loading-list/index" element={<Content Title="Loading List" ContentLink='CommonForm/LoadingDischargingList' directory="same" header="Loading List" model="LoadingList" modelLink="loading-list" groupLink="/operation/report/" />} />
                <Route path="/operation/report/loading-list" element={<Content Title="Loading List" ContentLink='CommonForm/LoadingDischargingList' directory="same" header="Loading List" model="LoadingList" modelLink="loading-list" groupLink="/operation/report/" />} />
                <Route path="/operation/report/discharging-list/index" element={<Content Title="Discharging List" ContentLink='CommonForm/LoadingDischargingList' directory="same" header="Loading List" model="DischargingList" modelLink="discharging-list" groupLink="/operation/report/" />} />             
                <Route path="/operation/report/discharging-list" element={<Content Title="Discharging List" ContentLink='CommonForm/LoadingDischargingList' directory="same" header="Loading List" model="DischargingList" modelLink="discharging-list" groupLink="/operation/report/" />} />             
                <Route path="/operation/report/dnd/index" element={<Content Title="D&D" model="DnD" directory="same" ContentLink='CommonGridView/GridView' tableId="dnd" columnSetting="dnd" groupLink="/operation/report/" />} />      
                <Route path="/operation/report/dnd" element={<Content Title="D&D" model="DnD" directory="same" ContentLink='CommonGridView/GridView' tableId="dnd" columnSetting="dnd" groupLink="/operation/report/" />} />      
                <Route path="/operation/report/schedule/index" element={<Content Title="Voyage Suggestion" ContentLink='Pages/VoyageSuggestion/Index' modelLink="VoyageSuggestion" groupLink="/operation/report/" />} />
                <Route path="/operation/report/schedule" element={<Content Title="Voyage Suggestion" ContentLink='Pages/VoyageSuggestion/Index' modelLink="VoyageSuggestion" groupLink="/operation/report/" />} />
                <Route path="/operation/report/t-d-r/index" element={<Content Title="TDR Report" ContentLink='Pages/TDRReport/Form' header="TDRReport" model="TDRReport" modelLink="t-d-r" groupLink="/operation/report/" />} />        
                <Route path="/operation/report/t-d-r" element={<Content Title="TDR Report" ContentLink='Pages/TDRReport/Form' header="TDRReport" model="TDRReport" modelLink="t-d-r" groupLink="/operation/report/" />} />           
                <Route path="/operation/report/trucking-list/index" element={<Content Title="Trucking List" ContentLink='Pages/TruckingList/Form' header="TruckingList" model="TruckingList" modelLink="trucking-list" groupLink="/operation/report/" />} />                        
                <Route path="/operation/report/trucking-list" element={<Content Title="Trucking List" ContentLink='Pages/TruckingList/Form' header="TruckingList" model="TruckingList" modelLink="trucking-list" groupLink="/operation/report/" />} />                        
                <Route path="/operation/report/lifting/index" element={<Content Title="Volume Lifting" ContentLink='CommonForm/Lifting' directory="same" header="Lifting" model="Lifting" modelLink="lifting" groupLink="/operation/report/" />} />
                <Route path="/operation/report/lifting" element={<Content Title="Volume Lifting" ContentLink='CommonForm/Lifting' directory="same" header="Lifting" model="Lifting" modelLink="lifting" groupLink="/operation/report/" />} />
                <Route path="/operation/report/lifting-summary/index" element={<Content Title="Volume Lifting Summary" ContentLink='CommonForm/Lifting' directory="same" header="LiftingSummary" model="LiftingSummary" modelLink="lifting-summary" groupLink="/operation/report/" />} /> 
                <Route path="/operation/report/lifting-summary" element={<Content Title="Volume Lifting Summary" ContentLink='CommonForm/Lifting' directory="same" header="LiftingSummary" model="LiftingSummary" modelLink="lifting-summary" groupLink="/operation/report/" />} /> 
                <Route path="/operation/report/vessel-voyage-lifting/index" element={<Content Title="Vessel Volume Lifting" ContentLink='CommonForm/Lifting' directory="same" header="VesselVoyageLifting" model="VesselVoyageLifting" modelLink="vessel-voyage-lifting" groupLink="/operation/report/" />} /> 
                <Route path="/operation/report/vessel-voyage-lifting" element={<Content Title="Vessel Volume Lifting" ContentLink='CommonForm/Lifting' directory="same" header="VesselVoyageLifting" model="VesselVoyageLifting" modelLink="vessel-voyage-lifting" groupLink="/operation/report/" />} /> 
                
                <Route path="/operation/report/vessel-voyage-lifting-summary/index" element={<Content Title="Vessel Volume Lifting" ContentLink='CommonForm/Lifting' directory="same" header="VesselVoyageLiftingSummary" model="VesselVoyageLiftingSummary" modelLink="vessel-voyage-lifting-summary" groupLink="/operation/report/" />} /> 
                <Route path="/operation/report/vessel-voyage-lifting-sumary" element={<Content Title="Vessel Volume Lifting Summary" ContentLink='CommonForm/Lifting' directory="same" header="VesselVoyageLiftingSummary" model="VesselVoyageLiftingSummary" modelLink="vessel-voyage-lifting-summary" groupLink="/operation/report/" />} /> 

                
                <Route path="/operation/report/customer-lifting/index" element={<Content Title="Client Lifting" ContentLink='Pages/CustomerLifting/Form' header="CustomerLifting" model="CustomerLifting" modelLink="customer-lifting" groupLink="/operation/report/" />} />  
                <Route path="/operation/report/customer-lifting" element={<Content Title="Client Lifting" ContentLink='Pages/CustomerLifting/Form' header="CustomerLifting" model="CustomerLifting" modelLink="customer-lifting" groupLink="/operation/report/" />} />  
                <Route path="/operation/report/customer-lifting-summary/index" element={<Content Title="Client Lifting Summary" ContentLink='Pages/CustomerLifting/Form' header="CustomerLiftingSummary" model="CustomerLiftingSummary" modelLink="customer-lifting-summary" groupLink="/operation/report/" />} />  
                <Route path="/operation/report/customer-lifting-summary" element={<Content Title="Client Lifting Summary" ContentLink='Pages/CustomerLifting/Form' header="CustomerLiftingSummary" model="CustomerLiftingSummary" modelLink="customer-lifting-summary" groupLink="/operation/report/" />} />  

               
                 {/* movement index view */}            
                <Route path="/movement/container/container-release/index" element={<Content Title="Container Release" model="ContainerRelease" directory="same" ContentLink='CommonGridView/GridViewMovement' tableId="container-release" columnSetting="container-release" groupLink="/movement/container/" />} /> 
                <Route path="/movement/container/container-release" element={<Content Title="Container Release" model="ContainerRelease" directory="same" ContentLink='CommonGridView/GridViewMovement' tableId="container-release" columnSetting="container-release" groupLink="/movement/container/" />} /> 
                <Route path="/movement/container/container-verify-gross-mass/index" element={<Content Title="Container Verify Gross Mass" model="ContainerVerifyGrossMass" directory="same" ContentLink='CommonGridView/GridView' tableId="container-verify-gross-mass" columnSetting="container-verify-gross-mass" groupLink="/movement/container/" />} />   
                <Route path="/movement/container/container-verify-gross-mass" element={<Content Title="Container Verify Gross Mass" model="ContainerVerifyGrossMass" directory="same" ContentLink='CommonGridView/GridView' tableId="container-verify-gross-mass" columnSetting="container-verify-gross-mass" groupLink="/movement/container/" />} />   
                <Route path="/movement/container/container-gate-in/index" element={<Content Title="Container Gate In" model="ContainerGateIn" directory="same" ContentLink='CommonGridView/GridViewMovement' tableId="container-gate-in" columnSetting="container-gate-in" groupLink="/movement/container/" />} /> 
                <Route path="/movement/container/container-gate-in" element={<Content Title="Container Gate In" model="ContainerGateIn" directory="same" ContentLink='CommonGridView/GridViewMovement' tableId="container-gate-in" columnSetting="container-gate-in" groupLink="/movement/container/" />} /> 
                <Route path="/movement/container/container-loaded/index" element={<Content Title="Container Loading" model="ContainerLoaded" directory="same" ContentLink='CommonGridView/GridViewMovement' tableId="container-loaded" columnSetting="container-loaded" groupLink="/movement/container/" />} /> 
                <Route path="/movement/container/container-loaded" element={<Content Title="Container Loading" model="ContainerLoaded" directory="same" ContentLink='CommonGridView/GridViewMovement' tableId="container-loaded" columnSetting="container-loaded" groupLink="/movement/container/" />} /> 
                <Route path="/movement/container/container-discharged/index" element={<Content Title="Container Discharging" model="ContainerDischarged" directory="same" ContentLink='CommonGridView/GridViewMovement' tableId="container-discharged" columnSetting="container-discharged" groupLink="/movement/container/" />} />
                <Route path="/movement/container/container-discharged" element={<Content Title="Container Discharging" model="ContainerDischarged" directory="same" ContentLink='CommonGridView/GridViewMovement' tableId="container-discharged" columnSetting="container-discharged" groupLink="/movement/container/" />} /> 
                <Route path="/movement/container/container-gate-out/index" element={<Content Title="Container Gate Out" model="ContainerGateOut" directory="same" ContentLink='CommonGridView/GridViewMovement' tableId="container-gate-out" columnSetting="container-gate-out" groupLink="/movement/container/" />} /> 
                <Route path="/movement/container/container-gate-out" element={<Content Title="Container Gate Out" model="ContainerGateOut" directory="same" ContentLink='CommonGridView/GridViewMovement' tableId="container-gate-out" columnSetting="container-gate-out" groupLink="/movement/container/" />} /> 
                <Route path="/movement/container/container-receive/index" element={<Content Title="Empty Return" model="ContainerReceive" directory="same" ContentLink='CommonGridView/GridViewMovement' tableId="container-receive" columnSetting="container-received" groupLink="/movement/container/" />} /> 
                <Route path="/movement/container/container-receive" element={<Content Title="Empty Return" model="ContainerReceive" directory="same" ContentLink='CommonGridView/GridViewMovement' tableId="container-receive" columnSetting="container-received" groupLink="/movement/container/" />} /> 
                <Route path="/movement/container/special-movement/index" element={<Content Title="Special Movement" model="SpecialMovement" directory="same" ContentLink='CommonGridView/GridViewMovement' tableId="special-movement" columnSetting="special-movement" groupLink="/movement/container/" />} />
                <Route path="/movement/container/special-movement" element={<Content Title="Special Movement" model="SpecialMovement" directory="same" ContentLink='CommonGridView/GridViewMovement' tableId="special-movement" columnSetting="special-movement" groupLink="/movement/container/" />} />
                
                {/* Purchase index view */}     
                <Route path="/purchase/purchase-order/index" element={<Content Title="Purchase Order" model="PurchaseOrder" directory="same" ContentLink='CommonGridView/GridView' tableId="purchase-order" columnSetting="purchase-order" groupLink="/purchase/" />} />     
                <Route path="/purchase/purchase-order" element={<Content Title="Purchase Order" model="PurchaseOrder" directory="same" ContentLink='CommonGridView/GridView' tableId="purchase-order" columnSetting="purchase-order" groupLink="/purchase/" />} />       

                {/* Company index view */}     
                <Route path="/company/company/index" element={<Content Title="Company" model="Company" directory="same" ContentLink='CommonGridView/GridView' tableId="company" columnSetting="company" groupLink="/company/" />} />  
                <Route path="/company/company/" element={<Content Title="Company" model="Company" directory="same" ContentLink='CommonGridView/GridView' tableId="company" columnSetting="company" groupLink="/company/" />} />                  
                <Route path="/company/company/index/CompanyType=:type" element={<Content Title="Company" model="Company" directory="same" ContentLink='CommonGridView/GridView' tableId="company" columnSetting="company" groupLink="/company/" />} />    
                <Route path="/company/terminal/index" element={<Content Title="Terminal" model="PortDetails" directory="same" ContentLink='CommonGridView/GridView' tableId="port-details" columnSetting="terminal" groupLink="/company/" />} />

                 {/* Asset index view */}     
                <Route path="/asset/container/index" element={<Content Title="Container" model="Container" directory="same" ContentLink='CommonGridView/GridView' tableId="container" columnSetting="container" groupLink="/asset/" />} />
                <Route path="/asset/container" element={<Content Title="Container" model="Container" directory="same" ContentLink='CommonGridView/GridView' tableId="container" columnSetting="container" groupLink="/asset/" />} />
                <Route path="/asset/vessel/index" element={<Content Title="Vessel" model="Vessel" directory="same" ContentLink='CommonGridView/GridView' tableId="vessel" columnSetting="vessel" groupLink="/asset/" />} />
                <Route path="/asset/vessel" element={<Content Title="Vessel" model="Vessel" directory="same" ContentLink='CommonGridView/GridView' tableId="vessel" columnSetting="vessel" groupLink="/asset/" />} />
                
                {/* Schedule index view */}     
                <Route path="/schedule/route/index" element={<Content Title="Route" model="Route" directory="same" ContentLink='CommonGridView/GridView' tableId="route" columnSetting="route" groupLink="/schedule/" />} />
                <Route path="/schedule/route" element={<Content Title="Route" model="Route" directory="same" ContentLink='CommonGridView/GridView' tableId="route" columnSetting="route" groupLink="/schedule/" />} />
                <Route path="/schedule/voyage/index" element={<Content Title="Voyage" model="Voyage" directory="same" ContentLink='CommonGridView/GridView' tableId="voyage" columnSetting="voyage" groupLink="/schedule/" />} />
                <Route path="/schedule/voyage" element={<Content Title="Voyage" model="Voyage" directory="same" ContentLink='CommonGridView/GridView' tableId="voyage" columnSetting="voyage" groupLink="/schedule/" />} />
                

                  {/* Setting index view */}     
                <Route path="/setting/general-settings/port/index" element={<Content Title="Port" model="Area" directory="same" ContentLink='CommonGridView/GridView' tableId="area" columnSetting="port" groupLink="/setting/general-settings/" />} />
                <Route path="/setting/general-settings/port" element={<Content Title="Port" model="Area" directory="same" ContentLink='CommonGridView/GridView' tableId="area" columnSetting="port" groupLink="/setting/general-settings/" />} />
                <Route path="/setting/general-settings/currency/currency-type/index" element={<Content Title="Currency Type" model="CurrencyType" directory="same" ContentLink='CommonGridView/GridView' tableId="currency-type" columnSetting="currency-type" groupLink="/setting/general-settings/currency/" />} />
                <Route path="/setting/general-settings/currency/currency-type" element={<Content Title="Currency Type" model="CurrencyType" directory="same" ContentLink='CommonGridView/GridView' tableId="currency-type" columnSetting="currency-type" groupLink="/setting/general-settings/currency/" />} />
                <Route path="/setting/general-settings/currency/currency-rate/index" element={<Content Title="Currency Rate" model="CurrencyRate" directory="same" ContentLink='CommonGridView/GridView' tableId="currency-rate" columnSetting="currency-rate" groupLink="/setting/general-settings/currency/" />} />
                <Route path="/setting/general-settings/currency/currency-rate" element={<Content Title="Currency Rate" model="CurrencyRate" directory="same" ContentLink='CommonGridView/GridView' tableId="currency-rate" columnSetting="currency-rate" groupLink="/setting/general-settings/currency/" />} />
                <Route path="/setting/general-settings/freight-term/index" element={<Content Title="Freight Term" model="FreightTerm" directory="same" ContentLink='CommonGridView/GridView' tableId="freight-term" columnSetting="freight-term" groupLink="/setting/general-settings/" />} />
                <Route path="/setting/general-settings/freight-term" element={<Content Title="Freight Term" model="FreightTerm" directory="same" ContentLink='CommonGridView/GridView' tableId="freight-term" columnSetting="freight-term" groupLink="/setting/general-settings/" />} />
                <Route path="/setting/general-settings/port-term/index" element={<Content Title="Port Term" model="PortTerm" directory="same" ContentLink='CommonGridView/GridView' tableId="port-term" columnSetting="port-term" groupLink="/setting/general-settings/" />} />
                <Route path="/setting/general-settings/port-term" element={<Content Title="Port Term" model="PortTerm" directory="same" ContentLink='CommonGridView/GridView' tableId="port-term" columnSetting="port-term" groupLink="/setting/general-settings/" />} />
                <Route path="/setting/general-settings/tax-code/index" element={<Content Title="Tax Code" model="TaxCode" directory="same" ContentLink='CommonGridView/GridView' tableId="tax-code" columnSetting="tax-code" groupLink="/setting/general-settings/" />} />
                <Route path="/setting/general-settings/tax-code" element={<Content Title="Tax Code" model="TaxCode" directory="same" ContentLink='CommonGridView/GridView' tableId="tax-code" columnSetting="tax-code" groupLink="/setting/general-settings/" />} />
                <Route path="/setting/general-settings/credit-term/index" element={<Content Title="Credit Term" model="CreditTerm" directory="same" ContentLink='CommonGridView/GridView' tableId="credit-term" columnSetting="credit-term" groupLink="/setting/general-settings/" />} />
                <Route path="/setting/general-settings/credit-term" element={<Content Title="Credit Term" model="CreditTerm" directory="same" ContentLink='CommonGridView/GridView' tableId="credit-term" columnSetting="credit-term" groupLink="/setting/general-settings/" />} />
                <Route path="/setting/company-settings/business-nature/index" element={<Content Title="Business Nature" model="BusinessNature" directory="same" ContentLink='CommonGridView/GridView' tableId="business-nature" columnSetting="business-nature" groupLink="/setting/company-settings/" />} />
                <Route path="/setting/company-settings/business-nature" element={<Content Title="Business Nature" model="BusinessNature" directory="same" ContentLink='CommonGridView/GridView' tableId="business-nature" columnSetting="business-nature" groupLink="/setting/company-settings/" />} />
                <Route path="/setting/company-settings/customer-type/index" element={<Content Title="Customer Type" model="CustomerType" directory="same" ContentLink='CommonGridView/GridView' tableId="customer-type" columnSetting="customer-type" groupLink="/setting/company-settings/" />} />
                <Route path="/setting/company-settings/customer-type" element={<Content Title="Customer Type" model="CustomerType" directory="same" ContentLink='CommonGridView/GridView' tableId="customer-type" columnSetting="customer-type" groupLink="/setting/company-settings/" />} />
                <Route path="/setting/company-settings/supplier-type/index" element={<Content Title="Supplier Type" model="SupplierType" directory="same" ContentLink='CommonGridView/GridView' tableId="supplier-type" columnSetting="supplier-type" groupLink="/setting/company-settings/" />} />
                <Route path="/setting/company-settings/supplier-type" element={<Content Title="Supplier Type" model="SupplierType" directory="same" ContentLink='CommonGridView/GridView' tableId="supplier-type" columnSetting="supplier-type" groupLink="/setting/company-settings/" />} />
                <Route path="/setting/company-settings/company-type/index" element={<Content Title="Company Type" model="CompanyType" directory="same" ContentLink='CommonGridView/GridView' tableId="company-type" columnSetting="company-type" groupLink="/setting/company-settings/" />} />
                <Route path="/setting/company-settings/company-type" element={<Content Title="Company Type" model="CompanyType" directory="same" ContentLink='CommonGridView/GridView' tableId="company-type" columnSetting="company-type" groupLink="/setting/company-settings/" />} />
                <Route path="/setting/asset-settings/container-type/index" element={<Content Title="Container Type" model="ContainerType" directory="same" ContentLink='CommonGridView/GridView' tableId="container-type" columnSetting="container-type" groupLink="/setting/asset-settings/" />} />
                <Route path="/setting/asset-settings/container-type" element={<Content Title="Container Type" model="ContainerType" directory="same" ContentLink='CommonGridView/GridView' tableId="container-type" columnSetting="container-type" groupLink="/setting/asset-settings/" />} />
                <Route path="/setting/asset-settings/cargo-type/index" element={<Content Title="Cargo Type" model="CargoType" directory="same" ContentLink='CommonGridView/GridView' tableId="cargo-type" columnSetting="cargo-type" groupLink="/setting/asset-settings/" />} />
                <Route path="/setting/asset-settings/cargo-type" element={<Content Title="Cargo Type" model="CargoType" directory="same" ContentLink='CommonGridView/GridView' tableId="cargo-type" columnSetting="cargo-type" groupLink="/setting/asset-settings/" />} />
                <Route path="/setting/asset-settings/vessel-type/index" element={<Content Title="Vessel Type" model="VesselType" directory="same" ContentLink='CommonGridView/GridView' tableId="vessel-type" columnSetting="vessel-type" groupLink="/setting/asset-settings/" />} />
                <Route path="/setting/asset-settings/vessel-type" element={<Content Title="Vessel Type" model="VesselType" directory="same" ContentLink='CommonGridView/GridView' tableId="vessel-type" columnSetting="vessel-type" groupLink="/setting/asset-settings/" />} />
                <Route path="/setting/sales-settings/u-n-number/index" element={<Content Title="UN Number" model="UNNumber" directory="same" ContentLink='CommonGridView/GridView' tableId="u-n-number" columnSetting="u-n-number" groupLink="/setting/sales-settings/" />} />
                <Route path="/setting/sales-settings/u-n-number" element={<Content Title="UN Number" model="UNNumber" directory="same" ContentLink='CommonGridView/GridView' tableId="u-n-number" columnSetting="u-n-number" groupLink="/setting/sales-settings/" />} />
                <Route path="/setting/sales-settings/h-s-code/index" element={<Content Title="HS Code" model="HSCode" directory="same" ContentLink='CommonGridView/GridView' tableId="h-s-code" columnSetting="h-s-code" groupLink="/setting/sales-settings/" />} />
                <Route path="/setting/sales-settings/h-s-code" element={<Content Title="HS Code" model="HSCode" directory="same" ContentLink='CommonGridView/GridView' tableId="h-s-code" columnSetting="h-s-code" groupLink="/setting/sales-settings/" />} />
                <Route path="/setting/sales-settings/charges-type/index" element={<Content Title="Charges Type" model="ChargesType" directory="same" ContentLink='CommonGridView/GridView' tableId="charges-type" columnSetting="charges-type" groupLink="/setting/sales-settings/" />} />
                <Route path="/setting/sales-settings/charges-type" element={<Content Title="Charges Type" model="ChargesType" directory="same" ContentLink='CommonGridView/GridView' tableId="charges-type" columnSetting="charges-type" groupLink="/setting/sales-settings/" />} />
                <Route path="/setting/sales-settings/charges/index" element={<Content Title="Charges" model="Charges" directory="same" ContentLink='CommonGridView/GridView' tableId="charges" columnSetting="charges" groupLink="/setting/sales-settings/" />} />
                <Route path="/setting/sales-settings/charges" element={<Content Title="Charges" model="Charges" directory="same" ContentLink='CommonGridView/GridView' tableId="charges" columnSetting="charges" groupLink="/setting/sales-settings/" />} />
                <Route path="/setting/sales-settings/tariff/index" element={<Content Title="Tariff" model="Tariff" directory="same" ContentLink='CommonGridView/GridView' tableId="tariff" columnSetting="tariff" groupLink="/setting/sales-settings/" />} />
                <Route path="/setting/sales-settings/tariff" element={<Content Title="Tariff" model="Tariff" directory="same" ContentLink='CommonGridView/GridView' tableId="tariff" columnSetting="tariff" groupLink="/setting/sales-settings/" />} />
                <Route path="/setting/sales-settings/receivable-method/index" element={<Content Title="Receivable Method" model="ReceivableMethod" directory="same" ContentLink='CommonGridView/GridView' tableId="receivable-method" columnSetting="receivable-method" groupLink="/setting/sales-settings/" />} />
                <Route path="/setting/sales-settings/receivable-method" element={<Content Title="Receivable Method" model="ReceivableMethod" directory="same" ContentLink='CommonGridView/GridView' tableId="receivable-method" columnSetting="receivable-method" groupLink="/setting/sales-settings/" />} />
                <Route path="/setting/user-settings/user-group/index" element={<Content Title="User Group" model="UserGroup" directory="same" ContentLink='CommonGridView/GridView' tableId="user-group" columnSetting="user-group" groupLink="/setting/user-settings/" />} />
                <Route path="/setting/user-settings/user-group" element={<Content Title="User Group" model="UserGroup" directory="same" ContentLink='CommonGridView/GridView' tableId="user-group" columnSetting="user-group" groupLink="/setting/user-settings/" />} />
                <Route path="/setting/user-settings/rule-set/index" element={<Content Title="Rule Set" model="RuleSet" directory="same" ContentLink='CommonGridView/GridView' tableId="rule-set" columnSetting="rule-set" groupLink="/setting/user-settings/" />} />
                <Route path="/setting/user-settings/rule-set" element={<Content Title="Rule Set" model="RuleSet" directory="same" ContentLink='CommonGridView/GridView' tableId="rule-set" columnSetting="rule-set" groupLink="/setting/user-settings/" />} />
                <Route path="/setting/user-settings/rule/index" element={<Content Title="Rule" model="Rule" directory="same" ContentLink='CommonGridView/GridView' tableId="rule" columnSetting="rule" groupLink="/setting/user-settings/" />} />
                <Route path="/setting/user-settings/rule" element={<Content Title="Rule" model="Rule" directory="same" ContentLink='CommonGridView/GridView' tableId="rule" columnSetting="rule" groupLink="/setting/user-settings/" />} />
                <Route path="/setting/user-settings/user/index" element={<Content Title="User" model="User" directory="same" ContentLink='CommonGridView/GridView' tableId="user" columnSetting="user" groupLink="/setting/user-settings/" />} />
                <Route path="/setting/user-settings/user" element={<Content Title="User" model="User" directory="same" ContentLink='CommonGridView/GridView' tableId="user" columnSetting="user" groupLink="/setting/user-settings/" />} />
                <Route path="/setting/g-p-export/index" element={<Content Title="Gp Export" ContentLink='Pages/GPExport/Form' header="GPExport" model="GPExport" modelLink="g-p-export" groupLink="/setting/" />} />  
                <Route path="/setting/g-p-export" element={<Content Title="Gp Export" ContentLink='Pages/GPExport/Form' header="GPExport" model="GPExport" modelLink="g-p-export" groupLink="/setting/" />} />  
                <Route path="/setting/audit-trail/index" element={<Content Title="Audit Trail" ContentLink='Pages/AuditTrail/Form' header="AuditTrail" model="AuditTrail" modelLink="audit-trail" groupLink="/setting/" />} />  
                <Route path="/setting/audit-trail" element={<Content Title="Audit Trail" ContentLink='Pages/AuditTrail/Form' header="AuditTrail" model="AuditTrail" modelLink="audit-trail" groupLink="/setting/" />} />     
               
				<Route path='*' element={<Content Title="Dashboard" ContentLink="Pages/Dashboard/Home" />} />
				
            </Routes>


        </div>
    )
}