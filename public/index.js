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
					appCard.innerHTML += `<i class="fas fa-user"></i> <b>id:</b> ${app.id} | `;
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
	let orgNum = null;
	const questionMap = {
		riskFactors: "7ZXEJeHBpw",
		projectDuration: "hIftbNILRJ",
		requestedFunding: "hJE5DH67E7",
		orgType: "P8k5AmOdI8"
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
	const orgMap = {
		0: "notForProfit",
		1: "unincorporated",
		2: "govAgency",
		3: "provGovInst",
		4: "indigenous",
		5: "privateSector"
	};
	let orgTotals = {
		notForProfit: 0,
		unincorporated: 0,
		govAgency: 0,
		provGovInst: 0,
		indigenous: 0,
		privateSector: 0
	}
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
					// console.log(app);
					// check that the application isn't empty, and that completed_at for the eligibility quiz is set to any truthy value (it defaults to null)
					if (app[0] && app[0].completed_at) {
						totalMonths += parseInt(app[0].data[questionMap.projectDuration].response);
						totalRequestedFunding += parseInt(app[0].data[questionMap.requestedFunding].response);
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
						orgNum = app[0].data[questionMap.orgType].response;
						console.log(orgMap[orgNum]);
						orgTotals[orgMap[orgNum]] += 1;
					}
				});
				// 0: "Not-For-Profit Organization",
				// 1: "Unincorporated Group",
				// 2: "Government Agency",
				// 3: "Province/Territory Government Supported Institution",
				// 4: "Indigenous Organization",
				// 5: "Private-Sector Organization"
				let appCard = document.createElement("DIV");
				appCard.classList.add("id");
				appCard.innerHTML += `<span class="title">Total funding requested:</span> <span class="stats">$${totalRequestedFunding}</span> <br/><br/>`;
				appCard.innerHTML += `<span class="title">Average project duration:</span> <span class="stats">${Math.floor(totalMonths / apps.length)} months</span>`;
				appCard.innerHTML += `<h2>Risk factor tally:</h2> <div id="risk-container"><div class="risk"><i class="fas fa-couch"></i> Physical inactivity: ${riskFactorTotals.physicalInactivity}</div> <div class="risk"><i class="fas fa-hamburger"></i> Unhealthy eating: ${riskFactorTotals.unhealthyEating}</div> <div class="risk"><i class="fas fa-smoking"></i> Tobacco Use: ${riskFactorTotals.tobaccoUse} </div></div>`;
				appCard.innerHTML += `<h2>Organizations:</h2> <div id="org-container"><div class="org"><i class="fas fa-hands-helping"></i> Not-For-Profit Organization: ${orgTotals.notForProfit}</div> <div class="org"><i class="fas fa-users"></i> Unincorporated Group: ${orgTotals.unincorporated}</div> <div class="org"><i class="fab fa-canadian-maple-leaf"></i> Government Agency: ${orgTotals.govAgency} </div> <div class="org"><i class="fas fa-school"></i> Provincial Insitution: ${orgTotals.provGovInst} </div> <div class="org"><i class="fab fa-pagelines"></i> Indigenous Organization: ${orgTotals.indigenous} </div> <div class="org"><i class="fas fa-building"></i> Private Sector: ${orgTotals.privateSector} </div></div>`;
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
