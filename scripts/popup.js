window.onload = function(){

	document.getElementById("SendDOM").onclick = function () {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  			chrome.tabs.sendMessage(tabs[0].id, {salutation: true}, function(response) {
  				console.log(response);
  			});
		});
	}
	chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
		if (request.results) {
			for (var i = 0; i < request.results.length; i++) {
				var resultsElement = document.getElementById("results");
				var div = document.createElement("div");
				div.setAttribute("class", "result");
				div.innerHTML = request.results[i]["html"];
				resultsElement.appendChild(div);
			}
			console.log("Success from Popup");
		}
	});
}