const shareLink = document.getElementById("share-link");
const shareButton = document.getElementById("share-button");

var shareURL;

tabs[2].addEventListener("click", function() {
	
	// Refresh share URL with current data entries
	shareURL = window.location.href + "?data=";
	var dataCollection = dataList.querySelectorAll('li');
	var dataCSV = "";
	for(var i = 0; i < dataCollection.length; ++i) {
		dataCSV += dataCollection[i].firstChild.textContent;
		if( i < dataCollection.length - 1) {
			dataCSV += ",";
		}
	}
	shareURL += dataCSV;
	shareLink.value = shareURL;
	
});

shareButton.addEventListener("click", function() {
	shareLink.select();
	document.execCommand("copy");
});