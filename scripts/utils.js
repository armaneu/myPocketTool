

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
    }
};

UtilsSQL = {

    getColumnArray: function (str) {
        let result = new Array();

        if (str != null && str.length > 0 && str.toUpperCase().indexOf('CREATE TABLE') > -1) {
            let str_aux = str.split(' ').filter(word => word !== '').join(' ');  // ensure that words are separated only by whitespace
            str_aux = str_aux.replace(/\n|\r|\t/g, ' ').substring(str_aux.indexOf('(') + 1, str_aux.length - 1).trim();  // no including of opening 'and closing parenthesis
            
            let str_search = '';
            let indexStart = 0, indexEnd = 0;
            let separator = false;
            for (let index = 0; index < str_aux.length; index++) {
                if (str_aux.charAt(index) == ',') {                                       // loking for the comma used as separator
                    str_search = str_aux.substring(indexStart, index).trim();             // taking a portion of the string {str_aux} to analize it
                    if (str_search.includes('(') && str_search.includes(')')) {           // if there are opening and closing parenthesis
                        result.push(str_search);
                        index++;
                        indexStart = index;
                    } else if (!str_search.includes('(') && !str_search.includes(')')) {  // if there are no opening and closing parenthesis
                        result.push(str_search);
                        index++;
                        indexStart = index;
                    }
                } else if ((index + 1) == str_aux.length && str_search.includes('(') && str_search.includes(')')) {
                    str_search = str_aux.substring(indexStart, index + 1).trim();         // taking the last portion of the string {str_aux}
                    result.push(str_search);
                }
            }
        }

        return result;
    }
};