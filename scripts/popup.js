window.onload = function(){

	function onclick(source){
		document.getElementById("results").innerHTML = "";
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  			console.log(source);
  			chrome.tabs.sendMessage(tabs[0].id, {salutation: true, source: source}, function(response) {
  				console.log(response);
  			});
		});
	}

	document.getElementById("jstor").onclick = function () {
		onclick("jstor");
	}

	document.getElementById("googlescholar").onclick = function () {
		onclick("googlescholar");
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