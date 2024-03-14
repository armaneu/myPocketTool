

Utils = {
    
    getStringBetweenStrings: function(str_sentence, str_prior, str_next) {
        let result = '';
        
        if (str_sentence != null && str_sentence.length > 0 && str_prior != null && str_next != null) {
            let index_prior = str_sentence.toUpperCase().indexOf(str_prior.toUpperCase());  // looking for the first ocurrence of {str_prior}
            
            if (index_prior > -1) {
                index_prior += (str_prior.length + 1);  // pointing just prior to the string of interest
                let index_next = str_sentence.toUpperCase().indexOf(str_next.toUpperCase(), index_prior);  // looking for the first ocurrence of {str_next} after the string of interest
                
                if (index_next > -1) {
                    result = str_sentence.substring(index_prior, index_next).trim();
                }
            } 
        }
        
        return result;
    }
};