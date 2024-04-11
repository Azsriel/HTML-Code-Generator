/* Compiler / Code Generator  START */
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

function addChild(n) {
    for (var i = 0; i < n; i++) {
        var newNode = new ParseNode();
        newNode.id = current.id + current.children.length.toString();
        current.children.push(newNode);
    }
    updateListTree();
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
            //console.log("Selected " + node.id);
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
    root = new ParseNode();
    updateListTree();
    doStuff(root);
    console.log("Done");
}


/* Compiler / Code Generator  END */

/* Tree View START */


function buildListTree(node, parent) {
    let ul = document.createElement("ul");
    let li = document.createElement("li");
    li.textContent = "C" + node.id;
    ul.appendChild(li);

    li.addEventListener("click", function(event) {
        if(event.target.closest("li") === li){
            selectNode(node.id);
        }
    });

    if(node.children && node.children.length > 0) {
        node.children.forEach(child => {
            buildListTree(child, li);
        });
    }

    parent.appendChild(ul);
}

function updateListTree() {
    document.getElementById("TreeView").innerHTML = "";
    buildListTree(root, document.getElementById("TreeView"));
}


/* Tree View END */

/* Tree View Resize START */
var TVCdiv = document.getElementById("TreeViewResizer");

function handleResize(event) {
    TVCdiv.style.width = event.pageX + "px";
    if(event.pageX > window.innerWidth / 2) {
        TVCdiv.style.width = window.innerWidth / 2 + "px";
    }
    TVCdiv.style.cursor = "ew-resize";
}

TVCdiv.addEventListener('mousedown', function(event) {
    document.addEventListener('mousemove', handleResize);
});
document.addEventListener('mouseup', function() {
    document.removeEventListener('mousemove', handleResize);
});
/* Tree View Resize END */

/* Start Stuff */

var root = new ParseNode();
var current = root;
updateListTree();





