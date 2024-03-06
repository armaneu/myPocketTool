UTF8 = {
    encode: function(s) { return unescape(encodeURIComponent(s)); },
    decode: function(s) { return decodeURIComponent(  escape(s)); }
};

function encode6bit(b) {
    if (b < 10) {  
        return String.fromCharCode(48 + b);  // ASCII 0 - 9     :  0 - 9
    }
    b -= 10;
    
    if (b < 26) {
        return String.fromCharCode(65 + b);  // ASCII 65 - 90   :  A - Z
    }
    b -= 26;
    
    if (b < 26) {
        return String.fromCharCode(97 + b);  // ASCII 97 - 122  :  a - z
    }
    b -= 26;
    
    if (b == 0) {
        return '-';
    }

    if (b == 1) {
        return '_';
    }

    return '?';
}

function append3bytes(b1, b2, b3) {
    c1 = b1 >> 2;
    c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
    c3 = ((b2 & 0xF) << 2) | (b3 >> 6);
    c4 = b3 & 0x3F;
    
    r = "";
    r += encode6bit(c1 & 0x3F);
    r += encode6bit(c2 & 0x3F);
    r += encode6bit(c3 & 0x3F);
    r += encode6bit(c4 & 0x3F);
    
    return r;
}

function encode64(data) {
    r = "";
    
    for (i = 0; i < data.length; i+=3) {
        if (i+2 == data.length) {
            r +=append3bytes(data.charCodeAt(i), data.charCodeAt(i+1), 0);
        } else if (i+1 == data.length) {
            r += append3bytes(data.charCodeAt(i), 0, 0);
        } else {
            r += append3bytes(data.charCodeAt(i), data.charCodeAt(i+1),
            data.charCodeAt(i+2));
        }
    }
    
    return r;
}

function convertToHEX(str) {
    var result = '';
    
    for (var i = 0; i < str.length; i++) {
        if (str[i] === '\n') {
            result += ('0' + str.charCodeAt(i).toString(16));
        }      
        else {
            result += str.charCodeAt(i).toString(16);
        }
    }
    
    return result;
}

function convertFromHEX(hex) {
    var hex = hex.toString();  //force conversion
    var str = '';
    
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    
        return str;
}


/**
 * This method encode the PlantUML text
 * https://plantuml.com/text-encoding
 * @param {string} str 
 * @returns
 */
function textEncoding(str) {
    let data = UTF8.encode(str);        // 1. Encoded in UTF-8
    let compressed = deflate(data, 9);  // 2. Compressed using Deflate algorithm
    let result = encode64(compressed);  // 3. Reencoded in ASCII using a transformation close to base64

    return result;
}

function convertDDL2PlantUML(ddl_text = null) {
    const message = "Hello, JavaScript!";
    const length = message.length; 
    
    const fruits = "apple,banana,cherry";
    const fruitArray = fruits.split(",");

    const sentence = "JavaScript is amazing!";
    const index = sentence.indexOf("amazing"); 
    //console.log(`Index of amazing: ${index}`);

    //window.alert(index);

    //const sentence2 = prompt("Enter a sentence:");
    //const words = sentence2.split(" ");
    //console.log(`Number of words: ${words.length}`);

    const userInput = "create index amu; create table; create table ();";
    //const charToFind = prompt("Enter a character:");
    //const index2 = userInput.indexOf(charToFind);
    //console.log(`Index of ${charToFind}: ${index2}`);

    var index3 = userInput.toUpperCase().indexOf('CREATE TABLE');
    var mes = "Uppercase => " + userInput.toUpperCase() + "\n" + "Original => " + userInput + "\n\n" + `Index of CREATE TABLE is: ${index3}`;
    console.log(mes);

    ddl_text = "create index amu; create table; create table ();";
    if (ddl_text != null && ddl_text.length > 0) {
        const ddl_text_uppercase = ddl_text.toUpperCase();  // it is necessary to looking for the key words

        if (ddl_text_uppercase.indexOf('CREATE TABLE') > -1) {
            /* Mapping
            DDL                   PlantUML
            ----------------      ----------------
            CREATE TABLE      =>  table
            table_name        =>  (table_name)
            ()                =>  {
                                  }
            column_name       =>  column (column_name)
            column_type       =>  : column_type

            Example:
            --------------------------------------

            CREATE TABLE confdb.eba (                 table(confdb.eba) {
            eba_id             NUMBER(9) NOT NULL,    column (eba_id): NUMBER(9) NOT NULL
            eba_benutzerk      NUMBER(11),            column (eba_benutzerk): NUMBER(11)
            eba_created_date   NUMBER(8),             column (eba_created_date): NUMBER(8)
            eba_created_time   NUMBER(6));            column (eba_created_time): NUMBER(6)
                                                      }


            */
        }
    } else {
        
    }
}

/**
 * 
 */
function generateDiagram() {
    let ddl_text = document.getElementById('DDL').value;
    let plantumlCode = Oracle.plantuml_parser(ddl_text);
    document.getElementById('UML').value = plantumlCode;
    console.log(plantumlCode);

    let url = 'http://127.0.0.1:8000/plantuml/png/' + textEncoding(plantumlCode);
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
