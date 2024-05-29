

Utils = {
    
    getStringBetweenStrings: function(str_sentence, str_prior, str_next) {
        let result = '';
        
        if (str_sentence != null && str_sentence.length > 0 && str_prior != null && str_next != null) {
            let index_prior = str_sentence.toUpperCase().indexOf(str_prior.toUpperCase());  // looking for the first ocurrence of {str_prior}
            
            if (index_prior > -1) {
                index_prior += (str_prior.length + 1);  // pointing just prior to the string of interest
                let index_next = str_sentence.toUpperCase().indexOf(str_next.toUpperCase(), index_prior);  // looking for the first ocurrence of {str_next} after the string of interest
                
                if (index_next > -1) {
                    result = str_sentence.substring(index_prior, index_next).replaceAll('(', '').replaceAll(')', '').replaceAll(' ', '');  // replacing '(' , ')' and ' ' for '', just in case
                }
            } 
        }
        
        return result;
    },


    getStringArrayBetweenComma: function (str) {
        let result = new Array();

        if (str != null && str.length > 0) {
            result = str.replaceAll('(', '').replaceAll(')', '').replaceAll(' ', '').split(',');  // replacing '(' , ')' and ' ' for '', just in case
        }

        return result;
    },


    /**
     * This method allows representing a TEntity type object in table format in HTML
     * @param {*} entity Receives a TEntiy type object that contains in an array the list of columns (TColumn object) of the entity
     * @returns Returns the result in a representation of the entity in HTML table format
     */
    generateHTMLTableFromEntity: function(entity) {
        let result = '';

        if (entity != null && entity != undefined && Array.isArray(entity.columns_array) && entity.columns_array.length > 0) {            
            
            let html_caption = `
                <caption>
                    ${entity.description}
                </caption>
            `;

            let html_thead = `
                <thead>
                    <tr>
                        <th>Column name</th>
                        <th>Data type</th>
                    </tr>
                </thead>
            `;
            
            let html_tbody = '<tbody>';
                entity.columns_array.forEach(column => {
                    html_tbody += `
                        <tr>
                            <td>${column.name}</td>
                            <td>${column.data_type}</td>
                        </tr>
                    `;
                });
            html_tbody += '</tbody>';

            let html_tfoot = `
                <tfoot>
                    <tr>
                        <th scope="row" colspan="2"></th>
                    </tr>
                </tfoot>
            `;

            let html_table = `
                <table class="table_entity">
                    ${html_caption}
                    ${html_thead}
                    ${html_tbody}
                    ${html_tfoot}
                </table>
            `;

            let entity_name = entity.name.substring(entity.name.indexOf('.') + 1, entity.name.length).trim().toUpperCase();
            let html_div = `
                <div class="div_entiy_master">
                    <div class="div_square_E">E</div>
                    <a class="a_entity_name" href="data/ListTables.html#${entity_name}" target="_blank" rel="noopener noreferrer">${entity_name}</a>

                    <!-- Popup message box -->
                    <div class="popup">
                        <span class="popuptext">Scroll the table to see more rows</span>
                    </div>

                    <div class="div_entity_table">
                        ${html_table}
                    </div>
                </div> 
            `;


            result = html_div;
        }

        return result;
    },


    generateHTMLDocument: function(content) {
        let result = '';
        

        let html = `
            <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta name="description" content="Details of database entities">
                    <title>Entity details</title>
                    <style>
                        :root {
                            /* Color Hunt Palette 2650732d95969ad0c2f1fada - https://colorhunt.co/palette/2650732d95969ad0c2f1fada */
                            --color-01: #265073;
                            --color-02: #2D9596;
                            --color-03: #9AD0C2;
                            --color-04: #ebebeb;
                            --color-05: #333333;
                            /* Other colors */
                            --white: #fcfcfc;
                            --shadow: #808080;
                            --black: #121212;
                        
                            --color-accent: #6200ee;
                            --color-highlight-control: #1e90ff;
                            --color-highlight-fill-control-green: #04AA6D;
                            --color-highlight-fill-control-red: #dc143c;
                            --color-highlight-fill-control-blue: #1e90ff;
                            --field-background: #f0f0f0;
                            --field-background--hover: #e2e2e2;
                        
                            /* Theme colors */
                            --theme-color: var(--color-04);
                            --theme-color-dark: var(--black);
                            --elements-backgroud-color: var(--color-01);
                            --elements-backgroud-color-alter: var(--color-02);
                            --elements-backgroud-color-other: var(--color-03);
                            --backgroud-color: var(--color-05);
                            --background-color-alter: #dddddd;
                        
                            /* Navbar colors */
                            --navbar-theme-color: var(--theme-color-dark);
                            --navbar-shadow-color: var(--shadow);
                            --navbar-hover-color: var(--elements-backgroud-color);
                            
                            /* Font text colors */
                            --text-color: var(--black);
                            --text-color-inverse: var(--theme-color);
                            
                            /* Settings */
                            --margin: 1%;
                            --min-width: 360px;
                            --max-width: 100%;
                        }
                        
                        /* General styles */
                        * {
                            box-sizing: border-box;
                        }
                        
                        html {
                            scroll-behavior: smooth;
                        }

                        header {
                            margin: 0 auto;
                            width: 900px;
                            top: 0;
                        }

                        body {
                            font-family: Helvetica, sans-serif;
                            background-color: var(--theme-color);
                            color: var(--text-color);
                            margin: 0 auto;
                            padding: 0 0.7%;
                            min-width: var(--min-width);
                            max-width: var(--max-width);
                        }

                        h1 {
                            font-size: 28px;
                            font-weight: bold;
                            text-align: center;
                        }

                        /* Table styles */
                        table {
                            border-collapse: collapse;
                            border-radius: 5px 5px 0 0;
                            overflow: hidden;
                            border-spacing: 0;
                            margin: 0 auto;
                            width: 800px;
                            background-color: var(--field-background);
                            font-size: 0.9em;
                            box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
                        }

                        caption {
                            caption-side: bottom;
                            text-align: left;
                            line-height: 36px;
                            font-size: 14px;
                            font-weight: bold;
                        }

                        thead {
                            background-color: var(--elements-backgroud-color-alter);
                            line-height: 32px;
                            height: 32px;
                            padding: 0;
                        }

                        tbody {
                            overflow-y: scroll; /* Show vertical scrollbar */
                            overflow-x: scroll; /* Show horizontal scrollbar */
                            max-height: 435px;
                        }

                        tbody tr:nth-of-type(even) {
                            background-color: var(--field-background--hover);
                        }

                        tbody tr:last-of-type {
                            border-bottom: 3px solid var(--elements-backgroud-color-alter);
                        }
                        
                        /* To display the block as level element */
		                tbody,
		                thead {
		                	display: block;
		                }

                        thead tr th {
		                	height: 32px;
		                	line-height: 32px;
                            color: var(--text-color-inverse);
                            font-weight: bold;
                            text-align: left;
                            text-transform: uppercase;
		                }

                        tbody tr {
                            border-bottom: 1px solid var(--background-color-alter);
                        }

                        tbody tr:hover {
                            color: var(--elements-backgroud-color-alter);
                            font-weight: bold;
                        }

                        tbody tr td {
                            line-height: 24px;
                            height: 24px;
                        }

                        tr th,
                        tr td {
                            cursor: default;
                            padding: 0 12px;
                        }

                        thead th,
                        tbody td
		                {
		                	width: 400px;
		                }

                        .div_entiy_master {
                            margin: 1em auto 2.8em auto;
                            width: 900px;
                        }

                        .div_square_E {
                            display: inline-block; 
                            margin: 0 0px 4px 50px;
                            padding: 0;
                            width: 32px;
                            height: 32px;
                            line-height: 32px;
                            border-radius: 3px;
                            font-size: 24px;
                            font-weight: bold;
                            text-align: center;
                            background-color: var(--elements-backgroud-color-other);
                        }
                        
                        .div_entity_table {
                            padding: 0 12px;
                        }

                        .a_entity_name {
                            display: inline-block;
                            text-decoration: none;
                            line-height: 32px;
                            height: 32px;
                            font-size: 24px;
                            margin: 0;
                            padding: 0 0 0 10px;
                            font-weight: bold;
                        }

                        /* Navigation buttons for page scrolling */
                        .navigation-container {
                            display: inline-block;
                            top: 50%;
                            right: 20px;
                            transform: translateY(-50%);
                            width: 100px;
                            height: 260px;
                            position: fixed;
                            margin: 0;
                            padding: 0 auto;
                            border-radius: 5px;
                            text-align: center;
                            z-index: 99;
                        }
                        
                        .navigation-button {
                            width: 50px;
                            height: 50px;
                            margin: 5px auto;
                            padding: 10px;
                            border-radius: 50%;
                            text-align: center;
                            cursor: pointer;
                            
                        }

                        .navigation-button:hover {
                            background-color: var(--elements-backgroud-color-other);
                            box-shadow: 0 0 20px rgba(154, 208, 194, 1.0);
                        }

                        .navigation-button:active {
                            background-color: var(--elements-backgroud-color-other);
                            box-shadow: 0 0 20px rgba(154, 208, 194, 1.0);
                            box-shadow: inset -5px -5px 10px 0px rgba(255, 255, 255, 0.5), inset 5px 5px 10px 0px rgba(0, 0, 0, 0.3);
                        }

                        .svg-icon {
                            display: block;
                            margin: auto;
                            height: 100%;
                            width: 100%;
                        }

                        .display-counter {
                            font-size: 18px;
                            color: var(--color-highlight-fill-control-red);
                            margin: 0;
                            padding: auto 0;
                        }

                        .div_bottom {
                            background-color: transparent;
                            height: 10px;
                            margin: 0;
                        }

                        /* Popup container */
                        .popup {
                            float: right;
                            position: relative;
                            cursor: pointer;
                            -webkit-user-select: none;
                            -moz-user-select: none;
                            -ms-user-select: none;
                            user-select: none;
                            width: 300px;
                            height: 40px;
                            margin: 0 50px 0px 0;
                            top: 0px;
                        }

                        /* The actual popup */
                        .popup .popuptext {
                            visibility: hidden;
                            width: 300px;
                            line-height: 17px;
                            background-color: var(--backgroud-color);
                            color: var(--white);
                            font-size: 16px;
                            text-align: center;
                            border-radius: 6px;
                            padding: 8px 0;
                            position: absolute;
                            z-index: 1;
                        }

                        /* Popup arrow */
                        .popup .popuptext::after {
                            content: "";
                            position: absolute;
                            top: 100%;
                            left: 90%;
                            margin-left: -5px;
                            border-width: 5px;
                            border-style: solid;
                            border-color: var(--backgroud-color) transparent transparent transparent;
                        }

                        /* Toggle this class - hide and show the popup */
                        .popup .show {
                            visibility: visible;
                            -webkit-animation: fadeIn 1s;
                            animation: fadeIn 1s;
                        }

                        /* Add animation (fade in the popup) */
                        @-webkit-keyframes fadeIn {
                            from {opacity: 0;} 
                            to {opacity: 1;}
                        }

                        @keyframes fadeIn {
                            from {opacity: 0;}
                            to {opacity:1 ;}
                        }
                    </style>
                </head>
                <body>
                    <header>
                        <h1>Entity details</h1>
                    </header>

                    <main>
        `;
        if (content != null && content != undefined && content.length > 0) {
            html += `${content}`;
        }
        html += `


                        <div class="navigation-container">
                            <div class="navigation-button" id="button-top" onclick="gotoTop();">
                                <svg class="svg-icon" version="1.1" id="icon-top" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 120.64" style="enable-background:new 0 0 122.88 120.64" xml:space="preserve"><g><path d="M108.91,66.6c1.63,1.55,3.74,2.31,5.85,2.28c2.11-0.03,4.2-0.84,5.79-2.44l0.12-0.12c1.5-1.58,2.23-3.6,2.2-5.61 c-0.03-2.01-0.82-4.01-2.37-5.55C102.85,37.5,84.9,20.03,67.11,2.48c-0.05-0.07-0.1-0.13-0.16-0.19C65.32,0.73,63.19-0.03,61.08,0 c-2.11,0.03-4.21,0.85-5.8,2.45l-0.26,0.27C37.47,20.21,19.87,37.65,2.36,55.17C0.82,56.71,0.03,58.7,0,60.71 c-0.03,2.01,0.7,4.03,2.21,5.61l0.15,0.15c1.58,1.57,3.66,2.38,5.76,2.41c2.1,0.03,4.22-0.73,5.85-2.28l47.27-47.22L108.91,66.6 L108.91,66.6z M106.91,118.37c1.62,1.54,3.73,2.29,5.83,2.26c2.11-0.03,4.2-0.84,5.79-2.44l0.12-0.12c1.5-1.57,2.23-3.6,2.21-5.61 c-0.03-2.01-0.82-4.02-2.37-5.55C101.2,89.63,84.2,71.76,67.12,54.24c-0.05-0.07-0.11-0.14-0.17-0.21 c-1.63-1.55-3.76-2.31-5.87-2.28c-2.11,0.03-4.21,0.85-5.8,2.45C38.33,71.7,21.44,89.27,4.51,106.8l-0.13,0.12 c-1.54,1.53-2.32,3.53-2.35,5.54c-0.03,2.01,0.7,4.03,2.21,5.61l0.15,0.15c1.58,1.57,3.66,2.38,5.76,2.41 c2.1,0.03,4.22-0.73,5.85-2.28l45.24-47.18L106.91,118.37L106.91,118.37z"/></g></svg>
                            </div>
                            <div class="navigation-button" id="button-up" onclick="gotoPrevious();">
                                <svg class="svg-icon" version="1.1" id="icon-up" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 66.91" style="enable-background:new 0 0 122.88 66.91" xml:space="preserve"><g><path d="M11.68,64.96c-2.72,2.65-7.08,2.59-9.73-0.14c-2.65-2.72-2.59-7.08,0.13-9.73L56.87,1.97l4.8,4.93l-4.81-4.95 c2.74-2.65,7.1-2.58,9.76,0.15c0.08,0.08,0.15,0.16,0.23,0.24L120.8,55.1c2.72,2.65,2.78,7.01,0.13,9.73 c-2.65,2.72-7,2.78-9.73,0.14L61.65,16.5L11.68,64.96L11.68,64.96z"/></g></svg>
                            </div>
                            <div class="display-counter" id="display-counter">
                                00 / 00
                            </div>
                            <div class="navigation-button" id="button-down" onclick="gotoNext();">
                                <svg class="svg-icon" version="1.1" id="icon-down" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 66.91" style="enable-background:new 0 0 122.88 66.91" xml:space="preserve"><g><path d="M11.68,1.95C8.95-0.7,4.6-0.64,1.95,2.08c-2.65,2.72-2.59,7.08,0.13,9.73l54.79,53.13l4.8-4.93l-4.8,4.95 c2.74,2.65,7.1,2.58,9.75-0.15c0.08-0.08,0.15-0.16,0.22-0.24l53.95-52.76c2.73-2.65,2.79-7.01,0.14-9.73 c-2.65-2.72-7.01-2.79-9.73-0.13L61.65,50.41L11.68,1.95L11.68,1.95z"/></g></svg>
                            </div>
                            <div class="navigation-button" id="button-bottom" onclick="gotoBottom();">
                                <svg class="svg-icon" version="1.1" id="icon-bottom" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 120.64" style="enable-background:new 0 0 122.88 120.64" xml:space="preserve"><g><path d="M108.91,54.03c1.63-1.55,3.74-2.31,5.85-2.28c2.11,0.03,4.2,0.84,5.79,2.44l0.12,0.12c1.5,1.58,2.23,3.6,2.2,5.61 c-0.03,2.01-0.82,4.02-2.37,5.55c-17.66,17.66-35.61,35.13-53.4,52.68c-0.05,0.07-0.1,0.13-0.16,0.19 c-1.63,1.55-3.76,2.31-5.87,2.28c-2.11-0.03-4.21-0.85-5.8-2.45l-0.26-0.27C37.47,100.43,19.87,82.98,2.36,65.46 C0.82,63.93,0.03,61.93,0,59.92c-0.03-2.01,0.7-4.03,2.21-5.61l0.15-0.15c1.58-1.57,3.66-2.38,5.76-2.41 c2.1-0.03,4.22,0.73,5.85,2.28l47.27,47.22L108.91,54.03L108.91,54.03z M106.91,2.26c1.62-1.54,3.73-2.29,5.83-2.26 c2.11,0.03,4.2,0.84,5.79,2.44l0.12,0.12c1.5,1.57,2.23,3.6,2.21,5.61c-0.03,2.01-0.82,4.02-2.37,5.55 C101.2,31.01,84.2,48.87,67.12,66.39c-0.05,0.07-0.11,0.14-0.17,0.21c-1.63,1.55-3.76,2.31-5.87,2.28 c-2.11-0.03-4.21-0.85-5.8-2.45C38.33,48.94,21.44,31.36,4.51,13.83l-0.13-0.12c-1.54-1.53-2.32-3.53-2.35-5.54 C2,6.16,2.73,4.14,4.23,2.56l0.15-0.15C5.96,0.84,8.05,0.03,10.14,0c2.1-0.03,4.22,0.73,5.85,2.28l45.24,47.18L106.91,2.26 L106.91,2.26z"/></g></svg>
                            </div>
                        </div>

                        <div class="div_bottom" id="div_bottom"></div>


                        <script>
                            /* To navigate through 'div_entiy_master' elements */                  
                            const div_entiy_master_COLLECTION = document.getElementsByClassName('div_entiy_master');
                            const entity_counter = div_entiy_master_COLLECTION.length;
                            var entity_shown_index = 1;

                            function setDisplayCounter(index, count) {
                                document.getElementById('display-counter').innerText = \`\${index} / \${count}\`;
                            }
                            setDisplayCounter(entity_shown_index, entity_counter);
                        
                            function isElementShown(element) { 
                                const elementTop = element.offsetTop; 
                                const elementBottom = elementTop + element.offsetHeight; 
                                const viewportTop = window.pageYOffset; 
                                const viewportBottom = viewportTop + window.innerHeight; 
                            
                                return ( elementBottom > viewportTop && elementTop < viewportBottom ); 
                            }
                        
                            function hasScrollReachedEnd() {
                                const scrolledTo = window.scrollY + window.innerHeight;
                                const isReachBottom = document.body.scrollHeight - scrolledTo < 50;
                            
                                return isReachBottom;
                            }
                        
                            /* Scroll event to update status */
                            window.addEventListener('scroll', (event) => {
                                // To find the first element currently shown in the Viewport
                                for (let i = 0; i < entity_counter; i++) {
                                    if (isElementShown(div_entiy_master_COLLECTION[i])) {
                                        if (!hasScrollReachedEnd()) {
                                            entity_shown_index = i + 1;
                                        } else {
                                            entity_shown_index = entity_counter;
                                        }
                                    
                                        setDisplayCounter(entity_shown_index, entity_counter);
                                        break;
                                    }
                                }  
                            });
                        
                            /* Methods to go to Top, Bottom, Up, Down to navigate through the document */
                            function goto(x, y) {
                                document.body.scrollTo(x, y); // For Safari
                                document.documentElement.scrollTo(x, y); // For Chrome, Firefox, IE and Opera
                            }
                        
                            function gotoTop() {
                                goto(0, 0);
                                entity_shown_index = 1;
                            }
                        
                            function gotoPrevious() {
                                if (entity_shown_index > 1) {
                                    entity_shown_index--; // decrement in 1                          
                                    let entiyRect = div_entiy_master_COLLECTION[entity_shown_index - 1].getBoundingClientRect();
                                    let bodyRect = document.body.getBoundingClientRect();
                                    goto(0, entiyRect.top - bodyRect.top); // offset
                                }
                            }
                        
                            function gotoNext() {
                                if (entity_shown_index < entity_counter) {
                                    entity_shown_index++; // increment in 1
                                    let entiyRect = div_entiy_master_COLLECTION[entity_shown_index - 1].getBoundingClientRect();
                                    let bodyRect = document.body.getBoundingClientRect();
                                    goto(0, entiyRect.top - bodyRect.top); // offset
                                }
                            }
                        
                            function gotoBottom() {
                                goto(0, document.body.scrollHeight);
                                entity_shown_index = entity_counter;
                            }
                        
                            /* Popup message */
                            function showPopupMessage(index = null) {
                                if (index != null && index != undefined && index > -1) {
                                    let popup_message_container = document.getElementsByClassName('popuptext');
                                    popup_message_container[index].classList.toggle('show');
                                    setTimeout(function() {popup_message_container[index].classList.toggle('show')}, 3000);
                                }
                            }
                        
                            /* Pointer enter event to show a popup message indicating that
                            the table must be scrolled to see more rows */
                            document.querySelectorAll('.div_entiy_master').forEach((entity) => {
                                entity.addEventListener('pointerenter', () => {
                                    if (div_entiy_master_COLLECTION[entity_shown_index - 1].querySelectorAll('tr').length > 19) {
                                        showPopupMessage(entity_shown_index - 1);
                                    }
                                })
                            });

                            /* Click event of navigation buttons to show a popup message indicating that
                            the table must be scrolled to see more rows */
                            document.querySelectorAll('.navigation-button').forEach(button => {
                                button.addEventListener('click', () => {
                                    if (div_entiy_master_COLLECTION[entity_shown_index - 1].querySelectorAll('tr').length > 19) {
                                        showPopupMessage(entity_shown_index - 1);
                                    }
                                })
                            });
                        </script>

                    </main>
                </body>
            </html>
        `;
        result = html;

        return result;
    }
};
