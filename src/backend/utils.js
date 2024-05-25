

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
                        
                        * {
                            box-sizing: border-box;
                        }
                        
                        html {
                            scroll-behavior: smooth;
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
                    </main>
                </body>
            </html>
        `;
        result = html;

        return result;
    }
};
