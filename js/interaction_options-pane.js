const shareLink = document.getElementById("share-link");
const shareButton = document.getElementById("share-button");

var shareURL;

tabs[2].addEventListener("click", function() {
	
	// Refresh share URL with current data entries
	var URL = window.location.href.replace(/\?+.*/i, '');
	// "data" key is assumed to be first and only GET param key
	shareURL = URL + "?data=";
	var dataCollection = dataList.querySelectorAll('li');
	var dataCSV = "";
	for(var i = 0; i < dataCollection.length; ++i) {
		dataCSV += dataCollection[i].firstChild.textContent + ",";
	}
	dataCSV = dataCSV.slice(0, -1);
	shareURL += dataCSV;
	shareLink.value = shareURL;
	
});

shareButton.addEventListener("click", function() {
	shareLink.select();
	document.execCommand("copy");
});