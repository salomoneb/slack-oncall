"use strict"
const cal = require("./googleAuth.js")
const temps = require("./templates.js")
const rp = require("request-promise")

const Functions = {}

// Retrieves and routes Google calendar data based on user input
Functions.handleCases = function(appRequest, appResponse) {
  appResponse.sendStatus(204)
  
  let schedulePromise = cal.schedules

  // appResponse.status(200).json({
  //   "text": "Fetching schedules..."
  // })

  let userParameter = appRequest.body.text

  return schedulePromise.then((promiseValue, error) => {
    switch(userParameter) {
      case promiseValue.length === 0:
        appResponse.send("Sorry, there's nobody scheduled right now.")
        break;
      // If the person only enters the command, give them the first result
      case "":
        return [promiseValue[0]]
        break;
      // Shows the next person on call (second item in the Google calendar results)
      case "next":
        return [promiseValue[1]]
        break;
      case "help": 
        return Functions.showHelp(appResponse, error)
        break;
      default:
        return Functions.personSchedule(promiseValue, userParameter, appResponse)
    }
  })
}

// Gets the correct Google data if someone types in a first name
Functions.personSchedule = function(promiseValue, userParameter, appResponse) {
  let scheduleArr = []
  // For each person in the Google calendar data
  promiseValue.forEach((item) => {
    let firstName = item.name.toLowerCase().split(" ")
    if (firstName[0] === userParameter.toLowerCase()) {
      scheduleArr.push(item)
    }
  })
  return scheduleArr
}

// Retrieves Slack data for user images and colors
Functions.getSlackData = function(googleData, error) {
  // Call Slack API for list of users
  return rp({
    url: "https://slack.com/api/users.list/", 
    qs: {
      token: process.env.SLACK_OAUTH_TOKEN
    },
    json: true
  }).then( (slackData) => {
    // Slack users contained in Members array
    let slackPersonInfo = slackData.members
    // For each Slack user name
    for (var i = 0; i < slackPersonInfo.length; i++) {
      // Make sure person hasn't been deleted
      if (slackPersonInfo[i].deleted === false) {
        for (var j = 0; j < 1; j++) {    
          let googleName = googleData[j].name.toLowerCase()
          if (slackName === googleName) {
            googleData[j].image_url = slackPersonInfo[i].profile.image_72
            googleData[j].color = slackPersonInfo[i].color  
          }
        }
      }
      let slackName = slackPersonInfo[i].profile.real_name.toLowerCase()
      // Loop through the Google cal results to compare the name
    }
    return googleData
  })
}

// Renders regular message template
Functions.renderMessageTemplate = function(users) {
  let messageTemplate = temps.messageTemplate
  messageTemplate.attachments[0]["text"] = ""
  messageTemplate.attachments[0]["image_url"] = users[0].image_url
  messageTemplate.attachments[0]["title"] = users[0].name
  messageTemplate.attachments[0]["color"] = "#" + users[0].color

  for (var i = 0; i < users.length; i++) {
    messageTemplate.attachments[0]["text"] = messageTemplate.attachments[0].text.concat("*Start:* " + users[i].start + "\n" + "*End:* " + users[i].end + "\n\n")
  }
  return messageTemplate
}

// Posts our message to Slack - uses delayed response webhook so app doesn't timeout https://api.slack.com/slash-commands
Functions.postToSlack = function(appRequest, appResponse, messageTemplate) {
  rp({
    url: appRequest.body.response_url,
    body: messageTemplate,
    json: true,
    method: "POST"
  })
  .then(() => {
    appResponse.end()
  })
}

// Handles when people type in "help"
Functions.showHelp = function(appResponse) {
  let helpTemplate = temps.helpTemplate
  let helpPromise = new Promise((resolve, reject) => {
    resolve(helpTemplate)
  })
  return helpPromise.then((data) => {
    appResponse.json(data)
    throw new Error("Getting help...")
  })
}

// Handles errors and when people ask for help
Functions.errorHandler = function(error, appResponse) {
  console.log("Error: " + error)
  console.log("Error message: " + error.message)
  switch(error.message) {
    case "Cannot read property 'name' of undefined":
      appResponse.send("Sorry, I didn't recognize that name. Please enter the first name of a CS staff member.")
      break;
    case "Timeout was reached":
      appResponse.send("Fetching schedules...")
      break;  
    case "Getting help...":
      console.log("Got help!")
      break;
    default:
      appResponse.send("Whoops, there was an error. You should tell @salomoneb.")
  }
}

module.exports = Functions