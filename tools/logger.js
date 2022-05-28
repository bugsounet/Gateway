'use strict';

/** Launch an app, Logs all in an Array **/
/** emit event "stdData" on new entry **/
/** From @thlorenz/hyperwatch github **/
/** @bugsounet **/
/** 28.05.2022 **/

var maxbuflen = 500
var enabled = true
var errStream
var outStream
var buf = []
var showAllLogs = []
var emitter = require('events').EventEmitter
var em = new emitter()

function buffer(args) {
  if (!enabled) return
  buf.push(args)
  if (buf.length > maxbuflen) buf.shift()
  allLogs(args)
}

function allLogs(args) {
  if (args[0]) {
    showAllLogs.push(args[0])
    em.emit("stdData", args[0])
  }
  if (showAllLogs.length > maxbuflen) showAllLogs.shift()
}


+function redirectStderr () {
  var stderr = process.stderr
  var stderr_write = stderr.write

  stderr.write = function () {
    stderr_write.apply(stderr, arguments)
    buffer(arguments)
  }
}()

+function redirectStdout () {
  var stdout = process.stdout
  var stdout_write = stdout.write
  stdout.write = function () {
    stdout_write.apply(stdout, arguments)
    buffer(arguments)
  }
}()

var stderrLogs = function (stream) {
  if (errStream) errStream.destroy()
  errStream = stream
}

var stdoutLogs = function (stream) {
  if (outStream) outStream.destroy()
  outStream = stream
}

module.exports = function (app) {
  stderrLogs(app)
  stdoutLogs(app)
  return {
      disable    :  function () { 
        enabled = false
        console.log("[HyperWatch] Logger is now", enabled)
      },
      enable     :  function () {
        enabled = true
        console.log("[HyperWatch] Logger is now", enabled)
      },
      scrollback :  function (n) {
        maxbuflen = n
        console.log("[HyperWatch] maxbuflen is now", maxbuflen)
      },
      logs       :  showAllLogs,
      stream     :  em
  }
};
