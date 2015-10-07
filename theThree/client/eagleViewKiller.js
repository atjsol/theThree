var $ = require("jquery");
require("jquery-ui");
var tabView = require("./view/tabView.html");
var mapTab = require("./view/mapTab.html");

$(function() {
	console.log("Hello world");


	var interface = $("#interface");
    interface.prepend(tabView).tabs({collapsible:true});

    $('ul.ui-tabs-nav').after(mapTab);
    $('#mapData').change(function (val){
    	var mapObj = {};
    	$('#mapData').children().each(function (val){
    		mapObj[this.name]=this.value;
    	});
    });
    //loadMap(mapObj);
});