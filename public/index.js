const orderedList = document.getElementById("ordered-list");
const container = document.getElementById("container");
const loader = document.getElementById("loader");
const errorBox = document.getElementById("errorBox");
const info = document.getElementById("info");

const endpointError = status => {
	errorBox.classList.remove("hidden");
	errorBox.innerHTML += `Looks like there was a problem. Status Code: ' ${status}`;
	console.log(`Looks like there was a problem. Status Code: ' ${status}`);
};

const resetAll = () => {
	errorBox.innerHTML = "";
	errorBox.classList.add("hidden");
	loader.classList.add("hidden");
	info.classList.add("hidden");
	orderedList.innerHTML = "";
	container.innerHTML = "";
};

const toggleLoader = () => {
	loader.classList.contains("hidden") ? loader.classList.remove("hidden") : loader.classList.add("hidden");
};

const getAllApps = () => {
	resetAll();
	// implement loader while waiting
	toggleLoader();
	fetch("/api/all-apps")
		.then(function (response) {
			toggleLoader();
			// clear all errors and the loading element
			if (response.status !== 200) {
				endpointError(response.status);
				return;
			}
			// Examine the text in the response
			response.json().then(function (data) {
				data.forEach(app => {
					let appCard = document.createElement("LI");
					appCard.setAttribute("data-id", app.id);
					appCard.classList.add("app-preview");
					appCard.innerHTML += `<b>id:</b> ${app.id} | `;
					appCard.innerHTML += `<b>applicant's first name:</b> ${app.applicant.first_name} | `;
					appCard.innerHTML += `<b>created at:</b> ${app.created_at}`;
					appCard.addEventListener("click", function () {
						singleApp(this.getAttribute("data-id"));
					});
					orderedList.appendChild(appCard);
				});
				let info = document.createElement("DIV");
				info.innerHTML = "<p>Click on an application for further details</p>";
				orderedList.appendChild(info);
				// console.log(data); logging this will reveal email addresses & names; not for production use
			});
		})
		.catch(function (err) {
			console.log("Fetch Error", err);
		});
};

const singleApp = id => {
	resetAll();
	// implement loader while waiting
	toggleLoader();
	fetch(`/api/single-app/${id}`)
		.then(function (response) {
			toggleLoader();
			if (response.status !== 200) {
				endpointError(response.status);
				return;
			}
			// Examine the text in the response
			response.json().then(function (data) {
				let appCard = document.createElement("DIV");
				appCard.classList.add("single-app");
				appCard.innerHTML += `<b>ID:</b> ${data.id}` + "<br/>";
				appCard.innerHTML += `<b>Program:</b> ${data.program.name}` + "<br/>";
				appCard.innerHTML += `<b>Application Title:</b> ${data.title}` + "<br/>";
				appCard.innerHTML += `<b>Applicant's first name:</b> ${data.applicant.first_name}` + "<br/>";
				appCard.innerHTML += `<b>Current stage:</b> ${data.current_stage.title}` + "<br/>";
				appCard.innerHTML += `<b>Status:</b> ${data.status.name}` + "<br/>";
				appCard.innerHTML += `<b>Weighted Score:</b> ${data.weighted_score}` + "<br/>";
				appCard.innerHTML += `<b>Created at:</b> ${data.created_at}` + "<br/>";
				appCard.innerHTML += `<b>Last submitted at:</b> ${data.last_submitted}` + "<br/>";
				container.appendChild(appCard);
			});
		})
		.catch(function (err) {
			console.log("Fetch Error", err);
		});
};

const refreshTokens = () => {
	// implement loader while waiting
	toggleLoader();
	fetch("/api/refresh")
		.then(function (response) {
			toggleLoader();
			if (response.status !== 200) {
				endpointError(response.status);
				return;
			}
			// Examine the text in the response
			response.json().then(function (data) {
				// it should be fine to log these, as the client ID & secret are hidden within the .env, but I have removed logging just in case
				// console.log(data);
			});
		})
		.catch(function (err) {
			console.log("Fetch Error", err);
		});
};

const getAllIds = () => {
	resetAll();
	// implement loader while waiting
	toggleLoader();
	fetch("/api/all-app-ids")
		.then(function (response) {
			toggleLoader();
			if (response.status !== 200) {
				endpointError(response.status);
				return;
			}
			// Examine the text in the response
			response.json().then(function (data) {
				data.forEach(id => {
					let appCard = document.createElement("LI");
					appCard.setAttribute("data-id", id);
					appCard.classList.add("id");
					appCard.innerHTML += `<b>id:</b> ${id}`;
					orderedList.appendChild(appCard);
				});
				// return data;
			});
		})
		.catch(function (err) {
			console.log("Fetch Error", err);
		});
};

const singleAppTasks = id => {
	resetAll();
	// implement loader while waiting
	toggleLoader();
	fetch(`/api/single-app/${id}/tasks`)
		.then(function (response) {
			toggleLoader();
			if (response.status !== 200) {
				endpointError(response.status);
				return;
			}
			// Examine the text in the response
			response.json().then(function (data) {
				console.log(data);
			});
		})
		.catch(function (err) {
			console.log("Fetch Error", err);
		});
};

const getAllTasks = () => {
	resetAll();
	// implement loader while waiting
	toggleLoader();
	let totalRequestedFunding = 0;
	let totalMonths = 0;
	const questionMap = {
		riskFactors: "7ZXEJeHBpw",
		projectDuration: "hIftbNILRJ",
		requestedFunding: "hJE5DH67E7"
	};
	const riskFactorMap = {
		0: "physicalInactivity",
		1: "unhealthyEating",
		2: "tobaccoUse"
	};
	let riskFactorTotals = {
		physicalInactivity: 0,
		unhealthyEating: 0,
		tobaccoUse: 0
	};
	//   const locationMap = {
	//     0: "2",
	//     1: "2",
	//     2: ""
	//   };
	//   let locationTotals = {
	//     AB: 0,
	//     BC: 0,
	//     MB: 0,
	//     NB: 0,
	//     NL: 0,
	//     NS: 0,
	//     NT: 0,
	//     NU: 0,
	//     ON: 0,
	//     PE: 0,
	//     QC: 0,
	//     SK: 0,
	//     YT: 0
	//   };
	fetch(`/api/all-apps-tasks`)
		.then(function (response) {
			toggleLoader();
			if (response.status !== 200) {
				endpointError(response.status);
				return;
			}
			// Examine the text in the response
			response.json().then(function (apps) {
				apps.forEach(app => {
					// check that the application isn't empty, and that completed_at for the eligibility quiz is set to any truthy value (it defaults to null)
					if (app[0] && app[0].completed_at) {
						totalMonths += parseInt(app[0].data[questionMap.projectDuration].response);
						totalRequestedFunding += parseInt(app[0].data[questionMap.requestedFunding].response);
						console.log(app[0].data[questionMap.riskFactors].response);
						app[0].data[questionMap.riskFactors].response.forEach(riskFactor => {
							switch (riskFactor) {
								case 0:
									riskFactorTotals.physicalInactivity++;
									break;
								case 1:
									riskFactorTotals.unhealthyEating++;
									break;
								case 2:
									riskFactorTotals.tobaccoUse++;
									break;
							}
						});
					}
				});
				let appCard = document.createElement("DIV");
				appCard.classList.add("id");
				appCard.innerHTML += `<h2>Total funding requested:</h2> $${totalRequestedFunding}`;
				appCard.innerHTML += `<h2>Average project duration:</h2> ${Math.floor(totalMonths / apps.length)} months`;
				appCard.innerHTML += `<h2>Risk factor tally:</h2> <ul><li>Physical inactivity: ${riskFactorTotals.physicalInactivity}</li> <li>Unhealthy eating: ${riskFactorTotals.unhealthyEating}</li> <li>Tobacco Use: ${riskFactorTotals.tobaccoUse} </li></ul>`;
				container.appendChild(appCard);
				console.log(apps);
			});
		})
		.catch(function (err) {
			console.log("Fetch Error", err);
		});
};

const toggleInfo = () => {
	info.classList.contains("hidden") ? info.classList.remove("hidden") : info.classList.add("hidden");
};
