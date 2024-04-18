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



 function onlyNumber(ASCII) {
    // Only ASCII character in the range allowed
    if (ASCII > 31 && (ASCII < 48 || ASCII > 57)) {
        return false;
    }
    
    return true;
}

function onlyNumberKey(event) {
    let ASCII = (event.which) ? event.which : event.keyCode
    let result = onlyNumber(ASCII);

    return result;
}

/**
 * This method prevents to paste not numerical value
 * @param {*} id 
 */
function onlyNumberCharacter(id) {
    if (id != null && id.length > 0) {
        const inputBox = document.getElementById(id);
        inputBox.onpaste = event => {
            const data = event.clipboardData.getData('text');
            for (let index = 0; index < data.length; index++) {
                if (onlyNumber(data.charCodeAt(index)) == false) {
                    event.preventDefault();
                    break;
                }
            }
        };
    }
}

/**
 * Not in use for now
 * @param {} id 
 */
function dontPaste(id) {
    const inputBox = document.getElementById(id);
    inputBox.onpaste = event => {
        event.preventDefault();
        return false;
    };
}


function onSetConnectionParameters() {
    
    CONNECTION.host = document.getElementById('host').value;                  // hostname or IP address of the database
    CONNECTION.port = document.getElementById('port').value;                  // port number to stablish the connection
    CONNECTION.service_name = document.getElementById('service_name').value;  // database service name
    CONNECTION.database = document.getElementById('database').value;          // the name of the database
    CONNECTION.schema = document.getElementById('schema').value;              // the schema of the database
    CONNECTION.username = document.getElementById('username').value;          // user with access to the database
    CONNECTION.password = document.getElementById('password').value;          // the password of the user
        
    console.log(`CONNECTION values: ${CONNECTION.host}, ${CONNECTION.port}, ${CONNECTION.service_name}, ${CONNECTION.database}, ${CONNECTION.schema}, ${CONNECTION.username}, ${CONNECTION.password}`);
    
}

function onGetConnectionParameters() {
    
    document.getElementById('host').value = CONNECTION.host;                  // hostname or IP address of the database
    document.getElementById('port').value = CONNECTION.port;                  // port number to stablish the connection
    document.getElementById('service_name').value = CONNECTION.service_name;  // database service name
    document.getElementById('database').value = CONNECTION.database;          // the name of the database
    document.getElementById('schema').value = CONNECTION.schema;              // the schema of the database
    document.getElementById('username').value = CONNECTION.username;          // user with access to the database
    document.getElementById('password').value = CONNECTION.password;          // the password of the user
        
    console.log(`CONNECTION values: ${CONNECTION.host}, ${CONNECTION.port}, ${CONNECTION.service_name}, ${CONNECTION.database}, ${CONNECTION.schema}, ${CONNECTION.username}, ${CONNECTION.password}`);
    
}

