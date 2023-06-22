import React, { useState, useEffect } from 'react'
import useBreadcrumbs from 'use-react-router-breadcrumbs';
import $ from "jquery";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
function BreadCrumb() {

  const Breadcrumbs = () => {
    const breadcrumbs = useBreadcrumbs();
    const [active, setActive] = useState("")
    useEffect(() => {
			$(".addedBreadCrumb").remove();
			if (
				$(".breadcrumb").find(".breadcrumb-item").last().find("span").text() ==
				"Index"
			) {
				$(".breadcrumb").find(".breadcrumb-item").last().addClass("d-none");
			} else {
				if (
					$(".breadcrumb")
						.find(".breadcrumb-item")
						.last()
						.find("span")
						.text()
						.includes("Id=") ||
					$(".breadcrumb")
						.find(".breadcrumb-item")
						.last()
						.find("span")
						.text()
						.includes("Splitid=")
				) {
					$(".breadcrumb").find(".breadcrumb-item").last().addClass("d-none");
				}
				$(".breadcrumb")
					.find(".breadcrumb-item")
					.each(function (key, value) {
						if ($(this).find("span").text().includes("Id=")) {
							$(this).addClass("d-none");
						}
						if ($(this).find("span").text().includes("Form")) {
							$(this).addClass("d-none");
						}
					});
			}

			$(".breadcrumb")
				.find(".breadcrumb-item")
				.find("span")
				.each(function (key, value) {
					const arr = $(value).text().split(" ");

					//loop through each element of the array and capitalize the first letter.
					for (var i = 0; i < arr.length; i++) {
						arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
					}

					$(value).text(arr.join(" "));
					// var splitted = $(value).text().match(/[A-Z][a-z]+|[0-9]+/g).join(" ")

					if ($(value).text() == "Index") {
						$(value).parent().parent().addClass("d-none");
					}
					if ($(value).text().includes("Barge")) {
						$(value).text($(value).text().replace("Barge", " "));
					}
					if ($(value).text() == "Container Gate In") {
						$(value).text("Gate In");
					}
					if (
						$(value).text() == "Transfer From Booking Reservation Data" ||
						$(value).text() == "Transfer From Quotation" ||
						$(value).text() == "Transfer From Sales Invoice"
					) {
						$(value).text("Create");
					}

					if ($(value).text() == "G P Export") {
						$(value).text("GP Export");
					}
					if ($(value).text().includes("CompanyType=")) {
						var tempName = $(value).text().replace("CompanyType=", "");
						$(value).text(tempName);
					}
					if ($(value).text() == "Merge") {
						$(value).text("Update");
					}
					if ($(value).text().includes("Type=")) {
						var tempName = $(value).text().replace("Type=", "");
						$(value).text(tempName);
						$(".breadcrumb").find(".breadcrumb-item").eq(3).addClass("d-none");
						$(".breadcrumb").find(".breadcrumb-item").eq(2).addClass("d-none");
						if (
							$(".breadcrumb")
								.find(".breadcrumb-item")
								.eq(3)
								.find("span")
								.text() == "Update"
						) {
							$(".breadcrumb").append(
								"<li className='breadcrumb-item addedBreadCrumb'>Update</li>"
							);
						} else {
						}
					}

					if ($(value).text() == "Customer Statement") {
						$(value).text("Customer Due Listing");
					}
					if ($(value).text() == "Lifting") {
						$(value).text("Volume Lifting");
					}
					if ($(value).text() == "Lifting Summary") {
						$(value).text("Volume Lifting Summary");
					}
					if ($(value).text() == "Customer Lifting") {
						$(value).text("Client Lifting");
					}
					if ($(value).text() == "Customer Lifting Summary") {
						$(value).text("Client Lifting Summary");
					}
					if ($(value).text() == "Lifting Summary") {
						$(value).text("Volume Lifting Summary");
					}
					if ($(value).text() == "Vessel Voyage Lifting") {
						$(value).text("Vessel Volume Lifting");
					}
					if ($(value).text() == "Vessel Voyage Lifting Summary") {
						$(value).text("Vessel Volume Lifting Summary");
					}
					if ($(value).text() == "Customer Payment") {
						$(value).text("Receipt");
					}
					if ($(value).text() == "Credit Note Barge") {
						$(value).text("Credit Note");
					}

					if ($(value).text() == "Document Matrix") {
						$(value).text("Sales Operation Document Matrix");
					}

					if ($(value).text() == "Container Gate Out") {
						$(value).text("Gate Out");
					}

					if ($(value).text() == "Container Release") {
						$(value).text("Release");
					}

					if ($(value).text() == "Container Receive") {
						$(value).text("Empty Return");
					}

					if ($(value).text() == "Container Loaded") {
						$(value).text("Loading");
					}

					if ($(value).text() == "Container Discharged") {
						$(value).text("Discharging");
					}

					if ($(value).text() == "Dnd") {
						$(value).text("D&D");
					}

					if ($(value).text() == "Schedule") {
						if (key !== 1) {
							$(value).text("Voyage Suggestion");
						}
					}

					if ($(value).text() == "T D R") {
						$(value).text("TDR Report");
					}
				});

			$(".breadcrumb")
				.find(".breadcrumb-item")
				.each(function (key, value) {
					if (
						$(value).find("span").text() == "Movement" ||
						$(value).find("span").text() == "Container" ||
						$(value).find("span").text() == "Report" ||
						$(value).find("span").text() == "Operation" ||
						$(value).find("span").text() == "Asset" ||
						$(value).find("span").text() == "Company Settings" ||
						$(value).find("span").text() == "General Settings" ||
						$(value).find("span").text() == "User Settings" ||
						$(value).find("span").text() == "Asset Settings" ||
						$(value).find("span").text() == "Purchase" ||
						$(value).find("span").text() == "Schedule" ||
						$(value).find("span").text() == "Setting" ||
						$(value).find("span").text() == "General settings" ||
						$(value).find("span").text() == "Currency" ||
						$(value).find("span").text() == "Company settings" ||
						$(value).find("span").text() == "Asset settings" ||
						$(value).find("span").text() == "Sales settings" ||
						$(value).find("span").text() == "Standard" ||
						$(value).find("span").text() == "Profile" ||
						$(value).find("span").text() == "User settings" ||
						$(value).find("span").text() == "Sales Settings" ||
						$(value).find("span").text() == "Transfer From Quotation" ||
						$(value).find("span").text() == "Sales" ||
						$(value).find("span").text() == "Company" ||
						$(value).find("span").text() == "Update" ||
						$(value).find("span").text() == "Create"
					) {
						$(value).addClass("disableHref");
						$(value).find("span").addClass("disableHref");
					}
				});
			// var length= $(".breadcrumb").find(".breadcrumb-item").length
			// console.log(length)
			// $(".breadcrumb").find(".breadcrumb-item").each(function (key, value) {
			//  if(length!=3){
			//   if(key!==0 && key<length-1){
			//     console.log('jiju')
			//     $(value).children().removeAttr("href")
			//     $(value).children().addClass("disableRef")
			//   }
			//  }

			// })

			//  $(".breadcrumb").append('<li className="breadcrumb-item"><a href="/ogps/view/Unit/GridView"><span>Grid View232323</span></a></li>')

			// $(".main-header").find(".dropdown-item").each(function (key, value) {
			//   // console.log($(value).text())
			//    console.log($(value).attr("href"))
			// })

			return () => {};
		}, [breadcrumbs])
    return (
      <>
        {breadcrumbs.map(({

          match,
          breadcrumb

        }) => (

          <li key={match.pathname} className="breadcrumb-item">
            {/* {console.log(match.pathname)} */}
            <Link to={match.pathname}>{breadcrumb}</Link>

          </li>

        ))}
      </>
    );
  }



  return (
    <Breadcrumbs />
  )
}

export default BreadCrumb
