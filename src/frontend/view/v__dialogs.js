
/**
 * Display the { Connection Parameters } view
 */
function dialogSaveEntityDetails() {
    const currentDate = Utils.getCurrentDate();
    const content = `
        <article class="article_SaveEntityDetails">
            <section>
                <!-- The Modal -->
                <div class="modal" id="modal_SaveEntityDetails">
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
                                        <input class="input_filename" type="text" name="description" id="description" maxlength="68" placeholder="Enter the description of the file">
                                    </div>
                                </div>
                                <div class="div_button_group">
                                    <button type="button" class="button_save_file" id="button_cancel" onclick="dialogSEDCancel();">CANCEL</button>
                                    <button type="submit" class="button_save_file" id="button_save" style="font-weight: bold;" onclick="dialogSEDSave();">SAVE</button>
                                </div>
                            </form>
                        </div>
                        <div class="modal_footer">
                            <h3 class="h3_modal_footer" id="footer_date">${currentDate}</h3>
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
}

document.addEventListener("DOMContentLoaded", dialogSEDAddListeners);


function dialogSEDSave() {
    let content = '', html = '';
    if (entity_full_list && Array.isArray(entity_full_list) && entity_full_list.length > 0) {
        const filename = document.querySelector("#filename");
        const description = document.querySelector("#description");
        const footer_date = document.querySelector('#footer_date');

        if (filename && filename.value.length > 0) {
            entity_full_list.forEach(entity => {
                content += Utils.generateHTMLTableFromEntity(entity);
            });
            html = Utils.generateHTMLDocumentSED(content, description.value, footer_date.innerHTML);

            let blob = new Blob([html], { type: "text/html"});
            let anchor = document.createElement("a");
            anchor.download = `Entity details - ${filename.value}.html`;
            anchor.href = window.URL.createObjectURL(blob);
            anchor.target ="_blank";
            anchor.style.display = "none"; // just to be safe!
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);

            dialogSEDClose();
        }
    }
}