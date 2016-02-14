var buildQuery = function(queryString) {
	var splitString = queryString.split(" ");
	var query = "";
	for (var i = 0; i < splitString.length; i++) {
		if (i < splitString.length-1)
			seperator = "+";
		else
			seperator = "";

		query+=(splitString[i]+seperator);
	};
	return query;
};

var parseNouns = function(string) {
	var cap = 4;
	var init = 0;
	var nouns = ""; 
	var unTaggedWords = new Lexer().lex(string);
	var taggedWords = new POSTagger().tag(unTaggedWords);
	var badWords = ["|"];

	for (var i = 0; i < taggedWords.length; i++) {
		var word = taggedWords[i];
		console.log(word)
		//["DT", "EX", "VBP", ":", ",", "TO", "WP"]

		if (word[1].slice(0,2) == "NN" && badWords.indexOf(word[0]) == -1) {
			init++;
			nouns += word[0];
			if (init == cap) break;
			if (i < taggedWords.length-1) nouns+=" ";
		}
	}

	return (nouns.length > 0) ? nouns : null;
};

var getJstorResults = function(DOM) {
	console.log(DOM);
	var document = $(DOM);
	var resultRows = document.find(".row.result-item");
	var slicedResultsRows = resultRows.slice(0,3);

	var results = [];

	for (var i = 0; i < slicedResultsRows.length; i++) {
		var result = {};
		var snippet = $(slicedResultsRows[i]).find(".snippetText, .snippets.mlm");
		snippet.remove();
		var list = $(slicedResultsRows[i]).find(".format.inline-list");
		list.remove();
		var hidden = $(slicedResultsRows[i]).find(".visuallyhidden");
		hidden.remove();
		var inputs = $(slicedResultsRows[i]).find("input");
		inputs.remove();
		var imgs = $(slicedResultsRows[i]).find("img");
		imgs.remove();

		// replace relative links
		var links = $(slicedResultsRows[i]).find("a");
		for (var x = 0; x < links.length; x++) {
			var newLink = "http://www.jstor.org"+$(links[x]).attr("href");
			$(links[x]).attr("href", newLink);
			$(links[x]).attr("target", "_blank");
		}

		result["html"] = $(slicedResultsRows[i]).html();
		results.push(result);
	}
	
	return results;
};

var getGoogleScholarResults = function(DOM){
	console.log(DOM);
	var document = $(DOM);
	var resultRows = document.find(".gs_r");
	var slicedResultsRows = resultRows.slice(0, 3);

	var results = [];

	for(var i = 0; i < slicedResultsRows.length; i++){
		var result = {};
		var snippet = $(slicedResultsRows[i]).find(".gs_rs");
		snippet.remove();
		var auxLinks= $(slicedResultsRows[i]).find(".gs_fl");
		auxLinks.remove();

		result["html"] = $(slicedResultsRows[i]).html();
		results.push(result);
	}
	return results;
}



chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.DOM) {
		var HTMLString = request.DOM;
		var dom = document.implementation.createHTMLDocument('newDOM');
		dom.documentElement.innerHTML = HTMLString;

		var title = dom.title;
		var parsedTitle = parseNouns(title);
		var query = buildQuery(parsedTitle);
		if(request.source == "jstor"){
			var url = "http://www.jstor.org/action/doBasicSearch?Query="+query+"&acc=on&wc=on&fc=off&group=none";
		} else if(request.source == "googlescholar"){
			var url = "https://scholar.google.com/scholar?hl=en&q="+query+"&btnG=&as_sdt=1%2C33&as_sdtp="
		} else {
			var url = "http://www.jstor.org/action/doBasicSearch?Query="+query+"&acc=on&wc=on&fc=off&group=none";
		}
		console.log(query);
		$.ajax({
            type: "GET", //or GET
            url: url,
            success: function(data){
            	// console.log(data);
            	var container = document.createElement("div");
            	container.innerHTML = data;

				if(request.source == "jstor"){
					var results = getJstorResults(container);
				} else if(request.source == "googlescholar"){
					var results = getGoogleScholarResults(container);
				} else {
					var results = getJstorResults(container);
				}
				console.log(results);
				chrome.runtime.sendMessage({results: results}, function(response){
					if (response.success) {
						console.log("SUCCESS");
					}
				});
			},
			error: function(jxhr){
				console.log(jxhr.responseText);
				sendResponse({success: false});
			}
        });
    }
});
