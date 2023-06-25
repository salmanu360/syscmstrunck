import React from "react";
import {useEffect, useState, useContext} from "react";
import GlobalContext from "../GlobalContext";
import PodItem from "./PODListItem";

function PODForm(props) {
	const globalContext = useContext(GlobalContext);

	return (
		<>
			{globalContext.podPortCodes.map((item, index) => (
				<PodItem key={index} item={item} />
			))}
		</>
	);
}
export default PODForm;
