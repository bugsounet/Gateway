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

// Load rules
window.addEventListener("load", async event => {
  versionGW = await getGatewayVersion()
  translation = await loadTranslation()
  if (window.location.pathname != "/login") actualSetting = await getGatewaySetting()

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
    
  if (actualSetting.noLogin) $('#logout').css("display", "none")
  else $('#Logout').text(translation.Logout)
  
  $('#accordionSidebar').removeClass("invisible")
  $('li.active').removeClass('active')
  var path=location.pathname
  if ((path == "/install") || (path == "/delete")) path = "/EXT"
  $('a[href="' + path + '"]').closest('a').addClass('active')
})

function loadTranslation() {
  return new Promise(resolve => {
    $.getJSON("/translation" , (tr) => {
      console.log("Translation", tr)
      resolve(tr)
    })
  })
}

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

function loadDataDescriptionEXT() {
  return new Promise(resolve => {
    $.getJSON("/DescriptionEXT" , (desEXT) => {
      console.log("DescriptionEXT", desEXT)
      resolve(desEXT)
    })
  })
}

function LaunchInstall() {
  if (window.location.search) {
    var EXT = decodeURIComponent(window.location.search.match(/(\?|&)ext\=([^&]*)/)[2])
    $('#messageText').text(translation.Plugins_Install_Progress)
    $('#boutons').attr('style' , 'display: none !important')
    return new Promise (resolve => {
      $.getJSON("/EXTInstall?EXT="+EXT , res => {
        if (!res.error) $('#messageText').text(translation.Plugins_Install_Confirmed)
        else $('#messageText').text(translation.Warn_Error)
        resolve()
      })
    })
  } else {
    $('#EXT-Name').text("Error!")
  }
}

function LaunchDelete() {
  if (window.location.search) {
    var EXT = decodeURIComponent(window.location.search.match(/(\?|&)ext\=([^&]*)/)[2])
    $('#messageText').text(translation.Plugins_Delete_Progress)
    $('#boutons').attr('style' , 'display: none !important')
    return new Promise (resolve => {
      $.getJSON("/EXTDelete?EXT="+EXT , res => {
        if (!res.error) $('#messageText').text(translation.Plugins_Delete_Confirmed)
        else $('#messageText').text(translation.Warn_Error)
        resolve()
      })
    })
  } else {
    $('#EXT-Name').text("Error!")
  }
}

function doLogin() {
  $('#Welcome').text(translation.Login_Welcome)
  $('#username').attr("placeholder", translation.Login_Username)
  $('#password').attr("placeholder", translation.Login_Password)
  $("#login").submit(function(event) {
    event.preventDefault()
    $.post( "/auth", $(this).serialize())
      .done(back => {
        if (back.err) document.getElementById("flashErr").innerHTML = "Error: " + back.err.message
        else $(location).attr('href',"/")
      })
    })
}

function doIndex() {
  $('#welcome').text(translation.Home_Welcome)
}

function doDelete() {
  $('#TerminalHeader').text(translation.Plugins_Delete_TerminalHeader)
  $('#messageText').text(translation.Plugins_Delete_Message)
  $('#delete').text(translation.Delete2)
  $('#cancel').text(translation.Cancel)
}

function doInstall() {
  $('#TerminalHeader').text(translation.Plugins_Install_TerminalHeader)
  $('#messageText').text(translation.Plugins_Install_Message)
  $('#install').text(translation.Install)
  $('#cancel').text(translation.Cancel)
}

function doRestart() {
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
  $('#text1').text(translation.Tools_Die_Text1)
  $('#text2').text(translation.Tools_Die_Text2)
  $('#text3').text(translation.Tools_Die_Text3)
}

function doTerminal() {
  $('#TerminalHeader').text(translation.Terminal)
}

function doTools() {
  $('#title').text(translation.Tools_Welcome)
  $('#subtitle').text(translation.Tools_subTitle)
  $('#stop').text(translation.Tools_Die)
  $('#restart').text(translation.Tools_Restart)
  $('#Die').text(translation.Confirm)
  $('#Restart').text(translation.Confirm)
}

async function createEXTTable() {
  $('#Plugins_Welcome').text(translation.Plugins_Welcome)
  if (!AllEXT.length) AllEXT = await loadDataAllEXT()
  if (!Object.keys(DescEXT).length) DescEXT = await loadDataDescriptionEXT()
  if (!InstEXT.length) InstEXT = await loadDataInstalledEXT()
  if (!ConfigEXT.length) ConfigEXT = await loadDataConfiguredEXT()
  var Content = `<div id="TableSorterCard" class="card" id="TableSorterCard"><div class="row table-topper align-items-center"><div class="col-4 text-start" style="margin: 0px;padding: 5px 15px;"><button class="btn btn-primary btn-sm reset" type="button" style="padding: 5px;margin: 2px;">${translation.Plugins_Table_Reset}</button></div><div class="col-4 text-center" style="margin: 0px;padding: 5px 10px;"><h6 id="counter" style="margin: 0px;">${translation.Plugins_Table_Showing}<strong id="rowCount">${translation.Plugins_Table_ALL}</strong>${translation.Plugins_Table_Plugins}</h6></div></div><div class="row"><div class="col-12"><div>`
  
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

function loadMMConfig() {
  return new Promise(resolve => {  
    $.getJSON("/GetMMConfig" , (config) => {
      console.log("MMConfig", config)
      resolve(config)
    })
  })
}

//make viewJSEditor
async function viewJSEditor() {
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

function loadBackupConfig(file) {
  return new Promise(resolve => {
    $.getJSON("/GetBackupFile?config="+file , (backupFile) => {
      console.log("backupFile", backupFile)
      resolve(backupFile)
    })
  })
}

function loadBackupNames() {
  return new Promise(resolve => {
    $.getJSON("/GetBackupName" , (backups) => {
      console.log("backups", backups)
      resolve(backups)
    })
  })
}

async function EditMMConfigJSEditor() {
  $('#MMConfigHeader').text(translation.Configuration_Edit_Title)
  $('#wait').text(translation.Wait)
  $('#done').text(translation.Done)
  $('#error').text(translation.Error)
  $('#save').text(translation.Save)
  $('#load').text(translation.Load)
  $('#wait').css("display", "none")
  $('#done').css("display", "none")
  $('#error').css("display", "none")
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
      if (errors.length) $('#save').css("display", "none")
      else $('#save').css("display", "block")
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
      });
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
      });
  }
}

function loadPluginConfig(plugin) {
  return new Promise(resolve => {
    $.getJSON("/EXTGetDefaultConfig?ext="+plugin , (defaultConfig) => {
      console.log("defaultConfig", defaultConfig)
      resolve(defaultConfig)
    })
  })
}

function loadPluginTemplate(plugin) {
  return new Promise(resolve => {
    $.getJSON("/EXTGetDefaultTemplate?ext="+plugin , (defaultTemplate) => {
      console.log("defaultTemplate", defaultTemplate)
      resolve(defaultTemplate)
    })
  })
}

async function EXTConfigJSEditor() {
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
        var PorcupineValidator = [ "jarvis", "americano", "blueberry", "bumblebee", "grapefruit", "grasshopper", "hey google", "hey siri", "ok google", "picovoice", "porcupine", "terminator" ]
        json.config.detectors.forEach((detector, index) => {
          if (detector.detector == "Snowboy" && SnowboyValidator.indexOf(detector.Model) == -1) {
            console.log(detector,errors)
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
      });
  }
}

function loadPluginCurrentConfig(plugin) {
  return new Promise(resolve => {
    $.getJSON("/EXTGetCurrentConfig?ext="+plugin , (currentConfig) => {
      console.log("CurrentConfig", currentConfig)
      resolve(currentConfig)
    })
  })
}

async function EXTModifyConfigJSEditor() {
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
        var PorcupineValidator = [ "jarvis", "americano", "blueberry", "bumblebee", "grapefruit", "grasshopper", "hey google", "hey siri", "ok google", "picovoice", "porcupine", "terminator" ]
        json.config.detectors.forEach((detector, index) => {
          if (detector.detector == "Snowboy" && SnowboyValidator.indexOf(detector.Model) == -1) {
            console.log(detector,errors)
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
      });
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
      });
  }
}
function getGatewaySetting() {
  return new Promise(resolve => {  
    $.getJSON("/getSetting" , (confGW) => {
      console.log("SettingGW", confGW)
      resolve(confGW)
    })
  })
}

function getGatewayVersion() {
  return new Promise(resolve => {  
    $.getJSON("/version" , (versionGW) => {
      console.log("Version", versionGW)
      resolve(versionGW)
    })
  })
}

function GatewaySetting() {
  $('#version').text(versionGW.v)
  $('#rev').text(versionGW.rev)

  $('#restart').css("display", "none")
  $('#wait').css("display", "none")
  $('#buttonGrp').removeClass('invisible')
  $('#update').css("display", "block")
  
  $("#login").prop("checked", !actualSetting.noLogin)
  $("input.grplogin").prop("disabled", actualSetting.noLogin)
  $("#username").val(actualSetting.username)
  $("#password").val(actualSetting.password)
  
  $("#debug").prop("checked", actualSetting.debug)
  $("#pm2").prop("checked", actualSetting.usePM2)
  $("select.grppm2").prop("disabled", !actualSetting.usePM2)
  $("#pm2id option[value='" + actualSetting.PM2Id + "']").prop('selected', true)
  $("#port option[value='" + actualSetting.port + "']").prop('selected', true)
  
  document.getElementById('login').onclick = function () {
    $("input.grplogin").prop("disabled", !this.checked)
  }

  document.getElementById('pm2').onclick = function () {
    $("select.grppm2").prop("disabled", !this.checked)
  }
  
  $("#GatewaySetting").submit(function(event) {
    var newGatewayConfig= {
      module: "Gateway",
      config: {
        debug: true,
        port: 8081,
        username: "admin",
        password: "admin",
        noLogin: false,
        usePM2: false,
        PM2Id: 0
      }
    }
    event.preventDefault()
    var login = $( "input[type=checkbox][name=login]:checked" ).val()
    if (login) {
      var username = $( "input[type=text][name=username]").val()
      var password = $( "input[type=password][name=password]" ).val()
      var confirm = $( "input[type=password][name=confirmpwd]" ).val()
      if (!username) {
        $('#alert').removeClass('invisible')
        $('#alert').removeClass('alert-success')
        $('#alert').addClass('alert-danger')
        $('#messageText').text("Please enter Username!")
        return
      }
      if (!password) {
        $('#alert').removeClass('invisible')
        $('#alert').removeClass('alert-success')
        $('#alert').addClass('alert-danger')
        $('#messageText').text("Please enter Password!")
        return
      }
      if (password != confirm) {
        $('#alert').removeClass('invisible')
        $('#alert').removeClass('alert-success')
        $('#alert').addClass('alert-danger')
        $('#messageText').text("Password is not confirmed!")
        return
      }
      newGatewayConfig.config.noLogin = false
      newGatewayConfig.config.username = username
      newGatewayConfig.config.password = password
    } else {
      newGatewayConfig.config.noLogin = true
      newGatewayConfig.config.username = "admin"
      newGatewayConfig.config.password = "admin"
    }
    var debug = $( "input[type=checkbox][name=debug]:checked" ).val()
    if (debug) newGatewayConfig.config.debug = true
    else newGatewayConfig.config.debug = false
    var port = Number($( "select#port" ).val())
    newGatewayConfig.config.port = port
    var pm2 = $( "input[type=checkbox][name=pm2]:checked" ).val()
    var pm2id = Number($( "select#pm2id" ).val())
    if (pm2) {
      newGatewayConfig.config.usePM2 = true
      newGatewayConfig.config.PM2Id = pm2id
    }
    else {
      newGatewayConfig.config.usePM2 = false
      newGatewayConfig.config.PM2Id = 0
    }
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
