chrome.runtime.sendMessage({DOM: document.documentElement.innerHTML}, function(response) {
	if(response.success == true){
		console.log("Success");
	}
});
