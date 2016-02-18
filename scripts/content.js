function contentFunction(){
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendRequest) {
			console.log(request);
			if(request.salutation){
				var location = document.location;
				var uri = {
				  spec: location.href,
				  host: location.host,
				  prePath: location.protocol + "//" + location.host,
				  scheme: location.protocol.substr(0, location.protocol.indexOf(":")),
				  pathBase: location.protocol + "//" + location.host + location.pathname.substr(0, location.pathname.lastIndexOf("/") + 1)
				};
				chrome.runtime.sendMessage({DOM: document.documentElement.innerHTML, source: request.source, more: request.more, uri: uri, isWiki: (window.location.href.indexOf("wikipedia") > -1 ? true : false)}, function(response) {
					if(response.success == true){
						console.log("Success from Content");
						console.log(response.url);
						sendResponse({success: true, results: response.results, url: response.url});
					}
				});
			}
		});
}

contentFunction();