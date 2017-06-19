const bodyParser = require('body-parser')
const express = require("express")

const app = express()
const port = process.env.PORT || 8080
  
let date = new Date()
let currentDate = Date.parse(date)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
 
app.get('/', (req, res) => {
  res.send("All working")
})

app.post("/cs-slack", (req,res) => {
  const funcs = require("./functions.js")
  if (req.body.token !== process.env.SLACK_TOKEN) {
    res.send("Sorry, there was an error authenticating.")
    return
  }
  
  funcs.handleCases(req, res)
  .then((data, error) => {
    return funcs.getSlackData(data, error)
  })
  .then((users) => {
    return funcs.renderMessageTemplate(users)
  })
  .then((messageTemplate) => {
    funcs.postToSlack(req, res, messageTemplate)
  })
  .catch((error) => {
    funcs.errorHandler(error, res)
  })
})

app.listen(port, function () {
	console.log("CS slash command is listening on port: " + port);
})