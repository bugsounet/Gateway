/** EXT tools
* rev 220413
* @bugsounet
**/
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
    Content += `<tr><td class="text-nowrap fs-6 text-start click" data-bs-toggle="tooltip" style="cursor: pointer;" data-href="https://wiki.bugsounet.fr/${pluginsName}" title="Open the wiki page of ${pluginsName}">${pluginsName}</td><td>${DescEXT[pluginsName]}</td>`

    if (InstEXT.indexOf(pluginsName) == -1) Content += `<td align="center"><a class="btn btn-primary btn-sm" role="button" href="/install?ext=${pluginsName}">Install</a></td>`
    else Content += `<td align="center"><a class="btn btn-danger btn-sm" role="button" href="/delete?ext=${pluginsName}">Delete</a></td>`
    
    if (InstEXT.indexOf(pluginsName) == -1) {
      if (ConfigEXT.indexOf(pluginsName) == -1) Content += '<td></td>'
      else Content += '<td align="center"><button class="btn btn-danger btn-sm pulse animated infinite" data-bs-toggle="tooltip" title="Delete the configuration" type="button">Delete</button></td>'
    } else {
      if (ConfigEXT.indexOf(pluginsName) == -1) Content += '<td align="center"><button class="btn btn-warning btn-sm pulse animated infinite" data-bs-toggle="tooltip" title="Ready to be configured" type="button">Configure</button></td>'
      else Content += '<td align="center"><button class="btn btn-success btn-sm" type="button" data-bs-toggle="tooltip" title="Modify the configuration">Modify</button></td>'
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
  // call the tablesorter plugin
  $("#ipi-table").tablesorter({
    theme: 'bootstrap',

    // hidden filter input/selects will resize the columns, so try to minimize the change
    widthFixed : true,

    // initialize zebra striping and filter widgets
    widgets : [ "filter", "columns", "zebra" ],

    ignoreCase: false,

    widgetOptions : {
      // using the default zebra striping class name, so it actually isn't included in the theme variable above
      // this is ONLY needed for bootstrap theming if you are using the filter widget, because rows are hidden
      zebra : ["even", "odd"],

      // class names added to columns when sorted
      columns: [ "primary", "secondary", "tertiary" ],
      // filter_anyMatch options was removed in v2.15; it has been replaced by the filter_external option

      // If there are child rows in the table (rows with class name from "cssChildRow" option)
      // and this option is true and a match is found anywhere in the child row, then it will make that row
      // visible; default is false
      filter_childRows : false,

      // if true, filter child row content by column; filter_childRows must also be true
      filter_childByColumn : false,

      // if true, include matching child row siblings
      filter_childWithSibs : true,

      // if true, a filter will be added to the top of each table column;
      // disabled by using -> headers: { 1: { filter: false } } OR add class="filter-false"
      // if you set this to false, make sure you perform a search using the second method below
      filter_columnFilters : true,

      // if true, allows using "#:{query}" in AnyMatch searches (column:query; added v2.20.0)
      filter_columnAnyMatch: true,

      // extra css class name (string or array) added to the filter element (input or select)
      filter_cellFilter : '',

      // extra css class name(s) applied to the table row containing the filters & the inputs within that row
      // this option can either be a string (class applied to all filters) or an array (class applied to indexed filter)
      filter_cssFilter : '', // or []

      // add a default column filter type "~{query}" to make fuzzy searches default;
      // "{q1} AND {q2}" to make all searches use a logical AND.
      filter_defaultFilter : {},

      // filters to exclude, per column
      filter_excludeFilter : {},

      // jQuery selector (or object) pointing to an input to be used to match the contents of any column
      // please refer to the filter-any-match demo for limitations - new in v2.15
      filter_external : '',

      // class added to filtered rows (rows that are not showing); needed by pager plugin
      filter_filteredRow : 'filtered',

      // ARIA-label added to filter input/select; {{label}} is replaced by the column header
      // "data-label" attribute, if it exists, or it uses the column header text
      filter_filterLabel : 'Filter "{{label}}" column by...',

      // add custom filter elements to the filter row
      // see the filter formatter demos for more specifics
      filter_formatter : null,

      // add custom filter functions using this option
      // see the filter widget custom demo for more specifics on how to use this option
      filter_functions : null,

      // hide filter row when table is empty
      filter_hideEmpty : true,

      // if true, filters are collapsed initially, but can be revealed by hovering over the grey bar immediately
      // below the header row. Additionally, tabbing through the document will open the filter row when an input gets focus
      // in v2.26.6, this option will also accept a function
      filter_hideFilters : false,

      // Set this option to false to make the searches case sensitive
      filter_ignoreCase : true,

      // if true, search column content while the user types (with a delay).
      // In v2.27.3, this option can contain an
      // object with column indexes or classnames; "fallback" is used
      // for undefined columns
      filter_liveSearch : true,

      // global query settings ('exact' or 'match'); overridden by "filter-match" or "filter-exact" class
      filter_matchType : { 'input': 'exact', 'select': 'exact' },

      // a header with a select dropdown & this class name will only show available (visible) options within that drop down.
      filter_onlyAvail : 'filter-onlyAvail',

      // default placeholder text (overridden by any header "data-placeholder" setting)
      filter_placeholder : { search : 'Search...', select : '' },

      // jQuery selector string of an element used to reset the filters
      filter_reset : 'button.reset',

      // Reset filter input when the user presses escape - normalized across browsers
      filter_resetOnEsc : true,

      // Use the $.tablesorter.storage utility to save the most recent filters (default setting is false)
      filter_saveFilters : true,

      // Delay in milliseconds before the filter widget starts searching; This option prevents searching for
      // every character while typing and should make searching large tables faster.
      filter_searchDelay : 300,

      // allow searching through already filtered rows in special circumstances; will speed up searching in large tables if true
      filter_searchFiltered: true,

      // include a function to return an array of values to be added to the column filter select
      filter_selectSource  : null,

      // if true, server-side filtering should be performed because client-side filtering will be disabled, but
      // the ui and events will still be used.
      filter_serversideFiltering : false,

      // Set this option to true to use the filter to find text from the start of the column
      // So typing in "a" will find "albert" but not "frank", both have a's; default is false
      filter_startsWith : false,

      // Filter using parsed content for ALL columns
      // be careful on using this on date columns as the date is parsed and stored as time in seconds
      filter_useParsedData : false,

      // data attribute in the header cell that contains the default filter value
      filter_defaultAttrib : 'data-value',

      // filter_selectSource array text left of the separator is added to the option value, right into the option text
      filter_selectSourceSeparator : '|'
    }
  });

  // Clear stored filters - added v2.25.6
  $('.resetsaved').click(function() {
    $('#ipi-table').trigger('filterResetSaved');

    // show quick popup to indicate something happened
    var $message = $('<span class="results"> Reset</span>').insertAfter(this);
    setTimeout(function() {
      $message.remove();
    }, 500);
    return false;
  });

  // External search
  // buttons set up like this:
  // <button type="button" data-filter-column="4" data-filter-text="2?%">Saved Search</button>
  $('button[data-filter-column]').click(function() {
    /*** first method *** data-filter-column="1" data-filter-text="!son"
    add search value to Discount column (zero based index) input
    */
    var filters = [],
      $t = $(this),
      col = $t.data('filter-column'), // zero-based index
      txt = $t.data('filter-text') || $t.text(); // text to add to filter

    filters[col] = txt;
    // using "table.hasFilters" here to make sure we aren't targeting a sticky header
    $.tablesorter.setFilters( $('#table'), filters, true ); // new v2.9

    /** old method (prior to tablsorter v2.9 ***
    var filters = $('table.tablesorter').find('input.tablesorter-filter');
    filters.val(''); // clear all filters
    filters.eq(col).val(txt).trigger('search', false);
    ******/

    /*** second method ***
    this method bypasses the filter inputs, so the "filter_columnFilters"
    option can be set to false (no column filters showing)
    ******/
    /*
    var columns = [];
    columns[5] = '2?%'; // or define the array this way [ '', '', '', '', '', '2?%' ]
    $('table').trigger('search', [ columns ]);
    */

    return false;
  });

  $('table').bind('filterEnd', function(event, filteredRows){
    var rowCount = document.getElementById('rowCount');
    if (typeof rowCount !== "undefined") {
      var text = document.createTextNode(filteredRows.filteredRows);
      jQuery('#rowCount').html('');
      rowCount.appendChild(text);
    }
  });
}

// make navbar active
window.addEventListener("load", event => {
  //location.reload(true)
  $('li.active').removeClass('active');
  var path=location.pathname
  if ((path == "/install") || (path == "/delete")) path = "/EXT"
  $('a[href="' + path + '"]').closest('a').addClass('active');
})

function loadModulesConfig() {
  return new Promise(resolve => {  
    $.getJSON("/ModulesConfig" , (modules) => {
      console.log("ModulesConfig", modules)
      resolve(modules)
    })
  })
}

//make viewJSEditor
async function viewJSEditor() {
  var modules = await loadModulesConfig()
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