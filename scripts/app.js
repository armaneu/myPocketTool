
/**
 * 
 */
function generateDiagram() {
    let ddl_text = document.getElementById('DDL').value;
    let plantumlCode = Oracle.plantuml_parser(ddl_text);
    document.getElementById('UML').value = plantumlCode;
    console.log(plantumlCode);

    let url = 'http://127.0.0.1:8000/plantuml/svg/' + textEncoding(plantumlCode);
    document.getElementById('iframe_diagram').src = url;
}

function openFile() {
    document.getElementById('inputFile').click();
}

function readFile(e) {
    document.getElementById('DDL').value = '';
    document.getElementById('UML').value = '';
    document.getElementById('iframe_diagram').src = "about:blank";

    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('DDL').value = e.target.result;
    }
    reader.readAsText(file);

    e.target.value = ''; // to be able to load the same file multiple times
}


function downloadUML(){
    var text = document.getElementById("UML").value;
    text = text.replace(/\n/g, "\r\n"); // To retain the Line breaks.
    var blob = new Blob([text], { type: "text/plain"});
    var anchor = document.createElement("a");
    anchor.download = "myPocketUML-filename.puml";
    anchor.href = window.URL.createObjectURL(blob);
    anchor.target ="_blank";
    anchor.style.display = "none"; // just to be safe!
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
 }
