"use strict";

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2018-11-07
*/

const base = require('./base.js')
      ,EventEmitter = require('events')
      ,colors = require('colors')

module.exports = class bundle extends base{
	constructor({type, parent} = {}) {
		super({parent})
		var t = this, m, x
    t.events = new EventEmitter()
    t.bundle = []
    
    try{
      t.oname = type
      return t
		}catch(e){
      m = 'instant.constructor error: ' + e.message
      x = (typeof t.logger === 'object') ? t.logger.error('error: ' + e.message).tag(t.log.lne).tagline() : console.log(m.red)
		}
	}	
    
  init(){
    var t = this, emails, m, x, i, sentAll
    try{
      t.events.on('attempt', ({type}) => {
        t.attempt_count++
        m = `${type} attempt`
        x = (typeof t.logger === 'object') ? t.logger.info(m).tag(t.log.lne).tagline() : console.log(m.green)
        for(i=0;i<t.emails.length;i++){
          if(typeof t.emails[i].id === 'undefined')
            t.emails[i].id = t.ids++
          if(typeof t.emails[i].sent === 'undefined')
            t.emails[i].sent = false
          if(typeof t.bundle !== 'undefined')
            if(t.bundle.length > 0)
            t.emails[i].bundle = t.bundle
          t.emails[i].events = t.events
          t.emails[i].oname = t.oname
        }
        emails = t.emails
        t.parent.events.emit('send', {emails})
      })

      t.events.on('success', ({id}) => {
        for(i=0;i<t.emails.length;i++){
          if(t.emails[i].id === id){
            x = (typeof t.logger === 'object') ? t.logger.info(`id(${id}) oname(` + t.oname + `) successful send`).tag(t.log.lne).tagline() : console.log(m.green)
            t.emails[i].sent = true
            break
          }
        }
        
        if(t.has_sent_all()){
          t.then('stop').then('successful_callback')
        }
      })
      t.events.on('clear_messages', ({message}) => {
        m = message
        x = (typeof t.logger === 'object') ? t.logger.debug(m).tag(t.log.lne).tagline() : console.log(m.red)
        t.event_do('clear_messages')
      })
      
      super.init()
      return t
		}catch(e){
      m = 'escallating.init error: ' + e.message
      x = (typeof t.logger === 'object') ? t.logger.error('error: ' + e.message).tag(t.log.lne).tagline() : console.log(m.red)
		}
  }
  
  then(action){
		var t = this, x, message, m
    try{
      switch(action){
        case 'clear_messages' :
          message = 'clearing messages oname(' + t.oname + ')'
          t.events.emit('clear_messages', {message})
          return t
        default :
          super.then(action)
          return t
      }
		}catch(e){
      m = 'bundle.then error: ' + e.message
      x = (typeof t.logger === 'object') ? t.logger.error('error: ' + e.message).tag(t.log.lne).tagline() : console.log(m.red)
		}
  }
  
  event_do(action){
		var t = this, x, m
    try{
      switch(action){
        case 'clear_messages' :
          m = 'attempting bundle clearing messages'
          if(typeof t.bundle !== 'undefined' && t.bundle.length > 0){
            m = 'bundle clearing messages'
            t.bundle = []
          }  
          x = (typeof t.logger === 'object') ? t.logger.info(m + ' oname(' + t.oname + ')').tag(t.log.lne).tagline() : console.log(m.red)
          break
        default :
          super.event_do(action)
      }
      return t
		}catch(e){
      m = 'base.attempt error: ' + e.message
      x = (typeof t.logger === 'object') ? t.logger.error('error: ' + e.message).tag(t.log.lne).tagline() : console.log(m.red)
		}
  }
}
