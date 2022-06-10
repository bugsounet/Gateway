"use strict"

var NodeHelper = require("node_helper")
var log = (...args) => { /* do nothing */ }
var hyperwatch = require("./tools/hyperwatch.js")
var express = require("express")
var cors = require("cors")
const path = require("path")
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var session = require('express-session')
var bodyParser = require('body-parser')
var exec = require("child_process").exec
var semver = require('semver')
const http = require('http')
const { Server } = require("socket.io")

module.exports = NodeHelper.create({
  start: function () {
    this.MMConfig= null // real config file (config.js)
    this.EXT= null // EXT plugins list
    this.EXTDescription = {} // description of EXT
    this.EXTConfigured = [] // configured EXT in config
    this.EXTInstalled= [] // installed EXT in MM
    this.EXTStatus = {}
    this.user = {
      _id: 1,
      username: 'admin',
      email: 'admin@bugsounet.fr',
      password: 'admin'
    }
    this.electronOptions = {
      electronOptions: {
        webPreferences: {
          webviewTag: true
        }
      }
    }
    this.initialized = false
    this.app = null
    this.server= null
    this.noLogin = false
    this.translation = null
    this.schemaTranslatation = null
    this.language = null
    this.webviewTag = false
    this.GACheck= { find: false, version: 0, configured: false }
    this.GAConfig= {}
    this.lib = {}
    this.HyperWatch = null
    this.Mapping = null
    this.loginWarn = false
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
        this.parseData(payload)
        break
      case "EXTStatus":
        if (this.initialized && payload) this.EXTStatus = payload
        break
    }
  },

  /** parse data from MagicMirror **/
  parseData: async function(data) {
    let bugsounet = await this.loadSensibleLibrary()
    if (bugsounet) {
      console.error("[GATEWAY] Warning:", bugsounet, "needed library not loaded !")
      console.error("[GATEWAY] Try to solve it with `npm run rebuild` in Gateway directory")
      return
    }
    this.MMConfig = await this.lib.tools.readConfig()
    if (!this.MMConfig) return console.log("[GATEWAY] Error: MagicMirror config.js file not found!")
    this.language = this.MMConfig.language
    this.webviewTag = this.lib.tools.checkElectronOptions(this.MMConfig)
    this.EXT = data.DB.sort()
    this.EXTDescription = data.Description
    this.translation = data.Translate
    this.schemaTranslatation = data.Schema
    this.EXTStatus = data.EXTStatus
    this.GACheck.version = this.lib.tools.searchGA()
    this.GAConfig = this.lib.tools.getGAConfig(this.MMConfig)
    this.freeteuse = await this.lib.tools.readFreeteuseTV()
    this.radio= await this.lib.tools.readRadioRecipe(this.language)
    this.initialize()
  },

  /** Load sensible library without black screen **/
  loadSensibleLibrary: function () {
    let libraries= [
      // { "library to load" : [ "store library name" ] }
      { "node-pty": "pty" },
      { "./tools/tools.js": "tools" }
    ]
    let errors = 0
    return new Promise(resolve => {
      libraries.forEach(library => {
        for (const [name, configValues] of Object.entries(library)) {
          let libraryToLoad = name
          let libraryName = configValues

          try {
            if (!this.lib[libraryName]) {
              this.lib[libraryName] = require(libraryToLoad)
              log("Loaded:", libraryToLoad)
            }
          } catch (e) {
            console.error("[GATEWAY]", libraryToLoad, "Loading error!" , e.toString())
            this.sendSocketNotification("WARNING" , {library: libraryToLoad })
            errors++
          }

        }
      })
      resolve(errors)
    })
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
          this.loginWarn = true
        }
        this.user.username = this.config.username
        this.user.password = this.config.password
      }
      this.passportConfig()
    }
    this.app = express()
    this.server = http.createServer(this.app)
    this.EXTConfigured= this.lib.tools.searchConfigured(this.MMConfig, this.EXT)
    this.EXTInstalled= this.lib.tools.searchInstalled(this.EXT)
    log("Find", this.EXTInstalled.length , "installed plugins in MagicMirror")
    log("Find", this.EXTConfigured.length, "configured plugins in config file")
    if (this.GAcheck && semver.gte(this.GACheck.version, '4.0.0')) {
      this.GACheck.find = true
      log("Find MMM-GoogleAssistant v" + this.GACheck.version)
    }
    else console.warn("[GATEWAY] MMM-GoogleAssistant Not Found!")
    if (Object.keys(this.GAConfig).length > 0) {
      log("Find MMM-GoogleAssistant configured in MagicMirror")
      this.GACheck.configured = true
    }
    else log("MMM-GoogleAssistant is not configured!")
    log("webviewTag Configured:", this.webviewTag)
    log("Language set", this.language)
    this.Setup()
  },

  /** Middleware **/
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

    var io = new Server(this.server)

    this.app
      .use(this.logRequest)
      .use(cors({ origin: '*' }))
      .use('/EXT_Tools.js', express.static(__dirname + '/tools/EXT_Tools.js'))
      .use('/assets', express.static(__dirname + '/admin/assets', options))
      .get('/', (req, res) => {
        if(req.user || this.noLogin) res.sendFile(__dirname+ "/admin/index.html")
        else res.redirect('/login')
      })

      .get("/version" , (req,res) => {
          res.send({ v: require('./package.json').version, rev: require('./package.json').rev, lang: this.language })
      })

      .get("/translation" , (req,res) => {
          res.send(this.translation)
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
            console.log("[GATEWAY][" + ip + "] Welcome " + user.username + ", happy to serve you!")
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
        if(req.user || this.noLogin) {
          var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
          res.sendFile( __dirname+ "/admin/terminal.html")
          //var ioLogs = new Server(this.server)
          io.once('connection', async (socket) => {
            log('[' + ip + '] Connected to Terminal Logs:', this.noLogin ? "noLogin" : req.user , socket.id)
            socket.on('disconnect', (err) => {
              log('[' + ip + '] Disconnected from Terminal Logs:', this.noLogin ? "noLogin" : req.user, socket.id, err)
            })
            var pastLogs = await this.lib.tools.readAllMMLogs(this.HyperWatch.logs())
            io.emit("terminal.logs", pastLogs)
            this.HyperWatch.stream().on('stdData', (data) => {
              if (typeof data == "string") io.to(socket.id).emit("terminal.logs", data.replace(/\r?\n/g, "\r\n"))
            })
          })
        }
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get("/ptyProcess" , (req,res) => {
        if(req.user || this.noLogin) {
          var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
          res.sendFile( __dirname+ "/admin/pty.html")
          io.once('connection', (client) => {
            log('[' + ip + '] Connected to Terminal:', this.noLogin ? "noLogin" : req.user , client.id)
            client.on('disconnect', (err) => {
              log('[' + ip + '] Disconnected from Terminal:', this.noLogin ? "noLogin" : req.user, client.id, err)
            })
            var cols = 80
            var rows = 24
            var ptyProcess = this.lib.pty.spawn("bash", [], {
              name: "xterm-color",
              cols: cols,
              rows: rows,
              cmd: process.env.HOME,
              env: process.env
            })
            ptyProcess.on("data", (data) => {
              io.to(client.id).emit("terminal.incData", data)
            })
            client.on('terminal.toTerm', (data) => {
              ptyProcess.write(data)
            })
            client.on('terminal.size', (size) => {
              ptyProcess.resize(size.cols, size.rows)
            })
          })
        }
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get("/install" , (req,res) => {
        if(req.user || this.noLogin) {
          var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
          if (req.query.ext && this.EXTInstalled.indexOf(req.query.ext) == -1 && this.EXT.indexOf(req.query.ext) > -1) {
            res.sendFile( __dirname+ "/admin/install.html")
            io.once('connection', async (socket) => {
              log('[' + ip + '] Connected to installer Terminal Logs:', this.noLogin ? "noLogin" : req.user , socket.id)
              socket.on('disconnect', (err) => {
                log('[' + ip + '] Disconnected from installer Terminal Logs:', this.noLogin ? "noLogin" : req.user, socket.id, err)
              })
              this.HyperWatch.stream().on('stdData', (data) => {
                if (typeof data == "string") io.to(socket.id).emit("terminal.installer", data.replace(/\r?\n/g, "\r\n"))
              })
            })
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
                this.EXTInstalled= this.lib.tools.searchInstalled(this.EXT)
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
          var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
          if (req.query.ext && this.EXTInstalled.indexOf(req.query.ext) > -1 && this.EXT.indexOf(req.query.ext) > -1) {
            res.sendFile( __dirname+ "/admin/delete.html")
            io.once('connection', async (socket) => {
              log('[' + ip + '] Connected to uninstaller Terminal Logs:', this.noLogin ? "noLogin" : req.user , socket.id)
              socket.on('disconnect', (err) => {
                log('[' + ip + '] Disconnected from uninstaller Terminal Logs:', this.noLogin ? "noLogin" : req.user, socket.id, err)
              })
              this.HyperWatch.stream().on('stdData', (data) => {
                if (typeof data == "string") io.to(socket.id).emit("terminal.delete", data.replace(/\r?\n/g, "\r\n"))
              })
            })
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
            var Command= 'cd ' + modulePath + ' && rm -rfv ' + req.query.EXT
            var child = exec(Command, {cwd : modulePath } , (error, stdout, stderr) => {
              if (error) {
                result.error = true
                console.error(`[GATEWAY][FATAL] exec error: ${error}`)
              } else {
                this.EXTInstalled= this.lib.tools.searchInstalled(this.EXT)
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
          data.schema = this.lib.tools.makeSchemaTranslate(data.schema, this.schemaTranslatation)
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
        var NewConfig = await this.lib.tools.configAddOrModify(data, this.MMConfig)
        var resultSaveConfig = await this.lib.tools.saveConfig(NewConfig)
        console.log("[GATEWAY] Write config result:", resultSaveConfig)
        res.send(resultSaveConfig)
        if (resultSaveConfig.done) {
          this.MMConfig = await this.lib.tools.readConfig()
          this.EXTConfigured= this.lib.tools.searchConfigured(this.MMConfig, this.EXT)
          console.log("[GATEWAY] Reload config")
        }
      })

      .post("/deleteEXT", async (req,res) => {
        console.log("[Gateway] Receiving EXT data ...", req.body)
        let EXTName = req.body.data
        var NewConfig = await this.lib.tools.configDelete(EXTName, this.MMConfig)
        var resultSaveConfig = await this.lib.tools.saveConfig(NewConfig)
        console.log("[GATEWAY] Write config result:", resultSaveConfig)
        res.send(resultSaveConfig)
        if (resultSaveConfig.done) {
          this.MMConfig = await this.lib.tools.readConfig()
          this.EXTConfigured= this.lib.tools.searchConfigured(this.MMConfig, this.EXT)
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
          setTimeout(() => this.lib.tools.restartMM(this.config) , 1000)
        }
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get("/Die" , (req,res) => {
        if(req.user || this.noLogin) {
          res.sendFile(__dirname+ "/admin/die.html")
          setTimeout(() => this.lib.tools.doClose(this.config), 3000)
        }
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get("/EditMMConfig" , (req,res) => {
        if(req.user || this.noLogin) res.sendFile(__dirname+ "/admin/EditMMConfig.html")
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get("/GetBackupName" , async (req,res) => {
        if(req.user || this.noLogin) {
          var names = await this.lib.tools.loadBackupNames()
          res.send(names)
        }
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get("/GetBackupFile" , async (req,res) => {
        if(req.user || this.noLogin) {
          let data = req.query.config
          var file = await this.lib.tools.loadBackupFile(data)
          res.send(file)
        }
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get("/GetRadioStations", (req,res) => {
        if (req.user || this.noLogin) {
          if (!this.radio) return res.status(404).sendFile(__dirname+ "/admin/404.html")
          var allRadio = Object.keys(this.radio)
          res.send(allRadio)
        }
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .post("/loadBackup", async (req,res) => {
        console.log("[Gateway] Receiving backup data ...")
        let file = req.body.data
        var loadFile = await this.lib.tools.loadBackupFile(file)
        var resultSaveConfig = await this.lib.tools.saveConfig(loadFile)
        console.log("[GATEWAY] Write config result:", resultSaveConfig)
        res.send(resultSaveConfig)
        if (resultSaveConfig.done) {
          this.MMConfig = await this.lib.tools.readConfig()
          console.log("[GATEWAY] Reload config")
        }
      })

      .post("/writeConfig", async (req,res) => {
        console.log("[Gateway] Receiving config data ...")
        let data = JSON.parse(req.body.data)
        var resultSaveConfig = await this.lib.tools.saveConfig(data)
        console.log("[GATEWAY] Write config result:", resultSaveConfig)
        res.send(resultSaveConfig)
        if (resultSaveConfig.done) {
          this.MMConfig = await this.lib.tools.readConfig()
          console.log("[GATEWAY] Reload config")
        }
      })
      
      .post("/saveSetting", urlencodedParser, async (req,res) => {
        console.log("[Gateway] Receiving new Setting")
        let data = JSON.parse(req.body.data)
        var NewConfig = await this.lib.tools.configAddOrModify(data, this.MMConfig)
        var resultSaveConfig = await this.lib.tools.saveConfig(NewConfig)
        console.log("[GATEWAY] Write Gateway config result:", resultSaveConfig)
        res.send(resultSaveConfig)
        if (resultSaveConfig.done) {
          this.MMConfig = await this.lib.tools.readConfig()
          console.log("[GATEWAY] Reload config")
        }
      })

      .get("/getWebviewTag", (req,res) => {
        if(req.user || this.noLogin) res.send(this.webviewTag)
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .post("/setWebviewTag", async (req,res) => {
        if(!this.webviewTag && (req.user || this.noLogin)) {
          console.log("[Gateway] Receiving setWebviewTag demand...")
          let NewConfig = await this.lib.tools.setWebviewTag(this.MMConfig)
          var resultSaveConfig = await this.lib.tools.saveConfig(NewConfig)
          console.log("[GATEWAY] Write Gateway webview config result:", resultSaveConfig)
          res.send(resultSaveConfig)
          if (resultSaveConfig.done) {
            this.webviewTag = true
            this.MMConfig = await this.lib.tools.readConfig()
            console.log("[GATEWAY] Reload config")
          }
        }
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get("/getGAVersion", (req,res) => {
        if(req.user || this.noLogin) res.send(this.GACheck)
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .get("/getEXTStatus", (req,res) => {
        if(req.user || this.noLogin) res.send(this.EXTStatus)
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .post("/EXT-Screen", (req, res) => {
        if(req.user || this.noLogin) {
          let data = req.body.data
          if (data == "OFF") {
            this.sendSocketNotification("SendNoti", "EXT_SCREEN-END")
            return res.send("ok")
          }
          if (data == "ON") {
            this.sendSocketNotification("SendNoti", "EXT_SCREEN-WAKEUP")
            return res.send("ok")
          }
          res.send("error")
        }
        else res.send("error")
      })

      .post("/EXT-GAQuery", (req, res) => {
        if(req.user || this.noLogin) {
          let data = req.body.data
          if (!data) return res.send("error")
          this.sendSocketNotification("SendNoti", {
            noti: "GAv4_ACTIVATE",
            payload: {
              type: "TEXT",
              key: data
            }
          })
          res.send("ok")
        }
        else res.send("error")
      })

      .post("/EXT-AlertQuery", (req, res) => {
        if(req.user || this.noLogin) {
          let data = req.body.data
          if (!data) return res.send("error")
          this.sendSocketNotification("SendNoti", {
            noti: "EXT_ALERT",
            payload: {
              type: "information",
              message: data,
              sender: req.user ? req.user.username : 'Gateway',
              timer: 30 * 1000,
              sound: "modules/Gateway/tools/message.mp3",
              icon: "modules/Gateway/admin/assets/img/gateway.jpg"
            }
          })
          res.send("ok")
        }
        else res.send("error")
      })

      .post("/EXT-VolumeSend", (req, res) => {
        if(req.user || this.noLogin) {
          let data = req.body.data
          if (!data) return res.send("error")
          this.sendSocketNotification("SendNoti", {
            noti: "EXT_VOLUME-SET",
            payload: data
          })
          res.send("ok")
        }
        else res.send("error")
      })

      .post("/EXT-SpotifyQuery", (req, res) => {
        if(req.user || this.noLogin) {
          let result = req.body.data
          if (!result) return res.send("error")
          let query = req.body.data.query
          let type = req.body.data.type
          if (!query || !type ) return res.send("error")
          var pl = {
            type: type,
            query: query,
            random: false
          }
          this.sendSocketNotification("SendNoti", {
            noti: "EXT_SPOTIFY-SEARCH",
            payload: pl
          })
          res.send("ok")
        }
        else res.send("error")
      })

      .post("/EXT-SpotifyPlay", (req, res) => {
        if(req.user || this.noLogin) {
          this.sendSocketNotification("SendNoti", "EXT_SPOTIFY-PLAY")
          res.send("ok")
        }
        else res.send("error")
      })

      .post("/EXT-SpotifyStop", (req, res) => {
        if(req.user || this.noLogin) {
          this.sendSocketNotification("SendNoti", "EXT_SPOTIFY-STOP")
          res.send("ok")
        }
        else res.send("error")
      })

      .post("/EXT-SpotifyNext", (req, res) => {
        if(req.user || this.noLogin) {
          this.sendSocketNotification("SendNoti", "EXT_SPOTIFY-NEXT")
          res.send("ok")
        }
        else res.send("error")
      })

      .post("/EXT-SpotifyPrevious", (req, res) => {
        if(req.user || this.noLogin) {
          this.sendSocketNotification("SendNoti", "EXT_SPOTIFY-PREVIOUS")
          res.send("ok")
        }
        else res.send("error")
      })

      .post("/EXT-UNUpdate", (req, res) => {
        if(req.user || this.noLogin) {
          this.sendSocketNotification("SendNoti", "EXT_UPDATENOTIFICATION-UPDATE")
          res.send("ok")
        }
        else res.send("error")
      })

      .post("/EXT-YouTubeQuery", (req, res) => {
        if(req.user || this.noLogin) {
          let data = req.body.data
          if (!data) return res.send("error")
          if (this.EXTStatus["EXT-YouTube"].hello) {
            this.sendSocketNotification("SendNoti", {
              noti: "EXT_YOUTUBE-SEARCH",
              payload: data
            })
            res.send("ok")
          } else if (this.EXTStatus["EXT-YouTubeVLC"].hello) {
            this.sendSocketNotification("SendNoti", {
              noti: "EXT_YOUTUBEVLC-SEARCH",
              payload: data
            })
            res.send("ok")
          } else {
            res.send("error")
          }
        }
        else res.send("error")
      })

      .post("/EXT-FreeboxTVQuery", (req, res) => {
        if(req.user || this.noLogin || !this.freeteuse) {
          let data = req.body.data
          if (!data) return res.send("error")
          this.sendSocketNotification("SendNoti", {
            noti: "EXT_FREEBOXTV-PLAY",
            payload: data
          })
          res.send("ok")
        }
        else res.send("error")
      })

      .post("/EXT-RadioQuery", (req, res) => {
        if(req.user || this.noLogin) {
          let data = req.body.data
          if (!data) return res.send("error")
          try {
            var toListen= this.radio[data].notificationExec.payload()
            this.sendSocketNotification("SendNoti", {
              noti: "EXT_RADIO-START",
              payload: toListen
            })
          } catch (e) {
            res.send("error")
          }
          res.send("ok")
        }
        else res.send("error")
      })

      .post("/EXT-StopQuery", (req, res) => {
        if(req.user || this.noLogin) {
          this.sendSocketNotification("SendStop")
          this.sendSocketNotification("SendNoti", "EXT_STOP")
          res.send("ok")
        }
        else res.send("error")
      })

      .post("/deleteBackup", async (req,res) => {
        if(req.user || this.noLogin) {
          console.log("[GATEWAY] Receiving delete backup demand...")
          var deleteBackup = await this.lib.tools.deleteBackup()
          console.log("[GATEWAY] Delete backup result:", deleteBackup)
          res.send(deleteBackup)
        }
        else res.status(403).sendFile(__dirname+ "/admin/403.html")
      })

      .use("/jsoneditor" , express.static(__dirname + '/node_modules/jsoneditor'))
      .use("/xterm" , express.static(__dirname + '/node_modules/xterm'))
      .use("/xterm-addon-fit" , express.static(__dirname + '/node_modules/xterm-addon-fit'))

      .use(function(req, res) {
        console.warn("[GATEWAY] Don't find:", req.url)
        res.status(404).sendFile(__dirname+ "/admin/404.html")
      })
          
    /** Create Server **/
    this.config.listening = await this.lib.tools.purposeIP()
    this.HyperWatch = hyperwatch(this.server.listen(this.config.port, this.config.listening, async () => {
      console.log("[GATEWAY] Start listening on http://"+ this.config.listening + ":" + this.config.port)
      if (this.config.useMapping) {
        console.log("[GATEWAY][UPNP] Try to Mapping port with upnp")
        this.Mapping = await this.lib.tools.portMapping(this.config, this.loginWarn)
        if (this.Mapping.done) console.log("[GATEWAY][UPNP] Start listening on http://"+this.Mapping.ip+":" + this.config.portMapping)
        else console.error("[GATEWAY][UPNP] Mapping error !")
      }
      else await this.lib.tools.portMappingDelete()
    }))
    this.initialized= true
  },

  /** passport local strategy with username/password defined on config **/
  passportConfig: function() {
    passport.use('login', new LocalStrategy(
      (username, password, done) => {
        if (username === this.user.username && password === this.user.password) {
          return done(null, this.user)
        }
        else done(null, false, { message: this.translation["Login_Error"] })
      }
    ))

    passport.serializeUser((user, done) => {
      done(null, user._id)
    })

    passport.deserializeUser((id, done) => {
      done(null, this.user)
    })
  },

  logRequest: function(req, res, next) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    log("[" + ip + "][" + req.method + "] " + req.url)
    next()
  }
})
