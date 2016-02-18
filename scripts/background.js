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

var removeSubstring = function(string, substring) {
	var string = string.substr(0, string.indexOf(substring)) + string.substr(string.indexOf(substring)+substring.length); 
	return string;
} 

var sanitizeString = function(string, isWiki) {
	console.log(isWiki)
	var sanitizedString = string.replace(/['"]+/g, '');
	if (isWiki) {
		var lowerSanitizedString = sanitizedString.toLowerCase();
		if (lowerSanitizedString.indexOf("wikipedia") > -1) {
			sanitizedString = removeSubstring(lowerSanitizedString, "wikipedia");

			if (sanitizedString.indexOf("encyclopedia") > -1) {
				sanitizedString = removeSubstring(sanitizedString, "encyclopedia");
			} 
		}
	}
	console.log(sanitizedString);
	return sanitizedString;
}

var parseNouns = function(string) {
	var cap = 4;
	var init = 0;
	var nouns = ""; 
	var unTaggedWords = new Lexer().lex(string);
	var taggedWords = new POSTagger().tag(unTaggedWords);
	var badWords = ["|", ":"];

	for (var i = 0; i < taggedWords.length; i++) {
		var word = taggedWords[i];
		console.log(word)
		//["DT", "EX", "VBP", ":", ",", "TO", "WP"]

		if ((word[1].slice(0,2) == "NN" || word[1] == "VBG") && badWords.indexOf(word[0]) == -1) {
			init++;
			nouns += word[0];
			if (init == cap) break;
			if (i < taggedWords.length-1) nouns+=" ";
		}
	}

	return (nouns.length > 0) ? nouns : null;
};

var parseCommonNouns = function(string){
	var cap = 4;
	var init = 0;
	var nouns = {};
	var topFour = ["", "", "", ""];
	nouns[""] = -1;
	var unTaggedWords = new Lexer().lex(string);
	var taggedWords = new POSTagger().tag(unTaggedWords);
	var badWords = ["|", ":", "I", "-"];

	for(var i = 0; i < taggedWords.length; i++){
		var word = taggedWords[i];
		if(word[0].length == 1){
			continue;
		}

		if((word[1].slice(0,2) == "NN" || word[1] == "VBG") && badWords.indexOf(word[0]) == -1){
			// console.log(word[0]);
			if(!(word[0] in nouns)){
				// var w = word[0];
				// nouns.push({w: 1});
				nouns[word[0]] = 1;
			} else {
				nouns[word[0]] += 1;
			}
			placeInTopFour(nouns, topFour, word[0], nouns[word[0]]);
		}
	}
	console.log(topFour);
	var returns = topFour[3]+" "+topFour[2]+" "+topFour[1]+" "+topFour[0];
	return (returns.length > 0) ? returns : null;
}

var placeInTopFour = function(nouns, topFour, key, value){
	// console.log(key);
	// var pos = topFour.indexOf(word[0]);
	// if(pos > -1){
	// 	console.log("AlreadyThere");
	// 	while(pos < topFour.length-1){
	// 		if(topFour[pos+1] > topFour[pos]){
	// 			var holder = topFour[pos+1];
	// 			topFour[pos+1] = topFour[pos];
	// 			topFour[pos] = holder;
	// 		}
	// 		pos++;
	// 	}
	// } else {
	var found = false;
	for(var i = 0; i < topFour.length; i++){
		if(topFour[i] == key){
			found = true;
			var pos = i;
			while(pos < topFour.length-1){
				if(topFour[pos+1] > topFour[pos]){
					var holder = topFour[pos+1];
					topFour[pos+1] = topFour[pos];
					topFour[pos] = holder;
				}
				pos++;
			}
			break;
		}
	}
	if(found == false){
		for(var i = 0; i < topFour.length; i++){
			// console.log(value);
			// console.log(nouns[topFour[i]]);
			if(value > nouns[topFour[i]]){
				// console.log(value);
				if(i == 0){
					topFour[i] = key;
				} else {
					topFour[i-1] = topFour[i];
					topFour[i] = key;
				}
			} else {
				break;
			}
		}
	}
	// }
}

var getJstorResults = function(DOM, more) {
	console.log(DOM);
	var document = $(DOM);
	var resultRows = document.find(".row.result-item");
	if(more){
		var slicedResultsRows = resultRows;
	} else {
		var slicedResultsRows = resultRows.slice(0, 3);
	}

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

var getGoogleScholarResults = function(DOM, more){
	console.log(DOM);
	var document = $(DOM);
	var resultRows = document.find(".gs_r");
	if(more){
		var slicedResultsRows = resultRows;
	} else {
		var slicedResultsRows = resultRows.slice(0, 3);
	}

	var results = [];

	for(var i = 0; i < slicedResultsRows.length; i++){
		var result = {};
		var snippet = $(slicedResultsRows[i]).find(".gs_rs");
		snippet.remove();
		var auxLinks= $(slicedResultsRows[i]).find(".gs_fl");
		auxLinks.remove();

		var links = $(slicedResultsRows[i]).find("a");
		for(var x = 0; x < links.length; x++){
			var currentHref = $(links[x]).attr("href");
			if (currentHref.charAt(0) === "/") {
				var newLink = "https://scholar.google.com"+$(links[x]).attr("href");
				$(links[x]).attr("href", newLink);
				
			}
			$(links[x]).attr("target", "_blank");	
			
		}

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

		var article = new Readability(request.uri, dom).parse();
		var content = document.createElement("div");
		content.innerHTML = article.content;
		console.log(parseCommonNouns(sanitizeString(content.innerText, request.isWiki)));

		try {
			var string;
			var title = article.title || dom.title;
			console.log("TITLE:",title);
			if (article.title.split(" ").length <= 12) {
				string = content.innerText;
			} else {
				string = title;
			}

			var sanitizedString = sanitizeString(string, request.isWiki);
			var parsedString = parseCommonNouns(sanitizedString);
			var query = buildQuery(parsedString);	
		} catch (e) {
			console.log("ERROR ERROR ERROR");
			console.log(e);
			var query = "";
		}
		
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
            	var container = document.createElement("div");
				var empty = false;

            	container.innerHTML = data;
				if(request.source == "jstor"){
					var results = getJstorResults(container, request.more);
				} else if(request.source == "googlescholar"){
					var results = getGoogleScholarResults(container, request.more);
				} else {
					var results = getJstorResults(container, request.more);
				}

				console.log(results);
				if (results.length == 0) {
					empty = true;
					results.push({"html": "<p>No Journals Found :(</p>"})
				}
				chrome.runtime.sendMessage({results: results, url: this.url, empty: empty}, function(response){
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
