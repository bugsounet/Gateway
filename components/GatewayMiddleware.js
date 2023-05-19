var log = (...args) => { /* do nothing */ }

/** init function **/
function initialize(that) {
  if (that.config.debug) log = (...args) => { console.log("[GATEWAY]", ...args) }

  log("EXT plugins in database:", that.Gateway.EXT.length)
  if (!that.config.username && !that.config.password) {
    console.error("[GATEWAY] Your have not defined user/password in config!")
    console.error("[GATEWAY] Using default credentials")
  } else {
    if ((that.config.username == that.Gateway.user.username) || (that.config.password == that.Gateway.user.password)) {
      console.warn("[GATEWAY] WARN: You are using default username or default password")
      console.warn("[GATEWAY] WARN: Don't forget to change it!")
    }
    that.Gateway.user.username = that.config.username
    that.Gateway.user.password = that.config.password
  }
  passportConfig(that)

  that.Gateway.app = that.lib.express()
  that.Gateway.server = that.lib.http.createServer(that.Gateway.app)
  that.Gateway.EXTConfigured= that.lib.GWTools.searchConfigured(that.Gateway.MMConfig, that.Gateway.EXT)
  that.Gateway.EXTInstalled= that.lib.GWTools.searchInstalled(that)
  log("Find", that.Gateway.EXTInstalled.length , "installed plugins in MagicMirror")
  log("Find", that.Gateway.EXTConfigured.length, "configured plugins in config file")
  if (that.Gateway.GACheck.version && that.lib.semver.gte(that.Gateway.GACheck.version, '5.1.0')) {
    that.Gateway.GACheck.find = true
    log("Find MMM-GoogleAssistant v" + that.Gateway.GACheck.version)
  }
  else console.warn("[GATEWAY] MMM-GoogleAssistant Not Found!")
  if (Object.keys(that.Gateway.GAConfig).length > 0) {
    log("Find MMM-GoogleAssistant configured in MagicMirror")
    that.Gateway.GACheck.configured = true
  }
  else log("MMM-GoogleAssistant is not configured!")
  log("webviewTag Configured:", that.Gateway.webviewTag)
  log("Language set", that.Gateway.language)
  createGW(that)
}

/** Gateway Middleware **/
function createGW(that) {
  if (that.config.debug) log = (...args) => { console.log("[GATEWAY]", ...args) }

  var Path = that.path
  var urlencodedParser = that.lib.bodyParser.urlencoded({ extended: true })
  log("Create Gateway needed routes...")
  that.Gateway.app.use(that.lib.session({
    secret: 'some-secret',
    saveUninitialized: false,
    resave: true
  }))

  // For parsing post request's data/body
  that.Gateway.app.use(that.lib.bodyParser.json())
  that.Gateway.app.use(that.lib.bodyParser.urlencoded({ extended: true }))

  // Tells app to use password session
  that.Gateway.app.use(that.lib.passport.initialize())
  that.Gateway.app.use(that.lib.passport.session())

  var options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ["css", "js"],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
      res.set('x-timestamp', Date.now())
    }
  }

  var healthDownloader = function(req, res) {
    res.redirect('/')
  }

  var io = new that.lib.Socket.Server(that.Gateway.server)

  that.Gateway.app
    .use(logRequest)
    .use(that.lib.cors({ origin: '*' }))
    .use('/EXT_Login.js', that.lib.express.static(Path + '/tools/EXT_Login.js'))
    .use('/EXT_Home.js', that.lib.express.static(Path + '/tools/EXT_Home.js'))
    .use('/EXT_Plugins.js', that.lib.express.static(Path + '/tools/EXT_Plugins.js'))
    .use('/EXT_Terminal.js', that.lib.express.static(Path + '/tools/EXT_Terminal.js'))
    .use('/EXT_MMConfig.js', that.lib.express.static(Path + '/tools/EXT_MMConfig.js'))
    .use('/EXT_Tools.js', that.lib.express.static(Path + '/tools/EXT_Tools.js'))
    .use('/EXT_System.js', that.lib.express.static(Path + '/tools/EXT_System.js'))
    .use('/EXT_Setting.js', that.lib.express.static(Path + '/tools/EXT_Setting.js'))
    .use('/EXT_Restart.js', that.lib.express.static(Path + '/tools/EXT_Restart.js'))
    .use('/EXT_Die.js', that.lib.express.static(Path + '/tools/EXT_Die.js'))
    .use('/EXT_Fetch.js', that.lib.express.static(Path + '/tools/EXT_Fetch.js'))
    .use('/assets', that.lib.express.static(Path + '/website/assets', options))
    .use("/jsoneditor" , that.lib.express.static(Path + '/node_modules/jsoneditor'))
    .use("/xterm" , that.lib.express.static(Path + '/node_modules/xterm'))
    .use("/xterm-addon-fit" , that.lib.express.static(Path + '/node_modules/xterm-addon-fit'))

    .get('/', (req, res) => {
      if(req.user) res.sendFile(Path+ "/website/Gateway/index.html")
      else res.redirect('/login')
    })

    .get("/version" , (req,res) => {
        let remoteFile = "https://raw.githubusercontent.com/bugsounet/Gateway/master/package.json"
        var result = {
          v: require('../package.json').version,
          rev: require('../package.json').rev,
          lang: that.Gateway.language,
          last: 0,
          imperial: (that.Gateway.MMConfig.units == "imperial") ? true : false,
          needUpdate: false
        }
        that.lib.fetch(remoteFile)
          .then(response => response.json())
          .then(data => {
            result.last = data.version
            if (that.lib.semver.gt(result.last, result.v)) result.needUpdate = true
            res.send(result)
          })
          .catch(e => {
            console.error("[GATEWAY] Error on fetch last version number")
            res.send(result)
          })
    })

    .get("/systemInformation" , async (req, res) => {
      if (req.user) {
        that.Gateway.systemInformation.result = await that.Gateway.systemInformation.lib.Get()
        res.send(that.Gateway.systemInformation.result)
      } else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/translation" , (req,res) => {
      res.send(that.Gateway.translation)
    })

    .get("/homeText", (req,res) => {
      res.send({text: that.Gateway.homeText})
    })

    .get('/EXT', (req, res) => {
      if(req.user) res.sendFile(Path+ "/website/Gateway/EXT.html")
      else res.redirect('/login')
    })

    .get('/login', (req, res) => {
      if (req.user) res.redirect('/')
      res.sendFile(Path+ "/website/Gateway/login.html")
    })

    .post('/auth', (req, res, next) => {
      var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
      that.lib.passport.authenticate('login', (err, user, info) => {
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
      if (req.user) res.send(that.Gateway.EXT)
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get('/DescriptionEXT', (req, res) => {
      if (req.user) res.send(that.Gateway.EXTDescription)
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get('/InstalledEXT', (req, res) => {
      if (req.user) res.send(that.Gateway.EXTInstalled)
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get('/ConfiguredEXT', (req, res) => {
      if (req.user) res.send(that.Gateway.EXTConfigured)
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get('/GetMMConfig', (req, res) => {
      if (req.user) res.send(that.Gateway.MMConfig)
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/Terminal" , (req,res) => {
      if (req.user) {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        res.sendFile( Path+ "/website/Gateway/terminal.html")

        io.once('connection', async (socket) => {
          log('[' + ip + '] Connected to Terminal Logs:', req.user.username)
          socket.on('disconnect', (err) => {
            log('[' + ip + '] Disconnected from Terminal Logs:', req.user.username, "[" + err + "]")
          })
          var pastLogs = await that.lib.GWTools.readAllMMLogs(that.Gateway.HyperWatch.logs())
          io.emit("terminal.logs", pastLogs)
          that.Gateway.HyperWatch.stream().on('stdData', (data) => {
            if (typeof data == "string") io.to(socket.id).emit("terminal.logs", data.replace(/\r?\n/g, "\r\n"))
          })
        })
      }
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/ptyProcess" , (req,res) => {
      if (req.user) {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        res.sendFile( Path+ "/website/Gateway/pty.html")
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
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/install" , (req,res) => {
      if (req.user) {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        if (req.query.ext && that.Gateway.EXTInstalled.indexOf(req.query.ext) == -1 && that.Gateway.EXT.indexOf(req.query.ext) > -1) {
          res.sendFile( Path+ "/website/Gateway/install.html")
          io.once('connection', async (socket) => {
            log('[' + ip + '] Connected to installer Terminal Logs:', req.user.username)
            socket.on('disconnect', (err) => {
              log('[' + ip + '] Disconnected from installer Terminal Logs:', req.user.username, "[" + err + "]")
            })
            that.Gateway.HyperWatch.stream().on('stdData', (data) => {
              if (typeof data == "string") io.to(socket.id).emit("terminal.installer", data.replace(/\r?\n/g, "\r\n"))
            })
          })
        }
        else res.status(404).sendFile(Path+ "/website/Gateway/404.html")
      }
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/EXTInstall" , (req,res) => {
      if (req.user) {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        if (req.query.EXT && that.Gateway.EXTInstalled.indexOf(req.query.EXT) == -1 && that.Gateway.EXT.indexOf(req.query.EXT) > -1) {
          console.log("[GATEWAY]["+ip+"] Request installation:", req.query.EXT)
          var result = {
            error: false
          }
          var modulePath = that.lib.path.normalize(Path + "/../")
          var Command= 'cd ' + modulePath + ' && git clone https://github.com/bugsounet/' + req.query.EXT + ' && cd ' + req.query.EXT + ' && npm install'

          var child = that.lib.childProcess.exec(Command, {cwd : modulePath } , (error, stdout, stderr) => {
            if (error) {
              result.error = true
              console.error(`[GATEWAY][FATAL] exec error: ${error}`)
            } else {
              that.Gateway.EXTInstalled= that.lib.GWTools.searchInstalled(that)
              console.log("[GATEWAY][DONE]", req.query.EXT)
            }
            res.json(result)
          })
          child.stdout.pipe(process.stdout)
          child.stderr.pipe(process.stdout)
        }
        else res.status(404).sendFile(Path+ "/website/Gateway/404.html")
      }
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/delete" , (req,res) => {
      if (req.user) {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        if (req.query.ext && that.Gateway.EXTInstalled.indexOf(req.query.ext) > -1 && that.Gateway.EXT.indexOf(req.query.ext) > -1) {
          res.sendFile( Path+ "/website/Gateway/delete.html")
          io.once('connection', async (socket) => {
            log('[' + ip + '] Connected to uninstaller Terminal Logs:', req.user.username)
            socket.on('disconnect', (err) => {
              log('[' + ip + '] Disconnected from uninstaller Terminal Logs:', req.user.username, "[" + err + "]")
            })
            that.Gateway.HyperWatch.stream().on('stdData', (data) => {
              if (typeof data == "string") io.to(socket.id).emit("terminal.delete", data.replace(/\r?\n/g, "\r\n"))
            })
          })
        }
        else res.status(404).sendFile(Path+ "/website/Gateway/404.html")
      }
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/EXTDelete" , (req,res) => {
      if (req.user) {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        if (req.query.EXT && that.Gateway.EXTInstalled.indexOf(req.query.EXT) > -1 && that.Gateway.EXT.indexOf(req.query.EXT) > -1) {
          console.log("[GATEWAY]["+ip+"] Request delete:", req.query.EXT)
          var result = {
            error: false
          }
          var modulePath = that.lib.path.normalize(Path + "/../")
          var Command= 'cd ' + modulePath + ' && rm -rfv ' + req.query.EXT
          var child = that.lib.childProcess.exec(Command, {cwd : modulePath } , (error, stdout, stderr) => {
            if (error) {
              result.error = true
              console.error(`[GATEWAY][FATAL] exec error: ${error}`)
            } else {
              that.Gateway.EXTInstalled= that.lib.GWTools.searchInstalled(that)
              console.log("[GATEWAY][DONE]", req.query.EXT)
            }
            res.json(result)
          })
          child.stdout.pipe(process.stdout)
          child.stderr.pipe(process.stdout)
        }
        else res.status(404).sendFile(Path+ "/website/Gateway/404.html")
      }
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/MMConfig" , (req,res) => {
      if (req.user) res.sendFile( Path+ "/website/Gateway/mmconfig.html")
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/EXTCreateConfig" , (req,res) => {
      if (req.user) {
        if (req.query.ext &&
          that.Gateway.EXTInstalled.indexOf(req.query.ext) > -1 && // is installed
          that.Gateway.EXT.indexOf(req.query.ext) > -1 &&  // is an EXT
          that.Gateway.EXTConfigured.indexOf(req.query.ext) == -1 // is not configured
        ) {
          res.sendFile( Path+ "/website/Gateway/EXTCreateConfig.html")
        }
        else res.status(404).sendFile(Path+ "/website/Gateway/404.html")
      }
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/EXTModifyConfig" , (req,res) => {
      if (req.user) {
        if (req.query.ext &&
          that.Gateway.EXTInstalled.indexOf(req.query.ext) > -1 && // is installed
          that.Gateway.EXT.indexOf(req.query.ext) > -1 &&  // is an EXT
          that.Gateway.EXTConfigured.indexOf(req.query.ext) > -1 // is configured
        ) {
          res.sendFile( Path+ "/website/Gateway/EXTModifyConfig.html")
        }
        else res.status(404).sendFile(Path+ "/website/Gateway/404.html")
      }
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/EXTDeleteConfig" , (req,res) => {
      if (req.user) {
        if (req.query.ext &&
          that.Gateway.EXTInstalled.indexOf(req.query.ext) == -1 && // is not installed
          that.Gateway.EXT.indexOf(req.query.ext) > -1 &&  // is an EXT
          that.Gateway.EXTConfigured.indexOf(req.query.ext) > -1 // is configured
        ) {
          res.sendFile( Path+ "/website/Gateway/EXTDeleteConfig.html")
        }
        else res.status(404).sendFile(Path+ "/website/Gateway/404.html")
      }
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/EXTGetCurrentConfig" , (req,res) => {
      if (req.user) {
        if(!req.query.ext) return res.status(404).sendFile(Path+ "/website/Gateway/404.html")
        var index = that.Gateway.MMConfig.modules.map(e => { return e.module }).indexOf(req.query.ext)
        if (index > -1) {
          let data = that.Gateway.MMConfig.modules[index]
          return res.send(data)
        }
        res.status(404).sendFile(Path+ "/website/Gateway/404.html")
      }
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/EXTGetDefaultConfig" , (req,res) => {
      if (req.user) {
        if(!req.query.ext) return res.status(404).sendFile(Path+ "/website/Gateway/404.html")
        let data = require("../config/"+req.query.ext+"/config.js")
        res.send(data.default)
      }
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/EXTGetDefaultTemplate" , (req,res) => {
      if (req.user) {
        if(!req.query.ext) return res.status(404).sendFile(Path+ "/website/Gateway/404.html")
        let data = require("../config/"+req.query.ext+"/config.js")
        data.schema = that.lib.GWTools.makeSchemaTranslate(data.schema, that.Gateway.schemaTranslatation)
        res.send(data.schema)
      }
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/EXTSaveConfig" , (req,res) => {
      if (req.user) {
        if(!req.query.config) return res.status(404).sendFile(Path+ "/website/Gateway/404.html")
        let data = req.query.config
        res.send(data)
      }
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .post("/writeEXT", async (req,res) => {
      if (req.user) {
        console.log("[Gateway] Receiving EXT data ...")
        let data = JSON.parse(req.body.data)
        var NewConfig = await that.lib.GWTools.configAddOrModify(data, that.Gateway.MMConfig)
        var resultSaveConfig = await that.lib.GWTools.saveConfig(that,NewConfig)
        console.log("[GATEWAY] Write config result:", resultSaveConfig)
        res.send(resultSaveConfig)
        if (resultSaveConfig.done) {
          that.Gateway.MMConfig = await that.lib.GWTools.readConfig(that)
          that.Gateway.EXTConfigured= that.lib.GWTools.searchConfigured(that.Gateway.MMConfig, that.Gateway.EXT)
          console.log("[GATEWAY] Reload config")
        }
      } else res.status(403).sendFile(Path+ "/website/Gateway/403.html") 
    })

    .post("/deleteEXT", async (req,res) => {
      if (req.user) {
        console.log("[Gateway] Receiving EXT data ...", req.body)
        console.log("user", req.user)
        let EXTName = req.body.data
        var NewConfig = await that.lib.GWTools.configDelete(EXTName, that.Gateway.MMConfig)
        var resultSaveConfig = await that.lib.GWTools.saveConfig(that,NewConfig)
        console.log("[GATEWAY] Write config result:", resultSaveConfig)
        res.send(resultSaveConfig)
        if (resultSaveConfig.done) {
          that.Gateway.MMConfig = await that.lib.GWTools.readConfig(that)
          that.Gateway.EXTConfigured= that.lib.GWTools.searchConfigured(that.Gateway.MMConfig, that.Gateway.EXT)
          console.log("[GATEWAY] Reload config")
        }
      } else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/Tools" , (req,res) => {
      if (req.user) res.sendFile(Path+ "/website/Gateway/tools.html")
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/System" , (req,res) => {
      if (req.user) {
        res.sendFile(Path+ "/website/Gateway/system.html")
        let ST = new that.lib.speedtest(that.lib, io, req, that.Gateway, that.config.debug)
        ST.init()
      } else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/Setting" , (req,res) => {
      if (req.user) res.sendFile(Path+ "/website/Gateway/setting.html")
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/getSetting", (req,res) => {
      if (req.user) res.send(that.config)
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/Restart" , (req,res) => {
      if (req.user) {
        res.sendFile(Path+ "/website/Gateway/restarting.html")
        setTimeout(() => that.lib.GWTools.restartMM(that) , 1000)
      }
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/Die" , (req,res) => {
      if (req.user) {
        res.sendFile(Path+ "/website/Gateway/die.html")
        setTimeout(() => that.lib.GWTools.doClose(that), 3000)
      }
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/SystemRestart" , (req,res) => {
      if (req.user) {
        res.sendFile(Path+ "/website/Gateway/restarting.html")
        setTimeout(() => that.lib.GWTools.SystemRestart(that) , 1000)
      }
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/SystemDie" , (req,res) => {
      if (req.user) {
        res.sendFile(Path+ "/website/Gateway/die.html")
        setTimeout(() => that.lib.GWTools.SystemDie(that), 3000)
      }
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/EditMMConfig" , (req,res) => {
      if (req.user) res.sendFile(Path+ "/website/Gateway/EditMMConfig.html")
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/GetBackupName" , async (req,res) => {
      if (req.user) {
        var names = await that.lib.GWTools.loadBackupNames(that)
        res.send(names)
      }
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/GetBackupFile" , async (req,res) => {
      if (req.user) {
        let data = req.query.config
        var file = await that.lib.GWTools.loadBackupFile(that,data)
        res.send(file)
      }
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/GetRadioStations", (req,res) => {
      if (req.user) {
        if (!that.Gateway.radio) return res.status(404).sendFile(Path+ "/website/Gateway/404.html")
        var allRadio = Object.keys(that.Gateway.radio)
        res.send(allRadio)
      }
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .post("/loadBackup", async (req,res) => {
      if (req.user) {
        console.log("[Gateway] Receiving backup data ...")
        let file = req.body.data
        var loadFile = await that.lib.GWTools.loadBackupFile(that,file)
        var resultSaveConfig = await that.lib.GWTools.saveConfig(that,loadFile)
        console.log("[GATEWAY] Write config result:", resultSaveConfig)
        res.send(resultSaveConfig)
        if (resultSaveConfig.done) {
          that.Gateway.MMConfig = await that.lib.GWTools.readConfig(that)
          console.log("[GATEWAY] Reload config")
        }
      } else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .post("/writeConfig", async (req,res) => {
      if (req.user) {
        console.log("[Gateway] Receiving config data ...")
        let data = JSON.parse(req.body.data)
        var resultSaveConfig = await that.lib.GWTools.saveConfig(that,data)
        console.log("[GATEWAY] Write config result:", resultSaveConfig)
        res.send(resultSaveConfig)
        if (resultSaveConfig.done) {
          that.Gateway.MMConfig = await that.lib.GWTools.readConfig(that)
          console.log("[GATEWAY] Reload config")
        }
      } else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .post("/saveSetting", urlencodedParser, async (req,res) => {
      if (req.user) {
        console.log("[Gateway] Receiving new Setting")
        let data = JSON.parse(req.body.data)
        var NewConfig = await that.lib.GWTools.configAddOrModify(data, that.Gateway.MMConfig)
        var resultSaveConfig = await that.lib.GWTools.saveConfig(that,NewConfig)
        console.log("[GATEWAY] Write Gateway config result:", resultSaveConfig)
        res.send(resultSaveConfig)
        if (resultSaveConfig.done) {
          that.Gateway.MMConfig = await that.lib.GWTools.readConfig(that)
          console.log("[GATEWAY] Reload config")
        }
      } else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/getWebviewTag", (req,res) => {
      if(req.user) res.send(that.Gateway.webviewTag)
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .post("/setWebviewTag", async (req,res) => {
      if(!that.Gateway.webviewTag && req.user) {
        console.log("[Gateway] Receiving setWebviewTag demand...")
        let NewConfig = await that.lib.GWTools.setWebviewTag(that.Gateway.MMConfig)
        var resultSaveConfig = await that.lib.GWTools.saveConfig(that,NewConfig)
        console.log("[GATEWAY] Write Gateway webview config result:", resultSaveConfig)
        res.send(resultSaveConfig)
        if (resultSaveConfig.done) {
          that.Gateway.webviewTag = true
          that.Gateway.MMConfig = await that.lib.GWTools.readConfig(that)
          console.log("[GATEWAY] Reload config")
        }
      }
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/getGAVersion", (req,res) => {
      if (req.user) {
        if (that.Gateway.EXTStatus.GA_Ready) that.Gateway.GACheck.ready = true
        res.send(that.Gateway.GACheck)
      }
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/getEXTStatus", (req,res) => {
      if (req.user) res.send(that.Gateway.EXTStatus)
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
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
          noti: "GA_ACTIVATE",
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
            icon: "modules/Gateway/website/assets/img/gateway.jpg"
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
        if (that.Gateway.EXTStatus["EXT-YouTube"].hello) {
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
      if(that.Gateway.freeteuse && req.user) {
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
          var toListen= that.Gateway.radio[data].notificationExec.payload()
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
        var deleteBackup = await that.lib.GWTools.deleteBackup(that)
        console.log("[GATEWAY] Delete backup result:", deleteBackup)
        res.send(deleteBackup)
      }
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .post("/readExternalBackup", async (req,res) => {
      if(req.user) {
        let data = req.body.data
        if (!data) return res.send({error: "error"})
        console.log("[GATEWAY] Receiving External backup...")
        var transformExternalBackup = await that.lib.GWTools.transformExternalBackup(that,data)
        res.send({ data: transformExternalBackup })
      }
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .post("/saveExternalBackup", async (req,res) => {
      if(req.user) {
        let data = req.body.data
        if (!data) return res.send({error: "error"})
        console.log("[GATEWAY] Receiving External backup...")
        var linkExternalBackup = await that.lib.GWTools.saveExternalConfig(that,data)
        if (linkExternalBackup.data) {
          console.log("[GATEWAY] Generate link number:", linkExternalBackup.data)
          healthDownloader = (req_, res_) => {
            if (req_.params[0] == linkExternalBackup.data) {
              res_.sendFile(Path + '/download/'+ linkExternalBackup.data + '.js')
              healthDownloader = function(req_, res_) {
                res_.redirect('/')
              }
              setTimeout(() => {
                that.lib.GWTools.deleteDownload(that,linkExternalBackup.data)
              }, 1000 * 10)
            } else {
              res_.redirect('/')
            }
          }
        }
        res.send(linkExternalBackup)
      }
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/activeVersion", (req,res) => {
      if (req.user) res.send(that.Gateway.activeVersion)
      else res.status(403).sendFile(Path+ "/website/Gateway/403.html")
    })

    .get("/download/*", (req,res) => {
      healthDownloader(req, res)
    })

    .get("/robots.txt", (req,res) => {
      res.sendFile(Path+ "/website/Gateway/robots.txt")
    })
}

/** Start Server **/
async function startServer(that,callback = () => {}) {
  /** Error 404 **/
  that.Gateway.app
    .get("/smarthome/*", (req, res) => {
      console.warn("[GATEWAY] [SMARTHOME] Don't find:", req.url)
      res.status(404).sendFile(that.path+ "/website/SmartHome/404.html")
    })
  that.Gateway.app
    .get("/*", (req, res) => {
      console.warn("[GATEWAY] Don't find:", req.url)
      res.status(404).sendFile(that.path+ "/website/Gateway/404.html")
    })

  /** Create Server **/
  that.config.listening = await that.lib.GWTools.purposeIP(that)
  that.Gateway.HyperWatch = that.lib.hyperwatch(
    that.Gateway.server
      .listen(8081, "0.0.0.0", () => {
        console.log("[GATEWAY] Start listening on port 8081")
        console.log("[GATEWAY] Available locally at http://"+ that.config.listening + ":8081")
        that.Gateway.initialized= true
        callback(true)
      })
      .on("error", err => {
        console.error("[GATEWAY] Can't start Gateway server!")
        console.error("[GATEWAY] Error:",err.message)
        that.sendSocketNotification("SendNoti", {
          noti: "EXT_ALERT",
          payload: {
            type: "error",
            message: "Can't start Gateway server!",
            timer: 10000
          }
        })
        that.Gateway.initialized= false
        callback(false)
      })
  )
}

/** passport local strategy with username/password defined on config **/
function passportConfig(that) {
  that.lib.passport.use('login', new that.lib.LocalStrategy.Strategy(
    (username, password, done) => {
      if (username === that.Gateway.user.username && password === that.Gateway.user.password) {
        return done(null, that.Gateway.user)
      }
      else done(null, false, { message: that.Gateway.translation["Login_Error"] })
    }
  ))

  that.lib.passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  that.lib.passport.deserializeUser((id, done) => {
    done(null, that.Gateway.user)
  })
}

function logRequest(req, res, next) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  log("[" + ip + "][" + req.method + "] " + req.url)
  next()
}

exports.initialize = initialize
exports.startServer = startServer
