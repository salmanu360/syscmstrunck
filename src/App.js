import React, { useState, useEffect,useContext } from "react";
import Footer from "./Components/Footer";
import NavBar from "./Components/NavBar";
import Login from "./Pages/Login/Login"
import "./Assets/css/index.css";
import $ from "jquery"
import GlobalContext from "./Components/GlobalContext"
import { ToastContainer, toast } from 'react-toastify';
import {getUserRules,GetUser } from './Components/Helper.js'

import 'react-toastify/dist/ReactToastify.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  json
} from "react-router-dom";

import "./Assets/css/App.css"




function App() {
  const navigate=useNavigate();
  const globalContext = useContext(GlobalContext);

  const customStyles = {
    control: base => ({
       ...base,
       minHeight: 30
    }),
    dropdownIndicator: base => ({
       ...base,
       padding: 4
    }),
    clearIndicator: base => ({
       ...base,
       padding: 4
    }),

    valueContainer: base => ({
       ...base,
       padding: '0px 6px'
    }),
    input: base => ({
       ...base,
       margin: 0,
       padding: 0
    }),
 };

 const customStylesReadonly = {
  control: base => ({
     ...base,
     background: "#e9ecef",
     minHeight: 30
  }),
  dropdownIndicator: base => ({
     ...base,
     padding: 4
  }),
  clearIndicator: base => ({
     ...base,
     padding: 4
  }),

  valueContainer: base => ({
     ...base,
     padding: '0px 6px'
  }),
  input: base => ({
     ...base,
     margin: 0,
     padding: 0
  })
  

};

  // const globalHost = "http://syscms1.infollective.com"
  const globalHost = "http://192.168.1.23:81"
  const globalPathLink="/syscms/backend/api/"
  // const globalPathLink="/application/backend/api/"
 
  const [token, setToken] = useState(localStorage.getItem('authorizeInfos'));
  const [profileImage, setProfileImage] = useState("")
  const asyncSelectPlaceHolder="Type to search"
  const [userRule, setUserRule] = useState("")
  const [userPort, setUserPort] = useState("")
  const [userId, setUserId] = useState("");
	const [podPortCodes, setPodPortCodes] = useState([]);

	useEffect(() => {
		console.log("POD PORT Numbers", podPortCodes);
	}, [podPortCodes]);

	//listen to localstorage change, log in /out all tab
	window.addEventListener("storage", (event) => {
		if (event.key == "authorizeInfos") {
			if (event.newValue == null) {
				setToken(null);
				navigate("/Login");
			} else {
				var parseInfo = JSON.parse(event.newValue);

				setToken(parseInfo);
				navigate("/");
			}
		}
	});

	useEffect(() => {
		$("body").addClass(
			"hold-transition  layout-navbar-fixed  layout-top-nav  text-sm"
		);

		return () => {};
	}, []);

	const authInfo = JSON.parse(localStorage.getItem("authorizeInfos"));

	useEffect(() => {
		if (authInfo) {
			$.ajax({
				type: "POST",
				url: globalHost + globalPathLink + "site/check-access-token",
				dataType: "json",
				headers: {
					Authorization:
						"Basic " + btoa(authInfo.username + ":" + authInfo.access_token),
				},
				success: function (data) {
					setProfileImage(data.data.image);
					setUserId(data.data.id);

					GetUser(data.data.id, {
						globalHost,
						authInfo,
						customStyles,
						customStylesReadonly,
						profileImage,
						globalPathLink,
					}).then((res) => {
						setUserPort(res[0]["Branch"]["PortCode"]);
					});
					getUserRules(data.data.id, {
						globalHost,
						authInfo,
						customStyles,
						customStylesReadonly,
						profileImage,
						globalPathLink,
					}).then((res) => {
						setUserRule(JSON.stringify(res.data));
					});
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					setToken(null);
					localStorage.removeItem("authorizeInfos");
					navigate("/Login");
				},
			});
		}

		return () => {};
	}, [authInfo]);

	//  useEffect(() => {
	//   console.log(userId)
	//   if(userId){
	//     getUserRules(userId,{ globalHost,authInfo,customStyles,customStylesReadonly,profileImage,globalPathLink}).then(res => {
	//       setUserRule(JSON.stringify(res.data))
	//       })

	//   }

	//    return () => {

	//    }
	//  }, [userId])

	useEffect(() => {
		$("body").addClass(
			"hold-transition  layout-navbar-fixed  layout-top-nav  text-sm"
		);

		return () => {};
	}, []);

	if (token == null) {
		return (
			<GlobalContext.Provider
				value={{
					globalHost,
					authInfo,
					customStyles,
					customStylesReadonly,
					userPort,
					profileImage,
					userRule,
					globalPathLink,
					asyncSelectPlaceHolder,
					// NEW CODE FOR POD PORT SEARCH
					podPortCodes,
					setPodPortCodes,
				}}>
				<Login setToken={setToken} />
			</GlobalContext.Provider>
		);
	} else {
		return (
			<GlobalContext.Provider
				value={{
					globalHost,
					authInfo,
					customStyles,
					customStylesReadonly,
					userPort,
					profileImage,
					userRule,
					globalPathLink,
					asyncSelectPlaceHolder,
					setToken,
					// NEW CODE FOR POD PORT SEARCH
					podPortCodes,
					setPodPortCodes,
				}}>
				<div className='wrapper'>
					<div className='PageOverlay d-none'>
						{" "}
						<div className='PageSpinner'>
							<i className='fas fa-3x fa fa-spinner fa-spin'></i>
							<p className='loadingText'>
								<b>Loading</b>
							</p>
						</div>
					</div>
					<NavBar token={token} setToken={setToken} />

					<Footer />
					<ToastContainer />
				</div>
			</GlobalContext.Provider>
		);
	}


}




export default App