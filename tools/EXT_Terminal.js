/** EXT tools
* @bugsounet
**/

// rotate rules

PleaseRotateOptions = {
  startOnPageLoad: false
}

// define all vars
var translation= {}
var actualSetting = {}
var AllEXT = []
var DescEXT = {}
var InstEXT = []
var ConfigEXT = []
var versionGW = {}
var webviewTag = false
var versionGA = {}
var EXTStatus = {}
var ErrEXTStatus = 0

// Load rules
window.addEventListener("load", async event => {
  versionGW = await getGatewayVersion()
  translation = await loadTranslation()

  await getGatewaySetting()
  $('html').prop("lang", versionGW.lang)
  switch (window.location.pathname) {
    case "/Terminal":
      doTerminalLogs()
      break
    case "/ptyProcess":
      doTerminal()
      break
  }

  var Options = {
    forcePortrait: false,
    message: translation.Rotate_Msg,
    subMessage: translation.Rotate_Continue,
    allowClickBypass: false,
    onlyMobile: true
  }
  PleaseRotate.start(Options)

  $('#Home').text(translation.Home)
  $('#Plugins').text(translation.Plugins)
  $('#Terminal').text(translation.Terminal)
  $('#Configuration').text(translation.Configuration)
  $('#Tools').text(translation.Tools)
  $('#Setting').text(translation.Setting)
  $('#Logout').text(translation.Logout)

  $('#accordionSidebar').removeClass("invisible")
  $('li.active').removeClass('active')
  var path=location.pathname
  if (path == "/install" ||
      path == "/delete" ||
      path == "/EXTModifyConfig" ||
      path == "/EXTCreateConfig"
  ) path = "/EXT"
  if (path == "/EditMMConfig") path = "/MMConfig"
  if (path == "/Die" || path == "/Restart") path = "/Tools"
  if (path == "/ptyProcess") path = "/Terminal"
  $('a[href="' + path + '"]').closest('a').addClass('active')
})

async function doTerminalLogs() {
  $(document).prop('title', translation.Terminal)
  $('#TerminalHeader').text(translation.Terminal)
  $('#openTerminal').text(translation.TerminalOpen)
  var socketLogs = io()
  const termLogs = new Terminal({cursorBlink: true})
  const fitAddonLogs = new FitAddon.FitAddon()
  termLogs.loadAddon(fitAddonLogs)
  termLogs.open(document.getElementById('terminal'))
  fitAddonLogs.fit()

  socketLogs.on("connect", () => {
    termLogs.write("\x1B[1;3;31mGateway v" + versionGW.v + " (" + versionGW.rev + "." + versionGW.lang +")\x1B[0m \r\n\n")
  });

  socketLogs.on("disconnect", () => {
    termLogs.write("\r\n\n\x1B[1;3;31mDisconnected\x1B[0m\r\n")
  })

  socketLogs.on('terminal.logs', function(data) {
    termLogs.write(data)
  })

  socketLogs.io.on("error", (data) => {
    console.log("Socket Error:", data)
    socketLogs.close()
  })
}

async function doTerminal() {
  $(document).prop('title', translation.Terminal)
  $('#PTYHeader').text(translation.TerminalGW)
  var socketPTY = io()
  const termPTY = new Terminal({cursorBlink: true})
  const fitAddonPTY = new FitAddon.FitAddon()
  termPTY.loadAddon(fitAddonPTY)
  termPTY.open(document.getElementById('terminal'))
  fitAddonPTY.fit()
  if (termPTY.rows && termPTY.cols) {
    socketPTY.emit('terminal.size', { cols: termPTY.cols, rows: termPTY.rows })
  }

  socketPTY.on("connect", () => {
    termPTY.write("\x1B[1;3;31mGateway v" + versionGW.v + " (" + versionGW.rev + "." + versionGW.lang +")\x1B[0m \r\n\n")
  })

  socketPTY.on("disconnect", () => {
    termPTY.write("\r\n\n\x1B[1;3;31mDisconnected\x1B[0m\r\n")
  })

  termPTY.onData( data => {
    socketPTY.emit('terminal.toTerm', data)
  })

  socketPTY.on('terminal.incData', function(data) {
    termPTY.write(data)
  })

  socketPTY.io.on("error", (data) => {
    console.log("Socket Error:", data)
    socketPTY.close()
  });
}
