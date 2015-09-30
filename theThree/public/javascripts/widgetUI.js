
//Create the google maps ui then append to the UI Contianer
(function appendInterface (){
  

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
  $("#interface").append(tabs);
  $( "#tabs" ).tabs();
})()

function appendMapInterface (){
  var mapTab =
    '<div id="tabs-1">'+
      '<form>'+
        '<input type="text" name = "address">Address</input>'+
        '<select name="size">'+
          '<option value="200x200">200x200</option>'+
          '<option value="300x300">300x300</option>'+
          '<option value="400x400">400x400</option>'+
          '<option value="500x500">500x500</option>'+
        '</select>'+
        '<select name ="zoom">'+
          '<option>17</option>'+
          '<option>18</option>'+
          '<option>19</option>'+
          '<option>20</option>'+
          '<option>21</option>'+
        '</select>'+

        '<input type="submit" value="Submit">'+
      '</form>'+





    '</div>'+ 

  $('#tabs').append(mapTab);
}

















































































