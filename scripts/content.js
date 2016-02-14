function contentFunction(){
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendRequest) {
			console.log(request);
			if(request.salutation){
				chrome.runtime.sendMessage({DOM: document.documentElement.innerHTML}, function(response) {
					if(response.success == true){
						console.log("Success from Content");
						sendResponse({success: true});
					}
				});
			}
		});
}

contentFunction();