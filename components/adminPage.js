class adminPageGW {
  constructor(that) {
    this.config = that.config
    this.sendSocketNotification = (...arg) => that.sendSocketNotification(...arg)
    this.translate = (...arg) => that.translate(...arg)
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
        OS:"unknow"
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
          Hostname_value.textContent = this.translate("LOADING")
          Hostname_container.appendChild(Hostname_value)

        var Sysinfo_container = document.createElement("div")
        Sysinfo_container.id = "GATEWAY_ADMIN-SYSINFO_CONTAINER"
        content_wrapper.appendChild(Sysinfo_container)

          var Sysinfo_container_row = document.createElement("div")
          Sysinfo_container_row.id = "GATEWAY_ADMIN-SYSINFO_CONTAINER_ROW"
          Sysinfo_container.appendChild(Sysinfo_container_row)

            /** Versions **/
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
                  Sysinfo_version_heading_value.textContent = this.translate("GW_System_Box_Version")
                  Sysinfo_version_heading.appendChild(Sysinfo_version_heading_value)

                var Sysinfo_version_list = document.createElement("div")
                Sysinfo_version_list.id = "GATEWAY_ADMIN-SYSINFO_VERSION_LIST"
                Sysinfo_version_group.appendChild(Sysinfo_version_list)

              var MM = document.createElement("div")
              MM.id = "GATEWAY_ADMIN-SYSINFO_VERSION-MM"
              MM.textContent = "MagicMirror²:"
              Sysinfo_version_list.appendChild(MM)
                var MM_Value = document.createElement("div")
                MM_Value.id = "GATEWAY_ADMIN-SYSINFO_VERSION-MM-VALUE"
                MM_Value.textContent= this.System.VERSION.MagicMirror
                MM.appendChild(MM_Value)

              var ELECTRON = document.createElement("div")
              ELECTRON.id = "GATEWAY_ADMIN-SYSINFO_VERSION-ELECTRON"
              ELECTRON.textContent = "Electron:"
              Sysinfo_version_list.appendChild(ELECTRON)
                var ELECTRON_Value = document.createElement("div")
                ELECTRON_Value.id = "GATEWAY_ADMIN-SYSINFO_VERSION-ELECTRON-VALUE"
                ELECTRON_Value.textContent= this.System.VERSION.ELECTRON
                ELECTRON.appendChild(ELECTRON_Value)

              var MMNode = document.createElement("div")
              MMNode.id = "GATEWAY_ADMIN-SYSINFO_VERSION-MMNODE"
              MMNode.textContent = "MagicMirrror² Node:"
              Sysinfo_version_list.appendChild(MMNode)
                var MMNode_Value = document.createElement("div")
                MMNode_Value.id = "GATEWAY_ADMIN-SYSINFO_VERSION-MMNODE-VALUE"
                MMNode_Value.textContent= this.System.VERSION.NODEMM
                MMNode.appendChild(MMNode_Value)

              var Node = document.createElement("div")
              Node.id = "GATEWAY_ADMIN-SYSINFO_VERSION-NODE"
              Node.textContent = translate["System_NodeVersion"]
              Sysinfo_version_list.appendChild(Node)
                var Node_Value = document.createElement("div")
                Node_Value.id = "GATEWAY_ADMIN-SYSINFO_VERSION-NODE-VALUE"
                Node_Value.textContent= this.System.VERSION.NODECORE
                Node.appendChild(Node_Value)

              var NPM = document.createElement("div")
              NPM.id = "GATEWAY_ADMIN-SYSINFO_VERSION-NPM"
              NPM.textContent = translate["System_NPMVersion"]
              Sysinfo_version_list.appendChild(NPM)
                var NPM_Value = document.createElement("div")
                NPM_Value.id = "GATEWAY_ADMIN-SYSINFO_VERSION-NPM-VALUE"
                NPM_Value.textContent= this.System.VERSION.NPM
                NPM.appendChild(NPM_Value)

              var OS = document.createElement("div")
              OS.id = "GATEWAY_ADMIN-SYSINFO_VERSION-OS"
              OS.textContent = translate["System_OSVersion"]
              Sysinfo_version_list.appendChild(OS)
                var OS_Value = document.createElement("div")
                OS_Value.id = "GATEWAY_ADMIN-SYSINFO_VERSION-OS-VALUE"
                OS_Value.textContent= this.System.VERSION.OS
                OS.appendChild(OS_Value)

              var Kernel = document.createElement("div")
              Kernel.id = "GATEWAY_ADMIN-SYSINFO_VERSION-KERNEL"
              Kernel.textContent = translate["System_KernelVersion"]
              Sysinfo_version_list.appendChild(Kernel)
                var Kernel_Value = document.createElement("div")
                Kernel_Value.id = "GATEWAY_ADMIN-SYSINFO_VERSION-KERNEL-VALUE"
                Kernel_Value.textContent= this.System.VERSION.KERNEL
                Kernel.appendChild(Kernel_Value)

            /** CPU **/
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
                  Sysinfo_cpu_heading_value.textContent = this.translate("GW_System_CPUSystem")
                  Sysinfo_cpu_heading.appendChild(Sysinfo_cpu_heading_value)

                var Sysinfo_cpu_list = document.createElement("div")
                Sysinfo_cpu_list.id = "GATEWAY_ADMIN-SYSINFO_CPU_LIST"
                Sysinfo_cpu_group.appendChild(Sysinfo_cpu_list)

              var Type = document.createElement("div")
              Type.id = "GATEWAY_ADMIN-SYSINFO_CPU-TYPE"
              Type.textContent = translate["System_TypeCPU"]
              Sysinfo_cpu_list.appendChild(Type)
                var Type_Value = document.createElement("div")
                Type_Value.id = "GATEWAY_ADMIN-SYSINFO_CPU-TYPE-VALUE"
                Type_Value.textContent= this.System.CPU.type
                Type.appendChild(Type_Value)

              var Speed = document.createElement("div")
              Speed.id = "GATEWAY_ADMIN-SYSINFO_CPU-SPEED"
              Speed.textContent = translate["System_SpeedCPU"]
              Sysinfo_cpu_list.appendChild(Speed)
                var Speed_Value = document.createElement("div")
                Speed_Value.id = "GATEWAY_ADMIN-SYSINFO_CPU-SPEED-VALUE"
                Speed_Value.textContent= this.System.CPU.speed
                Speed.appendChild(Speed_Value)

              var Usage = document.createElement("div")
              Usage.id = "GATEWAY_ADMIN-SYSINFO_CPU-USAGE"
              Usage.textContent = translate["System_CurrentLoadCPU"]
              Sysinfo_cpu_list.appendChild(Usage)
                var Usage_Progress = document.createElement("div")
                Usage_Progress.id = "GATEWAY_ADMIN-SYSINFO_CPU-USAGE-PROGRESS"
                Usage_Progress.className = "SysInfo-progress"
                Usage.appendChild(Usage_Progress)
                  var Usage_ProgressBar = document.createElement("div")
                  Usage_ProgressBar.id = "GATEWAY_ADMIN-SYSINFO_CPU-USAGE-PROGRESSBAR"
                  Usage_ProgressBar.className = "SysInfo-progress-bar"
                  Usage_Progress.appendChild(Usage_ProgressBar)
              var Governor = document.createElement("div")
              Governor.id = "GATEWAY_ADMIN-SYSINFO_CPU-GOVERNOR"
              Governor.textContent = translate["System_GovernorCPU"]
              Sysinfo_cpu_list.appendChild(Governor)
                var Governor_Value = document.createElement("div")
                Governor_Value.id = "GATEWAY_ADMIN-SYSINFO_CPU-GOVERNOR-VALUE"
                Governor_Value.textContent= this.System.CPU.governor
                Governor.appendChild(Governor_Value)

              var Temp = document.createElement("div")
              Temp.id = "GATEWAY_ADMIN-SYSINFO_CPU-TEMP"
              Temp.textContent = translate["System_TempCPU"]
              Sysinfo_cpu_list.appendChild(Temp)
                var Temp_Progress = document.createElement("div")
                Temp_Progress.id = "GATEWAY_ADMIN-SYSINFO_CPU-TEMP-PROGRESS"
                Temp_Progress.className = "SysInfo-progress"
                Temp.appendChild(Temp_Progress)
                  var Temp_ProgressBar = document.createElement("div")
                  Temp_ProgressBar.id = "GATEWAY_ADMIN-SYSINFO_CPU-TEMP-PROGRESSBAR"
                  Temp_ProgressBar.className = "SysInfo-progress-bar"
                  Temp_Progress.appendChild(Temp_ProgressBar)
            /** Memory **/
            var Sysinfo_memory = document.createElement("div")
            Sysinfo_memory.id = "GATEWAY_ADMIN-SYSINFO_MEMORY"
            Sysinfo_container_row.appendChild(Sysinfo_memory)

              var Sysinfo_memory_group = document.createElement("div")
              Sysinfo_memory_group.id = "GATEWAY_ADMIN-SYSINFO_MEMORY_GROUP"
              Sysinfo_memory.appendChild(Sysinfo_memory_group)

                var Sysinfo_memory_heading = document.createElement("div")
                Sysinfo_memory_heading.id = "GATEWAY_ADMIN-SYSINFO_MEMORY_HEADING"
                Sysinfo_memory_group.appendChild(Sysinfo_memory_heading)

                  var Sysinfo_memory_heading_value = document.createElement("div")
                  Sysinfo_memory_heading_value.id = "GATEWAY_ADMIN-SYSINFO_MEMORY_HEADING_VALUE"
                  Sysinfo_memory_heading_value.textContent = this.translate("GW_System_MemorySystem")
                  Sysinfo_memory_heading.appendChild(Sysinfo_memory_heading_value)

                var Sysinfo_memory_list = document.createElement("div")
                Sysinfo_memory_list.id = "GATEWAY_ADMIN-SYSINFO_MEMORY_LIST"
                Sysinfo_memory_group.appendChild(Sysinfo_memory_list)

              var Active = document.createElement("div")
              Active.id = "GATEWAY_ADMIN-SYSINFO_MEMORY-ACTIVE"
              Active.textContent = translate["System_TypeMemory"]
              Sysinfo_memory_list.appendChild(Active)

                var Active_Progress = document.createElement("div")
                Active_Progress.id = "GATEWAY_ADMIN-SYSINFO_MEMORY-ACTIVE-PROGRESS"
                Active_Progress.className = "SysInfo-progress"
                Active.appendChild(Active_Progress)
                  var Active_ProgressBar = document.createElement("div")
                  Active_ProgressBar.id = "GATEWAY_ADMIN-SYSINFO_MEMORY-ACTIVE-PROGRESSBAR"
                  Active_ProgressBar.className = "SysInfo-progress-bar"
                  Active_Progress.appendChild(Active_ProgressBar)

                var Active_ValueTotal = document.createElement("div")
                Active_ValueTotal.id = "GATEWAY_ADMIN-SYSINFO_MEMORY-ACTIVE-VALUE-TOTAL"
                Active_ValueTotal.textContent= this.System.MEMORY.total
                Active.appendChild(Active_ValueTotal)

              var Swap = document.createElement("div")
              Swap.id = "GATEWAY_ADMIN-SYSINFO_MEMORY-SWAP"
              Swap.textContent = translate["System_SwapMemory"]
              Sysinfo_memory_list.appendChild(Swap)
              
                var Swap_Progress = document.createElement("div")
                Swap_Progress.id = "GATEWAY_ADMIN-SYSINFO_MEMORY-SWAP-PROGRESS"
                Swap_Progress.className = "SysInfo-progress"
                Swap.appendChild(Swap_Progress)
                  var Swap_ProgressBar = document.createElement("div")
                  Swap_ProgressBar.id = "GATEWAY_ADMIN-SYSINFO_MEMORY-SWAP-PROGRESSBAR"
                  Swap_ProgressBar.className = "SysInfo-progress-bar"
                  Swap_Progress.appendChild(Swap_ProgressBar)

                var Swap_ValueTotal = document.createElement("div")
                Swap_ValueTotal.id = "GATEWAY_ADMIN-SYSINFO_MEMORY-SWAP-VALUE-TOTAL"
                Swap_ValueTotal.textContent= this.System.MEMORY.swapTotal
                Swap.appendChild(Swap_ValueTotal)
            /** Network **/
            var Sysinfo_network = document.createElement("div")
            Sysinfo_network.id = "GATEWAY_ADMIN-SYSINFO_NETWORK"
            Sysinfo_container_row.appendChild(Sysinfo_network)

              var Sysinfo_network_group = document.createElement("div")
              Sysinfo_network_group.id = "GATEWAY_ADMIN-SYSINFO_NETWORK_GROUP"
              Sysinfo_network.appendChild(Sysinfo_network_group)

                var Sysinfo_network_heading = document.createElement("div")
                Sysinfo_network_heading.id = "GATEWAY_ADMIN-SYSINFO_NETWORK_HEADING"
                Sysinfo_network_group.appendChild(Sysinfo_network_heading)

                  var Sysinfo_network_heading_value = document.createElement("div")
                  Sysinfo_network_heading_value.id = "GATEWAY_ADMIN-SYSINFO_NETWORK_HEADING_VALUE"
                  Sysinfo_network_heading_value.textContent = this.translate("GW_System_NetworkSystem")
                  Sysinfo_network_heading.appendChild(Sysinfo_network_heading_value)

                var Sysinfo_network_list = document.createElement("div")
                Sysinfo_network_list.id = "GATEWAY_ADMIN-SYSINFO_NETWORK_LIST"
                Sysinfo_network_group.appendChild(Sysinfo_network_list)

            /** storage **/
            var Sysinfo_storage = document.createElement("div")
            Sysinfo_storage.id = "GATEWAY_ADMIN-SYSINFO_STORAGE"
            Sysinfo_container_row.appendChild(Sysinfo_storage)

              var Sysinfo_storage_group = document.createElement("div")
              Sysinfo_storage_group.id = "GATEWAY_ADMIN-SYSINFO_STORAGE_GROUP"
              Sysinfo_storage.appendChild(Sysinfo_storage_group)

                var Sysinfo_storage_heading = document.createElement("div")
                Sysinfo_storage_heading.id = "GATEWAY_ADMIN-SYSINFO_STORAGE_HEADING"
                Sysinfo_storage_group.appendChild(Sysinfo_storage_heading)

                  var Sysinfo_storage_heading_value = document.createElement("div")
                  Sysinfo_storage_heading_value.id = "GATEWAY_ADMIN-SYSINFO_STORAGE_VALUE"
                  Sysinfo_storage_heading_value.textContent = this.translate("GW_System_StorageSystem")
                  Sysinfo_storage_heading.appendChild(Sysinfo_storage_heading_value)

                var Sysinfo_storage_list = document.createElement("div")
                Sysinfo_storage_list.id = "GATEWAY_ADMIN-SYSINFO_STORAGE_LIST"
                Sysinfo_storage_group.appendChild(Sysinfo_storage_list)

            /** uptimes **/
            var Sysinfo_uptimes = document.createElement("div")
            Sysinfo_uptimes.id = "GATEWAY_ADMIN-SYSINFO_UPTIMES"
            Sysinfo_container_row.appendChild(Sysinfo_uptimes)

              var Sysinfo_uptimes_group = document.createElement("div")
              Sysinfo_uptimes_group.id = "GATEWAY_ADMIN-SYSINFO_UPTIMES_GROUP"
              Sysinfo_uptimes.appendChild(Sysinfo_uptimes_group)

                var Sysinfo_uptimes_heading = document.createElement("div")
                Sysinfo_uptimes_heading.id = "GATEWAY_ADMIN-SYSINFO_UPTIMES_HEADING"
                Sysinfo_uptimes_group.appendChild(Sysinfo_uptimes_heading)

                  var Sysinfo_uptimes_heading_value = document.createElement("div")
                  Sysinfo_uptimes_heading_value.id = "GATEWAY_ADMIN-SYSINFO_MEMORY_UPTIMES_VALUE"
                  Sysinfo_uptimes_heading_value.textContent = this.translate("GW_System_UptimeSystem")
                  Sysinfo_uptimes_heading.appendChild(Sysinfo_uptimes_heading_value)

                var Sysinfo_uptimes_list = document.createElement("div")
                Sysinfo_uptimes_list.id = "GATEWAY_ADMIN-SYSINFO_UPTIMES_LIST"
                Sysinfo_uptimes_group.appendChild(Sysinfo_uptimes_list)

                  var Sysinfo_uptime_current = document.createElement("div")
                  Sysinfo_uptime_current.id = "GATEWAY_ADMIN-SYSINFO_UPTIMES_CURRENT"
                  Sysinfo_uptime_current.textContent = this.translate("GW_System_CurrentUptime")
                  Sysinfo_uptimes_list.appendChild(Sysinfo_uptime_current)

                  var Sysinfo_uptime_current_system = document.createElement("div")
                  Sysinfo_uptime_current_system.id = "GATEWAY_ADMIN-SYSINFO_UPTIMES_CURRENT_SYSTEM"
                  Sysinfo_uptime_current_system.textContent = this.translate("GW_System_System")
                  Sysinfo_uptimes_list.appendChild(Sysinfo_uptime_current_system)
                  
                    var Sysinfo_uptime_current_system_value = document.createElement("div")
                    Sysinfo_uptime_current_system_value.id = "GATEWAY_ADMIN-SYSINFO_UPTIMES_CURRENT_SYSTEM_VALUE"
                    Sysinfo_uptime_current_system_value.textContent = this.System.UPTIME.currentDHM
                    Sysinfo_uptime_current_system.appendChild(Sysinfo_uptime_current_system_value)

                  var Sysinfo_uptime_current_MM = document.createElement("div")
                  Sysinfo_uptime_current_MM.id = "GATEWAY_ADMIN-SYSINFO_UPTIMES_CURRENT_MM"
                  Sysinfo_uptime_current_MM.textContent = "MagicMirror²:"
                  Sysinfo_uptimes_list.appendChild(Sysinfo_uptime_current_MM)
                  
                    var Sysinfo_uptime_current_MM_value = document.createElement("div")
                    Sysinfo_uptime_current_MM_value.id = "GATEWAY_ADMIN-SYSINFO_UPTIMES_CURRENT_MM_VALUE"
                    Sysinfo_uptime_current_MM_value.textContent = this.System.UPTIME.MMDHM
                    Sysinfo_uptime_current_MM.appendChild(Sysinfo_uptime_current_MM_value)

                  var Sysinfo_uptime_record = document.createElement("div")
                  Sysinfo_uptime_record.id = "GATEWAY_ADMIN-SYSINFO_UPTIMES_RECORD"
                  Sysinfo_uptime_record.textContent = this.translate("GW_System_RecordUptime")
                  Sysinfo_uptimes_list.appendChild(Sysinfo_uptime_record)

                  var Sysinfo_uptime_record_system = document.createElement("div")
                  Sysinfo_uptime_record_system.id = "GATEWAY_ADMIN-SYSINFO_UPTIMES_RECORD_SYSTEM"
                  Sysinfo_uptime_record_system.textContent = this.translate("GW_System_System")
                  Sysinfo_uptimes_list.appendChild(Sysinfo_uptime_record_system)
                  
                    var Sysinfo_uptime_record_system_value = document.createElement("div")
                    Sysinfo_uptime_record_system_value.id = "GATEWAY_ADMIN-SYSINFO_UPTIMES_RECORD_SYSTEM_VALUE"
                    Sysinfo_uptime_record_system_value.textContent = this.System.UPTIME.currentDHM
                    Sysinfo_uptime_record_system.appendChild(Sysinfo_uptime_record_system_value)

                  var Sysinfo_uptime_record_MM = document.createElement("div")
                  Sysinfo_uptime_record_MM.id = "GATEWAY_ADMIN-SYSINFO_UPTIMES_RECORD_MM"
                  Sysinfo_uptime_record_MM.textContent = "MagicMirror²:"
                  Sysinfo_uptimes_list.appendChild(Sysinfo_uptime_record_MM)
                  
                    var Sysinfo_uptime_record_MM_value = document.createElement("div")
                    Sysinfo_uptime_record_MM_value.id = "GATEWAY_ADMIN-SYSINFO_UPTIMES_RECORD_MM_VALUE"
                    Sysinfo_uptime_record_MM_value.textContent = this.System.UPTIME.MMDHM
                    Sysinfo_uptime_record_MM.appendChild(Sysinfo_uptime_record_MM_value)

    document.body.appendChild(wrapper)
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

    /* Version */
    var MM_Value = document.getElementById("GATEWAY_ADMIN-SYSINFO_VERSION-MM-VALUE")
    MM_Value.textContent = this.System.VERSION.MagicMirror
    var ELECTRON_Value = document.getElementById("GATEWAY_ADMIN-SYSINFO_VERSION-ELECTRON-VALUE")
    ELECTRON_Value.textContent = this.System.VERSION.ELECTRON
    var MMNode_Value = document.getElementById("GATEWAY_ADMIN-SYSINFO_VERSION-MMNODE-VALUE")
    MMNode_Value.textContent = this.System.VERSION.NODEMM
    var Node_Value = document.getElementById("GATEWAY_ADMIN-SYSINFO_VERSION-NODE-VALUE")
    Node_Value.textContent = this.System.VERSION.NODECORE
    var NPM_Value = document.getElementById("GATEWAY_ADMIN-SYSINFO_VERSION-NPM-VALUE")
    NPM_Value.textContent = this.System.VERSION.NPM
    var OS_Value = document.getElementById("GATEWAY_ADMIN-SYSINFO_VERSION-OS-VALUE")
    OS_Value.textContent = this.System.VERSION.OS
    var Kernel_Value = document.getElementById("GATEWAY_ADMIN-SYSINFO_VERSION-KERNEL-VALUE")
    Kernel_Value.textContent = this.System.VERSION.KERNEL

    /* CPU */
    var Type_Value = document.getElementById("GATEWAY_ADMIN-SYSINFO_CPU-TYPE-VALUE")
    Type_Value.textContent = this.System.CPU.type
    var Speed_Value = document.getElementById("GATEWAY_ADMIN-SYSINFO_CPU-SPEED-VALUE")
    Speed_Value.textContent= this.System.CPU.speed
    var Usage_Bar = document.getElementById("GATEWAY_ADMIN-SYSINFO_CPU-USAGE-PROGRESSBAR")
    Usage_Bar.style.width = this.System.CPU.usage + "%"
    Usage_Bar.style.backgroundColor = this.selectColor(this.System.CPU.usage)
    Usage_Bar.textContent = this.System.CPU.usage + "%"
    var Governor_Value = document.getElementById("GATEWAY_ADMIN-SYSINFO_CPU-GOVERNOR-VALUE")
    Governor_Value.textContent= this.System.CPU.governor
    var Temp_Bar = document.getElementById("GATEWAY_ADMIN-SYSINFO_CPU-TEMP-PROGRESSBAR")
    Temp_Bar.style.width = this.System.CPU.temp.C + "%"
    Temp_Bar.style.backgroundColor = this.selectColor(this.System.CPU.temp.C)
    Temp_Bar.textContent = this.System.CPU.temp.C + "°"

    /* MEMORY */
    var Active_ValueTotal = document.getElementById("GATEWAY_ADMIN-SYSINFO_MEMORY-ACTIVE-VALUE-TOTAL")
    Active_ValueTotal.textContent = this.System.MEMORY.total
    var Active_Bar = document.getElementById("GATEWAY_ADMIN-SYSINFO_MEMORY-ACTIVE-PROGRESSBAR")
    Active_Bar.style.width = this.System.MEMORY.percent + "%"
    Active_Bar.style.backgroundColor = this.selectColor(this.System.MEMORY.percent)
    Active_Bar.textContent = this.System.MEMORY.used
    
    var Swap_ValueTotal = document.getElementById("GATEWAY_ADMIN-SYSINFO_MEMORY-SWAP-VALUE-TOTAL")
    Swap_ValueTotal.textContent= this.System.MEMORY.swapTotal
    var Swap_Bar = document.getElementById("GATEWAY_ADMIN-SYSINFO_MEMORY-SWAP-PROGRESSBAR")
    Swap_Bar.style.width = this.System.MEMORY.swapPercent + "%"
    Swap_Bar.style.backgroundColor = this.selectColor(this.System.MEMORY.swapPercent)
    Swap_Bar.textContent = this.System.MEMORY.swapUsed

    /* Uptimes*/
    var uptime_current_system = document.getElementById("GATEWAY_ADMIN-SYSINFO_UPTIMES_CURRENT_SYSTEM_VALUE")
    uptime_current_system.textContent = this.System.UPTIME.currentDHM
    var uptime_current_MM = document.getElementById("GATEWAY_ADMIN-SYSINFO_UPTIMES_CURRENT_MM_VALUE")
    uptime_current_MM.textContent = this.System.UPTIME.MMDHM
    var uptime_record_system = document.getElementById("GATEWAY_ADMIN-SYSINFO_UPTIMES_RECORD_SYSTEM_VALUE")
    uptime_record_system.textContent = this.System.UPTIME.recordCurrentDHM
    var uptime_record_MM = document.getElementById("GATEWAY_ADMIN-SYSINFO_UPTIMES_RECORD_MM_VALUE")
    uptime_record_MM.textContent = this.System.UPTIME.recordMMDHM
  }

  updateTimer() {
    this.sendSocketNotification("GET-SYSINFO")
    this.timerRefresh = setInterval(() => {
      this.sendSocketNotification("GET-SYSINFO")
    }, 5000)
  }
  
  selectColor(value) {
    let color = "#212121"
    if (value <= 50) color = "#3cba54"
    else if (value >= 50 && value < 80) color = "#f4c20d"
    else if (value >= 80) color = "#db3236"
    return color
    
  }
}
