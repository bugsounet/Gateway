class adminPageGW {
  constructor(that) {
    this.config = that.config
    this.sendSocketNotification = (...arg) => that.sendSocketNotification(...arg)
    this.init = false
    this.showing = false
    this.timerRefresh = null
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

  prepare(translate) {
    var wrapper = document.createElement("div")
    wrapper.id= "GATEWAY_ADMIN"
    //wrapper.classList.add("hidden")

      var content_wrapper = document.createElement("div")
      content_wrapper.id = "GATEWAY_ADMIN-CONTENT_WRAPPER"
      wrapper.appendChild(content_wrapper)

        var Hostname_container = document.createElement("div")
        Hostname_container.id = "GATEWAY_ADMIN-HOSTNAME_CONTAINER"
        content_wrapper.appendChild(Hostname_container)
        
          var Hostname_value = document.createElement("div")
          Hostname_value.id = "GATEWAY_ADMIN-HOSTNAME_VALUE"
          Hostname_value.textContent = "Loading"
          Hostname_container.appendChild(Hostname_value)

        var Sysinfo_container = document.createElement("div")
        Sysinfo_container.id = "GATEWAY_ADMIN-SYSINFO_CONTAINER"
        content_wrapper.appendChild(Sysinfo_container)

          var Sysinfo_container_row = document.createElement("div")
          Sysinfo_container_row.id = "GATEWAY_ADMIN-SYSINFO_CONTAINER_ROW"
          Sysinfo_container.appendChild(Sysinfo_container_row)
          
            var Sysinfo_version = document.createElement("div")
            Sysinfo_version.id = "GATEWAY_ADMIN-SYSINFO_VERSION"
            Sysinfo_container_row.appendChild(Sysinfo_version)

              var Sysinfo_version_group = document.createElement("div")
              Sysinfo_version_group.id = "GATEWAY_ADMIN-SYSINFO_VERSION_GROUP"
              Sysinfo_version.appendChild(Sysinfo_version_group)

                var Sysinfo_version_heading = document.createElement("div")
                Sysinfo_version_heading.id = "GATEWAY_ADMIN-SYSINFO_VERSION_HEADING"
                Sysinfo_version_group.appendChild(Sysinfo_version_heading)

                  var Sysinfo_version_heading_value = document.createElement("div")
                  Sysinfo_version_heading_value.id = "GATEWAY_ADMIN-SYSINFO_VERSION_HEADING_VALUE"
                  Sysinfo_version_heading_value.textContent = "Versions"
                  Sysinfo_version_heading.appendChild(Sysinfo_version_heading_value)

                var Sysinfo_version_list = document.createElement("div")
                Sysinfo_version_list.id = "GATEWAY_ADMIN-SYSINFO_VERSION_LIST"
                Sysinfo_version_group.appendChild(Sysinfo_version_list)

            var Sysinfo_cpu = document.createElement("div")
            Sysinfo_cpu.id = "GATEWAY_ADMIN-SYSINFO_CPU"
            Sysinfo_container_row.appendChild(Sysinfo_cpu)

              var Sysinfo_cpu_group = document.createElement("div")
              Sysinfo_cpu_group.id = "GATEWAY_ADMIN-SYSINFO_CPU_GROUP"
              Sysinfo_cpu.appendChild(Sysinfo_cpu_group)

                var Sysinfo_cpu_heading = document.createElement("div")
                Sysinfo_cpu_heading.id = "GATEWAY_ADMIN-SYSINFO_CPU_HEADING"
                Sysinfo_cpu_group.appendChild(Sysinfo_cpu_heading)

                  var Sysinfo_cpu_heading_value = document.createElement("div")
                  Sysinfo_cpu_heading_value.id = "GATEWAY_ADMIN-SYSINFO_CPU_HEADING_VALUE"
                  Sysinfo_cpu_heading_value.textContent = "CPU"
                  Sysinfo_cpu_heading.appendChild(Sysinfo_cpu_heading_value)

                var Sysinfo_cpu_list = document.createElement("div")
                Sysinfo_cpu_list.id = "GATEWAY_ADMIN-SYSINFO_CPU_LIST"
                Sysinfo_cpu_group.appendChild(Sysinfo_cpu_list)

            var Sysinfo_memory = document.createElement("div")
            Sysinfo_memory.id = "GATEWAY_ADMIN-SYSINFO_MEMORY"
            Sysinfo_container_row.appendChild(Sysinfo_memory)

            var Sysinfo_network = document.createElement("div")
            Sysinfo_network.id = "GATEWAY_ADMIN-SYSINFO_NETWORK"
            Sysinfo_container_row.appendChild(Sysinfo_network)

            var Sysinfo_storage = document.createElement("div")
            Sysinfo_storage.id = "GATEWAY_ADMIN-SYSINFO_STORAGE"
            Sysinfo_container_row.appendChild(Sysinfo_storage)

            var Sysinfo_uptimes = document.createElement("div")
            Sysinfo_uptimes.id = "GATEWAY_ADMIN-SYSINFO_UPTIMES"
            Sysinfo_container_row.appendChild(Sysinfo_uptimes)

    document.body.appendChild(wrapper)
    this.init=true
    console.log("[Gateway] AdminPage Ready !")


    return
    
    var SysInfo=document.createElement("div")
    SysInfo.id="GATEWAY_ADMIN"

      /** Version **/
      var Version = document.createElement("div")
      Version.id = "GATEWAY_VERSION"
      Version.textContent = translate["System"]
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
        Node.textContent = translate["System_NodeVersion"]
        Version.appendChild(Node)
          var Node_Value = document.createElement("div")
          Node_Value.id = "GATEWAY_VERSION-NODE-VALUE"
          Node_Value.textContent= this.System.VERSION.NODECORE
          Node.appendChild(Node_Value)

        var NPM = document.createElement("div")
        NPM.id = "GATEWAY_VERSION-NPM"
        NPM.textContent = translate["System_NPMVersion"]
        Version.appendChild(NPM)
          var NPM_Value = document.createElement("div")
          NPM_Value.id = "GATEWAY_VERSION-NPM-VALUE"
          NPM_Value.textContent= this.System.VERSION.NPM
          NPM.appendChild(NPM_Value)

        var OS = document.createElement("div")
        OS.id = "GATEWAY_VERSION-OS"
        OS.textContent = translate["System_OSVersion"]
        Version.appendChild(OS)
          var OS_Value = document.createElement("div")
          OS_Value.id = "GATEWAY_VERSION-OS-VALUE"
          OS_Value.textContent= this.System.VERSION.OS
          OS.appendChild(OS_Value)

        var Kernel = document.createElement("div")
        Kernel.id = "GATEWAY_VERSION-KERNEL"
        Kernel.textContent = translate["System_KernelVersion"]
        Version.appendChild(Kernel)
          var Kernel_Value = document.createElement("div")
          Kernel_Value.id = "GATEWAY_VERSION-KERNEL-VALUE"
          Kernel_Value.textContent= this.System.VERSION.KERNEL
          Kernel.appendChild(Kernel_Value)
      SysInfo.appendChild(Version)

      /** CPU **/
      var CPU = document.createElement("div")
      CPU.id = "GATEWAY_CPU"
      CPU.textContent = translate["System_CPUSystem"]
        var Type = document.createElement("div")
        Type.id = "GATEWAY_CPU-TYPE"
        Type.textContent = translate["System_TypeCPU"]
        CPU.appendChild(Type)
          var Type_Value = document.createElement("div")
          Type_Value.id = "GATEWAY_CPU-TYPE-VALUE"
          Type_Value.textContent= this.System.CPU.type
          Type.appendChild(Type_Value)

        var Speed = document.createElement("div")
        Speed.id = "GATEWAY_CPU-SPEED"
        Speed.textContent = translate["System_SpeedCPU"]
        CPU.appendChild(Speed)
          var Speed_Value = document.createElement("div")
          Speed_Value.id = "GATEWAY_CPU-SPEED-VALUE"
          Speed_Value.textContent= this.System.CPU.speed
          Speed.appendChild(Speed_Value)

        var Usage = document.createElement("div")
        Usage.id = "GATEWAY_CPU-USAGE"
        Usage.textContent = translate["System_CurrentLoadCPU"]
        CPU.appendChild(Usage)
          var Usage_Value = document.createElement("div")
          Usage_Value.id = "GATEWAY_CPU-USAGE-VALUE"
          Usage_Value.textContent= this.System.CPU.usage
          Usage.appendChild(Usage_Value)

        var Governor = document.createElement("div")
        Governor.id = "GATEWAY_CPU-GOVERNOR"
        Governor.textContent = translate["System_GovernorCPU"]
        CPU.appendChild(Governor)
          var Governor_Value = document.createElement("div")
          Governor_Value.id = "GATEWAY_CPU-GOVERNOR-VALUE"
          Governor_Value.textContent= this.System.CPU.governor
          Governor.appendChild(Governor_Value)

        var Temp = document.createElement("div")
        Temp.id = "GATEWAY_CPU-TEMP"
        Temp.textContent = translate["System_TempCPU"]
        CPU.appendChild(Temp)
          var Temp_Value = document.createElement("div")
          Temp_Value.id = "GATEWAY_CPU-TEMP-VALUE"
          Temp_Value.textContent= this.System.CPU.temp.C
          Temp.appendChild(Temp_Value)
      SysInfo.appendChild(CPU)

      /** Memory **/
      var MEMORY = document.createElement("div")
      MEMORY.id = "GATEWAY_MEMORY"
      MEMORY.textContent = translate["System_MemorySystem"]
        var Active = document.createElement("div")
        Active.id = "GATEWAY_MEMORY-ACTIVE"
        Active.textContent = translate["System_TypeMemory"]
        MEMORY.appendChild(Active)
          var Active_Value = document.createElement("div")
          Active_Value.id = "GATEWAY_MEMORY-ACTIVE-VALUE"
          Active_Value.textContent= this.System.MEMORY.used + " / " + this.System.MEMORY.total + " ("+ this.System.MEMORY.percent + "%)"
          Active.appendChild(Active_Value)

        var Swap = document.createElement("div")
        Swap.id = "GATEWAY_MEMORY-SWAP"
        Swap.textContent = translate["System_SwapMemory"]
        MEMORY.appendChild(Swap)
          var Swap_Value = document.createElement("div")
          Swap_Value.id = "GATEWAY_MEMORY-SWAP-VALUE"
          Swap_Value.textContent= this.System.MEMORY.swapUsed + " / " + this.System.MEMORY.swapTotal + " ("+ this.System.MEMORY.swapPercent + "%)"
          Swap.appendChild(Swap_Value)
      SysInfo.appendChild(MEMORY)

    document.body.appendChild(SysInfo)
    this.init=true
    console.log("[Gateway] AdminPage Ready !")
  }

  show() {
    if (!this.showing && this.init) {
      clearInterval(this.timerRefresh)
      this.updateTimer()
      MM.getModules().enumerate((module)=> {
        module.hide(0, () => {}, {lockString: "GATEWAY_LOCK"})
      })
      logGW("show")
      var SysInfo=document.getElementById("GATEWAY_ADMIN")
      SysInfo.classList.remove("hidden")
      this.showing = true
    }
  }

  hide() {
    if (this.showing && this.init) {
      clearInterval(this.timerRefresh)
      logGW("hide")
      var SysInfo=document.getElementById("GATEWAY_ADMIN")
      SysInfo.classList.add("hidden")
      this.showing = false
      MM.getModules().enumerate((module)=> {
        module.show(0, () => {}, {lockString: "GATEWAY_LOCK"})
      })
    }
  }

  updateSystemData(data) {
    this.System=Object.assign({},this.System,data)
    this.refreshData()
    console.log("system Info updated:",this.System)
  }

  refreshData() {
    var Hostname_value = document.getElementById("GATEWAY_ADMIN-HOSTNAME_VALUE")
    Hostname_value.textContent = this.System.HOSTNAME
    return
    /* Version */
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
    /* CPU */
    var Type_Value = document.getElementById("GATEWAY_CPU-TYPE-VALUE")
    Type_Value.textContent = this.System.CPU.type
    var Speed_Value = document.getElementById("GATEWAY_CPU-SPEED-VALUE")
    Speed_Value.textContent= this.System.CPU.speed
    var Usage_Value = document.getElementById("GATEWAY_CPU-USAGE-VALUE")
    Usage_Value.textContent= this.System.CPU.usage + "%"
    var Governor_Value = document.getElementById("GATEWAY_CPU-GOVERNOR-VALUE")
    Governor_Value.textContent= this.System.CPU.governor
    var Temp_Value = document.getElementById("GATEWAY_CPU-TEMP-VALUE")
    Temp_Value.textContent = this.System.CPU.temp.C + "°"
    /* MEMORY */
    var Active_Value = document.getElementById("GATEWAY_MEMORY-ACTIVE-VALUE")
    Active_Value.textContent = this.System.MEMORY.used + " / " + this.System.MEMORY.total + " ("+ this.System.MEMORY.percent + "%)"
    var Swap_Value = document.getElementById("GATEWAY_MEMORY-SWAP-VALUE")
    Swap_Value.textContent= this.System.MEMORY.swapUsed + " / " + this.System.MEMORY.swapTotal + " ("+ this.System.MEMORY.swapPercent + "%)"
  }

  updateTimer() {
    this.sendSocketNotification("GET-SYSINFO")
    this.timerRefresh = setInterval(() => {
      this.sendSocketNotification("GET-SYSINFO")
    }, 5000)
  }
}
