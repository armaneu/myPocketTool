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
                        plantumlCode += `* (PK)  <color:red>*</color>  ${pk}\n`;
                    }
                }
            }
            // Setting PRIMARY FOREIGN KEY(s)
            if (entity.pf_array != null && Array.isArray(entity.pf_array)) {
                for (const pf of entity.pf_array) {  // primary key(s)
                    if (pf != null && pf != '') {
                        plantumlCode += `* (PF)  ${pf}\n`;
                    }
                }
            }
            plantumlCode += '--\n';  // separator
            // Setting FOREIGN KEY(s)
            if (entity.fk_array != null && Array.isArray(entity.fk_array)) {
                for (const fk of entity.fk_array) {  // foreign key(s)
                    if (fk != null && fk != '') {
                        plantumlCode += `* (FK)  ${fk}\n`;
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
                if (entity.relation_array != null && Array.isArray(entity.relation_array) && entity.relation_array.length > 0) {
                    entity.relation_array.forEach(relation => {
                        if (relation.cardinality != null && relation.cardinality != '') {
                            plantumlCode += `${entity.name} ${relation.cardinality} ${relation.master_entity}\n`;  // establishing the relationship
                        } else {
                            plantumlCode += `${entity.name} -- ${relation.master_entity}\n`;  // establishing the relationship
                        }
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
            

            let entity_full_list = new Array();  // creating a list to store all the entities that will be found
            for (const sql_sentence of ddl_array) {
                console.log(sql_sentence);

                // Getting the entity names and their primary and foreign keys
                if (sql_sentence.toUpperCase().indexOf('CREATE TABLE') > -1 &&      // asking if it is a sentence of type  'CREATE TABLE'
                    sql_sentence.indexOf('(') > -1 &&                               // looking for the first occurrence of '('
                    sql_sentence.split('').reverse().join('').indexOf(')') > -1) {  // looking for the last occurrence of  ')'
                    
                    // START - Algorithm to know the ENTITY NAME of 'CREATE TABLE'
                    const entity = Object.create(TEntity);  // creating the object of type TEntity
                    entity.name = Utils.getStringBetweenStrings(sql_sentence, 'CREATE TABLE', '(').toUpperCase();
                    entity.description = `This is the entity ${entity.name}`;  // <== OJO == replace for real description
                    entity.columns_array = UtilsSQL.getColumnArray(sql_sentence);  // to store all the entity's column
                    entity.pk_array = new Array();        // to store the primary key(s)
                    entity.pf_array = new Array();        // to store the primary foreign key(s)
                    entity.fk_array = new Array();        // to store the foreign key(s)
                    entity.sql_array = new Array();       // to store the CREATE TABLE, ALTER TABLE sql instructions
                    const create_table_sentence = sql_sentence.split(' ').filter(word => word !== '').join(' ');  // ensure that words are separated only by whitespace
                    entity.sql_array.push(create_table_sentence);  // storing the CREATE TABLE sql instruction
                    entity.relation_array = new Array();  // to store the related entities


                    entity.columns_array.forEach(column => {
                        console.log(`TColumn ==> ${column.name} | ${column.data_type} | ${column.mandatory}`);
                    });
                    // END  -  Algorithm to know the ENTITY NAME of 'CREATE TABLE'
                    //
                    //
                    // START - Algorithm to know the PRIMARY KEY(s) and/or FOREIGN KEY(s) of the entity
                    for (const sql_sentence_aux of ddl_array_aux) {
                        // 'ALTER TABLE' type sentences
                        const alter_table_sentence = sql_sentence_aux.split(' ').filter(word => word !== '').join(' ');  // ensure that words are separated only by whitespace
                        if (alter_table_sentence.toUpperCase().indexOf(`ALTER TABLE ${entity.name} `) > -1 &&  // asking if it's a sentence of type 'ALTER TABLE'
                            alter_table_sentence.toUpperCase().indexOf('DROP') < 0) {                          // making sure it's not a DROP type sentence
                            
                            entity.sql_array.push(alter_table_sentence);  // storing the ALTER TABLE sql instruction

                            // START - Algorithm to know the PRIMARY KEY(s) of the entity
                            if (alter_table_sentence.toUpperCase().indexOf('PRIMARY KEY') > -1) {
                                let pk_string = Utils.getStringBetweenStrings(alter_table_sentence, 'PRIMARY KEY', ')').toUpperCase();
                                let pk_array = Utils.getStringArrayBetweenComma(pk_string);
                                pk_array.forEach(pk => {
                                    entity.pk_array.push(pk);
                                });
                            }
                            // END  -  Algorithm to know the PRIMARY KEY(s) of the entity
                            //
                            // START - Algorithm to know the FOREIGN KEY(s) of the entity
                            else if (alter_table_sentence.toUpperCase().indexOf('FOREIGN KEY') > -1) {
                                let fk_string = Utils.getStringBetweenStrings(alter_table_sentence, 'FOREIGN KEY', ')').toUpperCase();
                                let fk_array = Utils.getStringArrayBetweenComma(fk_string);
                                fk_array.forEach(fk => {
                                    entity.fk_array.push(fk);
                                }); 

                                // START - Algorithm to know the relationships of the entity
                                const relation = Object.create(TRelation);  // creating the object of type TRelation
                                relation.master_entity = Utils.getStringBetweenStrings(sql_sentence_aux, 'REFERENCES', '(').toUpperCase();
                                entity.relation_array.push(relation);  // to store the relationships between the entities
                                // END   - Algorithm to know the relationships of the entity
                            }
                            // END  -  Algorithm to know the FOREIGN KEY(s) of the entity
                        }
                    }

                    // There are some foreign key which are primary keys, in that case must identify them as:
                    // PK = Primary Key,  PF = Primary Foreign,  FK = Foreign Key
                    let pk_length = entity.pk_array.length, fk_length = entity.fk_array.length;                    
                    for (let i = 0; i < pk_length; i++) {
                        for (let j = 0; j < fk_length; j++) {
                            if ((entity.pk_array[i] != '' && entity.fk_array[j] != '') && (entity.pk_array[i] == entity.fk_array[j])) {
                                entity.pf_array.push(entity.fk_array[j]);  // assigning to the array for primary foreign keys
                                
                                entity.pk_array.splice(i, 1);  // to avoid showing duplicate value
                                pk_length--;  // decrementing {length} in one
                                i--;          // decrementing index {i} in one
                                entity.fk_array.splice(j, 1);  // to avoid showing duplicate value
                                fk_length--;  // decrementing {length} in one
                                j--;          // decrementing index {j} in one
                            }
                        }
                    }
                    

                    // Storing the new entity
                    entity_full_list.push(entity);


                    // PlantUML entities =========================================================================
                    plantumlCode = Oracle.plantuml_entity(plantumlCode, entity);
                    // PlantUML entities =========================================================================
                }
            }


            // START - Algorithm to know the CARDINALITIES between entities
            entity_full_list.forEach(entity => {
                if (entity.pk_array.length == 0 && entity.pf_array.length == 1 && entity.fk_array.length == 0 && entity.relation_array.length == 1) {
                    entity.relation_array[0].cardinality = `"${_1_1_.uml}" -- "${_1_1_.uml}"`;
                }
            });
            // END  -  Algorithm to know the CARDINALITIES between entities


            // PlantUML relationships ====================================================================
            plantumlCode = Oracle.plantuml_relationship(plantumlCode, entity_full_list);
            // PlantUML relationships ====================================================================
            

            // @enduml ===================================================================================
            plantumlCode = Oracle.plantuml_end(plantumlCode);  // ending the definition of PlantUML syntax
            // @enduml ===================================================================================






            // CONSOLE LOGS FOR TESTING
            entity_full_list.forEach(entity => {
                console.log(`ENTITY count: ${entity_full_list.length}\n\n`);
                console.log(`ENTITY: ${entity.name}\n    ==>  ${entity.relation_array}`);
                
                entity.sql_array.forEach(sql => {
                    console.log(`SQL: ${sql}`);
                });
            });

            console.log('getStringArrayBetweenComma RESULT:')
            let arr = Utils.getStringArrayBetweenComma('( ebj_benutzerk1, ebj_datum, ebj_snr )');
            console.log(arr);
            arr = Utils.getStringArrayBetweenComma('( ebj_benutzerk1 )');
            console.log(arr);





            return plantumlCode;
        }
    },
};






