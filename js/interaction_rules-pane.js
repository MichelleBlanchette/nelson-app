var RuleHeader = document.querySelectorAll("#rules-pane h1"),
RuleVisibilityIcon = document.querySelectorAll("#rules-pane h1 i.material-icons"),
RuleStatus = document.querySelectorAll("#rules-pane h1 span.rule-status"),
RuleDropArrow = document.querySelectorAll("#rules-pane h1 span.drop-arrow"),
RuleDropContent = document.querySelectorAll("#rules-pane div.drop-content"),
RuleErrorFeedback = document.querySelectorAll("#rules-pane div.drop-content p.note.error.hide"),
RuleErrorList = document.querySelectorAll("#rules-pane div.drop-content ul.error-data");

/*************************************************************/

for(var i = 0; i < RuleHeader.length; ++i){
	//dropdown functionality
	RuleHeader[i].addEventListener('click',
		(function(index) {
			return function() {
				toggleDropdown(index);
			}
		})(i)
	);
	
	//visibility icon style toggling
	RuleVisibilityIcon[i].addEventListener('click',
		(function(index) {
			return function(event) {
				event.stopPropagation();
				if(isEnoughData){
					if(this.classList.contains('active')){
						//already active, so now toggles to become inactive
						this.classList.replace('active', 'inactive');
						this.innerHTML = 'visibility_off';
						//exclusive viewing, so none to be viewed if the active one is toggled off
						graphNodes(falseErrors);
					} else {
						//active so show corresponding error data
						graphNodes(ruleErrors[index]);
						//is inactive, so becomes the only one active
						for(var j = 0; j < RuleVisibilityIcon.length; ++j){
							RuleVisibilityIcon[j].classList.replace('active', 'inactive');
							RuleVisibilityIcon[j].innerHTML = 'visibility_off';
						}
						this.classList.replace('inactive', 'active');
						this.innerHTML = 'visibility';
					}
				}
			}
		})(i)
	);
	
}

// Description dropdown functionality
function toggleDropdown(index) {
	RuleDropContent[index].classList.toggle('hide');
	RuleDropArrow[index].classList.toggle('closed');
}

function resetAllRuleOutputs() {
	for(var i = 0; i < RuleStatus.length; ++i) {
		displayReset(i);
	}
	// re-initialize rules pane tab color
	tabs[1].style.color = '#0676b7';
}