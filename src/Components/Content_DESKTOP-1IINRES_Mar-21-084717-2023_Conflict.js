import React, { Suspense } from 'react'
import BreadCrumb from "./Breadcrumb"



function Content(props) {
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

        
    var MyComponent;
    if (props.directory) {    
        MyComponent = React.lazy(() => retry(() => import(`./${props.ContentLink}`)))
       
    } else {
        MyComponent = React.lazy(() => retry(() => import(`../${props.ContentLink}`)))
      
    }
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

export default Content