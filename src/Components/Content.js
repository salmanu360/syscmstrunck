import React, { Suspense,useContext,useEffect,useState } from 'react'
import BreadCrumb from "./Breadcrumb"
import { ControlOverlay } from './Helper.js'
import GlobalContext from "./GlobalContext"
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useParams,
    Link,
    useNavigate
  } from "react-router-dom"



function Content(props) {

    const globalContext = useContext(GlobalContext);
    const [viewAccess, setViewAcess] = useState("")
    const [loading, setLoading] = useState(true)
    const params = useParams();
    const url=window.location.href;
    var tempModel;
    function retry(fn, retriesLeft = 5, interval = 1000) {
        return new Promise((resolve, reject) => {
          fn()
            .then(resolve)
            .catch((error) => {
              setTimeout(() => {
                if (retriesLeft === 1) {
                  // reject('maximum retries exceeded');
                  reject(error);
                  return;
                }
      
                // Passing on "reject" is the important part
                retry(fn, retriesLeft - 1, interval).then(resolve, reject);
              }, interval);
            });
        });
    }

    useEffect(() => {
      
        if(props.modelLink){
            if(props.modelLink == "company"){
                params.type ? tempModel = params.type.toLowerCase() : tempModel = props.modelLink
            }else{
                tempModel = props.modelLink
            }
        }else{
            if(props.columnSetting == "company"){             
                params.type ? tempModel = params.type.toLowerCase() : tempModel = props.columnSetting
            }else{
                tempModel = props.columnSetting
            }
        } 
        if(props.Title!=="Dashboard"){
            if (globalContext.userRule !== "") {
                const objRule = JSON.parse(globalContext.userRule);
                if(tempModel=="terminal"){
                    tempModel="port-details"
                }
                 if(tempModel=="port"){
                    tempModel="area"
                }
                if(tempModel=="g-p-export"){
                    tempModel="gp-export"
                }
                if(tempModel=="credit-note" ||tempModel=="debit-note" || tempModel=="debit-note-barge" || tempModel=="credit-note-barge" ){
                    tempModel=`sales-${tempModel}`
                }
                if(tempModel=="VoyageSuggestion"){
                    tempModel=`schedule`
                }
                if(tempModel=="t-d-r"){
                    tempModel=`tdr-report`
                }
                if(tempModel=="container-received"){
                    tempModel=`container-receive`
                }
                if(tempModel=="u-n-number"){
                    tempModel=`un-number`
                }
                if(tempModel=="h-s-code"){
                    tempModel=`hs-code`
                }
                if(tempModel=="change-password"){
                    tempModel=`site-change-password`
                }
                if(tempModel=="terminal handler" || tempModel=="box operator" || tempModel=="ship operator"){
                    tempModel= tempModel.replace(" ","-")
                }
         
                if(url.includes("transfer-from-quotation")){

                    var filteredAp = objRule.Rules.filter(function (item) {
                        return item.includes(tempModel) || item.includes("booking-reservation");
                      });
                      var viewAccess= filteredAp.find((item)=>item==`create-${tempModel}`)!== undefined

                }else if(url.includes("transfer-from-booking-reservation-data") || url.includes("split") ||  url.includes("transfer-from-sales-invoice") || url.includes("create")){

                    // if(tempModel=="container-release-order"){
                        var filteredAp = objRule.Rules.filter(function (item) {
                            return item.includes(tempModel);
                          });
                          var viewAccess= filteredAp.find((item)=>item==`create-${tempModel}`)!== undefined

                          if(!viewAccess){
                            ControlOverlay(false)
                          }
                   // }
                  

                }
                else if(url.includes("profile")){
                    var filteredAp = objRule.Rules.filter(function (item) {
                        return item.includes(tempModel);
                      });
                      var viewAccess= filteredAp.find((item)=>item==`view-user-profile`)!== undefined
                }
                else{            
                    var filteredAp = objRule.Rules.filter(function (item) {
                        return item.includes(tempModel);
                    });
                    var viewAccess= filteredAp.find((item)=>item==`view-${tempModel}`)!== undefined
                }
              
                
                if(props.model == "Rule"){
                    viewAccess= true;
                }
               setViewAcess(viewAccess)
               setLoading(false)
              }
        }else{
            setViewAcess(true)
            setLoading(false)
        }
    
      return () => {
        
      }
    }, [props])

    var MyComponent;
    if (props.directory) {    
        MyComponent = React.lazy(() => retry(() => import(`./${props.ContentLink}`)))
       
    } else {
        MyComponent = React.lazy(() => retry(() => import(`../${props.ContentLink}`)))
      
    }

    function normalContent(){
        return (

            <div className="content-wrapper">
            <section className="content-header">



                <div class="content-header">
                    <div class="container-fluid">
                        <div class="row mb-2">
                            <div class="col-sm-6">
                                <h1 class="m-0 text-dark ContentTitle">
                                    {props.Title}
                                </h1>
                            </div>
                            <div class="col-sm-6">
                                <ol className="breadcrumb float-sm-right"><BreadCrumb /></ol>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
            <section class="content">
                <Suspense>
           
                    <MyComponent data={props}/>
                </Suspense>

            </section>

        </div>
        )
    }

    function forbiddenContent(){
        return (

            <div className="content-wrapper">
            <section className="content-header">
            </section>
            <section class="content">
            <div class="redBG">
                <h1 class="access_forbidden"><b>You are not allowed to access this Page</b></h1>
                <h4 style={{"textAlign":"center"}}>Please check your User Permissions..</h4></div>

            </section>

        </div>
        )
    }

    function loadingContent(){
        return (

            <div className="content-wrapper">
            <section className="content-header">
            </section>
            <section class="content">
            <div class="redBG">
              
              
            </div>

            </section>

        </div>
        )
    }
    return (
        <>   
              
             {loading?loadingContent():viewAccess?normalContent():forbiddenContent()}
          
        
        </>
   
        
        
    )
}

export default Content