function contentFunction(){
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendRequest) {
			console.log(request);
			if(request.salutation){
				chrome.runtime.sendMessage({DOM: document.documentElement.innerHTML, source: request.source, more: request.more, isWiki: (window.location.href.indexOf("wikipedia") > -1 ? true : false)}, function(response) {
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