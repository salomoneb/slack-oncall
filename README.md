# slack-oncall

![Slack command gif](https://github.com/salomoneb/slack-oncall/blob/master/oncall-command.gif "CS on call command")

### A Slack Slash Command to Identify On-call Personnel
`/cs-oncall` - Shows the person currently on-call. If between shifts, returns the next person scheduled.

`/cs-oncall next` - Shows the next person on-call after the current person.

`/cs-oncall [first name]` - Shows every scheduled shift for a given person.
_(Example: cs-oncall salomone)._

`/cs-oncall help` - Returns help info for `cs-oncall` command.
