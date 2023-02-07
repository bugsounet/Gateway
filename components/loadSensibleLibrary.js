/** Load sensible library without black screen **/
var log = (...args) => { /* do nothing */ }

function library(that) {
  if (that.config.debug) log = (...args) => { console.log("[GATEWAY]", ...args) }
  let libraries= [
    // { "library to load" : [ "store library name" ] }
    { "node-pty": "pty" },
    { "../components/tools.js": "tools" },
    { "../components/GatewayMiddleware.js": "Gateway"}
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
            log("Loaded:", libraryToLoad)
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
  })
}

exports.library = library
