/**
 * Global variables
 */
const host = document.querySelector("#host");                  // hostname or IP address of the database
const port = document.querySelector("#port");                  // port number to stablish the connection
const service_name = document.querySelector("#service_name");  // database service name
const database = document.querySelector("#database");          // the name of the database
const schema = document.querySelector("#schema");              // the schema of the database
const username = document.querySelector("#username");          // user with access to the database
const password = document.querySelector("#password");          // the password of the user


function existInputObjects() {
   if (!host || !port || !service_name || !database || !schema || !username || !password) {
      return false;
   }

   return true;
}



const eyeIcons = {
   open: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="eye-icon"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" /><path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clip-rule="evenodd" /></svg>',
   closed: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="eye-icon"><path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" /><path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" /><path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" /></svg>'
};

function addListeners() {
   const toggleButton = document.querySelector(".toggle-button");
   
   if (!toggleButton) {
      return;
   }
   
   toggleButton.addEventListener("click", togglePassword);
}

function togglePassword() {
   const passwordField = document.querySelector("#password");
   const toggleButton = document.querySelector(".toggle-button");
   
   if (!passwordField || !toggleButton) {
      return;
   }
   
   toggleButton.classList.toggle("open");
   
   const isEyeOpen = toggleButton.classList.contains("open");

   toggleButton.innerHTML = isEyeOpen ? eyeIcons.closed : eyeIcons.open;
   passwordField.type = isEyeOpen ? "text" : "password";
}

document.addEventListener("DOMContentLoaded", addListeners);


function deleteAll() {
   if (!existInputObjects) {
      return;
   }

   // Erasing the input values
   host.value = '';
   port.value = '';
   service_name.value = '';
   database.value = '';
   schema.value = '';
   username.value = '';
   password.value = '';
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


function showMessage() {
   
}

function onSetConnectionParameters() {
   
   if (!existInputObjects) {
      return;
   }

   if (window.confirm("Do you want to save changes?") == true) {
      CONNECTION.host = host.value;                  // hostname or IP address of the database
      CONNECTION.port = port.value;                  // port number to stablish the connection
      CONNECTION.service_name = service_name.value;  // database service name
      CONNECTION.database = database.value;          // the name of the database
      CONNECTION.schema = schema.value;              // the schema of the database
      CONNECTION.username = username.value;          // user with access to the database
      CONNECTION.password = password.value;          // the password of the user

      deleteAll(); 
  } else {
      window.alert('Save Cancelled!');
  } 
}

function onGetConnectionParameters() {
   
   if (!existInputObjects) {
      return;
   }

   host.value = CONNECTION.host;                  // hostname or IP address of the database
   port.value = CONNECTION.port;                  // port number to stablish the connection
   service_name.value = CONNECTION.service_name;  // database service name
   database.value = CONNECTION.database;          // the name of the database
   schema.value = CONNECTION.schema;              // the schema of the database
   username.value = CONNECTION.username;          // user with access to the database
   password.value = CONNECTION.password;          // the password of the user   
}

