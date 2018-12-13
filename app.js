"use strict";

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2018-11-07
*/
const colors = require('colors')
      ,CronJob = require('cron').CronJob
      ,EventEmitter = require('events')

module.exports = class email_smtp_cron_delivery {
	constructor({smtp_config, emailThrottle} = {}) {
		var t = this, et
    try{
      t.appenders_dir = './lib/appenders/'
      t.appender_objects = []
      t.parent = null
      t.logger
      t.log
      t.email = require('smtp-email-sender')(smtp_config)
      t.stage_emails = []
      t.events = new EventEmitter()
      t.child_oname = ''
      t.child_events
      t.error_message
      et = {
        cronTime: "0,30 0-59 * * * *",
        onTick: function(){t.send();},
        onComplete: function(){t.complete();},
        start: false
      }
      if(typeof emailThrottle !== 'undefined'){
        if(typeof emailThrottle.cronTime !== 'undefined')
          et.cronTime = emailThrottle.cronTime
        if(typeof emailThrottle.onTick !== 'undefined')
          et.onTick = emailThrottle.onTick
        if(typeof emailThrottle.onComplete !== 'undefined')
          et.onComplete = emailThrottle.onComplete
      }
      t.emailThrottle = new CronJob(et)
      return t
		}catch(e){
      m = 'email_smtp_cron_delivery.constructor error: ' + e.message
      x = (typeof t.logger === 'object') ? t.logger.error('error: ' + e.message).tag(t.log.lne).tagline() : console.log(m.red)
		}
	}

  complete(){
    var t = this, i, r
    try{
      t.appender_objects.forEach(function(o){
        o.main_timer_complete()
      })
    }catch(e){
      message = 'email_smtp_cron_delivery.complete error: ' + e.message
      x = (typeof t.logger === 'object') ? t.logger.error('error: ' + e.message).tag(t.log.lne).tagline() : console.log(m.red)
      t.stage_emails.events.emit('error', {emails, message})
    }
  }

  send(){
    var t = this, x, z, m, msg, stg, message, id, o
    try{
      if(t.stage_emails.length > 0){
        try{
          stg = t.stage_emails[0]
          
          msg = {}
          if(typeof stg == 'undefined')
            throw new Error('stg is undefined')
          if(typeof stg.from != 'undefined')
            msg.from = stg.from
          if(typeof stg.to != 'undefined')
            msg.to = stg.to
          if(typeof stg.subject != 'undefined')
            msg.subject = stg.subject
          if(typeof stg.id != 'undefined')
            msg.id = stg.id
          if(typeof stg.html != 'undefined'){
            msg.html = stg.html
            if(typeof stg.bundle !== 'undefined'){
              stg.bundle.forEach(function(o){
                if(typeof o.html !== 'undefined')
                  msg.html += '<br>' + o.html
              })
            }
          }  
          id = msg.id
          if(typeof msg.from == 'undefined')
            throw new Error('msg.from is undefined')
          if(typeof msg.to == 'undefined')
            throw new Error('msg.to is undefined')
          if(typeof msg.subject == 'undefined')
            throw new Error('msg.subject is undefined')
          if(typeof msg.html == 'undefined')
            throw new Error('msg.html is undefined')
          var jo = {}
          var p1 =  new Promise((resolve, reject) => {
            msg.callback = function(err){
              if(err != null){
                //console.log('email send error = ' + err)
                t.emailThrottle.stop()
                message = 'email_smtp_cron_delivery.send promise error: '
                message += ' message(' + err + ')'
                x = (typeof t.logger === 'object') ? t.logger.error(message).tag(t.log.lne).tagline() : console.log(message.red)
                stg.events.emit('error', {message})
              }else{
                x = (typeof t.logger == 'object') ? t.logger.info('email id(' + id + ') oname(' + stg.oname + ') count(' +t.stage_emails.length+ ')=' + JSON.stringify(msg)).tag(t.log.lne).tagline() : console.log('email id(' + id + ')sending=' + JSON.stringify(msg));
                stg.events.emit('success', {id})
                t.stage_emails.shift()
              }
            }
            t.email(msg)
          })
          return
        }catch(e){
          t.emailThrottle.stop()
          message = 'email_smtp_cron_delivery.send error: '
          if(typeof id !== 'undefined')
            message += 'id(' + id + ') '
          message += ' message(' + e.message + ')'
          x = (typeof t.logger === 'object') ? t.logger.error('error: ' + e.message).tag(t.log.lne).tagline() : console.log(m.red)
          stg.events.emit('error', {message})
        }
      }else{
        t.emailThrottle.stop()
        message = 'email timer has stopped'
        x = (typeof t.logger == 'object') ? t.logger.info(message).tag(t.log.lne).tagline() : console.log(message.green)
      }
    }catch(e){
      t.emailThrottle.stop()
      message = 'email_smtp_cron_delivery.send error: ' + e.message
      x = (typeof t.logger === 'object') ? t.logger.error('error: ' + e.message).tag(t.log.lne).tagline() : console.log(m.red)
    }
  }
  
  init(){
    var t = this, x, m, o
    try{
      t.events.on('send', ({emails}) => {
        try{
          if(typeof emails == 'undefined')
            throw new Error('emails is undefined')
          if(typeof emails.length == 'undefined')
            throw new Error('emails.length is undefined')
          t.stage_emails = t.stage_emails.concat(emails)
          m = 'new emails(' + emails.length + ') staged emails total(' + t.stage_emails.length + ')'
          x = (typeof t.logger == 'object') ? t.logger.info(m).tag(t.log.lne).tagline() : console.log(m.green)
          t.emailThrottle.start()
        }catch(e){
          m = 'instant.init error: ' + e.message
          x = (typeof t.logger === 'object') ? t.logger.error('error: ' + e.message).tag(t.log.lne).tagline() : console.log(m.red)
        }
      })
      return t
		}catch(e){
      m = 'instant.init error: ' + e.message
      x = (typeof t.logger === 'object') ? t.logger.error('error: ' + e.message).tag(t.log.lne).tagline() : console.log(m.red)
		}
  }
  
  add({logging} = {}){
		var t = this, x, m, o
    try{
      if(typeof logging !== 'undefined'){
        if(typeof logging.logger !== 'undefined')
          t.logger = logging.logger
        if(typeof logging.log !== 'undefined')
          t.log = logging.log
        t.appender_objects.forEach(function(o){
          if(typeof o.logger  === 'undefined')
            o.logger = t.logger
          if(typeof o.log  === 'undefined')
            o.log = t.log
        })
        x = (typeof t.logger === 'object') ? t.logger.info('logging to file').tag(t.log.lne).tagline() : console.log('base: no file logging'.red)
      }
      return t
		}catch(e){
      m = 'base.add error: ' + e.message
      x = (typeof t.logger === 'object') ? t.logger.error('error: ' + e.message).tag(t.log.lne).tagline() : console.log(m.red)
		}
  }

	appender({type} = {}){
		var t = this, x, m, a, o
		try{
      if(typeof arguments == "undefined")
        throw new Error('arguments is undefined')
      if(typeof arguments[0].type == "undefined")
        throw new Error('arguments[0].type is undefined')

      arguments[0].parent = t
      a = t.appenders_dir + type + '.js';
      console.log('email_smtp_cron_delivery appenders=' + a.cyan)
      x = require(a)
//console.log('debug 44.00')
      o = new x(arguments[0]).init()
//console.log('debug 44.01')
      t.appender_objects[t.appender_objects.length] = o
//console.log('debug 44.02')
			return o
		}catch(e){
      m = 'email_smtp_cron_delivery.appender error: ' + e.message
      x = (typeof t.logger === 'object') ? t.logger.error('error: ' + e.message).tag(t.log.lne).tagline() : console.log(m.red)
		}
	}
}
