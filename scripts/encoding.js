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
