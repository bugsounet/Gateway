/** Load sensible library without black screen **/
var log = (...args) => { /* do nothing */ }

function libraries(that) {
  if (that.config.debug) log = (...args) => { console.log("[GATEWAY]", ...args) }
  let libraries= [
    // { "library to load" : "store library name" }
    { "node-pty": "pty" },
    { "../components/tools.js": "tools" },
    { "../components/GatewayMiddleware.js": "Gateway"},
    { "../components/hyperwatch.js": "hyperwatch" },
    { "../components/SmartHomeMiddleware.js": "SmartHome" },
    { "express": "express" },
    { "http": "http" },
    { "semver": "semver" },
    { "body-parser": "bodyParser" },
    { "express-session": "session" },
    { "passport": "passport" },
    { "passport-local" : "LocalStrategy" },
    { "socket.io": "Socket" },
    { "cors": "cors" },
    { "path": "path" },
    { "child_process": "childProcess" },
    { "node-fetch": "fetch" }
  ]
  let errors = 0
  return new Promise(resolve => {
    libraries.forEach(library => {
      for (const [name, configValues] of Object.entries(library)) {
        let libraryToLoad = name
        let libraryName = configValues

        try {
          if (!that.lib[libraryName]) {
            that.lib[libraryName] = require(libraryToLoad)
            log("Loaded:", libraryToLoad, "->", "this.lib."+libraryName)
          }
        } catch (e) {
          console.error("[GATEWAY]", libraryToLoad, "Loading error!" , e.toString())
          that.sendSocketNotification("WARNING" , {library: libraryToLoad })
          errors++
          that.lib.error = errors
        }
      }
    })
    resolve(errors)
    log("All libraries loaded!")
  })
}

exports.libraries = libraries
