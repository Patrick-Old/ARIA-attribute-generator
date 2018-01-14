

var submitButton = document.getElementById("submitButton");

/* var parser = new htmlparser.Parser({
	onopentag: function(name, attribs){
		if(name === "script" && attribs.type === "text/javascript"){
			console.log("name:" + name + "attr:" + attribs);
		}
	},
	ontext: function(text){
		console.log("-->", text);
	},
	onclosetag: function(tagname){
		if(tagname === "script"){
			console.log("That's it?!");
		}
	}
}, {decodeEntities: true}); */

//http://krasimirtsonev.com/blog/article/Convert-HTML-string-to-DOM-element
var str2DOMElement = function(html) {
    var frame = document.createElement('iframe');
    frame.style.display = 'none';
    document.body.appendChild(frame);             
    frame.contentDocument.open();
    frame.contentDocument.write(html);
    frame.contentDocument.close();
    var el = frame.contentDocument.body.firstChild;
    document.body.removeChild(frame);
    return el;
}

var tags;

submitButton.addEventListener('click', function (e) {
	var input = document.getElementById("originalText");	
	
var handler = new Tautologistics.NodeHtmlParser.DefaultHandler(function (error, dom) {
	tags = dom;
	console.log(dom);
	if (error){
		
	}
		//[...do something for errors...]
	else {
		
	}
		//[...parsing done, do something...]
});
	var parser = new Tautologistics.NodeHtmlParser.Parser(handler);
	console.log(document.body.innerHTML);
	
	//console.log(jQuery.parseHTML(input.Text));
	/* var markup = input.Text;
	var inputParser = new DOMParser();
	var el = inputParser.parseFromString(markup, "text/xml");
	
	console.log(el); */
	if(input.value.includes("<body>")) {
		
		var inputClean = input.value.split("<body>")[1].split("</body>")[0];
	} else {
		var inputClean = input.value;
	}
	
	console.log(inputClean);
	var el = str2DOMElement("<div>" + inputClean + "</div>");
	console.log(el);
	var he = document.getElementById("hiddenEval");
	he.appendChild(el)
	parser.parseComplete(document.body.innerHTML);
	console.log(he.innerHTML);
	parser.parseComplete(he.innerHTML);

	//alert(JSON.stringify(handler.dom, null, 2));	
	
	console.log(tags[1].children);
	//parser.write(input.Text);
	//parser.end();
	
	for (var tag in tags[1].children) {
	console.log(tag);
	console.log(tags[1].children[tag].type);
}
});


