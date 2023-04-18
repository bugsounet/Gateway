class systemInfo {
  constructor(lib) {
    this.lib = lib
    this.System = {
      VERSION: {
        MagicMirror: require('../../../package.json').version,
        ELECTRON: "unknow",
        NODEMM: "unknow",
        NODECORE: "unknow",
        NPM: "unknow",
        KERNEL: "unknow",
        OS: "Loading...",
      },
      HOSTNAME: "unknow",
      NETWORK: {
        type: "unknow",
        ip: "unknow",
        name: "unknow"
      },
      MEMORY: {
        total: 0,
        used: 0,
        percent: 0
      },
      STORAGE: [],
      CPU: {
        usage: 0,
        type: "unknow",
        temp: {
          C: 0,
          F: 0
        },
        speed: "unknow",
        governor: "unknow"
      }
    }
  }

  async initData() {
    this.System["VERSION"].NODECORE = await new Promise(res => {
      this.lib.childProcess.exec ("node -v", (err, stdout, stderr)=>{
        if (err) res("unknow")
        else {
          let version = stdout.trim()
          version = version.replace('v', '')
          res(version)
        }
      })
    })
    await this.getStaticData()
    console.log("[GATEWAY] [SYSTEMINFO] Initialized")
  }

  async Get() {
    await this.getData()
    //console.log("[GATEWAY] [SYSTEMINFO]", this.System)
    return this.System
  }

  getStaticData() {
    var valueObject = {
      cpu: 'manufacturer,brand',
      osInfo: 'distro, release,codename,arch,hostname',
      system: 'raspberry',
      versions: "kernel, node, npm",
    }

    return new Promise(resolve => {
      this.lib.si.get(valueObject)
        .then(data => {
          if (data.osInfo) {
            this.System["VERSION"].OS = data.osInfo.distro.split(' ')[0] + " " + data.osInfo.release + " (" + data.osInfo.codename + " " + data.osInfo.arch + ")"
            this.System["HOSTNAME"] = data.osInfo.hostname
          }

          if (data.system.raspberry) this.System['CPU'].type = "Raspberry Pi " + data.system.raspberry.type + " (rev " + data.system.raspberry.revision + ")"
          else this.System['CPU'].type = data.cpu.manufacturer + " " + data.cpu.brand

          if (data.versions) {
            this.System["VERSION"].ELECTRON = process.versions.electron
            this.System["VERSION"].KERNEL = data.versions.kernel
            this.System["VERSION"].NPM = data.versions.npm
            this.System["VERSION"].NODEMM = data.versions.node
          }
          resolve()
        })
        .catch (e => {
          console.log("Error", e)
          resolve()
        })
    })
  }

  getData() {
    var valueObject = {
      cpu: 'speed,governor',
      networkInterfaces: "type,ip4,default,iface",
      mem: "total,used,buffcache",
      fsSize: "mount,size,used,use",
      currentLoad: "currentLoad",
      cpuTemperature: "main"
    }
    return new Promise((resolve) => {
      this.lib.si.get(valueObject)
        .then(data => {
          this.System['CPU'].usage= data.currentLoad.currentLoad.toFixed(0)
          this.System['CPU'].speed= data.cpu.speed + " Ghz"
          this.System['CPU'].governor= data.cpu.governor

          if (data.networkInterfaces) {
            data.networkInterfaces.forEach(Interface => {
              if (Interface.default) {
                this.System["NETWORK"].type = Interface.type
                this.System["NETWORK"].ip = Interface.ip4
                this.System["NETWORK"].name = Interface.iface
              }
            })
          }

          if (data.mem) {
            this.System['MEMORY'].total = this.convert(data.mem.total,0)
            this.System['MEMORY'].used = this.convert(data.mem.used-data.mem.buffcache,2)
            this.System['MEMORY'].percent = ((data.mem.used-data.mem.buffcache)/data.mem.total*100).toFixed(0)
          }

          if (data.versions) {
            this.System["VERSION"].KERNEL = data.versions.kernel
            this.System["VERSION"].NPM = data.versions.npm
            this.System["VERSION"].NODE = data.versions.node
          }

          if (data.fsSize) {
            this.System['STORAGE'] = []
            data.fsSize.forEach(partition => {
              var info = {}
              var part = partition.mount
              info[part] = {
                "size": this.convert(partition.size,0),
                "used": this.convert(partition.used,2),
                "use": partition.use,
              }
              if (info[part].size) this.System['STORAGE'].push(info)
            })
          }

          if (data.cpuTemperature) {
            let tempC = data.cpuTemperature.main
            let tempF = (tempC * (9 / 5)) + 32
            this.System['CPU'].temp.F = tempF.toFixed(1)
            this.System['CPU'].temp.C = tempC.toFixed(1)
          }
          resolve()
        })
        .catch (e => {
          console.log("Error", e)
          resolve()
        })
    })
  }

  convert(octet,FixTo) {
    octet = Math.abs(parseInt(octet, 10))
    var def = [[1, 'b'], [1024, 'Kb'], [1024*1024, 'Mb'], [1024*1024*1024, 'Gb'], [1024*1024*1024*1024, 'Tb']]
    for(var i=0; i<def.length; i++){
      if(octet<def[i][0]) return (octet/def[i-1][0]).toFixed(FixTo)+def[i-1][1]
    }
  }
}

module.exports = systemInfo
