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
                    let index0 = sql_sentence.toUpperCase().indexOf('CREATE TABLE');  // entity name is between CREATE TABLE and the first '(' occurrence
                    let index1 = index0 + 'CREATE TABLE'.length + 1;  // index before the entity name
                    let index2 = sql_sentence.indexOf('(');  // index after the entity name  :  [index1] => entity_name <= [index2]
                    entity_name = sql_sentence.substring(index1, index2).trim().toUpperCase();  // entity name (removing whitespace)
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
                                // Looking for primary key(s)
                                let pk_index = alter_table_key_sentence.toUpperCase().indexOf('PRIMARY KEY') + 'PRIMARY KEY'.length;
                                let pk_sentence_length = alter_table_key_sentence.length;
                                let pk_opening_index = -1, pk_closing_index = -1;  
                                for (pk_index; pk_index < pk_sentence_length; pk_index++) {
                                    if (alter_table_key_sentence.charAt(pk_index) == '(') {
                                        pk_opening_index = pk_index + 1;  // getting the index of the first opening parenthesis occurrence
                                    }
                                    else if (alter_table_key_sentence.charAt(pk_index) == ')' && pk_opening_index > -1 && pk_opening_index < pk_index) {
                                        pk_closing_index = pk_index;  // getting the index of the first closing parenthesis occurrence
                                        break;  // ending the loop
                                    }
                                }
                                // Getting primary key(s)
                                if (pk_opening_index > -1 && pk_closing_index > -1) {
                                    let pk = alter_table_key_sentence.substring(pk_opening_index, pk_closing_index).trim().split(',');  // removes whitespaces and split it in case there are multiple keys
                                    pk_array.length = pk_array.length + pk.length;
                                    for (let i = 0; i < pk.length; i++) {  // removes whitespaces
                                        pk_array[i] = pk[i].trim().toUpperCase();
                                    }
                                }
                            }  // END - Algorithm to know the PRIMARY KEY(s) of the entity
                            // Looking for FOREIGN KEY(s)
                            else if (alter_table_key_sentence.toUpperCase().indexOf('FOREIGN KEY') > -1) {  // START - Algorithm to know the FOREIGN KEY(s) of the entity
                                // Looking for foreign key(s)
                                let fk_index = alter_table_key_sentence.toUpperCase().indexOf('FOREIGN KEY') + 'FOREIGN KEY'.length;
                                let fk_sentence_length = alter_table_key_sentence.length;
                                let fk_opening_index = -1, fk_closing_index = -1;  
                                for (fk_index; fk_index < fk_sentence_length; fk_index++) {
                                    if (alter_table_key_sentence.charAt(fk_index) == '(') {
                                        fk_opening_index = fk_index + 1;  // getting the index of the first opening parenthesis occurrence
                                    }
                                    else if (alter_table_key_sentence.charAt(fk_index) == ')' && fk_opening_index > -1 && fk_opening_index < fk_index) {
                                        fk_closing_index = fk_index;  // getting the index of the first closing parenthesis occurrence
                                        break;  // ending the loop
                                    }
                                }
                                // Getting foreign key(s)
                                if (fk_opening_index > -1 && fk_closing_index > -1) {
                                    if (alter_table_key_sentence.substring(fk_opening_index, fk_closing_index).indexOf(',') > -1) { // multiple foreign keys in the same ALTER TABLE sentence
                                        let fk_multiple = alter_table_key_sentence.substring(fk_opening_index, fk_closing_index).trim().split(',');  // removes whitespaces and split it in case there are multiple keys
                                        fk_array.length = fk_array.length + fk_multiple.length;  // increase the size of the array for the new items
                                        
                                        for (let i = 0; i < fk_multiple.length; i++) {  // removes whitespaces
                                            fk_array[i] = fk_multiple[i].trim().toUpperCase();
                                            console.log(`LOOP ${entity_name} => fk_array [${i}]: ${fk_multiple[i]}`);
                                        }
                                    } else {  // only one foreign key in the ALTER TABLE sentence
                                        let fk_single = alter_table_key_sentence.substring(fk_opening_index, fk_closing_index).trim();  // removes whitespaces
                                        fk_array.length++;  // increase the size of the array in one for the new item
                                        fk_array[fk_array.length - 1] = fk_single.toUpperCase();
                                    }  
                                }
                            }  // END - Algorithm to know the FOREIGN KEY(s) of the entity
                            //
                            //
                            // START - Algorithm to know the RELATIONSHIPS among of the entities
                            if (alter_table_key_sentence.toUpperCase().indexOf('REFERENCES') > -1 ) {  // asking if the sentence has the 'REFERENCES' SQL keyword
                                // START - Algorithm to know the ENTITY NAME of 'REFERENCES'
                                let sentence_length = alter_table_key_sentence.length;
                                let entity_reference_name = '';
                                let index00 = alter_table_key_sentence.toUpperCase().indexOf('REFERENCES');  // entity name is between REFERENCES and the first '(' occurrence after its name
                                let index01 = index00 + 'REFERENCES'.length + 1;  // index before the entity name
                                for (let index = index01; index < sentence_length; index++) {
                                    if (entity_reference_name.length > 0 && alter_table_key_sentence.charAt(index) == ' ') {
                                        break;
                                    } else {
                                        entity_reference_name += alter_table_key_sentence.charAt(index);
                                    }
                                }
                                entity_reference_name = entity_reference_name.trim().toUpperCase();  // entity reference name (removing whitespace)

                                const relationship = {entityName:`${entity_name}`, entityReferenceName:`${entity_reference_name}`};
                                relationships_array.push(relationship);
                                // END - Algorithm to know the ENTITY NAME of 'REFERENCES'
                            }
                            // END - Algorithm to know the RELATIONSHIPS between the entities
                        }
                    }

                    console.log(`BEFORE LOOP => pk_array: ${pk_array}\npk_array length: ${pk_array.length}`);
                    console.log(`BEFORE LOOP => fk_array: ${fk_array}\nfk_array length: ${fk_array.length}`);
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

                    console.log(`AFTER LOOP => pk_array: ${pk_array}\npk_array length: ${pk_array.length}`);
                    console.log(`AFTER LOOP => fk_array: ${fk_array}\nfk_array length: ${fk_array.length}`);
                }
                

                plantumlCode = Oracle.plantuml_entity(plantumlCode, entity_name, pk_array, fk_array, `this is the entity ${entity_name}`);
            }
            // Establishing the relationships between entities
            
            plantumlCode = Oracle.plantuml_relationships(plantumlCode, relationships_array);
            // END - PlantUML
            plantumlCode = Oracle.plantuml_end(plantumlCode);  // endding the definition of PlantUML syntax

        
            return plantumlCode;
        }
    }
};






