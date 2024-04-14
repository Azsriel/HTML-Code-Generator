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
    var li = document.getElementById("C" + current.id);
    if(li) {
        li.style.color = "blue";
    }

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
function reset() {
    root = new ParseNode();
    updateListTree();
    current = root;

    document.getElementById("code").value = "";
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
    li.id = "C" + node.id;
    ul.appendChild(li);

    li.addEventListener("click", function(event) {
        if(event.target.closest("li") === li){
            selectNode(node.id);
            li.style.color = "red";
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

/* View Resize START */
var TVCdiv = document.getElementById("TreeViewResizer");
var IVCdiv = document.getElementById("InspectorViewResizer");
var select = 0;

function resizeLimitBool(event) {
    if(select === 1) {
        return event.clientX > window.innerWidth / 2;
    } else if(select === 2) {
        return event.clientX < window.innerWidth / 2;
    } else {
        return false;
    }
}

function handleResize(event) {
    let selectedDiv = select === 1 ? TVCdiv : IVCdiv;
    if(select === 1) {
        selectedDiv.style.width = event.clientX + "px";
    } else if (select === 2) {
        selectedDiv.style.width = window.innerWidth - event.clientX + "px";
    }
    if(resizeLimitBool(event)) {
        selectedDiv.style.width = window.innerWidth / 2 + "px";
    }
    selectedDiv.style.cursor = "ew-resize";
}

TVCdiv.addEventListener('mousedown', function(event) {
    select = 1;
    document.addEventListener('mousemove', handleResize);
});
document.addEventListener('mouseup', function() {
    select = 0;
    document.removeEventListener('mousemove', handleResize);
});

IVCdiv.addEventListener('mousedown', function(event) {
    select = 2;
    document.addEventListener('mousemove', handleResize);
});
document.addEventListener('mouseup', function() {
    select = 0;
    document.removeEventListener('mousemove', handleResize);
});
/* View Resize END */

/* Start Stuff */
reset();





