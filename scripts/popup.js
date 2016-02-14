document.onLoad(){
	document.getElementById("SendDOM").onclick = function () {
		chrome.runtime.sendMessage({salutation: "Good day"}, function(response) {
			if(response.success == true){
				console.log("Success from Popup");
			}
		});
	}
}