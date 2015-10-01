
//Create the google maps ui then append to the UI Contianer
function appendInterface (){
  document.getElementById("myP").style.cursor = "crosshair";

  var tabs = 
    '<div id="tabs" class="float">'+
      '<ul>'+
        '<li><a href="#tabs-1">Map Options</a></li>'+
        '<li><a href="#tabs-2">Draw Options</a></li>'+
        '<li><a href="#tabs-3">Third</a></li>'+
      '</ul>'+
      
      '<div id="tabs-2">Fusce sed lorem in enim dictum bibendum.</div>'+
      '<div id="tabs-3">equat vestibulum, lacus. Mauris porttitor ullamcorper augue.</div>'+

    '</div>'
    ;
  $("#interface").prepend(tabs).tabs({collapsible:true});
}

function appendMapInterface (){
  var mapTab =
    '<div id="tabs-1" aria-labelledby="ui-id-2" class="ui-tabs-panel ui-widget-content ui-corner-bottom" role="tabpanel" aria-hidden="true" style="display: none;">'+
      '<form id="mapData">'+
        
        '<input type="text" name = "center">Address</input>'+
        
        '<select name="size">'+
          '<option value="200x200">200x200</option>'+
          '<option value="300x300">300x300</option>'+
          '<option value="400x400">400x400</option>'+
          '<option value="500x500">500x500</option>'+
          '<option value="500x500">2000x2000</option>'+
        '</select>'+

        '<select name ="zoom">'+
          '<option>17</option>'+
          '<option>18</option>'+
          '<option>19</option>'+
          '<option>20</option>'+
          '<option>21</option>'+
        '</select>'+

      
      '</form>'+
      //'<input id="updateMap" type="button" name="submit" value="Submit">'+
    '</div>';

  $('ul.ui-tabs-nav').after(mapTab);
  $('#mapData').change(function (){
    var mapObj = {};

    $('#mapData').children().each(function (val){

      mapObj[this.name]=this.value
    });
    loadMap(mapObj);
    console.dir(mapObj);
  // $( "form" ).submit(function( event ) {
  //   console.log(event);
  //   $( this ).serializeArray();
   

  //   event.preventDefault();
  
  // });

  });
  
}


$().ready(function (){
  appendInterface();
  appendMapInterface();  
})
















































































