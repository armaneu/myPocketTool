let init_MAIN_state = '';

/**
 * Display the { Connection Parameters } view
 */
function dialogSaveEntityDetails() {
    const content = `
        <article class="article_SaveEntityDetails">
            <section>
                <!-- The Modal -->
                <div id="modal_SaveEntityDetails" class="modal">
                    <!-- Modal content -->
                    <div class="modal_content">
                        <div class="modal_header">
                            <span class="close" id="span_close" onclick="dialogSEDClose();">&times;</span>
                            <h2 class="h2_modal_header">Save Entity details</h2>
                        </div>
                        <div class="modal_body">
                            <form action="" class="form_filename" id="form_filename" method="post">
                                <div class="div_label_input_grid">
                                    <div class="div_label_input">
                                        <label class="label_filename" for="filename">File name <strong style="color: red;">*</strong></label>
                                        <input class="input_filename" required type="text" name="filename" id="filename" maxlength="68" placeholder="Enter the name of the file" onkeypress="return /[0-9a-zA-Z() _-]/i.test(event.key)">
                                    </div>
                                    <div class="div_label_input">
                                        <label class="label_filename" for="description">Description</label>
                                        <input class="input_filename" required type="text" name="description" id="description" maxlength="68" placeholder="Enter the description of the file">
                                    </div>
                                </div>
                                <div class="div_button_group">
                                    <button type="button" class="button_save_file" id="button_cancel" onclick="dialogSEDCancel();">CANCEL</button>
                                    <button type="button" class="button_save_file" id="button_save" style="font-weight: bold;" onclick="onSave();">SAVE</button>
                                </div>
                            </form>
                        </div>
                        <div class="modal_footer">
                            <h3 class="h3_modal_footer" id="footer_date" onload="dialogSEDDate();"></h3>
                        </div>
                    </div>
                </div>
            </section>
        </article>
        `;


        try {
            // Only add { content } once
            if (document.querySelectorAll('.article_SaveEntityDetails').length  == 0) {
                init_MAIN_state = __MAIN__.innerHTML;  // store initial state
                __MAIN__.innerHTML += content;
            }
            
            // When the user clicks the [Save Entity details] option, open the modal 
            modal_SaveEntityDetails.style.display = "block";
            document.getElementById("filename").focus();
        } catch (error) {
            
        }    
}

function dialogSEDDate() {
    const footerDate = document.querySelector("#footer_date");
    if (!footerDate) {
        return;
    }
    footerDate.value = Utils.getCurrentDate();
}

// When the user clicks on [Cancel] button, clean input elements
function dialogSEDCancel() {
    const filename = document.querySelector("#filename");
    const description = document.querySelector("#description");
    if (!filename || !description) {
        return;
    }
    filename.value = '';
    description.value = '';
    filename.focus();
}

// When the user clicks on [Cancel] button, clean input elements and close the modal
function dialogSEDClose() {
    dialogSEDCancel();

    // Get the modal
    const modalSaveEntityDetails = document.getElementById("modal_SaveEntityDetails");
    if (!modalSaveEntityDetails) {
        return;
    }
    modalSaveEntityDetails.style.display = "none";

    // Restoring initial state
    __MAIN__.innerHTML = init_MAIN_state;
}

// Add Listeners
function dialogSEDAddListeners() {
    // Add event listener for [button_cancel] element
    const buttonCancel = document.querySelector("#button_cancel");
    if (!buttonCancel) {
       return;
    }
    buttonCancel.addEventListener("click", dialogSEDCancel);

    // Add event listener for [span_close] element
    const spanClose = document.querySelector("#button_cancel");
    if (!spanClose) {
       return;
    }
    spanClose.addEventListener("click", dialogSEDClose);

    
    const footerDate = document.querySelector("#footer_date");
    if (!footerDate) {
        return;
    }
    footerDate.addEventListener("load", dialogSEDDate);
}

document.addEventListener("DOMContentLoaded", dialogSEDAddListeners);