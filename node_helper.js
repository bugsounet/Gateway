"use strict"

var NodeHelper = require("node_helper")
var log = (...args) => { /* do nothing */ }
var express = require("express")
var cors = require("cors")
const fs = require("fs")
const path = require("path")
const tools = require("./tools/tools.js")
var build =  require('./tools/build.js')

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var session = require('express-session')
var flash = require('connect-flash')
var bodyParser = require('body-parser')
var hyperwatch =  require('hyperwatch')
var exec = require("child_process").exec
var spawn = require('child_process').spawn
const pm2 = require('pm2')

module.exports = NodeHelper.create({
  start: function () {
    this.MMConfig= null // real config file (config.js)
    this.EXT= null // EXT plugins list
    this.EXTDescription = {} // description of EXT
    this.EXTConfigured = [] // configured EXT in config
    this.EXTInstalled= [] // installed EXT in MM
    this.user = {
      _id: 1,
      username: 'admin',
      email: 'admin@bugsounet.fr',
      password: 'admin'
    }
    this.app = null
    this.server= null
  },

  socketNotificationReceived: function (noti, payload) {
    switch (noti) {
      case "INIT":
        console.log("[GATEWAY] Gateway Version:", require('./package.json').version, "rev:", require('./package.json').rev)
        if (this.server) return
        this.config = payload
        if (this.config.debug) log = (...args) => { console.log("[GATEWAY]", ...args) }
        //log("Config:", this.config)
        if (this.config.useApp) this.sendSocketNotification("MMConfig")
        break
      case "MMConfig":
        this.MMConfig = tools.readConfig()
        if (!this.MMConfig) return console.log("[GATEWAY] Error: MagicMirror config.js file not found!")
        this.EXT = payload.DB.sort()
        this.EXTDescription = payload.Description
        this.initialize()
        break
    }
  },

  /** init function **/
  initialize: function () {
    console.log("[GATEWAY] Start app...")
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
    log("Find", this.EXTInstalled.length , "installed plugins in MagicMirror")
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
    this.app.use(bodyParser.urlencoded({ extended: true }))

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

    this.app
      .use(cors({ origin: '*' }))
      .use('/assets', express.static(__dirname + '/admin/assets', options))
      .get('/', (req, res) => {
        if(req.user) res.sendFile(__dirname+ "/admin/index.html")
        else res.redirect('/login')
      })

      .get('/EXT', (req, res) => {
        if(req.user) res.sendFile(__dirname+ "/admin/EXT.html")
        else res.redirect('/login')
      })

      .get('/login', (req, res) => {
        let error = req.flash('error')
        if (error.length) res.redirect("/login?err=" + error)
        else res.sendFile(__dirname+ "/admin/login.html")
      })

      .post('/login', passport.authenticate('login', {
          successRedirect: '/',
          failureRedirect: '/login',
          failureFlash: true
        })
      )

      .get('/logout', (req, res) => {
        req.logout()
        res.redirect('/')
      })

      .get('/AllEXT', (req, res) => {
        if(req.user) res.send(this.EXT)
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get('/DescriptionEXT', (req, res) => {
        if(req.user) res.send(this.EXTDescription)
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get('/InstalledEXT', (req, res) => {
        if(req.user) res.send(this.EXTInstalled)
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get('/ConfiguredEXT', (req, res) => {
        if(req.user) res.send(this.EXTConfigured)
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get('/ModulesConfig', (req, res) => {
        if(req.user) res.send(this.MMConfig)
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get("/Terminal" , (req,res) => {
        if(req.user) res.sendFile( __dirname+ "/admin/terminal.html")
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get("/install" , (req,res) => {
        if(!req.user) return res.status(403).sendFile(__dirname+ "/admin/403.html")
        if (req.query.ext && this.EXTInstalled.indexOf(req.query.ext) == -1 && this.EXT.indexOf(req.query.ext) > -1) {
          res.sendFile( __dirname+ "/admin/install.html")
        }
        else res.status(404).sendFile(__dirname+ "/admin/404.html")
      })

      .get("/EXTInstall" , (req,res) => {
        if(!req.user) return res.status(403).sendFile(__dirname+ "/admin/403.html")
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        if (req.query.EXT && this.EXTInstalled.indexOf(req.query.EXT) == -1 && this.EXT.indexOf(req.query.EXT) > -1) {
          console.log("[GATEWAY]["+ip+"] Request installation:", req.query.EXT)
          var result = {
            error: false
          }
          var modulePath = path.normalize(__dirname + "/../")
          var Command= 'cd ' + modulePath + ' && git clone https://github.com/bugsounet/' + req.query.EXT + ' && cd ' + req.query.EXT + ' && npm install'

          var child = exec(Command, {cwd : modulePath } , (error, stdout, stderr) => {
            if (error) {
              result.error = true
              console.error(`[GATEWAY][FATAL] exec error: ${error}`)
            } else {
              this.EXTInstalled= this.searchInstalled()
              console.log("[GATEWAY][DONE]", req.query.EXT)
            }
            res.json(result)
          })
          child.stdout.pipe(process.stdout)
          child.stderr.pipe(process.stdout)
        }
        else res.status(404).sendFile(__dirname+ "/admin/404.html")
      })

      .get("/delete" , (req,res) => {
        if(!req.user) return res.status(403).sendFile(__dirname+ "/admin/403.html")
        if (req.query.ext && this.EXTInstalled.indexOf(req.query.ext) > -1 && this.EXT.indexOf(req.query.ext) > -1) {
          res.sendFile( __dirname+ "/admin/delete.html")
        }
        else res.status(404).sendFile(__dirname+ "/admin/404.html")
      })
      
      .get("/EXTDelete" , (req,res) => {
        if(!req.user) return res.status(403).sendFile(__dirname+ "/admin/403.html")
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        if (req.query.EXT && this.EXTInstalled.indexOf(req.query.EXT) > -1 && this.EXT.indexOf(req.query.EXT) > -1) {
          console.log("[GATEWAY]["+ip+"] Request delete:", req.query.EXT)
          var result = {
            error: false
          }
          var modulePath = path.normalize(__dirname + "/../")
          var Command= 'cd ' + modulePath + ' && rm -rf ' + req.query.EXT
          var child = exec(Command, {cwd : modulePath } , (error, stdout, stderr) => {
            if (error) {
              result.error = true
              console.error(`[GATEWAY][FATAL] exec error: ${error}`)
            } else {
              this.EXTInstalled= this.searchInstalled()
              console.log("[GATEWAY][DONE]", req.query.EXT)
            }
            res.json(result)
          })
          child.stdout.pipe(process.stdout)
          child.stderr.pipe(process.stdout)
        }
        else res.status(404).sendFile(__dirname+ "/admin/404.html")
      })

      .get('/bundle.js', function (req, res) {
        res.setHeader('Content-Type', 'application/javascript');
        build().pipe(res);
       })

      .get("/MMConfig" , (req,res) => {
        if(!req.user) return res.status(403).sendFile(__dirname+ "/admin/403.html")
        res.sendFile( __dirname+ "/admin/mmconfig.html")
      })

      .get("/EXTCreateConfig" , (req,res) => {
        if(!req.user) return res.status(403).sendFile(__dirname+ "/admin/403.html")
        if (req.query.ext &&
          this.EXTInstalled.indexOf(req.query.ext) > -1 && // is installed
          this.EXT.indexOf(req.query.ext) > -1 &&  // is an EXT
          this.EXTConfigured.indexOf(req.query.ext) == -1 // is not configured
        ) {
          res.sendFile( __dirname+ "/admin/EXTCreateConfig.html")
        }
        else res.status(404).sendFile(__dirname+ "/admin/404.html")
      })

      .get("/EXTModifyConfig" , (req,res) => {
        if(!req.user) return res.status(403).sendFile(__dirname+ "/admin/403.html")
        if (req.query.ext &&
          this.EXTInstalled.indexOf(req.query.ext) > -1 && // is installed
          this.EXT.indexOf(req.query.ext) > -1 &&  // is an EXT
          this.EXTConfigured.indexOf(req.query.ext) > -1 // is configured
        ) {
          res.sendFile( __dirname+ "/admin/EXTModifyConfig.html")
        }
        else res.status(404).sendFile(__dirname+ "/admin/404.html")
      })

      .get("/EXTDeleteConfig" , (req,res) => {
        if(!req.user) return res.status(403).sendFile(__dirname+ "/admin/403.html")
        if (req.query.ext &&
          this.EXTInstalled.indexOf(req.query.ext) == -1 && // is not installed
          this.EXT.indexOf(req.query.ext) > -1 &&  // is an EXT
          this.EXTConfigured.indexOf(req.query.ext) > -1 // is configured
        ) {
          res.sendFile( __dirname+ "/admin/EXTDeleteConfig.html")
        }
        else res.status(404).sendFile(__dirname+ "/admin/404.html")
      })

      .get("/EXTGetCurrentConfig" , (req,res) => {
        if(!req.user || !req.query.ext) return res.status(403).sendFile(__dirname+ "/admin/403.html")
        var index = this.MMConfig.modules.map(e => { return e.module }).indexOf(req.query.ext)
        if (index > -1) {
          let data = this.MMConfig.modules[index]
          return res.send(data)
        }
        res.status(404).sendFile(__dirname+ "/admin/404.html")
      })

      .get("/EXTGetDefaultConfig" , (req,res) => {
        if(!req.user || !req.query.ext) return res.status(403).sendFile(__dirname+ "/admin/403.html")
        let data = require("./config/"+req.query.ext+"/config.js")
        res.send(data.default)
      })

      .get("/EXTGetDefaultTemplate" , (req,res) => {
        if(!req.user || !req.query.ext) return res.status(403).sendFile(__dirname+ "/admin/403.html")
        let data = require("./config/"+req.query.ext+"/config.js")
        res.send(data.schema)
      })

      .get("/EXTSaveConfig" , (req,res) => {
        if(!req.user || !req.query.config) return res.status(403).sendFile(__dirname+ "/admin/403.html")
        let data = req.query.config
        console.log(data)
        res.send(data)
      })
      
      .post("/writeEXT", async (req,res) => {
        console.log("[Gateway] Receiving EXT data ...", req.body)
        let data = JSON.parse(req.body.data)
        var NewConfig = await tools.configAddOrModify(data, this.MMConfig)
        var resultSaveConfig = await tools.saveConfig(NewConfig)
        console.log("[GATEWAY] Write config result:", resultSaveConfig)
        res.send(resultSaveConfig)
        if (resultSaveConfig.done) {
          this.MMConfig = tools.readConfig()
          this.EXTConfigured= this.searchConfigured()
          console.log("[GATEWAY] Reload config")
        }
      })

      .post("/deleteEXT", async (req,res) => {
        console.log("[Gateway] Receiving EXT data ...", req.body)
        let EXTName = req.body.data
        var NewConfig = await tools.configDelete(EXTName, this.MMConfig)
        var resultSaveConfig = await tools.saveConfig(NewConfig)
        console.log("[GATEWAY] Write config result:", resultSaveConfig)
        res.send(resultSaveConfig)
        if (resultSaveConfig.done) {
          this.EXTConfigured= this.searchConfigured()
          console.log("[GATEWAY] Reload config")
        }
      })

      .get("/Restart" , (req,res) => {
        if(!req.user) return res.status(403).sendFile(__dirname+ "/admin/403.html")
        res.sendFile(__dirname+ "/admin/restarting.html")
        setTimeout(() => this.restartMM() , 1000)         
      })

      .get("/Die" , (req,res) => {
        if(!req.user) return res.status(403).sendFile(__dirname+ "/admin/403.html")
        res.sendFile(__dirname+ "/admin/die.html")
        setTimeout(() => this.doClose(), 3000)
      })

      .use("/jsoneditor" , express.static(__dirname + '/node_modules/jsoneditor'))

      .use(function(req, res) {
        res.status(404).sendFile(__dirname+ "/admin/404.html")
      })
          
    /** Create Server **/
    this.config.listening = await tools.purposeIP()
    this.server = hyperwatch(this.app.listen(this.config.port, this.config.listening, () => {
      console.log("[GATEWAY] Start listening on http://"+ this.config.listening + ":" + this.config.port)
    }))
  },

  /** passport local strategy with username/password defined on config **/
  passportConfig: function() {
    // Register a login strategy
    passport.use('login', new LocalStrategy(
      (username, password, done) => {
        if (username === this.user.username && password === this.user.password) {
          return done(null, this.user)
        }
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

  /* Part of EXT-UpdateNotification */
  /** MagicMirror restart and stop **/
  restartMM: function() {
    if (this.config.usePM2) {
      pm2.restart(this.config.PM2Id, (err, proc) => {
        if (err) {
          console.log("[GATEWAY] " + err)
        }
      })
    }
    else this.doRestart()
  },

  doRestart: function() {
    /** if don't use PM2 and launched with mpn start **/
    /** but no control of it **/
    /** I add stopMM command on telegram to stop process **/
    /** @Saljoke is happy it's sooOOooOO Good ! **/
    console.log("Restarting MagicMirror...")
    var MMdir = path.normalize(__dirname + "/../../")
    const out = process.stdout
    const err = process.stderr
    const subprocess = spawn("npm start", {cwd: MMdir, shell: true, detached: true , stdio: [ 'ignore', out, err ]})
    subprocess.unref()
    process.exit()
  },

  doClose: function() {
    if (!this.config.usePM2) process.abort()
    else {
      pm2.stop(this.config.PM2Id, (err, proc) => {
        if (err) {
          console.log("[GATEWAY] " + err)
        }
      })
    }
  }
})
