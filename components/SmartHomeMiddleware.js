/** SmartHome Middleware **/
var log = (...args) => { /* do nothing */ }

function initialize(that) {
  if (that.config.debug) log = (...args) => { console.log("[GATEWAY] [SMARTHOME]", ...args) }
  let SHWebsiteDir =  that.lib.path.resolve(__dirname + "/../website/SmartHome")
  log("Create SmartHome needed routes...")
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

  that.Gateway.app
    .use('/smarthome/assets', that.lib.express.static(SHWebsiteDir + '/assets', options))
    /** OAuth2 Server **/
    .get("/smarthome/login/", (req,res) => {
      res.sendFile(SHWebsiteDir+ "/login.html")
    })

    .post("/smarthome/login/", (req,res) => {
      let form = req.body
      let args = req.query
      if (form["username"] && form["password"] && args["state"] && args["response_type"] && args["response_type"] == "code" && args["client_id"] == that.config.CLIENT_ID){
        let user = that.actions.tools.get_user(form["username"])
        if (!user || that.actions.tools.user.password != form["password"]) {
          return res.sendFile(SHWebsiteDir+ "/login.html")
        }
        that.last_code = that.actions.tools.random_string(8)
        that.last_code_user = form["username"]
        that.last_code_time = (new Date()).getTime() / 1000
        let params = {
          'state': args["state"],
          'code': that.last_code,
          'client_id': that.config.CLIENT_ID
        }
        log("[AUTH] Generate Code:", that.last_code)
        res.status(301).redirect(args["redirect_uri"] + that.actions.tools.serialize(params))
      } else {
        res.status(400).sendFile(SHWebsiteDir+ "/400.html")
      }
    })

    .post("/smarthome/token/", (req,res) => {
      let form = req.body
      if (form["grant_type"] && form["grant_type"] == "authorization_code" && form["code"] && form["code"] == that.last_code) {
        let time = (new Date()).getTime() / 1000
        if (time - that.last_code_time > 10) {
          log("[TOKEN] Invalid code (timeout)")
          res.status(403).sendFile(SHWebsiteDir+ "/403.html")
        } else {
          let access_token = that.actions.tools.random_string(32)
          fs.writeFileSync(that.tokensDir + "/" + access_token, that.last_code_user, { encoding: "utf8"} )
          log("|TOKEN] Send Token:", access_token)
          res.json({"access_token": access_token})
        }
      } else {
        log("[TOKEN] Invalid code")
        res.status(403).sendFile(SHWebsiteDir+ "/403.html")
      }
    })

    /** fulfillment Server **/
    .get("/smarthome/", (req,res) => {
      res.sendFile(SHWebsiteDir+ "/works.html")
    })

    //.post("/smarthome/", that.actions.smarthome)

    /** Display current google graph in console **/
    .get("/smarthome/graph",(req,res) => {
      if (that.homegraph) that.homegraph.queryGraph()
      res.status(404).sendFile(SHWebsiteDir+ "/404.html")
    })

    .get("/robots.txt", (req,res) => {
      res.sendFile(SHWebsiteDir+ "/robots.txt")
    })
}

function disable(that) {
  if (that.config.debug) log = (...args) => { console.log("[GATEWAY] [SMARTHOME]", ...args) }
  let SHWebsiteDir =  that.lib.path.resolve(__dirname + "/../website/SmartHome")

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

  that.Gateway.app
    .use('/smarthome/assets', that.lib.express.static(SHWebsiteDir + '/assets', options))
    .get("/smarthome/login/", (req,res) => {
      res.sendFile(SHWebsiteDir+ "/disabled.html")
    })
    .get("/smarthome/", (req,res) => {
      res.sendFile(SHWebsiteDir+ "/disabled.html")
    })
    .get("/robots.txt", (req,res) => {
      res.sendFile(SHWebsiteDir+ "/robots.txt")
    })
}

exports.initialize = initialize
exports.disable = disable
