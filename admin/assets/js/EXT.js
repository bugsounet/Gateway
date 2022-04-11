function loadDataAllEXT() {
  return new Promise(resolve => {
    $.getJSON("/allEXT" , (all) => {
      console.log("allEXT", all)
      resolve(all)
    })
  })
}
function loadDataConfiguredEXT() {
  return new Promise(resolve => {  
    $.getJSON("/ConfiguredEXT" , (confEXT) => {
      console.log("ConfiguredEXT", confEXT)
      resolve(confEXT)
    })
  })
}
function loadDataInstalledEXT() {
  return new Promise(resolve => {
    $.getJSON("/InstalledEXT" , (instEXT) => {
      console.log("InstalledEXT", instEXT)
      resolve(instEXT)
    })
  })
}
async function createTr() {
  var AllEXT = await loadDataAllEXT()
  var EXT= document.getElementById("EXT")
  AllEXT.forEach(pluginsName => {
    var plugins = document.createElement("tr")
    plugins.id = pluginsName
    plugins.innerHTML = `
                                          <td class="text-nowrap fs-6 text-start">${pluginsName}</td>
                                          <td>any description</td>
                                          <td><button class="btn btn-primary btn-sm" type="button">Install</button></td>
                                          <td><button class="btn btn-warning btn-sm" type="button">Configure</button></td>
`
  EXT.appendChild(plugins)
  })
}
createTr()