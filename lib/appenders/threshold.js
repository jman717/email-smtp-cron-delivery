"use strict";

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2018-11-07
*/

const base = require('./base.js')
      ,EventEmitter = require('events')
      ,colors = require('colors')

module.exports = class threshold extends base{
	constructor({type, parent, threshold_number, test_as} = {}) {
		super({parent})
		var t = this, m, x
    t.events = new EventEmitter()
    t.threshold = 0
    if(typeof threshold_number === 'undefined')
      throw new Error('threshold_number is undefined')
    if(typeof test_as === 'undefined')
      throw new Error('test_as is undefined')
    t.test_as = test_as
    t.threshold = threshold_number
    
    try{
      t.oname = type
      return t
		}catch(e){
      m = 'threshold.constructor error: ' + e.message
      x = (typeof t.logger === 'object') ? t.logger.error(m).tag(t.log.lne).tagline() : console.log(m.red)
		}
	}	
    
  attempt(jo){
		var t = this, x, m
    try{
      if(typeof jo === 'undefined')
        throw new Error('jo not defined')
      if(typeof jo.submit === 'undefined')
        throw new Error('jo.submit not defined')
      m = 'threshold.attempt submit(' + jo.submit + ') ' + t.test_as + ' (' + t.threshold + ')'
      x = (typeof t.logger === 'object') ? t.logger.debug(m).tag(t.log.lne).tagline() : console.log(m.blue)
      switch(t.test_as){
        case 'greater_than' :
          if(jo.submit > t.threshold)
            return super.attempt()
          break
        case 'less_than' :
          if(jo.submit < t.threshold)
            return super.attempt()
          break
        case 'equal_to' :
          if(jo.submit == t.threshold)
            return super.attempt()
          break
        default :
          m = 'threshold.attempt error: test_as is(' + t.test_as + ') not defined'
          x = (typeof t.logger === 'object') ? t.logger.error(m).tag(t.log.lne).tagline() : console.log(m.red)
      }
      return t
		}catch(e){
      m = 'threshold.attempt error: ' + e.message
      x = (typeof t.logger === 'object') ? t.logger.error(m).tag(t.log.lne).tagline() : console.log(m.red)
		}
  }
    
  init(){
    var t = this, emails, m, x, i, sentAll
    try{
      t.events.on('attempt', ({type}) => {
        t.attempt_count++
        m = `${type} attempt`
        x = (typeof t.logger === 'object') ? t.logger.info(m).tag(t.log.lne).tagline() : console.log(m.green)
        if(t.has_sent_all()){
          m = `${type} attempt has already sent all emails`
          x = (typeof t.logger === 'object') ? t.logger.info(m).tag(t.log.lne).tagline() : console.log(m.green)
        }else{
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
        }
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
      
      super.init()
      return t
		}catch(e){
      m = 'threshold.init error: ' + e.message
      x = (typeof t.logger === 'object') ? t.logger.error('error: ' + e.message).tag(t.log.lne).tagline() : console.log(m.red)
		}
  }
}
