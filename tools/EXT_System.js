/** EXT System
* @bugsounet
**/

// rotate rules

PleaseRotateOptions = {
  startOnPageLoad: false
}

// define all vars
var translation= {}
var versionGW = {}
var System = {}
var SystemInterval = null
var SystemFirstScan = true

// Load rules
window.addEventListener("load", async event => {
  versionGW = await getGatewayVersion()
  translation = await loadTranslation()

  $('html').prop("lang", versionGW.lang)
  switch (window.location.pathname) {
    case "/SystemRestart":
      doRestart()
      break
    case "/SystemDie":
      doDie()
      break
    case "/System":
      doSystem(()=> { doSpeedTest() })
      break
  }

  doTranslateNavBar()
})

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

async function doSystem(cb= null) {
  clearInterval(SystemInterval)
  SystemInterval = null

  system = await checkSystem()
  console.log(translation)
  $("#ShutdownSystem").text(translation.System_Box_Shutdown)
  $("#Shutdown").text(translation.System_Shutdown)
  $("#RestartSystem").text(translation.System_Box_Restart)
  $("#Restart").text(translation.System_Restart)

  progressOrText(system)
  window.addEventListener('resize', function() {
    progressOrText(system)
  })

  //console.log(system)

  SystemInterval = setInterval(async() => {
    doSystem()
  }, 15000)

  $('#HOSTNAME').text(system.HOSTNAME)
  // versions
  $('#MMVersion').text(system.VERSION.MagicMirror)
  $('#ElectronVersion').text(system.VERSION.ELECTRON)
  $('#NODEMM').text(system.VERSION.NODEMM)
  $('#NODECORE').text(system.VERSION.NODECORE)
  $('#NPM').text(system.VERSION.NPM)
  $('#OS').text(system.VERSION.OS)
  $('#KERNEL').text(system.VERSION.KERNEL)
  //CPU
  $('#CPU').text(system.CPU.type)
  $('#SPEED').text(system.CPU.speed)
  $('#GOVERNOR').text(system.CPU.governor)

  $("#TempText").text(system.CPU.temp.C +"°c")
  if (system.CPU.temp.C <= 50) {
    $("#TempDisplay").removeClass("bg-warning")
    $("#LoadDisplay").removeClass("bg-danger")
    $("#TempDisplay").addClass("bg-success")

    $("#TempText").removeClass("text-warning")
    $("#TempText").removeClass("text-danger")
    $("#TempText").addClass("text-success")
  } else if (system.CPU.temp.C > 50 && system.CPU.temp.C <= 80) {
    $("#TempDisplay").removeClass("bg-success")
    $("#TempDisplay").removeClass("bg-danger")
    $("#TempDisplay").addClass("bg-warning")

    $("#TempText").removeClass("text-success")
    $("#TempText").removeClass("text-danger")
    $("#TempText").addClass("text-warning")
  } else if (system.CPU.temp.C > 80) {
    $("#TempDisplay").removeClass("bg-success")
    $("#TempDisplay").removeClass("bg-warning")
    $("#TempDisplay").addClass("bg-danger")

    $("#TempText").removeClass("text-success")
    $("#TempText").removeClass("text-warning")
    $("#TempText").addClass("text-danger")
  }

  $("#MemoryText").text(system.MEMORY.used)
  $('#MemoryTotal').text(system.MEMORY.total)
  if (system.MEMORY.percent <= 50) {
    $("#MemoryDisplay").removeClass("bg-warning")
    $("#MemoryDisplay").removeClass("bg-danger")
    $("#MemoryDisplay").addClass("bg-success")

    $("#MemoryText").removeClass("text-warning")
    $("#MemoryText").removeClass("text-danger")
    $("#MemoryText").addClass("text-success")
  } else if (system.MEMORY.percent > 50 && system.MEMORY.percent <= 80) {
    $("#MemoryDisplay").removeClass("bg-success")
    $("#MemoryDisplay").removeClass("bg-danger")
    $("#MemoryDisplay").addClass("bg-warning")

    $("#MemoryText").removeClass("text-success")
    $("#MemoryText").removeClass("text-danger")
    $("#MemoryText").addClass("text-warning")
  } else if (system.MEMORY.percent > 80) {
    $("#MemoryDisplay").removeClass("bg-success")
    $("#MemoryDisplay").removeClass("bg-warning")
    $("#MemoryDisplay").addClass("bg-danger")

    $("#MemoryText").removeClass("text-success")
    $("#MemoryText").removeClass("text-warning")
    $("#MemoryText").addClass("text-danger")
  }

  $("#SwapText").text(system.MEMORY.swapUsed)
  $('#SwapTotal').text(system.MEMORY.swapTotal)
  if (system.MEMORY.swapPercent <= 50) {
    $("#SwapDisplay").removeClass("bg-warning")
    $("#SwapDisplay").removeClass("bg-danger")
    $("#SwapDisplay").addClass("bg-success")

    $("#SwapText").removeClass("text-warning")
    $("#SwapText").removeClass("text-danger")
    $("#SwapText").addClass("text-success")
  } else if (system.MEMORY.swapPercent > 50 && system.MEMORY.swapPercent <= 80) {
    $("#SwapDisplay").removeClass("bg-success")
    $("#SwapDisplay").removeClass("bg-danger")
    $("#SwapDisplay").addClass("bg-warning")

    $("#SwapText").removeClass("text-success")
    $("#SwapText").removeClass("text-danger")
    $("#SwapText").addClass("text-warning")
  } else if (system.MEMORY.swapPercent > 80) {
    $("#SwapDisplay").removeClass("bg-success")
    $("#SwapDisplay").removeClass("bg-warning")
    $("#SwapDisplay").addClass("bg-danger")

    $("#SwapText").removeClass("text-success")
    $("#SwapText").removeClass("text-warning")
    $("#SwapText").addClass("text-danger")
  }

  $("#LoadText").text(system.CPU.usage +"%")
  if (system.CPU.usage <= 50) {
    $("#LoadDisplay").removeClass("bg-warning")
    $("#LoadDisplay").removeClass("bg-danger")
    $("#LoadDisplay").addClass("bg-success")

    $("#LoadText").removeClass("text-warning")
    $("#LoadText").removeClass("text-danger")
    $("#LoadText").addClass("text-success")
  } else if (system.CPU.usage > 50 && system.CPU.usage <= 80) {
    $("#LoadDisplay").removeClass("bg-success")
    $("#LoadDisplay").removeClass("bg-danger")
    $("#LoadDisplay").addClass("bg-warning")

    $("#LoadText").removeClass("text-success")
    $("#LoadText").removeClass("text-danger")
    $("#LoadText").addClass("text-warning")
  } else if (system.CPU.usage > 80) {
    $("#LoadDisplay").removeClass("bg-success")
    $("#LoadDisplay").removeClass("bg-warning")
    $("#LoadDisplay").addClass("bg-danger")

    $("#LoadText").removeClass("text-success")
    $("#LoadText").removeClass("text-warning")
    $("#LoadText").addClass("text-danger")
  }

  // try to create proper storage
  system.STORAGE.forEach((partition, id) => {
    for (let [name, values] of Object.entries(partition)) {
      if ($("#Storage-Part"+id).html()) {
        this.checkPartColor(id, values.use)
        this.makeRefresh(values.use, "#StorageDisplay"+ id, "#StorageUsed"+ id, values.use+"%")
        continue
      }
      var tr = document.createElement("tr")
      tr.id = "Storage-Part"+id

      var label = document.createElement("td")
      label.textContent = name

      var used = document.createElement("td")
      used.textContent = values.used

      var percent = document.createElement("td")
      percent.colSpan = 10
      percent.style.verticalAlign= "middle"

      var text = document.createElement("div")
      text.id = "StorageText"+id
      text.className = "visually-hidden"
      text.textContent = values.use + "%"
      percent.appendChild(text)

      var container = document.createElement("div")
      container.id = "Storage"+id
      container.className = "flex-fill progress"
      container.style.background = "#212121"
        var progress = document.createElement("div")
        progress.id = "StorageDisplay"+ id
        progress.className= "progress-bar progress-bar-striped progress-bar-animated bg-success"
        this.checkPartColor(id, values.use)
      container.appendChild(progress)
          var usedValue = document.createElement("span")
          usedValue.id = "StorageUsed"+ id
          usedValue.setAttribute("style", "color: #000;font-weight: bold;text-align: right;margin-right: 5px;")
          progress.appendChild(usedValue)
      percent.appendChild(container)

      var size = document.createElement("td")
      size.textContent = values.size

      tr.appendChild(label)
      tr.appendChild(used)
      tr.appendChild(percent)
      tr.appendChild(size)
      $("#Storage").append(tr)
      this.checkPartColor(id, values.use)
      this.makeProgress(values.use, "#StorageDisplay"+ id, "#StorageUsed"+ id, values.use+"%")
    }
  })

  $('#SysUptime').text(system.UPTIME.currentDHM)
  $('#MMUptime').text(system.UPTIME.MMDHM)
  $('#SysUptimeRecord').text(system.UPTIME.recordCurrentDHM)
  $('#MMUptimeRecord').text(system.UPTIME.recordMMDHM)

  if (SystemFirstScan) {
    this.makeProgress(system.CPU.temp.C, "#TempDisplay", "#TempValue", system.CPU.temp.C+"°c")
    this.makeProgress(system.MEMORY.percent, "#MemoryDisplay", "#MemoryPercent", system.MEMORY.used)
    this.makeProgress(system.MEMORY.swapPercent, "#SwapDisplay", "#SwapPercent", system.MEMORY.swapUsed)
    this.makeProgress(system.CPU.usage, "#LoadDisplay", "#LoadValue", system.CPU.usage+"%")
  } else {
    this.makeRefresh(system.CPU.temp.C, "#TempDisplay", "#TempValue", system.CPU.temp.C+"°c")
    this.makeRefresh(system.MEMORY.percent, "#MemoryDisplay", "#MemoryPercent", system.MEMORY.used)
    this.makeRefresh(system.MEMORY.swapPercent, "#SwapDisplay", "#SwapPercent", system.MEMORY.swapUsed)
    this.makeRefresh(system.CPU.usage, "#LoadDisplay", "#LoadValue", system.CPU.usage+"%")
  }
  SystemFirstScan = false

  if (system.NETWORK.type == "wireless") {
    $("#SpeedArea").addClass("visually-hidden")
    $("#DuplexArea").addClass("visually-hidden")
    $("#wired-icon").addClass("visually-hidden")
    $("#wireless-icon").removeClass("visually-hidden")
    $("#wirelessSignal").removeClass("visually-hidden")
    $("#wireless").removeClass("signal-0")
    $("#wireless").removeClass("signal-1")
    $("#wireless").removeClass("signal-2")
    $("#wireless").removeClass("signal-3")
    $("#wireless").removeClass("signal-4")
    $("#wireless").addClass("signal-"+system.NETWORK.barLevel)
    $("#wirelessInfo").removeClass("visually-hidden")
    $('#ssid').text(system.NETWORK.ssid)
    $('#rate').text(system.NETWORK.bitRate)
    $('#txPower').text(system.NETWORK.txPower)
    $('#quality').text(system.NETWORK.linkQuality)
    $('#qualityMax').text(system.NETWORK.maxLinkQuality)
    $('#signalLevel').text(system.NETWORK.signalLevel)
    $('#frequency').text(system.NETWORK.frequency)
  } else if (system.NETWORK.type == "wired") {
    $("#SpeedArea").removeClass("visually-hidden")
    $("#DuplexArea").removeClass("visually-hidden")
    $("#wirelessSignal").addClass("visually-hidden")
    $("#wired-icon").removeClass("visually-hidden")
    $("#wireless-icon").addClass("visually-hidden")
    $("#wirelessInfo").addClass("visually-hidden")
    $('#speed').text(system.NETWORK.speed)
    $('#duplex').text(system.NETWORK.duplex)
  } else {
    $("#SpeedArea").addClass("visually-hidden")
    $("#DuplexArea").addClass("visually-hidden")
    $("#wirelessSignal").addClass("visually-hidden")
    $("#wired-icon").addClass("visually-hidden")
    $("#wireless-icon").addClass("visually-hidden")
    $("#wirelessInfo").addClass("visually-hidden")
  }
  $('#IP').text(system.NETWORK.ip)
  $('#interface').text(system.NETWORK.name)
  if (system.SpeedTest) {
    $("#SpeedTestResult").removeClass("visually-hidden")
    $("#ST_Date").text(system.SpeedTest.timeLocale)
    $("#ST_DownloadResult").text(system.SpeedTest.download.bandwidth)
    $("#ST_UploadResult").text(system.SpeedTest.upload.bandwidth)
    $("#ST_PingResult").text(system.SpeedTest.ping.latency)
    $("#ST_JitterResult").text(system.SpeedTest.ping.jitter)
    $("#ST_PacketLostResult").text(system.SpeedTest.packetLoss)
    $("#ST_ISPResult").text(system.SpeedTest.isp)
    $("#ST_ServerResult").text(system.SpeedTest.server.host)
    $("#ST_NameResult").text(system.SpeedTest.server.name)
    $("#ST_LocationResult").text(system.SpeedTest.server.location + " ("+ system.SpeedTest.server.country + ")")
  }

  $("#ElectronOK").removeClass("visually-hidden")
  $("#ElectronNOK").addClass("visually-hidden")
  $("#ElectronValues").removeClass("visually-hidden")
  $("#ElectronPid").text(system.PROCESS.electron.pid)
  $("#ElectronCPU").text(system.PROCESS.electron.cpu)
  $("#ElectronMemory").text(system.PROCESS.electron.mem)

  if (system.PROCESS.nginx.pid) {
    $("#nginxValues").removeClass("visually-hidden")
    $("#nginxOK").removeClass("visually-hidden")
    $("#nginxNOK").addClass("visually-hidden")
    $("#nginxPid").text(system.PROCESS.nginx.pid)
    $("#nginxCPU").text(system.PROCESS.nginx.cpu)
    $("#nginxMemory").text(system.PROCESS.nginx.mem)
  } else {
    $("#nginxValues").addClass("visually-hidden")
    $("#nginxOK").addClass("visually-hidden")
    $("#nginxNOK").removeClass("visually-hidden")
  }

  if (system.PROCESS.librespot.pid) {
    $("#LibrespotValues").removeClass("visually-hidden")
    $("#LibrespotOK").removeClass("visually-hidden")
    $("#LibrespotNOK").addClass("visually-hidden")
    $("#LibrespotPid").text(system.PROCESS.librespot.pid)
    $("#LibrespotCPU").text(system.PROCESS.librespot.cpu)
    $("#LibrespotMemory").text(system.PROCESS.librespot.mem)
  } else {
    $("#LibrespotValues").addClass("visually-hidden")
    $("#LibrespotOK").addClass("visually-hidden")
    $("#LibrespotNOK").removeClass("visually-hidden")
  }

  if (system.PROCESS.pm2.pid) {
    $("#pm2Values").removeClass("visually-hidden")
    $("#pm2OK").removeClass("visually-hidden")
    $("#pm2NOK").addClass("visually-hidden")
    $("#pm2Pid").text(system.PROCESS.pm2.pid)
    $("#pm2CPU").text(system.PROCESS.pm2.cpu)
    $("#pm2Memory").text(system.PROCESS.pm2.mem)
  } else {
    $("#pm2Values").addClass("visually-hidden")
    $("#pm2OK").addClass("visually-hidden")
    $("#pm2NOK").removeClass("visually-hidden")
  }

  if (cb) cb()
}

function checkPartColor(id, value) {
  var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  if (vw < 768) {
    $("#Storage"+id).addClass("visually-hidden")
    $("#StorageText"+id).removeClass("visually-hidden")
  } else {
    $("#Storage"+id).removeClass("visually-hidden")
    $("#StorageText"+id).addClass("visually-hidden")
  }

  if (value <= 50) {
    $("#StorageDisplay"+id).removeClass("bg-warning")
    $("#StorageDisplay"+id).removeClass("bg-danger")
    $("#StorageDisplay"+id).addClass("bg-success")

    $("#StorageText"+id).removeClass("text-warning")
    $("#StorageText"+id).removeClass("text-danger")
    $("#StorageText"+id).addClass("text-success")

  } else if (value > 50 && value <= 80) {
    $("#StorageDisplay"+id).removeClass("bg-success")
    $("#StorageDisplay"+id).removeClass("bg-danger")
    $("#StorageDisplay"+id).addClass("bg-warning")

    $("#StorageText"+id).removeClass("text-success")
    $("#StorageText"+id).removeClass("text-danger")
    $("#StorageText"+id).addClass("text-warning")

  } else if (value > 80) {
    $("#StorageDisplay"+id).removeClass("bg-success")
    $("#StorageDisplay"+id).removeClass("bg-warning")
    $("#StorageDisplay"+id).addClass("bg-danger")

    $("#StorageText"+id).removeClass("text-success")
    $("#StorageText"+id).removeClass("text-warning")
    $("#StorageText"+id).addClass("text-danger")
  }
}

function makeProgress(Value, Progress, Text, Display, i=0) {
  $(Text).text(Display)
  if (i <= Value) {
    i = i + 1
    $(Progress).css("width", i + "%")
    setTimeout(() => {
      this.makeProgress(Value, Progress, Text, Display, i)
    },10)
  } else {
    $(Progress).css("width", Value + "%")
  }
}

function makeRefresh(Value, Progress, Text, Display) {
  $(Progress).css("width", Value + "%")
  $(Text).text(Display)
}

function progressOrText(system) {
  var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  if (vw < 768) {
    // hide progress
    $("#Load").addClass("visually-hidden")
    $("#Memory").addClass("visually-hidden")
    $("#Swap").addClass("visually-hidden")
    $("#Temp").addClass("visually-hidden")
    // display Text
    $("#LoadText").removeClass("visually-hidden")
    $("#MemoryText").removeClass("visually-hidden")
    $("#MemoryText2").removeClass("visually-hidden")
    $("#SwapText").removeClass("visually-hidden")
    $("#SwapText2").removeClass("visually-hidden")
    $("#TempText").removeClass("visually-hidden")
    system.STORAGE.forEach((partition, id) => {
      $("#Storage"+id).addClass("visually-hidden")
      $("#StorageText"+id).removeClass("visually-hidden")
    })
    $("#Storage-Box").addClass("col-md-12")
    $("#Storage-Box").removeClass("col-md-6")
    $("#Storage-Box").css("width", "100%")
    $("#Version-Box").addClass("col-md-12")
    $("#Version-Box").removeClass("col-md-6")
    $("#Version-Box").css("width", "100%")
    $("#Uptime-Box").addClass("col-md-12")
    $("#Uptime-Box").removeClass("col-md-6")
    $("#Uptime-Box").css("width", "100%")
  } else {
    // display Progress
    $("#Load").removeClass("visually-hidden")
    $("#Memory").removeClass("visually-hidden")
    $("#Swap").removeClass("visually-hidden")
    $("#Temp").removeClass("visually-hidden")
    // hide Text
    $("#LoadText").addClass("visually-hidden")
    $("#MemoryText").addClass("visually-hidden")
    $("#MemoryText2").addClass("visually-hidden")
    $("#SwapText").addClass("visually-hidden")
    $("#SwapText2").addClass("visually-hidden")
    $("#TempText").addClass("visually-hidden")
    system.STORAGE.forEach((partition, id) => {
      $("#Storage"+id).removeClass("visually-hidden")
      $("#StorageText"+id).addClass("visually-hidden")
    })
    $("#Storage-Box").removeClass("col-md-12")
    $("#Storage-Box").addClass("col-md-6")
    $("#Storage-Box").css("width", "50%")
    $("#Version-Box").removeClass("col-md-12")
    $("#Version-Box").addClass("col-md-6")
    $("#Version-Box").css("width", "50%")
    $("#Uptime-Box").removeClass("col-md-12")
    $("#Uptime-Box").addClass("col-md-6")
    $("#Uptime-Box").css("width", "50%")
  }
}

function doSpeedTest() {
  var socketSystem = io()
  socketSystem.on("connect", () => {
    console.log("Connected!")
  })

  socketSystem.on("HELLO", () => {
    $("#ST_Start").removeClass("disabled")
  })

  socketSystem.on("disconnect", (reason) => {
    console.log("disconnect:", reason)
    $("#ST_Start").addClass("disabled")
  })

  // part of MMM-Speedtest !
  let opts = {
    value: 0,
    min: 0,
    refreshAnimationType: "linear",
    gaugeWidthScale: "0.8",
    valueFontColor: "#fff",
    valueFontFamily: "Roboto Condensed",
    titleFontFamily: "Roboto Condensed",
    titleFontColor: "#aaa",
  }

  let downOpts = {
    id: "ST_Download",
    max: system.NETWORK.speed || system.NETWORK.bitRate,
    title: "Download",
    symbol: " Mbps"
  }

  let upOpts = {
    id: "ST_Upload",
    max: system.NETWORK.speed || system.NETWORK.bitRate,
    title: "Upload",
    symbol: " Mbps"
  }

  let pingOpts = {
    id: "ST_Ping",
    max: 80,
    title: "Ping",
    symbol: " ms"
  }
  downOpts = Object.assign({}, opts, downOpts)
  this.download = new JustGage(downOpts)
  upOpts = Object.assign({}, opts, upOpts)
  this.upload = new JustGage(upOpts)
  pingOpts = Object.assign({}, opts, pingOpts)
  this.ping = new JustGage(pingOpts)

  document.getElementById('ST_Start').onclick = () => {
    this.download.refresh("0")
    this.upload.refresh("0")
    this.ping.refresh("0")
    socketSystem.emit("ST_Start")
    $("#ST_Start").addClass("visually-hidden")
  }

  socketSystem.on("DOWNLOAD", (arg) => {
    this.download.refresh(arg)
  })
  socketSystem.on("UPLOAD", (arg) => {
    this.upload.refresh(arg)
  })
  socketSystem.on("PING", (arg) => {
    this.ping.refresh(arg)
  })

  socketSystem.on("RESULT", () => {
    $("#ST_Start").removeClass("visually-hidden")
  })
}


