

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
                    Entity: ${entity.name.toUpperCase()}
                </caption>
            `;

            let html_thead = `
                <thead>
                    <tr>
                        <th>Column name</th>
                        <th>Data type</th>
                        <th>Mandatory</th>
                    </tr>
                </thead>
            `;
            
            let html_tbody = '<tbody>';
                entity.columns_array.forEach(column => {
                    html_tbody += `
                        <tr>
                            <td>${column.name}</td>
                            <td>${column.data_type}</td>
                            <td>${column.mandatory}</td>
                        </tr>
                    `;
                });
            html_tbody += '</tbody>';

            let html_tfoot = `
                <tfoot>
                    <tr>
                        <td colspan="2"></td>
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

            let html_div = `
                <div>
                    ${html_table}
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
