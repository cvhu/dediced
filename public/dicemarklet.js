var cssNode = document.createElement('link');
cssNode.type = 'text/css';
cssNode.rel = 'stylesheet';
cssNode.href = 'http://0.0.0.0:3000/dicemarklet.css';
cssNode.media = 'screen';

var jsNode = document.createElement('script');
jsNode.type = 'text/javascript';
jsNode.src = 'http://code.jquery.com/jquery-latest.js';

document.getElementsByTagName('head')[0].appendChild(jsNode)
document.getElementsByTagName('head')[0].appendChild(cssNode);
$(document).ready(function(){
	var wrapper = $('<div id="dicemarklet-wrapper"></div>').html('wrapper').hide().prependTo('body').fadeIn();
})