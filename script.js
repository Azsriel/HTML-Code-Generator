/* Compiler / Code Generator  START */
class ParseNode {
    constructor(type) {
        this.type = type;
        this.id = "0";
        this.children = [];
        this.properties = {};
    }
}

const inputTypes = {
    color: "color",
    backgroundColor: "color",
}


function addChild(n) {
    for (var i = 0; i < n; i++) {
        var newNode = new ParseNode("div");
        newNode.id = current.id + current.children.length.toString();
        current.children.push(newNode);
    }
    updateListTree();
}

function selectNode(id) {
    // Tree View
    var li = document.getElementById("C" + current.id);
    if(li) {
        li.style.color = "blue";
    }

    // Code View
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

    // Inspector View
    buildInspectorView();

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
    root = new ParseNode("div");
    updateListTree();
    current = root;

    document.getElementById("code").value = "";
}
function start() {
    reset();
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

/* Inspector View START */

function buildInspectorView() {
    let name = document.getElementById("CurrentSelected")
    name.innerHTML = "<strong>" + "C" + current.id + "</strong>";

    let div = document.getElementById("CurrentProperties");
    div.innerHTML = "";

    if(Object.keys(current.properties).length === 0) {
        div.innerHTML = "No Properties";
        return;
    }

    for(var prop in current.properties) {
        let divv = document.createElement("div");
        divv.style.display = "flex";
        divv.style.gap = "10px";
        divv.style.alignItems = "center";
        let p = document.createElement("p");
        p.textContent = prop + ": ";
        divv.appendChild(p);
        let inputDiv = document.createElement("div");
        let inputType = inputTypes[prop];

        if (inputType) {
            const input = document.createElement("input");
            input.type = inputType;
            input.id = prop;
            input.defaultValue = current.properties[prop];
            input.placeholder = `Enter value for ${prop}`;
            inputDiv.appendChild(input);

            (function(property) {
                input.addEventListener("change", function(event) {
                    current.properties[property] = event.target.value;
                });
            })(prop)

        } else {
            inputDiv.textContent = "No input needed for this property.";
        }
        divv.appendChild(inputDiv);
        div.appendChild(divv);
    }
}

/* Inspector View END */

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





