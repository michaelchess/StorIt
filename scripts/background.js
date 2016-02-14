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
	var nouns = ""; 
	var unTaggedWords = new Lexer().lex(string);
	var taggedWords = new POSTagger().tag(unTaggedWords);

	for (var i = 0; i < taggedWords.length; i++) {
		var word = taggedWords[i];
		console.log(word)
		//["DT", "EX", "VBP", ":", ",", "TO", "WP"]
		if (word[1].slice(0,2) == "NN") {
			nouns+=word[0];
			if (i < taggedWords.length-1) nouns+=" ";
		}
	}

	return (nouns.length > 0) ? nouns : null;
};

var getJstorResults = function(DOM) {
	console.log(DOM);
};

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.DOM) {
		var HTMLString = request.getHTML;
		var doctype = document.implementation.createDocumentType( 'html', '', '');
		var dom = document.implementation.createDocument('', 'html', doctype);
		dom.documentElement.innerHTML = HTMLString;

		var title = dom.title;
		console.log(dom);
		var query = buildQuery(title);

		$.ajax({
            type: "GET", //or GET
            url: "http://www.jstor.org/action/doBasicSearch?Query="+query+"&acc=on&wc=on&fc=off&group=none",
            success: function(data){
            	console.log(data);
            	var container = document.createElement("div");
            	container.innerHTML = data;
				getJstorResults(container);
			},
			error: function(jxhr){
			   console.log(jxhr.responseText);
			}
        });
    }
});
