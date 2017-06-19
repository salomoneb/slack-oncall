// See https://github.com/google/google-api-nodejs-client#making-authenticated-requests
const google = require("googleapis")
const request = require("request")
const moment = require("moment")
const env = require("dotenv").config()

const OAuth2 = google.auth.OAuth2
let date = new Date()

// Set calendar client secrets
let oauth2Client = new OAuth2(
 process.env.GOOGLE_CLIENT_ID,
 process.env.GOOGLE_CLIENT_SECRET, 
 process.env.GOOGLE_REDIRECT_URI
)

// Set calendar access
oauth2Client.setCredentials({
	access_token: process.env.GOOGLE_ACCESS_TOKEN,
	refresh_token: process.env.GOOGLE_REFRESH_TOKEN, 
  expiry_date: "2537485835"
})

// Instantiate and authorize calendar
let calendar = google.calendar({
  version: "v3",
  auth: oauth2Client
})

// Return calendar data we need as promise
let schedules = new Promise ((resolve, reject) => {
  calendar.events.list({
    calendarId: process.env.GOOGLE_CALENDAR_ID, 
    timeMin: date.toISOString(), 
    singleEvents: true,
    orderBy: "startTime" 
  }, (err, response) => {
    let calData = response.items
    let values = calData.map(function(item) {
      let info = {
        "name": item.description,
        "start": moment(item.start.dateTime, moment.ISO_8601).format("dddd, MMMM Do, h:mm A"),
        "end": moment(item.end.dateTime, moment.ISO_8601).format("dddd, MMMM Do, h:mm A"),
      } 
      return info
    })
    console.log(values)
    resolve(values)
  }) 
})
exports.schedules = schedules
