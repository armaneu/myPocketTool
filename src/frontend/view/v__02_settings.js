/**
 * Display the { Connection Parameters } view
 */
function displayConnectionParameters() {
    const content = `
        <article>
            <section id="section_connection">
                <div id="div_setconnection">
                    <div class="div_header_connection">
                        <h2>Connection parameters</h2>
                    </div>
                    <form action="" class="form_setconnection" id="form_setconnection" method="post">
                        <div class="div_setconnection_grid">
                            <div class="div_label_input_group">
                                <label class="label_setconnection" for="host">Host</label>
                                <input class="input_setconnection" required type="text" name="host" id="host" maxlength="35" placeholder="Enter IP address or domain name">
                            </div>
                            <div class="div_label_input_group">
                                <label class="label_setconnection" for="port">Port</label>
                                <input class="input_setconnection" required type="text" name="port" id="port" maxlength="5" placeholder="Enter 5-digit maximum number" onkeypress="return onlyNumberKey(event)" onkeydown="onlyNumberCharacter('port')">
                            </div>
                            <div class="div_label_input_group">
                                <label class="label_setconnection" for="database">Database</label>
                                <input class="input_setconnection" required type="text" name="database" id="database" maxlength="20" placeholder="Enter database name">
                            </div>
                            <div class="div_label_input_group">
                                <label class="label_setconnection" for="schema">Schema</label>
                                <input class="input_setconnection" required type="text" name="schema" id="schema" maxlength="20" placeholder="Enter database schema name">
                            </div>
                            <div class="div_label_input_group">
                                <label class="label_setconnection" for="service_name">Service name</label>
                                <input class="input_setconnection" required type="text" name="service_name" id="service_name" maxlength="35" placeholder="Enter database service name">
                            </div>
                            <div class="div_label_input_group">
                                <label class="label_setconnection" for="username">Username</label>
                                <input class="input_setconnection" required type="text" name="username" id="username" maxlength="20" placeholder="Enter username">
                            </div>
                            <div></div>
                            <div class="div_label_input_group">
                                <label class="label_setconnection" for="password">Password</label>
                                <div class="password-wrapper">
                                    <input class="input_setconnection" required type="password" name="password" id="password" maxlength="20" placeholder="Enter password">
                                    <div class="toggle-button" onclick="togglePassword()">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="eye-icon" style="max-width: 20px; max-height: 20px;">
                                            <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
                                            <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
                                            <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
                                        </svg>
                                     </div>
                                </div>
                            </div>
                        </div>

                        <div class="div_button_group">
                            <button type="button" class="button_saveconnection" id="button_cancel" style="float: left;" onclick="onCancel()">CANCEL</button>
                            <button type="button" class="button_saveconnection" id="button_load" onclick="onGetConnectionParameters()">LOAD PARAMETERS</button>
                            <button type="button" class="button_saveconnection" id="button_save" style="font-weight: bold;" onclick="onSetConnectionParameters()">SAVE PARAMETERS</button>
                        </div>
                    </form>
                </div>
            </section>
        </article>        
        `;


        try {
            __MAIN__.innerHTML = content;
            document.getElementById("host").focus();
        } catch (error) {
            
        }    
}


// Objects and methods related to the behavior of the { Password input } and { eye-icon } elements
const eyeIcons = {
    open: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="eye-icon" style="max-width: 20px; max-height: 20px;"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" /><path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clip-rule="evenodd" /></svg>',
    closed: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="eye-icon" style="max-width: 20px; max-height: 20px;"><path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" /><path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" /><path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" /></svg>',
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
    
    toggleButton.classList.toggle("closed");
    
    const isEyeClosed = toggleButton.classList.contains("closed");
 
    toggleButton.innerHTML = isEyeClosed ? eyeIcons.open : eyeIcons.closed;
    passwordField.type = isEyeClosed ? "text" : "password";
}
 
document.addEventListener("DOMContentLoaded", addListeners);