
//Create the google maps ui then append to the UI Contianer
function appendInterface (){
  // document.getElementById("myP").style.cursor = "crosshair";

  var controlTabs = 
    '<div id="" class="float">'+
      '<ul>'+
        '<li><a href="#tabs-1">Map Options</a></li>'+
        '<li><a href="#tabs-2">Draw Options</a></li>'+
        '<li><a href="#tabs-3">Third</a></li>'+
      '</ul>'+
      '<div id="tabs-2">Fusce sed lorem in enim dictum bibendum.</div>'+
      '<div id="tabs-3">equat vestibulum, lacus. Mauris porttitor ullamcorper augue.</div>'+
    '</div>';

  $("#interface").prepend(controlTabs).tabs({collapsible:true});

  // var objectTabs =
  //  '<div class="right-Tab">'+
  //   '<ul id="right-tab">'+
  //     '<li><a href="groupsTab">Group</a>'+
  //     '<li><a href="pointsTab">Points</a></li>'+
  //     '<li><a href="linesTab">Lines</a></li>'+
  //     '<li><a href="planesTab">Planes</a></li>'+
  //     '</li>'+
  //   '</ul>'+
  // '</div>';

  // $('#interface').prepend(objectTabs).tabs({collapsible:true});



}

function appendMapInterface (){
  var mapTab =
    '<div id="tabs-1" aria-labelledby="ui-id-2" class="ui-tabs-panel ui-widget-content ui-corner-bottom" role="tabpanel" aria-hidden="true" style="display: none;">'+
      '<form id="mapData">'+
        '<input type="text" class="padding5" name="center"> Address </input>'+
        '<select class="padding5" name="size">'+
          '<option value="200x200">200x200</option>'+
          '<option value="300x300">300x300</option>'+
          '<option value="400x400">400x400</option>'+
          '<option value="500x500">500x500</option>'+
          '<option value="500x500">2000x2000</option>'+
        '</select>'+

        '<select class="padding5" name="zoom">'+
          '<option>17</option>'+
          '<option>18</option>'+
          '<option>19</option>'+
          '<option>20</option>'+
          '<option>21</option>'+
        '</select>'+

      '</form>'+
      '<img src="../images/compass.jpg" class="compass" />'+
      //'<input id="updateMap" type="button" name="submit" value="Submit">'+
    '</div>'+
    '<input id="slider" type="range" min="0" max="359" step="1" val="0">';

  $('ul.ui-tabs-nav').after(mapTab);
  $('.compass').mousedown(function (event){
    console.log(event);
  });
 
  $('#mapData').change(function (val){
    var mapObj = {};
    $('#mapData').children().each(function (val){
      mapObj[this.name]=this.value;
    });

    loadMap(mapObj);
  });
};

function toggleOrth (val){
    if (val.value==="false"){
      val.innerHTML = "<u>O</u>rthogonal";
      val.value="true";
    } else {
      val.value="false";
      val.innerHTML = "N<u>o</u>rmal";
    }

}

function appendDrawInterface (){
  var drawTab =
    '<div id="tabs-2" aria-labelledby="ui-id-2" class="ui-tabs-panel ui-widget-content ui-corner-bottom" role="tabpanel" aria-hidden="true" style="display: none;">'+
        '<button id="ortho" value="true"><u>O</u>rthogonal</button>'+
    '</div>';
  $('ul.ui-tabs-nav').after(drawTab);

  $('#ortho').click(function(val){
    toggleOrth(val.currentTarget);
  });
  
};



$().ready(function (){
  appendInterface();
  appendMapInterface();
  appendDrawInterface(); 
})
















































































