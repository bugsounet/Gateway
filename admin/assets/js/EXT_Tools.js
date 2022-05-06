/** EXT tools
* @bugsounet
**/

PleaseRotateOptions = {
    forcePortrait: false,
    message: "Please Rotate Your Device",
    subMessage: "for continue",
    allowClickBypass: false,
    onlyMobile: true
};

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
    $('#messageText').text("Installing in progress...")
    $('#boutons').attr('style' , 'display: none !important')
    return new Promise (resolve => {
      $.getJSON("/EXTInstall?EXT="+EXT , res => {
        if (!res.error) $('#messageText').text("Installation complete!")
        else $('#messageText').text("Warn: Some errors detected")
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
    $('#messageText').text("Delete in progress...")
    $('#boutons').attr('style' , 'display: none !important')
    return new Promise (resolve => {
      $.getJSON("/EXTDelete?EXT="+EXT , res => {
        if (!res.error) $('#messageText').text("Delete complete!")
        else $('#messageText').text("Warn: Some errors detected")
        resolve()
      })
    })
  } else {
    $('#EXT-Name').text("Error!")
  }
}


async function createTr() {
  var AllEXT = await loadDataAllEXT()
  var DescEXT = await loadDataDescriptionEXT()
  var InstEXT = await loadDataInstalledEXT()
  var ConfigEXT = await loadDataConfiguredEXT()
  var Content = `<div id="TableSorterCard" class="card" id="TableSorterCard"><div class="row table-topper align-items-center"><div class="col-4 text-start" style="margin: 0px;padding: 5px 15px;"><button class="btn btn-primary btn-sm reset" type="button" style="padding: 5px;margin: 2px;">Reset Filters</button></div><div class="col-4 text-center" style="margin: 0px;padding: 5px 10px;"><h6 id="counter" style="margin: 0px;">Showing: <strong id="rowCount">ALL</strong> Plugin(s)</h6></div></div><div class="row"><div class="col-12"><div>`
  
  Content +=`<table id="ipi-table" class="table table tablesorter"><thead class="thead-dark"><tr><th>Plugins Name</th><th class="sorter-false">Description</th><th class="filter-false">Actions</th><th class="filter-false">Configuration</th></tr></thead><tbody id="EXT">`
  
  AllEXT.forEach(pluginsName => {
    // wiki page link
    Content += `<tr><td class="text-nowrap fs-6 text-start click" data-bs-toggle="tooltip" style="cursor: pointer;" data-href="https://wiki.bugsounet.fr/${pluginsName}" title="Open the wiki page of ${pluginsName}">${pluginsName}</td><td>${DescEXT[pluginsName]}</td>`

    // EXT install link
    if (InstEXT.indexOf(pluginsName) == -1) Content += `<td align="center"><a class="btn btn-primary btn-sm" role="button" href="/install?ext=${pluginsName}">Install</a></td>`
    // EXT delete link
    else Content += `<td align="center"><a class="btn btn-danger btn-sm" role="button" href="/delete?ext=${pluginsName}">Delete</a></td>`
    
    if (InstEXT.indexOf(pluginsName) == -1) {
      if (ConfigEXT.indexOf(pluginsName) == -1) Content += '<td></td>'
      // config delete link
      else Content += `<td align="center"><a class="btn btn-danger btn-sm pulse animated infinite" data-bs-toggle="tooltip" title="Delete the configuration" role="button" href="/EXTDeleteConfig?ext=${pluginsName}">Delete</a></td>`
    } else {
      // configure link
      if (ConfigEXT.indexOf(pluginsName) == -1) Content += `<td align="center"><a class="btn btn-warning btn-sm pulse animated infinite" data-bs-toggle="tooltip" title="Ready to be configured" role="button" href="/EXTCreateConfig?ext=${pluginsName}">Configure</a></td>`
      // modify link
      else Content += `<td align="center"><a class="btn btn-success btn-sm" data-bs-toggle="tooltip" title="Modify the configuration" role="button" href="/EXTModifyConfig?ext=${pluginsName}">Modify</a></td>`
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
      filter_placeholder : { search : 'Search...', select : '' },
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

// make navbar active
window.addEventListener("load", event => {
  $('li.active').removeClass('active')
  var path=location.pathname
  if ((path == "/install") || (path == "/delete")) path = "/EXT"
  $('a[href="' + path + '"]').closest('a').addClass('active')
})

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
  $('#wait').css("display", "none")
  $('#done').css("display", "none")
  $('#error').css("display", "none")
  $('#load').css("display", "none")
  $('#save').css("display", "none")
  $('#buttonGrp').removeClass('invisible')
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
          $('#messageText').text("Please restart MagicMirror to apply new configuration!")
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
          $('#messageText').text("Please restart MagicMirror to apply new configuration!")
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
      if (json && json.module && json.module != EXT) {
        errors.push({
          path: ['module'],
          message: 'module name error: must be ' + EXT
        })
        return errors
      }
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
          $('#messageText').text("Please restart MagicMirror to apply new configuration!")
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
  $('#wait').css("display", "none")
  $('#done').css("display", "none")
  $('#error').css("display", "none")
  $('#buttonGrp').removeClass('invisible')
  var EXT = undefined
  if (window.location.search) {
    EXT = decodeURIComponent(window.location.search.match(/(\?|&)ext\=([^&]*)/)[2])
  }
  $('#EXTName').text(EXT)
  var plugin = await loadPluginCurrentConfig(EXT)
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
      if (json && json.module && json.module != EXT) {
        errors.push({
          path: ['module'],
          message: 'module name error: must be ' + EXT
        })
        return errors
      }
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
    console.log("editor", JSON.parse(data))
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
          $('#messageText').text("Please restart MagicMirror to apply new configuration!")
        }
      });
  }
}

async function EXTDeleteConfigJSEditor() {
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
          $('#messageText').text("Configuration deleted!")
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

async function GatewaySetting() {
  var actualSetting = await getGatewaySetting()
  $('#restart').css("display", "none")
  $('#wait').css("display", "none")
  $('#buttonGrp').removeClass('invisible')
  $('#update').css("display", "block")
  console.log(actualSetting)
  
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
      newGatewayConfig.config.noLogin= false
      console.log("login", login)
      var username = $( "input[type=text][name=username]").val()
      var password = $( "input[type=password][name=password]" ).val()
      var confirm = $( "input[type=password][name=confirmpwd]" ).val()
      if (!username) {
        console.log("username null!")
        $('#alert').removeClass('invisible')
        $('#alert').removeClass('alert-success')
        $('#alert').addClass('alert-danger')
        $('#messageText').text("Please enter Username!")
        return
      }
      if (!password) {
        console.log("pwd null!")
        $('#alert').removeClass('invisible')
        $('#alert').removeClass('alert-success')
        $('#alert').addClass('alert-danger')
        $('#messageText').text("Please enter Password!")
        return
      }
      if (password != confirm) {
        console.log("pwd confirm error!")
        $('#alert').removeClass('invisible')
        $('#alert').removeClass('alert-success')
        $('#alert').addClass('alert-danger')
        $('#messageText').text("Password is not confirmed!")
        return
      }
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
    
    console.log(newGatewayConfig)
    
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
          $('#messageText').text("Please restart MagicMirror to apply new configuration!")
          $('#wait').css("display", "none")
          $('#update').css("display", "none")
          $('#restart').css("display", "block")
        }
      })
  })
}