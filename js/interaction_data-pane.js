var tabs = document.querySelectorAll('nav ul li');
var panes = document.getElementsByClassName('pane');

var appendDataButton = document.getElementById('data-append-button');

var inputAddGroup = document.getElementById('input-add-group');
var inputAddField = document.getElementById('data-input');
var inputAddButton = document.getElementById('data-add');

var dataList = document.getElementById('data-list');

var noDataNote = document.getElementById('no-data');
var unmetConditionNote = document.getElementById('unmet-condition');
var isEnoughData = false;

//attach click events to control panel tabs
for(var i = 0; i < tabs.length; ++i){
	tabs[i].addEventListener("click", (function(value) {
		return function(){
			showPane(value);
		}
	})(i));
}

function showPane(num) {
	for(var i = 0; i < tabs.length; ++i){
		if(i == num){
			tabs[i].classList.add('current');
			panes[i].classList.remove('hide');
		} else {
			tabs[i].classList.remove('current');
			panes[i].classList.add('hide');
		}
	}
}

//attach keypress events to data input field
inputAddField.addEventListener('keypress', function(e){
	numericalInputKeypressActions(e, this);
});
//disable paste functionality
inputAddField.addEventListener('paste', function(e){
	e.preventDefault();
});

function numericalInputKeypressActions(event, theField) {
	var theButton = theField.nextSibling;
	if (event.key === 'Enter') {
		//submit on enter
		event.preventDefault();
		theButton.click();
	} else if (event.key === 'Escape') {
		//clear entry on esc
		event.preventDefault();
		theField.value = '';
	} else if (event.key === '.') {
		if (theField.value == '') {
			//always precede decimal values with 0 (zero)
			theField.value = '0.';
			event.preventDefault();
		} else if (theField.value == '-') {
			//always precede decimal values with 0 (zero)
			theField.value = '-0.';
			event.preventDefault();
		} else if (theField.value.includes('.')) {
			//one decimal point allowed per value
			event.preventDefault();
		}
	} else if (event.key === '-') {
		if(theField.value.includes('-')) {
			theField.value = theField.value.replace('-', '');
			event.preventDefault();
		} else {
			theField.value = '-' + theField.value;
			event.preventDefault();
		}
	} else if (event.keyCode < 48 || event.keyCode > 57) {
		//NOT a number key
		event.preventDefault();
	}
}

//attach click event to add data button
inputAddButton.addEventListener('click', function(){
	addDataValue(true, inputAddField);
	graphData();
});
	
function addDataValue(isAppended, associatedInputField) {
	
	var inputDataValue = associatedInputField.value;

	// exit if no value exists /////////////
	if(inputDataValue == ''){ 
		alert("No data was entered.");
		return;
	}
	////////////////////////////////////////
	
	// security sanitization
	const m = inputDataValue.match(/^\-{0,1}[0-9]*\.{0,1}[0-9]*/);
	if( m == null || m[0].length != inputDataValue.length ) {
		alert("The data value [ " + inputDataValue + " ] is not an accepted number format. The value was not submitted.");
		associatedInputField.value = '';
		return;
	}
	
	//final sanitization
	////disregard negative
	if(inputDataValue.charAt(0) === '-'){
		inputDataValue = inputDataValue.replace('-', '');
		var removedNegativeFlag = true;
	}
	////preceding zeros
	inputDataValue = inputDataValue.replace(/^0+/, '');
	if(inputDataValue.charAt(0) === '.'){
		inputDataValue = inputDataValue.replace('.', '0.');
	}
	////unnecessary ending zeros
	if(inputDataValue.includes('.')){
		inputDataValue = inputDataValue.replace(/0+$/, '');
	}
	////ends with period
	inputDataValue = inputDataValue.replace(/\.$/, '');
	////invalid input
	if(inputDataValue == ''){
		inputDataValue = '0';
	}
	////put back negative sign that was disregarded
	if(removedNegativeFlag && inputDataValue != '0'){
		inputDataValue = '-' + inputDataValue;
	} else if(removedNegativeFlag && inputDataValue == '0') {
		inputDataValue == '0';
	}
	
	// ensure data is an accepted length
	if((inputDataValue.charAt(0) !== '-' && inputDataValue.length > 10) || (inputDataValue.charAt(0) === '-' && inputDataValue.length > 11)) {
		alert("The data value [ " + inputDataValue + " ] exceeds the character limit of 10 (excluding the negative sign). The value was not submitted.");
		associatedInputField.value = '';
		return;
	}
	
	/////////////////////////////////////////////////////
	//create insertion button before <li>
	//create insertion button
	var insertNode = document.createElement('div');
	insertNode.innerHTML = '<button>+</button><hr />';
	insertNode.classList.add('insert-button-group');
	//create insertion field
	var insertFieldGroup = document.createElement('div');
	insertFieldGroup.innerHTML = '<input type="text" maxlength="10" /><button class="data-insert">Insert</button>';
	insertFieldGroup.classList.add('input-group');
	insertFieldGroup.classList.add('insert-input-group');
	insertFieldGroup.classList.add('hide');
	//attach insertion method
	insertNode.querySelector('button').onclick = function() {
		//show all buttons
		var existingInsertionButtons = dataList.getElementsByClassName('insert-button-group');
		for(var i = 0; i < existingInsertionButtons.length; i++){
			existingInsertionButtons[i].classList.remove('hide');
		}
		//hide this button when field is in use
		insertNode.classList.add('hide');
		//hide visible fields 
		var existingInsertionFields = dataList.getElementsByClassName('insert-input-group');
		for(var i = 0; i < existingInsertionFields.length; i++){
			existingInsertionFields[i].classList.add('hide');
		}
		inputAddGroup.classList.add('hide');
		//show append button
		appendDataButton.classList.remove('hide');
		//show corresponding field
		insertFieldGroup.classList.remove('hide');
	}
	//create <li> child with value and append to <ul>
	var liNode = document.createElement('li');
	liNode.innerHTML = inputDataValue + '<button>&ndash;</button>';
	//add elements to data list
	if(isAppended){
		dataList.appendChild(insertNode);
		dataList.appendChild(insertFieldGroup);
		dataList.appendChild(liNode);
	} else {
		dataList.insertBefore(liNode, associatedInputField.parentNode.previousSibling);
		dataList.insertBefore(insertFieldGroup, liNode);
		dataList.insertBefore(insertNode, insertFieldGroup);
	}
	//reset
	associatedInputField.value = '';
	inputAddField.focus();
	//added <li>, so hide message
	noDataNote.classList.add('hide');
	//communicate if enough data values
	if(!isEnoughData && dataList.getElementsByTagName('li').length >= 15){
		isEnoughData = true;
		unmetConditionNote.classList.add('hide');
		tabs[0].style.color = '#0676b7';
	}
	//attach removal method to button
	liNode.querySelector('button').onclick = function() {
		//remove this <li>
		dataList.removeChild(liNode);
		//remove corresponding insertion groups
		dataList.removeChild(insertNode);
		dataList.removeChild(insertFieldGroup);
		//check counts for proper message displaying
		var liCount = dataList.getElementsByTagName('li').length;
		//there is no data
		if(liCount == 0) {
			noDataNote.classList.remove('hide');
		}
		if(noVisibleInputField()) {
			//ensure data input is visible when no insertion available
			appendDataButton.classList.add('hide');
			inputAddGroup.classList.remove('hide');
		}
		//there is less than 15 data
		if(liCount < 15) {
			isEnoughData = false;
			unmetConditionNote.classList.remove('hide');
			tabs[0].style.color = '#d9364c';
		}
		//data has been edited
		graphData();
	}
	//******************************
	//insertion functionality
	insertFieldGroup.querySelector('button').addEventListener('click', function() {
		addDataValue(false, insertFieldGroup.querySelector('input'));
		graphData();
	});
	//data sanitization
	insertFieldGroup.querySelector('input').addEventListener('keypress', function(e){
		numericalInputKeypressActions(e, this);
	});
	//disable paste functionality
	insertFieldGroup.querySelector('input').addEventListener('paste', function(e){
		e.preventDefault();
	});
	//******************************
}

//attach click event to append button
appendDataButton.querySelector('button').onclick = function() {
	//show all buttons
	var existingInsertionButtons = dataList.getElementsByClassName('insert-button-group');
	for(var i = 0; i < existingInsertionButtons.length; ++i){
		existingInsertionButtons[i].classList.remove('hide');
	}
	//hide this button when field is in use
	appendDataButton.classList.add('hide');
	//hide visible fields 
	var existingInsertionFields = dataList.getElementsByClassName('insert-input-group');
	for(var i = 0; i < existingInsertionFields.length; ++i){
		existingInsertionFields[i].classList.add('hide');
	}
	//show corresponding field
	inputAddGroup.classList.remove('hide');
}

// GET csv data
var GETdata = window.location.href.match(/[?&]+data=([^&]*)/i);
if( GETdata != null ) {
	GETdata = GETdata[1].split(',');
	for( var i = 0; i < GETdata.length; ++i ) {
		inputAddField.value = GETdata[i];
		addDataValue(true, inputAddField);
	}
}

//**************--- HELPER FUNCTIONS ---**************
function noVisibleInputField() {
	var existingInsertionFields = dataList.getElementsByClassName('insert-input-group');
	for(var i = 0; i < existingInsertionFields.length; ++i){
		if(!existingInsertionFields[i].classList.contains('hide')){
			return false;
		}
	}
	if(!inputAddGroup.classList.contains('hide')){
		return false;
	}
	return true;
}