"use strict";

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2018-10-25
*/

const base = require('./base.js')
      ,EventEmitter = require('events')
      ,colors = require('colors')

module.exports = class escallating extends base{
	constructor({type, parent} = {}) {
		super({parent})
		var t = this, m, x
    t.events = new EventEmitter()
    
    try{
      t.oname = type
      t.add({cron_config : {
          cronTime: "0 0,5,10,15,20,25,30,35,40,45,50,55 0-59 * * *",
          onTick: function(){t.events.emit('attempt', {type});},
          onComplete: function(){},
          start: false, 
          timezone: null, 
          context: null, 
          runOnInit: null, 
          unrefTimeout: null
        }
      })
      return t
		}catch(e){
      m = 'escallating.constructor error: ' + e.message
      x = (typeof t.logger === 'object') ? t.logger.error('error: ' + e.message).tag(t.log.lne).tagline() : console.log(m.red)
		}
	}	
  
  attempt(){
		var t = this, x, m
    try{
      t.success_callback = function(){}    //this will reset the callback function, so it doesn't loop forever if function isn't reset manually
      t.then('start')
      return t
		}catch(e){
      m = 'base.attempt error: ' + e.message
      x = (typeof t.logger === 'object') ? t.logger.error('error: ' + e.message).tag(t.log.lne).tagline() : console.log(m.red)
		}
  }
    
  init(){
    var t = this, emails, m, x, toSend = [], i
    try{
      t.events.on('attempt', ({type}) => {
        try{
          //t.then('stop')
          t.attempt_count++
          m = `${type} attempt`
          x = (typeof t.logger === 'object') ? t.logger.info(`${type} attempt`).tag(t.log.lne).tagline() : console.log(m.green)
          for(i=0;i<t.emails.length;i++){
            if(typeof t.emails[i].id === 'undefined')
              t.emails[i].id = t.ids++
            if(typeof t.emails[i].sent === 'undefined')
              t.emails[i].sent = false
            t.emails[i].events = t.events
            t.emails[i].oname = t.oname
            if(!t.emails[i].sent){
              toSend[0] = t.emails[i]
              break
            }
          }
          if(toSend.length === 0){
            m = 'escallating.init error: Nothing to send'
            x = (typeof t.logger === 'object') ? t.logger.error(m).tag(t.log.lne).tagline() : console.log(m.red)
          }else{
            emails = toSend
            t.parent.events.emit('send', {emails})
          }
        }catch(e){
          m = 'escallating.init error: ' + e.message
          x = (typeof t.logger === 'object') ? t.logger.error('error: ' + e.message).tag(t.log.lne).tagline() : console.log(m.red)
        }
      })

      t.events.on('success', ({id}) => {
        for(i=0;i<t.emails.length;i++){
          if(t.emails[i].id === id){
            x = (typeof t.logger === 'object') ? t.logger.info(`id(${id}) oname(` + t.oname + `) successful send`).tag(t.log.lne).tagline() : console.log(m.green)
            t.emails[i].sent = true
            t.then('successful_callback')
            break
          }
        }
        
        if(t.has_sent_all()){
          t.then('stop')
        }
      })
      
      super.init()
      return t
		}catch(e){
      m = 'escallating.init error: ' + e.message
      x = (typeof t.logger === 'object') ? t.logger.error('error: ' + e.message).tag(t.log.lne).tagline() : console.log(m.red)
		}
  }
}
