function contentFunction(){
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendRequest) {
			console.log(request);
			if(request.salutation){
				chrome.runtime.sendMessage({DOM: document.documentElement.innerHTML, source: request.source, more: request.more}, function(response) {
					if(response.success == true){
						console.log("Success from Content");
						sendResponse({success: true, results: response.results});
					}
				});
			}
		});
}

contentFunction();