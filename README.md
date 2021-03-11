# SurveyMonkey Apply API Demo

## **Technical Requirements**

This is a Node.js app running Express.js as its server.
You must have Node.js installed, along with npm (which should come with your node installation).

## **Running the app**

Ensure that you have a .env file with appropriate values for 
* CLIENT_ID
* CLIENT_SECRET
* REFRESH_TOKEN
* ACCESS_TOKEN

Those values can be found by logging into SMA as an admin, then settings > integrations > apply connect. Please note that the latest refresh token is needed to refresh the access token. Hence, if you refresh the tokens (locally or remotely), it will break all other instances of the app, because their refresh token will no longer be valid.

Run "npm i" at the root directory to install all dependancies
Start the server using "node app" (or nodemon if you have it globally installed).
Visit localhost:8080 in your browser.


## **Information & Limitations**

Do not run this app in Internet Explorer. Please use a modern browser.

If data isn't coming back, pressing the "refresh tokens" button might fix that.

This app consumes SMA's API. It has access via access tokens, which must be refreshed when they expire. If refreshing doesn't work, it is because the tokens were manually updated within SMA itself.

The API can get all applications across all the programs within our system, hence the disparity between the number items returned from clicking "All HCCF Apps" and "All App IDs".

The API requests can be filtered by a number of criteria, as described here.

One major shortcoming of the API is that answers to limited choice questions (e.g., radio buttons, checkboxes, dropdowns, etc) are stored as integers, and the integer is what the API sends back. For example, think of the three risk factors: unhealthy eating, physical inactivity, and tobacco use. For each application SMA stores those selections as 0, 1, and 2. It knows that 0 = unhealthy eating, 1 = physical inactivity, and 2 = tobacco use. The API doesn't send that mapping, however. It only sends the integer. It's therefore up to the consumer of the API to map out the meanings of these integers. What is worse, if the mapping changes within our system, for example we add a new risk factor, then that change must be manually tracked and changed by the API consumer (e.g., some future app leveraging this API).

The "Eligibility Stage Answers" button is slow. This is because one API call is used to get all the app IDs, and then, for each application, an API call is made to retrieve that particular application's tasks (i.e., questions ans answers). This means many calls are made sequentially, one after the other. This will get slower as more applications are added. A developer must introduce cashing to avoid slowdowns. This means storing tasks as they come back, along with their IDs and "last updated" time. Then, when a new requst comes in, check if the stored tasks were updated since last time, and only make a call for tasks when there was an update, or when the application is entirely new. Further, we can limit the API to only making calls for active applications.