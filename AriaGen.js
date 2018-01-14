

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
var output;
submitButton.addEventListener('click', function (e) {
	var input = document.getElementById("originalText");	
	
	var handler = new Tautologistics.NodeHtmlParser
	.DefaultHandler(function (error, dom) {
		console.log("DOM");
		console.log(dom)
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
	//parser.parseComplete(document.body.innerHTML);
	console.log(he.innerHTML);
	parser.parseComplete(he.innerHTML);
	he.innerHTML = "";
	//alert(JSON.stringify(handler.dom, null, 2));	
	
	console.log(tags[1].children);
	//parser.write(input.Text);
	//parser.end();
	
	
	
	/* for (var tag in tags[1].children) {
	console.log(tag);
	console.log(tags[1].children[tag].type); */

	console.log("Fiding children called for root")
	findAttr(tags[1].children);
	console.log("Find children finished");
	console.log(tags[1].children);
	var found = tags[1].children;
	console.log(found);
	write(found);
	console.log("Write Children finished");
	output = output.substring(9);
	
	if(input.value.includes("<body>")) {
		
		output = input.value.split("<body>")[0] + "\n<body>\n" + output + "\n</body>\n" + input.value.split("</body>")[1];
	} 
	console.log(output);
	document.getElementById("ariaText").value = output;
});

var roleDict = {"header":"banner",
	"nav": "navigation",
	"main": "main",
	"footer": "contentinfo",
	"aside": "complementary",
	"form": "form",
	"section": "region",
	"article": "article",
	"a": "link"};
	
var selfClose = ["img", "area", "base", "input"];

function findAttr(children) {
	for (var tag in children) {
		console.log(tag);
		console.log(children[tag].name);
		
		//if(children[tag].type == "tag"){
			
			//ARIA roles based on landmark
			if (Object.keys(roleDict).includes(children[tag].name)) {
				if (children[tag].attribs && children[tag].attribs.role && children[tag].attribs.role == roleDict[children[tag].name]) {
					
				} else if (roleDict[children[tag].name]){
					//write tags out
					//console.log("needs: " + roleDict[children[tag].name]);
					children[tag].attribs =  {"role": roleDict[children[tag].name]};
				}
			}
			//Recurse over children
			if (children[tag].children) {
				findAttr(children[tag].children);
			}
		//}
	}
}
var output;
function write(children) {
	console.log(tags[1].children);

	var closing = false;
	var closer = "";
	for (var tag in children) {
		if (children[tag].type == "text") {
			output = output + children[tag].data;
		}
		if (children[tag].type == "tag") {
			if (closing) {
				output = output + "</" + closer + ">\n";
			}
			
			if (children[tag].attribs) {
				output = output + "<" + children[tag].data + " role=" + "\"" + children[tag].attribs.role + "\"";
			}
			else {
			
			output = output + "<" + children[tag].data;
			
			}
			
			if (selfClose.includes(children[tag].name)) {
				output = output + "/>";
				closing = false;
			}
			else {
				output = output + ">";
				closer = children[tag].name;
				closing = true;
			}
			
			if (children[tag].children) {
				write(children[tag].children);
			}
			
		}
		
	}
	if (closing) {
		output = output + "</" + closer + ">";
	}
	
	console.log(output);
}

/*
<!DOCTYPE html>
<html>
	<head>
		<title>Bad ARIA Example Page</title>
	</head>
	<body>
		<header id="slide 1" class = "slide">
			<h1>ARIA Example page</h1>
		</header>
		<a></a>
		<article> </article>
		<h2>This is the important content</h2>
		<p role="button">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. </p>

		<p>
		</p>
	</body>
</html>
*/

