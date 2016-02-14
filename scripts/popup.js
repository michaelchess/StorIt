document.onLoad = function(){
	document.getElementById("SendDOM").onclick = function () {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  			chrome.tabs.sendMessage(tabs[0].id, {salutation: true}, function(response) {
  				console.log(response);
  				if(response.success){
					console.log("Success from Popup");
				}
  			});
		});
	}
}