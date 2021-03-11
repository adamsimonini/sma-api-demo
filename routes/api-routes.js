/*The HCCF program's integer code: 224917*/
const got = require("got");
const dotenv = require("dotenv");
var request = require("request");
var fs = require("fs");

dotenv.config();
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
let refresh_token = process.env.REFRESH_TOKEN;
let access_token = process.env.ACCESS_TOKEN;

// integers for various SMA stages
const stages = {
  eligibility: 579439,
  asf: 579442,
  asfReview: 579445,
  reporting: 550171
};

const allApplications = async (req, res) => {
  try {
    // https://msp-phac.smapply.io/api/applications/
    // 107437110 17806957
    // `https://hccf-fscc.smapply.ca/api/applications?current_stage=${stages.asfReview}`
    const result = await got.get(`https://hccf-fscc.smapply.ca/api/applications?program=224917`, {
      responseType: "json",
      // curl -H "Authorization: Bearer <ACCESS_TOKEN>" <YOUR_SITE>/api/
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    const applications = result.body.results;
    res.json(applications);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const getAllIds = async (req, res) => {
  try {
    // https://connect.smapply.io/pages/resources.html#applications
    // Query parameters can be provided within the URL, one of which is the application's state, where 0 = active
    const result = await got.get("https://hccf-fscc.smapply.ca/api/applications", {
      responseType: "json",
      // curl -H "Authorization: Bearer <ACCESS_TOKEN>" <YOUR_SITE>/api/
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    let allIds = result.body.results.map(app => app.id);
    res.json(allIds);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const singleApplication = async (req, res) => {
  try {
    // https://msp-phac.smapply.io/api/applications/
    // 107437110 17806957
    const result = await got.get(`https://hccf-fscc.smapply.ca/api/applications/${req.params.id}`, {
      responseType: "json",
      // curl -H "Authorization: Bearer <ACCESS_TOKEN>" <YOUR_SITE>/api/
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    const body = result.body;
    res.json(body);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const singleAppTasks = async (req, res) => {
  try {
    // https://msp-phac.smapply.io/api/applications/
    // 107437110 17806957
    const result = await got.get(
      `https://hccf-fscc.smapply.ca/api/applications/${req.params.id}/tasks`,
      {
        responseType: "json",
        // curl -H "Authorization: Bearer <ACCESS_TOKEN>" <YOUR_SITE>/api/
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );
    const body = result.body;
    res.json(body);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const getAllTasks = async (req, res) => {
  let tasks = [];
  try {
    // https://connect.smapply.io/pages/resources.html#applications
    // Query parameters can be provided within the URL, one of which is the application's state, where 0 = active
    const result = await got.get(
      `https://hccf-fscc.smapply.ca/api/applications?program=224917`,
      {
        responseType: "json",
        // curl -H "Authorization: Bearer <ACCESS_TOKEN>" <YOUR_SITE>/api/
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );
    let allIds = result.body.results.map(app => app.id);

    for (const id of allIds) {
      const task = await got.get(`https://hccf-fscc.smapply.ca/api/applications/${id}/tasks`, {
        responseType: "json",
        // curl -H "Authorization: Bearer <ACCESS_TOKEN>" <YOUR_SITE>/api/
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });
      tasks.push(task.body.results)
    }
    res.json(tasks);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

// refresh the api tokens, specifically the refresh and access tokens
const refreshTokens = async (req, res) => {
  try {
    console.log(`old refresh token: ${refresh_token}`);
    console.log(`old access token: ${access_token}`);
    var options = {
      method: "POST",
      url: "https://hccf-fscc.smapply.ca/api/o/token/",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: "sessionid=oawurvgmdftc04g2593mtsjahdaigyn5"
      },
      form: {
        client_id: client_id,
        client_secret: client_secret,
        refresh_token: refresh_token,
        grant_type: "refresh_token"
      }
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      const data = JSON.parse(response.body);
      // console.log(data);
      // console.log(`new refresh token: ${data.refresh_token}`);
      // console.log(`new access token: ${data.access_token}`);

      refresh_token = data.refresh_token;
      access_token = data.access_token;

      const envData = `CLIENT_ID=${client_id}\nCLIENT_SECRET=${client_secret}\nREFRESH_TOKEN=${refresh_token}\nACCESS_TOKEN=${access_token}`;
      fs.writeFile(".env", envData, err => {
        if (err) throw err;
        console.log(".env variables changed!");
      });
      res.json(data);
    });
    // explicitly reassign tokens to .evn counterparts after making POST request
    refresh_token = process.env.REFRESH_TOKEN;
    access_token = process.env.ACCESS_TOKEN;
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

module.exports = {
  allApplications,
  singleApplication,
  refreshTokens,
  getAllIds,
  singleAppTasks,
  getAllTasks
};
