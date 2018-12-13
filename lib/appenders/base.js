"use strict";

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2018-11-07
*/

const CronJob = require('cron').CronJob
      ,colors = require('colors')

module.exports = class base{
	constructor({parent} = {}){
		var t = this
    try{
      t.parent = parent
      t.emails = []
      t.ids = 1;
      t.logger
      t.log
      t.attempt_count = 0
      t.return_object = {attempt_count : 0}
      t.cron_config = {}
      t.cron_job
      t.cron_job_running = false
      t.success_callback = function(){}
      t.error_callback = function(){}
      t.error_message = null
		}catch(e){
      m = 'base.constructor error: ' + e.message
      x = (typeof t.logger === 'object') ? t.logger.error('error: ' + e.message).tag(t.log.lne).tagline() : console.log(m.red)
		}
	}	
    
  init(){
    var t = this, emails, m, x
    try{      
      t.events.on('error', ({message}) => {
        m = message
        t.error_message = message
        x = (typeof t.logger === 'object') ? t.logger.error('error: ' + message).tag(t.log.lne).tagline() : console.log(m.red)
        t.then('stop').then('error_callback')
      })
      t.events.on('stop', ({message}) => {
        m = message
        x = (typeof t.logger === 'object') ? t.logger.debug(m).tag(t.log.lne).tagline() : console.log(m.blue)
        t.event_do('stop')
      })
      t.events.on('start', ({message}) => {
        m = message
        x = (typeof t.logger === 'object') ? t.logger.debug(m).tag(t.log.lne).tagline() : console.log(m.blue)
        t.event_do('start')
      })
      t.events.on('reset', ({message}) => {
        m = message
        x = (typeof t.logger === 'object') ? t.logger.debug(m).tag(t.log.lne).tagline() : console.log(m.blue)
        t.event_do('reset')
      })
      t.events.on('successful_callback', ({type}) => {
        m = type
        x = (typeof t.logger === 'object') ? t.logger.debug(m).tag(t.log.lne).tagline() : console.log(m.blue)
        t.event_do('successful_callback')
      })
      t.events.on('error_callback', ({type}) => {
        m = type
        x = (typeof t.logger === 'object') ? t.logger.debug(m).tag(t.log.lne).tagline() : console.log(m.blue)
        t.event_do('error_callback')
      })
		}catch(e){
      m = 'escallating.init error: ' + e.message
      x = (typeof t.logger === 'object') ? t.logger.error('error: ' + e.message).tag(t.log.lne).tagline() : console.log(m.red)
		}
  }
  
  has_sent_all(){
		var t = this, x, m, has_sent, i
    try{        
      has_sent = true        
      for(i=0;i<t.emails.length;i++){
        if(typeof t.emails[i].sent === 'undefined')
          return false
        if(!t.emails[i].sent){
          has_sent = false
          break
        }
      }
      
      return has_sent
		}catch(e){
      m = 'bundle.then error: ' + e.message
      x = (typeof t.logger === 'object') ? t.logger.error('error: ' + e.message).tag(t.log.lne).tagline() : console.log(m.red)
		}
  }
  
  add({email_setup, cron_config, bundle} = {}){
		var t = this, x, m
    try{
      if(typeof cron_config !== 'undefined'){
        if(typeof cron_config.cronTime !== 'undefined')
          t.cron_config.cronTime = cron_config.cronTime
        if(typeof cron_config.onTick !== 'undefined')
          t.cron_config.onTick = cron_config.onTick
        if(typeof cron_config.onComplete !== 'undefined')
          t.cron_config.onComplete = cron_config.onComplete
        if(typeof cron_config.start !== 'undefined')
          t.cron_config.start = cron_config.start
        if(typeof cron_config.timezone !== 'undefined')
          t.cron_config.timezone = cron_config.timezone
        if(typeof cron_config.context !== 'undefined')
          t.cron_config.context = cron_config.context
        if(typeof cron_config.runOnInit !== 'undefined')
          t.cron_config.runOnInit = cron_config.runOnInit
        if(typeof cron_config.unrefTimeout !== 'undefined')
          t.cron_config.unrefTimeout = cron_config.unrefTimeout
      }
      if(typeof email_setup !== 'undefined')
        t.emails[t.emails.length] = email_setup
      if(typeof bundle !== 'undefined')
        if(typeof t.bundle !== 'undefined')
          t.bundle[t.bundle.length] = bundle
      return t
		}catch(e){
      m = 'base.add error: ' + e.message
      x = (typeof t.logger === 'object') ? t.logger.error('error: ' + e.message).tag(t.log.lne).tagline() : console.log(m.red)
		}
  }
  
  set_cron(){
		var t = this, x, m
    try{
      m = 'attempting to set the ' + t.oname + ' cron job'
      if(typeof t.cron_job === 'undefined'){
        m = 'setting the ' + t.oname + ' cron job'
        t.cron_job = new CronJob(t.cron_config)
      }
      x = (typeof t.logger == 'object') ? t.logger.info(m).tag(t.log.lne).tagline() : console.log(m.green)
		}catch(e){
      m = 'base.set_cron error: ' + e.message
      x = (typeof t.logger === 'object') ? t.logger.error('error: ' + e.message).tag(t.log.lne).tagline() : console.log(m.red)
		}
  }
  
  attempt(){
		var t = this, x, m
    try{
      t.success_callback = function(){}    //this will reset the callback function, so it doesn't loop forever if function isn't reset manually
      t.error_callback = function(){}    //this will reset the callback function, so it doesn't loop forever if function isn't reset manually
      t.error_message = null
      t.then('attempt')
      return t
		}catch(e){
      m = 'base.attempt error: ' + e.message
      x = (typeof t.logger === 'object') ? t.logger.error('error: ' + e.message).tag(t.log.lne).tagline() : console.log(m.red)
		}
  }
 
  main_timer_complete(){
		var t = this, x, m
    try{
      m = 'main timer complete for oname=' + t.oname
      x = (typeof t.logger === 'object') ? t.logger.info(m).tag(t.log.lne).tagline() : console.log(m.red)
      return t
		}catch(e){
      m = 'base.attempt error: ' + e.message
      x = (typeof t.logger === 'object') ? t.logger.error('error: ' + e.message).tag(t.log.lne).tagline() : console.log(m.red)
		}
  }
  
  reset(){
		var t = this, x, m
    try{
      t.attempt_count = 0
      t.emails.forEach(function(o){
        o.sent = false
      })
      m = 'reset for oname=' + t.oname
      x = (typeof t.logger === 'object') ? t.logger.info(m).tag(t.log.lne).tagline() : console.log(m.red)
      return t
		}catch(e){
      m = 'base.attempt error: ' + e.message
      x = (typeof t.logger === 'object') ? t.logger.error('error: ' + e.message).tag(t.log.lne).tagline() : console.log(m.red)
		}
  }
  
  on(action, callback){
		var t = this, x, m
    try{
      switch(action){
        case 'success' :
          t.success_callback = callback
          break
        case 'error' :
          t.error_callback = callback
          break
      }
      return t
		}catch(e){
      m = 'base.attempt error: ' + e.message
      x = (typeof t.logger === 'object') ? t.logger.error('error: ' + e.message).tag(t.log.lne).tagline() : console.log(m.red)
		}
  }
  
  then(action){
		var t = this, x, message, m, type
    try{
      switch(action){
        case 'reset' :
          message = 'resetting oname(' + t.oname + ')'
          t.events.emit('reset', {message})
          return t
        case 'stop' :
          message = 'stopping oname(' + t.oname + ')'
          t.events.emit('stop', {message})
          return t
        case 'start' :
          message = 'starting oname(' + t.oname + ') cron job'
          t.events.emit('start', {message})
          return t
        case 'attempt' :
          type = t.oname
          t.events.emit('attempt', {type})
          return t
        case 'successful_callback' :
          type = t.oname
          t.events.emit('successful_callback', {type})
          return t
        case 'error_callback' :
          type = t.oname
          t.events.emit('error_callback', {type})
          return t
      }
		}catch(e){
      m = 'base.then error: ' + e.message
      x = (typeof t.logger === 'object') ? t.logger.error('error: ' + e.message).tag(t.log.lne).tagline() : console.log(m.red)
		}
  }
  
  event_do(action){
		var t = this, x, m
    try{
      m = 'attempting action(' + action + ')'
      x = (typeof t.logger === 'object') ? t.logger.debug(m + ' oname(' + t.oname + ')').tag(t.log.lne).tagline() : console.log(m.blue)
      switch(action){
        case 'reset' :
          m = 'attempting reset'
          if(!t.cron_job_running){
            m = 'resetting'
            t.then('stop')
            t.reset()
          }else{
            m = 'cannot reset while the cron job is running'
          }
          x = (typeof t.logger === 'object') ? t.logger.info(m + ' oname(' + t.oname + ')').tag(t.log.lne).tagline() : console.log(m.blue)
          break
        case 'successful_callback' :
          t.return_object.attempt_count = t.attempt_count
          m = 'attempt count(' + t.return_object.attempt_count + ')'
          x = (typeof t.logger === 'object') ? t.logger.info(m + ' oname(' + t.oname + ')').tag(t.log.lne).tagline() : console.log(m.blue)
          t.success_callback(t.return_object)
          break
        case 'error_callback' :
          t.return_object.attempt_count = t.attempt_count
          t.return_object.has_error = true
          t.return_object.message = t.error_message
          m = 'attempt count(' + t.return_object.attempt_count + ')'
          x = (typeof t.logger === 'object') ? t.logger.info(m + ' oname(' + t.oname + ')').tag(t.log.lne).tagline() : console.log(m.blue)
          t.error_callback(t.return_object)
          break
        case 'stop' :
          m = 'stopping cron job'
          t.cron_job_running = false
          if(typeof t.cron_job !== 'undefined')
            t.cron_job.stop()
          x = (typeof t.logger === 'object') ? t.logger.info(m + ' oname(' + t.oname + ')').tag(t.log.lne).tagline() : console.log(m.blue)
          break
        case 'start' :
          m = 'attempting cron job start'
          if(!t.cron_job_running){
            if(typeof t.cron_job === 'undefined')
              t.set_cron()
            m = 'starting cron job'
            t.cron_job.start()
          }
          x = (typeof t.logger === 'object') ? t.logger.info(m + ' oname(' + t.oname + ')').tag(t.log.lne).tagline() : console.log(m.blue)
          break
      }
      return t
		}catch(e){
      m = 'base.event_do error: ' + e.message
      x = (typeof t.logger === 'object') ? t.logger.error('error: ' + e.message).tag(t.log.lne).tagline() : console.log(m.red)
		}
  }
}