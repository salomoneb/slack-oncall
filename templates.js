"use strict"
const Templates = {}

Templates.messageTemplate = {
  "mrkdn": "true",
  "fallback": "Customer Success On Call Schedule",
  "text": "_Who's on call for Customer Success?_",
  "attachments": [{
    "mrkdwn_in": ["text"]
  }]
}

Templates.helpTemplate = {
  "mrkdn": "true",
  "fallback": "CS Command Help",
  "text": "_CS on call options_",
  "attachments": [{
    "mrkdwn_in": ["text"],
    "text": "`/cs-oncall` - Shows the person currently on-call. If between shifts, returns the first person scheduled." + "\n\n" + "`/cs-oncall next` - Shows the next person on-call." + "\n\n" + "`/cs-oncall [first name]` - Shows every scheduled shift for a given person.\n" + "_(Example: cs-oncall blake)._" + "\n\n" + "`/cs-oncall help` - Returns help info for `cs-oncall` command.",
    "color": "#3366ff"
  }]
}

module.exports = Templates