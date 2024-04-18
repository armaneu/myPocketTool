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
        plantumlCode += 'skinparam svgLinkTarget docframe\n';
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

        const _PK_ = '<color:blue>PK</color>';
        const _PF_ = '<color:blue>PF</color>';
        const mandatory = '<color:red>*</color>';  // to show a red asterisk
        const whitespace_1 = '<U+00A0>';           // to preserve a whitespace (NO-BREAK SPACE)
        const separator = '--\n';
        if (entity.name != null && entity.name.length > 0) {
            // Setting the ENTITY NAME
            plantumlCode += `entity ${entity.name} {\n`;  // entity name
            // Setting PRIMARY KEY(s)
            if (entity.pk_array != null && Array.isArray(entity.pk_array)) {
                for (const pk of entity.pk_array) {  // primary key(s)
                    if (pk != null && pk != '') {
                        if (UtilsSQL.isMandatory(pk, entity.columns_array)) {
                            plantumlCode += `${_PK_} ${mandatory} ${pk}\n`;
                        } else {
                            plantumlCode += `${_PK_}  ${whitespace_1}  ${pk}\n`;
                        }
                    }
                }
            }
            // Setting PRIMARY FOREIGN KEY(s)
            if (entity.pf_array != null && Array.isArray(entity.pf_array)) {
                for (const pf of entity.pf_array) {  // primary key(s)
                    if (pf != null && pf != '') {
                        if (UtilsSQL.isMandatory(pf, entity.columns_array)) {
                            plantumlCode += `${_PF_} ${mandatory} ${pf}\n`;
                        } else {
                            plantumlCode += `${_PF_}  ${whitespace_1}  ${pf}\n`;
                        }
                    }
                }
            }
            plantumlCode += `${separator}`;  // separator
            // Setting FOREIGN KEY(s)
            if (entity.fk_array != null && Array.isArray(entity.fk_array)) {
                for (const fk of entity.fk_array) {  // foreign key(s)
                    if (fk != null && fk != '') {
                        if (UtilsSQL.isMandatory(fk, entity.columns_array)) {
                            plantumlCode += `FK ${mandatory} ${fk}\n`;
                        } else {
                            plantumlCode += `FK  ${whitespace_1}  ${fk}\n`;
                        }
                    }
                }
            }
            plantumlCode += `${separator}`;  // separator
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
                            plantumlCode += `${entity.name} ${relation.cardinality} ${relation.master_entity_name}\n`;  // establishing the relationship
                        } else {
                            plantumlCode += `${entity.name} -- ${relation.master_entity_name}\n`;  // establishing the relationship
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
                    const table_name = UtilsSQL.getTableNameFromSchema(entity.name);
                    if (global_table_description_array != null && Array.isArray(global_table_description_array)) {
                        const table_description = global_table_description_array.find((table) => table.name.toUpperCase() === table_name);
                        console.log(`table_description ==>  ${table_description}`);
                        if (table_description != undefined) {
                            entity.description = `[[data/ListTables.html#${table_name}{click here for more details} ${table_description.description}]]`;
                        } else {
                            entity.description = `[[data/ListTables.html#${table_name}{click here for more details} No description]]`;
                        }  
                    } 
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
                                relation.master_entity_name = Utils.getStringBetweenStrings(sql_sentence_aux, 'REFERENCES', '(').toUpperCase();
                                let key_master_slave = Object.create(TKeyMasterSlave);    // creating the object of type TKeyMasterSlave to store the key pair
                                key_master_slave.key_master = Utils.getStringBetweenStrings(sql_sentence_aux, `REFERENCES ${relation.master_entity_name} (`, ')').toUpperCase();
                                key_master_slave.key_slave  = Utils.getStringBetweenStrings(sql_sentence_aux, 'FOREIGN KEY', ')').toUpperCase();
                                relation.keys_master_slave_array = new Array();
                                relation.keys_master_slave_array.push(key_master_slave);  // stores all master-slave key pairs between the entity
                                entity.relation_array.push(relation);                     // to store the relationships between the entities
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


            // Knowing the cardinalities among the entities
            let cardinalities = UtilsSQL.getCardinalities(entity_full_list);


            // PlantUML relationships ====================================================================
            plantumlCode = Oracle.plantuml_relationship(plantumlCode, cardinalities);
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






