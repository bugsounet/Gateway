var log = (...args) => { /* do nothing */ }
var express = require("express")
const http = require('http')
var semver = require('semver')
var bodyParser = require('body-parser')
var session = require('express-session')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
const { Server } = require("socket.io")
var cors = require("cors")
var hyperwatch = require("../tools/hyperwatch.js")
const path = require("path")
var exec = require("child_process").exec
const fetch = require("node-fetch")

/** init function **/
function initialize(that) {
  if (that.config.debug) log = (...args) => { console.log("[GATEWAY]", ...args) }

  console.log("[GATEWAY] Init app...")
  log("EXT plugins in database:", that.EXT.length)
  if (!that.config.username && !that.config.password) {
    console.error("[GATEWAY] Your have not defined user/password in config!")
    console.error("[GATEWAY] Using default creadentials")
  } else {
    if ((that.config.username == that.user.username) || (that.config.password == that.user.password)) {
      console.warn("[GATEWAY] WARN: You are using default username or default password")
      console.warn("[GATEWAY] WARN: Don't forget to change it!")
    }
    that.user.username = that.config.username
    that.user.password = that.config.password
  }
  passportConfig(that)

  that.app = express()
  that.server = http.createServer(that.app)
  that.EXTConfigured= that.lib.tools.searchConfigured(that.MMConfig, that.EXT)
  that.EXTInstalled= that.lib.tools.searchInstalled(that.EXT)
  log("Find", that.EXTInstalled.length , "installed plugins in MagicMirror")
  log("Find", that.EXTConfigured.length, "configured plugins in config file")
  if (that.GACheck.version && semver.gte(that.GACheck.version, '4.0.0')) {
    that.GACheck.find = true
    log("Find MMM-GoogleAssistant v" + that.GACheck.version)
  }
  else console.warn("[GATEWAY] MMM-GoogleAssistant Not Found!")
  if (Object.keys(that.GAConfig).length > 0) {
    log("Find MMM-GoogleAssistant configured in MagicMirror")
    that.GACheck.configured = true
  }
  else log("MMM-GoogleAssistant is not configured!")
  log("webviewTag Configured:", that.webviewTag)
  log("Language set", that.language)
  create(that)
}

/** Middleware **/
async function create(that) {
  if (that.config.debug) log = (...args) => { console.log("[GATEWAY]", ...args) }

  var Path = that.path
  var urlencodedParser = bodyParser.urlencoded({ extended: true })
  log("Create all needed routes...")
  that.app.use(session({
    secret: 'some-secret',
    saveUninitialized: false,
    resave: true
  }))

  // For parsing post request's data/body
  that.app.use(bodyParser.json())
  that.app.use(bodyParser.urlencoded({ extended: true }))

  // Tells app to use password session
  that.app.use(passport.initialize())
  that.app.use(passport.session())

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

  var healthDownloader = function(req, res) {
    res.redirect('/')
  }

  var io = new Server(that.server)

  that.app
    .use(logRequest)
    .use(cors({ origin: '*' }))
    .use('/EXT_Tools.js', express.static(Path + '/tools/EXT_Tools.js'))
    .use('/assets', express.static(Path + '/admin/assets', options))
    .get('/', (req, res) => {
      if(req.user) res.sendFile(Path+ "/admin/index.html")
      else res.redirect('/login')
    })

    .get("/version" , (req,res) => {
        let remoteFile = "https://raw.githubusercontent.com/bugsounet/Gateway/master/package.json"
        var result = {
          v: require('../package.json').version,
          rev: require('../package.json').rev,
          lang: that.language,
          last: 0,
          needUpdate: false
        }
        fetch(remoteFile)
          .then(response => response.json())
          .then(data => {
            result.last = data.version
            if (semver.gt(result.last, result.v)) result.needUpdate = true
            res.send(result)
          })
          .catch(e => {
            console.error("[GATEWAY] Error on fetch last version number")
            res.send(result)
          })

    })

    .get("/translation" , (req,res) => {
        res.send(that.translation)
    })

    .get('/EXT', (req, res) => {
      if(req.user) res.sendFile(Path+ "/admin/EXT.html")
      else res.redirect('/login')
    })

    .get('/login', (req, res) => {
      if (req.user) res.redirect('/')
      res.sendFile(Path+ "/admin/login.html")
    })

    .post('/auth', (req, res, next) => {
      var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
      passport.authenticate('login', (err, user, info) => {
        if (err) {
          console.log("[GATEWAY] [" + ip + "] Error", err)
          return next(err)
        }
        if (!user) {
          console.log("[GATEWAY] [" + ip + "] Bad Login", info)
          return res.send({ err: info })
        }
        req.logIn(user, err => {
          if (err) {
            console.log("[GATEWAY] [" + ip + "] Login error:", err)
            return res.send({ err: err })
          }
          console.log("[GATEWAY] [" + ip + "] Welcome " + user.username + ", happy to serve you!")
          return res.send({ login: true })
        })
      })(req, res, next)
    })

    .get('/logout', (req, res) => {
      req.logout(err => {
        if (err) { return console.error("[GATEWAY] Logout:", err) }
        res.redirect('/')
      })
    })

    .get('/AllEXT', (req, res) => {
      if(req.user) res.send(that.EXT)
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get('/DescriptionEXT', (req, res) => {
      if(req.user) res.send(that.EXTDescription)
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get('/InstalledEXT', (req, res) => {
      if(req.user) res.send(that.EXTInstalled)
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get('/ConfiguredEXT', (req, res) => {
      if(req.user) res.send(that.EXTConfigured)
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get('/GetMMConfig', (req, res) => {
      if(req.user) res.send(that.MMConfig)
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get("/Terminal" , (req,res) => {
      if(req.user) {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        res.sendFile( Path+ "/admin/terminal.html")
        //var ioLogs = new Server(that.server)
        io.once('connection', async (socket) => {
          log('[' + ip + '] Connected to Terminal Logs:', req.user.username)
          socket.on('disconnect', (err) => {
            log('[' + ip + '] Disconnected from Terminal Logs:', req.user.username, "[" + err + "]")
          })
          var pastLogs = await that.lib.tools.readAllMMLogs(that.HyperWatch.logs())
          io.emit("terminal.logs", pastLogs)
          that.HyperWatch.stream().on('stdData', (data) => {
            if (typeof data == "string") io.to(socket.id).emit("terminal.logs", data.replace(/\r?\n/g, "\r\n"))
          })
        })
      }
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get("/ptyProcess" , (req,res) => {
      if(req.user) {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        res.sendFile( Path+ "/admin/pty.html")
        io.once('connection', (client) => {
          log('[' + ip + '] Connected to Terminal:', req.user.username)
          client.on('disconnect', (err) => {
            log('[' + ip + '] Disconnected from Terminal:', req.user.username, "[" + err + "]")
          })
          var cols = 80
          var rows = 24
          var ptyProcess = that.lib.pty.spawn("bash", [], {
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
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get("/install" , (req,res) => {
      if(req.user) {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        if (req.query.ext && that.EXTInstalled.indexOf(req.query.ext) == -1 && that.EXT.indexOf(req.query.ext) > -1) {
          res.sendFile( Path+ "/admin/install.html")
          io.once('connection', async (socket) => {
            log('[' + ip + '] Connected to installer Terminal Logs:', req.user.username)
            socket.on('disconnect', (err) => {
              log('[' + ip + '] Disconnected from installer Terminal Logs:', req.user.username, "[" + err + "]")
            })
            that.HyperWatch.stream().on('stdData', (data) => {
              if (typeof data == "string") io.to(socket.id).emit("terminal.installer", data.replace(/\r?\n/g, "\r\n"))
            })
          })
        }
        else res.status(404).sendFile(Path+ "/admin/404.html")
      }
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get("/EXTInstall" , (req,res) => {
      if(req.user) {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        if (req.query.EXT && that.EXTInstalled.indexOf(req.query.EXT) == -1 && that.EXT.indexOf(req.query.EXT) > -1) {
          console.log("[GATEWAY]["+ip+"] Request installation:", req.query.EXT)
          var result = {
            error: false
          }
          var modulePath = path.normalize(Path + "/../")
          var Command= 'cd ' + modulePath + ' && git clone https://github.com/bugsounet/' + req.query.EXT + ' && cd ' + req.query.EXT + ' && npm install'

          var child = exec(Command, {cwd : modulePath } , (error, stdout, stderr) => {
            if (error) {
              result.error = true
              console.error(`[GATEWAY][FATAL] exec error: ${error}`)
            } else {
              that.EXTInstalled= that.lib.tools.searchInstalled(that.EXT)
              console.log("[GATEWAY][DONE]", req.query.EXT)
            }
            res.json(result)
          })
          child.stdout.pipe(process.stdout)
          child.stderr.pipe(process.stdout)
        }
        else res.status(404).sendFile(Path+ "/admin/404.html")
      }
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get("/delete" , (req,res) => {
      if(req.user) {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        if (req.query.ext && that.EXTInstalled.indexOf(req.query.ext) > -1 && that.EXT.indexOf(req.query.ext) > -1) {
          res.sendFile( Path+ "/admin/delete.html")
          io.once('connection', async (socket) => {
            log('[' + ip + '] Connected to uninstaller Terminal Logs:', req.user.username)
            socket.on('disconnect', (err) => {
              log('[' + ip + '] Disconnected from uninstaller Terminal Logs:', req.user.username, "[" + err + "]")
            })
            that.HyperWatch.stream().on('stdData', (data) => {
              if (typeof data == "string") io.to(socket.id).emit("terminal.delete", data.replace(/\r?\n/g, "\r\n"))
            })
          })
        }
        else res.status(404).sendFile(Path+ "/admin/404.html")
      }
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get("/EXTDelete" , (req,res) => {
      if(req.user) {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        if (req.query.EXT && that.EXTInstalled.indexOf(req.query.EXT) > -1 && that.EXT.indexOf(req.query.EXT) > -1) {
          console.log("[GATEWAY]["+ip+"] Request delete:", req.query.EXT)
          var result = {
            error: false
          }
          var modulePath = path.normalize(Path + "/../")
          var Command= 'cd ' + modulePath + ' && rm -rfv ' + req.query.EXT
          var child = exec(Command, {cwd : modulePath } , (error, stdout, stderr) => {
            if (error) {
              result.error = true
              console.error(`[GATEWAY][FATAL] exec error: ${error}`)
            } else {
              that.EXTInstalled= that.lib.tools.searchInstalled(that.EXT)
              console.log("[GATEWAY][DONE]", req.query.EXT)
            }
            res.json(result)
          })
          child.stdout.pipe(process.stdout)
          child.stderr.pipe(process.stdout)
        }
        else res.status(404).sendFile(Path+ "/admin/404.html")
      }
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get("/MMConfig" , (req,res) => {
      if(req.user) res.sendFile( Path+ "/admin/mmconfig.html")
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get("/EXTCreateConfig" , (req,res) => {
      if(req.user) {
        if (req.query.ext &&
          that.EXTInstalled.indexOf(req.query.ext) > -1 && // is installed
          that.EXT.indexOf(req.query.ext) > -1 &&  // is an EXT
          that.EXTConfigured.indexOf(req.query.ext) == -1 // is not configured
        ) {
          res.sendFile( Path+ "/admin/EXTCreateConfig.html")
        }
        else res.status(404).sendFile(Path+ "/admin/404.html")
      }
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get("/EXTModifyConfig" , (req,res) => {
      if(req.user) {
        if (req.query.ext &&
          that.EXTInstalled.indexOf(req.query.ext) > -1 && // is installed
          that.EXT.indexOf(req.query.ext) > -1 &&  // is an EXT
          that.EXTConfigured.indexOf(req.query.ext) > -1 // is configured
        ) {
          res.sendFile( Path+ "/admin/EXTModifyConfig.html")
        }
        else res.status(404).sendFile(Path+ "/admin/404.html")
      }
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get("/EXTDeleteConfig" , (req,res) => {
      if(req.user) {
        if (req.query.ext &&
          that.EXTInstalled.indexOf(req.query.ext) == -1 && // is not installed
          that.EXT.indexOf(req.query.ext) > -1 &&  // is an EXT
          that.EXTConfigured.indexOf(req.query.ext) > -1 // is configured
        ) {
          res.sendFile( Path+ "/admin/EXTDeleteConfig.html")
        }
        else res.status(404).sendFile(Path+ "/admin/404.html")
      }
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get("/EXTGetCurrentConfig" , (req,res) => {
      if(req.user) {
        if(!req.query.ext) return res.status(404).sendFile(Path+ "/admin/404.html")
        var index = that.MMConfig.modules.map(e => { return e.module }).indexOf(req.query.ext)
        if (index > -1) {
          let data = that.MMConfig.modules[index]
          return res.send(data)
        }
        res.status(404).sendFile(Path+ "/admin/404.html")
      }
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get("/EXTGetDefaultConfig" , (req,res) => {
      if(req.user) {
        if(!req.query.ext) return res.status(404).sendFile(Path+ "/admin/404.html")
        let data = require("./config/"+req.query.ext+"/config.js")
        res.send(data.default)
      }
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get("/EXTGetDefaultTemplate" , (req,res) => {
      if(req.user) {
        if(!req.query.ext) return res.status(404).sendFile(Path+ "/admin/404.html")
        let data = require("./config/"+req.query.ext+"/config.js")
        data.schema = that.lib.tools.makeSchemaTranslate(data.schema, that.schemaTranslatation)
        res.send(data.schema)
      }
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get("/EXTSaveConfig" , (req,res) => {
      if(req.user) {
        if(!req.query.config) return res.status(404).sendFile(Path+ "/admin/404.html")
        let data = req.query.config
        res.send(data)
      }
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .post("/writeEXT", async (req,res) => {
      console.log("[Gateway] Receiving EXT data ...")
      let data = JSON.parse(req.body.data)
      var NewConfig = await that.lib.tools.configAddOrModify(data, that.MMConfig)
      var resultSaveConfig = await that.lib.tools.saveConfig(NewConfig)
      console.log("[GATEWAY] Write config result:", resultSaveConfig)
      res.send(resultSaveConfig)
      if (resultSaveConfig.done) {
        that.MMConfig = await that.lib.tools.readConfig()
        that.EXTConfigured= that.lib.tools.searchConfigured(that.MMConfig, that.EXT)
        console.log("[GATEWAY] Reload config")
      }
    })

    .post("/deleteEXT", async (req,res) => {
      console.log("[Gateway] Receiving EXT data ...", req.body)
      let EXTName = req.body.data
      var NewConfig = await that.lib.tools.configDelete(EXTName, that.MMConfig)
      var resultSaveConfig = await that.lib.tools.saveConfig(NewConfig)
      console.log("[GATEWAY] Write config result:", resultSaveConfig)
      res.send(resultSaveConfig)
      if (resultSaveConfig.done) {
        that.MMConfig = await that.lib.tools.readConfig()
        that.EXTConfigured= that.lib.tools.searchConfigured(that.MMConfig, that.EXT)
        console.log("[GATEWAY] Reload config")
      }
    })

    .get("/Tools" , (req,res) => {
      if(req.user) res.sendFile(Path+ "/admin/tools.html")
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get("/Setting" , (req,res) => {
      if(req.user) res.sendFile(Path+ "/admin/setting.html")
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get("/getSetting", (req,res) => {
      if(req.user) res.send(that.config)
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get("/Restart" , (req,res) => {
      if(req.user) {
        res.sendFile(Path+ "/admin/restarting.html")
        setTimeout(() => that.lib.tools.restartMM(that.config) , 1000)
      }
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get("/Die" , (req,res) => {
      if(req.user) {
        res.sendFile(Path+ "/admin/die.html")
        setTimeout(() => that.lib.tools.doClose(that.config), 3000)
      }
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get("/EditMMConfig" , (req,res) => {
      if(req.user) res.sendFile(Path+ "/admin/EditMMConfig.html")
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get("/GetBackupName" , async (req,res) => {
      if(req.user) {
        var names = await that.lib.tools.loadBackupNames()
        res.send(names)
      }
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get("/GetBackupFile" , async (req,res) => {
      if(req.user) {
        let data = req.query.config
        var file = await that.lib.tools.loadBackupFile(data)
        res.send(file)
      }
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get("/GetRadioStations", (req,res) => {
      if (req.user) {
        if (!that.radio) return res.status(404).sendFile(Path+ "/admin/404.html")
        var allRadio = Object.keys(that.radio)
        res.send(allRadio)
      }
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .post("/loadBackup", async (req,res) => {
      console.log("[Gateway] Receiving backup data ...")
      let file = req.body.data
      var loadFile = await that.lib.tools.loadBackupFile(file)
      var resultSaveConfig = await that.lib.tools.saveConfig(loadFile)
      console.log("[GATEWAY] Write config result:", resultSaveConfig)
      res.send(resultSaveConfig)
      if (resultSaveConfig.done) {
        that.MMConfig = await that.lib.tools.readConfig()
        console.log("[GATEWAY] Reload config")
      }
    })

    .post("/writeConfig", async (req,res) => {
      console.log("[Gateway] Receiving config data ...")
      let data = JSON.parse(req.body.data)
      var resultSaveConfig = await that.lib.tools.saveConfig(data)
      console.log("[GATEWAY] Write config result:", resultSaveConfig)
      res.send(resultSaveConfig)
      if (resultSaveConfig.done) {
        that.MMConfig = await that.lib.tools.readConfig()
        console.log("[GATEWAY] Reload config")
      }
    })

    .post("/saveSetting", urlencodedParser, async (req,res) => {
      console.log("[Gateway] Receiving new Setting")
      let data = JSON.parse(req.body.data)
      var NewConfig = await that.lib.tools.configAddOrModify(data, that.MMConfig)
      var resultSaveConfig = await that.lib.tools.saveConfig(NewConfig)
      console.log("[GATEWAY] Write Gateway config result:", resultSaveConfig)
      res.send(resultSaveConfig)
      if (resultSaveConfig.done) {
        that.MMConfig = await that.lib.tools.readConfig()
        console.log("[GATEWAY] Reload config")
      }
    })

    .get("/getWebviewTag", (req,res) => {
      if(req.user) res.send(that.webviewTag)
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .post("/setWebviewTag", async (req,res) => {
      if(!that.webviewTag && req.user) {
        console.log("[Gateway] Receiving setWebviewTag demand...")
        let NewConfig = await that.lib.tools.setWebviewTag(that.MMConfig)
        var resultSaveConfig = await that.lib.tools.saveConfig(NewConfig)
        console.log("[GATEWAY] Write Gateway webview config result:", resultSaveConfig)
        res.send(resultSaveConfig)
        if (resultSaveConfig.done) {
          that.webviewTag = true
          that.MMConfig = await that.lib.tools.readConfig()
          console.log("[GATEWAY] Reload config")
        }
      }
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get("/getGAVersion", (req,res) => {
      if(req.user) res.send(that.GACheck)
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get("/getEXTStatus", (req,res) => {
      if(req.user) res.send(that.EXTStatus)
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .post("/EXT-Screen", (req, res) => {
      if(req.user) {
        let data = req.body.data
        if (data == "OFF") {
          that.sendSocketNotification("SendNoti", "EXT_SCREEN-END")
          return res.send("ok")
        }
        if (data == "ON") {
          that.sendSocketNotification("SendNoti", "EXT_SCREEN-WAKEUP")
          return res.send("ok")
        }
        res.send("error")
      }
      else res.send("error")
    })

    .post("/EXT-GAQuery", (req, res) => {
      if(req.user) {
        let data = req.body.data
        if (!data) return res.send("error")
        that.sendSocketNotification("SendNoti", {
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
      if(req.user) {
        let data = req.body.data
        if (!data) return res.send("error")
        that.sendSocketNotification("SendNoti", {
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

    .post("/EXT-VolumeSendSpeaker", (req, res) => {
      if(req.user) {
        let data = req.body.data
        if (!data) return res.send("error")
        that.sendSocketNotification("SendNoti", {
          noti: "EXT_VOLUME-SPEAKER_SET",
          payload: data
        })
        res.send("ok")
      }
      else res.send("error")
    })

    .post("/EXT-VolumeSendRecorder", (req, res) => {
      if(req.user) {
        let data = req.body.data
        if (!data) return res.send("error")
        that.sendSocketNotification("SendNoti", {
          noti: "EXT_VOLUME-RECORDER_SET",
          payload: data
        })
        res.send("ok")
      }
      else res.send("error")
    })

    .post("/EXT-SpotifyQuery", (req, res) => {
      if(req.user) {
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
        that.sendSocketNotification("SendNoti", {
          noti: "EXT_SPOTIFY-SEARCH",
          payload: pl
        })
        res.send("ok")
      }
      else res.send("error")
    })

    .post("/EXT-SpotifyPlay", (req, res) => {
      if(req.user) {
        that.sendSocketNotification("SendNoti", "EXT_SPOTIFY-PLAY")
        res.send("ok")
      }
      else res.send("error")
    })

    .post("/EXT-SpotifyStop", (req, res) => {
      if(req.user) {
        that.sendSocketNotification("SendNoti", "EXT_SPOTIFY-STOP")
        res.send("ok")
      }
      else res.send("error")
    })

    .post("/EXT-SpotifyNext", (req, res) => {
      if(req.user) {
        that.sendSocketNotification("SendNoti", "EXT_SPOTIFY-NEXT")
        res.send("ok")
      }
      else res.send("error")
    })

    .post("/EXT-SpotifyPrevious", (req, res) => {
      if(req.user) {
        that.sendSocketNotification("SendNoti", "EXT_SPOTIFY-PREVIOUS")
        res.send("ok")
      }
      else res.send("error")
    })

    .post("/EXT-UNUpdate", (req, res) => {
      if(req.user) {
        that.sendSocketNotification("SendNoti", "EXT_UPDATENOTIFICATION-UPDATE")
        res.send("ok")
      }
      else res.send("error")
    })

    .post("/EXT-YouTubeQuery", (req, res) => {
      if(req.user) {
        let data = req.body.data
        if (!data) return res.send("error")
        if (that.EXTStatus["EXT-YouTube"].hello) {
          that.sendSocketNotification("SendNoti", {
            noti: "EXT_YOUTUBE-SEARCH",
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
      if(req.user || !that.freeteuse) {
        let data = req.body.data
        if (!data) return res.send("error")
        that.sendSocketNotification("SendNoti", {
          noti: "EXT_FREEBOXTV-PLAY",
          payload: data
        })
        res.send("ok")
      }
      else res.send("error")
    })

    .post("/EXT-RadioQuery", (req, res) => {
      if(req.user) {
        let data = req.body.data
        if (!data) return res.send("error")
        try {
          var toListen= that.radio[data].notificationExec.payload()
          that.sendSocketNotification("SendNoti", {
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
      if(req.user) {
        that.sendSocketNotification("SendStop")
        that.sendSocketNotification("SendNoti", "EXT_STOP")
        res.send("ok")
      }
      else res.send("error")
    })

    .post("/deleteBackup", async (req,res) => {
      if(req.user) {
        console.log("[GATEWAY] Receiving delete backup demand...")
        var deleteBackup = await that.lib.tools.deleteBackup()
        console.log("[GATEWAY] Delete backup result:", deleteBackup)
        res.send(deleteBackup)
      }
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .post("/readExternalBackup", async (req,res) => {
      if(req.user) {
        let data = req.body.data
        if (!data) return res.send({error: "error"})
        console.log("[GATEWAY] Receiving External backup...")
        var transformExternalBackup = await that.lib.tools.transformExternalBackup(data)
        res.send({ data: transformExternalBackup })
      }
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .post("/saveExternalBackup", async (req,res) => {
      if(req.user) {
        let data = req.body.data
        if (!data) return res.send({error: "error"})
        console.log("[GATEWAY] Receiving External backup...")
        var linkExternalBackup = await that.lib.tools.saveExternalConfig(data)
        if (linkExternalBackup.data) {
          console.log("[GATEWAY] Generate link number:", linkExternalBackup.data)
          healthDownloader = (req_, res_) => {
            if (req_.params[0] == linkExternalBackup.data) {
              res_.sendFile(Path + '/download/'+ linkExternalBackup.data + '.js')
              healthDownloader = function(req_, res_) {
                res_.redirect('/')
              }
              setTimeout(() => {
                that.lib.tools.deleteDownload(linkExternalBackup.data)
              }, 1000 * 10)
            } else {
              res_.redirect('/')
            }
          }
        }
        res.send(linkExternalBackup)
      }
      else res.status(403).sendFile(Path+ "/admin/403.html")
    })

    .get("/download/*", (req,res) => {
      healthDownloader(req, res)
    })

    .get("/robots.txt", (req,res) => {
      res.sendFile(Path+ "/admin/robots.txt")
    })

    .use("/jsoneditor" , express.static(Path + '/node_modules/jsoneditor'))
    .use("/xterm" , express.static(Path + '/node_modules/xterm'))
    .use("/xterm-addon-fit" , express.static(Path + '/node_modules/xterm-addon-fit'))

    .use(function(req, res) {
      console.warn("[GATEWAY] Don't find:", req.url)
      res.status(404).sendFile(Path+ "/admin/404.html")
    })

  /** Create Server **/
  that.config.listening = await that.lib.tools.purposeIP()
  that.HyperWatch = hyperwatch(that.server.listen(that.config.port, that.config.listening, () => {
    console.log("[GATEWAY] Start listening on http://"+ that.config.listening + ":" + that.config.port)
  }))
  that.initialized= true
}

/** passport local strategy with username/password defined on config **/
function passportConfig(that) {
  passport.use('login', new LocalStrategy(
    (username, password, done) => {
      if (username === that.user.username && password === that.user.password) {
        return done(null, that.user)
      }
      else done(null, false, { message: that.translation["Login_Error"] })
    }
  ))

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser((id, done) => {
    done(null, that.user)
  })
}

function logRequest(req, res, next) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  log("[" + ip + "][" + req.method + "] " + req.url)
  next()
}

exports.initialize = initialize

