var drawerButton = document.querySelector('#drawer-toggle');

var controlPanel = document.querySelector('#control-panel');
var chartPanel = document.querySelector('#chart-panel');

drawerButton.addEventListener('click', function() {
	
	if(drawerButton.classList.contains('open')) {
		chartPanel.classList.remove('open');
		controlPanel.classList.remove('open');
		drawerButton.classList.remove('open');
	} else {
		chartPanel.classList.add('open');
		controlPanel.classList.add('open');
		drawerButton.classList.add('open');	
	}
	
});