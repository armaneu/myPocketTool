/**
 * This file contents all functionalities and definitions related to SQL DDL to PlantUML conversion
 */

// CARDINALITY notation definition
const Zero_or_One  = {notation_uml:'0..1', notation_symbol:'|o'};
const Exactly_One  = {notation_uml:'1..1', notation_symbol:'||'};
const Zero_or_Many = {notation_uml:'0..*', notation_symbol:'}o'};
const One_or_Many  = {notation_uml:'1..*', notation_symbol:'}|'};



Oracle = {
    encode: function(s) { return unescape(encodeURIComponent(s)); },
    decode: function(s) { return decodeURIComponent(  escape(s)); },

    /**
    * This method creates the initial part of the PlantUML code
    * @returns plantumlCode
    */
    plantuml_start: function() {
        let plantumlCode = '';

        plantumlCode += '@startuml\n\n';
        plantumlCode += 'left to right direction\n';
        plantumlCode += 'skinparam roundcorner 5\n';
        plantumlCode += 'skinparam linetype ortho\n';
        plantumlCode += 'skinparam shadowing false\n';
        plantumlCode += 'skinparam handwritten false\n';
        plantumlCode += 'skinparam class {\n';
        plantumlCode += '    BackgroundColor PaleTurquoise\n';
        plantumlCode += '}\n\n';

        return plantumlCode;
    },

    /**
     * 
     * @param {*} puml_code 
     * @returns 
     */
    plantuml_end: function(puml_code) {
        let plantumlCode = puml_code;
        
        plantumlCode += '@enduml';

        return plantumlCode;
    },


    plantuml_entity: function(puml_code, entity_name, entity_pk_array = null, entity_fk_array = null, entity_description = null) {
        let plantumlCode = puml_code;

        if (entity_name != null && entity_name.length > 0) {
            // Setting the ENTITY NAME
            plantumlCode += `entity ${entity_name} {\n`;  // entity name
            // Setting PRIMARY KEY(s)
            if (entity_pk_array != null && Array.isArray(entity_pk_array)) {
                for (const pk of entity_pk_array) {  // primary key(s)
                    if (pk != null && pk != '') {
                        plantumlCode += `* ${pk}\n`;
                    }
                }
            }
            plantumlCode += '--\n';  // separator
            // Setting FOREIGN KEY(s)
            if (entity_fk_array != null && Array.isArray(entity_fk_array)) {
                for (const fk of entity_fk_array) {  // foreign key(s)
                    if (fk != null && fk != '') {
                        plantumlCode += `* ${fk}\n`;
                    }
                }
            }
            plantumlCode += '--\n';  // separator
            // Setting Description
            if (entity_description != null && entity_description.length > 0) {  // entity description
                plantumlCode += `${entity_description}\n`;
            }
            plantumlCode += '}\n\n';  // closing
        }
        
        return plantumlCode;
    },

    plantuml_relationships: function(puml_code, relationships_array = null) {
        let plantumlCode = puml_code;
       
        if (relationships_array != null && Array.isArray(relationships_array)) {
            for (const relationship of relationships_array) {  // relationship
                if (relationship != null && relationship.entityName != '' && relationship.entityReferenceName != '') {
                    plantumlCode += `${relationship.entityName} -- ${relationship.entityReferenceName}\n`;  // establishing the relationship
                }
            }

            plantumlCode += '\n';  // closing
        }

        return plantumlCode;
    },

    /**
     * Method to analize the syntax of the SQL DDL given as parameter
     * @param {*} ddl_text 
     * @returns 
     */
    plantuml_parser: function(ddl_text) {
        if (ddl_text != null && ddl_text.length > 0) {
            const ddl_array = ddl_text.replace(/\n|\r|\t/g, ' ').split(';');      // split SQL DDL text into an array of SQL sentences
            const ddl_array_aux = ddl_text.replace(/\n|\r|\t/g, ' ').split(';');  // split SQL DDL text into an array of SQL sentences

            // START - PlantUML
            let plantumlCode = Oracle.plantuml_start();  // starting the definition of PlantUML syntax
            let relationships_array = new Array();  // to store the relationships between the entitie
            
            for (const sql_sentence of ddl_array) {
                console.log(sql_sentence);

                // Getting the entity names and their primary and foreign keys
                let entity_name = '';
                let pk_array = new Array();  // to store the primary key(s)
                let fk_array = new Array();  // to store the foreign key(s)
                if (sql_sentence.toUpperCase().indexOf('CREATE TABLE') > -1 &&      // asking if it is a sentence of type  'CREATE TABLE'
                    sql_sentence.indexOf('(') > -1 &&                               // looking for the first occurrence of '('
                    sql_sentence.split('').reverse().join('').indexOf(')') > -1) {  // looking for the last occurrence of  ')'
                    
                    // START - Algorithm to know the ENTITY NAME of 'CREATE TABLE'
                    entity_name = Utils.getStringBetweenStrings(sql_sentence, 'CREATE TABLE', '(').toUpperCase();
                    // END   - Algorithm to know the ENTITY NAME of 'CREATE TABLE'
                    //
                    //
                    // START - Algorithm to know the PRIMARY KEY(s) and/or FOREIGN KEY(s) of the entity
                    for (const sql_sentence_aux of ddl_array_aux) {
                        // 'ALTER TABLE' type sentences
                        const alter_table_key_sentence = sql_sentence_aux.split(' ').filter(word => word !== '').join(' ');  //ensure that words are separated only by whitespace
                        if (alter_table_key_sentence.toUpperCase().indexOf(`ALTER TABLE ${entity_name} `) > -1 &&  // asking if it's a sentence of type 'ALTER TABLE'
                            alter_table_key_sentence.toUpperCase().indexOf('DROP') < 0) {                          // making sure it's not a DROP type sentence
                            
                            // Looking for PRIMARY KEY(s)
                            if (alter_table_key_sentence.toUpperCase().indexOf('PRIMARY KEY') > -1) {  // START - Algorithm to know the PRIMARY KEY(s) of the entity
                                // Getting primary key(s)                    
                                let pk = Utils.getStringBetweenStrings(alter_table_key_sentence, 'PRIMARY KEY (', ')').toUpperCase().split(',');  // split it in case there are multiple keys
                                pk_array.length = pk_array.length + pk.length;
                                for (let i = 0; i < pk.length; i++) {  // removes whitespaces
                                    pk_array[i] = pk[i].trim().toUpperCase();
                                }
                            }  // END - Algorithm to know the PRIMARY KEY(s) of the entity
                            // Looking for FOREIGN KEY(s)
                            else if (alter_table_key_sentence.toUpperCase().indexOf('FOREIGN KEY') > -1) {  // START - Algorithm to know the FOREIGN KEY(s) of the entity                
                                // Getting foreign key(s)
                                if (Utils.getStringBetweenStrings(alter_table_key_sentence, 'FOREIGN KEY (', ')').indexOf(',') > -1) { // multiple foreign keys in the same ALTER TABLE sentence
                                    let fk_multiple = Utils.getStringBetweenStrings(alter_table_key_sentence, 'FOREIGN KEY (', ')').toUpperCase().split(',');  // split it in case there are multiple keys
                                    fk_array.length = fk_array.length + fk_multiple.length;  // increase the size of the array for the new items
                                    
                                    for (let i = 0; i < fk_multiple.length; i++) {  // removes whitespaces
                                        fk_array[i] = fk_multiple[i].trim().toUpperCase();
                                    }
                                } else {  // only one foreign key in the ALTER TABLE sentence
                                    let fk_single = Utils.getStringBetweenStrings(alter_table_key_sentence, 'FOREIGN KEY (', ')').toUpperCase();
                                    fk_array.length++;  // increase the size of the array in one for the new item
                                    fk_array[fk_array.length - 1] = fk_single.toUpperCase();
                                }  
                            }  // END - Algorithm to know the FOREIGN KEY(s) of the entity
                            //
                            //
                            //
                            // START - Algorithm to know the RELATIONSHIPS among of the entities
                            if (alter_table_key_sentence.toUpperCase().indexOf('REFERENCES') > -1 ) {  // asking if the sentence has the 'REFERENCES' SQL keyword
                                let entity_reference_name = Utils.getStringBetweenStrings(alter_table_key_sentence, 'REFERENCES', '(').toUpperCase();
                                const relationship = {entityName:`${entity_name}`, entityReferenceName:`${entity_reference_name}`};
                                relationships_array.push(relationship);
                            }
                            // END - Algorithm to know the RELATIONSHIPS between the entities
                        }
                    }

                    // There are some foreign key which are primary keys, in tha case must identify them as 
                    // PK : Primary Key,  PF : Primary Foreign,  FK : Foreign Key
                    let pk_length = pk_array.length, fk_length = fk_array.length;
                    let key_type = '';  // possible values: (PK), (FK), (PF)
                    for (let i = 0; i < pk_length; i++) {
                        key_type = '(PK)';
                        for (let j = 0; j < fk_length; j++) {
                            if (pk_array[i] == fk_array[j]) {
                                key_type = '(PF)';  // it is a Primary Foreign key (PF)
                                pk_array[i] = `${key_type}  ${pk_array[i]}`;  // to indicate it is a Primary Foreign key (PF)
                                fk_array[j] = '';  // to avoid showing duplicate value
                            }
                        }
                        // To indicate it is a Primary Key (PK)
                        if (key_type == '(PK)') {
                            pk_array[i] = `${key_type}  ${pk_array[i]}`;
                        }
                    }
                    // To indicate it is a Foreign Key (FK)
                    for (let k = 0; k < fk_length; k++) {
                        if (fk_array[k] != null && fk_array[k] != '') {
                            fk_array[k] = `(FK)  ${fk_array[k]}`;
                        }
                    }
                }
                

                plantumlCode = Oracle.plantuml_entity(plantumlCode, entity_name, pk_array, fk_array, `this is the entity ${entity_name}`);
            }
            
            // Establishing the relationships between entities
            plantumlCode = Oracle.plantuml_relationships(plantumlCode, relationships_array);
            
            // END - PlantUML
            plantumlCode = Oracle.plantuml_end(plantumlCode);  // ending the definition of PlantUML syntax

        
            return plantumlCode;
        }
    }
};






