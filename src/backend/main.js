// GLOBAL VARIABLES
var global_table_description_array = new Array();


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

function openExcelFile() {
    let body = document.getElementById('body');
    document.getElementById('inputExcelFile').click();

    ////body.innerHTML = '<p>Contenido Borrado</p>';
    ////body.querySelectorAll("*").forEach(el => el.remove());
    ////body.innerHTML = '\
    ////    <header class="topheader"> \
    ////        <div class="topheaderdiv"> \
    ////            <h1>myPocketUML</h1> \
    ////        </div> \
    ////    </header>';
}

function readExcelFile(event) {
    var file = event.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(event) {
        document.getElementById('DDL').value = event.target.result;
        let result_array = event.target.result.split(/\n/);
        let buffer = '';
        global_table_description_array = new Array();
        
        for (let index = 0; index < result_array.length; index++) {
            if (result_array[index] != '') {
                buffer = result_array[index].split(',');                
                global_table_description_array.push({ name: buffer[0], description: buffer[1] });
            }
        }
    }
    reader.readAsText(file);

    event.target.value = ''; // to be able to load the same file multiple times
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

function createHTMLPage(title, content) {
    
    let doc = document.implementation.createHTMLDocument(title);
    let blob = new Blob([content], { type: "text/html"});

    let anchor = document.createElement("a");
    anchor.download = "Entity details.html";
    anchor.href = window.URL.createObjectURL(blob);
    anchor.target ="_blank";
    anchor.style.display = "none"; // just to be safe!
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}


function createHTMLPage() {
    let content = '', html = '';
    if (entity_full_list != null && entity_full_list != undefined && Array.isArray(entity_full_list)) {
        ////let entity = entity_full_list[0];
        ////content = Utils.generateHTMLTableFromEntity(entity);
        ////html = Utils.generateHTMLDocument(content);
        ////console.log(`CONTENT: ${content}/n/n`);
        ////console.log(`HTML: ${html}/n/n`);
        ////console.log(`LENGTH: ${entity.columns_array.length}`);


        entity_full_list.forEach(entity => {
            content += Utils.generateHTMLTableFromEntity(entity);
        });
        html = Utils.generateHTMLDocument(content);

        let doc = document.implementation.createHTMLDocument("Entity details");
        let blob = new Blob([html], { type: "text/html"});
        let anchor = document.createElement("a");
        anchor.download = "Entity details.html";
        anchor.href = window.URL.createObjectURL(blob);
        anchor.target ="_blank";
        anchor.style.display = "none"; // just to be safe!
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }
}
