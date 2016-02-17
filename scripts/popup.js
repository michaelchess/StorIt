window.onload = function(){

	function onclick(source, more){
		document.getElementById("moreresults").innerHTML = "More...";
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
		document.getElementById("moreresults").innerHTML = "More...";
		onclick("jstor");
	}

	document.getElementById("googlescholar").onclick = function () {
		document.getElementById("jstor").setAttribute("class", "select");
		document.getElementById("googlescholar").setAttribute("class", "select selected");
		onclick("googlescholar");
	}

	document.getElementById("moreresults").onclick = function () {
		if(document.getElementById("moreresults").innerHTML == "Less..."){
			document.getElementById("moreresults").innerHTML = "More...";
			var more = false;
		} else {
			document.getElementById("moreresults").innerHTML = "Less...";
			var more = true;
		}
		if(document.getElementById("jstor").getAttribute("class") == "select selected"){
			onclick("jstor", more);
		} else {
			onclick("googlescholar", more);
		}
	}

	chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
		if (request.results) {
			
			sendResponse({success: true});
			var resultsElement = document.getElementById("results");
			resultsElement.innerHTML = "";
			console.log(request);
			// if(typeof request.url != "undefined"){
			// 	console.log(request.url);
			// 	var url = document.createElement("div");
			// 	url.setAttribute("class", "select");
			// 	url.innerHTML = "<a href=\""+request.url+"\" target=\"_blank\">Source Page:</a>";
			// 	resultsElement.appendChild(url);
			// }

			for (var i = 0; i < request.results.length; i++) {
				var div = document.createElement("div");
				div.setAttribute("class", "result");
				div.innerHTML = request.results[i]["html"];
				resultsElement.appendChild(div);
			}
			console.log("Success from Popup");
			console.log(request.empty)
			if (request.empty) {
				document.getElementById("moreresults").style.display = "none"; console.log("jared");
			} else {
				document.getElementById("moreresults").style.display = "inline";				
			}
		}
	});
}