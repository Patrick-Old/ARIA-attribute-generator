

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
	
	output = "";
	var input = document.getElementById("originalText");	
	
	var handler = new Tautologistics.NodeHtmlParser.DefaultHandler(function (error, dom) {
		tags = "";
		tags = dom;
		console.log(dom);
	});
	var parser = new Tautologistics.NodeHtmlParser.Parser(handler);
	console.log(document.body.innerHTML);
	console.log(input);
	
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
	//output = output.substring(9);
	
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
	

var selfClose = ["img", "area", "base", "input", "br", "col", "command", "embed", "hr", "keygen", "link", "menuitem", "meta", "param", "source", "track", "wbr"];


function findAttr(children) {
	for (var tag in children) {
		console.log(tag);
		console.log(children[tag].name);
		
		//if(children[tag].type == "tag"){
			
			//ARIA roles based on landmark
			if (Object.keys(roleDict).includes(children[tag].name)) {
				if (children[tag].attribs && children[tag].attribs.role && children[tag].attribs.role == roleDict[children[tag].name]) {
					
				} else if (Object.keys(roleDict).includes(children[tag].name)){
					//write tags out
					//console.log("needs: " + roleDict[children[tag].name]);
					children[tag].attribs =  {"role": roleDict[children[tag].name]};
					console.log
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
			
			if (children[tag].attribs && Object.keys(roleDict).includes(children[tag].name)) {
				output = output + "<" + children[tag].data + " role=" + "\"" + children[tag].attribs.role + "\"";
				
				chooseAttr(children[tag], children[tag].attribs.role);
				
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

function chooseAttr(child, role) {
	var attrBox = document.getElementById("errorDesc");
	var attrSugg = "At " + child.raw + " role = " + role + " there should be these attributes with these possible values: \n";
	for (var attr in attributes[role]) {
		for (var prop in values[attr]) {
			console.log(attr + " " + prop);
			attrSugg = attrSugg + attr + "=" + prop + "\n";
		}
	} 
	attrBox.innerHTML = attrBox.innerHTML + attrSugg;
}

var attributes = {
	"alert": ["aria-expanded"],
	"alertdialog": ["aria-expanded", "aria-modal"],
	"application": ["aria-activedescendant"],
	"article": ["aria-expanded"],
	"banner": ["aria-expanded"],
	"button": ["aria-expanded", "aria-pressed"],
	"checkbox": ["aria-checked", "aria-readonly"],
	"columnheader": ["aria-sort", "aria-readonly", "aria-required", "aria-selected", "aria-expanded", "aria-colspan", "aria-colindex", "aria-rowindex", "aria-rowspan"],
	"combobox": ["aria-controls", "aria-expanded", "aria-autocomplete", "aria-required", "aria-activedesendant", "aria-orientation"],
	"complementary": ["aria-expanded"],
	"contentinfo": [ "aria-expanded"],
	"definition": [ "aria-expanded"],
	"dialog": [ "aria-expanded", "aria-modal"],
	"directory": [ "aria-expanded"],
	"feed": [ "aria-expanded"],
	"figure": [ "aria-expanded"],
	"form": [ "aria-expanded"],
	"grid": [ "aria-level", "aria-multiselectable", "aria-readonly", "aria-acivedescendant", "aria-expanded", "aria-colcount", "aria-rowcount"],
	"gridcell": [ "aria-readonly", "aria-required", "aria-selected", "aria-expanded", "aria-colspan", "aria-colindex", "aria-rowindex", "aria-rowspan"],
	"group": [ "aria-activedescendant", "aria-expanded"],
	"list": [ "aria-expanded"],
	"listbox": [ "aria-expanded", "aria-required", "aria-multiselectable", "aria-activedescendant", "aria-orientation"],
	"listitem": [ "aria-expanded", "aria-level", "aria-posinset", "aria-setsize"],
	"log": [ "aria-expanded"],
	"main": [ "aria-expanded"],
	"marquee": [ "aria-expanded"],
	"menu": [ "aria-expanded", "aria-activedescendant", "aria-orientation"],
	"menubar": [ "aria-expanded", "aria-activedescendant", "aria-orientation"],
	"menuitem": [ "aria-posinset", "aria-setsize"],
	"menuitemcheckbox": [ "aria-posinset", "aria-setsize", "aria-checked"],
	"menuitemradio": [ "aria-posinset", "aria-setsize", "aria-checked", "aria-selected"],
	"navigation": [ "aria-expanded"],
	"note": [ "aria-expanded"],
	"option": [ "aria-posinset", "aria-setsize", "aria-checked", "aria-selected"],
	"presentation": [],
	"progressbar": [ "aria-valuemax", "aria-valuemin", "aria-valuenow", "aria-valuetext"],
	"radio": [ "aria-posinset", "aria-setsize", "aria-checked"],
	"radiogroup": [ "aria-expanded", "aria-required", "aria-activedescendant", "aria-orientation"],
	"region": [ "aria-expanded"],
	"row": [ "aria-colindex", "aria-rolindex", "aria-level", "aria-selected", "aria-activedescendant", "aria-expanded"],
	"rowgroup": [],
	"rowheader": [ "aria-readonly", "aria-required", "aria-selected", "aria-expanded", "aria-colspan", "aria-colindex", "aria-rowindex", "aria-rowspan"],
	"scrollbar": [ "aria-valuemax", "aria-valuemin", "aria-valuenow", "aria-valuetext", "aria-controls", "aria-orientation", "aria-expanded"],
	"search": [ "aria-expanded"],
	"searchbox": [ "aria-activedescendant", "aria-autocomplete", "aria-multiline", "aria-placeholder", "aria-readonly", "aria-required"],
	"separator": [ "aria-valuemax", "aria-valuemin", "aria-valuenow", "aria-valuetext", "aria-orientation"],
	"slider": [ "aria-valuemax", "aria-valuemin", "aria-valuenow", "aria-valuetext", "aria-orientation"],
	"spinbutton": [ "aria-valuemax", "aria-valuemin", "aria-valuenow", "aria-valuetext", "aria-readonly", "aria-required"],
	"status": [ "aria-expanded"],
	"switch": [ "aria-checked", "aria-readonly"],
	"tab": [ "aria-selected", "aria-posinset", "aria-setsize", "aria-expanded"],
	"table": [ "aria-colcount", "aria-rowcount"],
	"tablist": [ "aria-level", "aria-activedescendant", "aria-multiselectable", "aria-orientation"],
	"tabpanel": [ "aria-expanded"],
	"term": [ "aria-expanded"],
	"textbox": [ "aria-activedescendant", "aria-autocomplete", "aria-multiline", "aria-placeholder", "aria-readonly", "aria-required"],
	"timer": [ "aria-expanded"],
	"toolbar": [ "aria-expanded", "aria-activedescendant", "aria-orientation"],
	"tooltip": [ "aria-expanded"],
	"tree": [ "aria-multiselectable", "aria-required", "aria-activedesendant", "aria-expanded", "aria-orientation"],
	"treegrid": [ "aria-level", "aria-multiselectable", "aria-readonly", "aria-activedescendant", "aria-expanded", "aria-required", "aria-orientation", "aria-colcount", "aria-rowcount"],
	"treeitem": [ "aria-level", "aria-expanded", "aria-selected", "aria-checked", "aria-posinset", "aria-setsize"]
}

var values = {
    "aria-activedescendant": ["true", "false"],
	"aria-atomic": ["true", "false"],
	"aria-autocomplete": ["inline", "list", "both", "none"],
	"aria-busy": ["true", "false"],
	"aria-checked": ["true", "false", "mixed", "undefined"],
	"aria-colcount": "integer",
	"aria-colindex": "integer",
	"aria-colspan": "integer",
	"aria-controls": "referenced element ID",
	"aria-current": ["page", "step", "location", "true", "false", "date", "time"],
	"aria-describedby": "referenced element ID",
	"aria-details": "referenced element ID",
	"aria-disabled": ["true", "false"],
	"aria-dropeffect":["copy", "execute", "link", "move", "none", "popup"],
	"aria-errormessage": "referenced element ID",
	"aria-expanded": ["true", "false", "undefined"],
	"aria-flowto": "referenced element ID",
	"aria-grabbed": ["true", "false", "undefined"],
	"aria-haspopup": ["true", "false", "menu", "listbox", "grid", "dialog", "tree"],
	"aria-hidden": ["true", "false", "undefined"],
	"aria-invalid":["true", "false", "grammar", "spelling"],
	"aria-keyshortcuts": "String of keyboard shortcuts",
	"aria-label": "String to label element",
	"aria-labelledby": "referenced element ID",
	"aria-level":  "integer",
	"aria-live":["assertive", "polite", "off"],
	"aria-modal": ["true", "false"],
	"aria-multiline": ["true", "false"],
	"aria-multiselectable": ["true", "false"],
	"aria-orientation": ["horizontal", "vertical", "undefined"],
	"aria-owns": "referenced element ID",
	"aria-placeholder": "placeholder string",
	"aria-posinset": "integer",
	"aria-pressed": ["true", "false", "mixed", "undefined"],
	"aria-readonly": ["true", "false"],
	"aria-relevant": ["additions", "additions text", "all", "text", "removals"],
	"aria-required": ["true", "false"],
	"aria-roledescription": "String description",
	"aria-rowcount": "integer",
	"aria-rowindex": "integer",
	"aria-rowspan": "integer",
	"aria-selected": ["true", "false", "undefined"],
	"aria-setsize": "integer",
	"aria-sort": ["ascending", "descending", "other", "none"],
	"aria-valuemax": "integer",
	"aria-valuemin": "integer",
	"aria-valuenow": "integer",
	"aria-valuetext": "Readable version of aria-valuenow"
}




