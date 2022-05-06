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
    this.noLogin = false
  },

  socketNotificationReceived: async function (noti, payload) {
    switch (noti) {
      case "INIT":
        console.log("[GATEWAY] Gateway Version:", require('./package.json').version, "rev:", require('./package.json').rev)
        if (this.server) return
        this.config = payload
        this.noLogin = this.config.noLogin
        if (this.config.debug) log = (...args) => { console.log("[GATEWAY]", ...args) }
        this.sendSocketNotification("MMConfig")
        break
      case "MMConfig":
        this.MMConfig = await tools.readConfig()
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
    if (this.noLogin) console.warn("[GATEWAY] WARN: You use noLogin feature (no login/password used)")
    else {
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
    }
    this.app = express()
    this.EXTConfigured= tools.searchConfigured(this.MMConfig, this.EXT)
    this.EXTInstalled= tools.searchInstalled(this.EXT)
    log("Find", this.EXTInstalled.length , "installed plugins in MagicMirror")
    log("Find", this.EXTConfigured.length, "configured plugins in config file")
    this.Setup()
  },

  /** http server **/
  Setup: async function () {
    var urlencodedParser = bodyParser.urlencoded({ extended: true })
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
    if (!this.noLogin) {
      this.app.use(passport.initialize())
      this.app.use(passport.session())
    }

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
        if(req.user || this.noLogin) res.sendFile(__dirname+ "/admin/index.html")
        else res.redirect('/login')
      })

      .get('/EXT', (req, res) => {
        if(req.user || this.noLogin) res.sendFile(__dirname+ "/admin/EXT.html")
        else res.redirect('/login')
      })

      .get('/login', (req, res) => {
        if (req.user || this.noLogin) res.redirect('/')
        res.sendFile(__dirname+ "/admin/login.html")
      })

      .post('/auth', (req, res, next) => {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        passport.authenticate('login', (err, user, info) => {
          if (err) {
            console.log("[GATEWAY][" + ip + "] Error", err)
            return next(err)
          }
          if (!user) {
            console.log("[GATEWAY][" + ip + "] Bad Login", info)
            return res.send({ err: info })
          }
          req.logIn(user, err => {
            if (err) {
              console.log("[GATEWAY][" + ip + "] Login error:", err)
              return res.send({ err: err })
            }
            console.log("[GATEWAY][" + ip + "] Welcome " + user.username + ", happy to serve you! (and don't be so lazy...)")
            return res.send({ login: true })
          })
        })(req, res, next)
      })

      .get('/logout', (req, res) => {
        if (!this.noLogin) req.logout()
        res.redirect('/')
      })

      .get('/AllEXT', (req, res) => {
        if(req.user || this.noLogin) res.send(this.EXT)
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get('/DescriptionEXT', (req, res) => {
        if(req.user || this.noLogin) res.send(this.EXTDescription)
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get('/InstalledEXT', (req, res) => {
        if(req.user || this.noLogin) res.send(this.EXTInstalled)
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get('/ConfiguredEXT', (req, res) => {
        if(req.user || this.noLogin) res.send(this.EXTConfigured)
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get('/GetMMConfig', (req, res) => {
        if(req.user || this.noLogin) res.send(this.MMConfig)
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get("/Terminal" , (req,res) => {
        if(req.user || this.noLogin) res.sendFile( __dirname+ "/admin/terminal.html")
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get("/install" , (req,res) => {
        if(req.user || this.noLogin) {
          if (req.query.ext && this.EXTInstalled.indexOf(req.query.ext) == -1 && this.EXT.indexOf(req.query.ext) > -1) {
            res.sendFile( __dirname+ "/admin/install.html")
          }
          else res.status(404).sendFile(__dirname+ "/admin/404.html")
        }
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get("/EXTInstall" , (req,res) => {
        if(req.user || this.noLogin) {
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
                this.EXTInstalled= tools.searchInstalled(this.EXT)
                console.log("[GATEWAY][DONE]", req.query.EXT)
              }
              res.json(result)
            })
            child.stdout.pipe(process.stdout)
            child.stderr.pipe(process.stdout)
          }
          else res.status(404).sendFile(__dirname+ "/admin/404.html")
        }
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get("/delete" , (req,res) => {
        if(req.user || this.noLogin) {
          if (req.query.ext && this.EXTInstalled.indexOf(req.query.ext) > -1 && this.EXT.indexOf(req.query.ext) > -1) {
            res.sendFile( __dirname+ "/admin/delete.html")
          }
          else res.status(404).sendFile(__dirname+ "/admin/404.html")
        }
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })
      
      .get("/EXTDelete" , (req,res) => {
        if(req.user || this.noLogin) {
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
                this.EXTInstalled= tools.searchInstalled(this.EXT)
                console.log("[GATEWAY][DONE]", req.query.EXT)
              }
              res.json(result)
            })
            child.stdout.pipe(process.stdout)
            child.stderr.pipe(process.stdout)
          }
          else res.status(404).sendFile(__dirname+ "/admin/404.html")
        }
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get('/bundle.js', function (req, res) {
        res.setHeader('Content-Type', 'application/javascript');
        build().pipe(res);
       })

      .get("/MMConfig" , (req,res) => {
        if(req.user || this.noLogin) res.sendFile( __dirname+ "/admin/mmconfig.html")
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get("/EXTCreateConfig" , (req,res) => {
        if(req.user || this.noLogin) {
          if (req.query.ext &&
            this.EXTInstalled.indexOf(req.query.ext) > -1 && // is installed
            this.EXT.indexOf(req.query.ext) > -1 &&  // is an EXT
            this.EXTConfigured.indexOf(req.query.ext) == -1 // is not configured
          ) {
            res.sendFile( __dirname+ "/admin/EXTCreateConfig.html")
          }
          else res.status(404).sendFile(__dirname+ "/admin/404.html")
        }
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get("/EXTModifyConfig" , (req,res) => {
        if(req.user || this.noLogin) {
          if (req.query.ext &&
            this.EXTInstalled.indexOf(req.query.ext) > -1 && // is installed
            this.EXT.indexOf(req.query.ext) > -1 &&  // is an EXT
            this.EXTConfigured.indexOf(req.query.ext) > -1 // is configured
          ) {
            res.sendFile( __dirname+ "/admin/EXTModifyConfig.html")
          }
          else res.status(404).sendFile(__dirname+ "/admin/404.html")
        }
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get("/EXTDeleteConfig" , (req,res) => {
        if(req.user || this.noLogin) {
          if (req.query.ext &&
            this.EXTInstalled.indexOf(req.query.ext) == -1 && // is not installed
            this.EXT.indexOf(req.query.ext) > -1 &&  // is an EXT
            this.EXTConfigured.indexOf(req.query.ext) > -1 // is configured
          ) {
            res.sendFile( __dirname+ "/admin/EXTDeleteConfig.html")
          }
          else res.status(404).sendFile(__dirname+ "/admin/404.html")
        }
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get("/EXTGetCurrentConfig" , (req,res) => {
        if(req.user || this.noLogin) {
          if(!req.query.ext) return res.status(404).sendFile(__dirname+ "/admin/404.html")
          var index = this.MMConfig.modules.map(e => { return e.module }).indexOf(req.query.ext)
          if (index > -1) {
            let data = this.MMConfig.modules[index]
            return res.send(data)
          }
          res.status(404).sendFile(__dirname+ "/admin/404.html")
        }
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get("/EXTGetDefaultConfig" , (req,res) => {
        if(req.user || this.noLogin) {
          if(!req.query.ext) return res.status(404).sendFile(__dirname+ "/admin/404.html")
          let data = require("./config/"+req.query.ext+"/config.js")
          res.send(data.default)
        }
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get("/EXTGetDefaultTemplate" , (req,res) => {
        if(req.user || this.noLogin) {
          if(!req.query.ext) return res.status(404).sendFile(__dirname+ "/admin/404.html")
          let data = require("./config/"+req.query.ext+"/config.js")
          res.send(data.schema)
        }
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get("/EXTSaveConfig" , (req,res) => {
        if(req.user || this.noLogin) {
          if(!req.query.config) return res.status(404).sendFile(__dirname+ "/admin/404.html")
          let data = req.query.config
          res.send(data)
        }
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })
      
      .post("/writeEXT", async (req,res) => {
        console.log("[Gateway] Receiving EXT data ...")
        let data = JSON.parse(req.body.data)
        var NewConfig = await tools.configAddOrModify(data, this.MMConfig)
        var resultSaveConfig = await tools.saveConfig(NewConfig)
        console.log("[GATEWAY] Write config result:", resultSaveConfig)
        res.send(resultSaveConfig)
        if (resultSaveConfig.done) {
          this.MMConfig = await tools.readConfig()
          this.EXTConfigured= tools.searchConfigured(this.MMConfig, this.EXT)
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
          this.MMConfig = await tools.readConfig()
          this.EXTConfigured= tools.searchConfigured(this.MMConfig, this.EXT)
          console.log("[GATEWAY] Reload config")
        }
      })

      .get("/Tools" , (req,res) => {
        if(req.user || this.noLogin) res.sendFile(__dirname+ "/admin/tools.html")
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get("/Setting" , (req,res) => {
        if(req.user || this.noLogin) res.sendFile(__dirname+ "/admin/setting.html")
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })
      
      .get("/getSetting", (req,res) => {
        if(req.user || this.noLogin) res.send(this.config)
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })
      
      .get("/Restart" , (req,res) => {
        if(req.user || this.noLogin) {
          res.sendFile(__dirname+ "/admin/restarting.html")
          setTimeout(() => this.restartMM() , 1000)
        }
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get("/Die" , (req,res) => {
        if(req.user || this.noLogin) {
          res.sendFile(__dirname+ "/admin/die.html")
          setTimeout(() => this.doClose(), 3000)
        }
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get("/EditMMConfig" , (req,res) => {
        if(req.user || this.noLogin) res.sendFile(__dirname+ "/admin/EditMMConfig.html")
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get("/GetBackupName" , async (req,res) => {
        if(req.user || this.noLogin) {
          var names = await tools.loadBackupNames()
          res.send(names)
        }
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get("/GetBackupFile" , async (req,res) => {
        if(req.user || this.noLogin) {
          let data = req.query.config
          var file = await tools.loadBackupFile(data)
          res.send(file)
        }
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .post("/loadBackup", async (req,res) => {
        console.log("[Gateway] Receiving backup data ...")
        let file = req.body.data
        var loadFile = await tools.loadBackupFile(file)
        var resultSaveConfig = await tools.saveConfig(loadFile)
        console.log("[GATEWAY] Write config result:", resultSaveConfig)
        res.send(resultSaveConfig)
        if (resultSaveConfig.done) {
          this.MMConfig = await tools.readConfig()
          console.log("[GATEWAY] Reload config")
        }
      })

      .post("/writeConfig", async (req,res) => {
        console.log("[Gateway] Receiving config data ...")
        let data = JSON.parse(req.body.data)
        var resultSaveConfig = await tools.saveConfig(data)
        console.log("[GATEWAY] Write config result:", resultSaveConfig)
        res.send(resultSaveConfig)
        if (resultSaveConfig.done) {
          this.MMConfig = await tools.readConfig()
          console.log("[GATEWAY] Reload config")
        }
      })
      
      .post("/saveSetting", urlencodedParser, async (req,res) => {
        console.log("[Gateway] Receiving new Setting")
        let data = JSON.parse(req.body.data)
        console.log(data)
        var NewConfig = await tools.configAddOrModify(data, this.MMConfig)
        var resultSaveConfig = await tools.saveConfig(NewConfig)
        console.log("[GATEWAY] Write Gateway config result:", resultSaveConfig)
        res.send(resultSaveConfig)
        if (resultSaveConfig.done) {
          this.MMConfig = await tools.readConfig()
          console.log("[GATEWAY] Reload config")
        }
      })

      .use("/jsoneditor" , express.static(__dirname + '/node_modules/jsoneditor'))

      .use(function(req, res) {
        console.warn("[GATEWAY] Don't find:", req.url)
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
    passport.use('login', new LocalStrategy(
      (username, password, done) => {
        if (username === this.user.username && password === this.user.password) {
          return done(null, this.user)
        }
        else done(null, false, { message: 'Invalid username and password.' })
      }
    ))

    passport.serializeUser((user, done) => {
      done(null, user._id)
    })

    passport.deserializeUser((id, done) => {
      done(null, this.user)
    })
  },

  /** Part of EXT-UpdateNotification **/
  // MagicMirror restart and stop
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
