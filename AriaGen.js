

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


submitButton.addEventListener('click', function (e) {
	var input = document.getElementById("originalText");
	
var handler = new Tautologistics.NodeHtmlParser.DefaultHandler(function (error, dom) {
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
	var el = str2DOMElement(input.value);
	console.log(el);
	
	parser.parseComplete(el.innerHTML);
	parser.parseComplete(document.body.innerHTML);
	//alert(JSON.stringify(handler.dom, null, 2));	
	
	
	//parser.write(input.Text);
	//parser.end();
});

