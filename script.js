class ParseNode {
    constructor() {
        this.type = "root";
        this.children = [];
        this.flex = 1;
        this.mainAxisAlignment = "";
        this.crossAxisAlignment = "";
        this.gap = 0;
        this.flexDirection = "row";
        this.id = "0";
    }
}

var root = new ParseNode();
var current = root;

function addChild(n) {
    for (var i = 0; i < n; i++) {
        var newNode = new ParseNode();
        newNode.id = current.id + current.children.length.toString();
        current.children.push(newNode);
    }
    console.log("Added " + n + " children to " + current.id);
    for(var i = 0; i < n; i++) {
        console.log(current.children[i].id);
    }
}

function selectNode(id) {
    if(id.charAt(0) != "0") {
        console.log("Invalid ID -- " + id);
        return root;
    }
    var node = root;
    for (var i = 1; i < id.length; i++) {
        if (parseInt(id.charAt(i)) >= node.children.length || parseInt(id.charAt(i)) < 0) {
            console.log("Invalid ID --- " + id + " at " + parseInt(id.charAt(i)));
            return root;
        } else {
            node = node.children[parseInt(id.charAt(i))];
            console.log("Selected " + node.id);
        }
    }
    current = node;
}

function changeFlex(flex) {
    current.flex = flex;
}

function getText(node, text = "") {
    text += "\t".repeat(node.id.length - 1) + "<div>" + "\n";
    text += "\t".repeat(node.id.length) + node.id + "\n";
    for (var i = 0; i < node.children.length; i++) {
        text = getText(node.children[i], text);
    }
    text += "\t".repeat(node.id.length - 1) + "</div>\n";

    return text;
}

function doStuff() {
    selectNode("0");
    addChild(2);
    selectNode("00");
    addChild(3);
    selectNode("001");
    changeFlex(2);
    selectNode("0");
    addChild(1);
}

function debugTree(node) {
    console.log(node.id);
    for (var i = 0; i < node.children.length; i++) {
        debugTree(node.children[i]);
    }
}
function generateCode() {
    var textarea = document.getElementById("code");

    current = root;
    textarea.value = getText(root ,"");

    // debugTree(current);
}
function start() {
    doStuff(root);
    console.log("Done");
}

