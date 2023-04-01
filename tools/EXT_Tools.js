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

  if (window.location.pathname != "/login") actualSetting = await getGatewaySetting()
  $('html').prop("lang", versionGW.lang)
  switch (window.location.pathname) {
    case "/":
      doIndex()
      break
    case "/login":
      doLogin()
      break
    case "/EXT":
      createEXTTable()
      break
    case "/delete":
      doDelete()
      break
    case "/install":
      doInstall()
      break
    case "/EXTCreateConfig":
      EXTConfigJSEditor()
      break
    case "/EXTDeleteConfig":
      EXTDeleteConfigJSEditor()
      break
    case "/EXTModifyConfig":
      EXTModifyConfigJSEditor()
      break
    case "/Restart":
      doRestart()
      break
    case "/Die":
      doDie()
      break
    case "/Terminal":
      doTerminalLogs()
      break
    case "/ptyProcess":
      doTerminal()
      break
    case "/MMConfig":
      viewJSEditor()
      break
    case "/EditMMConfig":
      EditMMConfigJSEditor()
      break
    case "/Tools":
      doTools()
      break
    case "/Setting":
      GatewaySetting()
      break
  }

  if (window.location.pathname == "/login") return // don't execute please rotate on login

  var Options = {
    forcePortrait: false,
    message: translation.Rotate_Msg,
    subMessage: translation.Rotate_Continue,
    allowClickBypass: true,
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

function doLogin() {
  $("#Login-submit").addClass('disabled')
  $(document).prop('title', translation.Login_Welcome)
  $('#Welcome').text(translation.Login_Welcome)
  $('#username').attr("placeholder", translation.Login_Username)
  $('#password').attr("placeholder", translation.Login_Password)
  $('#Login-submit').text(translation.Login_Login)

  $('#login').on('input change', function() {
    if ($('#username').val() !='' && $('#password').val() !='') $("#Login-submit").removeClass('disabled')
    else $("#Login-submit").addClass('disabled')
  })

  $("#login").submit(function(event) {
    event.preventDefault()
    alertify.set('notifier','position', 'top-center')
    $.post( "/auth", $(this).serialize())
      .done(back => {
        if (back.err) {
          alertify.error("[Login] " + back.err.message)
          $("#username").val('')
          $("#password").val('')
          $("#Login-submit").addClass('disabled')
        }
        else {
          alertify.success($('#username').val() + ", " + translation.Login_Welcome)
          setTimeout( () => { $(location).attr('href',"/") } , 2000 )
        }
      })
      .fail(function(err) {
        alertify.error("[Login] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
        console.log(err)
      })
    })
}

function doIndex() {
  $(document).prop('title', translation.Home)
  $('#welcome').text(translation.Home_Welcome)
  if (versionGW.needUpdate) {
    $('#alert').removeClass('invisible')
    $('#alert').removeClass('alert-success')
    $('#alert').addClass('alert-warning')
    $('#messageText').text(translation.Update + " v"+versionGW.last)
  }
}

function doDelete() {
  var EXT = decodeURIComponent(window.location.search.match(/(\?|&)ext\=([^&]*)/)[2])
  $(document).prop('title', translation.Plugins)
  $('#TerminalHeader').text(translation.Plugins_Delete_TerminalHeader)
  var socketDelete = io()
  const termDelete = new Terminal({cursorBlink: true})
  const fitAddonDelete = new FitAddon.FitAddon()
  termDelete.loadAddon(fitAddonDelete)
  termDelete.open(document.getElementById('terminal'))
  fitAddonDelete.fit()

  socketDelete.on("connect", () => {
    termDelete.write("\x1B[1;3;31mGateway v" + versionGW.v + " (" + versionGW.rev + "." + versionGW.lang +")\x1B[0m \r\n\n")
  });

  socketDelete.on("disconnect", () => {
    termDelete.write("\r\n\n\x1B[1;3;31mDisconnected\x1B[0m\r\n")
  })

  socketDelete.io.on("error", (data) => {
    console.log("Socket Error:", data)
    socketDelete.close()
  })

  socketDelete.on('terminal.delete', function(data) {
    termDelete.write(data)
  })

  $('#messageText').text(translation.Plugins_Delete_Message)
  $('#EXT-Name').text(EXT)
  $('#delete').text(translation.Delete)

  document.getElementById('delete').onclick = function () {
    $('#messageText').text(translation.Plugins_Delete_Progress)
    $('#delete').addClass('disabled')
    return new Promise (resolve => {
      $.getJSON("/EXTDelete?EXT="+EXT , res => {
        if (!res.error) $('#messageText').text(translation.Plugins_Delete_Confirmed)
        else $('#messageText').text(translation.Warn_Error)
        resolve()
        setTimeout(() => socketDelete.close(), 500)
      })
      .fail(function(err) {
        alertify.error("[doDelete] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
      })
    })
  }
}

function doInstall() {
  var EXT = decodeURIComponent(window.location.search.match(/(\?|&)ext\=([^&]*)/)[2])
  $(document).prop('title', translation.Plugins)
  $('#TerminalHeader').text(translation.Plugins_Install_TerminalHeader)
  var socketInstall = io()
  const termInstall = new Terminal({cursorBlink: true})
  const fitAddonInstall = new FitAddon.FitAddon()
  termInstall.loadAddon(fitAddonInstall)
  termInstall.open(document.getElementById('terminal'))
  fitAddonInstall.fit()

  socketInstall.on("connect", () => {
    termInstall.write("\x1B[1;3;31mGateway v" + versionGW.v + " (" + versionGW.rev + "." + versionGW.lang +")\x1B[0m \r\n\n")
  });

  socketInstall.io.on("error", (data) => {
    console.log("Socket Error:", data)
    socketInstall.close()
  })

  socketInstall.on("disconnect", () => {
    termInstall.write("\r\n\n\x1B[1;3;31mDisconnected\x1B[0m\r\n")
  })

  socketInstall.on('terminal.installer', function(data) {
    termInstall.write(data)
  })

  $('#messageText').text(translation.Plugins_Install_Message)
  $('#EXT-Name').text(EXT)
  $('#install').text(translation.Install)

  document.getElementById('install').onclick = function () {
    $('#messageText').text(translation.Plugins_Install_Progress)
    $('#install').addClass('disabled')
    return new Promise (resolve => {
      $.getJSON("/EXTInstall?EXT="+EXT , res => {
        if (!res.error) $('#messageText').text(translation.Plugins_Install_Confirmed)
        else $('#messageText').text(translation.Warn_Error)
        resolve()
        setTimeout(() => socketInstall.close(), 500)
      })
      .fail(function(err) {
        alertify.error("[doInstall] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
      })
    })
  }
}

function doRestart() {
  $(document).prop('title', translation.Tools)
  $('#text1').text(translation.Tools_Restart_Text1)
  $('#text2').text(translation.Tools_Restart_Text2)

  function handle200 (response) {
    window.location.href = "/"
  }

  function checkPage(callback) {
    const xhr = new XMLHttpRequest(),
    method = "GET",
    url = "/";
    xhr.open(method, url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== XMLHttpRequest.DONE) { return; }
      if (xhr.status === 200) {
        return callback(xhr.status);
      }
      xhr.open(method, url, true);
      xhr.send();
    }
    xhr.send();
  }

  setTimeout(() => {
    checkPage(handle200)
  }, 5000)
}

function doDie() {
  $(document).prop('title', translation.Tools)
  $('#text1').text(translation.Tools_Die_Text1)
  $('#text2').text(translation.Tools_Die_Text2)
  $('#text3').text(translation.Tools_Die_Text3)
}

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
  });
  
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
  });

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

async function doTools() {
  // translate
  $(document).prop('title', translation.Tools)
  webviewTag = await checkWebviewTag()
  EXTStatus = await checkEXTStatus()
  versionGA = await checkGA()

  // live stream every secs of EXT for update
  setInterval(async() => {
    EXTStatus = await checkEXTStatus()
  }, 1000)

  $('#title').text(translation.Tools_Welcome)
  $('#subtitle').text(translation.Tools_subTitle)
  $('#stop').text(translation.Tools_Die)
  $('#restart').text(translation.Tools_Restart)
  $('#Die').text(translation.Confirm)
  $('#Restart').text(translation.Confirm)

  // MMM-GoogleAssistant recipes
  /* Will be not coded for first release
  if (versionGA.find && versionGA.configured) {
    $('#Recipes-Box').css("display", "block")
  }
  */

  // backups
  var allBackup = await loadBackupNames()
  if (allBackup.length > 5) {
    $('#backupFound').text(allBackup.length)
    $('#backupFoundText').text(translation.Tools_Backup_Found)
    $('#backupText').text(translation.Tools_Backup_Text)
    $('#backup-Delete').text(translation.Delete)
    $('#backup-Error').text(translation.Error)
    $('#backup-Done').text(translation.Done)
    $('#backup-Box').css("display", "block")

    document.getElementById('backup-Delete').onclick = function () {
      $.post("/deleteBackup")
        .done(function( back ) {
          if (back.error) {
            $('#backup-Delete').css("display", "none")
            $('#backup-Error').css("display", "inline-block")
            alertify.error(back.error)
          } else {
            $('#backup-Delete').css("display", "none")
            $('#backup-Done').css("display", "inline-block")
            alertify.success(translation.Tools_Backup_Deleted)
            back.error
          }
        })
        .fail(function(err) {
          alertify.error("[Delete] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
        })
    }

    document.getElementById('backup-Done').onclick = function () {
      $('#backup-Box').css("display", "none")
    }
  }

  // webview
  if (!webviewTag) {
    $('#webviewHeader').text(translation.Tools_Webview_Header)
    $('#webviewNeeded').text(translation.Tools_Webview_Needed)
    $('#webviewbtn-Apply').text(translation.Save)
    $('#webviewbtn-Error').text(translation.Error)
    $('#webviewbtn-Done').text(translation.Done)
    if (!InstEXT.length) InstEXT = await loadDataInstalledEXT()
    var webviewNeeded = [ 'EXT-Browser', 'EXT-Photos', 'EXT-YouTube', 'EXT-YouTubeCast' ]
    var displayNeeded = 0

    InstEXT.forEach(EXT => {
      if (webviewNeeded.indexOf(EXT) > -1) displayNeeded++
    })

    if (displayNeeded) $('#webview-Box').css("display", "block")

    document.getElementById('webviewbtn-Apply').onclick = function () {
      $.post("/setWebviewTag")
        .done(function( back ) {
          if (back.error) {
            $('#webviewbtn-Apply').css("display", "none")
            $('#webviewbtn-Error').css("display", "inline-block")
            alertify.success(back.error)
          } else {
            $('#webviewbtn-Apply').css("display", "none")
            $('#webviewbtn-Done').css("display", "inline-block")
            alertify.success(translation.Restart)
          }
        })
        .fail(function(err) {
          alertify.error("[WebviewTag] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
        })
    }

    document.getElementById('webviewbtn-Done').onclick = function () {
      $('#webview-Box').css("display", "none")
      webviewTag = true
    }
  }

  // screen control
  if (EXTStatus["EXT-Screen"].hello) {
    if (EXTStatus["EXT-Screen"].power) $('#Screen-Control').text(translation.TurnOff)
    else $('#Screen-Control').text(translation.TurnOn)
    setInterval (() => {
      if (EXTStatus["EXT-Screen"].power) $('#Screen-Control').text(translation.TurnOff)
      else $('#Screen-Control').text(translation.TurnOn)
    }, 1000)
    $('#Screen-Text').text(translation.Tools_Screen_Text)
    $('#Screen-Box').css("display", "block")

    document.getElementById('Screen-Control').onclick = function () {
      if (EXTStatus["EXT-Screen"].power) {
        $.post( "/EXT-Screen", { data: "OFF" })
          .done(function( back ) {
            if (back.error) {
              alertify.error(translation.Warn_Error)
            } else {
              alertify.success(translation.RequestDone)
            }
          })
          .fail(function(err) {
            alertify.error("[Screen] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
          })
      } else {
        $.post( "/EXT-Screen", { data: "ON" })
          .done(function( back ) {
            if (back == "error") {
              alertify.error(translation.Warn_Error)
            } else {
              alertify.success(translation.RequestDone)
            }
          })
          .fail(function(err) {
          alertify.error("[Screen] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
        })
      }
    }
  }

  // EXT-Alert query
  if (EXTStatus["EXT-Alert"].hello) {
    $('#Alert-Query').prop('placeholder', translation.Tools_Alert_Query)
    $('#Alert-Text').text(translation.Tools_Alert_Text)
    $('#Alert-Send').text(translation.Send)
    $('#Alert-Box').css("display", "block")
    $('#Alert-Query').keyup( function () {
      if($(this).val().length > 5) {
         $('#Alert-Send').removeClass('disabled')
      } else {
         $('#Alert-Send').addClass('disabled')
      }
    })

    document.getElementById('Alert-Send').onclick = function () {
      $('#Alert-Send').addClass('disabled')
      $.post( "/EXT-AlertQuery", { data: $('#Alert-Query').val() })
        .done(function( back ) {
          $('#Alert-Query').val('')
          if (back == "error") {
            alertify.error(translation.Warn_Error)
          } else {
            alertify.success(translation.RequestDone)
          }
        })
        .fail(function(err) {
          alertify.error("[Alert] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
        })
    }
  }

  // Volume control
  if (EXTStatus["EXT-Volume"].hello) {
    $('#Volume-Text').text(translation.Tools_Volume_Text)
    $('#Volume-Text2').text(translation.Tools_Volume_Text2)
    $('#Volume-Text3').text(translation.Tools_Volume_Text3)
    $('#Volume-Send').text(translation.Confirm)
    $('#Volume-Box').css("display", "block")
    setInterval(() => {
      $('#Volume-Set').text(EXTStatus["EXT-Volume"].speaker + "%")
    }, 1000)

    document.getElementById('Volume-Send').onclick = function () {
      $.post( "/EXT-VolumeSendSpeaker", { data: $('#Volume-Query').val() })
        .done(function( back ) {
          if (back == "error") {
            alertify.error(translation.Warn_Error)
          } else {
            alertify.success(translation.RequestDone)
          }
        })
        .fail(function(err) {
          alertify.error("[Volume] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
        })
    }
  }

  // mic control
  if (EXTStatus["EXT-Volume"].hello) {
    $('#Volume-Text-Record').text(translation.Tools_Volume_Text_Record)
    $('#Volume-Text-Record2').text(translation.Tools_Volume_Text2)
    $('#Volume-Text-Record3').text(translation.Tools_Volume_Text3)
    $('#Volume-Send-Record').text(translation.Confirm)
    $('#Volume-Box-Record').css("display", "block")
    setInterval(() => {
      $('#Volume-Set-Record').text(EXTStatus["EXT-Volume"].recorder + "%")
    }, 1000)

    document.getElementById('Volume-Send-Record').onclick = function () {
      $.post( "/EXT-VolumeSendRecorder", { data: $('#Volume-Query-Record').val() })
        .done(function( back ) {
          if (back == "error") {
            alertify.error(translation.Warn_Error)
          } else {
            alertify.success(translation.RequestDone)
          }
        })
        .fail(function(err) {
          alertify.error("[Volume] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
        })
    }
  }

  // Update Control
  if (EXTStatus["EXT-UpdateNotification"].hello) {
    $('#Update-Header').text(translation.Tools_Update_Header)
    $('#Update-Text').text(translation.Tools_Update_Text)
    $('#Update-Text2').text(translation.Tools_Update_Text2)
    // only on live
    setInterval(async() => {
      $('#Update-Confirm').text(translation.Confirm)
      var updateModules = EXTStatus["EXT-UpdateNotification"].module
      var updateNpm = EXTStatus["EXT-UpdateNotification"].npm
      if (!updateModules || !updateNpm) return $('#Update-Box').css("display", "none")
      if (!Object.keys(updateModules).length && !Object.keys(updateNpm).length) return $('#Update-Box').css("display", "none")
      if (Object.keys(updateModules).length) {
        $('#Update-Box').css("display", "block")
        for (const [key, value] of Object.entries(updateModules)) {
          if($("#" + key).length == 0) $("#Update-Modules-Box").append("<br><span id='"+key + "'>" + key + "</span>")
        }
        $('#Update-Modules-Box').css("display", "block")
      }
      if (Object.keys(updateNpm).length) {
        $('#Update-Box').css("display", "block")
        for (const [key, value] of Object.entries(updateNpm)) {
          var library = value.library.replace('@bugsounet/', '')
          if($("#" + value.module + "-" + library).length == 0) $("#Update-NPM-Box").append("<br><span id='"+ value.module + "-" + library + "'>" + key + "</span>")
        }
        $('#Update-NPM-Box').css("display", "block")
      }
     }, 1000)
    document.getElementById('Update-Confirm').onclick = function () {
      $('#Update-Confirm').addClass('disabled')
      $.post("/EXT-UNUpdate")
        .done(function( back ) {
          if (back == "error") {
            alertify.error(translation.Warn_Error)
          } else {
            alertify.success(translation.RequestDone)
          }
        })
        .fail(function(err) {
          alertify.error("[UpdateNotification] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
        })
    }
  }

  // Spotify Control
  if (EXTStatus["EXT-Spotify"].hello) {
    var type = null
    setInterval(() => {
      if(EXTStatus["EXT-Spotify"].connected || (EXTStatus["EXT-Spotify"].remote && EXTStatus["EXT-Spotify"].play)) {
        $('#Spotify-Play').css("display", "none")
        $('#Spotify-Stop').css("display", "block")
      } else {
        $('#Spotify-Play').css("display", "block")
        $('#Spotify-Stop').css("display", "none")
      }
    }, 1000)
    $('#Spotify-Text').text(translation.Tools_Spotify_Text)
    $('#Spotify-Text2').text(translation.Tools_Spotify_Text2)
    $('#Spotify-Send').text(translation.Send)
    $('#Spotify-Artist-Text').text(translation.Tools_Spotify_Artist)
    $('#Spotify-Track-Text').text(translation.Tools_Spotify_Track)
    $('#Spotify-Album-Text').text(translation.Tools_Spotify_Album)
    $('#Spotify-Playlist-Text').text(translation.Tools_Spotify_Playlist)
    $('#Spotify-Query').prop('placeholder', translation.Tools_Spotify_Query)
    $('#Spotify-Send').text(translation.Send)
    $('#Spotify-Box').css("display", "block")
    $('#Spotify-Query').keyup( function () {
      if($(this).val().length > 1 && type) {
         $('#Spotify-Send').removeClass('disabled')
      } else {
         $('#Spotify-Send').addClass('disabled')
      }
    })

    document.getElementById('Spotify-Send').onclick = function () {
      $('#Spotify-Send').addClass('disabled')
      $.post( "/EXT-SpotifyQuery", {
        data: {
          query: $('#Spotify-Query').val(),
          type: type
        }
      })
        .done(function( back ) {
          $('#Spotify-Query').val('')
          if (back == "error") {
            alertify.error(translation.Warn_Error)
          } else {
            alertify.success(translation.RequestDone)
          }
        })
        .fail(function(err) {
          alertify.error("[Spotify] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
        })
    }

    document.getElementById('Spotify-Play').onclick = function () {
      $.post("/EXT-SpotifyPlay")
    }

    document.getElementById('Spotify-Stop').onclick = function () {
      $.post("/EXT-SpotifyStop")
    }

    document.getElementById('Spotify-Next').onclick = function () {
      $.post("/EXT-SpotifyNext")
    }

    document.getElementById('Spotify-Previous').onclick = function () {
      $.post("/EXT-SpotifyPrevious")
    }

    document.getElementById('Spotify-Artist').onclick = function () {
      if (!this.checked) {
        type = null
        $('#Spotify-Send').addClass('disabled')
        return
      }
      type = "artist"
      $("#Spotify-Track").prop("checked", !this.checked)
      $("#Spotify-Album").prop("checked", !this.checked)
      $("#Spotify-Playlist").prop("checked", !this.checked)
      if ($('#Spotify-Query').val().length > 1) {
         $('#Spotify-Send').removeClass('disabled')
      } else {
         $('#Spotify-Send').addClass('disabled')
      }
    }

    document.getElementById('Spotify-Track').onclick = function () {
      if (!this.checked) {
        type = null
        $('#Spotify-Send').addClass('disabled')
        return
      }
      type = "track"
      $("#Spotify-Artist").prop("checked", !this.checked)
      $("#Spotify-Album").prop("checked", !this.checked)
      $("#Spotify-Playlist").prop("checked", !this.checked)
      if ($('#Spotify-Query').val().length > 1) {
         $('#Spotify-Send').removeClass('disabled')
      } else {
         $('#Spotify-Send').addClass('disabled')
      }
    }

    document.getElementById('Spotify-Album').onclick = function () {
      if (!this.checked) {
        type = null
        $('#Spotify-Send').addClass('disabled')
        return
      }
      type = "album"
      $("#Spotify-Artist").prop("checked", !this.checked)
      $("#Spotify-Track").prop("checked", !this.checked)
      $("#Spotify-Playlist").prop("checked", !this.checked)
      if ($('#Spotify-Query').val().length > 1) {
         $('#Spotify-Send').removeClass('disabled')
      } else {
         $('#Spotify-Send').addClass('disabled')
      }
    }

    document.getElementById('Spotify-Playlist').onclick = function () {
      if (!this.checked) {
        type = null
        $('#Spotify-Send').addClass('disabled')
        return
      }
      type = "playlist"
      $("#Spotify-Artist").prop("checked", !this.checked)
      $("#Spotify-Track").prop("checked", !this.checked)
      $("#Spotify-Album").prop("checked", !this.checked)
      if ($('#Spotify-Query').val().length > 1) {
         $('#Spotify-Send').removeClass('disabled')
      } else {
         $('#Spotify-Send').addClass('disabled')
      }
    }
  }

  // GoogleAssistant Query
  if (versionGA.find && versionGA.configured && versionGA.ready) {
    $('#GoogleAssistant-Text').text(translation.Tools_GoogleAssistant_Text)
    $('#GoogleAssistant-Query').prop('placeholder', translation.Tools_GoogleAssistant_Query)
    $('#GoogleAssistant-Send').text(translation.Send)
    $('#GoogleAssistant-Box').css("display", "block")
    $('#GoogleAssistant-Query').keyup( function () {
      if($(this).val().length > 5) {
         $('#GoogleAssistant-Send').removeClass('disabled')
      } else {
         $('#GoogleAssistant-Send').addClass('disabled')
      }
    })

    document.getElementById('GoogleAssistant-Send').onclick = function () {
      $('#GoogleAssistant-Send').addClass('disabled')
      $.post( "/EXT-GAQuery", { data: $('#GoogleAssistant-Query').val() })
        .done(function( back ) {
          $('#GoogleAssistant-Query').val('')
          if (back == "error") {
            alertify.error(translation.Warn_Error)
          } else {
            alertify.success(translation.RequestDone)
          }
        })
        .fail(function(err) {
          alertify.error("[GoogleAssistant] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
        })
    }
  }

  // YouTube Query
  if (EXTStatus["EXT-YouTube"].hello) {
    $('#YouTube-Text').text(translation.Tools_YouTube_Text)
    $('#YouTube-Query').prop('placeholder', translation.Tools_YouTube_Query)
    $('#YouTube-Send').text(translation.Send)
    $('#YouTube-Box').css("display", "block")
    $('#YouTube-Query').keyup( function () {
      if($(this).val().length > 1) {
         $('#YouTube-Send').removeClass('disabled')
      } else {
         $('#YouTube-Send').addClass('disabled')
      }
    })

    document.getElementById('YouTube-Send').onclick = function () {
      $.post( "/EXT-YouTubeQuery", { data: $('#YouTube-Query').val() })
        .done(function( back ) {
          $('#YouTube-Query').val('')
          if (back == "error") {
            alertify.error(translation.Warn_Error)
          } else {
            alertify.success(translation.RequestDone)
          }
        })
        .fail(function(err) {
          alertify.error("[YouTube] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
        })
    }
  }

  // RadioPlayer query
  if (EXTStatus["EXT-RadioPlayer"].hello) {
    $('#Radio-Text').text(translation.Tools_Radio_Text)
    $('#Radio-Send').text(translation.Listen)
    var radio = await loadRadio()
    if (radio.length) {
      radio.forEach(station => {
        $('#Radio-Query').append($('<option>', { 
          value: station,
          text : station,
          selected: false
        }))
      })
    }
    else {
      $('#Radio-Query').css("display", "none")
      $('#Radio-Text2').text(translation.Tools_Radio_Text2)
      $('#Radio-Text2').css("display", "block")
      $('#Radio-Send').addClass('disabled')
    }
    $('#Radio-Box').css("display", "block")
    document.getElementById('Radio-Send').onclick = function () {
      $.post( "/EXT-RadioQuery", { data: $('#Radio-Query').val() })
        .done(function( back ) {
          if (back == "error") {
            alertify.error(translation.Warn_Error)
          } else {
            alertify.success(translation.RequestDone)
          }
        })
        .fail(function(err) {
          alertify.error("[RadioPlayer] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
        })
    }
  }

  // FreeboxTV query
  if (EXTStatus["EXT-FreeboxTV"].hello && versionGW.lang == 'fr') {
    $('#FreeboxTV-Box').css("display", "block")
    document.getElementById('FreeboxTV-Send').onclick = function () {
      $.post( "/EXT-FreeboxTVQuery", { data: $('#FreeboxTV-Query').val() })
        .done(function( back ) {
          if (back == "error") {
            alertify.error(translation.Warn_Error)
          } else {
            alertify.success(translation.RequestDone)
          }
        })
        .fail(function(err) {
          alertify.error("[FreeboxTV] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
        })
    }
  }

  // Stop Command
  $('#Stop-Text').text(translation.Tools_Stop_Text)
  $('#Stop-Send').text(translation.Send)
  document.getElementById('Stop-Send').onclick = function () {
    $.post( "/EXT-StopQuery")
      .done(function( back ) {
        if (back == "error") {
          alertify.error(translation.Warn_Error)
        } else {
          alertify.success(translation.RequestDone)
        }
      })
      .fail(function(err) {
        alertify.error("[STOP] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
      })
  }

  setInterval(() => {
    if (this.hasPluginConnected(EXTStatus, "connected", true)) {
      $('#Stop-Box').css("display", "block")
    }
    else $('#Stop-Box').css("display", "none")
  }, 1000)
}

async function createEXTTable() {
  $(document).prop('title', translation.Plugins)
  $('#Plugins_Welcome').text(translation.Plugins_Welcome)
  if (!AllEXT.length) AllEXT = await loadDataAllEXT()
  if (!Object.keys(DescEXT).length) DescEXT = await loadDataDescriptionEXT()
  if (!InstEXT.length) InstEXT = await loadDataInstalledEXT()
  if (!ConfigEXT.length) ConfigEXT = await loadDataConfiguredEXT()
  var Content = `<div id="TableSorterCard" class="card" id="TableSorterCard"><div class="row table-topper align-items-center"><div class="col-4 text-start" style="margin: 0px;padding: 5px 15px;"><button class="btn btn-primary btn-sm reset" type="button" style="padding: 5px;margin: 2px;">${translation.Plugins_Table_Reset}</button></div><div class="col-4 text-center" style="margin: 0px;padding: 5px 10px;"><h6 id="counter" style="margin: 0px;">${translation.Plugins_Table_Showing}<strong id="rowCount">${AllEXT.length}</strong>${translation.Plugins_Table_Plugins}</h6></div></div><div class="row"><div class="col-12"><div>`
  
  Content +=`<table id="ipi-table" class="table table tablesorter"><thead class="thead-dark"><tr><th>${translation.Plugins_Table_Name}</th><th class="sorter-false">${translation.Plugins_Table_Description}</th><th class="filter-false">${translation.Plugins_Table_Actions}</th><th class="filter-false">${translation.Plugins_Table_Configuration}</th></tr></thead><tbody id="EXT">`
  
  AllEXT.forEach(pluginsName => {
    // wiki page link
    Content += `<tr><td class="text-nowrap fs-6 text-start click" data-bs-toggle="tooltip" style="cursor: pointer;" data-href="https://wiki.bugsounet.fr/${pluginsName}" title="${translation.Plugins_Table_Wiki} ${pluginsName}">${pluginsName}</td><td>${DescEXT[pluginsName]}</td>`

    // EXT install link
    if (InstEXT.indexOf(pluginsName) == -1) Content += `<td align="center"><a class="btn btn-primary btn-sm" role="button" data-bs-toggle="tooltip" title="${translation.Plugins_Table_Install} ${pluginsName}" href="/install?ext=${pluginsName}">${translation.Install}</a></td>`
    // EXT delete link
    else Content += `<td align="center"><a class="btn btn-danger btn-sm" role="button" data-bs-toggle="tooltip" title="${translation.Plugins_Table_Delete} ${pluginsName}" href="/delete?ext=${pluginsName}">${translation.Delete}</a></td>`
    
    if (InstEXT.indexOf(pluginsName) == -1) {
      if (ConfigEXT.indexOf(pluginsName) == -1) Content += '<td></td>'
      // config delete link
      else Content += `<td align="center"><a class="btn btn-danger btn-sm pulse animated infinite" data-bs-toggle="tooltip" title="${translation.Plugins_Table_DeleteConfig}" role="button" href="/EXTDeleteConfig?ext=${pluginsName}">${translation.Delete}</a></td>`
    } else {
      // configure link
      if (ConfigEXT.indexOf(pluginsName) == -1) Content += `<td align="center"><a class="btn btn-warning btn-sm pulse animated infinite" data-bs-toggle="tooltip" title="${translation.Plugins_Table_Configure}" role="button" href="/EXTCreateConfig?ext=${pluginsName}">${translation.Configure}</a></td>`
      // modify link
      else Content += `<td align="center"><a class="btn btn-success btn-sm" data-bs-toggle="tooltip" title="${translation.Plugins_Table_Modify}" role="button" href="/EXTModifyConfig?ext=${pluginsName}">${translation.Modify}</a></td>`
    }
    Content += '</tr>'
  })
    
  Content += `</tbody></table></div></div></div></div>`
  $("#EXTable").append(Content)
  $('td[class*="click"').click(function() {
    var win = window.open($(this).data("href"), '_blank');
    if (win) {
      win.focus();
    } else {
      //Browser has blocked it
      alert('Please allow popups for this website');
    }
  });
  enableSearchAndSort()
}

function enableSearchAndSort() {
  $("#ipi-table").tablesorter({
    theme: 'bootstrap',
    widthFixed : true,
    widgets : [ "filter", "columns", "zebra" ],
    ignoreCase: false,
    widgetOptions : {
      zebra : ["even", "odd"],
      columns: [ "primary", "secondary", "tertiary" ],
      filter_childRows : false,
      filter_childByColumn : false,
      filter_childWithSibs : true,
      filter_columnFilters : true,
      filter_columnAnyMatch: true,
      filter_cellFilter : '',
      filter_cssFilter : '', // or []
      filter_defaultFilter : {},
      filter_excludeFilter : {},
      filter_external : '',
      filter_filteredRow : 'filtered',
      filter_filterLabel : 'Filter "{{label}}" column by...',
      filter_formatter : null,
      filter_functions : null,
      filter_hideEmpty : true,
      filter_hideFilters : false,
      filter_ignoreCase : true,
      filter_liveSearch : true,
      filter_matchType : { 'input': 'exact', 'select': 'exact' },
      filter_onlyAvail : 'filter-onlyAvail',
      filter_placeholder : { search : translation.Plugins_Table_Search, select : '' },
      filter_reset : 'button.reset',
      filter_resetOnEsc : true,
      filter_saveFilters : true,
      filter_searchDelay : 300,
      filter_searchFiltered: true,
      filter_selectSource  : null,
      filter_serversideFiltering : false,
      filter_startsWith : false,
      filter_useParsedData : false,
      filter_defaultAttrib : 'data-value',
      filter_selectSourceSeparator : '|'
    }
  });

  $('.resetsaved').click(function() {
    $('#ipi-table').trigger('filterResetSaved');

    var $message = $('<span class="results"> Reset</span>').insertAfter(this);
    setTimeout(function() {
      $message.remove();
    }, 500);
    return false;
  });

  $('button[data-filter-column]').click(function() {
    var filters = [],
      $t = $(this),
      col = $t.data('filter-column'),
      txt = $t.data('filter-text') || $t.text();

    filters[col] = txt;
    $.tablesorter.setFilters( $('#table'), filters, true );

    return false;
  });

  $('table').bind('filterEnd', function(event, filteredRows){
    var rowCount = document.getElementById('rowCount')
    if (typeof rowCount !== "undefined") {
      var text = document.createTextNode(filteredRows.filteredRows)
      jQuery('#rowCount').html('')
      rowCount.appendChild(text)
    }
  });
}

//make viewJSEditor
async function viewJSEditor() {
  $(document).prop('title', translation.Configuration)
  $('#MMConfigHeader').text(translation.Configuration_Welcome)
  $('#EditLoadButton').text(translation.Configuration_EditLoad)
  var modules = await loadMMConfig()
  const container = document.getElementById('jsoneditor')

  const options = {
    mode: 'code',
    mainMenuBar: false,
    onEditable: function (node) {
      if (!node.path) {
        // In modes code and text, node is empty: no path, field, or value
        // returning false makes the text area read-only
        return false;
      }
    }
  }
  const editor = new JSONEditor(container, options, modules)
}

async function EditMMConfigJSEditor() {
  $(document).prop('title', translation.Configuration)
  $('#MMConfigHeader').text(translation.Configuration_Edit_Title)
  $('#wait').text(translation.Wait)
  $('#done').text(translation.Done)
  $('#error').text(translation.Error)
  $('#errorConfig').text(translation.Error)
  $('#save').text(translation.Save)
  $('#load').text(translation.Load)
  $('#wait').css("display", "none")
  $('#done').css("display", "none")
  $('#error').css("display", "none")
  $('#errorConfig').css("display", "none")
  $('#load').css("display", "none")
  $('#save').css("display", "none")
  $('#buttonGrp').removeClass('invisible')
  $('select option:contains("Loading")').text(translation.Configuration_Edit_AcualConfig)
  var allBackup = await loadBackupNames()
  var config = {}
  var conf = null
  var options = {
    mode: 'code',
    mainMenuBar: false,
    onValidationError: (errors) => {
      if (errors.length) {
        $('#save').css("display", "none")
        $('#externalSave').addClass('disabled')
        $('#errorConfig').css("display", "block")
      }
      else {
        $('#errorConfig').css("display", "none")
        $('#save').css("display", "block")
        $('#externalSave').removeClass('disabled')
      }
    }
  }
  
  if (window.location.search) {
    conf = decodeURIComponent(window.location.search.match(/(\?|&)config\=([^&]*)/)[2])
    if (conf == "default") config = await loadMMConfig()
    else {
      options = {
        mode: 'code',
        mainMenuBar: false,
        onEditable: function (node) {
          if (!node.path) {
            // In modes code and text, node is empty: no path, field, or value
            // returning false makes the text area read-only
            return false;
          }
        }
      }
      config = await loadBackupConfig(conf)
      $('#load').css("display", "block")
    }
  } else {
    conf = "default"
    config = await loadMMConfig()
  }
  $.each(allBackup, function (i, backup) {
    $('#backup').append($('<option>', { 
        value: backup,
        text : backup,
        selected: (backup == conf) ? true : false
    }))
  })
  const container = document.getElementById('jsoneditor')
  const message = document.getElementById('messageText')
  const editor = new JSONEditor(container, options, config)
  document.getElementById('load').onclick = function () {
    $('#load').css("display", "none")
    $('#wait').css("display", "block")
    $.post( "/loadBackup", { data: conf })
      .done(function( back ) {
        if (back.error) {
          $('#wait').css("display", "none")
          $('#error').css("display", "block")
          $('#alert').removeClass('invisible')
          $('#alert').removeClass('alert-success')
          $('#alert').addClass('alert-danger')
          $('#messageText').text(back.error)
        } else { 
          $('#wait').css("display", "none")
          $('#done').css("display", "block")
          $('#alert').removeClass('invisible')
          $('#messageText').text(translation.Restart)
        }
      })
      .fail(function(err) {
        alertify.error("[loadBackup] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
      })
  }
  document.getElementById('save').onclick = function () {
    let data = editor.getText()
    $('#save').css("display", "none")
    $('#wait').css("display", "block")
    $.post( "/writeConfig", { data: data })
      .done(function( back ) {
        if (back.error) {
          $('#wait').css("display", "none")
          $('#error').css("display", "block")
          $('#alert').removeClass('invisible')
          $('#alert').removeClass('alert-success')
          $('#alert').addClass('alert-danger')
          $('#messageText').text(back.error)
        } else { 
          $('#wait').css("display", "none")
          $('#done').css("display", "block")
          $('#alert').removeClass('invisible')
          $('#messageText').text(translation.Restart)
        }
      })
      .fail(function(err) {
        alertify.error("[writeConfig] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
      })
  }
  FileReaderJS.setupInput(document.getElementById('fileToLoad'), {
    readAsDefault: 'Text',
    on: {
      load: function (event, file) {
        if (event.target.result) {
          $.post( "/readExternalBackup", { data: event.target.result })
            .done(function( back ) {
              if (back.error) {
                alertify.error("[readExternalBackup]" + back.error)
              } else {
                editor.update(back.data)
                editor.refresh()
                alertify.sucess("External Config Loaded !" + back.error)
              }
            })
            .fail(function(err) {
              alertify.error("[readExternalBackup] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
            })
        }
      }
    }
  })
  document.getElementById('externalSave').onclick = function () {
    alertify.prompt( 'Gateway', 'Save config file as:', 'config', 
      function(evt, value) {
        let fileName = value
        if (fileName.indexOf(".") === -1) {
          fileName = fileName + ".js"
        } else {
          if (fileName.split('.').pop().toLowerCase() === "js") {
          // Nothing to do
          } else {
            fileName = fileName.split('.')[0] + ".js"
          }
        }
        var configToSave = editor.get()
        $.post( "/saveExternalBackup", { data: configToSave })
            .done(function( back ) {
              if (back.error) {
                alertify.error(back.error)
              } else {
                alertify.success("Download is ready !")
                $.get( "download/" + back.data, function( data ) {
                  const blob = new Blob([data], {type: 'application/javascript;charset=utf-8'})
                  saveAs(blob, fileName)
                })
              }
            })
            .fail(function(err) {
              alertify.error("[readExternalBackup] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
            })
      },
      function() {
         // do nothing
      }
    )
  }
}

async function EXTConfigJSEditor() {
  $(document).prop('title', translation.Plugins)
  $('#title').text(translation.Plugins_Initial_Title)
  $('#wait').text(translation.Wait)
  $('#done').text(translation.Done)
  $('#error').text(translation.Error)
  $('#save').text(translation.Save)
  $('#wait').css("display", "none")
  $('#done').css("display", "none")
  $('#error').css("display", "none")
  $('#buttonGrp').removeClass('invisible')
  var EXT = decodeURIComponent(window.location.search.match(/(\?|&)ext\=([^&]*)/)[2])
  $('#EXTName').text(EXT)
  var plugin = await loadPluginConfig(EXT)
  var template= await loadPluginTemplate(EXT)
  const container = document.getElementById('jsoneditor')

  const options = {
    schema: template,
    mode: 'tree',
    modes: ['code', 'tree'],
    enableTransform: false,
    enableSort: false,
    onValidate: (json) => {
      var errors = []
      /** Special rules for EXT-Detector **/
      if (EXT == "EXT-Detector" && json && json.config && Array.isArray(json.config.detectors)) {
        var SnowboyValidator = [ "smart_mirror", "jarvis", "computer", "snowboy", "subex", "neo_ya", "hey_extreme", "view_glass" ]
        var PorcupineValidator = [ "jarvis", "americano", "blueberry", "bumblebee", "grapefruit", "grasshopper", "hey google", "hey siri", "ok google", "picovoice", "porcupine", "terminator", "custom" ]
        json.config.detectors.forEach((detector, index) => {
          if (detector.detector == "Snowboy" && SnowboyValidator.indexOf(detector.Model) == -1) {
            errors.push({
              path: ['config', 'detectors', index, "Model"],
              message: detector.Model + " is not comptatible with Snowboy detector"
            })
          }
          if (detector.detector == "Porcupine" && PorcupineValidator.indexOf(detector.Model) == -1) {
            errors.push({
              path: ['config', 'detectors', index, "Model"],
              message: detector.Model + " is not comptatible with Porcupine detector"
            })
          }
        })
      }
      /** Rules for not change module name **/
      if (json && json.module && json.module != EXT) {
        errors.push({
          path: ['module'],
          message: translation.ErrModule + " " + EXT
        })
      }
      return errors
    },
    onValidationError: (errors) => {
      if (errors.length) $('#save').css("display", "none")
      else $('#save').css("display", "block")
    }
  }
  const editor = new JSONEditor(container, options, plugin)
  editor.expandAll()
  document.getElementById('save').onclick = function () {
    let data = editor.getText()
    $('#save').css("display", "none")
    $('#wait').css("display", "block")
    $.post( "/writeEXT", { data: data })
      .done(function( back ) {
        if (back.error) {
          $('#wait').css("display", "none")
          $('#error').css("display", "block")
          $('#alert').removeClass('invisible')
          $('#alert').removeClass('alert-success')
          $('#alert').addClass('alert-danger')
          $('#messageText').text(back.error)
        } else { 
          $('#wait').css("display", "none")
          $('#done').css("display", "block")
          $('#alert').removeClass('invisible')
          $('#messageText').text(translation.Restart)
        }
      })
      .fail(function(err) {
        alertify.error("[writeEXT] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
      })
  }
}

async function EXTModifyConfigJSEditor() {
  $(document).prop('title', translation.Plugins)
  $('#title').text(translation.Plugins_Modify_Title)
  $('#wait').text(translation.Wait)
  $('#done').text(translation.Done)
  $('#error').text(translation.Error)
  $('#save').text(translation.Save)
  $('#wait').css("display", "none")
  $('#done').css("display", "none")
  $('#error').css("display", "none")
  $('#configError').css("display", "none")
  $('#buttonGrp').removeClass('invisible')
  $('#title').text(translation.Plugins_Modify_Title)
  $('#loadDefault').text(translation.LoadDefault)
  $('#mergeDefault').text(translation.MergeDefault)
  $('#configError').text(translation.Error)
  $('#buttonGrp2').removeClass('invisible')
  var EXT = undefined
  if (window.location.search) {
    EXT = decodeURIComponent(window.location.search.match(/(\?|&)ext\=([^&]*)/)[2])
  }
  $('#EXTName').text(EXT)
  var plugin = await loadPluginCurrentConfig(EXT)
  var template= await loadPluginTemplate(EXT)
  var defaultConfig = await loadPluginConfig(EXT)
  const container = document.getElementById('jsoneditor')

  const options = {
    schema: template,
    mode: 'tree',
    modes: ['code', 'tree'],
    enableTransform: false,
    enableSort: false,
    onValidate: (json) => {
      var errors = []
      /** Special rules for EXT-Detector **/
      if (EXT == "EXT-Detector" && json && json.config && Array.isArray(json.config.detectors)) {
        var SnowboyValidator = [ "smart_mirror", "jarvis", "computer", "snowboy", "subex", "neo_ya", "hey_extreme", "view_glass" ]
        var PorcupineValidator = [ "jarvis", "americano", "blueberry", "bumblebee", "grapefruit", "grasshopper", "hey google", "hey siri", "ok google", "picovoice", "porcupine", "terminator", "custom" ]
        json.config.detectors.forEach((detector, index) => {
          if (detector.detector == "Snowboy" && SnowboyValidator.indexOf(detector.Model) == -1) {
            errors.push({
              path: ['config', 'detectors', index, "Model"],
              message: detector.Model + " " + translation.Plugins_Error_Snowboy
            })
          }
          if (detector.detector == "Porcupine" && PorcupineValidator.indexOf(detector.Model) == -1) {
            errors.push({
              path: ['config', 'detectors', index, "Model"],
              message: detector.Model + " " + translation.Plugins_Error_Porcupine
            })
          }
        })
      }
      /** Rules for not change module name **/
      if (json && json.module && json.module != EXT) {
        errors.push({
          path: ['module'],
          message: translation.ErrModule + " " + EXT
        })
      }
      return errors
    },
    onValidationError: (errors) => {
      if (errors.length) {
        $('#save').css("display", "none")
        $('#mergeDefault').css("display", "none")
        $('#configError').css("display", "block")
      } else {
        $('#configError').css("display", "none")
        $('#save').css("display", "block")
        $('#mergeDefault').css("display", "block")
      }
    }
  }
  const editor = new JSONEditor(container, options, plugin)
  editor.expandAll()
  document.getElementById('save').onclick = function () {
    let data = editor.getText()
    $('#save').css("display", "none")
    $('#wait').css("display", "block")
    $.post( "/writeEXT", { data: data })
      .done(function( back ) {
        if (back.error) {
          $('#wait').css("display", "none")
          $('#error').css("display", "block")
          $('#alert').removeClass('invisible')
          $('#alert').removeClass('alert-success')
          $('#alert').addClass('alert-danger')
          $('#messageText').text(back.error)
        } else { 
          $('#wait').css("display", "none")
          $('#done').css("display", "block")
          $('#alert').removeClass('invisible')
          $('#messageText').text(translation.Restart)
        }
      })
      .fail(function(err) {
        alertify.error("[writeEXT] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
      })
  }
  document.getElementById('loadDefault').onclick = async function () {
    editor.set(defaultConfig)
    editor.expandAll()
  }

  document.getElementById('mergeDefault').onclick = async function () {
    var actualConfig= editor.get()
    actualConfig= configMerge({}, defaultConfig, actualConfig)
    editor.set(actualConfig)
    editor.expandAll()
  }
}

async function EXTDeleteConfigJSEditor() {
  $(document).prop('title', translation.Plugins)
  $('#title').text(translation.Plugins_DeleteConfig_Title)
  $('#wait').text(translation.Wait)
  $('#done').text(translation.Done)
  $('#error').text(translation.Error)
  $('#confirm').text(translation.Confirm)
  $('#wait').css("display", "none")
  $('#done').css("display", "none")
  $('#error').css("display", "none")
  $('#buttonGrp').removeClass('invisible')
  $('#confirm').css("display", "block")
  var EXT = decodeURIComponent(window.location.search.match(/(\?|&)ext\=([^&]*)/)[2])
  $('#EXTName').text(EXT)
  var plugin = await loadPluginCurrentConfig(EXT)
  const container = document.getElementById('jsoneditor')

  const options = {
    mode: 'code',
    mainMenuBar: false,
    onEditable: function (node) {
      if (!node.path) {
        // In modes code and text, node is empty: no path, field, or value
        // returning false makes the text area read-only
        return false;
      }
    }
  }
  const editor = new JSONEditor(container, options, plugin)
  document.getElementById('confirm').onclick = function () {
    $('#confirm').css("display", "none")
    $('#wait').css("display", "block")
    $.post( "/deleteEXT", { data: EXT })
      .done(function( back ) {
        if (back.error) {
          $('#wait').css("display", "none")
          $('#error').css("display", "block")
          $('#alert').removeClass('invisible')
          $('#alert').removeClass('alert-success')
          $('#alert').addClass('alert-danger')
          $('#messageText').text(back.error)
        } else { 
          $('#wait').css("display", "none")
          $('#done').css("display", "block")
          $('#alert').removeClass('invisible')
          $('#messageText').text(translation.Plugins_DeleteConfig_Confirmed)
        }
      })
      .fail(function(err) {
        alertify.error("[deleteEXT] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
      })
  }
}

function GatewaySetting() {
  //translate parts
  $(document).prop('title', translation.Setting)
  $('#setting_title').text(translation.Setting_Title)
  $('#version').text(versionGW.v)
  $('#rev').text(versionGW.rev)
  $('#language').text(versionGW.lang)
  $('#update').text(translation.Save)
  $('#wait').text(translation.Wait)
  $('#restart').text(translation.Tools_Restart)
  $('#credentials').text(translation.Setting_Credentials)
  $('#usernameField').text(translation.Setting_Credentials_username)
  $('#passwordField').text(translation.Setting_Credentials_password)
  $('#confirmpwdField').text(translation.Setting_Credentials_confirmpwd)
  $('#clientIDField').text(translation.Setting_Credentials_clientID)
  $('#username').prop('placeholder', translation.Setting_Credentials_username_placeholder)
  $('#password').prop('placeholder', translation.Setting_Credentials_password_placeholder)
  $('#confirmpwd').prop('placeholder', translation.Setting_Credentials_confirmpwd_placeholder)
  $('#clientID').prop('placeholder', translation.Setting_Credentials_clientID_placeholder)

  $('#options').text(translation.Setting_Options)
  $('#debugHeader').text(translation.Setting_Options_debug)
  $('#pm2Header').text(translation.Setting_Options_usePM2)
  $('#pm2idHeader').text(translation.Setting_Options_PM2Id)
  $('#byHeader').text(translation.Setting_Info_by)
  $('#SupportHeader').text(translation.Setting_Info_Support)
  $('#DonateHeader').text(translation.Setting_Info_Donate)
  $('#DonateText').text(translation.Setting_Info_Donate_Text)
  $('#VersionHeader').text(translation.Setting_Info_About)

  for (let tr = 1; tr <= 10; tr++) {
    let trans = "Setting_Info_Translator"+tr
    if (tr == 1 && translation[trans]) {
      $('#Translators').text(translation.Setting_Info_Translator)
      $('#translatorsBox').css("display", "flex")
    }
    if (translation[trans]) $('#translator-'+tr).text(translation[trans])
  }

  $('#restart').css("display", "none")
  $('#wait').css("display", "none")
  $('#buttonGrp').removeClass('invisible')

  $('#update').css("display", "block")

  $("#username").val(actualSetting.username)
  $("#password").val(actualSetting.password)

  $("#clientID").val(actualSetting.CLIENT_ID)

  $("#debug").prop("checked", actualSetting.debug)
  $("#pm2").prop("checked", actualSetting.usePM2)
  $("select.grppm2").prop("disabled", !actualSetting.usePM2)
  $("#pm2id option[value='" + actualSetting.PM2Id + "']").prop('selected', true)

  document.getElementById('pm2').onclick = function () {
    $("select.grppm2").prop("disabled", !this.checked)
  }
  
  $("#GatewaySetting").submit(function(event) {
    var newGatewayConfig= {
      module: "Gateway",
      config: {
        debug: false,
        username: "admin",
        password: "admin",
        usePM2: false,
        PM2Id: 0,
        CLIENT_ID: null
      }
    }
    event.preventDefault()
    var username = $( "input[type=text][name=username]").val()
    var password = $( "input[type=password][name=password]" ).val()
    var confirm = $( "input[type=password][name=confirmpwd]" ).val()
    var clientID = $( "input[type=text][name=clientID]" ).val()
    if (!username) {
      $('#alert').removeClass('invisible')
      $('#alert').removeClass('alert-success')
      $('#alert').addClass('alert-danger')
      $('#messageText').text(translation.Setting_Credentials_username_placeholder)
      return
    }
    if (!password) {
      $('#alert').removeClass('invisible')
      $('#alert').removeClass('alert-success')
      $('#alert').addClass('alert-danger')
      $('#messageText').text(translation.Setting_Credentials_password_placeholder)
      return
    }
    if (password != confirm) {
      $('#alert').removeClass('invisible')
      $('#alert').removeClass('alert-success')
      $('#alert').addClass('alert-danger')
      $('#messageText').text(translation.Setting_Credentials_confirmpwd_placeholder)
      return
    }
    newGatewayConfig.config.username = username
    newGatewayConfig.config.password = password
    newGatewayConfig.config.CLIENT_ID = clientID

    newGatewayConfig.config.CLIENT_ID = clientID || null

    var debug = $( "input[type=checkbox][name=debug]:checked" ).val()
    newGatewayConfig.config.debug = debug ? true : false

    var pm2 = $( "input[type=checkbox][name=pm2]:checked" ).val()
    var pm2id = Number($( "select#pm2id" ).val())
    newGatewayConfig.config.usePM2 = pm2 ? true : false
    newGatewayConfig.config.PM2Id = pm2 ? pm2id : 0

    $('#alert').removeClass('invisible')
    $('#alert').removeClass('alert-danger')
    $('#alert').addClass('alert-success')
    $('#messageText').text("Update in progress...")
    $('#restart').css("display", "none")
    $('#update').css("display", "none")
    $('#wait').css("display", "block")
  
    $.post( "/saveSetting", { data: JSON.stringify(newGatewayConfig) })
      .done(function( back ) {
        if (back.error) {
          $('#alert').removeClass('invisible')
          $('#alert').removeClass('alert-success')
          $('#alert').addClass('alert-danger')
          $('#messageText').text(back.error)
          $('#restart').css("display", "none")
          $('#wait').css("display", "none")
          $('#update').css("display", "block")
        } else {
          $('#alert').removeClass('invisible')
          $('#alert').removeClass('alert-danger')
          $('#alert').addClass('alert-success')
          $('#messageText').text(translation.Restart)
          $('#wait').css("display", "none")
          $('#update').css("display", "none")
          $('#restart').css("display", "block")
        }
      })
      .fail(function(err) {
        alertify.error("[saveSetting] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
      })
  })
}

/** config merge **/
function configMerge(result) {
  var stack = Array.prototype.slice.call(arguments, 1)
  var item
  var key
  while (stack.length) {
    item = stack.shift()
    for (key in item) {
      if (item.hasOwnProperty(key)) {
        if (typeof result[key] === "object" && result[key] && Object.prototype.toString.call(result[key]) !== "[object Array]") {
          if (typeof item[key] === "object" && item[key] !== null) {
            result[key] = configMerge({}, result[key], item[key])
          } else {
            result[key] = item[key]
          }
        } else {
          result[key] = item[key]
        }
      }
    }
  }
  return result
}

/** fetch datas **/
function getGatewaySetting() {
  return new Promise(resolve => {  
    $.getJSON("/getSetting" , (confGW) => {
      //console.log("SettingGW", confGW)
      resolve(confGW)
    })
    .fail(function(err) {
      if (!err.status) alertify.error("Connexion Lost!")
      else alertify.warning("[getGatewaySetting] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
    })
  })
}

function getGatewayVersion() {
  return new Promise(resolve => {  
    $.getJSON("/version" , (versionGW) => {
      //console.log("Version", versionGW)
      resolve(versionGW)
    })
    .fail(function(err) {
      if (!err.status) alertify.error("Connexion Lost!")
      else alertify.warning("[getGatewayVersion] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
    })
  })
}

function loadPluginCurrentConfig(plugin) {
  return new Promise(resolve => {
    $.getJSON("/EXTGetCurrentConfig?ext="+plugin , (currentConfig) => {
      //console.log("CurrentConfig", currentConfig)
      resolve(currentConfig)
    })
    .fail(function(err) {
      if (!err.status) alertify.error("Connexion Lost!")
      else alertify.warning("[loadPluginCurrentConfig] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
    })
  })
}

function checkWebviewTag() {
  return new Promise(resolve => {
    $.getJSON("/getWebviewTag" , (tag) => {
      //console.log("webviewTag", tag)
      resolve(tag)
    })
    .fail(function(err) {
      if (!err.status) alertify.error("Connexion Lost!")
      else alertify.warning("[checkWebviewTag] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
    })
  })
}

function checkGA() {
  return new Promise(resolve => {
    $.getJSON("/getGAVersion" , (GA) => {
      //console.log("GAVersion", GA)
      resolve(GA)
    })
    .fail(function(err) {
      if (!err.status) alertify.error("Connexion Lost!")
      else alertify.warning("[checkGA] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
    })
  })
}

function checkEXTStatus() {
  return new Promise(resolve => {
    $.getJSON("/getEXTStatus" , (Status) => {
      //console.log("EXTStatus", Status)
      resolve(Status)
    })
      .done(() => {
        if(ErrEXTStatus) {
          ErrEXTStatus= 0
          alertify.success("EXTStatus: Connected!")
        }
      })
      .fail((err) => {
        ErrEXTStatus++
        if (ErrEXTStatus== 1) alertify.error("EXTStatus: Connexion Lost!")
        if (err.status == 403) $(location).attr('href',"/")
      })
  })
}

function loadTranslation() {
  return new Promise(resolve => {
    $.getJSON("/translation" , (tr) => {
      //console.log("Translation", tr)
      resolve(tr)
    })
    .fail(function(err) {
      if (!err.status) alertify.error("Connexion Lost!")
      else alertify.warning("[loadTranslation] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
    })
  })
}

function loadDataAllEXT() {
  return new Promise(resolve => {
    $.getJSON("/allEXT" , (all) => {
      //console.log("allEXT", all)
      resolve(all)
    })
    .fail(function(err) {
      if (!err.status) alertify.error("Connexion Lost!")
      else alertify.warning("[loadDataAllEXT] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
    })
  })
}

function loadDataConfiguredEXT() {
  return new Promise(resolve => {  
    $.getJSON("/ConfiguredEXT" , (confEXT) => {
      //console.log("ConfiguredEXT", confEXT)
      resolve(confEXT)
    })
    .fail(function(err) {
      if (!err.status) alertify.error("Connexion Lost!")
      else alertify.warning("[loadDataConfiguredEXT] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
    })
  })
}

function loadDataInstalledEXT() {
  return new Promise(resolve => {
    $.getJSON("/InstalledEXT" , (instEXT) => {
      //console.log("InstalledEXT", instEXT)
      resolve(instEXT)
    })
    .fail(function(err) {
      if (!err.status) alertify.error("Connexion Lost!")
      else alertify.warning("[loadDataInstalledEXT] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
    })
  })
}

function loadDataDescriptionEXT() {
  return new Promise(resolve => {
    $.getJSON("/DescriptionEXT" , (desEXT) => {
      //console.log("DescriptionEXT", desEXT)
      resolve(desEXT)
    })
    .fail(function(err) {
      if (!err.status) alertify.error("Connexion Lost!")
      else alertify.warning("[loadDataDescriptionEXT] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
    })
  })
}

function loadMMConfig() {
  return new Promise(resolve => {  
    $.getJSON("/GetMMConfig" , (config) => {
      //console.log("MMConfig", config)
      resolve(config)
    })
    .fail(function(err) {
      if (!err.status) alertify.error("Connexion Lost!")
      else alertify.warning("[loadMMConfig] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
    })
  })
}

function loadPluginConfig(plugin) {
  return new Promise(resolve => {
    $.getJSON("/EXTGetDefaultConfig?ext="+plugin , (defaultConfig) => {
      //console.log("defaultConfig", defaultConfig)
      resolve(defaultConfig)
    })
    .fail(function(err) {
      if (!err.status) alertify.error("Connexion Lost!")
      else alertify.warning("[loadPluginConfig] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
    })
  })
}

function loadPluginTemplate(plugin) {
  return new Promise(resolve => {
    $.getJSON("/EXTGetDefaultTemplate?ext="+plugin , (defaultTemplate) => {
      //console.log("defaultTemplate", defaultTemplate)
      resolve(defaultTemplate)
    })
    .fail(function(err) {
      if (!err.status) alertify.error("Connexion Lost!")
      else alertify.warning("[loadPluginTemplate] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
    })
  })
}

function loadBackupConfig(file) {
  return new Promise(resolve => {
    $.getJSON("/GetBackupFile?config="+file , (backupFile) => {
      //console.log("backupFile", backupFile)
      resolve(backupFile)
    })
    .fail(function(err) {
      if (!err.status) alertify.error("Connexion Lost!")
      else alertify.warning("[loadBackupConfig] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
    })
  })
}

function loadBackupNames() {
  return new Promise(resolve => {
    $.getJSON("/GetBackupName" , (backups) => {
      //console.log("backups", backups)
      resolve(backups)
    })
    .fail(function(err) {
      if (!err.status) alertify.error("Connexion Lost!")
      else alertify.warning("[loadBackupNames] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
    })
  })
}

function loadRadio() {
  return new Promise(resolve => {
    $.getJSON("/GetRadioStations" , (radio) => {
      //console.log("radio", radio)
      resolve(radio)
    })
    .fail(function(err) {
      if (!err.status) alertify.error("Connexion Lost!")
      if (err.status == 404) resolve([])
      else alertify.warning("[loadRadio] Gateway Server return Error " + err.status + " ("+ err.statusText+")")
      
    })
  })    
  
}

function hasPluginConnected(obj, key, value) {
  if (typeof obj === 'object' && obj !== null) {
    if (obj.hasOwnProperty(key)) return true
    for (var p in obj) {
      if (obj.hasOwnProperty(p) && this.hasPluginConnected(obj[p], key, value)) {
        //logGW("check", key+":"+value, "in", p)
        if (obj[p][key] == value) {
          //logGW(p, "is connected")
          return true
        }
      }
    }
  }
  return false
}

function processSelectedFiles(fileInput) {
  let files = fileInput.files
  let file = files[0].name

  $('#backup').append($('<option>', {
    value: "default",
    text : file,
    selected: true
  }))
}
