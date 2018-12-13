
Appenders and cron settings allows flexible email delivery options

Included appenders:

* instant - Prevents flood of duplicate emails. Send an email out once. Once reset the email can be sent again. 
* escallating - Send emails out according to an escallating cron defined schedule which can be started or stopped as needed.
* threshold - Send emails out according to a threshold number - less than, greater than, or equal to that number.
* bundle - In a cron defined time period bundle messages to email en-mass.

Installation
---------
```
npm install email-smtp-cron-delivery

```

Examples

```javascript
  estd = require('email-smtp-cron-delivery')

  var email = new estd({smtp_config : {
      host: "smtp host goes here",
      port: "smtp port goes here",
      auth: {
        user: "user name here",
        pass: "password goes here",
        type: "SMTP",
      },
      secure: ""
    },
    emailThrottle : {
      cronTime: "0,15,30,45 0-59 * * * *"   /* This is optional. Cron setting for how often you want emails to be sent. */
    }
  }).init()
  
  var email_instant = email.appender({type: 'instant'})
  email_instant.add({
    email_setup : {
      "from": "some email address",
      "to": "some email address",
      "subject": "try me out",
      "html": "<h2>This will appear in the email</h2>"
    }
  })
  email_instant.add({
    email_setup : {
      "from": "some email address",
      "to": "some email address",
      "subject": "try me out",
      "html": "<h2>This is another email</h2>"
    }
  })
  
  var email_threshold = email.appender({
    type: 'threshold',
    threshold_number: 1000,
    test_as: 'greater_than'
  })
  email_threshold.add({
    email_setup : {
      "from": "some email address",
      "to": "some email address",
      "subject": "try me out",
      "html": "<h2>This will appear in the email</h2>"
    }
  })
  
  var email_escallating = email.appender({
    type: 'escallating'                         
  })
  email_escallating.add({cron_config : {
      cronTime: "0 0-59 * * * *"
    }
  })
  email_escallating.add({
    email_setup : {
      "from": "some email address",
      "to": "some email address",
      "subject": "try me out",
      "html": "<h2>This is the first email that will appear</h2>"
    }
  })
  email_escallating.add({
    email_setup : {
      "from": "some email address",
      "to": "some email address",
      "subject": "try me out",
      "html": "<h2>This is the second email that will appear</h2>"
    }
  })
  
  var email_bundle = t.email.appender({
    type: 'bundle'                         
  })
  email_bundle.add({
    email_setup : {
      "from": "some email address",
      "to": "some email address",
      "subject": "try me out",
      "html": "<h2>This is the first email that will appear</h2>"
    }
  })
  email_bundle.add({
    email_setup : {
      "from": "some email address",
      "to": "some email address",
      "subject": "try me out",
      "html": "<h2>This is the second email that will appear</h2>"
    }
  })
  email_bundle.add({
    bundle : {
      "html": "<h4>Here is something we need to know</h4>"
    }
  })
  email_bundle.add({
    bundle : {
      "html": "<h4>Something else</h4>"
    }
  })
  email_bundle.add({
    bundle : {
      "html": "<h4>Cool</h4>"
    }
  })
    
```

The following examples are various attempts to email:

```javascript
  email_bundle.attempt().on('success', function(){
    email_bundle.then('stop').then('reset').then('clear_messages').add({
      bundle : {
        "html": "<h1>This is a new message</h1>"
      }
    }).attempt().on('error', function(obj){
      console.log('error: ' + obj.message)
    })
  }).on('error', function(obj){
    console.log('error: ' + obj.message)
  })

  email_instant.attempt().on('success', function(){
    email_instant.then('stop').then('reset')
  }).on('error', function(){
    console.log('error: ' + obj.message)
  })
  
  email_escallating.attempt().on('success', function(){
    email_escallating.attempt().on('success', function(){
      email_escallating.then('stop').then('reset').attempt().on('success', function(){
        email_escallating.then('stop').then('reset')
      }).on('error', function(){
        console.log('error: ' + obj.message)
      })
    }).on('error', function(){
      console.log('error: ' + obj.message)
    })
  }).on('error', function(){
    console.log('error: ' + obj.message)
  })

  email_threshold.attempt({submit: 1001}).on('success', function(obj){
    console.log('threshold debug 10.00')
  }).on('error', function(){
    console.log('error: ' + obj.message)
  })
  
....
```
