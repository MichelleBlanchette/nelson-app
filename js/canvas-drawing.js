var canvas = document.getElementById("control-chart");
//var ctx = canvas.getContext("2d");
var cw, ch;
var transformedData, data, transformedGuides, guides, xDist, xbar, sigma;
var falseErrors;

window.onresize = function() {
	//Hide after resizing because dimensions will be incorrect
	canvas.classList.add('hide');
	//TODO--Notify resizing occurred and to click here to reload control chart
}

//Attach main function to execute button...
inputAddButton.addEventListener('click', graphData);
function graphData(){

	var dataLiNodes = dataList.querySelectorAll('li');
	
	/////////////////////////////
	if(dataLiNodes.length < 15){
		//ensure graph is clear--not enough data for output
		clearOutput();
		return;
	}////////////////////////////
	
	cw = canvas.getBoundingClientRect().width;
	//subtract added padding from height...
	ch = canvas.getBoundingClientRect().height - 300;

	//It's about to go down. Prepare yo'self!
	var error = false;

	//Collect data input...
	var data = new Array(dataLiNodes.length);

	//Parse data to integer values...
	for(var i = 0; i < data.length; i++){
		data[i] = parseFloat(dataLiNodes[i].firstChild.textContent);
	}

	//Calculate Mean...
	var sum = 0;
	for(var i = 0; i < data.length; i++){
		sum += data[i];
	}
	if(isNaN(sum)){
		alert("An error occurred during data collection.");
		error = true;
	} else {
		xbar = sum/data.length;
	}

	//Calculate Sigma
	if(!error){
		
		sigma = 0;
		
		for(var i = 0; i < data.length; i++){
			var temp = data[i] - xbar;
			sigma += temp*temp;
		}
		
		sigma /= data.length-1;
		
//		if(document.getElementsByName('dataType')[0].checked){
//			//First radio option is for Sample
//			sigma /= data.length-1;
//		} else {
//			//Only other option is for Population
//			sigma /= data.length;
//		}
		
		sigma = Math.sqrt(sigma);
		
		if(isNaN(sigma)){
			alert("Sigma could not be calculated.");
			error = true;
		}
	}
	
	if(!error){
		//No error making core calculations, so...
		//Store Guide Calculations
		guides = [3*sigma+xbar,
					2*sigma+xbar,
					sigma+xbar,
					xbar,
					xbar-sigma,
					xbar-2*sigma,
					xbar-3*sigma];

		//Output Guide Calculations
//		for(var i = 0; i < calcOutputs.length; i++){
//			calcOutputs[i].innerHTML = Math.round(guides[i] * 100000) / 100000;
//		}
	}

	/////////////////////////////////
	//Transforming and Graphing Data
	if(!error){
		
		//Ensure graph is clear...
		clearOutput();
		
		//Find farthest distance for scale factor...
		var maxDist = 3*sigma;
		var dist, maxDist_Index;
		for(var i = 0; i < data.length; i++){
			dist = (data[i] > xbar) ? (data[i] - xbar) : (xbar - data[i]);
			if(dist > maxDist){
				//found point farther, so save it for Scale Factor
				maxDist_Index = i;
				maxDist = dist;
			}
		}
		
		//Calculate scale factor...
		//maxDist is half of the graph height since xbar is centered and it is the max distance from xbar
		var scaleFactor = ch / (maxDist*2);
		
		//Apply scaling to data...
		transformedData = new Array(data.length);
		for(var i = 0; i < transformedData.length; i++){
			transformedData[i] = data[i] * scaleFactor;
		}
		
		//Apply scaling to guides...
		transformedGuides = new Array(7);
		for(var i = 0; i < transformedGuides.length; i++){
			transformedGuides[i] = guides[i] * scaleFactor;
		}
		
		//Translate to center xbar guide...
		var offset = transformedGuides[3] - 0.5*ch;
		//Translate data...
		for(var i = 0; i < transformedData.length; i++){
			transformedData[i] = transformedData[i] - offset;
		}
		
		//Translate guides...
		for(var i = 0; i < transformedGuides.length; i++){
			transformedGuides[i] = transformedGuides[i] - offset;
		}
		
		//Reflect data over xbar...
		for(var i = 0; i < transformedData.length; i++){
			transformedData[i] = 2*transformedGuides[3] - transformedData[i];
		}
		//Reflect guides over xbar...
		for(var i = 0; i < transformedGuides.length; i++){
			transformedGuides[i] = 2*transformedGuides[3] - transformedGuides[i];
		}

		//////////////////////////////////////////////////////////////
		// BEGIN GRAPHING ////////////////////////////////////////////
		//Graph guides...
		for(var i = 0; i < transformedGuides.length; i++){
			var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			var styleStr = 'stroke-width:4;';
			//stroke color
			if(i == 3){
				styleStr += 'stroke:#152335;';
			} else {
				styleStr += 'stroke:#d6d7da;';
			}
			//stroke dash style
			if(i == 1 || i == 5){
				//2sigma guides
				styleStr += 'stroke-dasharray:40,20;';
			} else if(i == 2 || i == 4){
				//1sigma guides
				styleStr += 'stroke-dasharray:10,15;';
			}
			newLine.setAttribute('x1', 0);
			newLine.setAttribute('y1', transformedGuides[i]);
			newLine.setAttribute('x2', cw);
			newLine.setAttribute('y2', transformedGuides[i]);
			newLine.setAttribute('style', styleStr);
			canvas.getElementById('chart-guides').appendChild(newLine);
		}
		
		//Graph data...
		xDist = (cw - 200)/(transformedData.length-1);
		var newPoly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
		//gather path coordinates...
		var coordsStr = '';
		for(var i = 0; i < transformedData.length; i++){
			coordsStr += ((i * xDist) + 100) + ',' + transformedData[i] + ' ';
		}
		newPoly.setAttribute('points', coordsStr);
		newPoly.setAttribute('style', 'stroke:#0676b7;stroke-width:7;fill:none;');
		canvas.getElementById('chart-line').appendChild(newPoly);

		//Graph regular (no error) nodes on top of stroked path...
		falseErrors = newBooleanArray(data.length);
		graphNodes(falseErrors);
		
		//Output guide labels alongside respective guideline
		var guideOutput = document.getElementById('guide-labels');
		var guideOutputWidth = guideOutput.getBoundingClientRect().width;
		for(var i = 0; i < transformedGuides.length; i++){
			var newText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			var styleStr = 'color:#071422;alignment-baseline:middle;text-anchor:middle;';
			//font weight
			if(i == 3){
				styleStr += 'font-weight:900;';
			} else {
				styleStr += 'font-weight:700;';
			}
			newText.setAttribute('x', guideOutputWidth / 2);
			newText.setAttribute('y', transformedGuides[i]);
			newText.setAttribute('style', styleStr);
			newText.appendChild(document.createTextNode(Math.round(guides[i] * 10000) / 10000));
			guideOutput.appendChild(newText);
		}
		
		//Data is ready for Nelson Rule Verification
		verifyNelsonRules(data);
	
	}

	//Display canvas upon successful completion...
	if(!error){
		canvas.classList.remove('hide');
	} else {
		canvas.classList.add('hide');
		alert('An error has occurred. The control chart remains hidden.');
	}
	
}

function graphNodes(errorAt){
	//clear previous nodes
	canvas.getElementById('chart-nodes').innerHTML = '';
	//create nodes
	for(var i = 0; i < transformedData.length; i++){
		var newCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		if(errorAt[i]){
			newCircle.classList.add('error');
			var newPulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
			newPulse.classList.add('pulse');
			newPulse.setAttribute('cx', (i * xDist) + 100);
			newPulse.setAttribute('cy', transformedData[i]);
			newPulse.setAttribute('r', 12);
			canvas.getElementById('chart-nodes').appendChild(newPulse);
		}
		newCircle.setAttribute('cx', (i * xDist) + 100);
		newCircle.setAttribute('cy', transformedData[i]);
		newCircle.setAttribute('r', 12);
		canvas.getElementById('chart-nodes').appendChild(newCircle);
	}
}

function newBooleanArray(length){
	var arr = new Array(length);
	for(var i = 0; i < arr.length; i++){
		arr[i] = false;
	}
	return arr;
}

function clearOutput(){
	document.getElementById('chart-guides').innerHTML = '';
	document.getElementById('chart-line').innerHTML = '';
	document.getElementById('chart-nodes').innerHTML = '';
	document.getElementById('guide-labels').innerHTML = '';
	//CLEAR NELSON RULE OUTPUT DATA
}