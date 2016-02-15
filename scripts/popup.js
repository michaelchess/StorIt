window.onload = function(){

	function onclick(source, more){
		document.getElementById("moreresults").style.display = "none";
		document.getElementById("results").innerHTML = "<img id='loading' src='load.gif'></img>";
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  			console.log(source);
  			chrome.tabs.sendMessage(tabs[0].id, {salutation: true, source: source, more: more}, function(response) {
  				console.log(response);
  			});
		});
	}

	document.getElementById("jstor").onclick = function () {
		document.getElementById("googlescholar").setAttribute("class", "select");
		document.getElementById("jstor").setAttribute("class", "select selected");
		// document.getElementById("moreresults").
		onclick("jstor");
	}

	document.getElementById("googlescholar").onclick = function () {
		document.getElementById("jstor").setAttribute("class", "select");
		document.getElementById("googlescholar").setAttribute("class", "select selected");
		onclick("googlescholar");
	}

	document.getElementById("moreresults").onclick = function () {
		if(document.getElementById("jstor").getAttribute("class") == "select selected"){
			onclick("jstor", true);
		} else {
			onclick("googlescholar", true);
		}
	}

	chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
		if (request.results) {
			sendResponse({success: true});
			var resultsElement = document.getElementById("results");
			resultsElement.innerHTML = "";
			
			for (var i = 0; i < request.results.length; i++) {
				var div = document.createElement("div");
				div.setAttribute("class", "result");
				div.innerHTML = request.results[i]["html"];
				resultsElement.appendChild(div);
			}
			console.log("Success from Popup");
			document.getElementById("moreresults").style.display = "inline";
		}
	});
}