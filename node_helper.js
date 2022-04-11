"use strict"

var NodeHelper = require("node_helper")
var log = (...args) => { /* do nothing */ }
var express = require("express")
var cors = require("cors")
const fs = require("fs")
const path = require("path")
const tools = require("./tools/tools.js")

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var session = require('express-session')
var flash = require('connect-flash')
var bodyParser = require('body-parser')

module.exports = NodeHelper.create({
  start: function () {
    this.config= null
    this.MMConfig= null
    this.EXT= null // EXT plugins list
    this.EXTDescription = {}
    this.EXTConfigured = [] // configured EXT in config
    this.EXTInstalled= [] // installed EXT in MM
    this.user = {
      _id: 1,
      username: 'admin',
      email: 'admin@bugsounet.fr',
      password: 'admin'
    }
  },

  socketNotificationReceived: function (noti, payload) {
    switch (noti) {
      case "INIT":
        console.log("[GATEWAY] Gateway Version:", require('./package.json').version, "rev:", require('./package.json').rev)
        this.config = payload
        if (this.config.debug) log = (...args) => { console.log("[GATEWAY]", ...args) }
        log("Config:", this.config)
        if (this.config.useApp) this.sendSocketNotification("MMConfig")
        break
      case "MMConfig":
        this.MMConfig = payload.MM
        //log("MMConfig:", this.MMConfig)
        this.EXT = payload.DB.sort()
        this.EXTDescription = payload.Description
        this.initialize()
        break
    }
  },

  /** init function **/
  initialize: function () {
    console.log("[GATEWAY] Start app...")
    if (this.config.testingMode) console.log("[GATEWAY] TestingMode is activated, don't worry.. no change will be apply!")
    log("EXT plugins in database:", this.EXT.length)
    if (!this.config.username && !this.config.password) {
      console.error("[GATEWAY] Your have not defined user/password in config!")
      console.error("[GATEWAY] Using default creadentials")
    } else {
      if ((this.config.username == this.user.username) || (this.config.password == this.user.password)) {
        console.warn("[GATEWAY] WARN: You are using default username or default password")
        console.warn("[GATEWAY] WARN: Don't forget to change it!")
      }
      this.user.username = this.config.username
      this.user.password = this.config.password
    }
    this.passportConfig()
    this.app = express()
    this.wantedConfigModule = null
    this.moduleFile = null
    this.moduleToInstall= null
    this.EXTConfigured= this.searchConfigured()
    this.EXTInstalled= this.searchInstalled()
    log("Find", this.EXTConfigured.length, "configured plugins in config file")
    log("Find", this.EXTInstalled.length , "Installed plugins in MagicMirror")
    this.Setup()
  },

  /** search installed EXT from DB**/
  searchConfigured: function () {
    try {
      var Configured = []
      this.MMConfig.modules.find(m => {
        if (this.EXT.includes(m.module)) Configured.push(m.module)
      })
      return Configured.sort()
    } catch (e) {
      console.log("[GATEWAY] Error! " + e)
      return Configured.sort()
    }
  },

  /** search installed EXT **/
  searchInstalled: function () {
    var Installed = []
    this.EXT.find(m => {
      if (fs.existsSync(path.resolve(__dirname + "/../" + m + "/package.json"))) {
        let name = require((path.resolve(__dirname + "/../" + m + "/package.json"))).name
        if (name == m) Installed.push(m)
        else console.warn("[GATEWAY] Found:", m, "but in package.json name is not the same:", name)
      }
    })
    return Installed.sort()
  },

  /** http server **/
  Setup: async function () {
    log("Create all needed routes...")
    this.app.use(session({
      secret: 'some-secret',
      saveUninitialized: false,
      resave: true
    }))

    // For parsing post request's data/body
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: false }))

    // Tells app to use password session
    this.app.use(passport.initialize())
    this.app.use(passport.session())

    this.app.use(flash())

    var options = {
      dotfiles: 'ignore',
      etag: false,
      extensions: ["css", "js"],
      index: false,
      maxAge: '1d',
      redirect: false,
      setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now());
      }
    }

    this.app.use(cors({ origin: '*' }))
    this.app.use('/assets', express.static(__dirname + '/admin/assets', options))

    this.app.get('/', (req, res) => {
      if(req.user) res.sendFile(__dirname+ "/admin/index.html")
      else res.redirect('/login')
    })

    this.app.get('/EXT', (req, res) => {
      if(req.user) res.sendFile(__dirname+ "/admin/EXT.html")
      else res.redirect('/login')
    })

    this.app.get('/login', (req, res) => {
      let error = req.flash('error')
      if (error.length) res.redirect("/login?err=" + error)
      else res.sendFile(__dirname+ "/admin/login.html")
    })

    this.app.get('/logout', (req, res) => {
      req.logout()
      res.redirect('/')
    })

    this.app.post('/login',
      passport.authenticate('login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
      })
    )

    this.EXT.forEach( module => {
      this.app.get("/"+ module, (req,res) => {
        res.sendFile( __dirname+ "/admin/modules/" + module + "/index.html")
      })
     }
    )

    this.app.get('/AllEXT', (req, res) => {
      if(req.user) res.send(this.EXT)
      else res.status(403).sendFile(__dirname+ "/admin/403.html")
    })

    this.app.get('/DescriptionEXT', (req, res) => {
      if(req.user) res.send(this.EXTDescription)
      else res.status(403).sendFile(__dirname+ "/admin/403.html")
    })

    this.app.get('/InstalledEXT', (req, res) => {
      if(req.user) res.send(this.EXTInstalled)
      else res.status(403).sendFile(__dirname+ "/admin/403.html")
    })

    this.app.get('/ConfiguredEXT', (req, res) => {
      if(req.user) res.send(this.EXTConfigured)
      else res.status(403).sendFile(__dirname+ "/admin/403.html")
    })

    this.app.use(function(req, res) {
      console.log("[GATEWAY] Error! Don't find:", req.url)
      res.status(404).sendFile(__dirname+ "/admin/404.html")
    })

    /** Create Server **/
    this.config.listening = await this.purposeIP()
    var server = this.app.listen(this.config.port, this.config.listening, () => {
      var port = server.address().port
      var host = server.address().address
      console.log("[GATEWAY] Start listening on http://"+ host + ":" + port)
    })
  },

  /** search and purpose and ip address **/
  purposeIP: async function() {
    var IP = await tools.getIP()
    var found = 0
    return new Promise(resolve => {
      IP.forEach(network => {
        if (network.default) {
          resolve(network.ip)
          found = 1
          return
        }
      })
      if (!found) resolve("127.0.0.1")
    })
  },

  /** passport local strategy with username/password defined on config **/
  passportConfig: function() {
    // Register a login strategy
    passport.use('login', new LocalStrategy(
      (username, password, done) => {
        if (username === this.user.username && password === this.user.password) return done(null, this.user)
        else done(null, false, { message: 'Invalid username and password.' })
      }
    ))

    // Required for storing user info into session
    passport.serializeUser((user, done) => {
      done(null, user._id)
    })

    // Required for retrieving user from session
    passport.deserializeUser((id, done) => {
      // The user should be queried against db
      // using the id
      done(null, this.user)
    })
  },

})
