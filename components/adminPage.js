class adminPageGW {
  constructor(config) {
    this.config = config
    this.init = false
    this.System = {
      VERSION:{
        MagicMirror:"unknow",
        ELECTRON:"unknow",
        NODEMM:"unknow",
        NODECORE:"unknow",
        NPM:"unknow",
        KERNEL:"unknow",
        OS:"Loading..."
      },
      HOSTNAME:"unknow",
      NETWORK:{
        type:"unknow",
        ip:"unknow",
        name:"unknow",
        speed:"unknow",
        duplex:"unknow",
        ssid:"unknow",
        bitRate:"unknow",
        frequency:"unknow",
        txPower:"unknow",
        powerManagement:"unknow",
        linkQuality:"unknow",
        maxLinkQuality:"unknow",
        signalLevel:"unknow",
        barLevel:"unknow"
      },
      MEMORY:{
        total:0,
        used:0,
        percent:0,
        swapTotal:0,
        swapUsed:0,
        swapPercent:0
      },
      STORAGE:[],
      CPU:{
        usage:0,
        type:"unknow",
        temp:{
          C:0,
          F:0
        },
        speed:"unknow",
        governor:"unknow"
      },
      UPTIME:{
        current:0,
        currentDHM:"unknow",
        recordCurrent:0,
        recordCurrentDHM:"unknow",
        MM:0,
        MMDHM:"unknow",
        recordMM:0,
        recordMMDHM:"unknow"
      },
      PROCESS:{
        nginx:{
          pid:0,
          cpu:0,
          mem:0
        },
        electron:{
          pid:0,
          cpu:0,
          mem:0
        },
        librespot:{
          pid:0,
          cpu:0,
          mem:0
        },
        pm2:{
          pid:0,
          cpu:0,
          mem:0
        }
      },
      SpeedTest:null
    }
    console.log("[Gateway] AdminPage Loaded !")
  }

  prepare() {
    var SysInfo=document.createElement("div")
    SysInfo.id="GATEWAY_ADMIN"
    //SysInfo.classList.add("hidden")

      var Version = document.createElement("div")
      Version.id = "GATEWAY_VERSION"
      Version.textContent = "Versions"
        var MM = document.createElement("div")
        MM.id = "GATEWAY_VERSION-MM"
        MM.textContent = "MagicMirror²:"
        Version.appendChild(MM)
          var MM_Value = document.createElement("div")
          MM_Value.id = "GATEWAY_VERSION-MM-VALUE"
          MM_Value.textContent= this.System.VERSION.MagicMirror
          MM.appendChild(MM_Value)

        var ELECTRON = document.createElement("div")
        ELECTRON.id = "GATEWAY_VERSION-ELECTRON"
        ELECTRON.textContent = "Electron:"
        Version.appendChild(ELECTRON)
          var ELECTRON_Value = document.createElement("div")
          ELECTRON_Value.id = "GATEWAY_VERSION-ELECTRON-VALUE"
          ELECTRON_Value.textContent= this.System.VERSION.ELECTRON
          ELECTRON.appendChild(ELECTRON_Value)

        var MMNode = document.createElement("div")
        MMNode.id = "GATEWAY_VERSION-MMNODE"
        MMNode.textContent = "MagicMirrror² Node:"
        Version.appendChild(MMNode)
          var MMNode_Value = document.createElement("div")
          MMNode_Value.id = "GATEWAY_VERSION-MMNODE-VALUE"
          MMNode_Value.textContent= this.System.VERSION.NODEMM
          MMNode.appendChild(MMNode_Value)

        var Node = document.createElement("div")
        Node.id = "GATEWAY_VERSION-NODE"
        Node.textContent = "Node:"
        Version.appendChild(Node)
          var Node_Value = document.createElement("div")
          Node_Value.id = "GATEWAY_VERSION-NODE-VALUE"
          Node_Value.textContent= this.System.VERSION.NODECORE
          Node.appendChild(Node_Value)

        var NPM = document.createElement("div")
        NPM.id = "GATEWAY_VERSION-NPM"
        NPM.textContent = "NPM:"
        Version.appendChild(NPM)
          var NPM_Value = document.createElement("div")
          NPM_Value.id = "GATEWAY_VERSION-NPM-VALUE"
          NPM_Value.textContent= this.System.VERSION.NPM
          NPM.appendChild(NPM_Value)

        var OS = document.createElement("div")
        OS.id = "GATEWAY_VERSION-OS"
        OS.textContent = "OS:"
        Version.appendChild(OS)
          var OS_Value = document.createElement("div")
          OS_Value.id = "GATEWAY_VERSION-OS-VALUE"
          OS_Value.textContent= this.System.VERSION.OS
          OS.appendChild(OS_Value)

        var Kernel = document.createElement("div")
        Kernel.id = "GATEWAY_VERSION-KERNEL"
        Kernel.textContent = "Kernel:"
        Version.appendChild(Kernel)
          var Kernel_Value = document.createElement("div")
          Kernel_Value.id = "GATEWAY_VERSION-KERNEL-VALUE"
          Kernel_Value.textContent= this.System.VERSION.KERNEL
          Kernel.appendChild(Kernel_Value)

      SysInfo.appendChild(Version)
    document.body.appendChild(SysInfo)
    this.init=true
  }

  show() {
    if (this.init) {
      logGW("show")
      var SysInfo=document.getElementById("GATEWAY_ADMIN")
      SysInfo.classList.remove("hidden")
      this.refreshData()
    }
  }

  hide() {
    if (this.init) {
      logGW("hide")
      var SysInfo=document.getElementById("GATEWAY_ADMIN")
      SysInfo.classList.add("hidden")
    }
  }

  updateSystemData(data) {
    this.System=Object.assign({},this.System,data)
    console.log("system Info updated:",this.System)
    this.show()
  }

  refreshData() {
    var MM_Value = document.getElementById("GATEWAY_VERSION-MM-VALUE")
    MM_Value.textContent = this.System.VERSION.MagicMirror
    var ELECTRON_Value = document.getElementById("GATEWAY_VERSION-ELECTRON-VALUE")
    ELECTRON_Value.textContent = this.System.VERSION.ELECTRON
    var MMNode_Value = document.getElementById("GATEWAY_VERSION-MMNODE-VALUE")
    MMNode_Value.textContent = this.System.VERSION.NODEMM
    var Node_Value = document.getElementById("GATEWAY_VERSION-NODE-VALUE")
    Node_Value.textContent = this.System.VERSION.NODECORE
    var NPM_Value = document.getElementById("GATEWAY_VERSION-NPM-VALUE")
    NPM_Value.textContent = this.System.VERSION.NPM
    var OS_Value = document.getElementById("GATEWAY_VERSION-OS-VALUE")
    OS_Value.textContent = this.System.VERSION.OS
    var Kernel_Value = document.getElementById("GATEWAY_VERSION-KERNEL-VALUE")
    Kernel_Value.textContent = this.System.VERSION.KERNEL
  }
}
