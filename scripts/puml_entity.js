/**
 * This file contents all functionalities and definitions related to SQL DDL to PlantUML conversion
 */

// CARDINALITY notation definition
const _0_1_ = {notation_uml: '0..1', notation_symbol: '|o',};  // ZERO or ONE
const _1_1_ = {notation_uml: '1..1', notation_symbol: '||',};  // Exactly ONE
const _0_M_ = {notation_uml: '0..*', notation_symbol: '}o',};  // ZERO or MANY
const _1_M_ = {notation_uml: '1..*', notation_symbol: '}|',};  // ONE or MANY

/**
 * TKeyType object that defines the key type for an entity
 */
const TKeyType = {
    pk: 'PK',  // PK = Primary Key
    pf: 'PF',  // PF = Primary Foreign
    fk: 'FK',  // FK = Foreign Key
};

/**
 * TKey object for the key name and key type pair
 */
const TKey = {
    key_name: '',
    key_type: '',
};

/**
 * TEntity object to represent an entity
 */
const TEntity = {
    name: '',                   // entity name
    pk_array: new Array(),      // stores TKey objects of type primary key(s)
    pf_array: new Array(),      // stores TKey objects of type primary foreign key(s)
    fk_array: new Array(),      // stores TKey objects of type foreign key(s)
    description: '',            // brief description of the entity
    entity_array: new Array(),  // list of names of the source entities it is related to
};

/**
 * 'Namespace' of methods for Oracle database
 */
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


    plantuml_entity: function(puml_code, entity) {
        let plantumlCode = puml_code;

        if (entity.name != null && entity.name.length > 0) {
            // Setting the ENTITY NAME
            plantumlCode += `entity ${entity.name} {\n`;  // entity name
            // Setting PRIMARY KEY(s)
            if (entity.pk_array != null && Array.isArray(entity.pk_array)) {
                for (const pk of entity.pk_array) {  // primary key(s)
                    if (pk != null && pk != '') {
                        plantumlCode += `* ${pk}\n`;
                    }
                }
            }
            plantumlCode += '--\n';  // separator
            // Setting FOREIGN KEY(s)
            if (entity.fk_array != null && Array.isArray(entity.fk_array)) {
                for (const fk of entity.fk_array) {  // foreign key(s)
                    if (fk != null && fk != '') {
                        plantumlCode += `* ${fk}\n`;
                    }
                }
            }
            plantumlCode += '--\n';  // separator
            // Setting Description
            if (entity.description != null && entity.description.length > 0) {  // entity description
                plantumlCode += `${entity.description}\n`;
            }
            plantumlCode += '}\n\n';  // closing
        }
        
        return plantumlCode;
    },

    
    plantuml_relationship: function(puml_code, entity_full_list = null, cardinality_array = null) {
        let plantumlCode = puml_code;
       
        if (entity_full_list != null && Array.isArray(entity_full_list) && entity_full_list.length > 0) {
            entity_full_list.forEach(entity => {
                if (entity.entity_array != null && Array.isArray(entity.entity_array) && entity.entity_array.length > 0) {
                    entity.entity_array.forEach(entity_source => {
                        plantumlCode += `${entity.name} -- ${entity_source}\n`;  // establishing the relationship
                    });
                }
            });
        }

        plantumlCode += '\n';  // closing

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

            // @startuml =============================================================================
            let plantumlCode = Oracle.plantuml_start();  // starting the definition of PlantUML syntax
            // @startuml =============================================================================
            

            let entity_full_list = new Array();        // creating a list to store all the entities that will be found
            for (const sql_sentence of ddl_array) {
                console.log(sql_sentence);

                // Getting the entity names and their primary and foreign keys
                if (sql_sentence.toUpperCase().indexOf('CREATE TABLE') > -1 &&      // asking if it is a sentence of type  'CREATE TABLE'
                    sql_sentence.indexOf('(') > -1 &&                               // looking for the first occurrence of '('
                    sql_sentence.split('').reverse().join('').indexOf(')') > -1) {  // looking for the last occurrence of  ')'
                    
                    // START - Algorithm to know the ENTITY NAME of 'CREATE TABLE'
                    const entity = Object.create(TEntity);  // creating the object of type TEntity
                    entity.name = Utils.getStringBetweenStrings(sql_sentence, 'CREATE TABLE', '(').toUpperCase();
                    entity.pk_array = new Array();          // to store the primary key(s)
                    entity.pf_array = new Array();          // to store the primary foreign key(s)
                    entity.fk_array = new Array();          // to store the foreign key(s)
                    entity.entity_array = new Array();      // to store the related entities
                    // END  -  Algorithm to know the ENTITY NAME of 'CREATE TABLE'
                    //
                    //
                    // START - Algorithm to know the PRIMARY KEY(s) and/or FOREIGN KEY(s) of the entity
                    for (const sql_sentence_aux of ddl_array_aux) {
                        // 'ALTER TABLE' type sentences
                        const alter_table_key_sentence = sql_sentence_aux.split(' ').filter(word => word !== '').join(' ');  //ensure that words are separated only by whitespace
                        if (alter_table_key_sentence.toUpperCase().indexOf(`ALTER TABLE ${entity.name} `) > -1 &&  // asking if it's a sentence of type 'ALTER TABLE'
                            alter_table_key_sentence.toUpperCase().indexOf('DROP') < 0) {                          // making sure it's not a DROP type sentence
                            
                            // START - Algorithm to know the PRIMARY KEY(s) of the entity
                            if (alter_table_key_sentence.toUpperCase().indexOf('PRIMARY KEY') > -1) {
                                // Getting primary key(s)                    
                                let pk = Utils.getStringBetweenStrings(alter_table_key_sentence, 'PRIMARY KEY (', ')').toUpperCase().split(',');  // split it in case there are multiple keys
                                for (let i = 0; i < pk.length; i++) {  // removes whitespaces
                                    entity.pk_array.push(pk[i].trim().toUpperCase());
                                }
                            }
                            // END  -  Algorithm to know the PRIMARY KEY(s) of the entity
                            //
                            // START - Algorithm to know the FOREIGN KEY(s) of the entity
                            else if (alter_table_key_sentence.toUpperCase().indexOf('FOREIGN KEY') > -1) {
                                // Getting foreign key(s)
                                if (Utils.getStringBetweenStrings(alter_table_key_sentence, 'FOREIGN KEY (', ')').indexOf(',') > -1) { // multiple foreign keys in the same ALTER TABLE sentence
                                    let fk_multiple = Utils.getStringBetweenStrings(alter_table_key_sentence, 'FOREIGN KEY (', ')').toUpperCase().split(',');  // split it in case there are multiple keys
                                    
                                    for (let i = 0; i < fk_multiple.length; i++) {  // removes whitespaces
                                        entity.fk_array.push(fk_multiple[i].trim().toUpperCase());
                                    }
                                } else {  // only one foreign key in the ALTER TABLE sentence
                                    let fk_single = Utils.getStringBetweenStrings(alter_table_key_sentence, 'FOREIGN KEY (', ')').toUpperCase();
                                    entity.fk_array.push(fk_single.toUpperCase());
                                }  
                            }
                            // END  -  Algorithm to know the FOREIGN KEY(s) of the entity
                        }
                    }

                    // There are some foreign key which are primary keys, in that case must identify them as:
                    // PK = Primary Key,  PF = Primary Foreign,  FK = Foreign Key
                    let pk_length = entity.pk_array.length, fk_length = entity.fk_array.length;
                    let key_type = '';  // possible values: (PK), (FK), (PF)           
                    
                    for (let i = 0; i < pk_length; i++) {
                        key_type = '(PK)';
                        for (let j = 0; j < fk_length; j++) {
                            if (entity.pk_array[i] == entity.fk_array[j]) {
                                key_type = '(PF)';  // it is a Primary Foreign key (PF)
                                entity.pk_array[i] = `${key_type}  ${entity.pk_array[i]}`;  // to indicate it is a Primary Foreign key (PF)
                                entity.fk_array[j] = '';  // to avoid showing duplicate value
                            }
                        }
                        // To indicate it is a Primary Key (PK)
                        if (key_type == '(PK)') {
                            entity.pk_array[i] = `${key_type}  ${entity.pk_array[i]}`;
                        }
                    }
                    // To indicate it is a Foreign Key (FK)
                    for (let k = 0; k < fk_length; k++) {
                        if (entity.fk_array[k] != null && entity.fk_array[k] != '') {
                            entity.fk_array[k] = `(FK)  ${entity.fk_array[k]}`;
                        }
                    }

                    entity.description = `This is the entity ${entity.name}`;  // <== OJO == replace for real description

                    // storing the new entity
                    entity_full_list.push(entity);


                    // PlantUML entities =========================================================================
                    plantumlCode = Oracle.plantuml_entity(plantumlCode, entity);
                    // PlantUML entities =========================================================================
                }
            }


            // START - Algorithm to know the RELATIONSHIPS between entities
            entity_full_list.forEach(entity => {
                for (const sql_sentence_aux of ddl_array_aux) {
                    if (sql_sentence_aux.toUpperCase().indexOf(`ALTER TABLE ${entity.name} `) > -1 &&  // asking if it's a sentence of type 'ALTER TABLE'
                        sql_sentence_aux.toUpperCase().indexOf('DROP') < 0 &&                          // making sure it's not a DROP type sentence
                        sql_sentence_aux.toUpperCase().indexOf('REFERENCES') > -1 ) {                  // asking if the sentence has the 'REFERENCES' SQL keyword
                            entity.entity_array.push(Utils.getStringBetweenStrings(sql_sentence_aux, 'REFERENCES', '(').toUpperCase());  // to store the relationships between the entities
                    }
                }
            });
            // END  -  Algorithm to know the RELATIONSHIPS between entities
            //
            //
            // START - Algorithm to know the CARDINALITIES between entities
            entity_full_list.forEach(entity => {
                if (entity.pk_array.length == 1 && entity.fk_array.length == 0 && entity.entity_array.length == 1) {

                }
            });
            // END  -  Algorithm to know the CARDINALITIES between entities


            // PlantUML relationships ====================================================================
            plantumlCode = Oracle.plantuml_relationship(plantumlCode, entity_full_list);
            // PlantUML relationships ====================================================================
            

            // @enduml ===================================================================================
            plantumlCode = Oracle.plantuml_end(plantumlCode);  // ending the definition of PlantUML syntax
            // @enduml ===================================================================================

            entity_full_list.forEach(entity => {
                console.log(`ENTITY count: ${entity_full_list.length}\n\n`);
                console.log(`ENTITY: ${entity.name}\n    ==>  ${entity.entity_array}`);
            });

            return plantumlCode;
        }
    }
};






