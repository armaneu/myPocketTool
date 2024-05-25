/**
 * Global variables
 */
var host, port, service_name, database, schema, username, password;


function __initConnectionParameters__() {
   try {
      host = document.querySelector("#host");                  // hostname or IP address of the database
      port = document.querySelector("#port");                  // port number to stablish the connection
      service_name = document.querySelector("#service_name");  // database service name
      database = document.querySelector("#database");          // the name of the database
      schema = document.querySelector("#schema");              // the schema of the database
      username = document.querySelector("#username");          // user with access to the database
      password = document.querySelector("#password");          // the password of the user
   } catch (error) {
      
   }
}



function deleteAll() {
   // Erasing the input values
   try {
      host.value = '';
      port.value = '';
      service_name.value = '';
      database.value = '';
      schema.value = '';
      username.value = '';
      password.value = '';
   } catch (error) {
      
   }
}

function onCancel() {
   deleteAll();
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
   let message = `Do you want to save the following changes?\n
         Host:  ${host.value}
         Port:  ${port.value}
         Service name:  ${service_name.value}
         Database:  ${database.value}
         Schema:  ${schema.value}
         Username:  ${username.value}
         Password:  ${password.value}`;

   if (window.confirm(message) == true) {
      try {
         CONNECTION.host = host.value;                  // hostname or IP address of the database
         CONNECTION.port = port.value;                  // port number to stablish the connection
         CONNECTION.service_name = service_name.value;  // database service name
         CONNECTION.database = database.value;          // the name of the database
         CONNECTION.schema = schema.value;              // the schema of the database
         CONNECTION.username = username.value;          // user with access to the database
         CONNECTION.password = password.value;          // the password of the user
      } catch (error) {
         
      }

      deleteAll(); 
   }
}

function onGetConnectionParameters() {
   try {
      host.value = CONNECTION.host;                  // hostname or IP address of the database
      port.value = CONNECTION.port;                  // port number to stablish the connection
      service_name.value = CONNECTION.service_name;  // database service name
      database.value = CONNECTION.database;          // the name of the database
      schema.value = CONNECTION.schema;              // the schema of the database
      username.value = CONNECTION.username;          // user with access to the database
      password.value = CONNECTION.password;          // the password of the user   
   } catch (error) {
      
   }
}

