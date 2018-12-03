var errorAt, ruleErrors, failedRule, failedRuleCount;

function verifyNelsonRules(data){

	failedRuleCount = 0;
	failedRule = false;
	ruleErrors = [];
	errorAt = new Array(data.length);
	resetBooleanArray(errorAt);
	
	var sig3 = guides[0],
		sig2 = guides[1],
		sig1 = guides[2],
		//xbar is at [3] but is already available
		nsig1 = guides[4],
		nsig2 = guides[5],
		nsig3 = guides[6];
	
	/////////////////////
	//Global Hover Resets
//	for(var i = 0; i < RuleHeader.length; i++){
//		RuleHeader[i].onmouseout = function(){
//			graphNodes(falseErrors);
//		}
//	}
	
	/////////////////////////////////////////////////////////////////////
	//RULE 1: One point is more than 3 standard deviations from the mean.
	for(var i = 0; i < data.length; i++){
		if(data[i] > sig3 || data[i] < nsig3){
			//data point is beyond sigma
			//mark node as error
			errorAt[i] = true;
			failedRule = true;
		}
	}
	
	//Rule 1 END.
	endRule(1);
	
	
	//////////////////////////////////////////////////////////////////////////
	//RULE 2: Nine (or more) points in a row are on the same side of the mean.
	var startIndex = 0;

	while(startIndex + 9 <= data.length){

		var sameSideCount = 0;

		if(data[startIndex] > xbar){
			//nodes above xbar
			for(var i = startIndex; i < data.length && data[i] > xbar; i++){
				sameSideCount++;
			}
		} else if(data[startIndex] < xbar){
			//nodes below xbar
			for(var i = startIndex; i < data.length && data[i] < xbar; i++){
				sameSideCount++;
			}
		} else {
			//node equals xbar, so just move on
			startIndex++;
		}

		//Mark error nodes if they fail the rule
		if(sameSideCount >= 9){
			for(var i = startIndex; i < startIndex + sameSideCount; i++){
				errorAt[i] = true;
				failedRule = true;
			}
		}

		//continue reading from unread nodes
		startIndex += sameSideCount;

	}
	
	//Rule 2 END.
	endRule(2);
	
	
	//////////////////////////////////////////////////////////////////////////
	//RULE 3: Six (or more) points in a row are continually increasing (or decreasing).
	var startIndex = 0;

	while(startIndex + 6 <= data.length){

		var sameDirectionCount = 0;

		if(data[startIndex+1] > data[startIndex]){
			//nodes are increasing
			for(var i = startIndex; i+1 < data.length && data[i+1] > data[i]; i++){
				sameDirectionCount++;
			}

		} else if(data[startIndex+1] < data[startIndex]){
			//nodes are decreasing
			for(var i = startIndex; i+1 < data.length && data[i+1] < data[i]; i++){
				sameDirectionCount++;
			}

		} else {
			//node equals xbar, so just move on
			startIndex++;
		}

		//Mark error nodes if they fail the rule
		if(sameDirectionCount >= 5){
			//5 comparisons for 6 nodes
			for(var i = startIndex; i < startIndex + sameDirectionCount + 1; i++){
				console.log("Rule 3 Marked Error: " + i);
				errorAt[i] = true;
				failedRule = true;
			}
		}

		//continue reading from unread nodes
		startIndex += sameDirectionCount;

	}
	
	//Rule 3 END.
	endRule(3);
	
	
	//////////////////////////////////////////////////////////////////////////
	//RULE 4: Fourteen (or more) points in a row alternate in direction (oscillate).
	var startIndex = 0;

	while(startIndex + 14 <= data.length){

		var oscillationCount = 0,
			inc = false;

		if(data[startIndex+1] > data[startIndex]){
			//nodes begin increasing
			inc = false;
		} else if(data[startIndex+1] < data[startIndex]){
			//nodes begin decreasing
			inc = true;
		}

		for(var i = startIndex; i+1 < data.length; i++){	
			if(inc && data[i+1] < data[i]){
				//were increasing, now decreasing, so oscillation has occured
				oscillationCount++;
				inc = false;
			} else if(!inc && data[i+1] > data[i]){
				//were decreasing, now increasing, so oscillation has occured
				oscillationCount++;
				inc = true;
			} else {
				//oscillation has ended
				break;
			}
		}

		//Mark error nodes if they fail the rule
		if(oscillationCount >= 13){
			//13 comparisons give 14 points
			for(var i = startIndex; i < startIndex + oscillationCount + 1; i++){
				errorAt[i] = true;
				failedRule = true;
			}
		}

		//continue reading from unread nodes
		startIndex++;

	}
	
	//Rule 4 END.
	endRule(4);
	
	
	//////////////////////////////////////////////////////////////////////////
	//RULE 5: Two (or three) out of three points in a row are more than 2 standard deviations from the mean in the same direction.
	var startIndex = 0;

	while(startIndex + 3 <= data.length){

		var sameDirectionCount = 0;

		if(data[startIndex] >= sig2){
			//nodes are above bounds
			for(var i = startIndex; i < data.length && i < startIndex + 3 && data[i] >= sig2; i++){
				sameDirectionCount++;
			}
		} else if(data[startIndex] <= nsig2){
			//nodes are below bounds
			for(var i = startIndex; i < data.length && i < startIndex + 3 && data[i] <= nsig2; i++){
				sameDirectionCount++;
			}
		}

		//Mark error nodes if they fail the rule
		if(sameDirectionCount >= 2){
			for(var i = startIndex; i < startIndex + sameDirectionCount; i++){
				errorAt[i] = true;
				failedRule = true;
			}
		}

		//continue reading from unread nodes
		startIndex++;

	}
	
	//Rule 5 END.
	endRule(5);
	
	
	//////////////////////////////////////////////////////////////////////////
	//RULE 6: Four (or five) out of five points in a row are more than 1 standard deviation from the mean in the same direction.
	var startIndex = 0;

	while(startIndex + 5 <= data.length){

		var sameDirectionCount = 0;

		if(data[startIndex] >= sig1){
			//nodes are above bounds
			for(var i = startIndex; i < data.length && i < startIndex + 5 && data[i] >= sig1; i++){
				sameDirectionCount++;
			}
		} else if(data[startIndex] <= nsig1){
			//nodes are below bounds
			for(var i = startIndex; i < data.length && i < startIndex + 5 && data[i] <= nsig1; i++){
				sameDirectionCount++;
			}
		}

		//Mark error nodes if they fail the rule
		if(sameDirectionCount >= 4){
			for(var i = startIndex; i < startIndex + sameDirectionCount; i++){
				errorAt[i] = true;
				failedRule = true;
			}
		}

		//continue reading from unread nodes
		startIndex++;

	}
	
	//Rule 6 END.
	endRule(6);
	
	
	//////////////////////////////////////////////////////////////////////////
	//RULE 7: Fifteen points in a row are all within 1 standard deviation of the mean on either side of the mean.
	var startIndex = 0;
	while(startIndex + 15 <= data.length){

		var count = 0;

		if(data[startIndex] <= sig1 && data[startIndex] >= nsig1){
			//node is within bounds
			for(var i = startIndex; i < data.length && data[i] < sig1 && data[i] > nsig1; i++){
				//node is within bounds
				count++;
			}
			if(count >= 15){
				//mark error nodes
				for(var i = startIndex; i < startIndex + count; i++){
					errorAt[i] = true;
					failedRule = true;
				}
			}
			//continue reading from unread nodes
			startIndex += count;
		} else {
			//not within bounds, so move on
			startIndex++;
		}

	}
	
	//Rule 7 END.
	endRule(7);
	
	
	//////////////////////////////////////////////////////////////////////////
	//RULE 8: Eight points in a row exist, but none within 1 standard deviation of the mean, and the points are in both directions from the mean.
	var startIndex = 0;

	while(startIndex + 8 <= data.length){

		var count = 0,
			above = false,
			below = false;

		if(data[startIndex] >= sig1 || data[startIndex] <= nsig1){
			//nodes are out of bounds
			for(var i = startIndex; i < data.length && i < startIndex + 8 && (data[i] >= sig1 || data[i] <= nsig1); i++){
				if(data[i] >= sig1){ above = true; }
				else if(data[i] <= nsig1){ below = true; }
				count++;
			}
		}

		//Mark error nodes if they fail the rule
		if(count >= 8 && above && below){
			for(var i = startIndex; i < startIndex + count; i++){
				errorAt[i] = true;
				failedRule = true;
			}
		}

		//continue reading from unread nodes
		startIndex++;

	}
	
	//Rule 8 END.
	endRule(8);
	
}


////////////////////////////////////////////////////
//-------HELPER FUNCTIONS--------------------------

function endRule(number){
	var index = number - 1;
	if(failedRule){
		ruleErrors.push(errorAt.slice());
		displayFail(index);
		++failedRuleCount;
	} else {
		//still need to push errors for index purposes and logging
		ruleErrors.push(errorAt.slice());
		displayPass(index);
	}
	//reset flags
	resetBooleanArray(errorAt);
	failedRule = false;
}

function resetBooleanArray(arr){
	for(var i = 0; i < arr.length; i++){
		arr[i] = false;
	}
}

function displayFail(index){
//	console.log("Rule " + (index+1) + " failed.");
	//show problematic nodes on select
//	RuleVisibilityIcon[index].addEventListener('click', function(){
//		graphNodes(ruleErrors[index]);
//	});
	//output rule failure
	RuleStatus[index].style.color = "#d9364c";
	RuleStatus[index].innerHTML = "Fail";
	//on error, show error feedback
	RuleErrorFeedback[index].classList.remove('hide');
}

function displayPass(index){
	//show normal nodes on select
//	RuleVisibilityIcon[index].addEventListener('click', function(){
//		graphNodes(ruleErrors[index]);
//	});
	//output rule success/pass
	RuleStatus[index].style.color = "#01b4c9";
	RuleStatus[index].innerHTML = "Pass";
	//on pass, hide error feedback
	RuleErrorFeedback[index].classList.add('hide');
}