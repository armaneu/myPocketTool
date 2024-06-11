
const messageBoxType = Object.freeze({
    ERROR: 'message_box_error',
    WARNING: 'message_box_warning',
    SUCCESS: 'message_box_success',
    INFORMATION: 'message_box_information',
    QUESTION: 'message_box_question'
});


function showMessageBox(message_box_type) {
    const content = `
        <article class="article_modal">
            <section class="section_modal">
                <div class="div_modal" id="div_modal__message_box">
                    <div class="div_dialog ${message_box_type}">
                        <div class="div_dialog_header">
                            <span class="span_dialog_title"></span>
                            <span class="span_dialog_X" onclick="messageBoxClose();">&times;</span> 
                        </div>
                        <div class="div_dialog_body">    
                            <p class="p_message">
                                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officia libero temporibus nesciunt necessitatibus itaque quas! Modi, aspernatur illum et autem, ipsam quidem possimus maiores distinctio iure aliquam atque nobis ut.
                            </p>
                            <p class="p_message">
                                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officia libero temporibus nesciunt necessitatibus itaque quas! Modi, aspernatur illum et autem, ipsam quidem possimus maiores distinctio iure aliquam atque nobis ut.
                            </p>
                        </div>
                        <div class="div_dialog_footer">
                            <div class="div_button_group">
                                <button type="button" class="button_dialog_close" onclick="buttonCLOSE();">CLOSE</button>
                                <button type="button" class="button_dialog_yes" onclick="buttonYES();">YES</button>
                                <button type="button" class="button_dialog_no" onclick="buttonNO();">NO</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </article>
    `;


    try {
        // Only add { content } once
        if (document.querySelectorAll('.div_modal').length  == 0) {
            init_MAIN_state = __MAIN__.innerHTML;  // store initial state
            __MAIN__.innerHTML += content;
        }
        
        // When the modal is open
        document.querySelectorAll('.div_modal').style.display = "block";
    } catch (error) {
        
    }
}

/**
 * When the user clicks on [X] right top button corner, close the modal
 * @returns Exits if { modalMessageBox } object is null
 */
function messageBoxClose() {
    // Get the modal
    const modalMessageBox = document.getElementById("div_modal__message_box");
    if (!modalMessageBox) {
        return;
    }
    modalMessageBox.style.display = "none";

    // Restoring initial state
    __MAIN__.innerHTML = init_MAIN_state;
}

/**
 * When the user clicks on [CLOSE] button, close the modal
 */
function buttonCLOSE() {
    messageBoxClose();
}

/**
 * When the user clicks on [NO] button, close the modal
 */
function buttonNO() {
    messageBoxClose();
}

/**
 * When the user clicks on [YES] button, execute some action and close the modal
 */
function buttonYES() {
    // Execute some action


    messageBoxClose();
}