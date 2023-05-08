/** Load sensible library without black screen **/
var log = (...args) => { /* do nothing */ }

function libraries(that) {
  if (that.config.debug) log = (...args) => { console.log("[GATEWAY] [LIB]", ...args) }
  let libraries= [
    // { "library to load" : "store library name" }
    { "../components/GWTools.js": "GWTools" },
    { "../components/SHTools.js": "SHTools" },
    { "../components/GatewayMiddleware.js": "Gateway"},
    { "../components/hyperwatch.js": "hyperwatch" },
    { "../components/SmartHomeMiddleware.js": "SmartHome" },
    { "../components/actionsOnGoogle.js": "ActionsOnGoogle" },
    { "../components/DeviceManagement.js": "Device" },
    { "../components/SHCallbacks.js": "callback" },
    { "../components/homegraph.js": "homegraph" },
    { "../components/systemInformation.js": "SystemInformation" },
    { "../components/speedtest.js": "speedtest" },
    { "../components/speedtest-net.js": "speedtest-net" },
    { "node-pty": "pty" },
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
    { "node-fetch": "fetch" },
    { "fs": "fs" },
    { "util": "util" },
    { "systeminformation": "si" },
    { "pm2": "pm2" },
    { "readline": "readline" },
    { "stream": "Stream" },
    { "actions-on-google": "actions" },
    { "googleapis": "googleapis" },
    { "google-auth-library": "GoogleAuthLibrary" },
    { "lodash": "_" },
    { "moment": "moment" },
    { "mkdirp": "mkdirp" },
    { "https": "https" },
    { "decompress" : "decompress" },
    { "decompress-tar" : "decompressTar" },
    { "decompress-tarbz2" : "decompressTarbz2" },
    { "decompress-targz" : "decompressTargz" },
    { "decompress-unzip": "decompressUnzip" },
    { "@felipecrs/decompress-tarxz": "decompressTarXz" },
    { "tree-kill": "kill" },
    { "sha256-file": "sha256_file" }
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
          console.error("[GATEWAY] [LIB]", libraryToLoad, "Loading error!" , that.config.debug ? e : e.toString())
          that.sendSocketNotification("WARNING" , {library: libraryToLoad })
          errors++
          that.lib.error = errors
        }
      }
    })
    resolve(errors)
    if (!errors) console.log("[GATEWAY] [LIB] All libraries loaded!")
  })
}

exports.libraries = libraries
