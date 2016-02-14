chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.DOM) {
    	var HTMLString = request.getHTML;
    	var doctype = document.implementation.createDocumentType( 'html', '', '');
		var dom = document.implementation.createDocument('', 'html', doctype);
		dom.documentElement.innerHTML = HTMLString;

		var query = dom.title;

		// $.ajax({
  //           type: "GET", //or GET
  //           url: "http://www.jstor.org/action/doBasicSearch?Query="+query+"&acc=on&wc=on&fc=off&group=none",
  //           success: function(data){
  //           	console.log(data);
		// 	},
		// 	error: function(jxhr){
		// 	   console.log(jxhr.responseText);
		// 	}
  //       });
    }
});

$.ajax({
    type: "GET", //or GET
    url: "http://www.jstor.org/action/doBasicSearch?Query="+"query"+"&acc=on&wc=on&fc=off&group=none",
    success: function(data){
    	console.log(data);
	},
	error: function(jxhr){
		console.log(jxhr.responseText);
	}
});

console.log("popup")