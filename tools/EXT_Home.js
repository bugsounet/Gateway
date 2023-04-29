/** EXT tools
* @bugsounet
**/

// rotate rules

PleaseRotateOptions = {
  startOnPageLoad: false
}

// define all vars
var translation= {}
var versionGW = {}

// Load rules
window.addEventListener("load", async event => {
  versionGW = await getGatewayVersion()
  translation = await loadTranslation()

  $('html').prop("lang", versionGW.lang)
  doIndex()

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
  $('a[href="' + path + '"]').closest('a').addClass('active')
})

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
